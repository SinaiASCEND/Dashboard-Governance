/* global React, LCME_GLOSSARY, Icon */
// LCME + ASCEND Glossary — alphabetical reference, curricular rosters, numbers, topic index.

const { useState, useMemo, useEffect, useRef } = React;

// ─── Tiny inline-markdown renderer (bold, italic, em-dash code) ────────
const fmt = (text) => {
  if (!text) return null;
  // Split on **bold** and *italic* preserving order.
  const parts = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(m[0]);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*"))
      return <em key={i}>{p.slice(1, -1)}</em>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
};

// ─── Anchor-safe slug ─────────────────────────────────────────────────
const slugify = (s) =>
  String(s).toLowerCase()
    .replace(/[()\/]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ─── Main view ────────────────────────────────────────────────────────
const GlossaryView = ({ navigate }) => {
  const data = window.LCME_GLOSSARY;
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState(null);
  const inputRef = useRef(null);

  // Filtered entries
  const filtered = useMemo(() => {
    if (!query.trim()) return data.entries;
    const q = query.trim().toLowerCase();
    return data.entries.filter(e =>
      e.term.toLowerCase().includes(q) ||
      (e.expansion && e.expansion.toLowerCase().includes(q)) ||
      (e.aka && e.aka.toLowerCase().includes(q)) ||
      (e.body && e.body.toLowerCase().includes(q))
    );
  }, [query, data.entries]);

  // Group by letter
  const grouped = useMemo(() => {
    const m = new Map();
    for (const e of filtered) {
      if (!m.has(e.letter)) m.set(e.letter, []);
      m.get(e.letter).push(e);
    }
    return Array.from(m.entries());
  }, [filtered]);

  const usedLetters = useMemo(() => new Set(filtered.map(e => e.letter)), [filtered]);

  const scrollToLetter = (letter) => {
    const id = "glossary-letter-" + letter;
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveLetter(letter);
  };

  // Keyboard "/" to focus search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Title */}
      <h1 className="glossary-title">Glossary</h1>

      {/* Search + letter rail */}
      <div className="glossary-controls">
        <label className="glossary-search">
          <Icon name="search" size={16} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms, acronyms, definitions… (press /)"
            aria-label="Search glossary"
          />
          {query ? (
            <button className="glossary-search__clear" onClick={() => setQuery("")} aria-label="Clear">
              <Icon name="x" size={12} />
            </button>
          ) : null}
        </label>
        <nav className="glossary-letters" aria-label="Jump to letter">
          {data.letters.map(L => (
            <button
              key={L}
              className={
                "glossary-letter" +
                (activeLetter === L ? " is-active" : "") +
                (!usedLetters.has(L) ? " is-dim" : "")
              }
              disabled={!usedLetters.has(L)}
              onClick={() => scrollToLetter(L)}
            >{L}</button>
          ))}
        </nav>
      </div>

      {/* Result count for searches */}
      {query.trim() ? (
        <p className="glossary-resultcount">
          <strong>{filtered.length}</strong> {filtered.length === 1 ? "match" : "matches"} for "{query}"
        </p>
      ) : null}

      {/* Entries by letter */}
      {grouped.length === 0 ? (
        <div className="empty">No terms match "{query}". Try a shorter query, or browse by letter.</div>
      ) : grouped.map(([L, items]) => (
        <section
          key={L}
          id={"glossary-letter-" + L}
          className="glossary-section"
        >
          <div className="glossary-section__head">
            <div className="glossary-section__letter">{L}</div>
            <div className="glossary-section__count">{items.length} {items.length === 1 ? "term" : "terms"}</div>
          </div>
          <div className="glossary-list">
            {items.map((e, i) => (
              <article key={e.term + i} id={"g-" + slugify(e.term)} className="glossary-entry">
                <header className="glossary-entry__head">
                  <h3 className="glossary-entry__term">
                    {e.term}
                    {e.expansion ? <span className="glossary-entry__expansion"> — {e.expansion}</span> : null}
                  </h3>
                  {e.aka ? <span className="glossary-entry__aka">{e.aka}</span> : null}
                </header>
                <p className="glossary-entry__body">{fmt(e.body)}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Back to top */}
      <div className="glossary-foot">
        <button className="btn-ghost"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑ Back to top
        </button>
      </div>
    </>
  );
};

// ─── Roster view (one phase, standalone) ──────────────────────────────
const ROSTER_META = {
  phase1: { label: "Phase 1", sub: "Preclerkship modules",      tint: "var(--sky)" },
  phase2: { label: "Phase 2", sub: "Required clerkships",        tint: "var(--teal)" },
  phase3: { label: "Phase 3", sub: "Advanced clinical experiences", tint: "var(--magenta)" },
};

const RosterView = ({ phaseId, navigate }) => {
  const data = window.LCME_GLOSSARY;
  const r = data.rosters[phaseId];
  const meta = ROSTER_META[phaseId];
  if (!r || !meta) return <div className="empty">Roster not found.</div>;

  return (
    <>
      <section className="glossary-roster-hero" style={{ "--tint": meta.tint }}>
        <div className="glossary-roster-hero__eyebrow">AY 2025–26 · {meta.label}</div>
        <h1 className="glossary-roster-hero__title">{r.title}</h1>
        {r.note ? <p className="glossary-roster-hero__note">{r.note}</p> : null}
        <div className="glossary-roster-hero__stats">
          <div className="glossary-roster-hero__stat"><strong>{r.rows.length}</strong>{phaseId === "phase2" ? "Clerkships" : phaseId === "phase3" ? "Experiences" : "Modules"}</div>
          <div className="glossary-roster-hero__stat"><strong>{r.columns.length}</strong>Columns</div>
        </div>
      </section>

      <div className="glossary-roster glossary-roster--standalone">
        <div className="glossary-roster__tablewrap">
          <table className="glossary-roster__table">
            <thead>
              <tr>
                {r.columns.map((c, i) => <th key={i}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {r.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={ci === 0 ? "glossary-roster__first" : ""}>
                      {ci === 0 ? <strong>{cell}</strong> : fmt(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glossary-foot">
        <button className="btn-ghost" onClick={() => navigate("/")}>← Back to Home</button>
      </div>
    </>
  );
};

// ─── All phases (combined roster view) ────────────────────────────────
const AllPhasesView = ({ navigate }) => {
  const data = window.LCME_GLOSSARY;
  const phases = ["phase1", "phase2", "phase3"];

  return (
    <>
      <section className="phases-hero">
        <div className="phases-hero__eyebrow">AY 2025–26</div>
        <h1 className="phases-hero__title">ASCEND Phases</h1>
        <p className="phases-hero__lead">
          The full curricular roster across all three phases — preclerkship modules, required clerkships, and advanced clinical experiences.
        </p>
        <div className="phases-hero__jumps">
          {phases.map(p => {
            const m = ROSTER_META[p];
            return (
              <a key={p} className="phases-hero__jump"
                href={"#phase-" + p}
                style={{ "--tint": m.tint }}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("phase-" + p);
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}>
                <span className="phases-hero__jump-num">{m.label.replace("Phase ", "")}</span>
                <span className="phases-hero__jump-sub">{m.sub}</span>
              </a>
            );
          })}
        </div>
      </section>

      {phases.map(p => {
        const r = data.rosters[p];
        const meta = ROSTER_META[p];
        return (
          <section key={p} id={"phase-" + p} className="phases-section" style={{ "--tint": meta.tint }}>
            <header className="phases-section__head">
              <div className="phases-section__badge">{meta.label}</div>
              <div>
                <h2 className="phases-section__title">{r.title}</h2>
                {r.note ? <p className="phases-section__note">{r.note}</p> : null}
              </div>
              <div className="phases-section__count">
                <strong>{r.rows.length}</strong>
                <span>{p === "phase2" ? "Clerkships" : p === "phase3" ? "Experiences" : "Modules"}</span>
              </div>
            </header>

            <div className="glossary-roster glossary-roster--embedded">
              <div className="glossary-roster__tablewrap">
                <table className="glossary-roster__table">
                  <thead>
                    <tr>{r.columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {r.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className={ci === 0 ? "glossary-roster__first" : ""}>
                            {ci === 0 ? <strong>{cell}</strong> : fmt(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      })}

      <div className="glossary-foot">
        <button className="btn-ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑ Back to top
        </button>
      </div>
    </>
  );
};

Object.assign(window, { GlossaryView, RosterView, AllPhasesView });
