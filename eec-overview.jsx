// eec-overview.jsx — graphical landing screen for the ASCEND Curriculum
// Governance Dashboard. Designed for quick visual scanning:
//   • KPI strip (counts, attendance)
//   • Infographics row — action items by source/category + by committee
//   • Five committee shells (EEC, PCCS, CCS, CIS, AES) — each with next-meeting,
//     attendance %, open actions, and a placeholder link to most recent minutes.
//     The subcommittees show "Pending intake" placeholders for data not yet
//     filed with the Office of Curricular Affairs.
//   • Needs attention (overdue/due-soon list)
//   • Recent motions strip

const { useState: useStateOv, useMemo: useMemoOv } = React;

function EecOverview() {
  const TODAY = window.EEC.TODAY;
  const A = window.EEC.ACTIONS;
  const M = window.EEC.MEETINGS;
  const V = window.EEC.MOTIONS;
  const C = window.EEC.COMMITTEES;

  const overdue   = A.filter(a => a.status !== "Completed" && a.status !== "Deferred" && new Date(a.dueDate) < TODAY);
  const dueSoon   = A.filter(a => a.status !== "Completed" && a.status !== "Deferred" && new Date(a.dueDate) >= TODAY && window.dayDiff(TODAY, a.dueDate) <= 90);
  const inProgress = A.filter(a => a.status === "In Progress" || a.status === "In progress" || a.status === "On Track").length;
  const notStarted = A.filter(a => a.status === "Not Started" || a.status === "Not initiated").length;
  const completedTotal = A.filter(a => a.status === "Completed").length;

  const pastMeetings = M.filter(m => m.minutesStatus !== "Scheduled");
  const upcoming = M.filter(m => new Date(m.date) >= TODAY).sort((a,b) => new Date(a.date) - new Date(b.date));
  const recentMotions = [...V].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  // Average EEC voting attendance
  const attendanceData = pastMeetings.filter(m => m.attendanceRate !== null);
  const avgAttendance = attendanceData.length === 0 ? 0 :
    Math.round(100 * attendanceData.reduce((sum, m) => sum + m.attendanceRate, 0) / attendanceData.length);

  // ─── Infographic data ───────────────────────────────────────────────────
  // Action items by source/kind
  const kindCounts = { tracker: 0, cqi: 0, operational: 0 };
  for (const a of A) if (kindCounts[a.kind] != null) kindCounts[a.kind]++;
  const kindTotal = kindCounts.tracker + kindCounts.cqi + kindCounts.operational;

  // Action items by status (donut)
  const statusCounts = { "Not Started": 0, "In Progress": 0, "Completed": 0, "Deferred": 0 };
  const norm = s => s === "Not initiated" ? "Not Started"
                  : (s === "In progress" || s === "On Track" || s === "At Risk") ? "In Progress"
                  : s === "Closed" ? "Completed"
                  : (s === "Off Track" || s === "Escalated") ? "Deferred"
                  : s;
  for (const a of A) {
    const k = norm(a.status);
    if (statusCounts[k] != null) statusCounts[k]++;
  }

  // Action items by committee
  const byCommittee = C.map(c => ({
    id: c.id, short: c.short, color: c.color, deep: c.deep, tint: c.tint,
    open: A.filter(a => a.committee === c.id && a.status !== "Completed").length,
    completed: A.filter(a => a.committee === c.id && a.status === "Completed").length,
  }));
  const maxOpen = Math.max(1, ...byCommittee.map(b => b.open + b.completed));

  return (
    <div>
      <window.SectionHead
        eyebrow="Office of Curricular Affairs · AY 2025–26"
        title="Curriculum Governance"
        sub="A unified read-only view of EEC governance: meetings, motions, action items, attendance, and the four standing subcommittees (PCCS, CCS, CIS, AES)."
      />

      {/* KPI strip */}
      <div className="grid-12" style={{ marginBottom: 22, gap: 14 }}>
        <KPICard span={3} label="Open action items" value={A.filter(a => a.status !== "Completed").length}
          sub={`${notStarted} not started · ${inProgress} in progress`} accent="var(--brand-violet)" />
        <KPICard span={3} label="Overdue / due-soon" value={overdue.length + dueSoon.length}
          sub={`${overdue.length} overdue · ${dueSoon.length} due in 90d`} accent={overdue.length ? "var(--bad)" : "var(--warn)"} />
        <KPICard span={3} label="Motions voted (AY)" value={V.filter(v => v.result === "Approved" || v.result === "Rejected").length}
          sub={`${V.length} total · ${pastMeetings.length} meetings`} accent="var(--brand-cyan-deep)" />
        <KPICard span={3} label="Avg EEC attendance" value={avgAttendance + "%"} sub={`${attendanceData.length} meetings · quorum 7/13`} accent="var(--brand-magenta-deep)" />
      </div>

      {/* Infographics row */}
      <div className="grid-12" style={{ marginBottom: 22, gap: 18 }}>
        {/* Action items by source — stacked donut + legend */}
        <div style={{ gridColumn: "span 5" }}>
          <window.Card style={{ padding: 0 }}>
            <CardHeader eyebrow="Action items" title="By source" />
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 22, padding: "18px 22px 20px", alignItems: "center" }}>
              <DonutChart
                slices={[
                  { value: kindCounts.tracker,     color: "var(--brand-violet)",     label: "Tracker" },
                  { value: kindCounts.cqi,         color: "var(--brand-cyan)",       label: "CQI" },
                  { value: kindCounts.operational, color: "var(--good)",             label: "Operational" },
                ]}
                size={140}
                centerLabel={String(kindTotal)}
                centerSub="actions"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <LegendRow color="var(--brand-violet)" label="LCME Tracker"        value={kindCounts.tracker}     total={kindTotal} />
                <LegendRow color="var(--brand-cyan)"   label="CQI (meetings)"      value={kindCounts.cqi}         total={kindTotal} />
                <LegendRow color="var(--good)"         label="Operational (mtgs)"  value={kindCounts.operational} total={kindTotal} />
              </div>
            </div>
          </window.Card>
        </div>

        {/* Action items by status — donut + status counts */}
        <div style={{ gridColumn: "span 3" }}>
          <window.Card style={{ padding: 0 }}>
            <CardHeader eyebrow="Action items" title="By status" />
            <div style={{ display: "grid", placeItems: "center", padding: "12px 12px 18px" }}>
              <DonutChart
                slices={[
                  { value: statusCounts["Completed"],  color: "var(--good)",        label: "Completed" },
                  { value: statusCounts["In Progress"],color: "var(--brand-cyan)",  label: "In Progress" },
                  { value: statusCounts["Not Started"],color: "var(--grey-7)",      label: "Not Started" },
                  { value: statusCounts["Deferred"],   color: "var(--warn)",        label: "Deferred" },
                ]}
                size={120}
                centerLabel={String(Math.round(100 * statusCounts.Completed / Math.max(1, A.length)))}
                centerSub="% closed"
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 14px", marginTop: 14, fontSize: 11 }}>
                <SmallTotal color="var(--good)"       label="Done"  value={statusCounts["Completed"]} />
                <SmallTotal color="var(--brand-cyan)" label="In Prog" value={statusCounts["In Progress"]} />
                <SmallTotal color="var(--grey-7)"     label="Open"  value={statusCounts["Not Started"]} />
                <SmallTotal color="var(--warn)"       label="Defer" value={statusCounts["Deferred"]} />
              </div>
            </div>
          </window.Card>
        </div>

        {/* Action items by committee — horizontal bars */}
        <div style={{ gridColumn: "span 4" }}>
          <window.Card style={{ padding: 0 }}>
            <CardHeader eyebrow="Action items" title="By committee" />
            <div style={{ padding: "16px 20px 18px", display: "flex", flexDirection: "column", gap: 9 }}>
              {byCommittee.map(b => (
                <div key={b.id}
                     onClick={() => { window.EEC_PENDING = { committee: b.id }; window.EEC_NAV.go("committees"); }}
                     style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: b.deep, fontFamily: "var(--sans)" }}>{b.short}</span>
                    <span style={{ fontSize: 11, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>
                      <strong style={{ color: "var(--ink)" }}>{b.open}</strong> open · {b.completed} done
                    </span>
                  </div>
                  <div style={{ display: "flex", height: 9, borderRadius: 3, overflow: "hidden", background: "var(--grey-2)" }}>
                    <div style={{ width: `${100 * b.open / maxOpen}%`,      background: b.color, transition: "width .3s" }} />
                    <div style={{ width: `${100 * b.completed / maxOpen}%`, background: "var(--good)", opacity: 0.55 }} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 10, color: "var(--grey-7)", display: "flex", gap: 12, marginTop: 4 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--ink)" }} />
                  Open
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--good)", opacity: 0.55 }} />
                  Completed
                </span>
              </div>
            </div>
          </window.Card>
        </div>
      </div>

      {/* Committee shells */}
      <div className="t-eyebrow" style={{ marginBottom: 10, marginTop: 4 }}>Committees</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 22 }}>
        {C.map(c => <CommitteeShell key={c.id} c={c} />)}
      </div>

      {/* Needs attention */}
      <div className="grid-12" style={{ gap: 18, marginBottom: 22 }}>
        <div style={{ gridColumn: "span 7" }}>
          <window.Card style={{ padding: 0 }}>
            <div style={{ padding: "18px 22px 12px", borderBottom: "1px solid var(--grey-2)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div className="t-eyebrow" style={{ color: "var(--bad)" }}>Needs attention</div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 17, marginTop: 3 }}>Overdue &amp; due-soon action items</h2>
              </div>
              <a onClick={() => window.EEC_NAV.go("actions")} style={{ fontSize: 12, cursor: "pointer", color: "var(--brand-cyan-deep)" }}>
                Open Action Items →
              </a>
            </div>
            <div>
              {overdue.length === 0 && dueSoon.length === 0 ? (
                <div style={{ padding: 22 }}><window.Empty title="Nothing overdue or due this month" sub="Closed-loop tracking is current." /></div>
              ) : (
                <>
                  {overdue.slice(0, 5).map(a => <OverviewActionRow key={a.id} a={a} overdue />)}
                  {dueSoon.slice(0, 4).map(a => <OverviewActionRow key={a.id} a={a} />)}
                </>
              )}
            </div>
          </window.Card>
        </div>

        {/* Upcoming meetings */}
        <div style={{ gridColumn: "span 5" }}>
          <window.Card style={{ padding: 0 }}>
            <CardHeader eyebrow="Upcoming" title="Next meetings" />
            <div>
              {upcoming.length === 0 ? <div style={{ padding: 22 }}><window.Empty title="No meetings scheduled" /></div> :
                upcoming.slice(0, 5).map(m => <OverviewMeetingRow key={m.id} m={m} />)}
            </div>
          </window.Card>
        </div>
      </div>

      {/* Recent motions */}
      <div className="grid-12" style={{ gap: 18 }}>
        <div style={{ gridColumn: "span 12" }}>
          <window.Card style={{ padding: 0 }}>
            <div style={{ padding: "18px 22px 12px", borderBottom: "1px solid var(--grey-2)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div className="t-eyebrow">Decisions</div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 17, marginTop: 3 }}>Recent motions &amp; votes</h2>
              </div>
              <a onClick={() => window.EEC_NAV.go("motions")} style={{ fontSize: 12, cursor: "pointer", color: "var(--brand-cyan-deep)" }}>
                All motions →
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
              {recentMotions.map(v => <OverviewMotionRow key={v.id} v={v} />)}
            </div>
          </window.Card>
        </div>
      </div>
    </div>
  );
}

// ─── Donut chart (SVG) ────────────────────────────────────────────────────
function DonutChart({ slices, size = 120, centerLabel, centerSub }) {
  const total = slices.reduce((s, x) => s + (x.value || 0), 0) || 1;
  const r = size / 2 - 8;
  const cx = size / 2, cy = size / 2;
  const stroke = 14;

  let acc = 0;
  const segs = slices.map(s => {
    const frac = (s.value || 0) / total;
    const start = acc; acc += frac;
    const end = acc;
    return { ...s, start, end, frac };
  }).filter(s => s.frac > 0);

  function arc(start, end) {
    const a0 = start * 2 * Math.PI - Math.PI / 2;
    const a1 = end * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = (end - start) > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  }

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--grey-2)" strokeWidth={stroke} />
        {segs.map((s, i) => (
          <path key={i} d={arc(s.start, s.end)} stroke={s.color} strokeWidth={stroke} fill="none" strokeLinecap="butt" />
        ))}
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: size * 0.22, fontWeight: 700, fontFamily: "var(--serif)", color: "var(--ink)", lineHeight: 1 }}>
          {centerLabel}
        </div>
        {centerSub && <div style={{ fontSize: 10.5, color: "var(--grey-11)", marginTop: 2, letterSpacing: "0.04em" }}>{centerSub}</div>}
      </div>
    </div>
  );
}

