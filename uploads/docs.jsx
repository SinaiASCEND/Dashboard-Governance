/* global React, LCME_DCI, LCME_ISA, LCME_DATA, Icon, formatDate */
// DCI 2027-28 + ISA browsers, search, breadcrumbs.

const { useState, useMemo, useEffect, useRef } = React;

// ─── Breadcrumbs ──────────────────────────────────────────────────────
// trail: array of { label, path } where the last item has no path (current page)
const Breadcrumbs = ({ trail, navigate }) => {
  if (!trail || trail.length < 2) return null;
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol className="crumbs__list">
        {trail.map((t, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={i} className={"crumbs__item" + (isLast ? " crumbs__item--current" : "")}>
              {!isLast && t.path ? (
                <button onClick={() => navigate(t.path)}>{t.label}</button>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{t.label}</span>
              )}
              {!isLast ? <Icon name="chevron" size={11} className="crumbs__sep" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ─── Standard-color helper ────────────────────────────────────────────
const STANDARD_COLORS = {
  "1": "#00AEEF", "2": "#007DB0", "3": "#00AEEF", "4": "#007DB0", "5": "#00AEEF",
  "6": "#D80B8C", "7": "#A20668", "8": "#D80B8C", "9": "#007DB0",
  "10": "#00AEEF", "11": "#007DB0", "12": "#58595B",
};
const standardColor = (id) => STANDARD_COLORS[id] || "#00AEEF";

// ─── DCI: Standards index ─────────────────────────────────────────────
const DCIIndexView = ({ navigate }) => {
  const total = LCME_DCI.reduce((s, std) => s + std.elements.length, 0);
  const totalNarratives = LCME_DCI.reduce((s, std) =>
    s + std.elements.reduce((ss, e) => ss + e.narratives.length, 0), 0);
  const totalTables = LCME_DCI.reduce((s, std) =>
    s + (std.tables || []).length + std.elements.reduce((ss, e) => ss + (e.tables || []).length, 0), 0);

  return (
    <>
      <h1 className="h-display">DCI 2027–28</h1>
      <p className="lead">
        The LCME Data Collection Instrument for the 2027–28 cycle: <strong>12 standards</strong>, {total} elements,
        with {totalNarratives} narrative questions and {totalTables} tables across the document.
        Tap any standard pillow to drill in.
      </p>

      <div className="dci-search-wrap" style={{ marginBottom: 20 }}>
        <DocSearchBar placeholder="Search standards, elements, narrative questions, tables…"
          navigate={navigate} />
      </div>

      <div className="pillow-grid">
        {LCME_DCI.map(std => (
          <button key={std.id} className="pillow" onClick={() => navigate("/dci/s/" + std.id)}
            style={{ "--accent": standardColor(std.id) }}>
            <div className="pillow__id">Standard {std.id}</div>
            <div className="pillow__title">{std.title}</div>
            <div className="pillow__meta">
              <span className="pillow__count">{std.elements.length} elements</span>
              <Icon name="chevron" size={13} />
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

// ─── DCI: Standard detail ─────────────────────────────────────────────
const DCIStandardView = ({ standardId, navigate }) => {
  const std = LCME_DCI.find(s => s.id === String(standardId));
  if (!std) return <div className="empty">Standard {standardId} not found.</div>;
  const accent = standardColor(std.id);
  return (
    <>
      <div className="standard-hero" style={{ "--accent": accent }}>
        <div className="standard-hero__id">Standard {std.id}</div>
        <h1 className="standard-hero__title">{std.title}</h1>
        {std.description ? (
          <p className="standard-hero__desc">{std.description}</p>
        ) : null}
        <div className="row" style={{ marginTop: 12, gap: 16 }}>
          <span className="standard-hero__stat"><strong>{std.elements.length}</strong> elements</span>
          {std.tables && std.tables.length > 0 ? (
            <span className="standard-hero__stat"><strong>{std.tables.length}</strong> standard-level tables</span>
          ) : null}
        </div>
      </div>

      {std.tables && std.tables.length > 0 && (
        <section className="section">
          <h2 className="h-section">Standard-level tables</h2>
          <div className="grid grid--2">
            {std.tables.map((t, i) => <TableCard key={i} table={t} />)}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="h-section">Elements ({std.elements.length})</h2>
        <div className="pillow-grid pillow-grid--small">
          {std.elements.map(el => (
            <button key={el.id} className="pillow pillow--small"
              onClick={() => navigate("/dci/e/" + el.id)}
              style={{ "--accent": accent }}>
              <div className="pillow__id">{el.id}</div>
              <div className="pillow__title">{el.title}</div>
              <div className="pillow__meta">
                <span className="pillow__count">
                  {el.narratives.length} {el.narratives.length === 1 ? "question" : "questions"}
                </span>
                {el.tables.length > 0 ? <span className="pillow__count">{el.tables.length} tables</span> : null}
                {el.supportingDocs.length > 0 ? <span className="pillow__count">{el.supportingDocs.length} docs</span> : null}
                <Icon name="chevron" size={13} />
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

// ─── DCI: Element detail (full DCI text) ──────────────────────────────
const DCIElementView = ({ elementId, navigate }) => {
  let element = null, standard = null;
  for (const std of LCME_DCI) {
    const el = std.elements.find(e => e.id === elementId);
    if (el) { element = el; standard = std; break; }
  }
  // Cross-reference task-force element data for change-summary chip
  const tfElement = (window.LCME_DATA.ELEMENTS || []).find(e => e.id === elementId);

  if (!element) {
    return (
      <>
        <h1 className="h-display">Element {elementId}</h1>
        <p className="lead">This element isn't in the parsed DCI document.</p>
        {tfElement ? (
          <div className="card">
            <p>It is, however, assigned to the {tfElement.subcommittee} subcommittee.</p>
            <button className="pill pill--active" onClick={() => navigate("/e/" + elementId)}>
              View task-force page for {elementId} →
            </button>
          </div>
        ) : null}
      </>
    );
  }

  const accent = standardColor(standard.id);

  return (
    <>
      <div className="standard-hero standard-hero--element" style={{ "--accent": accent }}>
        <div className="standard-hero__id">
          Element {element.id} · Standard {standard.id}
        </div>
        <h1 className="standard-hero__title">{element.title}</h1>
        {tfElement && tfElement.previousTitle ? (
          <p className="standard-hero__desc" style={{ fontStyle: "italic" }}>
            Previously: “{tfElement.previousTitle}”
          </p>
        ) : null}
      </div>

      {tfElement ? (
        <div className="row" style={{ gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <button className="chip chip--strong"
            onClick={() => navigate("/e/" + element.id)}>
            <Icon name="list" size={12} /> Task force page · {tfElement.subcommittee}
          </button>
          <span className={"change-chip change-chip--" + tfElement.changeLevel}>
            {tfElement.changeLevel === "NONE" ? "No change" : tfElement.changeLevel.toLowerCase()}
          </span>
          {tfElement.changeFlag ? (
            <span className="chip" style={{ background: "#fff0e6", color: "#c87a16", borderColor: "#f1d792" }}>
              <Icon name="flag" size={11} /> {tfElement.changeFlag}
            </span>
          ) : null}
        </div>
      ) : null}

      <section className="section dci-section">
        <h2 className="h-section">Element definition</h2>
        <div className="card card--definition">
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, textWrap: "pretty" }}>
            {element.definition || <em style={{ color: "var(--muted)" }}>No definition text extracted for this element.</em>}
          </p>
        </div>
      </section>

      {element.tables.length > 0 && (
        <section className="section dci-section">
          <h2 className="h-section">Required tables &amp; supporting data</h2>
          <div className="dci-tables">
            {element.tables.map((t, i) => <TableCard key={i} table={t} />)}
          </div>
        </section>
      )}

      {element.narratives.length > 0 && (
        <section className="section dci-section">
          <h2 className="h-section">Narrative response ({element.narratives.length} questions)</h2>
          <ol className="narrative-list">
            {element.narratives.map(n => (
              <li key={n.letter} className="narrative-item">
                <div className="narrative-item__letter">{n.letter}.</div>
                <div className="narrative-item__body">
                  <div className="narrative-item__text">{n.text}</div>
                  {n.subitems && n.subitems.length > 0 ? (
                    <ol className="narrative-sublist">
                      {n.subitems.map(si => (
                        <li key={si.n}>
                          <span className="narrative-sublist__n">{si.n}.</span> {si.text}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {element.supportingDocs.length > 0 && (
        <section className="section dci-section">
          <h2 className="h-section">Supporting documentation ({element.supportingDocs.length})</h2>
          <ol className="docs-list">
            {element.supportingDocs.map(d => (
              <li key={d.n} className="docs-item">
                <span className="docs-item__n">{d.n}.</span>
                <span>{d.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {tfElement ? (
        <section className="section">
          <button className="card card--cta" onClick={() => navigate("/e/" + element.id)}
            style={{ textAlign: "left", cursor: "pointer", width: "100%" }}>
            <div className="row" style={{ gap: 12 }}>
              <span className="resource-tile__icon" style={{ width: 40, height: 40 }}>
                <Icon name="list" size={20} />
              </span>
              <div style={{ flex: 1 }}>
                <div className="h-eyebrow" style={{ color: "var(--magenta)" }}>Task Force</div>
                <div className="h-card">Open the task list for {element.id}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                  See what changed since 2026-27 and what our DCI response needs to address.
                </div>
              </div>
              <Icon name="arrowR" size={18} />
            </div>
          </button>
        </section>
      ) : null}
    </>
  );
};

// ─── Table card ───────────────────────────────────────────────────────
const TableCard = ({ table }) => {
  // Pull a clean table number/name out of the title (e.g. "Table 6.1-1 — Title")
  const titleMatch = (table.title || "").match(/^(Table\s+[\d\.\-a-z]+)\s*[—\-]\s*(.+)$/i);
  const tableNum = titleMatch ? titleMatch[1] : null;
  const tableName = titleMatch ? titleMatch[2] : table.title;
  return (
    <div className="table-card">
      {tableNum ? <div className="table-card__num">{tableNum}</div> : null}
      <div className="table-card__name">{tableName}</div>
      {table.description ? (
        <p className="table-card__desc">{table.description}</p>
      ) : null}
      {table.columns.length > 0 ? (
        <div className="table-card__cols">
          <div className="table-card__cols-label">Columns / data requested</div>
          <div className="table-card__cols-chips">
            {table.columns.map((c, i) => <span key={i} className="chip">{c}</span>)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ─── ISA Index ────────────────────────────────────────────────────────
const ISAIndexView = ({ navigate }) => {
  const totalItems = LCME_ISA.reduce((s, d) =>
    s + d.items.length + d.subdomains.reduce((ss, sd) => ss + sd.items.length, 0), 0);
  return (
    <>
      <h1 className="h-display">Independent Student Analysis (ISA)</h1>
      <p className="lead">
        Required student opinion survey items grouped into <strong>{LCME_ISA.length} domains</strong>, totaling {totalItems} questions.
        Items marked <em>*</em> are clerkship-only; <em>§</em> are SDL-related; <em>√</em> are IPE-related.
      </p>

      <div className="dci-search-wrap" style={{ marginBottom: 20 }}>
        <DocSearchBar placeholder="Search ISA survey items…" navigate={navigate} onlyISA />
      </div>

      <div className="pillow-grid">
        {LCME_ISA.map((d, i) => {
          const count = d.items.length + d.subdomains.reduce((s, sd) => s + sd.items.length, 0);
          return (
            <button key={i} className="pillow" onClick={() => navigate("/isa/" + i)}
              style={{ "--accent": "#069dd6" }}>
              <div className="pillow__id">Domain {i + 1}</div>
              <div className="pillow__title">{toTitleCase(d.name)}</div>
              <div className="pillow__meta">
                <span className="pillow__count">{count} items</span>
                {d.subdomains.length > 0 ? <span className="pillow__count">{d.subdomains.length} sections</span> : null}
                <Icon name="chevron" size={13} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="h-card">Response scale</h3>
        <p style={{ margin: "6px 0 10px", fontSize: 14, color: "var(--ink-2)" }}>
          The LCME requires this exact scale for every item:
        </p>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <span className="chip chip--teal">a · Agree</span>
          <span className="chip chip--crimson">b · Disagree</span>
          <span className="chip">N/A · No opportunity to assess / Have not experienced this</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
          70% response rate expected overall, per item, per class year, and per regional campus (if applicable).
        </div>
      </div>
    </>
  );
};

function toTitleCase(s) {
  return s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\bAnd\b/g, "and").replace(/\bOf\b/g, "of").replace(/\bFor\b/g, "for")
    .replace(/\bThe\b/g, "the").replace(/\bIn\b/g, "in");
}

// ─── ISA: Domain detail ───────────────────────────────────────────────
const ISADomainView = ({ domainIdx, navigate }) => {
  const idx = Number(domainIdx);
  const d = LCME_ISA[idx];
  if (!d) return <div className="empty">ISA domain {domainIdx} not found.</div>;
  const allItems = [
    ...d.items.map(it => ({ ...it, _section: null })),
    ...d.subdomains.flatMap(sd => sd.items.map(it => ({ ...it, _section: sd.name }))),
  ];

  return (
    <>
      <div className="standard-hero" style={{ "--accent": "#069dd6" }}>
        <div className="standard-hero__id">ISA Domain {idx + 1}</div>
        <h1 className="standard-hero__title">{toTitleCase(d.name)}</h1>
        <div className="row" style={{ marginTop: 12, gap: 16 }}>
          <span className="standard-hero__stat"><strong>{allItems.length}</strong> survey items</span>
        </div>
      </div>

      {d.items.length > 0 && (
        <section className="section">
          <ISAItemList items={d.items} startIndex={1} />
        </section>
      )}

      {d.subdomains.map((sd, i) => {
        const start = 1 + d.items.length + d.subdomains.slice(0, i).reduce((s, x) => s + x.items.length, 0);
        return (
          <section key={i} className="section">
            <h2 className="h-section">{sd.name}</h2>
            <ISAItemList items={sd.items} startIndex={start} />
          </section>
        );
      })}
    </>
  );
};

const ISAItemList = ({ items, startIndex = 1 }) => (
  <ol className="isa-list" start={startIndex}>
    {items.map((it, i) => (
      <li key={i} className="isa-item" value={startIndex + i}>
        <div className="isa-item__n">{startIndex + i}</div>
        <div className="isa-item__body">
          <div className="isa-item__text">{it.text}</div>
          <div className="isa-item__flags">
            {it.flags.clerkshipOnly ? <span className="chip chip--amber">Clerkship years only *</span> : null}
            {it.flags.sdl ? <span className="chip">SDL §</span> : null}
            {it.flags.ipe ? <span className="chip">IPE √</span> : null}
          </div>
        </div>
      </li>
    ))}
  </ol>
);

// ─── Membership view (all members + per-subcommittee) ─────────────────
const MembershipView = ({ navigate }) => {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const SUBCOMMITTEES = window.LCME_DATA.SUBCOMMITTEES;

  // Build flat list of all people with their roles
  const everyone = useMemo(() => {
    const map = new Map();
    for (const sub of Object.values(SUBCOMMITTEES)) {
      const add = (m, role) => {
        const k = m.email.toLowerCase();
        const entry = map.get(k) || { name: m.name, email: m.email, note: m.note, roles: [] };
        entry.roles.push({ sub: sub.key, subName: sub.short, role });
        if (m.note && !entry.note) entry.note = m.note;
        map.set(k, entry);
      };
      sub.coChairs.forEach(m => add(m, "Co-chair"));
      add(sub.projectManager, "PM");
      sub.members.forEach(m => add(m, "Member"));
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const list = useMemo(() => {
    let people = everyone;
    if (filter !== "all") {
      people = people.filter(p => p.roles.some(r => r.sub === filter));
    }
    const q = query.trim().toLowerCase();
    if (q) {
      people = people.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    }
    return people;
  }, [everyone, filter, query]);

  const subOptions = Object.values(SUBCOMMITTEES);

  return (
    <>
      <h1 className="h-display">Membership</h1>
      <p className="lead">
        {everyone.length} people across the three task force subcommittees. People who serve on more than one
        subcommittee show all roles below.
      </p>

      <label className="tasks-search" style={{ marginBottom: 12 }}>
        <Icon name="search" size={14} />
        <input
          placeholder="Search by name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)} />
      </label>

      <div className="row" style={{ marginBottom: 18 }}>
        <div className="filter-pills">
          <button className={"pill " + (filter === "all" ? "pill--active" : "")} onClick={() => setFilter("all")}>
            All members<span className="pill__count">{everyone.length}</span>
          </button>
          {subOptions.map(s => (
            <button key={s.key} className={"pill " + (filter === s.key ? "pill--active" : "")}
              onClick={() => setFilter(s.key)}>
              {s.short}
              <span className="pill__count">{everyone.filter(p => p.roles.some(r => r.sub === s.key)).length}</span>
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty">No members match.</div>
      ) : (
        <div className="member-grid">
          {list.map(p => <MembershipCard key={p.email} person={p} navigate={navigate} />)}
        </div>
      )}
    </>
  );
};

const MembershipCard = ({ person, navigate }) => (
  <div className="member-card" style={{ display: "block", padding: 14 }}>
    <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
      <div className="member-card__avatar">{window.initialsFor(person.name)}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="member-card__name">{person.name}</div>
        <a className="member-card__email" href={"mailto:" + person.email}>{person.email}</a>
        {person.note ? <div className="member-card__note">{person.note}</div> : null}
      </div>
    </div>
    <div className="role-chips">
      {person.roles.map((r, i) => {
        const isChair = r.role === "Co-chair";
        const isPM = r.role === "PM";
        return (
          <button key={i} className={"role-chip" + (isChair ? " role-chip--chair" : isPM ? " role-chip--pm" : "")}
            onClick={() => navigate("/s/" + r.sub)}>
            <span className="role-chip__role">{r.role}</span>
            <span className="role-chip__sep">·</span>
            <span className="role-chip__sub">{r.subName}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Doc search ───────────────────────────────────────────────────────
const DocSearchBar = ({ placeholder, navigate, onlyISA = false, onlyDCI = false }) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) { setResults([]); return; }
    const out = [];
    if (!onlyISA) {
      for (const std of LCME_DCI) {
        if (std.title.toLowerCase().includes(term)) {
          out.push({ kind: "standard", label: `Standard ${std.id}: ${std.title}`, path: "/dci/s/" + std.id, std: std.id });
        }
        for (const el of std.elements) {
          if (el.id.includes(term) || el.title.toLowerCase().includes(term)) {
            out.push({ kind: "element", label: `${el.id} ${el.title}`, sub: "Standard " + std.id, path: "/dci/e/" + el.id, std: std.id });
          }
          for (const n of el.narratives) {
            if (n.text.toLowerCase().includes(term)) {
              out.push({ kind: "narrative", label: `${el.id} · narrative (${n.letter})`, sub: snippet(n.text, term), path: "/dci/e/" + el.id, std: std.id });
            }
          }
          for (const t of el.tables) {
            if ((t.title || "").toLowerCase().includes(term) || (t.description || "").toLowerCase().includes(term)) {
              out.push({ kind: "table", label: `${el.id} · ${t.title || "table"}`, sub: snippet(t.description || "", term), path: "/dci/e/" + el.id, std: std.id });
            }
            for (const c of (t.columns || [])) if (c.toLowerCase().includes(term)) {
              out.push({ kind: "table", label: `${el.id} · column "${c}"`, sub: t.title, path: "/dci/e/" + el.id, std: std.id });
              break;
            }
          }
          for (const d of el.supportingDocs) {
            if (d.text.toLowerCase().includes(term)) {
              out.push({ kind: "doc", label: `${el.id} · supporting doc ${d.n}`, sub: snippet(d.text, term), path: "/dci/e/" + el.id, std: std.id });
            }
          }
        }
      }
    }
    if (!onlyDCI) {
      LCME_ISA.forEach((d, di) => {
        if (d.name.toLowerCase().includes(term)) {
          out.push({ kind: "isa-domain", label: `ISA: ${toTitleCase(d.name)}`, path: "/isa/" + di });
        }
        const allItems = [...d.items, ...d.subdomains.flatMap(sd => sd.items.map(it => ({ ...it, _sd: sd.name })))];
        for (const it of allItems) {
          if (it.text.toLowerCase().includes(term)) {
            out.push({ kind: "isa-item", label: `ISA: ${toTitleCase(d.name)}${it._sd ? " · " + it._sd : ""}`, sub: snippet(it.text, term), path: "/isa/" + di });
          }
        }
      });
    }
    setResults(out.slice(0, 50));
  }, [q, onlyISA, onlyDCI]);

  return (
    <div className="doc-search">
      <label className="tasks-search">
        <Icon name="search" size={14} />
        <input
          ref={inputRef}
          placeholder={placeholder || "Search…"}
          value={q}
          onChange={e => setQ(e.target.value)} />
        {q ? (
          <button onClick={() => { setQ(""); setResults([]); inputRef.current?.focus(); }}
            style={{ color: "var(--muted)", display: "flex" }}>
            <Icon name="x" size={14} />
          </button>
        ) : null}
      </label>
      {results.length > 0 ? (
        <div className="doc-search__results">
          <div className="doc-search__count">{results.length} result{results.length === 1 ? "" : "s"}</div>
          {results.map((r, i) => (
            <button key={i} className="doc-search__hit" onClick={() => { navigate(r.path); setQ(""); setResults([]); }}>
              <span className={"doc-search__kind doc-search__kind--" + r.kind.replace(/[^a-z]/g, "")}>{kindLabel(r.kind)}</span>
              <div className="doc-search__meta">
                <div className="doc-search__label">{r.label}</div>
                {r.sub ? <div className="doc-search__sub">{r.sub}</div> : null}
              </div>
              <Icon name="chevron" size={12} />
            </button>
          ))}
        </div>
      ) : (q.trim().length >= 2 ? (
        <div className="doc-search__results doc-search__results--empty">No matches.</div>
      ) : null)}
    </div>
  );
};

function snippet(text, term) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(term);
  if (idx < 0) return text.slice(0, 100);
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + term.length + 70);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

function kindLabel(kind) {
  return {
    standard: "Std",
    element:  "Elem",
    narrative: "Q",
    table: "Table",
    doc: "Doc",
    "isa-domain": "ISA",
    "isa-item": "ISA",
  }[kind] || kind;
}

Object.assign(window, {
  Breadcrumbs, standardColor,
  DCIIndexView, DCIStandardView, DCIElementView,
  ISAIndexView, ISADomainView,
  MembershipView,
  DocSearchBar,
});
