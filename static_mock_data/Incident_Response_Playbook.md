# P1 Incident Response Playbook

## Definition of a P1 (Priority 1) Incident
A P1 incident is defined as a total system outage or severe degradation affecting more than 10% of our customer base, or any critical security breach involving customer data.

## Incident Command Structure
- **Incident Commander (IC)**: The individual driving the resolution, coordinating communication, and making executive decisions.
- **Communications Lead (CommZ)**: Responsible for updating the public status page and drafting customer emails.
- **Operations Lead (Ops)**: The primary engineer(s) investigating logs, metrics, and applying fixes.

## Step-by-Step Response Flow
1. **Declare the Incident**: Any employee can declare an incident using the `/incident` command in Slack. This automatically pages the on-call IC.
2. **Establish the War Room**: A dedicated Zoom link and Slack channel (e.g., `#inc-2026-05-database-outage`) will be automatically created. All communication must happen here.
3. **Initial Assessment (T+10 mins)**: The Ops Lead assesses the scope and impact. The CommZ updates the status page to "Investigating".
4. **Mitigation (T+30 mins)**: Focus on stopping the bleeding. Roll back recent deployments, scale up infrastructure, or block malicious IP addresses. **Do not focus on the root cause yet.**
5. **Resolution**: Once service is restored, monitor metrics for 15 minutes to confirm stability. Update the status page to "Resolved".
6. **Post-Mortem**: Within 48 hours, the IC must schedule a blameless post-mortem meeting and complete the Root Cause Analysis (RCA) document.