function LegendRow({ color, label, value, total }) {
  const pct = total ? Math.round(100 * value / total) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flex: "0 0 10px" }} />
      <span style={{ fontSize: 12, color: "var(--ink-2)", flex: 1, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 11.5, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>
        <strong style={{ color: "var(--ink)" }}>{value}</strong>
        <span style={{ marginLeft: 5 }}>{pct}%</span>
      </span>
    </div>
  );
}

function SmallTotal({ color, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: color, flex: "0 0 7px" }} />
      <span style={{ color: "var(--grey-11)" }}>{label}</span>
      <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontWeight: 700, color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

function CardHeader({ eyebrow, title }) {
  return (
    <div style={{ padding: "14px 22px 10px", borderBottom: "1px solid var(--grey-2)" }}>
      <div className="t-eyebrow">{eyebrow}</div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 16, marginTop: 2 }}>{title}</h2>
    </div>
  );
}

// ─── Committee shell ──────────────────────────────────────────────────────
// One per committee. Real data for EEC, placeholders ("Pending intake") for
// PCCS/CCS/CIS/AES until those subcommittees file minutes & rosters.
function CommitteeShell({ c }) {
  const TODAY = window.EEC.TODAY;
  const meetings = window.EEC.MEETINGS.filter(m => m.committee === c.id);
  const past = meetings.filter(m => new Date(m.date) <= TODAY);
  const upcoming = meetings.filter(m => new Date(m.date) > TODAY).sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextMtg = upcoming[0];
  const lastMtg = past[past.length - 1];

  const openActions = window.EEC.ACTIONS.filter(a => a.committee === c.id && a.status !== "Completed").length;
  const totalActions = window.EEC.ACTIONS.filter(a => a.committee === c.id).length;

  // Attendance: real for EEC, placeholder for others
  const attendanceData = past.filter(m => m.attendanceRate !== null);
  const avgAttendance = attendanceData.length === 0 ? null :
    Math.round(100 * attendanceData.reduce((s, m) => s + m.attendanceRate, 0) / attendanceData.length);

  // Minutes link — only EEC has files for now
  const minutesAvailable = c.id === "EEC" && lastMtg;

  function openCommittee() {
    window.EEC_PENDING = { committee: c.id };
    window.EEC_NAV.go("committees");
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", borderTop: `3px solid ${c.color}`, display: "flex", flexDirection: "column" }}>
      <div onClick={openCommittee} style={{ padding: "12px 14px 10px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flex: "0 0 8px" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: c.deep, letterSpacing: "0.02em" }}>{c.short}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--grey-11)", lineHeight: 1.35, minHeight: 28 }}>
          {c.name}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--grey-2)", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {/* Next meeting */}
        <ShellRow label="Next meeting" value={nextMtg ? window.fmtDate(nextMtg.date, "medium") : (c.id === "EEC" ? "TBD" : null)} placeholder="Pending intake" />
        {/* Attendance */}
        <ShellRow
          label="Attendance"
          value={avgAttendance !== null ? `${avgAttendance}% avg` : null}
          placeholder="Pending intake"
        />
        {/* Open actions */}
        <ShellRow
          label="Open actions"
          value={totalActions > 0 ? `${openActions} of ${totalActions}` : null}
          placeholder="None on file"
        />
        {/* Recent minutes link */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 9.5, color: "var(--grey-11)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
            Most recent minutes
          </span>
        </div>
        {minutesAvailable ? (
          <a href={`minutes/EEC_Minutes_${lastMtg.date}.docx`} download
             onClick={e => e.stopPropagation()}
             style={{
               fontSize: 11.5, color: c.deep, textDecoration: "none", fontWeight: 600,
               display: "inline-flex", alignItems: "center", gap: 5,
             }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {window.fmtDate(lastMtg.date, "medium")}.docx
          </a>
        ) : (
          <span style={{ fontSize: 11, color: "var(--grey-7)", fontStyle: "italic" }}>
            Pending intake
          </span>
        )}
      </div>
    </div>
  );
}

function ShellRow({ label, value, placeholder }) {
  const hasValue = value != null && value !== "";
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 9.5, color: "var(--grey-11)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      <span style={{
        fontSize: 11.5, marginTop: 1, lineHeight: 1.3,
        color: hasValue ? "var(--ink-2)" : "var(--grey-7)",
        fontStyle: hasValue ? "normal" : "italic",
        fontWeight: hasValue ? 600 : 400,
      }}>
        {hasValue ? value : (placeholder || "—")}
      </span>
    </div>
  );
}

