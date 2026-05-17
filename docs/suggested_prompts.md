# Suggested OmniCue Prompts

These prompts are designed to be spoken naturally during a simulated Zoom call. They map directly to the semantic content and keywords present in the `static_mock_data` documents. OmniCue's speech recognition should pick these up, recognize the information-gathering intent, and query the Elasticsearch database to retrieve the matching document.

### 1. The "Golden Path" Validation (Maps to `Q2_Release_Plan.md`)
> *"Hey team, we need to quickly verify our engineering timeline before the client check-in. Can someone double-check when the exact **code freeze date is scheduled** for our upcoming **Q2 launch roadmap**?"*

### 2. The Customer Success Question (Maps to `Enterprise_SLA_Tiers.md`)
> *"We're pitching to a huge Fortune 500 prospect later today. If they ask about reliability, what is our guaranteed **uptime for the Enterprise tier SLA**?"*

### 3. The Engineering Architecture Sync (Maps to `Database_Migration_Strategy.md`)
> *"Before we prioritize these new backend tickets, wait, when are we actually scheduling the **downtime and cutover** from **MongoDB to PostgreSQL** for the Q3 migration?"*

### 4. The Partner Integration Query (Maps to `API_V3_Deprecation_Notice.md`)
> *"One of our legacy integrators just emailed support. Does anyone remember what date the **legacy API v3 is going to be completely shut down** and forced to GraphQL?"*

### 5. The Security & Compliance Audit (Maps to `Security_Compliance_SOC2.md`)
> *"If an enterprise prospect in Europe asks about data residency and GDPR, where are our **EU databases physically located** or isolated?"*

### 6. The Emergency Protocol (Maps to `Incident_Response_Playbook.md`)
> *"It looks like the billing service is completely down affecting a ton of users. How do we officially **declare a P1 incident** to page the on-call commander?"*

### 7. The HR & Management Task (Maps to `Employee_Onboarding_Handbook.md`)
> *"I have a new engineer joining my pod next Monday. Does anyone know what the approved **hardware budget** is so they can expense a new MacBook Pro?"*
