// eec-linkage.jsx — Cross-reference map: EEC ↔ subcommittees, motions ↔ actions ↔ policies ↔ meetings

const { useState: useStateLk, useMemo: useMemoLk } = React;

function EecLinkage() {
  const [view, setView] = useStateLk("flow");

  return (
    <div>
      <window.SectionHead
        eyebrow="Cross-references"
        title="Linkage Map"
        sub="Trace how items move through governance: subcommittee work → EEC motion → action item → closed-loop review. The bylaws require closed-loop follow-up of every action within 12 months (Art. II §3)."
        actions={[
          <div key="v" style={{ display: "flex", padding: 3, background: "var(--grey-1)", border: "1px solid var(--grey-3)", borderRadius: 7 }}>
            {[
              { v: "flow", l: "Action flow" },
              { v: "lcme", l: "By LCME element" },
              { v: "matrix", l: "Matrix" },
            ].map(o => (
              <button key={o.v} onClick={() => setView(o.v)}
                style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600,
                  background: view === o.v ? "var(--paper)" : "transparent",
                  color: view === o.v ? "var(--ink)" : "var(--grey-11)",
                  border: 0, borderRadius: 5, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: view === o.v ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>
                {o.l}
              </button>
            ))}
          </div>,
        ]}
      />

      {view === "flow" && <FlowView />}
      {view === "lcme" && <LcmeView />}
      {view === "matrix" && <MatrixView />}
    </div>
  );
}

