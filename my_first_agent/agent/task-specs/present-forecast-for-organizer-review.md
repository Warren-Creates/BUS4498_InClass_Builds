# H2: Present forecast for organizer review

## Basic Information
- **Task ID:** H2
- **Task name:** Present forecast for organizer review
- **Primary task type:** Human review and approval decision
- **Automation level:** L0
- **Accountable role:** CPVC organizer who owns the event-planning decision

## Task Description
The organizer reviews the forecast and supply recommendation, including evidence, assumptions, uncertainty, costs, and constraints. The organizer decides whether the assumptions and recommendation are acceptable for planning, requests revision, or stops the run. The system may present information but must not approve it, purchase supplies, or message participants.

## Inputs
- **Attendance forecast:** From T4.
- **Supply recommendation:** From T5.
- **Supporting event summary and limitations:** From T3.

## Outputs
- **Organizer approval:** Dated approval of the reviewed forecast assumptions and recommendation; sent to T6.
- **Revision request:** Specific change to data, assumptions, or constraints; sent to H3.
- **Stop decision:** Reason and timestamp; recorded in the run with no downstream action.
- **Completion condition:** A named organizer has approved, requested revision, or stopped the run.

## Planned Tools
- **Human work:** Organizer reviews the complete planning packet and records a decision.
- **Optional support:** Dashboard or review form may display evidence and capture a response; it must not convert silence into approval.
- **Implementation route:** Manual organizer review in the planning workspace.
- **Timeout and retries:** Not applicable - manual task. Organizer response deadline: 2 business days before the supply decision is needed.
- **Missed-deadline handoff:** Mark the run `awaiting organizer review`, notify the accountable organizer once, and do not invoke T6.

## Exceptions and Safeguards
- The system must show uncertainties and limitations before the response is recorded.
- Rejection or revision is not failure; it routes to H3.
- Approval authorizes storage of the planning record only, not purchasing or outreach.
