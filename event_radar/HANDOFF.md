# Club Event Radar: handoff notes for Chloe

A campus event website. A club officer pastes an announcement (and optionally a flyer photo), an AI agent turns it into an event card and checks the posting rules, and the post is either published or held for a moderator.

## 1. What works now

- **Website:** https://warren-creates.github.io/BUS4498_InClass_Builds/event_radar/ (GitHub Pages). It lists published events, soonest first, and has the post form and a **Moderator sign-in** section.
- **Database:** the `events` table saves every post. Visitors can read published posts only and can't change anything. The database itself refuses a second live post with the same date, start time, and place.
- **AI agent:** the `submit-event` Edge Function is deployed (JWT verification off). It accepts text and an optional JPG/PNG flyer up to 5 MB, saves flyers in the `flyers` storage bucket, and the code (not the AI) decides published / waiting / rejected / duplicate.
- **Moderators:** sign in on the website to approve or reject waiting posts. New sign-ups are turned off, so only accounts made by hand can sign in.
- **Not working yet:** every post currently fails at the AI step ("The AI couldn't read that post" / "key was rejected"), so the database has no posts. See **What's next**.

## 2. Where things live

- **Repository:** https://github.com/Warren-Creates/BUS4498_InClass_Builds (the site is in `event_radar/`).
- **Supabase project:** "Warren-Creates's Project", Project URL `https://umrjoowkgipcaxzmumub.supabase.co`.
- **Files that matter:**
  - `index.html`, `app.js`, `style.css`: the website. `config.js`: the Project URL and the publishable key (both public).
  - `supabase/functions/submit-event/index.ts`: the AI agent.
  - `supabase/migrations/`: database changes, one per stage (events table, flyer photos, moderator sign-in).
  - `context/posting-rules.md` and `context/campus-places.md`: the rules and place codes. They're copied into `index.ts`, so change both together.
  - `test/sample-announcements.md` and `test/sample-flyer.png`: test posts and what should happen.
  - `AGENTS.md`: build instructions for Claude Code or Codex.

## 3. Secrets

- `ANTHROPIC_API_KEY` (the AI key) is set in Supabase → **Edge Functions → Secrets**. Optional: `OPENAI_API_KEY`, and `HOLD_ALL_POSTS=true` to make every post wait.
- Supabase provides its own server keys to the function automatically.
- You don't need any of the values. They are never in this repository, and nobody should paste them into a chat or a file.

## 4. How to test

Paste these on the website (or use the builder's test buttons):

1. **Post A:** "Board Game Guild: Game Night! Thursday, October 29, 7 to 10 pm in the University Union, Room 220. Free entry and free pizza while it lasts." → **Published**, with free food. Send it again → **Already posted** (the database stopped the copy).
2. **Post D:** "Kickoff party at our house on Foothill Blvd this Saturday at 9 pm! $10 at the door, BYOB. Venmo @jake-r-2026 to RSVP or text 805-555-0142." → **Waiting** (off campus, alcohol, personal payment handle and phone). The phone and Venmo stay off the card.
3. **Flyer:** "Clothing swap next week, all the details are on the flyer!" with `test/sample-flyer.png` → **Waiting** with the card read from the photo. Sign in as a moderator and approve it → it appears on the website with the photo.

## 5. What's next

- **Fix the AI key (blocking):** Anthropic rejects the saved `ANTHROPIC_API_KEY`. Make a fresh key in the Claude Console, paste only the key (no quotes or spaces) into Secrets, check the account has credits, then run the tests above.
- Then finish the class checks: sample posts A to F, approve the flyer, reject post D.
- Ideas: the optional nightly clean-up job (archives past events), "This week" and "Free food" filters, and email alerts to moderators when a post is waiting.

## 6. How we take turns

1. **Before you start:** tell the other person you're working, then in GitHub Desktop click **Fetch origin** and **Pull** to download the latest changes.
2. **When you stop:** commit with a short summary, click **Push origin** to upload, and say you're done.
3. Only one of us works at a time, so our changes never collide.
