// eec-motions.jsx — Motions & Votes

const { useState: useStateMo, useEffect: useEffectMo, useMemo: useMemoMo } = React;

function EecMotions() {
  const V = window.EEC.MOTIONS;
  const [search, setSearch] = useStateMo("");
  const [filterResult, setFilterResult] = useStateMo("all");
  const [openMotion, setOpenMotion] = useStateMo(null);

  useEffectMo(() => {
    if (window.EEC_PENDING?.motion) {
      setOpenMotion(window.EEC_PENDING.motion);
      window.EEC_PENDING = null;
    }
  }, []);

  const filtered = useMemoMo(() => {
    const q = search.toLowerCase();
    return [...V].sort((a, b) => new Date(b.date) - new Date(a.date)).filter(v => {
      if (filterResult !== "all" && v.result !== filterResult) return false;
      if (q && !(v.title + " " + v.body).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterResult]);

  return (
    <div>
      <window.SectionHead
        eyebrow={`Voting record · ${V.length} motions`}
        title="Motions &amp; Votes"
        sub="All formally moved items reviewed by the EEC. Each motion records the originating committee, vote result, and links to action items it generated."
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <window.SearchInput value={search} onChange={setSearch} placeholder="Search motions…" width={300} />
        <div style={{ display: "flex", gap: 0, border: "1px solid var(--grey-3)", borderRadius: 6, overflow: "hidden" }}>
          {[
            { v: "all", l: "All" },
            { v: "Approved", l: "Approved" },
            { v: "Rejected", l: "Rejected" },
            { v: "Deferred", l: "Deferred" },
          ].map(o => (
            <button key={o.v} onClick={() => setFilterResult(o.v)}
              style={{ padding: "5px 12px", fontSize: 11.5, fontWeight: 500,
                background: filterResult === o.v ? "var(--ink)" : "var(--paper)",
                color: filterResult === o.v ? "white" : "var(--ink-2)",
                border: 0, borderRight: "1px solid var(--grey-3)", cursor: "pointer", fontFamily: "inherit" }}>
              {o.l}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--grey-11)" }}>
          {filtered.length} motion{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <window.Card pad={false}>
        <table className="tbl" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: 110 }}>Date</th>
              <th>Motion</th>
              <th style={{ width: 110 }}>Origin</th>
              <th style={{ width: 130 }}>Result</th>
              <th style={{ width: 160 }}>LCME</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} onClick={() => setOpenMotion(v.id)} style={{ cursor: "pointer" }}>
                <td style={{ fontSize: 11.5, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>{v.date}</td>
                <td>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-2)", lineHeight: 1.4 }}>{v.title}</div>
                </td>
                <td><window.CommitteeChip id={v.originatingCommittee} size="sm" /></td>
                <td><window.MotionResult result={v.result} tally={v.tally} /></td>
                <td>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {v.lcme.slice(0, 6).map(l => <window.LcmeBadge key={l} id={l} short />)}
                    {v.lcme.length > 6 && <span style={{ fontSize: 10, color: "var(--grey-7)" }}>+{v.lcme.length - 6}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </window.Card>

      <MotionDrawer motionId={openMotion} onClose={() => setOpenMotion(null)} />
    </div>
  );
}

function MotionDrawer({ motionId, onClose }) {
  const v = motionId ? window.EEC.motionById[motionId] : null;
  if (!v) return <window.Drawer open={false} onClose={onClose} title="" />;
  const c = window.EEC.committeeById[v.committee];
  const meeting = window.EEC.meetingById[v.meetingId];
  const linkedActions = window.EEC.ACTIONS.filter(a => a.originatingMeeting === v.meetingId);

  return (
    <window.Drawer
      open={!!v}
      onClose={onClose}
      eyebrow={`Motion · ${window.fmtDate(v.date, "medium")}`}
      title={v.title}
      accentColor={c.color}
      width={620}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <window.CommitteeChip id={v.committee} size="md" />
        {v.originatingCommittee !== v.committee && (
          <>
            <span style={{ fontSize: 11, color: "var(--grey-7)" }}>originating from</span>
            <window.CommitteeChip id={v.originatingCommittee} size="md" subtle />
          </>
        )}
        <window.MotionResult result={v.result} tally={v.tally} />
      </div>

      {v.body && (
        <div style={{ padding: 14, background: "var(--grey-1)", border: "1px solid var(--grey-2)", borderRadius: 8, marginBottom: 18, fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
          {v.body}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <div className="t-eyebrow" style={{ fontSize: 10, color: "var(--grey-11)", marginBottom: 6 }}>LCME elements</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {v.lcme.length === 0 ? <span style={{ fontSize: 12, color: "var(--grey-7)" }}>None tagged</span> :
            v.lcme.map(l => <window.LcmeBadge key={l} id={l} />)}
        </div>
      </div>

      {meeting && (
        <div style={{ marginTop: 22, padding: 14, background: "var(--grey-1)", borderRadius: 8, border: "1px solid var(--grey-2)" }}>
          <div className="t-eyebrow" style={{ fontSize: 10, color: "var(--grey-11)" }}>Voted at</div>
          <div onClick={() => { window.EEC_PENDING = { meeting: meeting.id }; window.EEC_NAV.go("meetings"); onClose(); }}
               style={{ marginTop: 6, cursor: "pointer" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-cyan-deep)" }}>
              {window.fmtDate(meeting.date, "long")} — EEC Meeting
            </div>
            <div style={{ fontSize: 11.5, color: "var(--grey-11)", marginTop: 3 }}>
              {meeting.present.length} voting members present · {meeting.exOfficio.length} ex officio
            </div>
          </div>
        </div>
      )}

      {linkedActions.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div className="t-eyebrow" style={{ fontSize: 10, color: "var(--grey-11)", marginBottom: 8 }}>Action items from this meeting</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {linkedActions.map(a => (
              <div key={a.id} onClick={() => { window.EEC_PENDING = { action: a.id }; window.EEC_NAV.go("actions"); onClose(); }}
                   style={{ padding: 10, background: "var(--paper)", borderRadius: 6, border: "1px solid var(--grey-2)", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                <window.StatusPill status={a.status} percent={a.percent} />
                <span style={{ fontSize: 12, color: "var(--ink-2)", flex: 1, lineHeight: 1.35 }}>{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </window.Drawer>
  );
}

window.EecMotions = EecMotions;
