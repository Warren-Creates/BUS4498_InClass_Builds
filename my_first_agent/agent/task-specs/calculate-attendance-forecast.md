# Calculate attendance forecast Task Specification

```yaml
# BASIC INFORMATION
task_id: "T4"
task_name: "Calculate attendance forecast"
task_owner: "Cal Poly Vibe Coding Club organizer"

# Agent Inference Configuration
Provider: Groq
Model: "openai/gpt-oss-20b"
Role: "Assess data reliability, compare authorized attendance signals, and draft a bounded forecast explanation with stated uncertainty; never approve assumptions, contact participants, or make purchases."
Maximum inference requests per task run: 4
On inference failure or exhausted limits: "Record the unresolved status and hand the case to the Cal Poly Vibe Coding Club organizer."
```

## 1. Task Goal

- **Objective:** Produce an event-specific, evidence-supported attendance forecast range that an organizer can review when planning food, drinks, and swag. The forecast is planning support, not a guarantee or a purchasing decision.

## 2. Inbound Inputs

### Input 1

- **Input name:** Validated event data
- **What it contains:** Organizer-authorized registration records, voluntary confirmation data, prior event attendance information, and the outcome of completeness and consistency checks.
- **Source:** T2: Validate event data.

### Input 2

- **Input name:** Registration and confirmation summary
- **What it contains:** Aggregate registration and voluntary-confirmation counts, data dates, and documented uncertainty from the validated data.
- **Source:** T3: Summarize registrations and confirmations.

### Input 3

- **Input name:** Organizer-approved forecasting assumptions
- **What it contains:** Comparable-event selection, approved range method, and any documented adjustment or constraint.
- **Source:** The planning-run request or H3: Revise authorized inputs.

## 3. Tool Permissions and Boundaries

### Task-Wide Limits

- **Total task timeout:** 8 minutes, including tool calls, retries, waiting, and inference requests.
- **Maximum tool calls:** 5 total across all planned tools. Retries count toward this total.

### Tool 1

- **Tool name:** **retrieve validated event summary**
- **Input:** Validated event data
- **Output:** Current event-data readiness record
- **Implementation Route:** Read-only database query or approved file retrieval
- **Integration approach:** Direct integration with the organizer-approved registration and confirmation data source
- **Role in this task:** Supports the permitted subtask **assess input reliability** by confirming event identity, source timestamps, and aggregate counts.
- **Task timeout:** 45 seconds
- **Maximum retries:** 1
- **Retry only when:** A transient read timeout or temporary source-availability error occurs. The retry reuses the same event and run ID; because retrieval is read-only, it creates no duplicate records.
- **On timeout, exhausted retries, or a non-retryable error:** Record the failed source and timestamp in an unresolved-status record and hand the case to the Cal Poly Vibe Coding Club organizer. Do not calculate a forecast.

### Tool 2

- **Tool name:** **retrieve historical attendance summary**
- **Input:** Validated event data
- **Output:** Comparable historical-attendance summary
- **Implementation Route:** Read-only database query or approved spreadsheet retrieval
- **Integration approach:** Direct integration with the organizer-approved historical-attendance source
- **Role in this task:** Supports the permitted subtask **compare attendance signals** by retrieving only aggregate outcomes from comparable prior events.
- **Task timeout:** 45 seconds
- **Maximum retries:** 1
- **Retry only when:** A transient source error occurs and the same comparable-event criteria can be reused. The read-only retry creates no duplicate records.
- **On timeout, exhausted retries, or a non-retryable error:** Record the missing historical evidence and hand the case to the Cal Poly Vibe Coding Club organizer for an approved assumption or stop decision.

### Tool 3

- **Tool name:** **calculate forecast range**
- **Input:** Registration and confirmation summary; comparable historical-attendance summary; organizer-approved forecasting assumptions
- **Output:** Forecast calculation draft with low, central, and high estimates
- **Implementation Route:** Versioned analytics function or transparent spreadsheet calculation
- **Integration approach:** Direct integration with the task's read-only aggregate inputs; the calculation is tied to one event and run ID
- **Role in this task:** Supports the permitted subtask **calculate forecast range** using stated assumptions and aggregate evidence.
- **Task timeout:** 90 seconds
- **Maximum retries:** 1
- **Retry only when:** A transient calculation failure occurs and all input and assumption versions are unchanged. A retry replaces the same run's draft rather than creating a second forecast.
- **On timeout, exhausted retries, or a non-retryable error:** Record the failed calculation and input versions, then hand the case to the Cal Poly Vibe Coding Club organizer. Do not send a recommendation to T5 or H2.

