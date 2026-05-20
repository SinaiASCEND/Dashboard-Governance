// eec-search.jsx — Global search overlay across all governance items

const { useState: useStateSr, useEffect: useEffectSr, useMemo: useMemoSr, useRef: useRefSr } = React;

function EecSearch({ open, onClose, onNavigate }) {
  const [q, setQ] = useStateSr("");
  const [hoverIdx, setHoverIdx] = useStateSr(0);
  const inputRef = useRefSr(null);

  useEffectSr(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemoSr(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const out = [];
    function push(section, item, label, sub, key) {
      out.push({ section, item, label, sub, key });
    }
    // search meetings
    for (const m of window.EEC.MEETINGS) {
      const hay = (m.date + " " + m.summary + " " + (m.topics || []).join(" ") + " " + (m.presidingOfficer||"")).toLowerCase();
      if (hay.includes(term)) push("meetings", m, `Meeting · ${window.fmtDate(m.date, "medium")}`, (m.topics||[])[0] || m.summary, `meeting:${m.id}`);
    }
    // motions
    for (const v of window.EEC.MOTIONS) {
      const hay = (v.title + " " + (v.body||"")).toLowerCase();
      if (hay.includes(term)) push("motions", v, `Motion · ${window.fmtDate(v.date, "medium")}`, v.title, `motion:${v.id}`);
    }
    // actions
    for (const a of window.EEC.ACTIONS) {
      const hay = (a.id + " " + a.title + " " + (a.description||"") + " " + (a.ownerLabel||"") + " " + (a.domain||"")).toLowerCase();
      if (hay.includes(term)) push("actions", a, `${a.id} · ${a.status}`, a.title, `action:${a.id}`);
    }
    // members
    for (const m of window.EEC.MEMBERS) {
      const hay = (m.name + " " + m.role).toLowerCase();
      if (hay.includes(term)) push("members", m, `Member · ${m.presentCount + m.absentCount} meetings`, `${m.name} — ${m.role}`, `member:${m.id}`);
    }
    // policies
    for (const p of window.EEC.POLICIES) {
      const hay = (p.title + " " + (p.summary||"")).toLowerCase();
      if (hay.includes(term)) push("policies", p, `Policy · v${p.version}`, p.title, `policy:${p.id}`);
    }
    // reviews
    for (const r of window.EEC.REVIEWS) {
      // search title + summary first
      let matched = false;
      const summaryHay = (r.title + " " + (r.summary||"")).toLowerCase();
      if (summaryHay.includes(term)) { push("reviews", r, `Review · ${window.fmtDate(r.date, "medium")}`, r.title, `review:${r.id}`); matched = true; }
      // and into sections (one match per review max)
      if (!matched) {
        for (const s of r.sections) {
          if ((s.heading + " " + s.body).toLowerCase().includes(term)) {
            push("reviews", r, `Review · ${r.title.replace(/—.*/, '').trim()}`, s.heading, `review:${r.id}`);
            break;
          }
        }
      }
    }
    // LCME elements
    for (const e of window.EEC.LCME) {
      const hay = (e.id + " " + e.title + " " + e.short).toLowerCase();
      if (hay.includes(term)) push("lcme", e, `LCME ${e.id}`, e.title, `lcme:${e.id}`);
    }
    return out.slice(0, 50);
  }, [q]);

  useEffectSr(() => { setHoverIdx(0); }, [q]);

  function activate(r) {
    if (!r) return;
    if (r.section === "meetings") onNavigate("meetings", { meeting: r.item.id });
    else if (r.section === "motions") onNavigate("motions", { motion: r.item.id });
    else if (r.section === "actions") onNavigate("actions", { action: r.item.id });
    else if (r.section === "members") onNavigate("members", { member: r.item.id });
    else if (r.section === "policies") onNavigate("policies", { policy: r.item.id });
    else if (r.section === "reviews") onNavigate("reviews", { review: r.item.id });
    else if (r.section === "lcme") onNavigate("linkage", { lcme: r.item.id });
  }

  function onKey(e) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setHoverIdx(i => Math.min(results.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHoverIdx(i => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); activate(results[hoverIdx]); }
  }

  if (!open) return null;

  // Group by section
  const grouped = new Map();
  for (const r of results) {
    if (!grouped.has(r.section)) grouped.set(r.section, []);
    grouped.get(r.section).push(r);
  }
  const sectionLabels = { meetings: "Meetings", motions: "Motions", actions: "Action items", members: "Members", policies: "Policies", reviews: "Curriculum reviews", lcme: "LCME elements" };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(20,20,20,0.40)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: 96,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 640, maxWidth: "92vw", maxHeight: "70vh",
        background: "var(--paper)", borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,0.20)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--grey-2)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--grey-11)" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3"/></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search meetings, motions, actions, members, policies, LCME elements…"
            style={{ flex: 1, border: 0, outline: "none", fontSize: 15, fontFamily: "inherit", background: "transparent", color: "var(--ink)" }}
          />
          <button onClick={onClose} style={{ border: "1px solid var(--grey-3)", background: "var(--paper)", padding: "4px 10px", borderRadius: 6, fontSize: 11, color: "var(--grey-11)", cursor: "pointer" }}>Esc</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {q.length < 2 ? (
            <div style={{ padding: 36, textAlign: "center", color: "var(--grey-11)", fontSize: 12.5 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 14, marginBottom: 6 }}>Search the entire governance record</div>
              <div>16 meetings · {window.EEC.MOTIONS.length} motions · {window.EEC.ACTIONS.length} action items · {window.EEC.MEMBERS.length} members · {window.EEC.POLICIES.length} policies</div>
              <div style={{ marginTop: 14, fontSize: 11, color: "var(--grey-7)" }}>
                Try: <em>"Phase 1 Remediation"</em> · <em>"PEAKS"</em> · <em>"mistreatment"</em> · <em>"Soriano"</em> · <em>"8.4"</em>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: 28, textAlign: "center", color: "var(--grey-11)", fontSize: 13 }}>
              No matches for <strong>"{q}"</strong>
            </div>
          ) : (
            <>
              {[...grouped.entries()].map(([section, items]) => (
                <div key={section}>
                  <div style={{ padding: "8px 18px 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-7)", background: "var(--grey-1)" }}>
                    {sectionLabels[section]} · {items.length}
                  </div>
                  {items.map((r, i) => {
                    const flatIdx = results.indexOf(r);
                    const active = flatIdx === hoverIdx;
                    return (
                      <div key={r.key}
                           onMouseEnter={() => setHoverIdx(flatIdx)}
                           onClick={() => activate(r)}
                           style={{ padding: "9px 18px", cursor: "pointer", background: active ? "var(--brand-cyan-tint)" : "transparent", borderLeft: active ? "3px solid var(--brand-cyan)" : "3px solid transparent" }}>
                        <div style={{ fontSize: 10.5, color: "var(--grey-11)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>{r.label}</div>
                        <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 2, lineHeight: 1.4 }}>{r.sub}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>
        {results.length > 0 && (
          <div style={{ padding: "8px 18px", fontSize: 10.5, color: "var(--grey-11)", borderTop: "1px solid var(--grey-2)", background: "var(--grey-1)", display: "flex", justifyContent: "space-between" }}>
            <span><kbd style={kbd}>↑</kbd><kbd style={kbd}>↓</kbd> Navigate · <kbd style={kbd}>↵</kbd> Open · <kbd style={kbd}>Esc</kbd> Close</span>
            <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const kbd = {
  display: "inline-block", padding: "1px 5px", background: "var(--paper)",
  border: "1px solid var(--grey-3)", borderRadius: 3, fontFamily: "var(--mono)",
  fontSize: 10, color: "var(--grey-11)", marginRight: 3,
};

window.EecSearch = EecSearch;
