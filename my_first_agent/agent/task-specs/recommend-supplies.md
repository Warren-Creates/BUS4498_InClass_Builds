# T5: Recommend supplies

## Basic Information
- **Task ID:** T5
- **Task name:** Recommend supplies
- **Primary task type:** Model-supported recommendation
- **Automation level:** L2
- **Accountable role:** CPVC organizer responsible for supply decisions

## Task Description
Translate the attendance forecast and approved planning constraints into a conservative food, drink, and swag recommendation. The task makes the quantities, cost assumptions, forecast range, and tradeoffs visible for review. It may not buy items, reserve inventory, or contact vendors.

## Inputs
- **Attendance forecast:** From T4; must include low, central, and high estimates plus assumptions and limitations.
- **Event attendance summary:** From T3; used for source dates and context.
- **Supply constraints:** Organizer-provided item categories, unit costs, available inventory, budget cap, dietary/accessibility requirements, and lead-time constraints.

Missing, invalid, or conflicting constraints are routed to H3; T5 does not invent prices, stock, or policy priorities.

## Outputs
- **Supply recommendation:** Food, drink, and swag quantities; estimated cost; assumptions; buffer rationale; constraints; and tradeoffs; sent to H2.
- **Constraint issue record:** Missing inventory, prices, budget, or incompatible requirements; sent to H3.
- **Completion condition:** H2 can determine what is recommended, what it costs, which forecast scenario it supports, and what remains uncertain.

## Planned Tools
- **Recommendation calculator:** Applies organizer-approved quantity and cost rules to the forecast range and supply constraints.
- **Budget checker:** Compares estimated cost to the approved cap and flags over-budget alternatives.
- **Implementation route:** Proposed transparent planning spreadsheet or approved analytics service; no purchasing or vendor integration.
- **Timeout and retries:** 60-second timeout; 1 additional retry for a transient calculation failure.
- **Retry safety:** Retry uses the same forecast and constraint versions and replaces the draft recommendation for the run ID.
- **Failure handoff:** A failed or uncertain result becomes a constraint/tool issue for H3; never mark a recommendation complete on failure.

## Exceptions and Safeguards
- Clearly label recommendations as planning estimates, not purchase orders.
- Flag a recommendation that exceeds the budget rather than silently reducing quantities.
- Do not proceed to procurement; H2 remains the required human review.
