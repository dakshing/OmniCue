"use client";

import type { FrameToFrameMessage } from "@googleworkspace/meet-addons/meet.addons";
import { RadioTower } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EchoCard } from "@/components/EchoCard";
import { StatusPill } from "@/components/StatusPill";
import {
  GOOGLE_CLOUD_PROJECT_NUMBER,
  WAKE_PHRASE,
  hasMeetSdkConfig
} from "@/lib/config";
import type { EchoEvent } from "@/lib/echo";
import { parseEchoPayload } from "@/lib/echo";

type StageState = {
  state: "checking" | "ready" | "local" | "config" | "error";
  detail: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export function MainStageClient() {
  const [stageState, setStageState] = useState<StageState>({
    state: "checking",
    detail: "Preparing echo board"
  });
  const [events, setEvents] = useState<EchoEvent[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function initializeMeetAddon() {
      if (!hasMeetSdkConfig()) {
        setStageState({
          state: "config",
          detail:
            "Set NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_NUMBER before installing in Meet."
        });
        return;
      }

      try {
        const { meet } = await import("@googleworkspace/meet-addons/meet.addons");
        const session = await meet.addon.createAddonSession({
          cloudProjectNumber: GOOGLE_CLOUD_PROJECT_NUMBER
        });
        const client = await session.createMainStageClient();

        if (cancelled) {
          return;
        }

        client.on("frameToFrameMessage", (message: FrameToFrameMessage) => {
          const event = parseEchoPayload(message.payload);

          if (!event) {
            return;
          }

          setEvents((current) => [event, ...current].slice(0, 8));
        });

        setStageState({
          state: "ready",
          detail: "Connected to Google Meet"
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStageState({
          state: "local",
          detail: `Local/demo mode: ${getErrorMessage(error)}`
        });
      }
    }

    initializeMeetAddon();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mainstage-shell">
      <header className="stage-title">
        <div className="logo-lockup">
          <Image src="/omnicue-logo.svg" alt="" width={44} height={44} priority />
          <div>
            <p className="eyebrow">Shared activity</p>
            <h1>OmniCue Echo Board</h1>
          </div>
        </div>
        <StatusPill
          status={stageState.state === "ready" ? "triggered" : "idle"}
          label={stageState.state === "ready" ? "Meet ready" : "Demo mode"}
        />
      </header>

      <section className="stage-board" aria-label="OmniCue echo events">
        <div className="meet-note">
          <strong>{WAKE_PHRASE}</strong>
          <span> · {stageState.detail}</span>
        </div>

        {events.length > 0 ? (
          <div className="event-list">
            {events.map((event) => (
              <EchoCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <RadioTower aria-hidden="true" size={24} />
            <p>Waiting for an echo</p>
          </div>
        )}
      </section>
    </main>
  );
}
