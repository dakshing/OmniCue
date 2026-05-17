"use client";

import type { MeetSidePanelClient } from "@googleworkspace/meet-addons/meet.addons";
import {
  ExternalLink,
  Mic,
  MicOff,
  PanelTopOpen,
  Radio,
  Volume2
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EchoCard } from "@/components/EchoCard";
import { StatusPill } from "@/components/StatusPill";
import {
  GOOGLE_CLOUD_PROJECT_NUMBER,
  WAKE_PHRASE,
  getMainStageUrl,
  hasMeetSdkConfig
} from "@/lib/config";
import { createEchoEvent, stringifyEchoPayload, type EchoEvent } from "@/lib/echo";
import { createVoiceAdapter } from "@/lib/voice/createVoiceAdapter";
import type {
  VoiceAdapter,
  VoiceStatus,
  VoiceStatusUpdate
} from "@/lib/voice/types";

type SdkState = {
  state: "checking" | "ready" | "local" | "config" | "error";
  detail: string;
};

const voiceLabel: Record<VoiceStatus, string> = {
  idle: "Idle",
  listening: "Listening",
  triggered: "Triggered",
  "media-gated": "Media API gated",
  error: "Error"
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export function SidePanelClient() {
  const sidePanelClientRef = useRef<MeetSidePanelClient | null>(null);
  const voiceAdapterRef = useRef<VoiceAdapter | null>(null);

  const [sdkState, setSdkState] = useState<SdkState>({
    state: "checking",
    detail: "Preparing Meet add-on session"
  });
  const [enabled, setEnabled] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceStatusUpdate>({
    status: "idle",
    detail: `Ready for ${WAKE_PHRASE}`
  });
  const [lastEcho, setLastEcho] = useState<EchoEvent | null>(null);
  const isMeetReady = sdkState.state === "ready";

  useEffect(() => {
    let cancelled = false;

    async function initializeMeetAddon() {
      if (!hasMeetSdkConfig()) {
        setSdkState({
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
        const client = await session.createSidePanelClient();

        if (cancelled) {
          return;
        }

        sidePanelClientRef.current = client;
        setSdkState({
          state: "ready",
          detail: "Connected to Google Meet"
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSdkState({
          state: "local",
          detail: `Local/demo mode: ${getErrorMessage(error)}`
        });
      }
    }

    initializeMeetAddon();

    return () => {
      cancelled = true;
      sidePanelClientRef.current = null;
    };
  }, []);

  const publishEcho = useCallback(async (event: EchoEvent) => {
    setLastEcho(event);

    if (!sidePanelClientRef.current) {
      return;
    }

    try {
      await sidePanelClientRef.current.notifyMainStage(stringifyEchoPayload(event));
    } catch (error) {
      setSdkState({
        state: "error",
        detail: `Echo board sync failed: ${getErrorMessage(error)}`
      });
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const adapter = createVoiceAdapter();
    voiceAdapterRef.current = adapter;
    adapter.start({
      wakePhrase: WAKE_PHRASE,
      onStatus: setVoiceState,
      onTrigger: publishEcho
    });

    return () => {
      adapter.stop();
    };
  }, [enabled, publishEcho]);

  function toggleOmniCue() {
    if (enabled) {
      voiceAdapterRef.current?.stop();
      voiceAdapterRef.current = null;
      setVoiceState({
        status: "idle",
        detail: `Ready for ${WAKE_PHRASE}`
      });
      setEnabled(false);
      return;
    }

    setEnabled(true);
  }

  async function openMainStage() {
    const mainStageUrl = getMainStageUrl();

    if (!sidePanelClientRef.current) {
      window.open("/mainstage/", "_blank", "noopener,noreferrer");
      return;
    }

    try {
      await sidePanelClientRef.current.startActivity({
        mainStageUrl
      });
    } catch (error) {
      setSdkState({
        state: "error",
        detail: `Could not open main stage: ${getErrorMessage(error)}`
      });
    }
  }

  function triggerEchoManually() {
    publishEcho(
      createEchoEvent({
        cue: WAKE_PHRASE,
        source: "manual"
      })
    );
    setVoiceState({
      status: "triggered",
      detail: `Manual cue sent for ${WAKE_PHRASE}`
    });
  }

  return (
    <main className="sidepanel-shell">
      <header className="panel-title">
        <div className="logo-lockup">
          <Image src="/omnicue-logo.svg" alt="" width={36} height={36} priority />
          <div>
            <p className="eyebrow">OmniCue</p>
            <h1>Echo Bot</h1>
          </div>
        </div>
        <StatusPill status={voiceState.status} label={voiceLabel[voiceState.status]} />
      </header>

      <section className="control-panel" aria-label="OmniCue controls">
        <div className="toggle-row">
          <div className="toggle-copy">
            <strong>Enable OmniCue</strong>
            <span>{WAKE_PHRASE}</span>
          </div>
          <button
            aria-label={enabled ? "Disable OmniCue" : "Enable OmniCue"}
            aria-pressed={enabled}
            className={enabled ? "switch is-on" : "switch"}
            onClick={toggleOmniCue}
            type="button"
          >
            <span />
          </button>
        </div>

        <div className="status-row">
          <StatusPill status={voiceState.status} label={voiceLabel[voiceState.status]} />
          <span className={`status-pill status-${isMeetReady ? "triggered" : "idle"}`}>
            <Radio aria-hidden="true" size={14} />
            {isMeetReady ? "Meet ready" : "Demo mode"}
          </span>
        </div>

        <p className="detail-text">{voiceState.detail}</p>

        <div className="action-grid">
          <button className="primary-button" onClick={triggerEchoManually} type="button">
            <Volume2 aria-hidden="true" size={18} />
            Push to Call
          </button>
          <button className="secondary-button" onClick={openMainStage} type="button">
            {isMeetReady ? (
              <PanelTopOpen aria-hidden="true" size={18} />
            ) : (
              <ExternalLink aria-hidden="true" size={18} />
            )}
            Echo Board
          </button>
        </div>
      </section>

      <section className="setup-panel" aria-label="Meet SDK status">
        <h2>Session</h2>
        <p>{sdkState.detail}</p>
      </section>

      {lastEcho ? (
        <EchoCard event={lastEcho} compact />
      ) : (
        <div className="empty-state">
          {enabled ? <Mic aria-hidden="true" size={20} /> : <MicOff aria-hidden="true" size={20} />}
          <p>No echo yet</p>
        </div>
      )}
    </main>
  );
}
