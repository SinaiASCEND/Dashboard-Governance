// eec-meetings.jsx — Meetings & Minutes archive

const { useState: useStateM, useEffect: useEffectM, useMemo: useMemoM } = React;

function EecMeetings() {
  const M = window.EEC.MEETINGS;
  const [search, setSearch] = useStateM("");
  const [filterCommittee, setFilterCommittee] = useStateM("all");
  const [openMeeting, setOpenMeeting] = useStateM(null);

  useEffectM(() => {
    if (window.EEC_PENDING?.meeting) {
      setOpenMeeting(window.EEC_PENDING.meeting);
      window.EEC_PENDING = null;
    }
  }, []);

  const filtered = useMemoM(() => {
    const q = search.toLowerCase();
    return [...M].sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(m => {
        if (filterCommittee !== "all" && m.committee !== filterCommittee) return false;
        if (q) {
          const hay = (m.summary + " " + m.topics.join(" ") + " " + m.date).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
  }, [search, filterCommittee]);

  // Year groupings
  const grouped = useMemoM(() => {
    const out = new Map();
    filtered.forEach(m => {
      const key = m.date.slice(0, 7);
      if (!out.has(key)) out.set(key, []);
      out.get(key).push(m);
    });
    return [...out.entries()];
  }, [filtered]);

  return (
    <div>
      <window.SectionHead
        eyebrow={`Minutes Archive · ${M.length} meetings`}
        title="Meetings &amp; Minutes"
        sub="All EEC and subcommittee meetings with attendance, agenda items, and votes. Approved minutes are retained as part of the official record per Article VI §7 of the bylaws."
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <window.SearchInput value={search} onChange={setSearch} placeholder="Search meetings…" width={280} />
        <FilterChips label="Committee" value={filterCommittee} onChange={setFilterCommittee}
          options={[{ v: "all", l: "All" }, ...window.EEC.COMMITTEES.map(c => ({ v: c.id, l: c.short }))]} />
        <div style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--grey-11)" }}>
          {filtered.length} meeting{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {grouped.map(([month, arr]) => {
        const d = new Date(month + "-01");
        return (
          <div key={month} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-11)", marginBottom: 10, paddingLeft: 4 }}>
              {d.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {arr.map(m => <MeetingCard key={m.id} m={m} onOpen={setOpenMeeting} />)}
            </div>
          </div>
        );
      })}

      <MeetingDrawer meetingId={openMeeting} onClose={() => setOpenMeeting(null)} />
    </div>
  );
}

function FilterChips({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 10.5, color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", gap: 0, border: "1px solid var(--grey-3)", borderRadius: 6, overflow: "hidden" }}>
        {options.map(o => (
          <button key={o.v} onClick={() => onChange(o.v)}
            style={{
              padding: "5px 10px", fontSize: 11.5, fontWeight: 500,
              background: value === o.v ? "var(--ink)" : "var(--paper)",
              color: value === o.v ? "white" : "var(--ink-2)",
              border: 0, borderRight: "1px solid var(--grey-3)", cursor: "pointer", fontFamily: "inherit",
            }}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function MeetingCard({ m, onOpen }) {
  const c = window.EEC.committeeById[m.committee];
  const d = new Date(m.date);
  const isFuture = new Date(m.date) > window.EEC.TODAY;
  const motionsAtMeeting = window.EEC.MOTIONS.filter(v => v.meetingId === m.id);
  const actionsAtMeeting = window.EEC.ACTIONS.filter(a => a.originatingMeeting === m.id);

  return (
    <div onClick={() => onOpen(m.id)} className="card" style={{
      padding: 0, cursor: "pointer", display: "grid", gridTemplateColumns: "100px 1fr 200px",
      gap: 0, transition: "box-shadow .15s",
      borderLeft: `3px solid ${c.color}`,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ""}
    >
      {/* Date column */}
      <div style={{ padding: "16px 16px", borderRight: "1px solid var(--grey-2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--grey-1)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--grey-11)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {d.toLocaleDateString("en-US", { weekday: "short" })}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: c.deep, fontFamily: "var(--serif)", lineHeight: 1, marginTop: 3 }}>
          {d.getDate()}
        </div>
        <div style={{ fontSize: 10, color: "var(--grey-11)", fontWeight: 500, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {d.toLocaleDateString("en-US", { month: "short" })}
        </div>
      </div>

      {/* Main column */}
      <div style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
          <window.CommitteeChip id={m.committee} size="md" />
          <span style={{ fontSize: 11, color: "var(--grey-11)" }}>{m.type}</span>
          {isFuture && <span className="pill outline" style={{ fontSize: 10 }}>Scheduled</span>}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--grey-7)", fontFamily: "var(--mono)" }}>
            {m.id}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
          {m.topics.slice(0, 4).map((t, i) => (
            <span key={i} style={{
              fontSize: 11.5, color: "var(--ink-2)",
              padding: "2px 8px", background: "var(--grey-1)",
              border: "1px solid var(--grey-2)", borderRadius: 4,
              maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{t}</span>
          ))}
          {m.topics.length > 4 && <span style={{ fontSize: 11, color: "var(--grey-7)" }}>+{m.topics.length - 4} more</span>}
        </div>
        {m.presidingOfficer && (
          <div style={{ fontSize: 11, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600 }}>Presiding:</span> {m.presidingOfficer.slice(0, 200)}
          </div>
        )}
      </div>

      {/* Stats column */}
      <div style={{ padding: "14px 18px", borderLeft: "1px solid var(--grey-2)", display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
        <StatRow label="Voting present" value={`${m.present.length}${m.absent.length ? ` / ${m.present.length + m.absent.length}` : ''}`} />
        <StatRow label="Motions" value={motionsAtMeeting.length} />
        <StatRow label="Action items" value={actionsAtMeeting.length} />
        <StatRow label="Status" value={m.minutesStatus} />
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11 }}>
      <span style={{ color: "var(--grey-11)", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 9.5, fontWeight: 600 }}>{label}</span>
      <span style={{ color: "var(--ink-2)", fontWeight: 600, fontFamily: "var(--mono)", fontSize: 11.5 }}>{value}</span>
    </div>
  );
}

// ─── Meeting detail drawer ─────────────────────────────────────────────────
function MeetingDrawer({ meetingId, onClose }) {
  const m = meetingId ? window.EEC.meetingById[meetingId] : null;
  if (!m) return <window.Drawer open={false} onClose={onClose} title="" />;
  const c = window.EEC.committeeById[m.committee];
  const motionsAtMeeting = window.EEC.MOTIONS.filter(v => v.meetingId === m.id);
  const actionsAtMeeting = window.EEC.ACTIONS.filter(a => a.originatingMeeting === m.id);
  const d = new Date(m.date);
  const docxPath = `minutes/EEC_Minutes_${m.date}.docx`;

  return (
    <window.Drawer
      open={!!m}
      onClose={onClose}
      eyebrow={`${c.short} Meeting · ${m.type}`}
      title={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      accentColor={c.color}
      width={680}
    >
      {/* Meta */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        {m.time && <MetaField label="Time" value={m.time} />}
        {m.modality && <MetaField label="Modality" value={m.modality} />}
        {m.presidingOfficer && <MetaField label="Presiding officer" value={m.presidingOfficer} colSpan={2} />}
      </div>

      <a href={docxPath} download style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 14px", fontSize: 12, fontWeight: 600,
        background: "var(--grey-1)", border: "1px solid var(--grey-3)",
        borderRadius: 6, color: "var(--ink-2)", marginBottom: 22, textDecoration: "none",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download full minutes (.docx)
      </a>

      {/* Attendance */}
      <Section label={`Attendance — voting members (${m.present.length} present, ${m.absent.length} absent)`}>
        <PeopleGrid ids={m.present} />
        {m.absent.length > 0 && (
          <>
            <div style={{ fontSize: 11, color: "var(--grey-11)", marginTop: 10, marginBottom: 4, fontWeight: 600 }}>Absent</div>
            <PeopleGrid ids={m.absent} muted />
          </>
        )}
      </Section>

      {m.exOfficio.length > 0 && (
        <Section label={`Ex Officio / Non-voting present (${m.exOfficio.length})`}>
          <PeopleGrid ids={m.exOfficio} />
        </Section>
      )}

      {m.guests.length > 0 && (
        <Section label={`Guests (${m.guests.length})`}>
          <PeopleGrid ids={m.guests} />
        </Section>
      )}

      {/* Agenda items */}
      <Section label={`Agenda items (${m.items.length})`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {m.items.map((it, i) => <AgendaItemRow key={i} item={it} />)}
        </div>
      </Section>

      {motionsAtMeeting.length > 0 && (
        <Section label={`Motions voted (${motionsAtMeeting.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {motionsAtMeeting.map(mt => (
              <div key={mt.id} onClick={() => { window.EEC_PENDING = { motion: mt.id }; window.EEC_NAV.go("motions"); onClose(); }}
                   style={{ padding: 11, background: "var(--grey-1)", borderRadius: 8, border: "1px solid var(--grey-2)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{mt.title}</span>
                <window.MotionResult result={mt.result} tally={mt.tally} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {actionsAtMeeting.length > 0 && (
        <Section label={`Action items opened (${actionsAtMeeting.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {actionsAtMeeting.map(a => (
              <div key={a.id} onClick={() => { window.EEC_PENDING = { action: a.id }; window.EEC_NAV.go("actions"); onClose(); }}
                   style={{ padding: 10, background: "var(--paper)", borderRadius: 6, border: "1px solid var(--grey-2)", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                <window.StatusPill status={a.status} percent={a.percent} />
                <span style={{ fontSize: 12.5, color: "var(--ink-2)", flex: 1, lineHeight: 1.35 }}>{a.title}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </window.Drawer>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div className="t-eyebrow" style={{ marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

function MetaField({ label, value, colSpan = 1 }) {
  return (
    <div style={{ gridColumn: colSpan === 2 ? "span 2" : undefined }}>
      <div className="t-eyebrow" style={{ fontSize: 9.5, color: "var(--grey-11)" }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 3, lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}

function PeopleGrid({ ids, muted }) {
  if (ids.length === 0) return <div style={{ fontSize: 12, color: "var(--grey-7)" }}>None</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
      {ids.map(id => {
        const p = window.EEC.memberById[id];
        if (!p) return null;
        return (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", opacity: muted ? 0.5 : 1 }}>
            <window.MemberAvatar id={id} size={22} />
            <div style={{ minWidth: 0, lineHeight: 1.2 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)" }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: "var(--grey-11)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AgendaItemRow({ item }) {
  const isVoting = /VOTING/i.test(item.category || "");
  return (
    <div style={{ padding: 12, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--grey-2)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "var(--brand-violet)", fontWeight: 700, fontFamily: "var(--mono)" }}>{item.idx}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>{item.title}</div>
          {item.category && (
            <div style={{ marginTop: 4 }}>
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.04em",
                background: isVoting ? "var(--brand-cyan-tint)" : "var(--grey-2)",
                color: isVoting ? "var(--brand-cyan-deep)" : "var(--grey-11)",
              }}>{item.category}</span>
            </div>
          )}
        </div>
      </div>
      {item.presenter && (
        <div style={{ fontSize: 11, color: "var(--grey-11)", marginTop: 4 }}>
          <strong>Presenter:</strong> {item.presenter}
        </div>
      )}
      {item.lcme && item.lcme.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 7 }}>
          {item.lcme.slice(0, 8).map(l => <window.LcmeBadge key={l} id={l} short />)}
        </div>
      )}
      {item.outcome && (
        <div style={{ fontSize: 11.5, color: "var(--grey-11)", marginTop: 8, lineHeight: 1.5, fontStyle: "italic" }}>
          {item.outcome.length > 280 ? item.outcome.slice(0, 277) + "…" : item.outcome}
        </div>
      )}
    </div>
  );
}

window.EecMeetings = EecMeetings;