// ─── Flow view: motion → action chains ─────────────────────────────────────
function FlowView() {
  const V = window.EEC.MOTIONS;
  const rows = V.map(v => {
    const meeting = window.EEC.meetingById[v.meetingId];
    const actions = window.EEC.ACTIONS.filter(a => a.originatingMeeting === v.meetingId);
    return { v, meeting, actions };
  }).filter(r => r.actions.length > 0).sort((a, b) => new Date(b.v.date) - new Date(a.v.date));

  return (
    <window.Card pad={false}>
      <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--grey-2)" }}>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 16 }}>Motion → Meeting → Action item chains</h3>
        <div style={{ fontSize: 11, color: "var(--grey-11)", marginTop: 4 }}>
          For each motion, the meeting it was voted at and the action items that resulted.
        </div>
      </div>
      <div>
        {rows.map((r, i) => (
          <div key={i} style={{ padding: "16px 22px", borderBottom: "1px solid var(--grey-2)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 12, alignItems: "stretch" }}>
              {/* Motion */}
              <div onClick={() => { window.EEC_PENDING = { motion: r.v.id }; window.EEC_NAV.go("motions"); }}
                   style={{ padding: 12, background: "var(--brand-violet-tint)", borderLeft: "3px solid var(--brand-violet)", borderRadius: 4, cursor: "pointer" }}>
                <div className="t-eyebrow" style={{ color: "var(--brand-violet)", fontSize: 9.5 }}>Motion</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>{r.v.title}</div>
                <div style={{ marginTop: 6 }}><window.MotionResult result={r.v.result} tally={r.v.tally} /></div>
              </div>
              <Arrow />
              {/* Meeting */}
              <div onClick={() => { window.EEC_PENDING = { meeting: r.meeting.id }; window.EEC_NAV.go("meetings"); }}
                   style={{ padding: 12, background: "var(--grey-1)", borderRadius: 4, cursor: "pointer", border: "1px solid var(--grey-2)" }}>
                <div className="t-eyebrow" style={{ fontSize: 9.5 }}>Voted at</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <window.CommitteeChip id={r.meeting.committee} size="sm" />
                  <span style={{ fontSize: 11.5, fontFamily: "var(--mono)" }}>{r.meeting.date}</span>
                </div>
                <div style={{ fontSize: 10.5, color: "var(--grey-11)", marginTop: 4 }}>
                  {r.meeting.present.length} voting present
                </div>
              </div>
              <Arrow />
              {/* Actions */}
              <div style={{ padding: 12, background: "var(--brand-cyan-tint)", borderLeft: "3px solid var(--brand-cyan)", borderRadius: 4 }}>
                <div className="t-eyebrow" style={{ color: "var(--brand-cyan-deep)", fontSize: 9.5 }}>Action items ({r.actions.length})</div>
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                  {r.actions.slice(0, 3).map(a => (
                    <div key={a.id} onClick={() => { window.EEC_PENDING = { action: a.id }; window.EEC_NAV.go("actions"); }}
                         style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <window.StatusPill status={a.status} percent={a.percent} />
                      <span style={{ fontSize: 11, color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{a.title}</span>
                    </div>
                  ))}
                  {r.actions.length > 3 && <span style={{ fontSize: 10, color: "var(--grey-7)" }}>+{r.actions.length - 3} more</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </window.Card>
  );
}

function Arrow() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--grey-5)" }}>
      <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 7h21M16 1l6 6-6 6" />
      </svg>
    </div>
  );
}

// ─── LCME view: items grouped by element ───────────────────────────────────
function LcmeView() {
  const elements = useMemoLk(() => {
    return window.EEC.LCME.map(el => {
      const motions = window.EEC.MOTIONS.filter(v => v.lcme.includes(el.id));
      const actions = window.EEC.ACTIONS.filter(a => a.lcme.includes(el.id));
      const policies = window.EEC.POLICIES.filter(p => (p.lcme || []).includes(el.id));
      return { ...el, motions, actions, policies, total: motions.length + actions.length + policies.length };
    }).filter(e => e.total > 0).sort((a, b) => b.total - a.total);
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 14 }}>
      {elements.map(el => (
        <window.Card key={el.id} style={{ padding: 0 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--grey-2)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              padding: "2px 8px", fontSize: 12, fontWeight: 700,
              color: "var(--brand-violet)", background: "var(--brand-violet-tint)",
              borderRadius: 3, fontFamily: "var(--mono)",
            }}>{el.id}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{el.title}</div>
            </div>
            <span style={{ fontSize: 11, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>{el.total} items</span>
          </div>
          <div style={{ padding: "10px 16px", maxHeight: 240, overflowY: "auto" }}>
            {el.policies.length > 0 && (
              <Group label={`Policies (${el.policies.length})`}>
                {el.policies.map(p => (
                  <Item key={p.id} onClick={() => window.EEC_NAV.go("policies", { policy: p.id })}>{p.title}</Item>
                ))}
              </Group>
            )}
            {el.motions.length > 0 && (
              <Group label={`Motions (${el.motions.length})`}>
                {el.motions.slice(0, 5).map(v => (
                  <Item key={v.id} onClick={() => window.EEC_NAV.go("motions", { motion: v.id })}>
                    <window.MotionResult result={v.result} tally={null} />
                    <span style={{ fontSize: 11, color: "var(--ink-2)" }}>{v.title}</span>
                  </Item>
                ))}
                {el.motions.length > 5 && <div style={{ fontSize: 10.5, color: "var(--grey-7)", padding: "2px 0" }}>+{el.motions.length - 5} more</div>}
              </Group>
            )}
            {el.actions.length > 0 && (
              <Group label={`Action items (${el.actions.length})`}>
                {el.actions.slice(0, 5).map(a => (
                  <Item key={a.id} onClick={() => window.EEC_NAV.go("actions", { action: a.id })}>
                    <window.StatusPill status={a.status} percent={a.percent} />
                    <span style={{ fontSize: 11, color: "var(--ink-2)" }}>{a.title}</span>
                  </Item>
                ))}
                {el.actions.length > 5 && <div style={{ fontSize: 10.5, color: "var(--grey-7)", padding: "2px 0" }}>+{el.actions.length - 5} more</div>}
              </Group>
            )}
          </div>
        </window.Card>
      ))}
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="t-eyebrow" style={{ fontSize: 9.5, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  );
}
function Item({ children, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 0", cursor: "pointer", fontSize: 11.5, color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
}

// ─── Matrix view: meetings × LCME ──────────────────────────────────────────
function MatrixView() {
  const meetings = [...window.EEC.MEETINGS].sort((a, b) => new Date(a.date) - new Date(b.date));
  const els = window.EEC.LCME.filter(e => e.standard === 8);
  // For each meeting × element: count motions+actions tagged that element
  function countFor(meeting, el) {
    const m = window.EEC.MOTIONS.filter(v => v.meetingId === meeting.id && v.lcme.includes(el.id)).length;
    const a = window.EEC.ACTIONS.filter(x => x.originatingMeeting === meeting.id && x.lcme.includes(el.id)).length;
    return m + a;
  }
  const maxCount = Math.max(1, ...meetings.flatMap(m => els.map(e => countFor(m, e))));

  return (
    <window.Card pad={false}>
      <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--grey-2)" }}>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 16 }}>LCME Standard 8 — meeting-by-meeting coverage</h3>
        <div style={{ fontSize: 11, color: "var(--grey-11)", marginTop: 4 }}>
          Each cell shows the count of motions + action items tagged to that element at that meeting. Darker = more activity.
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--grey-3)", fontSize: 10, textAlign: "left", color: "var(--grey-11)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Meeting</th>
              {els.map(e => (
                <th key={e.id} style={{ padding: "10px 8px", borderBottom: "1px solid var(--grey-3)", fontSize: 10.5, textAlign: "center", fontFamily: "var(--mono)", color: "var(--brand-violet)" }}
                    title={e.title}>
                  {e.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meetings.map(m => (
              <tr key={m.id}>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--grey-2)", fontSize: 11, color: "var(--ink-2)", whiteSpace: "nowrap", fontFamily: "var(--mono)" }}>
                  {m.date}
                </td>
                {els.map(e => {
                  const c = countFor(m, e);
                  const intensity = c / maxCount;
                  const bg = c === 0 ? "transparent" : `rgba(34, 31, 114, ${0.1 + intensity * 0.6})`;
                  return (
                    <td key={e.id} style={{ padding: 0, borderBottom: "1px solid var(--grey-2)", textAlign: "center" }}>
                      <div style={{
                        margin: 2, padding: "9px 4px", background: bg, color: c === 0 ? "var(--grey-5)" : (intensity > 0.3 ? "white" : "var(--brand-violet)"),
                        borderRadius: 3, fontSize: 11.5, fontWeight: 700, fontFamily: "var(--mono)",
                      }}>{c || "·"}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </window.Card>
  );
}

window.EecLinkage = EecLinkage;
