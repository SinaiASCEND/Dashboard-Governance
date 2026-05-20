// eec-attendance.jsx — Live attendance matrix, per committee.
// Members × meetings grid with Present / Absent / Ex-officio status per cell.
// Lands here from the "Check attendance" buttons on each subcommittee card.

const { useState: useStateAt, useEffect: useEffectAt, useMemo: useMemoAt } = React;

// -- helpers (local; don't collide with other files' helpers) --
function _atLastName(name) {
  return (name || "")
    .replace(/\(.*?\)/g, "")
    .split(",")[0]
    .trim()
    .split(/\s+/)
    .slice(-1)[0]
    .toLowerCase();
}
function _atCmpLast(a, b) {
  const la = _atLastName(a.name), lb = _atLastName(b.name);
  return la < lb ? -1 : la > lb ? 1 : 0;
}
function _atBucket(member, committeeId) {
  const seat = member.seats.find(s => s.committee === committeeId);
  if (!seat) return "voting";
  const t = (seat.seat || "").toLowerCase();
  if (seat.section === "Co-Chairs" || /co-chair/.test(t) || (committeeId === "EEC" && /^chair$/.test(t))) return "cochair";
  if (/student/.test(t)) return "student";
  return "voting";
}

function EecAttendance() {
  const C = window.EEC.COMMITTEES;
  const initial = window.EEC_PENDING?.committee || "EEC";
  const [selected, setSelected] = useStateAt(initial);
  useEffectAt(() => {
    if (window.EEC_PENDING?.committee) {
      setSelected(window.EEC_PENDING.committee);
      window.EEC_PENDING = null;
    }
  }, []);

  const committee = window.EEC.committeeById[selected];
  const meetings = useMemoAt(
    () => window.EEC.MEETINGS
      .filter(m => m.committee === selected)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date)),
    [selected]
  );

  // Member roster for this committee (all members — voting and non-voting)
  const allMembers = window.EEC.MEMBERS.filter(m => m.tracked && m.seats.some(s => s.committee === selected));

  // Group into co-chairs / voting / students / non-voting, then alpha within
  // Co-chairs: voting (Faculty Co-Chair) first, non-voting (Admin Co-Chair) second.
  const groups = useMemoAt(() => {
    const g = { cochair: [], voting: [], student: [], nonvoting: [] };
    for (const m of allMembers) {
      const seat = m.seats.find(s => s.committee === selected);
      const t = (seat?.seat || "").toLowerCase();
      const isCochair = seat?.section === "Co-Chairs" || /co-chair/.test(t) || (selected === "EEC" && /^chair$/.test(t));
      const isStudent = /student/.test(t);
      if (isCochair) g.cochair.push(m);
      else if (isStudent) g.student.push(m);
      else if (seat?.vote) g.voting.push(m);
      else g.nonvoting.push(m);
    }
    // Co-chairs: Faculty (voting) first, then Admin (non-voting); break ties by last name
    g.cochair.sort((a, b) => {
      const sa = a.seats.find(s => s.committee === selected);
      const sb = b.seats.find(s => s.committee === selected);
      const va = sa?.vote ? 0 : 1;
      const vb = sb?.vote ? 0 : 1;
      if (va !== vb) return va - vb;
      return _atCmpLast(a, b);
    });
    g.voting.sort(_atCmpLast);
    g.student.sort(_atCmpLast);
    g.nonvoting.sort(_atCmpLast);
    return g;
  }, [selected]);

  // Per-member stats limited to THIS committee's meetings
  function statsFor(member) {
    let p = 0, a = 0;
    for (const m of meetings) {
      if (m.present?.includes(member.id)) p++;
      else if (m.absent?.includes(member.id)) a++;
    }
    const total = p + a;
    return { p, a, total, rate: total > 0 ? Math.round(100 * p / total) : null };
  }

  // Cell state for one member/meeting
  function cellState(member, meeting) {
    if (meeting.present?.includes(member.id)) return "present";
    if (meeting.absent?.includes(member.id)) return "absent";
    if (meeting.exOfficio?.includes(member.id) || meeting.guests?.includes(member.id) || meeting.operations?.includes(member.id)) return "exofficio";
    return "norecord";
  }

  // Overall per-meeting stats (voting members tracked)
  const meetingStats = useMemoAt(() => {
    return meetings.map(m => {
      const present = m.present?.length || 0;
      const absent  = m.absent?.length || 0;
      const total   = present + absent;
      return { present, absent, total, quorumMet: present >= committee.quorum };
    });
  }, [selected, meetings]);

  return (
    <div>
      <window.SectionHead
        eyebrow={`Live attendance roster · ${committee.short} \u00b7 ${meetings.length} meetings`}
        title={`Attendance \u2014 ${committee.short}`}
        sub={`Members \u00d7 meetings. Green \u2022 present \u00b7 Red \u2022 absent \u00b7 Grey \u2022 ex-officio or no record. Aggregated from attendance records filed with the Office of Curricular Affairs.`}
      />

      {/* Live check-in link */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14, marginBottom: 22,
        padding: "14px 18px",
        background: "var(--brand-violet-tint)", border: "1px solid var(--brand-violet)",
        borderRadius: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--brand-violet)", marginBottom: 2 }}>
            Take attendance live during a meeting
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.45 }}>
            Open the live check-in sheet to tap members present in real time, see quorum status as you go, and export the record as text or CSV when the meeting ends.
          </div>
        </div>
        <a href="EEC Live Attendance.html" target="_blank" rel="noopener" onClick={(e) => {
          if (window.EEC_LIVE_ATTENDANCE_HTML) {
            e.preventDefault();
            const blob = new Blob([window.EEC_LIVE_ATTENDANCE_HTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const w = window.open(url, '_blank');
            // Fall back to navigation if popup blocked
            if (!w) window.location.href = url;
            // Release the URL after a short delay so the tab can load
            setTimeout(() => URL.revokeObjectURL(url), 60000);
          }
        }} style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "8px 14px", fontSize: 12, fontWeight: 700,
          background: "var(--brand-violet)", color: "white", borderRadius: 6,
          textDecoration: "none", whiteSpace: "nowrap",
        }}>
          Open live check-in
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M20 14v6H4V4h6"/></svg>
        </a>
      </div>

      {/* Committee tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, borderBottom: "1px solid var(--grey-3)", flexWrap: "wrap" }}>
        {C.map(c => {
          const active = selected === c.id;
          const mc = window.EEC.MEETINGS.filter(m => m.committee === c.id).length;
          return (
            <button key={c.id} onClick={() => setSelected(c.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px",
                fontSize: 13, fontWeight: 600,
                background: active ? c.tint : "transparent",
                color: active ? c.deep : "var(--grey-11)",
                border: 0,
                borderBottom: active ? `3px solid ${c.color}` : "3px solid transparent",
                marginBottom: -1,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
              {c.short}
              <span style={{ fontSize: 10.5, opacity: 0.7, fontWeight: 500 }}>{mc} mtg{mc === 1 ? "" : "s"}</span>
            </button>
          );
        })}
      </div>

      {meetings.length === 0 ? (
        <window.Card>
          <window.Empty
            title={`No ${committee.short} meetings on file`}
            sub={`Attendance records for ${committee.short} are filed at committee level; once minutes are submitted to the Office of Curricular Affairs they appear here automatically.`}
          />
        </window.Card>
      ) : (
        <>
          {/* Summary band */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
            <SummaryStat label="Meetings tracked" value={meetings.length} />
            <SummaryStat label="Voting roster" value={allMembers.length} />
            <SummaryStat label="Quorum threshold" value={committee.quorum} />
            <SummaryStat
              label="Meetings at quorum"
              value={`${meetingStats.filter(s => s.quorumMet).length} / ${meetings.length}`}
              tone={meetingStats.every(s => s.quorumMet) ? "good" : "warn"}
            />
          </div>

          {/* Matrix */}
          <window.Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                borderCollapse: "separate", borderSpacing: 0,
                minWidth: "100%", fontSize: 11.5, fontFamily: "var(--sans)",
              }}>
                <thead>
                  <tr>
                    <th style={{
                      position: "sticky", left: 0, top: 0, zIndex: 3,
                      background: "var(--paper)", borderBottom: "1px solid var(--grey-3)", borderRight: "1px solid var(--grey-3)",
                      padding: "12px 16px", textAlign: "left",
                      fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--grey-11)", fontWeight: 700, minWidth: 240,
                    }}>Member</th>
                    {meetings.map((m, i) => (
                      <th key={m.id} title={m.summary || m.date} style={{
                        position: "sticky", top: 0, zIndex: 2,
                        background: "var(--paper)", borderBottom: "1px solid var(--grey-3)",
                        padding: "8px 6px 10px", textAlign: "center",
                        fontSize: 10, fontFamily: "var(--mono)", color: "var(--grey-11)",
                        whiteSpace: "nowrap", verticalAlign: "bottom",
                      }}>
                        <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", display: "inline-block", lineHeight: 1.1 }}>
                          {m.date}
                        </div>
                        <div style={{
                          marginTop: 4,
                          fontSize: 9, letterSpacing: 0,
                          padding: "1px 0",
                          color: meetingStats[i].quorumMet ? "var(--good)" : "var(--warn)",
                          fontWeight: 700,
                        }}>
                          {meetingStats[i].quorumMet ? "Q" : "—"}
                        </div>
                      </th>
                    ))}
                    <th style={{
                      position: "sticky", top: 0, zIndex: 2,
                      background: "var(--paper)", borderBottom: "1px solid var(--grey-3)", borderLeft: "1px solid var(--grey-3)",
                      padding: "12px 10px", textAlign: "center",
                      fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--grey-11)", fontWeight: 700, minWidth: 90,
                    }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <GroupRows label="Co-Chairs"      members={groups.cochair}  meetings={meetings} cellState={cellState} statsFor={statsFor} tone="violet" />
                  <GroupRows label="Voting members" members={groups.voting}   meetings={meetings} cellState={cellState} statsFor={statsFor} tone="cyan" />
                  <GroupRows label="Student members" members={groups.student} meetings={meetings} cellState={cellState} statsFor={statsFor} tone="magenta" />
                  <GroupRows label="Non-voting / ex officio" members={groups.nonvoting} meetings={meetings} cellState={cellState} statsFor={statsFor} tone="grey" />

                  {/* Footer per-meeting totals */}
                  <tr>
                    <td style={{
                      position: "sticky", left: 0, zIndex: 1,
                      background: "var(--grey-1)", borderTop: "1px solid var(--grey-3)", borderRight: "1px solid var(--grey-3)",
                      padding: "10px 16px",
                      fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--grey-11)", fontWeight: 700,
                    }}>Present this meeting</td>
                    {meetingStats.map((s, i) => (
                      <td key={i} style={{
                        background: "var(--grey-1)", borderTop: "1px solid var(--grey-3)",
                        padding: "6px 4px", textAlign: "center",
                        fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
                        color: s.quorumMet ? "var(--good)" : "var(--warn)",
                      }}>
                        {s.present}
                      </td>
                    ))}
                    <td style={{ background: "var(--grey-1)", borderTop: "1px solid var(--grey-3)", borderLeft: "1px solid var(--grey-3)" }} />
                  </tr>
                </tbody>
              </table>
            </div>
          </window.Card>

          {/* Legend */}
          <div style={{ display: "flex", gap: 18, marginTop: 14, fontSize: 11, color: "var(--grey-11)", flexWrap: "wrap" }}>
            <LegendChip color="var(--good)"      bg="var(--good-tint)"      label="Present" />
            <LegendChip color="var(--bad)"       bg="var(--bad-tint)"       label="Absent" />
            <LegendChip color="var(--grey-7)"    bg="var(--grey-2)"         label="Ex-officio / guest" />
            <LegendChip color="var(--grey-5)"    bg="var(--paper)"          label="No record" outline />
            <span style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--grey-7)" }}>
              <strong style={{ color: "var(--good)" }}>Q</strong> = quorum met at that meeting
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function GroupRows({ label, members, meetings, cellState, statsFor, tone }) {
  if (!members.length) return null;
  const span = meetings.length + 2;
  const bg = tone === "violet" ? "var(--brand-violet-tint)" : tone === "magenta" ? "#FCEAF5" : tone === "grey" ? "var(--grey-2)" : "var(--brand-cyan-tint)";
  const fg = tone === "violet" ? "var(--brand-violet)" : tone === "magenta" ? "var(--brand-magenta-deep)" : tone === "grey" ? "var(--grey-11)" : "var(--brand-cyan-deep)";
  return (
    <>
      <tr>
        <td colSpan={span} style={{
          position: "sticky", left: 0, zIndex: 1,
          background: bg, color: fg,
          padding: "6px 16px",
          fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
          fontWeight: 700,
          borderTop: "1px solid var(--grey-3)", borderBottom: "1px solid var(--grey-3)",
        }}>
          {label} <span style={{ opacity: 0.7, marginLeft: 6 }}>{members.length}</span>
        </td>
      </tr>
      {members.map(m => {
        const stats = statsFor(m);
        return (
          <tr key={m.id}>
            <td style={{
              position: "sticky", left: 0, zIndex: 1,
              background: "var(--paper)", borderBottom: "1px solid var(--grey-2)", borderRight: "1px solid var(--grey-3)",
              padding: "8px 16px",
              cursor: "pointer",
            }}
            onClick={() => { window.EEC_PENDING = { member: m.id }; window.EEC_NAV.go("members"); }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>{m.name}</div>
              <div style={{ fontSize: 10.5, color: "var(--grey-11)", marginTop: 2, lineHeight: 1.3 }}>
                {(m.seats.find(s => s.committee && true)?.seat) || m.role}
              </div>
            </td>
            {meetings.map(mt => {
              const state = cellState(m, mt);
              const styles = {
                present:  { bg: "var(--good-tint)", color: "var(--good)", glyph: "•" },
                absent:   { bg: "var(--bad-tint)",  color: "var(--bad)",  glyph: "×" },
                exofficio:{ bg: "var(--grey-2)",    color: "var(--grey-7)", glyph: "·" },
                norecord: { bg: "var(--paper)",     color: "var(--grey-5)", glyph: "" },
              }[state];
              return (
                <td key={mt.id} title={`${mt.date} — ${state}`} style={{
                  borderBottom: "1px solid var(--grey-2)",
                  padding: 0, textAlign: "center", verticalAlign: "middle",
                  minWidth: 22, width: 22, height: 26,
                  background: styles.bg, color: styles.color,
                  fontWeight: 700, fontSize: 13,
                  fontFamily: state === "absent" ? "var(--sans)" : "inherit",
                }}>{styles.glyph}</td>
              );
            })}
            <td style={{
              borderBottom: "1px solid var(--grey-2)", borderLeft: "1px solid var(--grey-3)",
              padding: "6px 8px", textAlign: "center",
              fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)", whiteSpace: "nowrap",
            }}>
              {stats.total === 0 ? (
                <span style={{ color: "var(--grey-5)" }}>—</span>
              ) : (
                <span style={{ fontWeight: 700, color: stats.rate >= 75 ? "var(--good)" : stats.rate >= 50 ? "var(--brand-cyan-deep)" : "var(--warn)" }}>
                  {stats.rate}%
                  <span style={{ fontWeight: 500, color: "var(--grey-7)", marginLeft: 4 }}>{stats.p}/{stats.total}</span>
                </span>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
}

function SummaryStat({ label, value, tone }) {
  const color = tone === "good" ? "var(--good)" : tone === "warn" ? "var(--warn)" : "var(--ink)";
  return (
    <div className="card" style={{ padding: "12px 16px" }}>
      <div className="t-eyebrow" style={{ fontSize: 9.5 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--serif)", color, marginTop: 4, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function LegendChip({ color, bg, label, outline }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 14, height: 14, borderRadius: 3, background: bg, color,
        display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700,
        border: outline ? "1px solid var(--grey-3)" : "none",
      }}>{label === "Present" ? "•" : label === "Absent" ? "×" : label === "Ex-officio / guest" ? "·" : ""}</span>
      <span>{label}</span>
    </span>
  );
}

window.EecAttendance = EecAttendance;
