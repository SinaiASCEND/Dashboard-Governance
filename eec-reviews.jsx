// eec-reviews.jsx — Curriculum reviews (Full, Phase 1, Phase 2) with full-text search

const { useState: useStateRv, useMemo: useMemoRv, useEffect: useEffectRv, useRef: useRefRv } = React;

function EecReviews() {
  const R = window.EEC.REVIEWS;
  const [selectedId, setSelectedId] = useStateRv(R[0]?.id);
  const [search, setSearch] = useStateRv("");

  const review = R.find(r => r.id === selectedId) || R[0];

  // Find figure references in the body text, mapped to the section they appear in.
  const figures = useMemoRv(() => {
    const out = [];
    const seen = new Set();
    for (let si = 0; si < review.sections.length; si++) {
      const s = review.sections[si];
      const text = s.heading + " " + s.body;
      const matches = text.match(/\bfigure\s+\d+[^.\n\r]{0,180}/gi) || [];
      for (const m of matches) {
        const cleaned = m.trim().replace(/\s+/g, " ");
        const num = (cleaned.match(/figure\s+(\d+)/i) || [])[1];
        const key = num + "|" + si;
        if (seen.has(key)) continue;
        seen.add(key);
        const labelMatch = cleaned.match(/figure\s+\d+[\.:]\s*([^\n]{0,140})/i);
        const caption = labelMatch ? labelMatch[1].trim() : cleaned.slice(cleaned.indexOf(num) + num.length).replace(/^[\s\.\:\-—–]+/, "").trim();
        out.push({ num: parseInt(num, 10), section: si, caption: caption || "See in-text reference" });
      }
    }
    out.sort((a, b) => a.num - b.num || a.section - b.section);
    return out;
  }, [review]);

  // Embedded docx data URL (works in both dev and standalone bundle)
  const downloadEntry = (window.EEC_REVIEW_FILES || {})[review.id];

  return (
    <div>
      <window.SectionHead
        eyebrow="Cyclical curriculum reviews"
        title="Curriculum Reviews"
        sub="The 2023-24 cycle (Full Curriculum, Phase 1, Phase 2) is the source of the 36 action plans tracked under LCME closed-loop monitoring. All three reports are searchable below."
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {R.map(r => {
          const active = r.id === selectedId;
          return (
            <button key={r.id} onClick={() => { setSelectedId(r.id); setSearch(""); }}
              style={{
                padding: "10px 16px", fontSize: 12.5, fontWeight: 600,
                background: active ? "var(--brand-violet)" : "var(--paper)",
                color: active ? "white" : "var(--ink-2)",
                border: active ? "1px solid var(--brand-violet)" : "1px solid var(--grey-3)",
                borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                minWidth: 220,
              }}>
              <span style={{ fontSize: 10.5, opacity: 0.7, fontWeight: 600, letterSpacing: "0.04em" }}>{window.fmtDate(r.date, "medium")}</span>
              <span style={{ fontSize: 13 }}>{r.title.replace(/^.*?— /, '')}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 22, alignItems: "start" }}>
        {/* Sidebar: TOC + meta */}
        <div style={{ position: "sticky", top: 12, alignSelf: "start", maxHeight: "calc(100vh - 24px)", overflowY: "auto" }}>
          <window.Card>
            <div className="t-eyebrow" style={{ marginBottom: 8 }}>About this review</div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.3, marginBottom: 8 }}>{review.title}</h3>
            <div style={{ fontSize: 12, color: "var(--grey-11)", lineHeight: 1.5, marginBottom: 12 }}>{review.summary}</div>
            <div style={{ fontSize: 11.5, color: "var(--grey-11)" }}>
              <strong style={{ color: "var(--ink-2)" }}>Date:</strong> {window.fmtDate(review.date, "long")}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--grey-11)", marginTop: 4 }}>
              <strong style={{ color: "var(--ink-2)" }}>Presented to:</strong> Executive Oversight Committee
            </div>
            <a
              href={downloadEntry?.dataUrl || review.file}
              download={downloadEntry?.name || (review.file || "").split("/").pop()}
              style={{
              marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 12px", fontSize: 12, fontWeight: 600,
              background: "var(--brand-violet)", color: "white", borderRadius: 6,
              textDecoration: "none",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download .docx
            </a>
          </window.Card>

          <window.Card style={{ marginTop: 14, padding: 0 }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--grey-2)" }}>
              <div className="t-eyebrow">Contents · {review.sections.length} sections</div>
            </div>
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {review.sections.map((s, i) => (
                <a key={i} href={"#sec-" + i}
                  onClick={(e) => { e.preventDefault(); document.getElementById('sec-' + i)?.scrollIntoView({ block: 'start' }); }}
                  style={{ display: "block", padding: "7px 14px", fontSize: 11.5, color: "var(--ink-2)", borderBottom: "1px solid var(--grey-2)", textDecoration: "none", lineHeight: 1.4 }}>
                  <span style={{ color: "var(--grey-7)", fontFamily: "var(--mono)", marginRight: 6 }}>{String(i+1).padStart(2,'0')}</span>
                  {s.heading.length > 50 ? s.heading.slice(0, 47) + '…' : s.heading}
                </a>
              ))}
            </div>
          </window.Card>

          {figures.length > 0 && (
            <window.Card style={{ marginTop: 14, padding: 0 }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--grey-2)" }}>
                <div className="t-eyebrow">Figures · {figures.length}</div>
                <div style={{ fontSize: 10.5, color: "var(--grey-7)", marginTop: 3, lineHeight: 1.4 }}>
                  Figure images are embedded in the source .docx and not rendered inline. Click a figure to jump to the section that references it.
                </div>
              </div>
              <div style={{ maxHeight: 280, overflowY: "auto" }}>
                {figures.map((f, i) => (
                  <a key={i} href={"#sec-" + f.section}
                    onClick={(e) => { e.preventDefault(); document.getElementById('sec-' + f.section)?.scrollIntoView({ block: 'start' }); }}
                    style={{ display: "flex", gap: 10, padding: "8px 14px", fontSize: 11.5, color: "var(--ink-2)", borderBottom: "1px solid var(--grey-2)", textDecoration: "none", lineHeight: 1.35, alignItems: "flex-start" }}>
                    <span style={{
                      flex: "0 0 auto", fontSize: 10, fontFamily: "var(--mono)",
                      color: "var(--brand-violet)", background: "var(--brand-violet-tint)",
                      padding: "2px 6px", borderRadius: 3, fontWeight: 700, whiteSpace: "nowrap",
                    }}>FIG {f.num}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>{f.caption.length > 110 ? f.caption.slice(0, 107) + "…" : f.caption}</span>
                  </a>
                ))}
              </div>
            </window.Card>
          )}
        </div>

        {/* Main: search + content */}
        <div>
          <ReviewSearchBar value={search} onChange={setSearch} placeholder={`Search ${review.title.replace(/—.*/, "").trim()}…`} />
          <ReviewContent review={review} search={search} />
        </div>
      </div>
    </div>
  );
}

function ReviewSearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, padding: "8px 14px", border: "1px solid var(--grey-3)", borderRadius: 8, background: "var(--paper)" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grey-11)" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3"/></svg>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, border: 0, outline: "none", fontSize: 13, background: "transparent", fontFamily: "inherit" }} />
      {value && <button onClick={() => onChange("")} style={{ border: 0, background: "transparent", color: "var(--grey-11)", cursor: "pointer", fontSize: 14 }}>✕</button>}
    </div>
  );
}

