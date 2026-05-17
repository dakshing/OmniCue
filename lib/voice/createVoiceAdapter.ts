import { ENABLE_MEET_MEDIA } from "@/lib/config";
import { LocalSpeechEchoAdapter } from "@/lib/voice/localSpeechAdapter";
import { MediaApiGatedAdapter } from "@/lib/voice/mediaApiGatedAdapter";
import type { VoiceAdapter } from "@/lib/voice/types";

export function createVoiceAdapter(): VoiceAdapter {
  if (ENABLE_MEET_MEDIA) {
    return new MediaApiGatedAdapter();
  }

  return new LocalSpeechEchoAdapter();
}
