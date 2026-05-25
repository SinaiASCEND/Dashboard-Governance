// mobile-app.jsx — Mobile Governance Dashboard
// 4-level nav:
//   home        → 5 buttons (OCA + EEC/PCCS/CCS/AES)
//   committee   → meetings list for a committee, each row shows date + agenda bullets
//   meeting     → 4 buttons (Summary, Governance Actions, Operational Actions, Download PDF)
//   detail      → one of the four sub-screens

const { useState: useStateMA, useMemo: useMemoMA, useEffect: useEffectMA } = React;

// ─── Mobile design tokens (override desktop where useful for touch) ──────
const MOBILE_CSS = `
.m-screen {
  position: absolute; inset: 0;
  background: #F5F6F7;
  font-family: var(--sans);
  color: var(--ink);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.m-status {
  height: 44px; flex: 0 0 44px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 26px 0 30px;
  font-family: -apple-system, "SF Pro Text", system-ui, sans-serif;
  font-size: 15px; font-weight: 600; color: var(--ink);
  letter-spacing: -0.01em;
}
.m-status .icons { display: flex; gap: 5px; align-items: center; }
.m-header {
  flex: 0 0 auto;
  padding: 4px 22px 16px;
  background: #F5F6F7;
}
.m-header .brand {
  display: flex; align-items: center; gap: 9px;
  font-family: var(--serif); font-size: 19px; font-weight: 600;
  letter-spacing: -0.015em; color: var(--ink);
}
.m-header .brand .dot {
  width: 11px; height: 11px; border-radius: 3px; background: var(--brand-violet);
  flex: 0 0 11px;
}
.m-header .sub {
  font-size: 12px; color: var(--grey-11); margin-top: 4px;
  letter-spacing: 0.01em;
}
.m-header .meta {
  display: flex; gap: 10px; align-items: center; margin-top: 10px;
  font-size: 10.5px; color: var(--grey-7);
  text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
}
.m-header .meta .pill-ay {
  padding: 2px 8px; border: 1px solid var(--grey-3); background: var(--paper);
  border-radius: 4px; color: var(--grey-11);
}
.m-body {
  flex: 1 1 auto; overflow-y: auto;
  padding: 8px 18px 32px;
  -webkit-overflow-scrolling: touch;
}
.m-body::-webkit-scrollbar { width: 0; }

/* Nav bar for non-home screens */
.m-nav {
  height: 50px; flex: 0 0 50px;
  display: flex; align-items: center; gap: 4px;
  padding: 0 14px;
  background: rgba(245,246,247,0.92);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-bottom: 0.5px solid var(--grey-3);
}
.m-nav .back {
  display: flex; align-items: center; gap: 2px;
  padding: 6px 10px 6px 6px;
  font-size: 16px; font-weight: 500; letter-spacing: -0.01em;
  color: var(--brand-cyan-deep);
  cursor: pointer; border: 0; background: transparent;
  font-family: var(--sans);
}
.m-nav .back svg { stroke-width: 2.2; }
.m-nav .title {
  flex: 1; text-align: center;
  font-size: 15px; font-weight: 600; color: var(--ink);
  letter-spacing: -0.01em;
  font-family: var(--sans);
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  padding: 0 8px;
}
.m-nav .right { width: 60px; display: flex; justify-content: flex-end; }

/* OCA hero button */
.m-oca {
  position: relative; overflow: hidden;
  background: var(--brand-violet);
  color: #fff; border: 0; border-radius: 16px;
  padding: 18px 20px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 14px;
  box-shadow: 0 6px 18px -8px rgba(34,31,114,0.45), 0 1px 0 rgba(255,255,255,0.06) inset;
}
.m-oca::before {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(280px 180px at 100% 0%, rgba(255,255,255,0.10), transparent 60%),
    radial-gradient(220px 160px at 0% 100%, rgba(0,174,239,0.18), transparent 60%);
  pointer-events: none;
}
.m-oca .eyebrow {
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  opacity: 0.78; font-weight: 600; margin-bottom: 6px;
  display: flex; align-items: center; gap: 7px;
}
.m-oca .eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; opacity: 0.9; }
.m-oca .title {
  font-family: var(--serif); font-size: 21px; font-weight: 600;
  line-height: 1.18; letter-spacing: -0.015em;
}
.m-oca .stats {
  font-size: 11.5px; opacity: 0.78; margin-top: 9px;
  display: flex; gap: 12px; align-items: center;
  font-variant-numeric: tabular-nums;
}
.m-oca .stats .sep { width: 3px; height: 3px; border-radius: 50%; background: #fff; opacity: 0.4; }
.m-oca .chev {
  display: grid; place-items: center;
  width: 32px; height: 32px;
  border-radius: 50%; background: rgba(255,255,255,0.12);
  flex: 0 0 32px;
  position: relative; z-index: 1;
}

/* Committee tile */
.m-tile {
  position: relative; overflow: hidden;
  background: var(--paper);
  border-radius: 14px;
  padding: 14px 14px 12px;
  text-align: left; border: 0;
  cursor: pointer;
  display: flex; flex-direction: column; gap: 6px;
  min-height: 132px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-tile .stripe {
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
}
.m-tile .short {
  font-family: var(--serif); font-size: 20px; font-weight: 600;
  letter-spacing: -0.01em; line-height: 1;
  margin-top: 5px;
}
.m-tile .name {
  font-size: 11px; line-height: 1.35; color: var(--grey-11);
  margin-top: 2px; min-height: 30px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.m-tile .stat {
  font-size: 11px; color: var(--grey-11);
  display: flex; align-items: center; gap: 6px;
  margin-top: auto; padding-top: 6px;
  font-variant-numeric: tabular-nums; font-weight: 500;
}
.m-tile .stat .num { font-weight: 700; color: var(--ink); font-family: var(--serif); font-size: 14px; }
.m-tile .stat.placeholder { color: var(--grey-7); font-style: italic; }
.m-tile .chev {
  position: absolute; top: 14px; right: 14px;
  color: var(--grey-7);
}

/* Meeting row */
.m-meet-month {
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600;
  padding: 16px 4px 8px;
}
.m-meet-row {
  background: var(--paper); border-radius: 12px;
  padding: 12px 14px 12px 12px;
  display: grid; grid-template-columns: 48px 1fr; gap: 12px;
  cursor: pointer;
  border: 0;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
  position: relative;
  text-align: left;
  width: 100%;
}
.m-meet-row .date-block {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 6px 0; border-radius: 8px;
  background: var(--grey-1);
}
.m-meet-row .date-block .dow {
  font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 700;
}
.m-meet-row .date-block .day {
  font-family: var(--serif); font-size: 20px; font-weight: 700; line-height: 1;
  margin: 2px 0;
}
.m-meet-row .date-block .mo {
  font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600;
}
.m-meet-row .meta {
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
  font-size: 11px;
}
.m-meet-row .chip {
  padding: 1px 7px; border-radius: 999px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
}
.m-meet-row .status {
  font-size: 10px; color: var(--grey-7); margin-left: auto;
  text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;
}
.m-meet-row .status.future {
  color: var(--brand-cyan-deep);
}
.m-meet-row ul.agenda {
  margin: 4px 0 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 3px;
}
.m-meet-row ul.agenda li {
  font-size: 12px; line-height: 1.35; color: var(--ink-2);
  position: relative; padding-left: 12px;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
}
.m-meet-row ul.agenda li::before {
  content: ""; position: absolute; left: 2px; top: 7px;
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--grey-7);
}
.m-meet-row ul.agenda li.more {
  font-size: 11px; color: var(--grey-7); font-style: italic;
  padding-left: 12px;
}
.m-meet-row ul.agenda li.more::before { display: none; }

/* Meeting detail buttons (2x2) */
.m-detail-card {
  background: var(--paper); border-radius: 14px;
  padding: 16px 16px 14px;
  margin-bottom: 14px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-detail-card .eyebrow {
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600; margin-bottom: 4px;
}
.m-detail-card h1 {
  font-family: var(--serif); font-size: 22px; font-weight: 600;
  letter-spacing: -0.015em; line-height: 1.2;
}
.m-detail-card .meta-grid {
  margin-top: 12px; padding-top: 12px;
  border-top: 1px solid var(--grey-2);
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px;
}
.m-detail-card .meta-grid .row .lbl {
  font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600;
}
.m-detail-card .meta-grid .row .val {
  font-size: 12px; color: var(--ink-2); margin-top: 1px; line-height: 1.35;
}

.m-action-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  margin-bottom: 12px;
}
.m-action-btn {
  background: var(--paper);
  border-radius: 14px;
  padding: 14px 14px 14px;
  border: 0;
  cursor: pointer;
  text-align: left;
  position: relative; overflow: hidden;
  min-height: 110px;
  display: flex; flex-direction: column; gap: 6px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-action-btn .icon {
  width: 30px; height: 30px; border-radius: 9px;
  display: grid; place-items: center;
  color: #fff;
}
.m-action-btn .label {
  font-family: var(--serif); font-size: 14px; font-weight: 600;
  letter-spacing: -0.005em; line-height: 1.2;
  color: var(--ink); margin-top: auto;
}
.m-action-btn .count {
  position: absolute; top: 12px; right: 14px;
  font-family: var(--mono); font-size: 14px; font-weight: 600;
  color: var(--grey-11); font-variant-numeric: tabular-nums;
}
.m-action-btn .arrow {
  margin-top: 2px;
  font-size: 11px; color: var(--grey-7);
  display: flex; align-items: center; gap: 4px;
  font-weight: 500;
}

/* Sub-screens */
.m-section-head {
  padding: 14px 4px 8px;
}
.m-section-head .eyebrow {
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600; margin-bottom: 3px;
}
.m-section-head h2 {
  font-family: var(--serif); font-size: 22px; font-weight: 600;
  letter-spacing: -0.015em;
}
.m-agenda-item {
  background: var(--paper); border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-agenda-item .top {
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
  flex-wrap: wrap;
}
.m-agenda-item .idx {
  font-family: var(--mono); font-size: 10px; color: var(--grey-7);
  font-weight: 600;
}
.m-agenda-item .cat {
  font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase;
  font-weight: 700; padding: 2px 7px; border-radius: 4px;
}
.m-agenda-item .title {
  font-family: var(--serif); font-size: 14px; font-weight: 600;
  letter-spacing: -0.005em; line-height: 1.3;
  margin-bottom: 6px;
}
.m-agenda-item .outcome {
  font-size: 12px; line-height: 1.45; color: var(--ink-2);
}
.m-agenda-item .pres {
  font-size: 11px; color: var(--grey-11); margin-top: 6px;
  padding-top: 6px; border-top: 1px solid var(--grey-2);
}

.m-action-row {
  background: var(--paper); border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
  border-left: 3px solid var(--grey-3);
}
.m-action-row .top {
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
}
.m-action-row .id {
  font-family: var(--mono); font-size: 10px; color: var(--grey-7); font-weight: 600;
}
.m-action-row .status {
  margin-left: auto;
  font-size: 9.5px; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 999px;
  font-weight: 700;
}
.m-action-row .status.in-progress { background: var(--brand-cyan-tint); color: var(--brand-cyan-deep); }
.m-action-row .status.not-started { background: var(--grey-2); color: var(--grey-11); }
.m-action-row .status.completed { background: var(--good-tint); color: var(--good); }
.m-action-row .status.deferred { background: var(--warn-tint); color: var(--warn); }
.m-action-row .title {
  font-family: var(--serif); font-size: 13.5px; font-weight: 600;
  line-height: 1.3; letter-spacing: -0.005em;
}
.m-action-row .meta {
  margin-top: 8px;
  display: flex; gap: 14px; align-items: center;
  font-size: 11px; color: var(--grey-11);
}
.m-action-row .meta .lbl {
  font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--grey-7); font-weight: 600; margin-right: 4px;
}
.m-action-row .bar-row {
  margin-top: 8px;
  display: flex; align-items: center; gap: 8px;
}
.m-action-row .bar-track {
  flex: 1; height: 4px; background: var(--grey-2); border-radius: 2px; overflow: hidden;
}
.m-action-row .bar-fill {
  height: 100%; background: var(--brand-cyan);
}
.m-action-row .bar-pct {
  font-family: var(--mono); font-size: 10.5px; font-weight: 600;
  color: var(--grey-11); min-width: 30px; text-align: right;
}

/* Download screen */
.m-download {
  background: var(--paper); border-radius: 14px;
  padding: 20px;
  text-align: center;
  margin: 12px 0;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-download .icon {
  width: 64px; height: 64px; border-radius: 16px;
  background: var(--brand-magenta);
  color: #fff;
  margin: 6px auto 16px;
  display: grid; place-items: center;
}
.m-download h2 {
  font-family: var(--serif); font-size: 18px; font-weight: 600;
  letter-spacing: -0.01em; margin-bottom: 6px;
}
.m-download p {
  font-size: 12.5px; color: var(--grey-11); line-height: 1.5;
  margin: 0 0 16px;
}
.m-download .file {
  background: var(--grey-1); border: 1px solid var(--grey-2);
  border-radius: 8px; padding: 10px 12px;
  font-family: var(--mono); font-size: 11px;
  color: var(--ink-2); display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 14px;
}
.m-download .dl-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--brand-magenta); color: #fff;
  border: 0; border-radius: 999px;
  padding: 10px 22px;
  font-size: 13px; font-weight: 600; font-family: var(--sans);
  letter-spacing: -0.005em;
  cursor: pointer;
}

/* Empty state */
.m-empty {
  background: var(--paper); border-radius: 14px;
  padding: 28px 22px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
  margin: 12px 0;
}
.m-empty .icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--grey-1); margin: 0 auto 12px;
  display: grid; place-items: center; color: var(--grey-7);
}
.m-empty h3 {
  font-family: var(--serif); font-size: 15px; font-weight: 600; margin-bottom: 4px;
}
.m-empty p {
  font-size: 11.5px; color: var(--grey-11); margin: 0; line-height: 1.5;
}

/* Slide transitions */
.m-screens-stack { position: absolute; inset: 44px 0 0 0; }
.m-page {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  background: #F5F6F7;
  transition: transform .28s cubic-bezier(.32,.72,.34,1), opacity .28s ease;
}
.m-page.out-left { transform: translateX(-30%); opacity: 0.5; }
.m-page.in-right { transform: translateX(100%); }
.m-page.in-right.active { transform: translateX(0); }
`;

