// eec-members.jsx — Members directory with attendance counts

const { useState: useStateMb, useEffect: useEffectMb, useMemo: useMemoMb } = React;

function _lastNameMb(name) {
  return (name || "")
    .replace(/\(.*?\)/g, "")
    .split(",")[0]
    .trim()
    .split(/\s+/)
    .slice(-1)[0]
    .toLowerCase();
}
function _cmpByLastMb(a, b) {
  const la = _lastNameMb(a.name), lb = _lastNameMb(b.name);
  return la < lb ? -1 : la > lb ? 1 : 0;
}
// Classify member by their role across committees:
//   "cochair" if they hold any Chair / Co-Chair seat
//   "student" if any seat is a Student Representative (and not a co-chair)
//   "voting"  if they have any voting seat
//   "nonvoting" otherwise
function _classify(m) {
  let hasCochair = false, hasStudent = false, hasVoting = false;
  for (const s of m.seats || []) {
    const t = (s.seat || "").toLowerCase();
    if (s.section === "Co-Chairs" || /co-chair/.test(t) || /^chair$/.test(t) || /^chair,/.test(t)) hasCochair = true;
    if (/student/.test(t)) hasStudent = true;
    if (s.vote) hasVoting = true;
  }
  if (hasCochair) return "cochair";
  if (hasStudent) return "student";
  if (hasVoting) return "voting";
  return "nonvoting";
}