// ─── Reusable Overview-only rows ──────────────────────────────────────────
function KPICard({ span, label, value, sub, accent }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <div className="card" style={{ padding: "16px 18px", borderTop: `3px solid ${accent}` }}>
        <div className="t-eyebrow" style={{ marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", fontFamily: "var(--serif)", fontVariantNumeric: "tabular-nums" }}>
          {value}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--grey-11)", marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

function OverviewMeetingRow({ m }) {
  const c = window.EEC.committeeById[m.committee];
  const d = new Date(m.date);
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  return (
    <div onClick={() => { window.EEC_PENDING = { meeting: m.id }; window.EEC_NAV.go("meetings"); }}
         style={{ display: "flex", gap: 14, padding: "12px 22px", borderBottom: "1px solid var(--grey-2)", cursor: "pointer" }}>
      <div style={{
        flex: "0 0 44px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 4,
        border: `1px solid ${c.tint}`, borderRadius: 6, background: c.tint,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: c.deep, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {d.toLocaleDateString("en-US", { month: "short" })}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: c.deep, fontFamily: "var(--serif)", lineHeight: 1 }}>
          {d.getDate()}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
          <window.CommitteeChip id={m.committee} size="sm" />
          <span style={{ fontSize: 11, color: "var(--grey-11)" }}>{day} · {m.type}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {m.topics && m.topics[0]}
        </div>
      </div>
    </div>
  );
}

function OverviewActionRow({ a, overdue }) {
  const c = window.EEC.committeeById[a.committee];
  const owner = window.EEC.memberById[a.ownerId];
  const ownerName = owner ? owner.name.split(",")[0] : (a.ownerLabel || "—").split(/[;,]/)[0].trim();
  const days = window.dayDiff(window.EEC.TODAY, a.dueDate);
  return (
    <div onClick={() => { window.EEC_PENDING = { action: a.id }; window.EEC_NAV.go("actions"); }}
         style={{ display: "grid", gridTemplateColumns: "1fr 110px 130px", gap: 12, alignItems: "center", padding: "10px 22px", borderBottom: "1px solid var(--grey-2)", cursor: "pointer" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500, marginBottom: 3, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {a.title}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <window.CommitteeChip id={a.committee} size="sm" />
          {a.ownerId && <window.MemberAvatar id={a.ownerId} size={18} />}
          <span style={{ fontSize: 11, color: "var(--grey-11)" }}>{ownerName}</span>
        </div>
      </div>
      <window.StatusPill status={a.status} percent={a.percent} />
      <div style={{ fontSize: 11.5 }}>
        <div style={{ color: overdue ? "var(--bad)" : "var(--grey-11)", fontWeight: overdue ? 600 : 400 }}>
          {overdue ? `${-days}d overdue` : `Due in ${days}d`}
        </div>
        <div style={{ fontSize: 11, color: "var(--grey-7)" }}>{window.fmtDate(a.dueDate, "medium")}</div>
      </div>
    </div>
  );
}

function OverviewMotionRow({ v }) {
  return (
    <div onClick={() => { window.EEC_PENDING = { motion: v.id }; window.EEC_NAV.go("motions"); }}
         style={{ padding: "12px 22px", borderBottom: "1px solid var(--grey-2)", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <window.CommitteeChip id={v.committee} size="sm" />
          {v.originatingCommittee !== v.committee && (
            <>
              <span style={{ fontSize: 10, color: "var(--grey-7)" }}>← from</span>
              <window.CommitteeChip id={v.originatingCommittee} size="sm" subtle />
            </>
          )}
        </div>
        <window.MotionResult result={v.result} tally={v.tally} />
      </div>
      <div style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500, lineHeight: 1.35 }}>
        {v.title}
      </div>
      <div style={{ fontSize: 10.5, color: "var(--grey-7)", marginTop: 3 }}>
        {window.fmtDate(v.date, "medium")}
      </div>
    </div>
  );
}

window.EecOverview = EecOverview;
