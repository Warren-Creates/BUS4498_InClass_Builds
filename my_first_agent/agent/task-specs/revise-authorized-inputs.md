# H3: Revise authorized inputs

## Basic Information
- **Task ID:** H3
- **Task name:** Revise authorized inputs
- **Primary task type:** Human revision and authorization
- **Automation level:** L0
- **Accountable role:** CPVC organizer who requested the revision or owns the planning run

## Task Description
The organizer revises a forecast assumption, data authorization, or supply constraint after an issue or review request. The organizer supplies the new approved value and its rationale, then sends the workflow back to forecasting. This task prevents the system from changing policy-sensitive assumptions or planning priorities on its own.

## Inputs
- **Revision or issue record:** From H2, T4, or T5; identifies the exact item requiring action.
- **Organizer-approved revised input:** Updated assumption, constraint, source authorization, or stop decision; supplied by the accountable organizer.

## Outputs
- **Approved revision package:** Revised value, rationale, timestamp, and run ID; sent to T4 for recalculation.
- **Stop/awaiting-organizer status:** Reason and timestamp; recorded with no new forecast.
- **Completion condition:** T4 receives a traceable revised package, or the run is explicitly stopped/paused.

## Planned Tools
- **Human work:** Organizer evaluates the issue and approves the revised value or stops the run.
- **Optional support:** A review form may preserve the previous value and record the revision; it must not choose the value.
- **Implementation route:** Manual organizer action in the planning workspace.
- **Timeout and retries:** Not applicable - manual task. Organizer response deadline: 2 business days before the planning decision is needed.
- **Missed-deadline handoff:** Record `awaiting organizer revision`, notify the run owner once, and do not recalculate.

## Exceptions and Safeguards
- A revised input must identify its source and affected event.
- Do not overwrite the prior value; preserve version history for organizer review.
