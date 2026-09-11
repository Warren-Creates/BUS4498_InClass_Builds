## 1. Workflow Overview

### 1.1 Workflow Goal

This workflow supports the system goal defined in `my_first_agent/README.md`.

### 1.2 Workflow Trigger

The workflow starts when a Cal Poly Vibe Coding Club organizer requests an attendance-planning run after registration data is available, or when an organizer-approved planning schedule starts the same bounded run.

### 1.3 Completion Condition at Runtime

The workflow is complete when the organizer can review an event-specific attendance forecast range, a food, drink, and swag recommendation, the supporting data and uncertainties, and a stored run summary. Completion does not mean that the system contacted participants or purchased supplies.

### 1.4 General Workflow

On the normal path, the system loads only organizer-authorized registration records, voluntary confirmation data, prior event attendance information, and the available budget and supply constraints. It validates the information for missing or conflicting values, summarizes registrations and confirmations, creates an attendance forecast range, and turns that range into a recommendation for food, drinks, and swag. It then presents the forecast, assumptions, uncertainties, and recommendation to an organizer for review before storing the run summary.

If needed information is missing, stale, or inconsistent, the system asks an organizer to clarify or update the information and waits rather than guessing. If the organizer rejects or revises the assumptions, the system updates the authorized inputs and recalculates the forecast. Human review is required before any recommendation is used; the system may not send participant messages, make purchases, or treat its forecast as guaranteed.

### 1.5 Workflow Diagram

```mermaid
flowchart TD
    S([Run starts]) --> T1["T1: Load authorized event data"]
    T1 --> T2["T2: Validate event data"]
    T2 --> D1{"Data complete and consistent?"}
    D1 -->|Yes| T3["T3: Summarize registrations and confirmations"]
    D1 -->|No| H1["H1: Request organizer clarification"]
    H1 --> D2{"Organizer provides approved update?"}
    D2 -->|Yes| T1
    D2 -->|No| C0([Stop: Awaiting organizer])
    T3 --> T4["T4: Calculate attendance forecast"]
    T4 --> T5["T5: Recommend supplies"]
    T5 --> H2["H2: Present forecast for organizer review"]
    H2 --> D3{"Organizer approves assumptions and recommendation?"}
    D3 -->|Yes| T6["T6: Store run summary"]
    D3 -->|No| H3["H3: Revise authorized inputs"]
    H3 --> T4
    T6 --> C1([C1: Run complete])
