import type { VoiceAdapter, VoiceAdapterOptions } from "@/lib/voice/types";

export class MediaApiGatedAdapter implements VoiceAdapter {
  start(options: VoiceAdapterOptions) {
    options.onStatus({
      status: "media-gated",
      detail:
        "Meet Media API voice capture is gated. Disable the media flag or complete OAuth and Developer Preview setup."
    });
  }

  stop() {
    return;
  }
}
