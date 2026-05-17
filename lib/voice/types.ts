import type { EchoEvent } from "@/lib/echo";

export type VoiceStatus =
  | "idle"
  | "listening"
  | "triggered"
  | "media-gated"
  | "error";

export type VoiceStatusUpdate = {
  status: VoiceStatus;
  detail: string;
};

export type VoiceAdapterOptions = {
  wakePhrase: string;
  onStatus: (update: VoiceStatusUpdate) => void;
  onTrigger: (event: EchoEvent) => void;
};

export type VoiceAdapter = {
  start: (options: VoiceAdapterOptions) => void;
  stop: () => void;
};
