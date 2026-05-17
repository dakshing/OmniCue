# OmniCue

OmniCue is a Google Meet add-on prototype for a voice-triggered meeting assistant.

V0 implements a Meet side panel, an optional main-stage echo board, and a gated voice-trigger flow for the wake phrase `Hey OmniCue`. Real Google Meet media capture is intentionally behind configuration because Meet Media API access requires Developer Preview eligibility and restricted OAuth scopes.

## Routes

- `/sidepanel/` - private Meet side-panel control surface.
- `/mainstage/` - shared echo board opened with `startActivity()`.

## Local Setup

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/sidepanel/`
- `http://localhost:3000/mainstage/`

When the app is not running inside Google Meet, the SDK initialization shows a local/demo status instead of crashing.

## Environment

Copy `.env.example` to `.env.local` for local development.

```bash
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_NUMBER=
NEXT_PUBLIC_MAIN_STAGE_URL=http://localhost:3000/mainstage/
NEXT_PUBLIC_WAKE_PHRASE=Hey OmniCue
NEXT_PUBLIC_ENABLE_MEET_MEDIA=false
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=
```

## Firebase Hosting

The app is configured for a static Next.js export.

```bash
npm run build
firebase deploy
```

After deploying, update `deployment.json` with your Firebase Hosting URLs and create the Google Workspace Marketplace SDK HTTP deployment.

## Google Setup Notes

1. Enable Google Workspace Marketplace SDK.
2. Enable Google Workspace Add-ons API.
3. Create a Meet add-on HTTP deployment using `deployment.json`.
4. Install the test deployment for your signed-in Google user.
5. Enable Meet REST API and OAuth only when you are ready to work on the gated Meet Media API path.
