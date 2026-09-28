# T6: Store run summary

## Basic Information
- **Task ID:** T6
- **Task name:** Store run summary
- **Primary task type:** Automated record storage
- **Automation level:** L1
- **Accountable role:** CPVC organizer who approved the planning run

## Task Description
Store an auditable, minimum-necessary summary of an organizer-approved planning run. The summary records the event, forecast range, supply recommendation, assumptions, limitations, organizer decision, and timestamps so organizers can review past planning runs without retaining unnecessary participant-level data.

## Inputs
- **Organizer approval:** From H2; must identify the approving organizer, event, run ID, and approval timestamp.
- **Approved forecast and recommendation:** From T4 and T5; must match the approved run ID and versions.
- **Supporting aggregate summary:** From T3; includes source timestamps and limitations.

Missing approval, mismatched versions, or absent required fields create a storage issue for H2/H3; T6 does not store an unapproved or partial run as complete.

## Outputs
- **Stored run summary:** Minimum-necessary planning record with run ID, approved forecast, recommendation, assumptions, limitations, and approval metadata; available to authorized organizers.
- **Storage issue record:** Failed write, version mismatch, or access problem; sent to H2 for organizer awareness and H3 if revision is needed.
- **Completion condition:** The approved run summary is retrievable by its run ID and clearly marked stored, or an issue is recorded and the run is not marked complete.

## Planned Tools
- **Authorized run-summary store:** Writes the approved aggregate record to the organizer-approved planning repository.
- **Record-verification helper:** Reads back the run ID and key fields after writing.
- **Implementation route:** Proposed approved database, spreadsheet, or document repository with access control; no raw participant data required.
- **Timeout and retries:** 60-second write/read-back timeout; 1 additional retry for a transient failure.
- **Retry safety:** Use the run ID as an idempotency key. A retry must update or confirm the same summary rather than create a duplicate.
- **Failure handoff:** If write or verification remains uncertain after the retry, create a storage issue and do not report the workflow complete.

## Exceptions and Safeguards
- Store aggregate data only and follow the organizer-approved retention approach.
- Do not use a stored summary as authorization to contact participants or purchase supplies.