function EecMembers() {
  const TRACKED = window.EEC.MEMBERS.filter(m => m.tracked);
  const [search, setSearch] = useStateMb("");
  const [filter, setFilter] = useStateMb("all");
  const [openMember, setOpenMember] = useStateMb(null);

  const filtered = useMemoMb(() => {
    const q = search.toLowerCase();
    return TRACKED.filter(m => {
      if (filter === "students") {
        if (!m.seats.some(s => /Student/i.test(s.seat))) return false;
      } else if (filter === "nonvoting") {
        if (m.seats.every(s => s.vote)) return false;
      } else if (filter !== "all") {
        // committee filter — show ALL members on that committee, voting or not
        if (!m.seats.some(s => s.committee === filter)) return false;
      }
      if (q && !m.name.toLowerCase().includes(q) && !(m.role||"").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filter]);

  const stats = useMemoMb(() => ({
    eec:  TRACKED.filter(m => m.seats.some(s => s.committee === "EEC")).length,
    pccs: TRACKED.filter(m => m.seats.some(s => s.committee === "PCCS")).length,
    ccs:  TRACKED.filter(m => m.seats.some(s => s.committee === "CCS")).length,
    cis:  TRACKED.filter(m => m.seats.some(s => s.committee === "CIS")).length,
    aes:  TRACKED.filter(m => m.seats.some(s => s.committee === "AES")).length,
    students: TRACKED.filter(m => m.seats.some(s => /Student/i.test(s.seat))).length,
    nonvoting: TRACKED.filter(m => m.seats.every(s => !s.vote)).length,
  }), []);

  return (
    <div>
      <window.SectionHead
        eyebrow={`Voting members · ${TRACKED.length} people across the EEC and 4 subcommittees`}
        title="Members"
        sub="Permanent voting membership of the EEC and its standing subcommittees, per the official rosters dated May 17, 2026. Three-year staggered terms per Article III §5.2 of the bylaws."
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <window.SearchInput value={search} onChange={setSearch} placeholder="Search members…" width={280} />
        <div style={{ display: "flex", gap: 0, border: "1px solid var(--grey-3)", borderRadius: 6, overflow: "hidden" }}>
          {[
            { v: "all",  l: `All (${TRACKED.length})` },
            { v: "EEC",  l: `EEC (${stats.eec})` },
            { v: "PCCS", l: `PCCS (${stats.pccs})` },
            { v: "CCS",  l: `CCS (${stats.ccs})` },
            { v: "CIS",  l: `CIS (${stats.cis})` },
            { v: "AES",  l: `AES (${stats.aes})` },
            { v: "students", l: `Students (${stats.students})` },
            { v: "nonvoting", l: `Non-voting (${stats.nonvoting})` },
          ].map(o => (
            <button key={o.v} onClick={() => setFilter(o.v)}
              style={{ padding: "5px 12px", fontSize: 11.5, fontWeight: 500,
                background: filter === o.v ? "var(--ink)" : "var(--paper)",
                color: filter === o.v ? "white" : "var(--ink-2)",
                border: 0, borderRight: "1px solid var(--grey-3)", cursor: "pointer", fontFamily: "inherit" }}>
              {o.l}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--grey-11)" }}>
          {filtered.length} shown
        </div>
      </div>

      {(() => {
        const groups = { cochair: [], voting: [], student: [], nonvoting: [] };
        for (const m of filtered) groups[_classify(m)].push(m);
        for (const k of Object.keys(groups)) groups[k].sort(_cmpByLastMb);
        const sections = [
          { key: "cochair",  label: "Chairs & Co-Chairs", show: groups.cochair.length > 0 },
          { key: "voting",   label: "Voting members",     show: groups.voting.length > 0 },
          { key: "student",  label: "Student members",    show: groups.student.length > 0 },
          { key: "nonvoting",label: "Non-voting / ex officio", show: groups.nonvoting.length > 0 },
        ];
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {sections.filter(s => s.show).map(s => (
              <div key={s.key}>
                <div style={{
                  fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase",
                  fontWeight: 700, color: "var(--grey-11)",
                  marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid var(--grey-3)",
                  display: "flex", alignItems: "baseline", gap: 8,
                }}>
                  <span>{s.label}</span>
                  <span style={{ color: "var(--grey-7)", fontWeight: 600 }}>{groups[s.key].length}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                  {groups[s.key].map(m => <MemberCard key={m.id} m={m} onOpen={setOpenMember} />)}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      <MemberDrawer memberId={openMember} onClose={() => setOpenMember(null)} />
    </div>
  );
}

function MemberCard({ m, onOpen }) {
  const total = m.presentCount + m.absentCount;
  const rate = total > 0 ? Math.round(100 * m.presentCount / total) : null;

  // Per-committee voting status — one pill per committee so it's clear when a
  // person is voting on one body and non-voting on another (e.g. PCCS co-chairs
  // sitting on the EEC as non-voting members).
  const committeeOrder = ["EEC", "PCCS", "CCS", "CIS", "AES"];
  const perCommittee = [];
  const seen = new Set();
  for (const cid of committeeOrder) {
    const seats = m.seats.filter(s => s.committee === cid);
    if (!seats.length) continue;
    if (seen.has(cid)) continue;
    seen.add(cid);
    // A member is "voting" on a committee if ANY of their seats on it is voting.
    perCommittee.push({ committee: cid, voting: seats.some(s => s.vote) });
  }

  return (
    <div onClick={() => onOpen(m.id)} className="card" style={{ padding: 14, cursor: "pointer", display: "flex", gap: 12 }}>
      <window.MemberAvatar id={m.id} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>{m.name}</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--grey-11)", marginTop: 3, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {m.role}
        </div>
        {perCommittee.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
            {perCommittee.map(p => {
              const c = window.EEC.committeeById[p.committee];
              const bg = p.voting ? c.tint : "var(--grey-2)";
              const fg = p.voting ? c.deep : "var(--grey-7)";
              return (
                <span key={p.committee} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "2px 7px 2px 5px",
                  fontSize: 10, fontWeight: 700,
                  color: fg, background: bg,
                  borderRadius: 3,
                  letterSpacing: "0.02em",
                  border: p.voting ? `1px solid ${c.tint}` : "1px solid var(--grey-3)",
                }} title={p.voting ? `Voting on ${p.committee}` : `Non-voting on ${p.committee}`}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: p.voting ? c.color : "var(--grey-5)", flex: "0 0 5px" }} />
                  {p.committee}
                  <span style={{ fontWeight: 500, fontSize: 9, marginLeft: 2, opacity: 0.85 }}>
                    {p.voting ? "vote" : "ex-officio"}
                  </span>
                </span>
              );
            })}
          </div>
        )}
        {total > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <window.MiniBar percent={rate || 0} color={rate >= 75 ? "var(--good)" : rate >= 50 ? "var(--brand-cyan)" : "var(--warn)"} width={120} />
            <span style={{ fontSize: 10.5, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>
              {m.presentCount}P / {m.absentCount}A · {rate}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberDrawer({ memberId, onClose }) {
  const m = memberId ? window.EEC.memberById[memberId] : null;
  if (!m) return <window.Drawer open={false} onClose={onClose} title="" />;

  // Find all meetings this member is involved with
  const meetingsPresent = window.EEC.MEETINGS.filter(mt =>
    mt.present.includes(m.id) || mt.exOfficio.includes(m.id) || mt.operations?.includes(m.id) || mt.guests.includes(m.id)
  );
  const meetingsAbsent = window.EEC.MEETINGS.filter(mt => mt.absent.includes(m.id));

  // Action items where they're the owner
  const ownedActions = window.EEC.ACTIONS.filter(a => a.ownerId === m.id);

  return (
    <window.Drawer
      open={!!m}
      onClose={onClose}
      eyebrow={m.seats[0]?.seat || "Member"}
      title={m.name}
      accentColor="var(--brand-violet)"
      width={580}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
        <window.MemberAvatar id={m.id} size={56} />
        <div>
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.4 }}>{m.role}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 22 }}>
        <Stat label="Present" value={m.presentCount} />
        <Stat label="Absent" value={m.absentCount} />
        <Stat label="Attendance" value={(m.presentCount + m.absentCount) === 0 ? "—" : `${Math.round(100 * m.presentCount / (m.presentCount + m.absentCount))}%`} />
      </div>

      <Section label={`Committee seats (${m.seats.length})`}>
        {m.seats.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--grey-1)", borderRadius: 6, marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <window.CommitteeChip id={s.committee} size="sm" />
              <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{s.seat}</span>
            </div>
            {s.vote ? <span className="pill cyan" style={{ fontSize: 10 }}>Voting</span> : <span className="pill muted" style={{ fontSize: 10 }}>Non-voting</span>}
          </div>
        ))}
      </Section>

      {ownedActions.length > 0 && (
        <Section label={`Action items owned (${ownedActions.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ownedActions.slice(0, 8).map(a => (
              <div key={a.id} onClick={() => { window.EEC_PENDING = { action: a.id }; window.EEC_NAV.go("actions"); onClose(); }}
                   style={{ padding: 10, background: "var(--paper)", borderRadius: 6, border: "1px solid var(--grey-2)", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                <window.StatusPill status={a.status} percent={a.percent} />
                <span style={{ fontSize: 12, color: "var(--ink-2)", flex: 1, lineHeight: 1.35 }}>{a.title}</span>
              </div>
            ))}
            {ownedActions.length > 8 && <span style={{ fontSize: 11, color: "var(--grey-7)" }}>+{ownedActions.length - 8} more</span>}
          </div>
        </Section>
      )}

      <Section label={`Meetings attended (${meetingsPresent.length})`}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 4 }}>
          {meetingsPresent.map(mt => (
            <div key={mt.id} onClick={() => { window.EEC_PENDING = { meeting: mt.id }; window.EEC_NAV.go("meetings"); onClose(); }}
                 style={{ padding: "5px 7px", background: "var(--good-tint)", color: "var(--good)", fontSize: 10.5, borderRadius: 4, textAlign: "center", cursor: "pointer", fontFamily: "var(--mono)" }}
                 title={mt.summary}>
              {mt.date.slice(5)}
            </div>
          ))}
          {meetingsAbsent.map(mt => (
            <div key={mt.id} onClick={() => { window.EEC_PENDING = { meeting: mt.id }; window.EEC_NAV.go("meetings"); onClose(); }}
                 style={{ padding: "5px 7px", background: "var(--bad-tint)", color: "var(--bad)", fontSize: 10.5, borderRadius: 4, textAlign: "center", cursor: "pointer", fontFamily: "var(--mono)" }}
                 title={"Absent — " + mt.summary}>
              {mt.date.slice(5)}
            </div>
          ))}
        </div>
      </Section>
    </window.Drawer>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}
function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 12, textAlign: "center" }}>
      <div className="t-eyebrow" style={{ fontSize: 9.5 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--serif)", color: "var(--ink)", marginTop: 4 }}>{value}</div>
    </div>
  );
}

window.EecMembers = EecMembers;
