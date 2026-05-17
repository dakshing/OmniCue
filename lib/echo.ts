export type EchoSource = "manual" | "voice" | "media";

export type EchoEvent = {
  id: string;
  cue: string;
  source: EchoSource;
  timestamp: string;
  heardText?: string;
  response: string;
};

type EchoEventInput = {
  cue: string;
  source: EchoSource;
  heardText?: string;
};

export function createEchoEvent({
  cue,
  source,
  heardText
}: EchoEventInput): EchoEvent {
  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    cue,
    source,
    timestamp,
    heardText,
    response: `Echo received: ${cue}. OmniCue is standing by for the next context request.`
  };
}

export function formatEchoTime(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(timestamp));
}

export function parseEchoPayload(payload: string): EchoEvent | null {
  try {
    const parsed = JSON.parse(payload) as { type?: string; event?: EchoEvent };

    if (parsed.type !== "omnicue.echo" || !parsed.event) {
      return null;
    }

    return parsed.event;
  } catch {
    return null;
  }
}

export function stringifyEchoPayload(event: EchoEvent) {
  return JSON.stringify({
    type: "omnicue.echo",
    event
  });
}
