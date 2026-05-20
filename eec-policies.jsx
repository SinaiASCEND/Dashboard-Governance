// eec-policies.jsx — Policies library

const { useState: useStatePo, useEffect: useEffectPo, useMemo: useMemoPo } = React;

function EecPolicies() {
  const P = window.EEC.POLICIES;
  const [search, setSearch] = useStatePo("");
  const [openPolicy, setOpenPolicy] = useStatePo(null);

  const filtered = useMemoPo(() => {
    const q = search.toLowerCase();
    return P.filter(p => !q || (p.title + " " + (p.summary || "")).toLowerCase().includes(q));
  }, [search]);

  return (
    <div>
      <window.SectionHead
        eyebrow={`Policies library · ${P.length} policies`}
        title="Policies"
        sub="Curricular policies approved by the EEC. Each entry shows version, effective date, and the motion that approved it. Bylaws are reviewed annually per Article VIII §4."
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <window.SearchInput value={search} onChange={setSearch} placeholder="Search policies…" width={320} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
        {filtered.map(p => <PolicyCard key={p.id} p={p} onOpen={setOpenPolicy} />)}
      </div>

      <PolicyDrawer policyId={openPolicy} onClose={() => setOpenPolicy(null)} />
    </div>
  );
}

function PolicyCard({ p, onOpen }) {
  const isBylaw = p.id === "pol-bylaws";
  return (
    <div onClick={() => onOpen(p.id)} className="card" style={{
      padding: 0, cursor: "pointer",
      borderTop: `3px solid ${isBylaw ? "var(--brand-violet)" : "var(--brand-cyan)"}`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "14px 16px 10px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10.5, color: "var(--brand-violet)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {isBylaw ? "Bylaws" : "Policy"}
          </span>
          <span style={{ fontSize: 10.5, padding: "2px 7px", background: "var(--grey-1)", border: "1px solid var(--grey-3)", borderRadius: 4, color: "var(--grey-11)", fontFamily: "var(--mono)", fontWeight: 600 }}>
            v{p.version}
          </span>
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600, lineHeight: 1.25, marginBottom: 8 }}>{p.title}</div>
        {p.summary && (
          <div style={{ fontSize: 12, color: "var(--grey-11)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {p.summary}
          </div>
        )}
      </div>
      <div style={{ borderTop: "1px solid var(--grey-2)", padding: "10px 16px", display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", background: "var(--grey-1)" }}>
        <div style={{ fontSize: 10.5, color: "var(--grey-11)" }}>
          <strong style={{ color: "var(--ink-2)" }}>Effective:</strong> {p.effectiveDate || "—"}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(p.lcme || []).slice(0, 3).map(l => <window.LcmeBadge key={l} id={l} short />)}
        </div>
      </div>
    </div>
  );
}

function PolicyDrawer({ policyId, onClose }) {
  const p = policyId ? window.EEC.policyById[policyId] : null;
  if (!p) return <window.Drawer open={false} onClose={onClose} title="" />;
  const sourceMeetings = (p.sourceMeetingIds || []).map(id => window.EEC.meetingById[id]).filter(Boolean);

  return (
    <window.Drawer
      open={!!p}
      onClose={onClose}
      eyebrow={p.id === "pol-bylaws" ? "Governance — Bylaws" : "Curricular Policy"}
      title={p.title}
      accentColor="var(--brand-violet)"
      width={620}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, padding: "2px 8px", background: "var(--grey-1)", border: "1px solid var(--grey-3)", borderRadius: 4, fontFamily: "var(--mono)", fontWeight: 600 }}>
          v{p.version}
        </span>
        <span className="pill good" style={{ fontSize: 11 }}>{p.status}</span>
        <span style={{ fontSize: 11, color: "var(--grey-11)" }}>Effective {p.effectiveDate || "—"}</span>
      </div>

      <Section label="Summary">
        <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-2)" }}>{p.summary}</div>
      </Section>

      {p.sections && p.sections.length > 0 && (
        <Section label="Sections">
          <ol style={{ paddingLeft: 22, margin: 0 }}>
            {p.sections.map((s, i) => (
              <li key={i} style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 4, lineHeight: 1.5 }}>{s}</li>
            ))}
          </ol>
        </Section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
        <Field label="Document owner" value={p.owner} />
        <Field label="Approved by" value={p.approvedBy} />
        <Field label="Next review" value={p.nextReview} />
        <Field label="LCME elements" valueEl={
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
            {(p.lcme || []).length === 0 ? <span style={{ fontSize: 12, color: "var(--grey-7)" }}>—</span> :
              p.lcme.map(l => <window.LcmeBadge key={l} id={l} />)}
          </div>
        } />
      </div>

      {p.fileUrl && (
        <div style={{ marginTop: 22 }}>
          <a href={p.fileUrl} download style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 14px", fontSize: 12, fontWeight: 600,
            background: "var(--brand-violet)", color: "white",
            borderRadius: 6, textDecoration: "none",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download {p.fileUrl.split("/").pop()}
          </a>
        </div>
      )}

      {(p.revisionHistory || []).length > 0 && (
        <Section label="Revision history">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {p.revisionHistory.map((r, i) => (
              <div key={i} style={{ padding: "10px 14px", background: "var(--grey-1)", borderLeft: "3px solid var(--brand-violet)", borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: "var(--mono)" }}>v{r.version}</span>
                  <span style={{ fontSize: 11, color: "var(--grey-11)" }}>{r.date}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>{r.summary}</div>
                <div style={{ fontSize: 10.5, color: "var(--grey-7)", marginTop: 4 }}>Approver: {r.approver}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {sourceMeetings.length > 0 && (
        <Section label="Action history — meetings involving this policy">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sourceMeetings.map(m => (
              <div key={m.id} onClick={() => { window.EEC_PENDING = { meeting: m.id }; window.EEC_NAV.go("meetings"); onClose(); }}
                   style={{ padding: 10, background: "var(--paper)", borderRadius: 6, border: "1px solid var(--grey-2)", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                <window.CommitteeChip id={m.committee} size="sm" />
                <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--grey-11)" }}>{m.date}</span>
                <span style={{ fontSize: 12, color: "var(--ink-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.summary}</span>
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
    <div style={{ marginTop: 18 }}>
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}
function Field({ label, value, valueEl }) {
  return (
    <div>
      <div className="t-eyebrow" style={{ fontSize: 9.5 }}>{label}</div>
      {valueEl || <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 4 }}>{value || "—"}</div>}
    </div>
  );
}

window.EecPolicies = EecPolicies;
