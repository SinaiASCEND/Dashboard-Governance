// mobile-schedules.js — Calendar of scheduled meetings for all governance bodies.
//
// Source: "Curriculum Governance Planning and Membership" PDF (AY 2025–26 & 2026–27).
//
// EEC has full minutes filed in window.EEC.MEETINGS; the subcommittees (PCCS, CCS,
// AES, CIS) have only scheduled dates — their minutes are pending intake.
//
// OCA (Office of Curricular Affairs) meets weekly: Mondays 10 am – 12 pm and
// Thursdays 1:30 – 2:30 pm. Those meetings have their own minutes that are filed
// separately from the EEC. We generate the next ~12 weeks of OCA meetings from
// today so the schedule stays live.

(function () {

// Parse "YYYY-MM-DD" as local midnight (avoid UTC shift that makes Mon look like Sun in EDT).
function parseLocal(s) {
  if (typeof s !== "string") return new Date(s);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(s);
}
// Format a local Date back to "YYYY-MM-DD" using LOCAL parts (not UTC).
function ymdLocal(d) {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}
// Export for the React app to share the same helpers.
window.MS_DATE = { parseLocal, ymdLocal };

// Set of minutes-file dates actually present on disk under minutes/EEC_Minutes_<date>.docx.
// Update if more files are added.
const MINUTES_AVAILABLE = new Set([
  "2025-07-11", "2025-08-22", "2025-09-05", "2025-09-19", "2025-10-03",
  "2025-10-17", "2025-11-07", "2025-11-21", "2025-12-05", "2025-12-19",
  "2026-01-09", "2026-01-23", "2026-02-06", "2026-02-20", "2026-03-06",
  "2026-05-08",
]);

const COMMITTEE_SCHEDULES = {
  EEC: [
    // AY 2025–26
    "2025-07-11", "2025-07-25", "2025-08-08", "2025-08-22", "2025-09-05",
    "2025-09-16", "2025-10-03", "2025-10-17", "2025-11-07", "2025-11-21",
    "2025-12-05", "2025-12-19", "2026-01-09", "2026-01-23", "2026-02-06",
    "2026-02-20", "2026-03-06", "2026-04-17", "2026-05-08", "2026-05-22",
    "2026-06-05", "2026-06-26",
    // AY 2026–27
    "2026-07-10", "2026-08-07", "2026-09-04", "2026-10-02", "2026-11-06",
    "2026-12-04", "2027-01-08", "2027-02-05", "2027-03-05", "2027-04-02",
    "2027-05-07", "2027-06-04",
  ],
  CCS: [
    // AY 2025–26
    "2025-07-08", "2025-08-05", "2025-09-09", "2025-10-07", "2025-11-11",
    "2025-12-16", "2026-01-06", "2026-01-20", "2026-02-03", "2026-03-17",
    "2026-04-14", "2026-05-19", "2026-06-16",
    // AY 2026–27
    "2026-07-14", "2026-08-04", "2026-09-08", "2026-10-06", "2026-11-10",
    "2026-12-15", "2027-01-05", "2027-01-19", "2027-02-02", "2027-03-16",
    "2027-04-13", "2027-05-18", "2027-06-15",
  ],
  PCCS: [
    // AY 2025–26
    "2025-07-10", "2025-08-14", "2025-09-11", "2025-10-09", "2025-11-13",
    "2025-12-11", "2026-01-08", "2026-02-12", "2026-03-12", "2026-04-09",
    "2026-05-14", "2026-06-11",
    // AY 2026–27
    "2026-07-09", "2026-08-13", "2026-09-10", "2026-10-08", "2026-11-12",
    "2026-12-10", "2027-01-14", "2027-02-11", "2027-03-11", "2027-04-08",
    "2027-05-13", "2027-06-10",
  ],
  AES: [
    // AY 2025–26
    "2025-07-15", "2025-08-19", "2025-09-16", "2025-10-21", "2025-11-18",
    "2025-12-16", "2026-01-20", "2026-02-17", "2026-03-17", "2026-04-21",
    "2026-05-19", "2026-06-16",
    // AY 2026–27
    "2026-07-21", "2026-08-18", "2026-09-15", "2026-10-20", "2026-11-17",
    "2026-12-15",
  ],
  CIS: [
    // CIS launches mid-2026
    "2026-06-18", "2026-07-16", "2026-08-20", "2026-09-17", "2026-10-15",
    "2026-11-19", "2026-12-17",
  ],
};

// OCA recurring meetings — generated dynamically from "today" forward 12 weeks
// and backward 4 weeks (for recent past). Mondays 10 am – 12 pm and Thursdays
// 1:30 – 2:30 pm.
function generateOcaSchedule() {
  const out = [];
  const start = new Date();
  start.setDate(start.getDate() - 28); // 4 weeks back
  const end = new Date();
  end.setDate(end.getDate() + 84); // 12 weeks forward

  const d = new Date(start);
  while (d <= end) {
    const dow = d.getDay(); // 0=Sun, 1=Mon, 4=Thu
    if (dow === 1) {
      out.push({ date: ymdLocal(d), time: "10 am – 12 pm ET", session: "Monday session" });
    } else if (dow === 4) {
      out.push({ date: ymdLocal(d), time: "1:30 – 2:30 pm ET", session: "Thursday session" });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function ymd(d) {
  return ymdLocal(d);
}

// Default times by committee (read from minutes when available; these are
// fallbacks for the schedule-only entries.)
const COMMITTEE_TIMES = {
  EEC:  "12 – 1 pm ET",
  PCCS: "3 – 4 pm ET",
  CCS:  "12 – 1 pm ET",
  AES:  "12 – 1 pm ET",
  CIS:  "12 – 1 pm ET",
};

// Build the combined list per committee. Each entry is either:
//   - { kind: "filed",     m, date, committee }   — full minutes record
//   - { kind: "scheduled", date, committee, time, session? } — date-only stub
function build() {
  const filed = new Set();
  const byCommittee = {};

  // Initialize buckets
  for (const cid of Object.keys(COMMITTEE_SCHEDULES)) byCommittee[cid] = [];
  byCommittee.OCA = [];

  // Add the filed minutes first
  if (window.EEC && window.EEC.MEETINGS) {
    for (const m of window.EEC.MEETINGS) {
      if (!byCommittee[m.committee]) byCommittee[m.committee] = [];
      byCommittee[m.committee].push({ kind: "filed", m, date: m.date, committee: m.committee });
      filed.add(m.committee + "|" + m.date);
    }
  }

  // Add scheduled-only entries from the PDF (skipping anything already filed)
  for (const [cid, dates] of Object.entries(COMMITTEE_SCHEDULES)) {
    for (const date of dates) {
      const key = cid + "|" + date;
      if (filed.has(key)) continue;
      byCommittee[cid].push({
        kind: "scheduled", date, committee: cid,
        time: COMMITTEE_TIMES[cid] || null,
      });
    }
  }

  // OCA recurring schedule
  byCommittee.OCA = generateOcaSchedule().map(e => ({
    kind: "scheduled", committee: "OCA",
    date: e.date, time: e.time, session: e.session,
  }));

  // Sort each list descending (newest first)
  for (const cid of Object.keys(byCommittee)) {
    byCommittee[cid].sort((a, b) => parseLocal(b.date) - parseLocal(a.date));
  }

  return byCommittee;
}

function hasMinutesFile(date) {
  return MINUTES_AVAILABLE.has(date);
}

window.MOBILE_SCHEDULE = {
  build,
  // committeeMeetings(id) returns the merged list for a committee
  committeeMeetings(id) {
    if (!this._cache) this._cache = build();
    return this._cache[id] || [];
  },
  nextMeeting(id) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ms = this.committeeMeetings(id);
    const future = ms.filter(e => parseLocal(e.date) >= today)
                     .sort((a, b) => parseLocal(a.date) - parseLocal(b.date));
    return future[0] || null;
  },
  totalCount(id) {
    return this.committeeMeetings(id).length;
  },
  filedCount(id) {
    return this.committeeMeetings(id).filter(e => e.kind === "filed").length;
  },
  hasMinutesFile,
};

})();
