// mobile-sections.jsx — Section screens that mirror the desktop dashboard
//   Overview · Actions · Motions · Members · Reviews · Policies · Attendance · Linkage
// Each is reachable from the home "Explore" grid. Items inside push detail screens.

const { useState: useStateMS, useMemo: useMemoMS } = React;

// ─── Section-specific CSS (appended to the existing #__m_css) ─────────────
const SECTIONS_CSS = `
/* Generic chip toolbar (filters at the top of a list screen) */
.m-chiprow {
  display: flex; gap: 6px; overflow-x: auto; padding: 4px 4px 10px;
  margin: 0 -4px 4px;
  scrollbar-width: none;
}
.m-chiprow::-webkit-scrollbar { display: none; }
.m-chip {
  flex: 0 0 auto;
  padding: 5px 11px; border-radius: 999px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.01em;
  background: var(--paper); color: var(--grey-11);
  border: 1px solid var(--grey-3);
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--sans);
}
.m-chip.active { background: var(--ink); color: #fff; border-color: var(--ink); }
.m-chip .count {
  margin-left: 5px; font-family: var(--mono); font-size: 10px;
  opacity: 0.75;
}

/* KPI strip on Overview */
.m-kpi-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  margin-bottom: 12px;
}
.m-kpi {
  background: var(--paper); border-radius: 12px;
  padding: 14px 14px 12px;
  border-top: 3px solid var(--grey-3);
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-kpi .lbl {
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600;
}
.m-kpi .val {
  font-family: var(--serif); font-size: 28px; font-weight: 600;
  letter-spacing: -0.02em; margin-top: 4px; line-height: 1;
  font-variant-numeric: tabular-nums;
}
.m-kpi .sub {
  font-size: 10.5px; color: var(--grey-11); margin-top: 6px; line-height: 1.35;
}

/* Card with a header bar */
.m-card {
  background: var(--paper); border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
  overflow: hidden;
}
.m-card .head {
  padding: 12px 14px 8px;
  border-bottom: 1px solid var(--grey-2);
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 8px;
}
.m-card .head .eyebrow {
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600;
}
.m-card .head h3 {
  font-family: var(--serif); font-size: 15px; font-weight: 600;
  letter-spacing: -0.01em; margin: 2px 0 0;
}
.m-card .head .link {
  font-size: 11px; color: var(--brand-cyan-deep); font-weight: 600;
  cursor: pointer;
}

/* Generic row inside a card */
.m-row {
  display: grid; grid-template-columns: 1fr auto; gap: 10px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--grey-2);
  cursor: pointer;
  align-items: center;
  text-align: left;
  width: 100%;
  background: transparent;
  border-left: 0; border-right: 0; border-top: 0;
}
.m-row:last-child { border-bottom: 0; }
.m-row:active { background: var(--grey-1); }
.m-row .ttl {
  font-size: 12.5px; color: var(--ink-2); font-weight: 500;
  line-height: 1.35;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.m-row .meta {
  font-size: 10.5px; color: var(--grey-11); margin-top: 4px;
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
}
.m-row .meta .sep { color: var(--grey-5); }
.m-row .right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  font-size: 10.5px; color: var(--grey-11);
  font-variant-numeric: tabular-nums;
}

/* Committee chip */
.m-cchip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 1px 7px 1px 6px; border-radius: 4px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.02em;
}
.m-cchip .dot { width: 6px; height: 6px; border-radius: 2px; }

/* Search box */
.m-search {
  position: relative;
  margin-bottom: 10px;
}
.m-search input {
  width: 100%; box-sizing: border-box;
  padding: 10px 12px 10px 34px;
  border: 1px solid var(--grey-3); border-radius: 10px;
  font-family: var(--sans); font-size: 13px;
  background: var(--paper); color: var(--ink);
  -webkit-appearance: none;
}
.m-search input::placeholder { color: var(--grey-7); }
.m-search .ic {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  color: var(--grey-7); pointer-events: none;
}

/* Status pill (mobile) */
.m-stp {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 999px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Donut center */
.m-donut-wrap {
  display: flex; align-items: center; gap: 18px;
  padding: 14px 16px;
}
.m-donut-wrap .legend {
  flex: 1; display: flex; flex-direction: column; gap: 7px;
  font-size: 11.5px;
}
.m-donut-wrap .legend .it {
  display: flex; align-items: center; gap: 8px;
}
.m-donut-wrap .legend .sw {
  width: 9px; height: 9px; border-radius: 2px;
}

/* Tally cells (motions) */
.m-tally {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 6px; margin-top: 10px;
}
.m-tally .cell {
  background: var(--grey-1); border-radius: 8px; padding: 8px 6px;
  text-align: center;
}
.m-tally .cell .v {
  font-family: var(--serif); font-size: 18px; font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.m-tally .cell .l {
  font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600; margin-top: 2px;
}

/* Detail body labels */
.m-kv {
  display: grid; grid-template-columns: 88px 1fr; gap: 6px 12px;
  font-size: 12px;
}
.m-kv .k {
  font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 600;
  padding-top: 2px;
}
.m-kv .v { color: var(--ink-2); line-height: 1.45; }

/* Block of running text */
.m-prose {
  font-size: 12.5px; color: var(--ink-2); line-height: 1.55;
}
.m-prose p { margin: 0 0 9px; }
.m-prose p:last-child { margin-bottom: 0; }
.m-prose strong { color: var(--ink); font-weight: 600; }

/* Member avatar */
.m-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--brand-violet-tint);
  color: var(--brand-violet);
  display: grid; place-items: center;
  font-family: var(--sans); font-size: 12.5px; font-weight: 700;
  flex: 0 0 36px;
}

/* Attendance bar */
.m-attbar { display: flex; align-items: center; gap: 8px; }
.m-attbar .track {
  flex: 1; height: 5px; background: var(--grey-2); border-radius: 3px;
  overflow: hidden;
}
.m-attbar .fill { height: 100%; }
.m-attbar .pct {
  font-family: var(--mono); font-size: 11px; font-weight: 600;
  min-width: 38px; text-align: right;
  font-variant-numeric: tabular-nums;
}

/* "Explore" home grid (entry points to sections) */
.m-explore-list {
  display: flex; flex-direction: column; gap: 8px;
  margin-top: 14px;
}
.m-explore-row {
  background: var(--paper); border-radius: 12px;
  border: 0;
  padding: 12px 14px;
  display: grid; grid-template-columns: 38px 1fr auto; gap: 12px;
  align-items: center;
  text-align: left; cursor: pointer; width: 100%;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-explore-row .ic {
  width: 38px; height: 38px; border-radius: 10px;
  display: grid; place-items: center; color: #fff;
}
.m-explore-row .ttl {
  font-family: var(--serif); font-size: 14.5px; font-weight: 600;
  letter-spacing: -0.005em;
  color: var(--ink);
}
.m-explore-row .sub {
  font-size: 11px; color: var(--grey-11); margin-top: 2px; line-height: 1.35;
}
.m-explore-row .badge {
  font-family: var(--mono); font-size: 11px; font-weight: 700;
  color: var(--grey-11);
  background: var(--grey-1);
  padding: 2px 8px; border-radius: 999px;
  margin-right: 4px;
}
.m-explore-row .badge.warn { background: var(--bad-tint); color: var(--bad); }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────
function statusPalette(s) {
  const n = (s || "").toLowerCase();
  if (n === "completed" || n === "closed") return { bg: "var(--good-tint)", fg: "var(--good)" };
  if (n.includes("progress") || n.includes("track")) return { bg: "var(--brand-cyan-tint)", fg: "var(--brand-cyan-deep)" };
  if (n.includes("defer") || n.includes("off track") || n.includes("escalat")) return { bg: "var(--warn-tint)", fg: "var(--warn)" };
  return { bg: "var(--grey-2)", fg: "var(--grey-11)" };
}

function StatusPill({ status }) {
  const p = statusPalette(status);
  return <span className="m-stp" style={{ background: p.bg, color: p.fg }}>{status || "Open"}</span>;
}

function CChip({ id, subtle }) {
  const c = window.EEC.committeeById[id];
  if (!c) return null;
  return (
    <span className="m-cchip" style={{
      background: subtle ? "transparent" : c.tint,
      color: c.deep,
      border: subtle ? `1px solid ${c.tint}` : "0",
    }}>
      <span className="dot" style={{ background: c.color }}></span>
      {c.short}
    </span>
  );
}

function initials(name) {
  if (!name) return "?";
  const parts = name.replace(/,.*$/, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase().slice(0, 2);
}

function shortName(name) {
  if (!name) return "—";
  return name.split(",")[0].trim();
}

function fmtD(s, style = "medium") {
  if (!s) return "—";
  const d = window.MS_DATE.parseLocal(s);
  if (style === "long") return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  if (style === "short") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function dayDiff(a, b) {
  const da = a instanceof Date ? a : window.MS_DATE.parseLocal(a);
  const db = b instanceof Date ? b : window.MS_DATE.parseLocal(b);
  return Math.round((db - da) / 86400000);
}

// Inject section CSS once
(function injectSectionCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById("__m_sections_css")) return;
  const s = document.createElement("style");
  s.id = "__m_sections_css";
  s.textContent = SECTIONS_CSS;
  document.head.appendChild(s);
})();

// ─── Donut chart (compact) ────────────────────────────────────────────────
function MiniDonut({ slices, size = 96, label, sub }) {
  const total = slices.reduce((s, x) => s + (x.value || 0), 0) || 1;
  const r = size / 2 - 7;
  const cx = size / 2, cy = size / 2;
  const stroke = 11;
  let acc = 0;
  const segs = slices.map(s => {
    const f = (s.value || 0) / total;
    const start = acc; acc += f;
    return { ...s, start, end: acc, f };
  }).filter(s => s.f > 0);
  function arc(start, end) {
    const a0 = start * 2 * Math.PI - Math.PI / 2;
    const a1 = end * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = (end - start) > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  }
  return (
    <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px` }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--grey-2)" strokeWidth={stroke} />
        {segs.map((s, i) => (
          <path key={i} d={arc(s.start, s.end)} stroke={s.color} strokeWidth={stroke} fill="none" />
        ))}
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: size * 0.24, fontWeight: 700, fontFamily: "var(--serif)", color: "var(--ink)", lineHeight: 1 }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: 9.5, color: "var(--grey-11)", marginTop: 2, letterSpacing: "0.04em" }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Section icons ────────────────────────────────────────────────────────
const SectionIcon = ({ name, size = 18 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "overview":   return <svg {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>;
    case "actions":
    case "action-plans":  return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2.5 2.5L16 9"/></svg>;
    case "motions":    return <svg {...p}><path d="m14 4 6 6"/><path d="m11 7 6 6-2 2-6-6z"/><path d="m9 9-6 6 2 2 6-6"/><path d="M14 21h8"/></svg>;
    case "members":    return <svg {...p}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M14 20c0-2 2-4 5-4"/></svg>;
    case "policies":   return <svg {...p}><path d="M4 5c0-1 1-2 2-2h13v17H6c-1 0-2 .5-2 2"/><path d="M4 5v17"/></svg>;
    case "reviews":
    case "review-full":
    case "reviews-phase": return <svg {...p}><path d="M12 4.5c-1.5-1-4-1.5-7-1.5v15c3 0 5.5.5 7 1.5"/><path d="M12 4.5c1.5-1 4-1.5 7-1.5v15c-3 0-5.5.5-7 1.5"/><path d="M12 4.5v15"/></svg>;
    case "attendance": return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="8" cy="15" r="1.4" fill="currentColor"/><circle cx="12" cy="15" r="1.4" fill="currentColor"/><circle cx="16" cy="15" r="1.4" fill="currentColor"/></svg>;
    case "linkage":    return <svg {...p}><path d="M10 13a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 11a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/></svg>;
    default: return null;
  }
};

// ─── ExploreList for home ─────────────────────────────────────────────────
function ExploreList({ onPick }) {
  const trackerCount = window.EEC.ACTIONS.filter(a => a.kind === "tracker").length;
  const phaseCount = window.EEC.REVIEWS.filter(r => /phase/i.test(r.title)).length;

  const items = [
    { kind: "review-full",   label: "Full Curriculum Review", sub: "AY 2023–24 · integrated longitudinal report", bg: "var(--brand-violet)", badge: null },
    { kind: "reviews-phase", label: "Phase Reviews",          sub: "Phase 1 (Pre-Clerkship) · Phase 2 (Clerkship)",   bg: "var(--brand-cyan)",   badge: phaseCount },
    { kind: "action-plans",  label: "Action Plans",            sub: "LCME closed-loop tracker items",                  bg: "var(--brand-magenta)", badge: trackerCount },
  ];

  return (
    <div className="m-explore-list" style={{ marginTop: 18 }}>
      <div className="m-meet-month" style={{ padding: "0 4px 6px" }}>Explore</div>
      {items.map(it => (
        <button key={it.kind} className="m-explore-row" onClick={() => onPick(it.kind)}>
          <span className="ic" style={{ background: it.bg }}><SectionIcon name={it.kind} /></span>
          <span style={{ minWidth: 0 }}>
            <div className="ttl">{it.label}</div>
            <div className="sub">{it.sub}</div>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {it.badge != null && (
              <span className={"badge" + (it.warn ? " warn" : "")}>{it.badge}</span>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--grey-7)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── SECTION SCREEN: Overview ─────────────────────────────────────────────
function OverviewScreen({ onSection, onItem }) {
  const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  const A = window.EEC.ACTIONS;
  const M = window.EEC.MEETINGS;
  const V = window.EEC.MOTIONS;

  const overdue = A.filter(a => a.status !== "Completed" && a.status !== "Deferred" &&
    window.MS_DATE.parseLocal(a.dueDate) < TODAY);
  const dueSoon = A.filter(a => a.status !== "Completed" && a.status !== "Deferred" &&
    window.MS_DATE.parseLocal(a.dueDate) >= TODAY &&
    dayDiff(TODAY, a.dueDate) <= 90);
  const openActions = A.filter(a => a.status !== "Completed").length;
  const motionsApproved = V.filter(v => v.result === "Approved").length;

  const pastMeetings = M.filter(m => m.minutesStatus !== "Scheduled");
  const attData = pastMeetings.filter(m => m.attendanceRate != null);
  const avgAtt = attData.length === 0 ? 0 :
    Math.round(100 * attData.reduce((s, m) => s + m.attendanceRate, 0) / attData.length);

  const statusCounts = { "Not Started": 0, "In Progress": 0, "Completed": 0, "Deferred": 0 };
  for (const a of A) {
    if (statusCounts[a.status] != null) statusCounts[a.status]++;
  }
  const closedPct = Math.round(100 * statusCounts["Completed"] / Math.max(1, A.length));

  const upcoming = M.filter(m => window.MS_DATE.parseLocal(m.date) >= TODAY)
    .sort((a,b) => window.MS_DATE.parseLocal(a.date) - window.MS_DATE.parseLocal(b.date))
    .slice(0, 4);
  const recentMotions = [...V]
    .sort((a,b) => window.MS_DATE.parseLocal(b.date) - window.MS_DATE.parseLocal(a.date))
    .slice(0, 5);
  const attentionRows = [
    ...overdue.slice(0, 3).map(a => ({ a, overdue: true })),
    ...dueSoon.slice(0, 3).map(a => ({ a, overdue: false })),
  ].slice(0, 6);

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Office of Curricular Affairs · AY 2025–26</div>
        <h2>Overview</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Read-only view of EEC governance — meetings, motions, action items, attendance.
        </div>
      </div>

      {/* KPI grid */}
      <div className="m-kpi-grid">
        <div className="m-kpi" style={{ borderTopColor: "var(--brand-violet)" }}>
          <div className="lbl">Open actions</div>
          <div className="val">{openActions}</div>
          <div className="sub">{statusCounts["Not Started"]} not started · {statusCounts["In Progress"]} in progress</div>
        </div>
        <div className="m-kpi" style={{ borderTopColor: overdue.length ? "var(--bad)" : "var(--warn)" }}>
          <div className="lbl">Needs attention</div>
          <div className="val">{overdue.length + dueSoon.length}</div>
          <div className="sub">{overdue.length} overdue · {dueSoon.length} due 90d</div>
        </div>
        <div className="m-kpi" style={{ borderTopColor: "var(--brand-cyan-deep)" }}>
          <div className="lbl">Motions voted</div>
          <div className="val">{V.length}</div>
          <div className="sub">{motionsApproved} approved · {V.length - motionsApproved} deferred/other</div>
        </div>
        <div className="m-kpi" style={{ borderTopColor: "var(--brand-magenta-deep)" }}>
          <div className="lbl">Avg attendance</div>
          <div className="val">{avgAtt}%</div>
          <div className="sub">{attData.length} mtgs · quorum 8 of 19</div>
        </div>
      </div>

      {/* Status donut */}
      <div className="m-card">
        <div className="head">
          <div>
            <div className="eyebrow">Action items</div>
            <h3>By status</h3>
          </div>
          <span className="link" onClick={() => onSection("actions")}>All actions →</span>
        </div>
        <div className="m-donut-wrap">
          <MiniDonut
            size={96}
            label={closedPct}
            sub="% closed"
            slices={[
              { value: statusCounts["Completed"],  color: "var(--good)" },
              { value: statusCounts["In Progress"],color: "var(--brand-cyan)" },
              { value: statusCounts["Not Started"],color: "var(--grey-7)" },
              { value: statusCounts["Deferred"],   color: "var(--warn)" },
            ]}
          />
          <div className="legend">
            <div className="it"><span className="sw" style={{ background: "var(--good)" }}></span><span style={{ flex: 1 }}>Completed</span><strong>{statusCounts["Completed"]}</strong></div>
            <div className="it"><span className="sw" style={{ background: "var(--brand-cyan)" }}></span><span style={{ flex: 1 }}>In progress</span><strong>{statusCounts["In Progress"]}</strong></div>
            <div className="it"><span className="sw" style={{ background: "var(--grey-7)" }}></span><span style={{ flex: 1 }}>Not started</span><strong>{statusCounts["Not Started"]}</strong></div>
            <div className="it"><span className="sw" style={{ background: "var(--warn)" }}></span><span style={{ flex: 1 }}>Deferred</span><strong>{statusCounts["Deferred"]}</strong></div>
          </div>
        </div>
      </div>

      {/* Needs attention */}
      <div className="m-card">
        <div className="head">
          <div>
            <div className="eyebrow" style={{ color: "var(--bad)" }}>Needs attention</div>
            <h3>Overdue &amp; due-soon</h3>
          </div>
          <span className="link" onClick={() => onSection("actions")}>Open →</span>
        </div>
        {attentionRows.length === 0 && (
          <div style={{ padding: 18, fontSize: 12, color: "var(--grey-11)", textAlign: "center" }}>
            Nothing overdue — closed-loop tracking is current.
          </div>
        )}
        {attentionRows.map(({ a, overdue }) => {
          const d = dayDiff(TODAY, a.dueDate);
          return (
            <button key={a.id} className="m-row" onClick={() => onItem("action", a.id)}>
              <div style={{ minWidth: 0 }}>
                <div className="ttl">{a.title}</div>
                <div className="meta">
                  <CChip id={a.committee} />
                  <span className="sep">·</span>
                  <span>{shortName(a.ownerLabel)}</span>
                </div>
              </div>
              <div className="right">
                <StatusPill status={a.status} />
                <span style={{ color: overdue ? "var(--bad)" : "var(--grey-11)", fontWeight: overdue ? 700 : 500 }}>
                  {overdue ? `${-d}d overdue` : `Due in ${d}d`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Upcoming meetings */}
      <div className="m-card">
        <div className="head">
          <div>
            <div className="eyebrow">Upcoming</div>
            <h3>Next meetings</h3>
          </div>
        </div>
        {upcoming.length === 0 && (
          <div style={{ padding: 18, fontSize: 12, color: "var(--grey-11)", textAlign: "center" }}>
            No meetings on file.
          </div>
        )}
        {upcoming.map(m => (
          <MeetingMiniRow key={m.id} m={m} />
        ))}
      </div>

      {/* Recent motions */}
      <div className="m-card">
        <div className="head">
          <div>
            <div className="eyebrow">Decisions</div>
            <h3>Recent motions</h3>
          </div>
          <span className="link" onClick={() => onSection("motions")}>All →</span>
        </div>
        {recentMotions.map(v => (
          <button key={v.id} className="m-row" onClick={() => onItem("motion", v.id)}>
            <div style={{ minWidth: 0 }}>
              <div className="ttl">{v.title}</div>
              <div className="meta">
                <CChip id={v.committee} />
                <span className="sep">·</span>
                <span>{fmtD(v.date)}</span>
              </div>
            </div>
            <div className="right">
              <StatusPill status={v.result} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MeetingMiniRow({ m }) {
  const c = window.EEC.committeeById[m.committee];
  const d = window.MS_DATE.parseLocal(m.date);
  return (
    <div className="m-row" style={{ cursor: "default" }}>
      <div style={{ minWidth: 0, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{
          flex: "0 0 38px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "4px 0", borderRadius: 6, background: c.tint, color: c.deep,
        }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {d.toLocaleDateString("en-US", { month: "short" })}
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
            {d.getDate()}
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="ttl" style={{ marginBottom: 2 }}>
            {m.topics && m.topics[0] ? m.topics[0] : (m.type || "Meeting")}
          </div>
          <div className="meta">
            <CChip id={m.committee} />
            <span className="sep">·</span>
            <span>{d.toLocaleDateString("en-US", { weekday: "long" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION SCREEN: Action Items ─────────────────────────────────────────
function ActionsScreen({ onItem }) {
  const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  const [filter, setFilter] = useStateMS("all"); // all | overdue | open | in-progress | completed
  const [committee, setCommittee] = useStateMS("ALL");

  const A = window.EEC.ACTIONS;

  const counts = useMemoMS(() => {
    const c = { all: A.length, overdue: 0, open: 0, "in-progress": 0, completed: 0 };
    for (const a of A) {
      if (a.status !== "Completed" && a.status !== "Deferred" &&
          window.MS_DATE.parseLocal(a.dueDate) < TODAY) c.overdue++;
      if (a.status !== "Completed") c.open++;
      if (a.status === "In Progress") c["in-progress"]++;
      if (a.status === "Completed") c.completed++;
    }
    return c;
  }, []);

  const filtered = useMemoMS(() => {
    let out = A;
    if (filter === "overdue") {
      out = out.filter(a => a.status !== "Completed" && a.status !== "Deferred" &&
        window.MS_DATE.parseLocal(a.dueDate) < TODAY);
    } else if (filter === "open") out = out.filter(a => a.status !== "Completed");
    else if (filter === "in-progress") out = out.filter(a => a.status === "In Progress");
    else if (filter === "completed") out = out.filter(a => a.status === "Completed");

    if (committee !== "ALL") out = out.filter(a => a.committee === committee);

    return [...out].sort((a, b) => {
      // Overdue first, then by due date
      const da = window.MS_DATE.parseLocal(a.dueDate);
      const db = window.MS_DATE.parseLocal(b.dueDate);
      return da - db;
    });
  }, [filter, committee]);

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">EEC Closed-Loop Tracker</div>
        <h2>Action Items</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          LCME tracker, CQI follow-ups, and operational items across all governance bodies.
        </div>
      </div>

      {/* Status filter row */}
      <div className="m-chiprow">
        {[
          ["all", "All"],
          ["overdue", "Overdue"],
          ["open", "Open"],
          ["in-progress", "In progress"],
          ["completed", "Completed"],
        ].map(([k, lbl]) => (
          <button key={k}
                  className={"m-chip" + (filter === k ? " active" : "")}
                  onClick={() => setFilter(k)}>
            {lbl}<span className="count">{counts[k]}</span>
          </button>
        ))}
      </div>

      {/* Committee filter row */}
      <div className="m-chiprow">
        <button className={"m-chip" + (committee === "ALL" ? " active" : "")} onClick={() => setCommittee("ALL")}>
          All committees
        </button>
        {window.EEC.COMMITTEES.map(c => (
          <button key={c.id}
                  className={"m-chip" + (committee === c.id ? " active" : "")}
                  onClick={() => setCommittee(c.id)}
                  style={committee === c.id ? { background: c.deep, borderColor: c.deep } : null}>
            {c.short}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 10.5, color: "var(--grey-7)", padding: "6px 4px 8px", letterSpacing: "0.06em" }}>
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </div>

      <div className="m-card" style={{ marginBottom: 0 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 22, fontSize: 12, color: "var(--grey-11)", textAlign: "center" }}>
            No items match this filter.
          </div>
        )}
        {filtered.map(a => {
          const d = dayDiff(TODAY, a.dueDate);
          const overdue = a.status !== "Completed" && a.status !== "Deferred" && d < 0;
          return (
            <button key={a.id} className="m-row" onClick={() => onItem("action", a.id)}>
              <div style={{ minWidth: 0 }}>
                <div className="ttl">{a.title}</div>
                <div className="meta">
                  <CChip id={a.committee} />
                  <span className="sep">·</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10 }}>{a.id}</span>
                  {a.ownerLabel && <><span className="sep">·</span><span>{shortName(a.ownerLabel)}</span></>}
                </div>
              </div>
              <div className="right">
                <StatusPill status={a.status} />
                {a.dueDate && (
                  <span style={{ color: overdue ? "var(--bad)" : "var(--grey-11)", fontWeight: overdue ? 700 : 500 }}>
                    {overdue ? `${-d}d over` : (a.status === "Completed" ? "Closed" : `Due ${fmtD(a.dueDate, "short")}`)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── DETAIL: Action ───────────────────────────────────────────────────────
function ActionDetail({ id }) {
  const a = window.EEC.ACTIONS.find(x => x.id === id);
  if (!a) return <div className="m-body"><div className="m-empty"><h3>Not found</h3></div></div>;
  const c = window.EEC.committeeById[a.committee];
  const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  const d = dayDiff(TODAY, a.dueDate);
  const overdue = a.status !== "Completed" && a.status !== "Deferred" && d < 0;
  const owner = a.ownerId && window.EEC.memberById[a.ownerId];
  const ownerName = owner ? shortName(owner.name) : (a.ownerLabel || "—");

  return (
    <div className="m-body">
      <div className="m-detail-card" style={{ borderTop: `3px solid ${c.color}` }}>
        <div className="eyebrow" style={{ color: c.deep }}>
          {c.short} · {a.kind === "cqi" ? "CQI" : a.kind === "tracker" ? "LCME Tracker" : "Operational"}
          <span style={{ marginLeft: 8, fontFamily: "var(--mono)", color: "var(--grey-7)" }}>{a.id}</span>
        </div>
        <h1 style={{ marginTop: 4, lineHeight: 1.25 }}>{a.title}</h1>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <StatusPill status={a.status} />
          {a.percent != null && (
            <span className="m-stp" style={{ background: "var(--grey-2)", color: "var(--ink)" }}>{a.percent}%</span>
          )}
          {a.dueDate && (
            <span className="m-stp" style={{
              background: overdue ? "var(--bad-tint)" : "var(--grey-2)",
              color: overdue ? "var(--bad)" : "var(--ink)",
            }}>
              {overdue ? `${-d}d overdue` : (a.status === "Completed" ? "Closed" : `Due ${fmtD(a.dueDate, "medium")}`)}
            </span>
          )}
        </div>
      </div>

      {a.percent != null && (
        <div className="m-card">
          <div style={{ padding: 14 }}>
            <div className="m-attbar">
              <div className="track"><div className="fill" style={{ width: a.percent + "%", background: a.percent === 100 ? "var(--good)" : "var(--brand-cyan)" }}></div></div>
              <div className="pct">{a.percent}%</div>
            </div>
          </div>
        </div>
      )}

      {a.description && (
        <div className="m-card">
          <div className="head"><h3>Description</h3></div>
          <div className="m-prose" style={{ padding: 14 }}><p>{a.description}</p></div>
        </div>
      )}

      <div className="m-card">
        <div className="head"><h3>Details</h3></div>
        <div style={{ padding: 14 }}>
          <div className="m-kv">
            <div className="k">Owner</div><div className="v">{ownerName}</div>
            {a.stakeholders && <><div className="k">Stakeholders</div><div className="v">{a.stakeholders}</div></>}
            <div className="k">Opened</div><div className="v">{fmtD(a.openedDate, "long")}</div>
            <div className="k">Due</div><div className="v">{a.target || fmtD(a.dueDate, "long")}</div>
            {a.closedDate && <><div className="k">Closed</div><div className="v">{fmtD(a.closedDate, "long")}</div></>}
            {a.domain && <><div className="k">Domain</div><div className="v">{a.domain}</div></>}
            {a.lcme && a.lcme.length > 0 && (
              <><div className="k">LCME</div><div className="v" style={{ fontFamily: "var(--mono)", fontSize: 11.5 }}>{a.lcme.join(", ")}</div></>
            )}
          </div>
        </div>
      </div>

      {a.baseline && (
        <div className="m-card">
          <div className="head"><h3>Baseline</h3></div>
          <div className="m-prose" style={{ padding: 14, fontSize: 11.5 }}><p>{a.baseline}</p></div>
        </div>
      )}
      {a.targetMetric && (
        <div className="m-card">
          <div className="head"><h3>Target metric</h3></div>
          <div className="m-prose" style={{ padding: 14 }}><p>{a.targetMetric}</p></div>
        </div>
      )}
      {a.intervention && (
        <div className="m-card">
          <div className="head"><h3>Intervention</h3></div>
          <div className="m-prose" style={{ padding: 14, fontSize: 11.5 }}><p>{a.intervention}</p></div>
        </div>
      )}
      {a.evidence && (
        <div className="m-card">
          <div className="head"><h3>Evidence</h3></div>
          <div className="m-prose" style={{ padding: 14, fontSize: 11.5 }}><p>{a.evidence}</p></div>
        </div>
      )}
      {a.notes && (
        <div className="m-card">
          <div className="head"><h3>Notes</h3></div>
          <div className="m-prose" style={{ padding: 14, fontSize: 11.5 }}><p>{a.notes}</p></div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION SCREEN: Motions ──────────────────────────────────────────────
function MotionsScreen({ onItem }) {
  const [filter, setFilter] = useStateMS("all");
  const V = window.EEC.MOTIONS;
  const filtered = useMemoMS(() => {
    let out = V;
    if (filter === "approved") out = out.filter(v => v.result === "Approved");
    else if (filter === "deferred") out = out.filter(v => v.result !== "Approved");
    return [...out].sort((a, b) => window.MS_DATE.parseLocal(b.date) - window.MS_DATE.parseLocal(a.date));
  }, [filter]);

  const counts = {
    all: V.length,
    approved: V.filter(v => v.result === "Approved").length,
    deferred: V.filter(v => v.result !== "Approved").length,
  };

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Decisions</div>
        <h2>Motions &amp; Votes</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Every motion formally voted on by the EEC this academic year.
        </div>
      </div>

      <div className="m-chiprow">
        {[["all","All"], ["approved","Approved"], ["deferred","Deferred / other"]].map(([k,lbl]) => (
          <button key={k} className={"m-chip" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>
            {lbl}<span className="count">{counts[k]}</span>
          </button>
        ))}
      </div>

      <div className="m-card" style={{ marginBottom: 0 }}>
        {filtered.map(v => (
          <button key={v.id} className="m-row" onClick={() => onItem("motion", v.id)}>
            <div style={{ minWidth: 0 }}>
              <div className="ttl">{v.title}</div>
              <div className="meta">
                <CChip id={v.committee} />
                {v.originatingCommittee !== v.committee && (
                  <>
                    <span className="sep">←</span>
                    <CChip id={v.originatingCommittee} subtle />
                  </>
                )}
                <span className="sep">·</span>
                <span>{fmtD(v.date)}</span>
              </div>
            </div>
            <div className="right">
              <StatusPill status={v.result} />
              {v.tally && v.tally.y != null && (
                <span style={{ fontFamily: "var(--mono)", fontSize: 10.5 }}>
                  {v.tally.y}–{v.tally.n}–{v.tally.a}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MotionDetail({ id }) {
  const v = window.EEC.MOTIONS.find(x => x.id === id);
  if (!v) return <div className="m-body"><div className="m-empty"><h3>Not found</h3></div></div>;
  const c = window.EEC.committeeById[v.committee];

  return (
    <div className="m-body">
      <div className="m-detail-card" style={{ borderTop: `3px solid ${c.color}` }}>
        <div className="eyebrow" style={{ color: c.deep }}>{c.short} · Motion · {fmtD(v.date, "long")}</div>
        <h1 style={{ marginTop: 4, lineHeight: 1.25 }}>{v.title}</h1>
        <div style={{ marginTop: 10 }}>
          <StatusPill status={v.result} />
        </div>
      </div>

      {v.tally && (
        <div className="m-card">
          <div className="head"><h3>Tally</h3></div>
          <div style={{ padding: "4px 14px 14px" }}>
            <div className="m-tally">
              <div className="cell"><div className="v">{v.tally.y ?? "—"}</div><div className="l">Yea</div></div>
              <div className="cell"><div className="v">{v.tally.n}</div><div className="l">Nay</div></div>
              <div className="cell"><div className="v">{v.tally.a}</div><div className="l">Abstain</div></div>
            </div>
          </div>
        </div>
      )}

      {v.body && (
        <div className="m-card">
          <div className="head"><h3>Body</h3></div>
          <div className="m-prose" style={{ padding: 14 }}><p>{v.body}</p></div>
        </div>
      )}

      <div className="m-card">
        <div className="head"><h3>Context</h3></div>
        <div style={{ padding: 14 }}>
          <div className="m-kv">
            <div className="k">Committee</div><div className="v">{c.name}</div>
            {v.originatingCommittee !== v.committee && (
              <><div className="k">Originating</div><div className="v">{window.EEC.committeeById[v.originatingCommittee]?.name || v.originatingCommittee}</div></>
            )}
            <div className="k">Meeting</div><div className="v">{fmtD(v.date, "long")}</div>
            {v.lcme && v.lcme.length > 0 && (
              <><div className="k">LCME</div><div className="v" style={{ fontFamily: "var(--mono)", fontSize: 11.5 }}>{v.lcme.join(", ")}</div></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION SCREEN: Members ──────────────────────────────────────────────
function MembersScreen({ onItem }) {
  const [q, setQ] = useStateMS("");
  const [committee, setCommittee] = useStateMS("ALL");

  const tracked = useMemoMS(
    () => window.EEC.MEMBERS.filter(m => m.tracked),
    []
  );

  const filtered = useMemoMS(() => {
    let out = tracked;
    if (committee !== "ALL") {
      out = out.filter(m => (m.seats || []).some(s => s.committee === committee));
    }
    const Q = q.trim().toLowerCase();
    if (Q) {
      out = out.filter(m =>
        (m.name || "").toLowerCase().includes(Q) ||
        (m.role || "").toLowerCase().includes(Q));
    }
    return [...out].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [q, committee, tracked]);

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Governance Bodies</div>
        <h2>Members</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Faculty, staff, and student representatives across EEC and its four subcommittees.
        </div>
      </div>

      <div className="m-search">
        <span className="ic">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or role…" />
      </div>

      <div className="m-chiprow">
        <button className={"m-chip" + (committee === "ALL" ? " active" : "")} onClick={() => setCommittee("ALL")}>
          All
        </button>
        {window.EEC.COMMITTEES.map(c => (
          <button key={c.id}
                  className={"m-chip" + (committee === c.id ? " active" : "")}
                  onClick={() => setCommittee(c.id)}
                  style={committee === c.id ? { background: c.deep, borderColor: c.deep } : null}>
            {c.short}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 10.5, color: "var(--grey-7)", padding: "6px 4px 8px", letterSpacing: "0.06em" }}>
        {filtered.length} member{filtered.length === 1 ? "" : "s"}
      </div>

      <div className="m-card" style={{ marginBottom: 0 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 22, fontSize: 12, color: "var(--grey-11)", textAlign: "center" }}>
            No members match.
          </div>
        )}
        {filtered.map(m => {
          const seats = m.seats || [];
          const total = m.presentCount + m.absentCount;
          const rate = total > 0 ? Math.round(100 * m.presentCount / total) : null;
          return (
            <button key={m.id} className="m-row" onClick={() => onItem("member", m.id)}
                    style={{ gridTemplateColumns: "auto 1fr auto" }}>
              <div className="m-avatar">{initials(m.name)}</div>
              <div style={{ minWidth: 0 }}>
                <div className="ttl" style={{ WebkitLineClamp: 1 }}>{shortName(m.name)}</div>
                <div className="meta">
                  {seats.slice(0, 3).map((s, i) => <CChip key={i} id={s.committee} />)}
                  {seats.length > 3 && <span style={{ fontSize: 10, color: "var(--grey-7)" }}>+{seats.length - 3}</span>}
                </div>
              </div>
              <div className="right">
                {rate != null && (
                  <span style={{ fontFamily: "var(--mono)", fontWeight: 700, color: rate >= 75 ? "var(--good)" : rate >= 60 ? "var(--warn)" : "var(--bad)" }}>
                    {rate}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MemberDetail({ id }) {
  const m = window.EEC.memberById[id];
  if (!m) return <div className="m-body"><div className="m-empty"><h3>Not found</h3></div></div>;
  const total = m.presentCount + m.absentCount;
  const rate = total > 0 ? Math.round(100 * m.presentCount / total) : null;
  const seats = m.seats || [];

  return (
    <div className="m-body">
      <div className="m-detail-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div className="m-avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
            {initials(m.name)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ fontSize: 18, lineHeight: 1.2, margin: 0 }}>{shortName(m.name)}</h1>
            <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 4, lineHeight: 1.4 }}>{m.role}</div>
          </div>
        </div>
        {m.email && (
          <a href={`mailto:${m.email}`} style={{ fontSize: 12, color: "var(--brand-cyan-deep)", marginTop: 10, display: "inline-block", fontFamily: "var(--mono)" }}>
            {m.email}
          </a>
        )}
      </div>

      {rate != null && (
        <div className="m-card">
          <div className="head"><h3>Attendance</h3></div>
          <div style={{ padding: 14 }}>
            <div className="m-attbar" style={{ marginBottom: 8 }}>
              <div className="track">
                <div className="fill" style={{
                  width: rate + "%",
                  background: rate >= 75 ? "var(--good)" : rate >= 60 ? "var(--warn)" : "var(--bad)",
                }}></div>
              </div>
              <div className="pct">{rate}%</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--grey-11)" }}>
              <strong style={{ color: "var(--ink)" }}>{m.presentCount}</strong> present · <strong style={{ color: "var(--ink)" }}>{m.absentCount}</strong> absent · {total} tracked
            </div>
          </div>
        </div>
      )}

      {seats.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Seats</h3></div>
          <div>
            {seats.map((s, i) => {
              const c = window.EEC.committeeById[s.committee];
              if (!c) return null;
              return (
                <div key={i} style={{
                  padding: "11px 14px",
                  borderBottom: i < seats.length - 1 ? "1px solid var(--grey-2)" : 0,
                  display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center",
                }}>
                  <div>
                    <CChip id={s.committee} />
                    <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 4 }}>{c.name}</div>
                  </div>
                  <span className="m-stp" style={{
                    background: s.voting ? "var(--brand-cyan-tint)" : "var(--grey-2)",
                    color:      s.voting ? "var(--brand-cyan-deep)" : "var(--grey-11)",
                  }}>
                    {s.voting ? "Voting" : "Non-voting"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION SCREEN: Attendance ───────────────────────────────────────────
function AttendanceScreen() {
  const M = window.EEC.MEETINGS.filter(m => m.attendanceRate != null)
    .sort((a, b) => window.MS_DATE.parseLocal(b.date) - window.MS_DATE.parseLocal(a.date));

  const avg = M.length === 0 ? 0 :
    Math.round(100 * M.reduce((s, m) => s + m.attendanceRate, 0) / M.length);

  const tracked = window.EEC.MEMBERS.filter(m => m.tracked && (m.presentCount + m.absentCount) > 0)
    .map(m => {
      const total = m.presentCount + m.absentCount;
      return { ...m, total, rate: Math.round(100 * m.presentCount / total) };
    })
    .sort((a, b) => b.rate - a.rate);

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">EEC · AY 2025–26</div>
        <h2>Attendance</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Voting attendance for filed EEC meetings. Quorum is 8 of 19 voting members.
        </div>
      </div>

      <div className="m-kpi-grid">
        <div className="m-kpi" style={{ borderTopColor: "var(--brand-cyan-deep)" }}>
          <div className="lbl">Average</div>
          <div className="val">{avg}%</div>
          <div className="sub">across {M.length} filed mtgs</div>
        </div>
        <div className="m-kpi" style={{ borderTopColor: "var(--brand-violet)" }}>
          <div className="lbl">Tracked members</div>
          <div className="val">{tracked.length}</div>
          <div className="sub">with attendance on record</div>
        </div>
      </div>

      <div className="m-card">
        <div className="head"><h3>By meeting</h3></div>
        {M.map(m => (
          <div key={m.id} style={{ padding: "11px 14px", borderBottom: "1px solid var(--grey-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <div style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500 }}>{fmtD(m.date, "medium")}</div>
              <div style={{ fontSize: 11, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>
                <strong style={{ color: "var(--ink)" }}>{m.present.length}</strong> / {m.present.length + m.absent.length}
              </div>
            </div>
            <div className="m-attbar">
              <div className="track">
                <div className="fill" style={{
                  width: (m.attendanceRate * 100) + "%",
                  background: m.attendanceRate >= 0.75 ? "var(--good)" :
                              m.attendanceRate >= 0.6  ? "var(--warn)" : "var(--bad)",
                }}></div>
              </div>
              <div className="pct">{Math.round(m.attendanceRate * 100)}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="m-card">
        <div className="head"><h3>By member</h3></div>
        {tracked.slice(0, 30).map(m => (
          <div key={m.id} style={{ padding: "10px 14px", borderBottom: "1px solid var(--grey-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
              <div style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
                {shortName(m.name)}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--grey-11)", fontFamily: "var(--mono)", flex: "0 0 auto" }}>
                {m.presentCount}/{m.total}
              </div>
            </div>
            <div className="m-attbar">
              <div className="track">
                <div className="fill" style={{
                  width: m.rate + "%",
                  background: m.rate >= 75 ? "var(--good)" : m.rate >= 60 ? "var(--warn)" : "var(--bad)",
                }}></div>
              </div>
              <div className="pct">{m.rate}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION SCREEN: Curriculum Reviews ───────────────────────────────────
function ReviewsScreen({ onItem }) {
  const R = window.EEC.REVIEWS;
  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Programmatic evaluation</div>
        <h2>Curriculum Reviews</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Standing reviews prepared by the Office of Curricular Affairs and presented to governance.
        </div>
      </div>

      {R.map(r => (
        <button key={r.id} className="m-row" onClick={() => onItem("review", r.id)}
                style={{ background: "var(--paper)", borderRadius: 12, padding: 14,
                         marginBottom: 10, gridTemplateColumns: "1fr auto",
                         boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06)" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 14.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.25 }}>
              {r.title}
            </div>
            <div className="meta" style={{ marginTop: 6 }}>
              <span>{fmtD(r.date, "long")}</span>
              {r.presenter && <><span className="sep">·</span><span>{r.presenter}</span></>}
            </div>
            {r.summary && (
              <div style={{ fontSize: 11.5, color: "var(--grey-11)", marginTop: 8, lineHeight: 1.5,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {r.summary}
              </div>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grey-7)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
      ))}
    </div>
  );
}

function ReviewDetail({ id }) {
  const r = window.EEC.REVIEWS.find(x => x.id === id);
  if (!r) return <div className="m-body"><div className="m-empty"><h3>Not found</h3></div></div>;

  return (
    <div className="m-body">
      <div className="m-detail-card">
        <div className="eyebrow">Curriculum Review</div>
        <h1 style={{ marginTop: 4, lineHeight: 1.25 }}>{r.title}</h1>
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--grey-11)" }}>
          {fmtD(r.date, "long")}{r.presenter ? ` · ${r.presenter}` : ""}
        </div>
        {r.file && (
          <a href={r.file} target="_blank" rel="noopener" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            marginTop: 12, padding: "8px 14px",
            background: "var(--brand-magenta)", color: "#fff",
            borderRadius: 999, fontSize: 12, fontWeight: 600,
            textDecoration: "none",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Open report
          </a>
        )}
      </div>

      {r.summary && (
        <div className="m-card">
          <div className="head"><h3>Summary</h3></div>
          <div className="m-prose" style={{ padding: 14 }}><p>{r.summary}</p></div>
        </div>
      )}

      {Array.isArray(r.sections) && r.sections.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Sections</h3></div>
          <div>
            {r.sections.map((s, i) => (
              <div key={i} style={{ padding: "12px 14px", borderBottom: i < r.sections.length - 1 ? "1px solid var(--grey-2)" : 0 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 12.5, fontWeight: 700, color: "var(--ink)", letterSpacing: "0.02em", marginBottom: 6 }}>
                  {s.heading}
                </div>
                <div className="m-prose" style={{ fontSize: 11.5 }}>
                  {(s.body || "").split(/\n\n+/).map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION SCREEN: Policies ─────────────────────────────────────────────
function PoliciesScreen({ onItem }) {
  const P = window.EEC.POLICIES;
  const sorted = [...P].sort((a, b) =>
    window.MS_DATE.parseLocal(b.effectiveDate) - window.MS_DATE.parseLocal(a.effectiveDate));
  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Policies &amp; Bylaws</div>
        <h2>Policies</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Authoritative policy documents adopted by the EEC, including the bylaws.
        </div>
      </div>

      <div className="m-card" style={{ marginBottom: 0 }}>
        {sorted.map(p => (
          <button key={p.id} className="m-row" onClick={() => onItem("policy", p.id)}>
            <div style={{ minWidth: 0 }}>
              <div className="ttl">{p.title}</div>
              <div className="meta">
                <span style={{ fontFamily: "var(--mono)" }}>v{p.version}</span>
                <span className="sep">·</span>
                <span>{fmtD(p.effectiveDate)}</span>
                <span className="sep">·</span>
                <span>{p.owner}</span>
              </div>
            </div>
            <div className="right">
              <StatusPill status={p.status.includes("Approved") ? "Completed" : p.status} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PolicyDetail({ id }) {
  const p = window.EEC.POLICIES.find(x => x.id === id);
  if (!p) return <div className="m-body"><div className="m-empty"><h3>Not found</h3></div></div>;
  return (
    <div className="m-body">
      <div className="m-detail-card">
        <div className="eyebrow">Policy · v{p.version}</div>
        <h1 style={{ marginTop: 4, lineHeight: 1.25 }}>{p.title}</h1>
        <div style={{ marginTop: 10 }}>
          <StatusPill status={p.status.includes("Approved") ? "Completed" : p.status} />
        </div>
        {p.fileUrl && (
          <a href={p.fileUrl} target="_blank" rel="noopener" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            marginTop: 12, padding: "8px 14px",
            background: "var(--brand-magenta)", color: "#fff",
            borderRadius: 999, fontSize: 12, fontWeight: 600,
            textDecoration: "none",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Open document
          </a>
        )}
      </div>

      <div className="m-card">
        <div className="head"><h3>Details</h3></div>
        <div style={{ padding: 14 }}>
          <div className="m-kv">
            <div className="k">Owner</div><div className="v">{p.owner}</div>
            <div className="k">Effective</div><div className="v">{fmtD(p.effectiveDate, "long")}</div>
            <div className="k">Approved by</div><div className="v">{p.approvedBy}</div>
            <div className="k">Next review</div><div className="v">{p.nextReview}</div>
            {p.lcme && p.lcme.length > 0 && (
              <><div className="k">LCME</div><div className="v" style={{ fontFamily: "var(--mono)", fontSize: 11.5 }}>{p.lcme.join(", ")}</div></>
            )}
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="m-card">
          <div className="head"><h3>Summary</h3></div>
          <div className="m-prose" style={{ padding: 14 }}><p>{p.summary}</p></div>
        </div>
      )}

      {Array.isArray(p.sections) && p.sections.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Sections</h3></div>
          <ul style={{ margin: 0, padding: "10px 14px 14px 28px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {p.sections.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {Array.isArray(p.revisionHistory) && p.revisionHistory.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Revision history</h3></div>
          {p.revisionHistory.map((h, i) => (
            <div key={i} style={{ padding: "10px 14px", borderBottom: i < p.revisionHistory.length - 1 ? "1px solid var(--grey-2)" : 0, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontFamily: "var(--mono)", fontWeight: 700 }}>v{h.version}</span>
                <span style={{ color: "var(--grey-11)" }}>{h.date ? fmtD(h.date) : ""}</span>
              </div>
              <div style={{ color: "var(--ink-2)" }}>{h.notes || h.summary || "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SECTION SCREEN: Linkage (LCME → actions/motions) ─────────────────────
function LinkageScreen() {
  // Aggregate counts by LCME element id.
  const map = new Map();
  function bump(eid, kind) {
    if (!map.has(eid)) map.set(eid, { actions: 0, motions: 0, policies: 0 });
    map.get(eid)[kind]++;
  }
  for (const a of window.EEC.ACTIONS) (a.lcme || []).forEach(e => bump(e, "actions"));
  for (const v of window.EEC.MOTIONS) (v.lcme || []).forEach(e => bump(e, "motions"));
  for (const p of window.EEC.POLICIES) (p.lcme || []).forEach(e => bump(e, "policies"));

  // Sort by total count desc
  const rows = [...map.entries()]
    .map(([eid, c]) => ({ eid, ...c, total: c.actions + c.motions + c.policies }))
    .sort((a, b) => b.total - a.total);

  // Look up LCME metadata
  const byId = {};
  for (const e of window.EEC.LCME) byId[e.id] = e;

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Closed-loop monitoring</div>
        <h2>Linkage Map</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          How many governance items reference each LCME element. Higher counts indicate active monitoring.
        </div>
      </div>

      <div className="m-card" style={{ marginBottom: 0 }}>
        {rows.map(r => {
          const meta = byId[r.eid];
          return (
            <div key={r.eid} style={{ padding: "11px 14px", borderBottom: "1px solid var(--grey-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: "var(--brand-violet)" }}>
                  LCME {r.eid}
                </span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--ink)" }}>
                  {r.total} item{r.total === 1 ? "" : "s"}
                </span>
              </div>
              {meta && (
                <div style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500, marginBottom: 6, lineHeight: 1.3 }}>
                  {meta.title}
                </div>
              )}
              <div style={{ display: "flex", gap: 6, fontSize: 10.5 }}>
                {r.actions > 0 && (
                  <span className="m-stp" style={{ background: "var(--brand-cyan-tint)", color: "var(--brand-cyan-deep)" }}>
                    {r.actions} action{r.actions === 1 ? "" : "s"}
                  </span>
                )}
                {r.motions > 0 && (
                  <span className="m-stp" style={{ background: "var(--brand-magenta)", color: "#fff", opacity: 0.85 }}>
                    {r.motions} motion{r.motions === 1 ? "" : "s"}
                  </span>
                )}
                {r.policies > 0 && (
                  <span className="m-stp" style={{ background: "var(--brand-violet-tint)", color: "var(--brand-violet)" }}>
                    {r.policies} polic{r.policies === 1 ? "y" : "ies"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────
function PhaseReviewsScreen({ onItem }) {
  const R = window.EEC.REVIEWS.filter(r => /phase/i.test(r.title));
  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Programmatic evaluation</div>
        <h2>Phase Reviews</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Curriculum reviews of each phase of the ASCEND program.
        </div>
      </div>
      {R.map(r => (
        <button key={r.id} className="m-row" onClick={() => onItem("review", r.id)}
                style={{ background: "var(--paper)", borderRadius: 12, padding: 14,
                         marginBottom: 10, gridTemplateColumns: "1fr auto",
                         boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06)" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 14.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.25 }}>
              {r.title}
            </div>
            <div className="meta" style={{ marginTop: 6 }}>
              <span>{fmtD(r.date, "long")}</span>
            </div>
            {r.summary && (
              <div style={{ fontSize: 11.5, color: "var(--grey-11)", marginTop: 8, lineHeight: 1.5,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {r.summary}
              </div>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grey-7)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
      ))}
    </div>
  );
}

function ActionPlansScreen({ onItem }) {
  const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  const [filter, setFilter] = useStateMS("all");

  const A = window.EEC.ACTIONS.filter(a => a.kind === "tracker");

  const counts = useMemoMS(() => {
    const c = { all: A.length, "not-started": 0, "in-progress": 0, completed: 0 };
    for (const a of A) {
      if (a.status === "Not Started") c["not-started"]++;
      if (a.status === "In Progress") c["in-progress"]++;
      if (a.status === "Completed")    c.completed++;
    }
    return c;
  }, []);

  const filtered = useMemoMS(() => {
    let out = A;
    if (filter === "not-started") out = out.filter(a => a.status === "Not Started");
    else if (filter === "in-progress") out = out.filter(a => a.status === "In Progress");
    else if (filter === "completed") out = out.filter(a => a.status === "Completed");
    return [...out].sort((a, b) => {
      const da = window.MS_DATE.parseLocal(a.dueDate);
      const db = window.MS_DATE.parseLocal(b.dueDate);
      return da - db;
    });
  }, [filter]);

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">LCME Closed-Loop Tracker</div>
        <h2>Action Plans</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          The {A.length} institution-level action plans tracked across the AY 2023–24 cycle. Per-meeting CQI and operational items live with each meeting.
        </div>
      </div>

      <div className="m-chiprow">
        {[
          ["all", "All"],
          ["not-started", "Not started"],
          ["in-progress", "In progress"],
          ["completed", "Completed"],
        ].map(([k, lbl]) => (
          <button key={k}
                  className={"m-chip" + (filter === k ? " active" : "")}
                  onClick={() => setFilter(k)}>
            {lbl}<span className="count">{counts[k]}</span>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 10.5, color: "var(--grey-7)", padding: "6px 4px 8px", letterSpacing: "0.06em" }}>
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </div>

      <div className="m-card" style={{ marginBottom: 0 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 22, fontSize: 12, color: "var(--grey-11)", textAlign: "center" }}>
            No items match this filter.
          </div>
        )}
        {filtered.map(a => {
          const d = dayDiff(TODAY, a.dueDate);
          const overdue = a.status !== "Completed" && a.status !== "Deferred" && d < 0;
          return (
            <button key={a.id} className="m-row" onClick={() => onItem("action", a.id)}>
              <div style={{ minWidth: 0 }}>
                <div className="ttl">{a.title}</div>
                <div className="meta">
                  <CChip id={a.committee} />
                  <span className="sep">·</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10 }}>{a.id}</span>
                  {a.ownerLabel && <><span className="sep">·</span><span>{shortName(a.ownerLabel)}</span></>}
                </div>
              </div>
              <div className="right">
                <StatusPill status={a.status} />
                {a.dueDate && (
                  <span style={{ color: overdue ? "var(--bad)" : "var(--grey-11)", fontWeight: overdue ? 700 : 500 }}>
                    {overdue ? `${-d}d over` : (a.status === "Completed" ? "Closed" : `Due ${fmtD(a.dueDate, "short")}`)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AgendaItemDetail({ meetingId, idx }) {
  const m = window.EEC.meetingById[meetingId];
  if (!m) return <div className="m-body"><div className="m-empty"><h3>Not found</h3></div></div>;
  const item = (m.items || []).find(it => String(it.idx) === String(idx));
  if (!item) return <div className="m-body"><div className="m-empty"><h3>Agenda item not found</h3></div></div>;

  // Enriched data parsed from the .docx, if available.
  const md = window.MEETING_DETAILS && window.MEETING_DETAILS[meetingId];
  const enriched = md && md.items.find(it => it.idx === idx);

  // Group enriched sections by the bucket the user asked for, while preserving
  // any other named sections (Background, Definitions, Vote…) below.
  function groupSections(sections) {
    const buckets = {
      presentation: [],
      discussion: [],
      issues: [],
      questions: [],
      outcome: [],
      other: [],
    };
    if (!sections) return buckets;
    for (const s of sections) {
      const h = (s.heading || "").toLowerCase();
      if (!h) continue; // The unheaded preamble (category/presenter/lcme) is already in item meta.
      if (/^summary of presentation$|^presentation$/.test(h))            buckets.presentation.push(s);
      else if (/^summary of discussion$|^discussion$|^member discussion$|^points of discussion$|^discussion summary$|^key points$/.test(h)) buckets.discussion.push(s);
      else if (/^issues raised$/.test(h))                                buckets.issues.push(s);
      else if (/^questions/.test(h))                                     buckets.questions.push(s);
      else if (/^outcome$/.test(h))                                      buckets.outcome.push(s);
      else                                                                buckets.other.push(s);
    }
    return buckets;
  }
  const groups = groupSections(enriched && enriched.sections);

  // Heuristic extraction from a "Member Discussion" paragraph: split sentences
  // that start with "asked", "raised a question", "raised a concern" into
  // questions vs issues for richer breakdown.
  function splitDiscussionParas(paras) {
    const issues = [], questions = [];
    for (const p of paras) {
      const sentences = p.split(/(?<=[.!?])\s+(?=[A-Z])/);
      for (const s of sentences) {
        if (/\b(asked|asked whether|asked about|raised a question|inquired|inquir(ed|y)|wondered)\b/i.test(s)) {
          questions.push(s.trim());
        } else if (/\b(raised (a )?(concern|issue|problem)|noted (a )?(concern|caveat)|expressed concern|flagged|cautioned|warned)\b/i.test(s)) {
          issues.push(s.trim());
        }
      }
    }
    return { issues, questions };
  }
  const discussionParas = groups.discussion.flatMap(s => s.body);
  const split = discussionParas.length > 0 ? splitDiscussionParas(discussionParas) : { issues: [], questions: [] };

  const c = window.EEC.committeeById[m.committee];
  const cat = (item.category || "").trim().toUpperCase();
  const catStyle =
    cat.includes("VOTING") ? { background: "var(--brand-magenta)", color: "#fff" } :
    cat.includes("DISCUSS") ? { background: "var(--brand-cyan-tint)", color: "var(--brand-cyan-deep)" } :
    cat.includes("REVIEW") ? { background: "var(--brand-violet-tint)", color: "var(--brand-violet)" } :
    { background: "var(--grey-2)", color: "var(--grey-11)" };

  function ParaBlock({ paras }) {
    return (
      <div className="m-prose" style={{ padding: 14 }}>
        {paras.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    );
  }
  function BulletBlock({ items }) {
    return (
      <ul style={{ margin: 0, padding: "10px 14px 14px 30px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
        {items.map((t, i) => <li key={i} style={{ marginBottom: 4 }}>{t}</li>)}
      </ul>
    );
  }

  return (
    <div className="m-body">
      <div className="m-detail-card" style={{ borderTop: `3px solid ${c.color}` }}>
        <div className="eyebrow" style={{ color: c.deep, display: "flex", alignItems: "center", gap: 8 }}>
          <span>{c.short} · {fmtD(m.date, "medium")}</span>
          {item.idx && <span style={{ fontFamily: "var(--mono)", color: "var(--grey-7)" }}>§{item.idx}</span>}
        </div>
        <h1 style={{ marginTop: 6, lineHeight: 1.25 }}>{item.title || "Agenda item"}</h1>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cat && <span className="m-stp" style={catStyle}>{cat}</span>}
          {item.lcme && item.lcme.length > 0 && (
            <span className="m-stp" style={{ background: "var(--grey-2)", color: "var(--ink-2)", fontFamily: "var(--mono)" }}>
              LCME {item.lcme.join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* Summary of Presentation */}
      {groups.presentation.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Summary of presentation</h3></div>
          <ParaBlock paras={groups.presentation.flatMap(s => s.body)} />
        </div>
      )}

      {/* Discussion points */}
      {discussionParas.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Discussion points</h3></div>
          <ParaBlock paras={discussionParas} />
        </div>
      )}

      {/* Issues raised (extracted) */}
      {split.issues.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Issues raised</h3></div>
          <BulletBlock items={split.issues} />
        </div>
      )}

      {/* Questions asked / answered (extracted) */}
      {split.questions.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Questions asked &amp; answered</h3></div>
          <BulletBlock items={split.questions} />
        </div>
      )}

      {/* Outcome (from enriched if present, else from base item) */}
      {(groups.outcome.length > 0 || item.outcome) && (
        <div className="m-card">
          <div className="head"><h3>Outcome</h3></div>
          {groups.outcome.length > 0
            ? <ParaBlock paras={groups.outcome.flatMap(s => s.body)} />
            : <div className="m-prose" style={{ padding: 14 }}><p>{item.outcome}</p></div>
          }
        </div>
      )}

      {/* Any other captured sections (Background, Definitions, Vote, etc.) */}
      {groups.other.length > 0 && (
        <div className="m-card">
          <div className="head"><h3>Additional context</h3></div>
          <div>
            {groups.other.map((s, i) => (
              <div key={i} style={{ padding: "10px 14px", borderBottom: i < groups.other.length - 1 ? "1px solid var(--grey-2)" : 0 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                  {s.heading}
                </div>
                <div className="m-prose" style={{ fontSize: 11.5 }}>
                  {s.body.map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If no enriched sections at all, fall back to just the outcome blurb */}
      {!enriched && !item.outcome && (
        <div className="m-empty">
          <h3>No discussion summary on file</h3>
          <p>This item's minutes were filed without itemized discussion detail.</p>
        </div>
      )}

      {item.presenter && (
        <div className="m-card">
          <div className="head"><h3>Presenter</h3></div>
          <div className="m-prose" style={{ padding: 14 }}><p>{item.presenter}</p></div>
        </div>
      )}

      <div className="m-card">
        <div className="head"><h3>Meeting context</h3></div>
        <div style={{ padding: 14 }}>
          <div className="m-kv">
            <div className="k">Committee</div><div className="v">{c.name}</div>
            <div className="k">Date</div><div className="v">{fmtD(m.date, "long")}</div>
            {m.type && <><div className="k">Session</div><div className="v">{m.type}</div></>}
            {m.presidingOfficer && (
              <><div className="k">Presiding</div><div className="v">{m.presidingOfficer.split(/[,(]/)[0].trim()}</div></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.MobileSections = {
  ExploreList,
  OverviewScreen,
  ActionsScreen,
  MotionsScreen,
  MembersScreen,
  ReviewsScreen,
  PoliciesScreen,
  AttendanceScreen,
  LinkageScreen,
  PhaseReviewsScreen,
  ActionPlansScreen,
  ActionDetail,
  MotionDetail,
  MemberDetail,
  ReviewDetail,
  PolicyDetail,
  AgendaItemDetail,
};
