import { createEchoEvent } from "@/lib/echo";
import type { VoiceAdapter, VoiceAdapterOptions } from "@/lib/voice/types";

type SpeechRecognitionAlternativeLike = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResultLike = {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternativeLike;
  [index: number]: SpeechRecognitionAlternativeLike;
};

type SpeechRecognitionResultListLike = {
  readonly length: number;
  item(index: number): SpeechRecognitionResultLike;
  [index: number]: SpeechRecognitionResultLike;
};

type SpeechRecognitionEventLike = Event & {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLike;
};

type SpeechRecognitionErrorEventLike = Event & {
  readonly error?: string;
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export class LocalSpeechEchoAdapter implements VoiceAdapter {
  private active = false;
  private lastTriggerAt = 0;
  private recognition: SpeechRecognitionLike | null = null;

  start(options: VoiceAdapterOptions) {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      options.onStatus({
        status: "error",
        detail: "Browser speech recognition is unavailable. Use push-to-call."
      });
      return;
    }

    this.stop();
    this.active = true;

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const wakePhrase = normalize(options.wakePhrase);

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const alternative = result[0] || result.item(0);
        const transcript = alternative?.transcript || "";

        if (!transcript) {
          continue;
        }

        if (normalize(transcript).includes(wakePhrase)) {
          const now = Date.now();

          if (now - this.lastTriggerAt < 2500) {
            continue;
          }

          this.lastTriggerAt = now;
          options.onTrigger(
            createEchoEvent({
              cue: options.wakePhrase,
              source: "voice",
              heardText: transcript.trim()
            })
          );
          options.onStatus({
            status: "triggered",
            detail: `Heard ${options.wakePhrase}`
          });

          window.setTimeout(() => {
            if (this.active) {
              options.onStatus({
                status: "listening",
                detail: `Listening for ${options.wakePhrase}`
              });
            }
          }, 1200);
        }
      }
    };

    recognition.onerror = (event) => {
      const error = event.error || "speech-recognition-error";
      options.onStatus({
        status: "error",
        detail: `Voice listener stopped: ${error}. Use push-to-call.`
      });
    };

    recognition.onend = () => {
      if (!this.active) {
        return;
      }

      window.setTimeout(() => {
        try {
          recognition.start();
        } catch {
          options.onStatus({
            status: "error",
            detail: "Voice listener could not restart. Use push-to-call."
          });
        }
      }, 400);
    };

    this.recognition = recognition;

    try {
      recognition.start();
      options.onStatus({
        status: "listening",
        detail: `Listening for ${options.wakePhrase}`
      });
    } catch {
      options.onStatus({
        status: "error",
        detail: "Voice listener could not start. Use push-to-call."
      });
    }
  }

  stop() {
    this.active = false;

    if (!this.recognition) {
      return;
    }

    this.recognition.onend = null;
    this.recognition.onerror = null;
    this.recognition.onresult = null;

    try {
      this.recognition.stop();
    } catch {
      this.recognition.abort();
    }

    this.recognition = null;
  }
}
