# T1: Load authorized event data

## Basic Information
- **Task ID:** T1
- **Task name:** Load authorized event data
- **Primary task type:** Automated data retrieval and normalization
- **Automation level:** L1
- **Accountable role:** CPVC organizer who starts or authorizes the planning run

## Task Description
Load only the event data an organizer has authorized for the current planning run. The task creates a normalized, minimum-necessary data package for validation; it does not contact participants, change source records, or infer missing values.

## Inputs
- **Planning-run request:** Event identifier, planning date, and organizer authorization; supplied by the organizer or an approved schedule.
- **Registration records:** Current registration count and event association; supplied by the authorized registration source.
- **Voluntary confirmation records:** Confirmation status and timestamp, without unnecessary personal details; supplied by the authorized confirmation source.
- **Historical attendance summary:** Prior comparable-event registration and attendance totals; supplied by the organizer-approved historical record.
- **Budget and supply constraints:** Approved per-person assumptions, budget cap, and any existing inventory; supplied by the organizer.

If an input is unavailable, unreadable, for another event, or outside the authorized scope, create a `data-issue` record for H1 rather than substitute data.

## Outputs
- **Authorized event-data package:** Normalized records and source timestamps for the named event; sent to T2.
- **Data-issue record:** Missing, stale, unauthorized, or unreadable inputs and their source; sent to H1.
- **Completion condition:** T2 can read a package tied to the requested event and run identifier, or H1 receives a specific issue record.

## Planned Tools
- **Authorized data connector:** Read-only retrieval from the organizer-approved registration, confirmation, and historical-data sources; input is the planning-run request and output is the event-data package.
- **Normalization/validation helper:** Checks schema, event ID, timestamps, and duplicate record identifiers; output is standardized records plus issues.
- **Implementation route:** Proposed read-only connector or export import; no credentials, scripts, or API keys are included in this specification.
- **Timeout and retries:** 60-second retrieval timeout; 1 additional retry only for a transient read failure.
- **Retry safety:** Retrieval is read-only. A retry must reuse the same run identifier and must not create source records.
- **Failure handoff:** After the retry fails, create a data-issue record for H1 and stop this path.

## Exceptions and Safeguards
- Reject data from an unapproved source or a mismatched event.
- Exclude unnecessary participant identifiers from the package.
- Do not send messages, alter registrations, or continue to T3 without T2 acceptance.
