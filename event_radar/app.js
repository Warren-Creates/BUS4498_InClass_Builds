// Club Event Radar: the website's code.
// It reads published events with the publishable key (the security rules allow only that),
// and sends new announcements to the AI agent (the submit-event Edge Function).
// User text is always shown with textContent, never innerHTML.

(function () {
  "use strict";

  var config = window.EVENT_RADAR_CONFIG || {};
  var board = document.getElementById("board");
  var form = document.getElementById("post-form");
  var button = document.getElementById("post-button");
  var resultBox = document.getElementById("result");
  var resultLabel = document.getElementById("result-label");
  var resultMessage = document.getElementById("result-message");
  var resultReasons = document.getElementById("result-reasons");
  var refreshButton = document.getElementById("refresh");
  var chips = document.querySelectorAll(".chip");

  // Only the columns the website is allowed to read (see the Stage 4 grants).
  var COLUMNS = "id, created_at, status, title, club, event_date, start_time, end_time, " +
    "place_name, place_detail, cost, free_food, summary";

  var events = [];
  var filter = "all";

  if (!config.supabaseUrl || !config.publishableKey || !window.supabase) {
    showEmpty("The website isn't set up yet. Check config.js.");
    button.disabled = true;
    return;
  }

  var db = window.supabase.createClient(config.supabaseUrl, config.publishableKey, {
    auth: { persistSession: false },
  });
  var agentUrl = config.supabaseUrl.replace(/\/$/, "") + "/functions/v1/submit-event";

  // ---------- Dates and times ----------

  function todayPacific() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
  }

  // "2026-10-29" -> a Date at noon UTC, so the day never shifts with time zones.
  function toDate(iso) {
    return new Date(iso + "T12:00:00Z");
  }

  function fmt(date, options) {
    return new Intl.DateTimeFormat("en-US", Object.assign({ timeZone: "UTC" }, options)).format(date);
  }

  // "19:00:00" -> "7:00 PM"
  function formatTime(t) {
    if (!t) return "";
    var parts = t.split(":");
    var h = Number(parts[0]);
    var m = parts[1] || "00";
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + m + " " + suffix;
  }

  function daysAway(iso) {
    return Math.round((toDate(iso) - toDate(todayPacific())) / 86400000);
  }

  // ---------- Small helpers for building elements safely ----------

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function showEmpty(message) {
    board.replaceChildren(el("li", "empty", message));
  }

  // ---------- The event list ----------

  function eventCard(ev) {
    var li = el("li", "event");

    // 1. Date block
    var dateBox;
    if (ev.event_date) {
      var d = toDate(ev.event_date);
      dateBox = el("div", "date");
      dateBox.appendChild(el("span", "mon", fmt(d, { month: "short" })));
      dateBox.appendChild(el("span", "day", fmt(d, { day: "numeric" })));
    } else {
      dateBox = el("div", "date tba");
      dateBox.appendChild(el("span", "day", "TBA"));
    }
    li.appendChild(dateBox);

    // 2. Body
    var body = el("div", "event-body");

    var when = [];
    if (ev.event_date) when.push(fmt(toDate(ev.event_date), { weekday: "short", month: "short", day: "numeric" }));
    if (ev.start_time) {
      when.push(formatTime(ev.start_time) + (ev.end_time ? " to " + formatTime(ev.end_time) : ""));
    }
    if (when.length) body.appendChild(el("p", "when", when.join(" · ")));

    body.appendChild(el("h3", null, ev.title || "Untitled event"));

    var place = [ev.place_name, ev.place_detail].filter(Boolean).join(", ");
    var meta = [ev.club, place].filter(Boolean).join(" · ");
    if (meta) body.appendChild(el("p", "meta", meta));

    if (ev.summary) body.appendChild(el("p", "summary", ev.summary));

    var tags = el("p", "tags");
    if (ev.cost) tags.appendChild(el("span", "tag", ev.cost));
    if (ev.free_food) tags.appendChild(el("span", "tag food", "🍕 Free food"));
    if (tags.childNodes.length) body.appendChild(tags);

    li.appendChild(body);
    return li;
  }

  function render() {
    var shown = events.filter(function (ev) {
      if (filter === "food") return ev.free_food;
      if (filter === "week") return ev.event_date && daysAway(ev.event_date) <= 7;
      return true;
    });

    if (!shown.length) {
      showEmpty(events.length ? "No events match this filter." : "No events yet. Post the first one!");
      return;
    }
    board.replaceChildren.apply(board, shown.map(eventCard));
  }

  async function loadEvents() {
    refreshButton.disabled = true;
    var res = await db
      .from("events")
      .select(COLUMNS)
      .eq("status", "published")
      .gte("event_date", todayPacific())
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });
    refreshButton.disabled = false;

    if (res.error) {
      console.error(res.error);
      showEmpty("Couldn't load events right now. Try Refresh in a moment.");
      return;
    }
    events = res.data || [];
    render();
  }

  // ---------- Sending a post to the agent ----------

  var LABELS = {
    published: "Published",
    waiting: "Waiting for a moderator",
    rejected: "Not posted",
    duplicate: "Already posted",
    error: "Something went wrong",
  };

  function showResult(kind, message, reasons) {
    resultBox.className = "result " + kind;
    resultLabel.textContent = LABELS[kind] || LABELS.error;
    resultMessage.textContent = message || "";
    resultReasons.replaceChildren.apply(
      resultReasons,
      (reasons || []).map(function (r) { return el("li", null, r); })
    );
    resultBox.hidden = false;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var text = form.announcement.value.trim();
    if (!text) {
      showResult("error", "Paste the announcement text first.");
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    resultBox.hidden = true;

    try {
      var data = new FormData();
      data.append("announcement", text);
      var res = await fetch(agentUrl, {
        method: "POST",
        headers: { apikey: config.publishableKey },
        body: data,
      });
      var answer = await res.json().catch(function () { return {}; });

      if (!answer.ok) {
        showResult("error", answer.message || "The agent didn't answer. Try again in a minute.");
      } else {
        showResult(answer.status, answer.message, answer.reasons);
        if (answer.status === "published") {
          form.reset();
          loadEvents();
        }
      }
    } catch (err) {
      console.error(err);
      showResult("error", "Couldn't reach the agent. Check your internet connection and try again.");
    } finally {
      button.disabled = false;
      button.textContent = "Send to the agent";
    }
  });

  // ---------- Filters and refresh ----------

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filter = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      render();
    });
  });

  refreshButton.addEventListener("click", loadEvents);

  loadEvents();
})();