function ReviewContent({ review, search }) {
  const term = search.trim();
  // Filter sections to ones with a match if search; else show all
  const filtered = useMemoRv(() => {
    if (!term || term.length < 2) return review.sections.map((s, i) => ({ ...s, originalIdx: i }));
    const t = term.toLowerCase();
    return review.sections
      .map((s, i) => ({ ...s, originalIdx: i }))
      .filter(s => s.heading.toLowerCase().includes(t) || s.body.toLowerCase().includes(t));
  }, [review, term]);

  function highlight(text) {
    if (!term || term.length < 2) return text;
    try {
      const re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      const parts = text.split(re);
      return parts.map((p, i) =>
        re.test(p)
          ? <mark key={i} style={{ background: "var(--warn-tint)", color: "var(--warn)", padding: "0 2px", borderRadius: 2 }}>{p}</mark>
          : p
      );
    } catch (_) { return text; }
  }

  return (
    <div>
      {term && term.length >= 2 && (
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginBottom: 12 }}>
          {filtered.length === 0 ? "No matches" : `Showing ${filtered.length} section${filtered.length === 1 ? "" : "s"} containing "${term}"`}
        </div>
      )}
      <window.Card pad={false} style={{ overflow: "hidden" }}>
        {filtered.map((s, i) => (
          <div key={i} id={"sec-" + s.originalIdx} style={{ padding: "18px 26px", borderBottom: i === filtered.length - 1 ? "none" : "1px solid var(--grey-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 10.5, color: "var(--grey-7)", fontFamily: "var(--mono)", fontWeight: 700 }}>
                {String(s.originalIdx+1).padStart(2,'0')}
              </span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600, lineHeight: 1.25 }}>
                {highlight(s.heading)}
              </h3>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
              {highlight(s.body)}
            </div>
          </div>
        ))}
      </window.Card>
    </div>
  );
}

window.EecReviews = EecReviews;
