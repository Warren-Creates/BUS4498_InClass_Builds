# T2: Validate event data

## Basic Information
- **Task ID:** T2
- **Task name:** Validate event data
- **Primary task type:** Automated rule-based validation
- **Automation level:** L1
- **Accountable role:** CPVC organizer responsible for the planning run

## Task Description
Check whether the authorized event-data package is complete, current enough for the planning date, internally consistent, and usable for forecasting. This task applies stated checks; it does not repair data, choose assumptions, or decide that an uncertain value is acceptable.

## Inputs
- **Authorized event-data package:** From T1; must include event ID, source timestamps, registrations, voluntary confirmations, historical summary, and stated planning constraints.
- **Validation rules:** Required fields, nonnegative counts, confirmations no greater than registrations unless a documented source rule explains the difference, matching event IDs, and identifiable source dates; maintained with the workflow.

Missing or invalid input is routed to H1 with the failed rule and the affected source.

## Outputs
- **Validated event-data package:** Required fields and checks passed; sent to T3.
- **Validation issue record:** Failed checks, contradictions, stale values, or missing data; sent to H1.
- **Completion condition:** Exactly one output exists for the run: a validated package or a validation issue record.

## Planned Tools
- **Rule-validation helper:** Applies the listed deterministic checks to T1's package; output is a pass result or issue record.
- **Implementation route:** Proposed workflow validation service or spreadsheet/data-check step.
- **Timeout and retries:** 30-second timeout; 0 additional retries because the operation is deterministic on unchanged input.
- **Retry safety:** A rerun uses the same input version and overwrites only the task's temporary validation result for the same run ID.
- **Failure handoff:** Tool or schema failure becomes a validation issue record for H1; do not pass partial data to T3.

## Exceptions and Safeguards
- A zero registration count is valid only if the organizer confirms that the event remains active.
- Do not silently coerce conflicting counts or fill blanks with historical averages.
