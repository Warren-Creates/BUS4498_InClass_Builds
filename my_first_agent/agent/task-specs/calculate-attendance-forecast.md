# T4: Calculate attendance forecast

## Basic Information
- **Task ID:** T4
- **Task name:** Calculate attendance forecast
- **Primary task type:** Model-supported forecast calculation
- **Automation level:** L2
- **Accountable role:** CPVC organizer responsible for approving use of the forecast

## Task Description
Create an event-specific attendance forecast range from validated aggregate data. The task combines voluntary confirmations with comparable historical attendance behavior and presents assumptions, uncertainty, and limitations. It produces planning support, not a certainty or a decision to purchase supplies.

## Inputs
- **Event attendance summary:** From T3; includes aggregate registrations, confirmations, comparable historical rates, data dates, and limitations.
- **Organizer-approved forecasting assumptions:** Range method, comparable-event selection, and any approved adjustments; supplied in the planning request or through H3.

If assumptions are missing, contradictory, or outside the scope of authorized data, create an assumption issue for H3 rather than select a method independently.

## Outputs
- **Attendance forecast:** Low, central, and high attendance estimates; assumptions; evidence used; uncertainty explanations; and run ID; sent to T5 and H2.
- **Assumption issue record:** Specific decision or approved input needed; sent to H3.
- **Completion condition:** H2 can review a forecast range that identifies all inputs and does not claim guaranteed attendance.

## Planned Tools
- **Forecasting helper:** Proposed bounded calculation that applies the organizer-approved assumptions to aggregate confirmation and historical-attendance data.
- **Explanation generator:** Formats the range, assumptions, and limitations for organizer review; it cannot alter the forecast inputs.
- **Implementation route:** Proposed approved analytics tool or transparent spreadsheet/model service; no scripts, API keys, or live participant outreach.
- **Timeout and retries:** 60-second calculation timeout; 1 additional retry for a transient execution failure.
- **Retry safety:** Retries reuse the identical input and assumption versions and replace the draft for the same run ID; they do not create a second forecast.
- **Failure handoff:** After failure or an uncertain calculation outcome, create an assumption/tool issue for H3 and do not send a forecast to T5 or H2.

## Exceptions and Safeguards
- Do not use protected or unnecessary personal attributes.
- Do not extrapolate beyond the documented comparable-event evidence without organizer approval.
- The forecast must remain a range and must surface data limitations.