### Tool 4

- **Tool name:** **draft uncertainty explanation**
- **Input:** Forecast calculation draft and evidence summary
- **Output:** Plain-language uncertainty and assumptions explanation
- **Implementation Route:** Groq chat-completions API using `openai/gpt-oss-20b`
- **Integration approach:** Direct integration; the model receives only the task's approved aggregate inputs and cannot call external tools, contact participants, or change records
- **Role in this task:** Supports the permitted subtasks **assess input reliability** and **compare attendance signals** by drafting a reviewable explanation; the organizer remains the decision-maker.
- **Task timeout:** 90 seconds
- **Maximum retries:** 1, subject to the four-request inference limit
- **Retry only when:** A transient provider error or rate-limit response occurs and the remaining task time and inference limit permit one retry. The retry uses the same run ID and replaces the draft explanation, avoiding duplicate records or messages.
- **On timeout, exhausted retries, or a non-retryable error:** Record the unresolved inference status and hand the case to the Cal Poly Vibe Coding Club organizer. The calculation may be shown without a generated narrative only if the organizer chooses to review it.

## 4. How the Agent Should Reason

### Permitted Subtask 1

- **Subtask name:** Assess input reliability
- **Subtask description:** Examine the authorized event data and summary for missing values, stale information, conflicting counts, or limited historical relevance; produce a finding about whether the available evidence can support a forecast.
- **Subtask boundary:** May assess only the organizer-authorized inputs supplied by T2 and T3. It may not contact participants, obtain new data, or change any input.
- **Retry limits:** One additional assessment only after an organizer-approved input revision; otherwise hand off if reliability remains insufficient.

### Permitted Subtask 2

- **Subtask name:** Compare attendance signals
- **Subtask description:** Compare registrations, voluntary confirmations, and relevant prior attendance patterns to identify agreement, divergence, and the uncertainty each signal contributes to the forecast.
- **Subtask boundary:** May compare supplied aggregate records and summarize differences. It may not treat voluntary confirmations as guaranteed attendance or invent missing attendance information.
- **Retry limits:** One additional comparison when a revised authorized input is supplied; otherwise hand off if the signals cannot be interpreted within the available evidence.

### Permitted Subtask 3

- **Subtask name:** Calculate forecast range
- **Subtask description:** Use the most reliable available attendance signals to calculate a bounded forecast range and document the assumptions and uncertainty supporting it.
- **Subtask boundary:** May produce a forecast range for organizer review only. It may not make purchases, send participant messages, or represent the forecast as guaranteed attendance.
- **Retry limits:** One recalculation after an organizer-approved input revision; otherwise hand off when the result remains unsupported or contradictory.

- **Decision guidance:** Select the permitted subtask that addresses the most important unresolved uncertainty. If required evidence or assumptions are unavailable, stop and hand the case to a person rather than choosing a value autonomously.

## 5. When to Stop or Hand Off to a Human

- **Stop successfully when:** An event-specific attendance forecast range, supporting evidence, assumptions, and uncertainties are complete and ready for organizer review.
- **Hand off early when:** Required data is missing, stale, or contradictory; the available signals cannot support a forecast; an approved assumption is missing; or any tool/inference limit fails.
- **Hand off to:** Cal Poly Vibe Coding Club organizer.

Stop at the first applicable handoff condition. While awaiting review, take no further autonomous action.

## 6. Outbound Deliverable

- **Status:** Completed or escalated to human.
- **Result or recommendation:** Event-specific low, central, and high attendance forecast range, or `undetermined` if escalated before a supported range can be produced.
- **Evidence summary:** The registrations, voluntary confirmations, relevant prior-attendance information, assumptions, and reliability findings that support the range or explain why it could not be produced.
- **Subtasks performed:** Permitted subtasks completed, including any allowed retries.
- **Unresolved issues:** Remaining uncertainties or questions; use `none` only if no unresolved issue remains.
- **Handoff note:** Reason for stopping, unresolved questions, and what the organizer needs to decide; write `Not applicable` for a completed task.
- **Next task or recipient:** H2: Present forecast for organizer review. Unresolved cases go to the Cal Poly Vibe Coding Club organizer; no supply recommendation or purchase action occurs before review.
