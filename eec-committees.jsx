// eec-committees.jsx — Committees overview with member rosters

const { useState: useStateCo, useEffect: useEffectCo } = React;

// Sort by last name; tolerant of " (TENTATIVE)" / ", MD" / ", PhD" / titles.
function _lastName(name) {
  return (name || "")
    .replace(/\(.*?\)/g, "")
    .split(",")[0]
    .trim()
    .split(/\s+/)
    .slice(-1)[0]
    .toLowerCase();
}
function _cmpByLast(a, b) {
  const la = _lastName(a.name), lb = _lastName(b.name);
  return la < lb ? -1 : la > lb ? 1 : 0;
}
// Bucket a member into Co-Chairs / Voting / Students for a given committee.
function _bucket(member, committeeId) {
  const seat = member.seats.find(s => s.committee === committeeId);
  if (!seat) return null;
  const t = (seat.seat || "").toLowerCase();
  if (seat.section === "Co-Chairs" || /co-chair/.test(t) || (committeeId === "EEC" && /^chair$/.test(t))) return "cochair";
  if (/student/.test(t)) return "student";
  return "voting";
}

function EecCommittees() {
  const C = window.EEC.COMMITTEES;
  const initial = window.EEC_PENDING?.committee || "EEC";
  const [selected, setSelected] = useStateCo(initial);
  useEffectCo(() => {
    if (window.EEC_PENDING?.committee) {
      setSelected(window.EEC_PENDING.committee);
      window.EEC_PENDING = null;
    }
  }, []);

  const committee = window.EEC.committeeById[selected];
  const members = window.EEC.MEMBERS.filter(m => m.tracked && m.seats.some(s => s.committee === selected));
  const meetings = window.EEC.MEETINGS.filter(m => m.committee === selected);
  const motions = window.EEC.MOTIONS.filter(v => v.committee === selected || v.originatingCommittee === selected);
  const actions = window.EEC.ACTIONS.filter(a => a.committee === selected);

  // Group voting members: Co-Chairs (top, separate) → Voting (alpha) → Students (alpha)
  // Co-chairs: Faculty Co-Chair (voting) before Admin Co-Chair (non-voting)
  const groups = { cochair: [], voting: [], student: [], nonvoting: [] };
  for (const m of members) {
    const seat = m.seats.find(s => s.committee === selected);
    const t = (seat?.seat || "").toLowerCase();
    const isCochair = seat?.section === "Co-Chairs" || /co-chair/.test(t) || (selected === "EEC" && /^chair$/.test(t));
    const isStudent = /student/.test(t);
    if (isCochair) groups.cochair.push(m);
    else if (isStudent) groups.student.push(m);
    else if (seat?.vote) groups.voting.push(m);
    else groups.nonvoting.push(m);
  }
  groups.cochair.sort((a, b) => {
    const sa = a.seats.find(s => s.committee === selected);
    const sb = b.seats.find(s => s.committee === selected);
    const va = sa?.vote ? 0 : 1;
    const vb = sb?.vote ? 0 : 1;
    if (va !== vb) return va - vb;
    return _cmpByLast(a, b);
  });
  groups.voting.sort(_cmpByLast);
  groups.student.sort(_cmpByLast);
  groups.nonvoting.sort(_cmpByLast);

  return (
    <div>
      <window.SectionHead
        eyebrow="Curricular Governance Structure"
        title="Committees"
        sub="Per the EEC Bylaws v2.0, the curriculum is overseen by the EEC and four standing subcommittees: PCCS, CCS, CIS, and AES."
      />

      {/* Committee tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, borderBottom: "1px solid var(--grey-3)", flexWrap: "wrap" }}>
        {C.map(c => {
          const active = selected === c.id;
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
              <span style={{ fontSize: 10.5, opacity: 0.7, fontWeight: 500 }}>· {c.id === "EEC" ? "Executive" : "Subcommittee"}</span>
            </button>
          );
        })}
      </div>

      {/* Committee header */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18, marginBottom: 22 }}>
        <window.Card>
          <div className="t-eyebrow" style={{ color: committee.deep, marginBottom: 6 }}>{committee.short} · Charge</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 8 }}>{committee.name}</h2>
          <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>{committee.charge}</div>
          <div style={{ fontSize: 11.5, color: "var(--grey-11)", marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--grey-2)" }}>
            <strong style={{ color: "var(--ink-2)" }}>Cadence:</strong> {committee.cadence}
          </div>
        </window.Card>
        <window.Card>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>Composition</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Stat label="Voting seats" value={committee.votingSeats} />
            <Stat label="Non-voting" value={committee.nonVotingSeats} />
            <Stat label="Quorum" value={committee.quorum} />
            <Stat label="Meetings AY" value={meetings.length} />
          </div>
        </window.Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
        <window.Card style={{ padding: 0 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--grey-2)", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 16 }}>Voting members ({members.length})</h3>
              <div style={{ fontSize: 11, color: "var(--grey-11)", marginTop: 4 }}>
                {selected === "EEC" ? "Voting roster aggregated from EEC minutes attendance records." : `Official ${selected} voting roster as of May 17, 2026.`}
              </div>
            </div>
            <button
              onClick={() => { window.EEC_PENDING = { committee: selected }; window.EEC_NAV.go("attendance"); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 10px", fontSize: 11.5, fontWeight: 600,
                color: committee.deep, background: committee.tint,
                border: `1px solid ${committee.color}`, borderRadius: 5,
                cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
              }}
              title={`Open the live attendance matrix for ${committee.short}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>
              Check attendance →
            </button>
          </div>
          {members.length === 0 ? (
            <div style={{ padding: 22 }}>
              <window.Empty title="No members on file" sub={`${committee.short} roster will appear here once filed.`} />
            </div>
          ) : (
            <div>
              <RosterGroup title="Co-Chairs" members={groups.cochair} committeeId={selected} />
              <RosterGroup title="Voting members" members={groups.voting} committeeId={selected} />
              <RosterGroup title="Student members" members={groups.student} committeeId={selected} variant="student" />
              <RosterGroup title="Non-voting / ex officio" members={groups.nonvoting} committeeId={selected} variant="nonvoting" />
            </div>
          )}
        </window.Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <window.Card style={{ padding: 0 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--grey-2)" }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 15 }}>Recent meetings</h3>
            </div>
            {meetings.slice(0, 8).map(m => (
              <div key={m.id} onClick={() => { window.EEC_PENDING = { meeting: m.id }; window.EEC_NAV.go("meetings"); }}
                   style={{ padding: "8px 18px", borderBottom: "1px solid var(--grey-2)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--grey-11)" }}>{m.date}</span>
                <span style={{ fontSize: 10.5, color: "var(--grey-7)" }}>{m.present.length} present</span>
              </div>
            ))}
          </window.Card>

          <window.Card>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 15, marginBottom: 10 }}>Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <ActivityRow label="Motions" value={motions.length} />
              <ActivityRow label="Action items" value={actions.length} />
              <ActivityRow label="Open actions" value={actions.filter(a => a.status !== "Completed").length} />
            </div>
          </window.Card>
        </div>
      </div>
    </div>
  );
}

function RosterGroup({ title, members, committeeId, variant }) {
  if (!members.length) return null;
  const isStudent = variant === "student";
  const isCoChair = title === "Co-Chairs";
  const isNonVoting = variant === "nonvoting";
  return (
    <>
      <div style={{
        padding: "8px 18px",
        fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
        fontWeight: 700, color: "var(--grey-11)",
        background: isCoChair ? "var(--brand-violet-tint)" : "var(--grey-1)",
        borderTop: isCoChair ? "none" : "1px solid var(--grey-2)",
        borderBottom: "1px solid var(--grey-2)",
      }}>
        {title} <span style={{ color: "var(--grey-7)", fontWeight: 600, marginLeft: 6 }}>{members.length}</span>
      </div>
      {members.map(m => {
        const seat = m.seats.find(s => s.committee === committeeId);
        const total = m.presentCount + m.absentCount;
        const rate = total > 0 ? Math.round(100 * m.presentCount / total) : null;
        return (
          <div key={m.id} onClick={() => { window.EEC_PENDING = { member: m.id }; window.EEC_NAV.go("members"); }}
               style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderBottom: "1px solid var(--grey-2)", cursor: "pointer", opacity: isNonVoting ? 0.85 : 1 }}>
            <window.MemberAvatar id={m.id} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: "var(--grey-11)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {seat?.title || seat?.seat || m.role}
              </div>
            </div>
            {committeeId === "EEC" && total > 0 && (
              <div style={{ fontSize: 10.5, color: "var(--grey-11)", fontFamily: "var(--mono)", textAlign: "right" }}>
                {m.presentCount}P / {m.absentCount}A{rate !== null ? ` · ${rate}%` : ""}
              </div>
            )}
            <span className={"pill " + (isCoChair ? "violet" : isStudent ? "magenta" : isNonVoting ? "muted" : "cyan")} style={{ fontSize: 9.5 }}>
              {isCoChair ? "CO-CHAIR" : isStudent ? "STUDENT" : isNonVoting ? "EX OFFICIO" : "VOTE"}
            </span>
          </div>
        );
      })}
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="t-eyebrow" style={{ fontSize: 9.5 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--serif)", color: "var(--ink)", lineHeight: 1, marginTop: 3 }}>{value}</div>
    </div>
  );
}
function ActivityRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px dotted var(--grey-3)" }}>
      <span style={{ fontSize: 12, color: "var(--grey-11)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)" }}>{value}</span>
    </div>
  );
}

window.EecCommittees = EecCommittees;
