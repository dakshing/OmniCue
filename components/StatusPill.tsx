import { AlertCircle, CheckCircle2, CircleDot, Lock, Radio } from "lucide-react";
import type { VoiceStatus } from "@/lib/voice/types";

type StatusPillProps = {
  status: VoiceStatus;
  label: string;
};

const statusIcon = {
  idle: CircleDot,
  listening: Radio,
  triggered: CheckCircle2,
  "media-gated": Lock,
  error: AlertCircle
};

export function StatusPill({ status, label }: StatusPillProps) {
  const Icon = statusIcon[status];

  return (
    <span className={`status-pill status-${status}`}>
      <Icon aria-hidden="true" size={14} />
      {label}
    </span>
  );
}
