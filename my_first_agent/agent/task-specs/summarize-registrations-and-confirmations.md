# T3: Summarize registrations and confirmations

## Basic Information
- **Task ID:** T3
- **Task name:** Summarize registrations and confirmations
- **Primary task type:** Automated aggregation
- **Automation level:** L1
- **Accountable role:** CPVC organizer responsible for the planning run

## Task Description
Aggregate the validated records into a privacy-preserving event summary: registrations, voluntary confirmations, unconfirmed registrations, comparable historical attendance rates, data dates, and stated constraints. The task reports counts and uncertainty indicators without identifying participants or predicting individual attendance.

## Inputs
- **Validated event-data package:** From T2; must carry an accepted event ID and run ID.

Invalid or absent package input is routed back to H1 through its issue process; T3 does not reconstruct or guess values.

## Outputs
- **Event attendance summary:** Counts, percentages, historical comparison summary, source timestamps, and notes on limitations; sent to T4 and T5.
- **Aggregation issue record:** Calculation or source inconsistency; sent to H1.
- **Completion condition:** T4 can consume one event summary whose figures reconcile with the validated package.

## Planned Tools
- **Aggregation helper:** Counts registrations and confirmations, calculates unconfirmed registrations and historical attendance percentages, and redacts direct identifiers.
- **Implementation route:** Proposed workflow calculation service or approved spreadsheet transformation.
- **Timeout and retries:** 30-second timeout; 0 additional retries for deterministic aggregation.
- **Retry safety:** Recalculation uses the same input version and run ID, replacing the prior draft summary rather than duplicating it.
- **Failure handoff:** Produce an aggregation issue record for H1 and stop before T4.

## Exceptions and Safeguards
- Do not report a confirmation rate when its denominator is zero; label it unavailable.
- Retain only aggregate values needed for the forecast and later organizer review.
