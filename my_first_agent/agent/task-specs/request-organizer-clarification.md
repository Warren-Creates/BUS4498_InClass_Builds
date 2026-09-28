# H1: Request organizer clarification

## Basic Information
- **Task ID:** H1
- **Task name:** Request organizer clarification
- **Primary task type:** Human review and input correction
- **Automation level:** L0
- **Accountable role:** CPVC organizer who authorized the planning run

## Task Description
The organizer reviews the named data issue and supplies an authorized correction, an explicit decision to proceed with a documented limitation, or a decision to stop the run. This task preserves human authority over data quality and assumptions; software may display the issue but may not decide how to resolve it.

## Inputs
- **Data-issue or validation issue record:** From T1 or T2; includes the missing, stale, conflicting, or unauthorized input and the applicable rule.
- **Organizer response:** Corrected source data, updated constraint, documented limitation, or stop decision; supplied by the accountable organizer.

## Outputs
- **Approved update:** Corrected or newly authorized data and the organizer's decision; sent to T1 for a fresh retrieval and validation cycle.
- **Stop/awaiting-organizer status:** Reason and timestamp; sent to the run record with no downstream forecast.
- **Completion condition:** A dated organizer response is captured, or the workflow is explicitly marked awaiting organizer input.

## Planned Tools
- **Human work:** The organizer reviews the issue, verifies the source, and provides the decision.
- **Optional support:** A task inbox or dashboard may show the issue and record the response; it must not approve the data on the organizer's behalf.
- **Implementation route:** Manual organizer response in the planning workspace.
- **Timeout and retries:** Not applicable - manual task. Organizer response deadline: 2 business days before the planning decision is needed.
- **Missed-deadline handoff:** Mark the run `awaiting organizer clarification`, notify the run owner once, and do not continue.

## Exceptions and Safeguards
- A missing response is not approval.
- The organizer may stop the run rather than provide additional personal data.
- The response must identify the event and run ID so T1 does not mix events.
