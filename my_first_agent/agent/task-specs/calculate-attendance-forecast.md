# Calculate attendance forecast Task Specification

```yaml
# BASIC INFORMATION
task_id: "T4"
task_name: "Calculate attendance forecast"
task_owner: "Cal Poly Vibe Coding Club organizer"
```

## 1. Task Goal

- **Objective:** Produce an event-specific, evidence-supported attendance forecast range that an organizer can review when planning food, drinks, and swag.

## 2. Inbound Inputs

### Input 1

- **Input name:** Validated event data
- **What it contains:** Organizer-authorized registration records, voluntary confirmation data, prior event attendance information, and the outcome of completeness and consistency checks.
- **Source:** T2: Validate event data.

### Input 2

- **Input name:** Registration and confirmation summary
- **What it contains:** A summary of registrations and voluntary confirmations for the event, including counts and any documented uncertainty from the validated data.
- **Source:** T3: Summarize registrations and confirmations.

## 3. Tool Permissions and Boundaries

## 4. How the Agent Should Reason

### Permitted Subtask 1

- **Subtask name:** Assess input reliability
- **Subtask description:** Examine the validated event data and summary for missing values, stale information, conflicting counts, or limited historical relevance; produce a finding about whether the available evidence can support a forecast.
- **Subtask boundary:** May assess only the organizer-authorized inputs supplied by T2 and T3. It may not contact participants, obtain new data, or change any input.
- **Retry limits:** One additional assessment after an organizer-approved input revision; otherwise hand off if reliability remains insufficient.

### Permitted Subtask 2

- **Subtask name:** Compare attendance signals
- **Subtask description:** Compare registrations, voluntary confirmations, and relevant prior attendance patterns to identify agreement, divergence, and the uncertainty each signal contributes to the forecast.
- **Subtask boundary:** May compare the supplied records and summarize differences. It may not treat voluntary confirmations as guaranteed attendance or invent missing attendance information.
- **Retry limits:** One additional comparison when a revised authorized input is supplied; otherwise hand off if the signals cannot be interpreted within the available evidence.

### Permitted Subtask 3

- **Subtask name:** Calculate forecast range
- **Subtask description:** Use the most reliable available attendance signals to calculate a bounded forecast range and document the assumptions and uncertainty supporting it.
- **Subtask boundary:** May produce a forecast range for organizer review only. It may not make purchases, send participant messages, or represent the forecast as guaranteed attendance.
- **Retry limits:** One recalculation after an organizer-approved input revision; otherwise hand off when the result remains unsupported or contradictory.

- **Decision guidance:** After each subtask, use its findings to select the permitted subtask most likely to resolve the most important remaining uncertainty. Do not follow a fixed sequence. If no permitted subtask can make useful progress, stop and hand the case to a person.

## 5. When to Stop or Hand Off to a Human

- **Stop successfully when:** An event-specific attendance forecast range, its supporting evidence, its assumptions, and its uncertainties are complete and ready for organizer review.
- **Hand off early when:** Required data is missing, stale, or contradictory; the available signals cannot support a forecast range; or an organizer-approved revision is needed.
- **Hand off to:** Cal Poly Vibe Coding Club organizer.

Stop at the first applicable handoff condition. While awaiting review, take no further autonomous action.

## 6. Outbound Deliverable

- **Status:** Completed or escalated to human.
- **Result or recommendation:** Event-specific attendance forecast range, or undetermined if escalated before a supported range can be produced.
- **Evidence summary:** The registrations, voluntary confirmations, relevant prior-attendance information, and reliability findings that support the range or explain why it could not be produced.
- **Subtasks performed:** Permitted subtasks completed, including repeated attempts.
- **Unresolved issues:** Remaining uncertainties or questions; use none only if no unresolved issue remains.
- **Handoff note:** Reason for stopping, unresolved questions, and what the organizer needs to decide; write "Not applicable" for a completed task.
- **Next task or recipient:** T5: Recommend supplies, after organizer review; unresolved cases go to the Cal Poly Vibe Coding Club organizer.