// ─── Icons ─────────────────────────────────────────────────────────────────
function Chev({ size = 14, dir = "right" }) {
  const rot = { right: 0, left: 180, down: 90, up: -90 }[dir] || 0;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
         style={{ transform: `rotate(${rot}deg)` }}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function IconStatusWifi() {
  return <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M8.5 2.31C10.61 2.31 12.63 3.11 14.15 4.56C14.27 4.67 14.45 4.67 14.56 4.55L15.83 3.27C15.95 3.16 15.95 2.97 15.83 2.85C13.81 0.92 11.21 -0.13 8.5 -0.13C5.79 -0.13 3.19 0.92 1.17 2.85C1.05 2.97 1.05 3.16 1.17 3.27L2.44 4.55C2.55 4.67 2.73 4.67 2.85 4.56C4.37 3.11 6.39 2.31 8.5 2.31ZM8.5 6.13C9.84 6.13 11.13 6.65 12.1 7.59C12.21 7.7 12.39 7.71 12.51 7.59L13.78 6.31C13.89 6.2 13.89 6.01 13.78 5.89C12.34 4.52 10.45 3.75 8.5 3.75C6.55 3.75 4.66 4.52 3.22 5.89C3.11 6.01 3.11 6.2 3.22 6.31L4.49 7.59C4.61 7.71 4.79 7.7 4.9 7.59C5.87 6.65 7.16 6.13 8.5 6.13ZM10.66 8.92C10.78 8.81 10.78 8.62 10.66 8.5C10.07 7.94 9.31 7.63 8.5 7.63C7.69 7.63 6.93 7.94 6.34 8.5C6.22 8.62 6.22 8.81 6.34 8.92L8.32 10.91C8.42 11.01 8.58 11.01 8.68 10.91L10.66 8.92Z"/></svg>;
}
function IconStatusBatt() {
  return <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="3.5" width="1.5" height="5" rx="0.5" fill="currentColor" opacity="0.4"/></svg>;
}

// ─── Utilities ────────────────────────────────────────────────────────────
function fmtDate(s, style = "medium") {
  const d = window.MS_DATE.parseLocal(s);
  if (style === "long") return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  if (style === "weekday") return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusClass(s) {
  const n = (s || "").toLowerCase();
  if (n.includes("complete") || n === "closed") return "completed";
  if (n.includes("progress") || n.includes("on track") || n.includes("at risk")) return "in-progress";
  if (n.includes("defer") || n.includes("off track") || n.includes("escalat")) return "deferred";
  return "not-started";
}

// Pull a short clean phrase out of an agenda item for the meetings-list bullet
function shortAgenda(item) {
  const t = (item.title || "").trim();
  if (t.length > 60) return t.slice(0, 58) + "…";
  return t || (item.category || "Item");
}

// ─── Meeting/entry helper ─────────────────────────────────────────────────────
function entryToMeeting(entry) {
  if (entry.kind === "filed" && entry.m) return { ...entry.m, scheduled: false };
  // Synthesize a stub for scheduled-only entries.
  return {
    id: `scheduled:${entry.committee}:${entry.date}`,
    date: entry.date,
    committee: entry.committee,
    type: entry.session || "Scheduled",
    time: entry.time || null,
    modality: null,
    presidingOfficer: null,
    items: [], topics: [],
    present: [], absent: [], exOfficio: [], guests: [], recused: [],
    attendanceRate: null,
    minutesStatus: "Pending intake",
    scheduled: true,
  };
}

// ─── Committee lookup (handles OCA as a pseudo-committee) ─────────────────
const OCA_COMMITTEE = {
  id: "OCA",
  short: "OCA",
  name: "Office of Curricular Affairs",
  color: "var(--brand-violet)",
  deep: "var(--brand-violet)",
  tint: "var(--brand-violet-tint)",
  cadence: "Mondays 10 am – 12 pm · Thursdays 1:30 – 2:30 pm",
  charge: "Weekly operational meetings of the Office of Curricular Affairs. Minutes are filed separately from the EEC and its subcommittees.",
};
function getCommittee(id) {
  if (id === "OCA") return OCA_COMMITTEE;
  return window.EEC.committeeById[id];
}

// ─── App shell ────────────────────────────────────────────────────────────
function MobileApp() {
  // route stack: each entry is { screen, params }
  // home → committee → meeting → detail(kind)
  const [stack, setStack] = useStateMA([{ screen: "home" }]);
  const cur = stack[stack.length - 1];

  function push(entry) { setStack(s => [...s, entry]); }
  function pop() { setStack(s => s.length > 1 ? s.slice(0, -1) : s); }

  // Status bar time (live)
  const [now, setNow] = useStateMA(() => new Date());
  useEffectMA(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(/\s*[AP]M$/i, "");

  // Inject mobile CSS once
  useEffectMA(() => {
    if (document.getElementById("__m_css")) return;
    const s = document.createElement("style");
    s.id = "__m_css";
    s.textContent = MOBILE_CSS;
    document.head.appendChild(s);
  }, []);

  const screen = cur.screen;
  const sectionTitles = {
    overview: "Overview",
    actions: "Action Items",
    motions: "Motions & Votes",
    members: "Members",
    attendance: "Attendance",
    reviews: "Curriculum Reviews",
    policies: "Policies",
    linkage: "Linkage Map",
    "reviews-phase": "Phase Reviews",
    "action-plans":  "Action Plans",
    "review-full":   "Full Curriculum Review",
  };
  const itemTitles = {
    action: "Action Item",
    motion: "Motion",
    member: "Member",
    review: "Curriculum Review",
    policy: "Policy",
    "agenda-item": "Agenda Item",
  };
  const screenLabel =
    screen === "home" ? "Home" :
    screen === "committee" ? `${cur.params.committeeId} Meetings` :
    screen === "meeting" ? `Meeting Detail` :
    screen === "detail" ? `Detail · ${cur.params.kind}` :
    screen === "section" ? sectionTitles[cur.params.section] || "Section" :
    screen === "item" ? itemTitles[cur.params.kind] || "Item" : "Screen";

  return (
    <div className="m-screen" data-screen-label={screenLabel}>
      {/* iOS-style status bar */}
      <div className="m-status">
        <span>{timeStr}</span>
        <div className="icons">
          <IconStatusWifi />
          <span style={{ marginLeft: 6 }}><IconStatusBatt /></span>
        </div>
      </div>

      {/* Nav bar (back chrome) on non-home screens */}
      {screen !== "home" && (
        <div className="m-nav">
          <button className="back" onClick={pop}>
            <Chev dir="left" size={18} />
            <span>{stack.length > 2 ? "Back" : "Home"}</span>
          </button>
          <div className="title">
            {screen === "committee" && getCommittee(cur.params.committeeId)?.short}
            {screen === "meeting" && fmtDate(cur.params.entry.date, "medium")}
            {screen === "detail" && detailTitle(cur.params.kind)}
            {screen === "section" && (sectionTitles[cur.params.section] || "Section")}
            {screen === "item" && (itemTitles[cur.params.kind] || "Item")}
          </div>
          <div className="right"></div>
        </div>
      )}

      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {screen === "home"      && <HomeScreen
                                      onPick={(id) => push({ screen: "committee", params: { committeeId: id } })}
                                      onSection={(name) => push({ screen: "section", params: { section: name } })}
                                    />}
        {screen === "committee" && <CommitteeScreen committeeId={cur.params.committeeId} onPick={(entry) => push({ screen: "meeting", params: { entry } })} />}
        {screen === "meeting"   && <MeetingScreen entry={cur.params.entry} onPick={(kind) => push({ screen: "detail", params: { entry: cur.params.entry, kind } })} />}
        {screen === "detail"    && <DetailScreen entry={cur.params.entry} kind={cur.params.kind}
                                                  onItem={(itemKind, params) => push({ screen: "item", params: { kind: itemKind, ...params } })} />}
        {screen === "section"   && <SectionScreen section={cur.params.section}
                                                  onSection={(name) => push({ screen: "section", params: { section: name } })}
                                                  onItem={(kind, id) => push({ screen: "item", params: { kind, id } })} />}
        {screen === "item"      && <ItemScreen kind={cur.params.kind} id={cur.params.id} meetingId={cur.params.meetingId} idx={cur.params.idx} />}
      </div>
    </div>
  );
}

// Section/item dispatchers
function SectionScreen({ section, onSection, onItem }) {
  const S = window.MobileSections;
  if (!S) return <div className="m-body"><div className="m-empty"><h3>Loading…</h3></div></div>;
  switch (section) {
    case "overview":       return <S.OverviewScreen   onSection={onSection} onItem={onItem} />;
    case "actions":        return <S.ActionsScreen    onItem={onItem} />;
    case "motions":        return <S.MotionsScreen    onItem={onItem} />;
    case "members":        return <S.MembersScreen    onItem={onItem} />;
    case "attendance":     return <S.AttendanceScreen />;
    case "reviews":        return <S.ReviewsScreen    onItem={onItem} />;
    case "policies":       return <S.PoliciesScreen   onItem={onItem} />;
    case "linkage":        return <S.LinkageScreen   />;
    case "reviews-phase":  return <S.PhaseReviewsScreen onItem={onItem} />;
    case "action-plans":   return <S.ActionPlansScreen onItem={onItem} />;
    case "review-full":    return <S.ReviewDetail id="rev-full-2024" />;
    default:               return <div className="m-body"><div className="m-empty"><h3>Unknown section</h3></div></div>;
  }
}

function ItemScreen({ kind, id, meetingId, idx }) {
  const S = window.MobileSections;
  if (!S) return <div className="m-body"><div className="m-empty"><h3>Loading…</h3></div></div>;
  switch (kind) {
    case "action":      return <S.ActionDetail id={id} />;
    case "motion":      return <S.MotionDetail id={id} />;
    case "member":      return <S.MemberDetail id={id} />;
    case "review":      return <S.ReviewDetail id={id} />;
    case "policy":      return <S.PolicyDetail id={id} />;
    case "agenda-item": return <S.AgendaItemDetail meetingId={meetingId} idx={idx} />;
    default:            return <div className="m-body"><div className="m-empty"><h3>Unknown item</h3></div></div>;
  }
}

function detailTitle(kind) {
  return {
    summary: "Meeting Summary",
    governance: "Governance Action Plans",
    operational: "Operational Action Plans",
    download: "Download Minutes",
  }[kind] || kind;
}

// ─── Screen: Home ─────────────────────────────────────────────────────────
function HomeScreen({ onPick, onSection }) {
  const C = window.EEC.COMMITTEES;
  const SCHED = window.MOBILE_SCHEDULE;

  const lastSync = new Date(window.EEC.TODAY);
  const lastSyncStr = lastSync.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // OCA stats (recurring weekly schedule)
  const ocaNext = SCHED.nextMeeting("OCA");

  const tiles = ["EEC", "PCCS", "CCS", "AES"].map(id => {
    const c = window.EEC.committeeById[id];
    return {
      ...c,
      total: SCHED.totalCount(id),
      filed: SCHED.filedCount(id),
      next: SCHED.nextMeeting(id),
    };
  });

  return (
    <div className="m-body" style={{ paddingTop: 0 }}>
      {/* Header rolled into body */}
      <div className="m-header" style={{ padding: "8px 0 18px" }}>
        <div className="brand">
          <span className="dot"></span>
          <span>ASCEND Governance</span>
        </div>
        <div className="sub">
          Mount Sinai · MD Program · Office of Curricular Affairs
        </div>
        <div className="meta">
          <span className="pill-ay">AY 2025–26</span>
          <span style={{ color: "var(--grey-7)", letterSpacing: "0.04em", textTransform: "none", fontSize: 11, fontWeight: 500 }}>
            Last sync · {lastSyncStr}
          </span>
        </div>
      </div>

      {/* OCA hero button */}
      <button className="m-oca" onClick={() => onPick("OCA")}>
        <div>
          <div className="eyebrow"><span className="dot"></span>OCA</div>
          <div className="title">Curricular Affairs<br/>Meetings</div>
          <div className="stats">
            <span>Mon 10am–12pm · Thu 1:30–2:30pm</span>
            {ocaNext && <>
              <span className="sep"></span>
              <span>Next · {window.MS_DATE.parseLocal(ocaNext.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
            </>}
          </div>
        </div>
        <div className="chev"><Chev size={14} /></div>
      </button>

      {/* 2x2 committee grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        {tiles.map(t => <CommitteeTile key={t.id} c={t} onPick={onPick} />)}
      </div>

      {/* Explore the rest of the desktop dashboard from here */}
      {window.MobileSections && <window.MobileSections.ExploreList onPick={onSection} />}

      <div style={{ fontSize: 10.5, color: "var(--grey-7)", textAlign: "center", marginTop: 22, lineHeight: 1.55 }}>
        16 EEC minutes filed through May 2026. Subcommittee minutes (PCCS · CCS · AES · CIS) and OCA minutes pending intake from each chair.
      </div>
    </div>
  );
}

function CommitteeTile({ c, onPick }) {
  const nextDate = c.next ? window.MS_DATE.parseLocal(c.next.date) : null;
  return (
    <button className="m-tile" onClick={() => onPick(c.id)}>
      <span className="stripe" style={{ background: c.color }}></span>
      <span className="chev"><Chev size={12} /></span>
      <div className="short" style={{ color: c.deep }}>{c.short}</div>
      <div className="name">{c.name.replace(/Subcommittee$/, "Subcom.")}</div>
      <div className="stat">
        {c.filed > 0 ? (
          <span><span className="num">{c.filed}</span> meetings on record</span>
        ) : (
          <span style={{ fontStyle: "italic", color: "var(--grey-7)" }}>Pending intake</span>
        )}
      </div>
      {nextDate && (
        <div style={{ fontSize: 10, color: "var(--grey-11)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ textTransform: "uppercase", fontSize: 9, fontWeight: 600, color: "var(--grey-7)" }}>Next</span>
          <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>
            {nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      )}
    </button>
  );
}

// ─── Screen: Committee Meetings list ──────────────────────────────────────
function CommitteeScreen({ committeeId, onPick }) {
  const entries = window.MOBILE_SCHEDULE.committeeMeetings(committeeId);
  const bodyRef = React.useRef(null);

  // Group by month
  const grouped = useMemoMA(() => {
    const out = new Map();
    entries.forEach(e => {
      const k = e.date.slice(0, 7);
      if (!out.has(k)) out.set(k, []);
      out.get(k).push(e);
    });
    return [...out.entries()];
  }, [committeeId]);

  // Open scrolled to the current month (or closest upcoming month if today has no entries).
  useEffectMA(() => {
    if (!bodyRef.current) return;
    const todayKey = window.MS_DATE.ymdLocal(new Date()).slice(0, 7);
    const groups = [...bodyRef.current.querySelectorAll("[data-month]")];
    let target = groups.find(g => g.dataset.month === todayKey);
    if (!target) {
      // groups are in DOM order = descending. Walk ascending to find first >= today.
      target = [...groups].reverse().find(g => g.dataset.month >= todayKey);
    }
    if (target) {
      bodyRef.current.scrollTop = target.offsetTop - bodyRef.current.offsetTop - 4;
    }
  }, [committeeId, grouped.length]);

  const c = getCommittee(committeeId);
  const headerInfo = committeeId === "OCA"
    ? { eyebrow: "Office of Curricular Affairs", title: "Curricular Affairs Meetings", sub: "Weekly operational meetings of the Office — Mondays 10 am – 12 pm and Thursdays 1:30 – 2:30 pm. Minutes are filed separately from the EEC." }
    : { eyebrow: c.short + " · " + (c.cadence?.split("(")[0].trim() || ""), title: c.name, sub: c.charge };

  const filedCount = entries.filter(e => e.kind === "filed").length;

  return (
    <div className="m-body" ref={bodyRef}>
      <div className="m-section-head" style={{ padding: "10px 4px 12px" }}>
        <div className="eyebrow">{headerInfo.eyebrow}</div>
        <h2>{headerInfo.title}</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          {headerInfo.sub}
        </div>
        {entries.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11, color: "var(--grey-11)" }}>
            <span><strong style={{ color: "var(--ink)", fontFamily: "var(--mono)" }}>{filedCount}</strong> on record</span>
            <span style={{ color: "var(--grey-5)" }}>·</span>
            <span><strong style={{ color: "var(--ink)", fontFamily: "var(--mono)" }}>{entries.length - filedCount}</strong> scheduled</span>
          </div>
        )}
      </div>

      {entries.length === 0 && (
        <div className="m-empty">
          <div className="icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>
            </svg>
          </div>
          <h3>Pending intake</h3>
          <p>No meetings have been scheduled yet.</p>
        </div>
      )}

      {grouped.map(([month, arr]) => {
        const d = window.MS_DATE.parseLocal(month + "-01");
        const isCurrent = month === window.MS_DATE.ymdLocal(new Date()).slice(0, 7);
        return (
          <div key={month} data-month={month}>
            <div className="m-meet-month" style={isCurrent ? { color: "var(--brand-cyan-deep)", display: "flex", alignItems: "center", gap: 8 } : null}>
              {d.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              {isCurrent && (
                <span style={{ fontSize: 9, padding: "1px 6px", background: "var(--brand-cyan-tint)", color: "var(--brand-cyan-deep)", borderRadius: 999, letterSpacing: "0.04em" }}>
                  This month
                </span>
              )}
            </div>
            {arr.map((e, i) => (
              <MeetingRow key={(e.m && e.m.id) || (e.date + "-" + i)}
                          entry={e}
                          committee={c}
                          onPick={onPick} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function MeetingRow({ entry, committee, onPick }) {
  const c = committee;
  const d = window.MS_DATE.parseLocal(entry.date);
  const today = new Date(); today.setHours(0,0,0,0);
  const future = d >= today;
  const isFiled = entry.kind === "filed";
  const m = entry.m; // only present for filed entries
  const items = isFiled ? (m.items || []).slice(0, 3) : [];

  return (
    <button className="m-meet-row"
            style={{ borderLeft: `3px solid ${c.color}` }}
            onClick={() => onPick(entry)}>
      <div className="date-block" style={{ background: c.tint }}>
        <div className="dow" style={{ color: c.deep }}>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
        <div className="day" style={{ color: c.deep }}>{d.getDate()}</div>
        <div className="mo" style={{ color: c.deep }}>{d.toLocaleDateString("en-US", { month: "short" })}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="meta">
          <span style={{ color: "var(--grey-11)", fontSize: 11 }}>
            {isFiled
              ? (m.type?.replace("Regular Scheduled Meeting", "Regular") || "Regular")
              : (entry.session || entry.time || "Scheduled")}
          </span>
          <span className={"status" + (future ? " future" : "")}>
            {isFiled ? m.minutesStatus : (future ? "Scheduled" : "Pending")}
          </span>
        </div>
        {isFiled && items.length > 0 ? (
          <ul className="agenda">
            {items.map((it, i) => <li key={i}>{shortAgenda(it)}</li>)}
            {m.items && m.items.length > 3 && (
              <li className="more">+{m.items.length - 3} more agenda items</li>
            )}
          </ul>
        ) : isFiled ? (
          <ul className="agenda">
            {(m.topics || []).slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        ) : (
          <div style={{
            fontSize: 11.5, color: "var(--grey-7)", fontStyle: "italic",
            marginTop: 4, lineHeight: 1.4,
          }}>
            {future ? "Agenda not yet circulated" : "Minutes pending intake"}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Screen: Meeting Detail (4 big buttons) ───────────────────────────────
function MeetingScreen({ entry, onPick }) {
  const m = entryToMeeting(entry);
  const c = getCommittee(m.committee);
  const md = !m.scheduled && window.MEETING_DETAILS && window.MEETING_DETAILS[m.id];
  const govActions = md ? md.actions.filter(a => a.kind === "governance") : [];
  const opActions  = md ? md.actions.filter(a => a.kind === "operational") : [];
  const motions    = m.scheduled ? [] : window.EEC.MOTIONS.filter(v => v.meetingId === m.id);
  const hasFile = !m.scheduled && window.MOBILE_SCHEDULE.hasMinutesFile(m.date);

  const buttons = [
    { kind: "summary",     label: "Meeting Summary",          count: m.scheduled ? null : (m.items?.length || 0), sub: m.scheduled ? "not circulated" : "agenda items", color: "var(--brand-violet)", disabled: m.scheduled },
    { kind: "governance",  label: "Governance Action Plans",   count: m.scheduled ? null : govActions.length, sub: m.scheduled ? "pending" : "plans", color: "var(--brand-cyan)",  disabled: m.scheduled },
    { kind: "operational", label: "Operational Action Plans",  count: m.scheduled ? null : opActions.length,  sub: m.scheduled ? "pending" : "plans", color: "var(--good)",        disabled: m.scheduled },
    { kind: "download",    label: hasFile ? "Download Minutes" : "Minutes Unavailable", count: null, sub: hasFile ? ".docx" : (m.scheduled ? "pending intake" : "not on file"), color: hasFile ? "var(--brand-magenta)" : "var(--grey-5)", disabled: !hasFile },
  ];

  return (
    <div className="m-body">
      {/* Meeting header card */}
      <div className="m-detail-card" style={{ borderTop: `3px solid ${c.color}` }}>
        <div className="eyebrow" style={{ color: c.deep }}>{c.short} · {m.type?.replace("Regular Scheduled Meeting", "Regular Meeting")}</div>
        <h1>{fmtDate(m.date, "weekday")}</h1>
        {m.scheduled && (
          <div style={{
            marginTop: 10,
            padding: "8px 12px",
            background: "var(--brand-cyan-tint)",
            color: "var(--brand-cyan-deep)",
            borderRadius: 8,
            fontSize: 11.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
            Scheduled — minutes not yet filed
          </div>
        )}
        <div className="meta-grid">
          {m.time && <div className="row"><div className="lbl">Time</div><div className="val">{m.time}</div></div>}
          {m.modality && <div className="row"><div className="lbl">Modality</div><div className="val">{m.modality}</div></div>}
          {!m.scheduled && m.present && m.present.length > 0 && (
            <div className="row" style={{ gridColumn: "span 2" }}>
              <div className="lbl">Voting attendance</div>
              <div className="val">
                {m.present.length} present · {m.absent?.length || 0} absent
                {m.attendanceRate != null && (
                  <span style={{ color: "var(--grey-7)", marginLeft: 6, fontFamily: "var(--mono)" }}>
                    ({Math.round(m.attendanceRate * 100)}%)
                  </span>
                )}
              </div>
            </div>
          )}
          {!m.scheduled && m.presidingOfficer && (
            <div className="row" style={{ gridColumn: "span 2" }}>
              <div className="lbl">Presiding</div>
              <div className="val">{m.presidingOfficer.split(/[,(]/)[0].trim()}</div>
            </div>
          )}
          {motions.length > 0 && (
            <div className="row" style={{ gridColumn: "span 2" }}>
              <div className="lbl">Motions voted</div>
              <div className="val">{motions.length} · {motions.filter(v => v.result === "Approved").length} approved</div>
            </div>
          )}
        </div>
      </div>

      {/* 2x2 button grid */}
      <div className="m-action-grid">
        {buttons.map(b => (
          <button key={b.kind} className="m-action-btn"
                  disabled={b.disabled}
                  style={b.disabled ? { opacity: 0.55, cursor: "not-allowed" } : null}
                  onClick={() => !b.disabled && onPick(b.kind)}>
            <div className="icon" style={{ background: b.color }}>
              {b.kind === "summary" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
              )}
              {b.kind === "governance" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 4 6 6"/><path d="m11 7 6 6-2 2-6-6z"/><path d="m9 9-6 6 2 2 6-6"/><path d="M14 21h8"/></svg>
              )}
              {b.kind === "operational" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2.5 2.5L16 9"/></svg>
              )}
              {b.kind === "download" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              )}
            </div>
            {b.count != null && <div className="count">{b.count}</div>}
            <div className="label">{b.label}</div>
            <div className="arrow">{b.count != null ? `${b.count} ${b.sub}` : `Open ${b.sub}`} <Chev size={10} /></div>
          </button>
        ))}
      </div>

      {/* Topics chips */}
      {m.topics && m.topics.length > 0 && (
        <div style={{ background: "var(--paper)", borderRadius: 12, padding: "12px 14px", marginBottom: 8, boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06)" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-11)", fontWeight: 600, marginBottom: 8 }}>
            Topics
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {m.topics.slice(0, 8).map((t, i) => (
              <span key={i} style={{
                fontSize: 11, color: "var(--ink-2)",
                padding: "3px 9px", background: "var(--grey-1)",
                border: "1px solid var(--grey-2)", borderRadius: 999,
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen: Sub-detail (Summary / Gov / Ops / Download) ──────────────────
function DetailScreen({ entry, kind, onItem }) {
  const m = entryToMeeting(entry);
  const c = getCommittee(m.committee);

  if (kind === "summary")     return <SummaryDetail m={m} c={c} onItem={onItem} />;
  if (kind === "governance")  return <ActionPlansDetail m={m} c={c} kind="governance"  label="Governance Action Plans"  accent="var(--brand-cyan)" deep="var(--brand-cyan-deep)" />;
  if (kind === "operational") return <ActionPlansDetail m={m} c={c} kind="operational" label="Operational Action Plans" accent="var(--good)" deep="#176D3B" />;
  if (kind === "download")    return <DownloadDetail m={m} c={c} />;
  return null;
}

function SummaryDetail({ m, c, onItem }) {
  const items = m.items || [];
  const motions = window.EEC.MOTIONS.filter(v => v.meetingId === m.id);
  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow" style={{ color: c.deep }}>{c.short} · {fmtDate(m.date, "medium")}</div>
        <h2>Meeting Summary</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.5 }}>
          {items.length} agenda item{items.length === 1 ? "" : "s"} · {motions.length} motion{motions.length === 1 ? "" : "s"} voted · {m.present?.length || 0} voting members present
        </div>
      </div>

      {items.length === 0 && (
        <div className="m-empty">
          <h3>No agenda items recorded</h3>
          <p>This meeting's minutes were filed without itemized agenda detail.</p>
        </div>
      )}

      {items.map((it, i) => <AgendaItem key={i} item={it} onClick={() => onItem && onItem("agenda-item", { meetingId: m.id, idx: it.idx })} />)}
    </div>
  );
}

function AgendaItem({ item, onClick }) {
  const cat = (item.category || "").trim().toUpperCase();
  const catStyle =
    cat.includes("VOTING") ? { background: "var(--brand-magenta)", color: "#fff" } :
    cat.includes("DISCUSS") ? { background: "var(--brand-cyan-tint)", color: "var(--brand-cyan-deep)" } :
    cat.includes("REVIEW") ? { background: "var(--brand-violet-tint)", color: "var(--brand-violet)" } :
    cat.includes("INFO") ? { background: "var(--grey-2)", color: "var(--grey-11)" } :
    { background: "var(--grey-2)", color: "var(--grey-11)" };

  return (
    <button className="m-agenda-item"
            onClick={onClick}
            disabled={!onClick}
            style={{
              display: "block", textAlign: "left", border: 0,
              width: "100%", cursor: onClick ? "pointer" : "default",
              fontFamily: "inherit",
            }}>
      <div className="top">
        {item.idx && <span className="idx">§{item.idx}</span>}
        {cat && <span className="cat" style={catStyle}>{cat}</span>}
        {item.lcme && item.lcme.length > 0 && (
          <span style={{ fontSize: 9.5, color: "var(--grey-7)", fontFamily: "var(--mono)", marginLeft: "auto" }}>
            LCME {item.lcme.join(", ")}
          </span>
        )}
      </div>
      <div className="title" style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ flex: 1, minWidth: 0 }}>{item.title}</span>
        {onClick && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--grey-7)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 12px", marginTop: 4 }}>
            <polyline points="9 6 15 12 9 18"/>
          </svg>
        )}
      </div>
      {item.outcome && (
        <div className="outcome" style={{
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden", color: "var(--grey-11)", fontSize: 11.5,
        }}>{item.outcome}</div>
      )}
      {onClick && (
        <div style={{
          fontSize: 10.5, color: "var(--brand-cyan-deep)", fontWeight: 600,
          marginTop: 8, letterSpacing: "0.02em",
        }}>
          Open discussion summary →
        </div>
      )}
    </button>
  );
}

function ActionPlansDetail({ m, c, kind, label, accent, deep }) {
  const md = window.MEETING_DETAILS && window.MEETING_DETAILS[m.id];
  const actions = md ? md.actions.filter(a => a.kind === kind) : [];
  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow" style={{ color: deep }}>{c.short} · {fmtDate(m.date, "medium")}</div>
        <h2>{label}</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.5 }}>
          {!md
            ? "Appendix table not yet parsed for this meeting."
            : actions.length === 0
              ? `No ${kind} action plans in this meeting's appendix.`
              : `${actions.length} ${kind} action plan${actions.length === 1 ? "" : "s"} from the meeting appendix.`}
        </div>
      </div>

      {actions.length === 0 && (
        <div className="m-empty">
          <div className="icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2.5 2.5L16 9"/></svg>
          </div>
          <h3>No items recorded</h3>
          <p>{kind === "governance"
            ? "No governance action plans were included in this meeting's appendix."
            : "No operational action plans were included in this meeting's appendix."}</p>
        </div>
      )}

      {actions.map((a, i) => <ActionPlanRow key={i} a={a} accent={accent} />)}
    </div>
  );
}

function ActionPlanRow({ a, accent }) {
  return (
    <div className="m-action-row" style={{ borderLeftColor: accent }}>
      <div className="title">{a.description}</div>
      <div style={{
        marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--grey-2)",
        display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px",
        fontSize: 11.5, lineHeight: 1.4,
      }}>
        {a.responsible && (<>
          <span style={{ color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9.5, fontWeight: 600, paddingTop: 2 }}>Responsible</span>
          <span style={{ color: "var(--ink-2)" }}>{a.responsible}</span>
        </>)}
        {a.target && (<>
          <span style={{ color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9.5, fontWeight: 600, paddingTop: 2 }}>Target</span>
          <span style={{ color: "var(--ink-2)" }}>{a.target}</span>
        </>)}
        {a.followUp && (<>
          <span style={{ color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9.5, fontWeight: 600, paddingTop: 2 }}>Follow-up</span>
          <span style={{ color: "var(--ink-2)" }}>{a.followUp}</span>
        </>)}
        {a.lcme && a.lcme.length > 0 && (<>
          <span style={{ color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9.5, fontWeight: 600, paddingTop: 2 }}>LCME</span>
          <span style={{ color: "var(--ink-2)", fontFamily: "var(--mono)", fontSize: 11 }}>{a.lcme.join(", ")}</span>
        </>)}
      </div>
    </div>
  );
}

function ActionsDetail({ m, c, kind, label, accent, deep }) {
  // Legacy — kept for compatibility but no longer used.
  const actions = window.EEC.ACTIONS.filter(a => a.originatingMeeting === m.id && a.kind === kind);
  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow" style={{ color: deep }}>{c.short} · {fmtDate(m.date, "medium")}</div>
        <h2>{label}</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.5 }}>
          {actions.length === 0
            ? "No items in this category from this meeting."
            : `${actions.length} action item${actions.length === 1 ? "" : "s"} opened at this meeting.`}
        </div>
      </div>

      {actions.length === 0 && (
        <div className="m-empty">
          <div className="icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2.5 2.5L16 9"/></svg>
          </div>
          <h3>None opened here</h3>
          <p>{kind === "cqi" ? "No governance / CQI action items originated from this meeting." : "No operational action items originated from this meeting."}</p>
        </div>
      )}

      {actions.map(a => <ActionRow key={a.id} a={a} accent={accent} />)}
    </div>
  );
}

function ActionRow({ a, accent }) {
  const owner = a.ownerLabel || (a.ownerId && window.EEC.memberById[a.ownerId]?.name) || "—";
  const due = a.dueDate ? fmtDate(a.dueDate, "medium") : "No due date";
  const pct = a.percent != null ? a.percent : null;
  const sc = statusClass(a.status);
  return (
    <div className="m-action-row" style={{ borderLeftColor: accent }}>
      <div className="top">
        {a.id && <span className="id">{a.id}</span>}
        <span className={"status " + sc}>{a.status || "Open"}</span>
      </div>
      <div className="title">{a.title}</div>
      <div className="meta">
        <span><span className="lbl">Owner</span>{owner.length > 28 ? owner.slice(0, 26) + "…" : owner}</span>
        <span style={{ marginLeft: "auto" }}><span className="lbl">Due</span>{due}</span>
      </div>
      {pct != null && (
        <div className="bar-row">
          <div className="bar-track"><div className="bar-fill" style={{ width: pct + "%", background: accent }}></div></div>
          <div className="bar-pct">{pct}%</div>
        </div>
      )}
    </div>
  );
}

function DownloadDetail({ m, c }) {
  const filename = `EEC_Minutes_${m.date}.docx`;
  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow" style={{ color: c.deep }}>{c.short} · {fmtDate(m.date, "medium")}</div>
        <h2>Download Minutes</h2>
      </div>

      <div className="m-download">
        <div className="icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <h2>Approved Minutes</h2>
        <p>The official record for this {c.short} meeting, retained per Article VI §7 of the bylaws.</p>
        <a className="file" href={`minutes/${filename}`} target="_blank" rel="noopener" style={{ textDecoration: "none", cursor: "pointer" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          {filename}
        </a>
        <div>
          <button className="dl-btn" onClick={() => {
            const a = document.createElement("a");
            a.href = `minutes/${filename}`;
            a.download = filename;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download .docx
          </button>
        </div>
      </div>

      <div style={{ background: "var(--paper)", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06)" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-11)", fontWeight: 600, marginBottom: 8 }}>
          Document properties
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", fontSize: 12 }}>
          <span style={{ color: "var(--grey-11)" }}>Meeting</span><span style={{ color: "var(--ink-2)" }}>{c.short} · {m.type?.replace("Regular Scheduled Meeting", "Regular") || ""}</span>
          <span style={{ color: "var(--grey-11)" }}>Date</span><span style={{ color: "var(--ink-2)" }}>{fmtDate(m.date, "long")}</span>
          <span style={{ color: "var(--grey-11)" }}>Status</span><span style={{ color: "var(--ink-2)" }}>{m.minutesStatus}</span>
          <span style={{ color: "var(--grey-11)" }}>Format</span><span style={{ color: "var(--ink-2)" }}>Word (.docx)</span>
        </div>
      </div>
    </div>
  );
}

window.MobileApp = MobileApp;
