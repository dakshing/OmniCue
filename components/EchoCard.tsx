import { Radio, Sparkles } from "lucide-react";
import type { EchoEvent } from "@/lib/echo";
import { formatEchoTime } from "@/lib/echo";

type EchoCardProps = {
  event: EchoEvent;
  compact?: boolean;
};

export function EchoCard({ event, compact = false }: EchoCardProps) {
  return (
    <article className={compact ? "echo-card echo-card-compact" : "echo-card"}>
      <div className="echo-card-header">
        <span className="echo-source">
          <Radio aria-hidden="true" size={15} />
          {event.source}
        </span>
        <time dateTime={event.timestamp}>{formatEchoTime(event.timestamp)}</time>
      </div>
      <div className="echo-cue">
        <Sparkles aria-hidden="true" size={18} />
        <span>{event.cue}</span>
      </div>
      {event.heardText ? <p className="echo-heard">{event.heardText}</p> : null}
      <p className="echo-response">{event.response}</p>
    </article>
  );
}
