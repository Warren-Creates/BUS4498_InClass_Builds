---
name: "daily-email-outreach"
description: "Draft google email replies daily, immediately after they have been received. Send me a full list of email responses drafted at 6pm each day. Do not respond to emails, simply draft replies."
---

# daily-email-outreach

## User inputs
On each run, the email will be provided. 
If personal information is being requested, such as graduation date, or location preferences, or ask for specification before including this information in draft.

## Procedure
1. Read the supplied email
2. Summarize main ask and highlight urgent deadlines and information being requested
3. Scrape supplied Google Calendar, Google Tasks, and review known background information about user
4. Draft comprehensive email with key information highlighted
5. Send email after it is approved by user

## Output
Return a short summary of the email received, problem adddressed, highlight key information, and suggest an immediate next step for user.

## Boundaries
Do not hallucinate information, do not reveal private information. Alert user if email includes deadline that conflicts with existing tasks.
