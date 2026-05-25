/* global React, LCME_DATA, Icon, ChangeChip, Tabs, initialsFor, formatDate, formatDateShort, isExternal */
// View components for each screen.

const { SUBCOMMITTEES, ELEMENTS, TASKS, MEPOS, RESOURCES } = window.LCME_DATA;
const { useState, useMemo, useEffect } = React;

// ─── Task helpers shared across views ──────────────────────────────────
function tasksForElement(elementId) {
  return TASKS.filter(t => t.element === elementId);
}
function tasksForSubcommittee(key) {
  return TASKS.filter(t => t.subcommittee === key);
}
function elementsForSubcommittee(key) {
  return ELEMENTS.filter(e => e.subcommittee === key);
}
function statusCounts(taskIds, statuses) {
  const c = { "not-started": 0, "in-progress": 0, "complete": 0, "blocked": 0 };
  for (const id of taskIds) c[statuses[id] || "not-started"]++;
  return c;
}

// ─── Subcommittee card ────────────────────────────────────────────────
const SubcommitteeCard = ({ sub, onOpen, statuses }) => {
  const tasks = tasksForSubcommittee(sub.key);
  const els = elementsForSubcommittee(sub.key);
  const done = tasks.filter(t => statuses[t.id] === "complete").length;
  const memberCount = sub.coChairs.length + sub.members.length + 1; // + PM
  return (
    <button className={`subcomm-card subcomm-card--${sub.accent}`} onClick={onOpen}>
      <div className="subcomm-card__accent" />
      <div className="subcomm-card__eyebrow">Task Force Subcommittee</div>
      <div className="subcomm-card__name">{sub.name}</div>
      <div className="subcomm-card__blurb">{sub.blurb}</div>
      <div className="subcomm-card__meta">
        <span className="chip"><span className="dot" />{els.length} elements</span>
        <span className="chip">{tasks.length} tasks</span>
        <span className="chip">{memberCount} members</span>
      </div>
      <div className="subcomm-card__open">
        Open subcommittee <Icon name="arrowR" size={14} />
      </div>
    </button>
  );
};

// ─── HOME ──────────────────────────────────────────────────────────────
const HomeView = ({ navigate, statuses }) => {
  const totalElements = ELEMENTS.length;
  const totalTasks = TASKS.length;
  const doneTasks  = TASKS.filter(t => statuses[t.id] === "complete").length;
  const totalDCI = (window.LCME_DCI || []).reduce((s, std) => s + std.elements.length, 0);
  const totalISA = (window.LCME_ISA || []).reduce((s, d) =>
    s + d.items.length + d.subdomains.reduce((ss, sd) => ss + sd.items.length, 0), 0);
  const memberCount = Object.values(SUBCOMMITTEES).reduce((s, sub) => {
    const ids = new Set();
    sub.coChairs.forEach(m => ids.add(m.email.toLowerCase()));
    ids.add(sub.projectManager.email.toLowerCase());
    sub.members.forEach(m => ids.add(m.email.toLowerCase()));
    return s + ids.size;
  }, 0);

  return (
    <>
      <section className="hero">
        <div className="hero__eyebrow">LCME 2027–28 DCI Cycle · Mount Sinai</div>
        <h1 className="hero__title">The Curriculum Task Force, in one place.</h1>
        <p className="hero__body">
          Membership, the full 2027–28 DCI by standard and element, the required ISA survey items,
          and every task that has to be done before the June 2027 deadline — searchable from your phone.
        </p>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-value">3</span>
            <span className="hero__stat-label">Subcommittees</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{totalDCI || totalElements}</span>
            <span className="hero__stat-label">DCI Elements</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{totalTasks}</span>
            <span className="hero__stat-label">Tasks tracked</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{totalISA}</span>
            <span className="hero__stat-label">ISA survey items</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="h-section">Subcommittees</h2>
        <div className="grid grid--3">
          {Object.values(SUBCOMMITTEES).map(sub => (
            <SubcommitteeCard key={sub.key} sub={sub} statuses={statuses}
              onOpen={() => navigate("/s/" + sub.key)} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h-section">Browse</h2>
        <div className="home-pillow-grid">
          <button className="home-pillow" onClick={() => navigate("/dci")}
            style={{ "--accent": "var(--magenta)" }}>
            <span className="home-pillow__icon"><Icon name="book" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow">2027–28 Cycle</div>
              <div className="home-pillow__title">DCI 2027–28</div>
              <div className="home-pillow__sub">12 standards · {totalDCI} elements with narratives, tables, and supporting docs.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/isa")}
            style={{ "--accent": "var(--sky)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--sky)" }}><Icon name="target" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--sky)" }}>Student Survey</div>
              <div className="home-pillow__title">Independent Student Analysis</div>
              <div className="home-pillow__sub">{totalISA} required survey items across {(window.LCME_ISA || []).length} domains.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/members")}
            style={{ "--accent": "var(--teal)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--teal)" }}><Icon name="users" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--teal)" }}>Roster</div>
              <div className="home-pillow__title">Membership</div>
              <div className="home-pillow__sub">{memberCount} members across all 3 subcommittees, plus filters per group.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/phases")}
            style={{ "--accent": "var(--magenta-2)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--magenta-2)" }}><Icon name="list" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--magenta-2)" }}>AY 2025–26</div>
              <div className="home-pillow__title">ASCEND Phases</div>
              <div className="home-pillow__sub">Full roster across all three phases — modules, clerkships, and advanced clinical experiences.</div>
            </div>
          </button>
          <a className="home-pillow" href={RESOURCES[0].url} target="_blank" rel="noreferrer"
            style={{ "--accent": "var(--navy-2)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--navy-2)" }}><Icon name="compass" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--navy-2)" }}>External</div>
              <div className="home-pillow__title">ASCEND Navigator <Icon name="external" size={12} /></div>
              <div className="home-pillow__sub">Student-facing curriculum dashboard with phase, module, and EPO views.</div>
            </div>
          </a>
        </div>
      </section>

      <section className="section">
        <h2 className="h-section">Self-study reference</h2>
        <p className="lead" style={{ marginBottom: 14 }}>
          From the May 21, 2026 kickoff — what this self-study is, who runs it, when things happen, and what we're being measured against.
        </p>
        <div className="home-pillow-grid">
          <button className="home-pillow" onClick={() => navigate("/about")}
            style={{ "--accent": "var(--magenta)" }}>
            <span className="home-pillow__icon"><Icon name="sparkle" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow">Overview</div>
              <div className="home-pillow__title">About the self-study</div>
              <div className="home-pillow__sub">Mission, the three lenses, key dates, and how the DCI &amp; ISA fit together.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/roadmap")}
            style={{ "--accent": "var(--sky)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--sky)" }}><Icon name="target" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--sky)" }}>Timeline</div>
              <div className="home-pillow__title">The road to LCME</div>
              <div className="home-pillow__sub">Sep 2025 → Oct 2027 → AY 27–28, with every major milestone.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/leadership")}
            style={{ "--accent": "var(--teal)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--teal)" }}><Icon name="users" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--teal)" }}>People</div>
              <div className="home-pillow__title">Leadership &amp; roles</div>
              <div className="home-pillow__sub">FAL, Steering Committee, and the 6 layers of responsibility.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/sc8")}
            style={{ "--accent": "var(--magenta-2)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--magenta-2)" }}><Icon name="list" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--magenta-2)" }}>Structure</div>
              <div className="home-pillow__title">All 8 subcommittees</div>
              <div className="home-pillow__sub">The full self-study structure — broader than the 3 curriculum groups tracked here.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/site-visit")}
            style={{ "--accent": "var(--magenta)" }}>
            <span className="home-pillow__icon"><Icon name="flag" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow">Oct 18–20, 2027</div>
              <div className="home-pillow__title">Site visit prep</div>
              <div className="home-pillow__sub">2.5 days · 4–6 peer surveyors · what they look for and how to prepare.</div>
            </div>
          </button>
          <button className="home-pillow" onClick={() => navigate("/ascend")}
            style={{ "--accent": "var(--navy-2)" }}>
            <span className="home-pillow__icon" style={{ background: "var(--navy-2)" }}><Icon name="compass" size={22} /></span>
            <div className="home-pillow__body">
              <div className="home-pillow__eyebrow" style={{ color: "var(--navy-2)" }}>Curriculum</div>
              <div className="home-pillow__title">The ASCEND curriculum</div>
              <div className="home-pillow__sub">Phases, blocks, clerkships, AOCs, and EEC governance — context for any element touching teaching.</div>
            </div>
          </button>
        </div>
      </section>

      <section className="section">
        <h2 className="h-section">More</h2>
        <div className="resource-strip">
          <button className="resource-tile" onClick={() => navigate("/resources")}>
            <span className="resource-tile__icon"><Icon name="tree" size={20} /></span>
            <div>
              <div className="resource-tile__title">Governance Org Chart</div>
              <div className="resource-tile__desc">Reporting structure for the Dean and committees.</div>
            </div>
          </button>
          <button className="resource-tile" onClick={() => navigate("/mepos")}>
            <span className="resource-tile__icon"><Icon name="target" size={20} /></span>
            <div>
              <div className="resource-tile__title">MEPOs (23 program objectives)</div>
              <div className="resource-tile__desc">All Sinai MEPOs grouped by competency domain.</div>
            </div>
          </button>
          <button className="resource-tile" onClick={() => navigate("/tasks")}>
            <span className="resource-tile__icon"><Icon name="list" size={20} /></span>
            <div>
              <div className="resource-tile__title">All tasks ({totalTasks})</div>
              <div className="resource-tile__desc">{doneTasks > 0 ? `${doneTasks} marked complete on this device` : "Search, filter, and track status"}.</div>
            </div>
          </button>
        </div>
      </section>
    </>
  );
};

// ─── Subcommittee detail ──────────────────────────────────────────────
const SubcommitteeView = ({ subKey, tab, setTab, navigate, statuses, setStatus }) => {
  const sub = SUBCOMMITTEES[subKey];
  if (!sub) return <div className="empty">Subcommittee not found.</div>;
  const els = elementsForSubcommittee(subKey);
  const tasks = tasksForSubcommittee(subKey);
  const counts = statusCounts(tasks.map(t => t.id), statuses);
  const memberCount = sub.coChairs.length + sub.members.length + 1;

  return (
    <>
      <div className={`subcomm-hero subcomm-hero--${sub.accent}`}>
        <div className="subcomm-hero__eyebrow">Subcommittee</div>
        <h1 className="subcomm-hero__title">{sub.name}</h1>
        <p className="subcomm-hero__blurb">{sub.blurb}</p>
        <div className="subcomm-hero__stats">
          <div className="subcomm-hero__stat"><strong>{els.length}</strong>LCME elements</div>
          <div className="subcomm-hero__stat"><strong>{tasks.length}</strong>Tasks</div>
          <div className="subcomm-hero__stat"><strong>{counts["complete"]}</strong>Completed</div>
          <div className="subcomm-hero__stat"><strong>{memberCount}</strong>Members</div>
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { id: "elements", label: "Elements", count: els.length },
        { id: "tasks",    label: "All tasks", count: tasks.length },
        { id: "members",  label: "Members",  count: memberCount },
      ]} />

      {tab === "elements" && (
        <ElementList elements={els} tasks={tasks} statuses={statuses} navigate={navigate} />
      )}
      {tab === "tasks" && (
        <TaskBoard tasks={tasks} statuses={statuses} setStatus={setStatus} navigate={navigate} />
      )}
      {tab === "members" && (
        <MembersPanel sub={sub} />
      )}
    </>
  );
};

// ─── Element list (used inside subcommittee + browse) ─────────────────
const ElementList = ({ elements, tasks, statuses, navigate }) => {
  const byElement = useMemo(() => {
    const map = {};
    for (const t of tasks) {
      (map[t.element] = map[t.element] || []).push(t);
    }
    return map;
  }, [tasks]);

  return (
    <div className="element-list">
      {elements.map(el => {
        const eTasks = byElement[el.id] || [];
        const done = eTasks.filter(t => statuses[t.id] === "complete").length;
        const pct = eTasks.length === 0 ? 0 : Math.round(100 * done / eTasks.length);
        return (
          <button key={el.id} className="element-row"
            onClick={() => navigate("/e/" + el.id)}>
            <div className="element-row__id">{el.id}</div>
            <div className="element-row__body">
              <div className="element-row__title">{el.title}</div>
              {el.previousTitle ? (
                <div className="element-row__prev">
                  Previously: {el.previousTitle}
                </div>
              ) : null}
              <div className="element-row__chips">
                <ChangeChip level={el.changeLevel} />
                {el.changeFlag ? (
                  <span className="chip chip--outline">
                    <Icon name="flag" size={11} />{el.changeFlag}
                  </span>
                ) : null}
                <span className="chip">{eTasks.length} {eTasks.length === 1 ? "task" : "tasks"}</span>
              </div>
            </div>
            <div className="element-row__progress">
              <div className="element-row__progress-bar">
                <div
                  className={"element-row__progress-fill" + (pct === 100 ? " element-row__progress-fill--done" : "")}
                  style={{ width: pct + "%" }} />
              </div>
              <span>{done} of {eTasks.length}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ─── Task board with filters/search ───────────────────────────────────
const CATEGORY_OPTIONS = ["DCI Table", "Appendix", "Process", "DCI Narrative Review"];
const STATUS_OPTIONS   = [
  { id: "all", label: "All" },
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "complete", label: "Complete" },
  { id: "blocked", label: "Blocked" },
];
const STATUS_ORDER = ["not-started", "in-progress", "blocked", "complete"];

const categoryClass = (cat) => "task__category--" + cat.toLowerCase().replace(/\s+/g, "-");

const TaskBoard = ({ tasks, statuses, setStatus, navigate, showElementLink = true }) => {
  const [query, setQuery] = useState("");
  const [cat, setCat]     = useState("all");
  const [status, setStat] = useState("all");
  const [groupBy, setGroupBy] = useState("element"); // element | none

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(t => {
      if (cat !== "all" && t.category !== cat) return false;
      const s = statuses[t.id] || "not-started";
      if (status !== "all" && s !== status) return false;
      if (q && !(t.description.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.element.includes(q))) return false;
      return true;
    });
  }, [tasks, query, cat, status, statuses]);

  const grouped = useMemo(() => {
    if (groupBy !== "element") return [{ key: "_all", title: null, tasks: filtered }];
    const map = new Map();
    for (const t of filtered) {
      if (!map.has(t.element)) map.set(t.element, []);
      map.get(t.element).push(t);
    }
    const out = [];
    // Order by ELEMENT order
    for (const el of ELEMENTS) {
      if (map.has(el.id)) out.push({ key: el.id, title: el.id + " · " + el.title, element: el, tasks: map.get(el.id) });
    }
    return out;
  }, [filtered, groupBy]);

  const catCounts = useMemo(() => {
    const c = { "DCI Table": 0, "Appendix": 0, "Process": 0, "DCI Narrative Review": 0 };
    for (const t of tasks) c[t.category] = (c[t.category] || 0) + 1;
    return c;
  }, [tasks]);

  const statusCountsAll = useMemo(() => statusCounts(tasks.map(t => t.id), statuses), [tasks, statuses]);

  return (
    <>
      <div className="tasks-toolbar">
        <label className="tasks-search">
          <Icon name="search" size={14} />
          <input
            placeholder="Search task description, ID, or element…"
            value={query}
            onChange={e => setQuery(e.target.value)} />
          {query ? (
            <button onClick={() => setQuery("")} aria-label="Clear search"
              style={{ color: "var(--muted)", display: "flex" }}>
              <Icon name="x" size={14} />
            </button>
          ) : null}
        </label>
      </div>

      <div className="row" style={{ marginBottom: 14, gap: 14 }}>
        <div className="filter-pills">
          <button className={"pill " + (cat === "all" ? "pill--active" : "")} onClick={() => setCat("all")}>
            All categories<span className="pill__count">{tasks.length}</span>
          </button>
          {CATEGORY_OPTIONS.map(c => (
            <button key={c} className={"pill " + (cat === c ? "pill--active" : "")} onClick={() => setCat(c)}>
              {c}<span className="pill__count">{catCounts[c] || 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="row" style={{ marginBottom: 14, gap: 6 }}>
        <span className="h-eyebrow" style={{ marginRight: 4 }}>Status</span>
        <div className="filter-pills">
          {STATUS_OPTIONS.map(s => (
            <button key={s.id}
              className={"pill " + (status === s.id ? "pill--active" : "")}
              onClick={() => setStat(s.id)}>
              {s.label}{s.id === "all"
                ? <span className="pill__count">{tasks.length}</span>
                : <span className="pill__count">{statusCountsAll[s.id]}</span>}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <button className={"pill " + (groupBy === "element" ? "pill--active" : "")}
          onClick={() => setGroupBy(groupBy === "element" ? "none" : "element")}>
          Group by element
        </button>
      </div>

      {grouped.length === 0 || filtered.length === 0 ? (
        <div className="empty">No tasks match your filters.</div>
      ) : (
        grouped.map(g => (
          <div key={g.key} style={{ marginBottom: 22 }}>
            {g.title ? (
              <div className="row row--between" style={{ marginBottom: 8 }}>
                <button className="h-eyebrow"
                  style={{ color: "var(--navy)", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}
                  onClick={() => navigate("/e/" + g.element.id)}>
                  {g.title} <Icon name="chevron" size={10} />
                </button>
                {g.element ? <ChangeChip level={g.element.changeLevel} /> : null}
              </div>
            ) : null}
            <div className="task-list">
              {g.tasks.map(t => (
                <TaskCard key={t.id} task={t}
                  status={statuses[t.id] || "not-started"}
                  setStatus={s => setStatus(t.id, s)}
                  showElementLink={showElementLink && !g.title}
                  navigate={navigate} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
};

const TaskCard = ({ task, status, setStatus, showElementLink, navigate }) => {
  const cycleStatus = () => {
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(status) + 1) % STATUS_ORDER.length];
    setStatus(next);
  };
  return (
    <div className={"task task--" + status}>
      <button className="task__check"
        title={"Status: " + status + " (click to cycle)"}
        aria-label="Cycle task status"
        onClick={cycleStatus}>
        <Icon name="check" size={14} />
      </button>
      <div className="task__body">
        <div className="task__head">
          <span className="task__id">{task.id}</span>
          <span className={"task__category " + categoryClass(task.category)}>{task.category}</span>
          {showElementLink ? (
            <button onClick={() => navigate("/e/" + task.element)}
              style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
              · Element {task.element}
            </button>
          ) : null}
        </div>
        <p className="task__desc">{task.description}</p>
        <div className="task__meta">
          {task.due ? <span>Due <strong>{formatDate(task.due)}</strong></span> : null}
        </div>
      </div>
      <div className="task__status">
        {["not-started", "in-progress", "complete", "blocked"].map(s => (
          <button key={s}
            className={"task__status-btn " + (status === s ? "task__status-btn--active is-" + (s.replace("not-started", "none").replace("in-progress", "progress")) : "")}
            onClick={() => setStatus(s)}>
            {s === "not-started" ? "Open" : s === "in-progress" ? "In progress" : s === "complete" ? "Done" : "Blocked"}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Members panel ────────────────────────────────────────────────────
const MembersPanel = ({ sub }) => {
  const Avatar = ({ name }) => (
    <div className="member-card__avatar">{initialsFor(name)}</div>
  );
  const renderMember = (m, role) => (
    <a key={m.email} className="member-card" href={"mailto:" + m.email}>
      <Avatar name={m.name} />
      <div className="member-card__body">
        <div className="member-card__name">{m.name}</div>
        <div className="member-card__email">{m.email}</div>
        {m.note ? <div className="member-card__note">{m.note}</div> : null}
      </div>
      {role ? <span className={"member-card__role" + (role === "PM" ? " member-card__role--pm" : "")}>{role}</span> : null}
    </a>
  );

  return (
    <>
      <div className="member-group">
        <h3 className="member-group__title">Co-chairs</h3>
        <div className="member-grid">
          {sub.coChairs.map(m => renderMember(m, "Co-chair"))}
        </div>
      </div>
      <div className="member-group">
        <h3 className="member-group__title">Project Manager</h3>
        <div className="member-grid">
          {renderMember(sub.projectManager, "PM")}
        </div>
      </div>
      <div className="member-group">
        <h3 className="member-group__title">Members ({sub.members.length})</h3>
        <div className="member-grid">
          {sub.members.map(m => renderMember(m))}
        </div>
      </div>
    </>
  );
};

// ─── Element detail ────────────────────────────────────────────────────
const ElementView = ({ elementId, navigate, statuses, setStatus }) => {
  const el = ELEMENTS.find(e => e.id === elementId);
  if (!el) return <div className="empty">Element {elementId} not found.</div>;
  const sub = SUBCOMMITTEES[el.subcommittee];
  const tasks = tasksForElement(el.id);
  const counts = statusCounts(tasks.map(t => t.id), statuses);
  const isRemoved = el.changeLevel === "REMOVED";

  return (
    <>
      <div className={"element-hero element-hero--" + el.changeLevel}>
        <div className="row" style={{ marginBottom: 6, gap: 8 }}>
          <span className="element-hero__id">Element {el.id}</span>
          <span className="spacer" />
          <button className="chip" onClick={() => navigate("/s/" + el.subcommittee)}>
            <span className="dot" style={{ background: "var(--magenta)" }} />
            {sub.short}
          </button>
        </div>
        <h1 className="element-hero__title">{el.title}</h1>
        {el.previousTitle ? (
          <div className="element-hero__prev">Previously: “{el.previousTitle}”</div>
        ) : null}
        <div className="element-hero__chips">
          <ChangeChip level={el.changeLevel} />
          {el.changeFlag ? (
            <span className="chip chip--magenta">
              <Icon name="flag" size={11} />&nbsp;{el.changeFlag}
            </span>
          ) : null}
          <span className="chip">{tasks.length} tasks</span>
          {counts["complete"] > 0 ? (
            <span className="chip chip--teal">{counts["complete"]} complete</span>
          ) : null}
        </div>
        <p className="element-hero__summary">{el.changeSummary}</p>
      </div>

      <div className="detail-grid">
        <div className="detail-card detail-card--changed">
          <h3 className="detail-card__title">
            <span className="detail-card__icon"><Icon name="sparkle" size={14} /></span>
            What changed in 2027–28
          </h3>
          <ul className="bullet-list">
            {el.whatChanged.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
        <div className="detail-card detail-card--address">
          <h3 className="detail-card__title">
            <span className="detail-card__icon"><Icon name="target" size={14} /></span>
            What our DCI response needs to address
          </h3>
          <ul className="bullet-list">
            {el.whatToAddress.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </div>

      <section className="section">
        <div className="row row--between" style={{ marginBottom: 10 }}>
          <h2 className="h-section" style={{ margin: 0 }}>Tasks for {el.id}</h2>
          <a className="pill" href={RESOURCES[2].url} target="_blank" rel="noreferrer">
            <Icon name="doc" size={12} /> Full DCI comparison
          </a>
        </div>
        {tasks.length === 0 ? (
          <div className="empty">No tasks tracked for this element.</div>
        ) : (
          <TaskBoard tasks={tasks} statuses={statuses} setStatus={setStatus}
            navigate={navigate} showElementLink={false} />
        )}
      </section>

      <section className="section">
        <h2 className="h-section">Related</h2>
        <div className="resource-strip">
          <a className="resource-tile" href={RESOURCES[0].url} target="_blank" rel="noreferrer">
            <span className="resource-tile__icon"><Icon name="compass" size={20} /></span>
            <div>
              <div className="resource-tile__title">ASCEND Navigator <Icon name="external" size={11} /></div>
              <div className="resource-tile__desc">Look up where {el.id}-relevant content lives in the curriculum.</div>
            </div>
          </a>
          <button className="resource-tile" onClick={() => navigate("/mepos")}>
            <span className="resource-tile__icon"><Icon name="target" size={20} /></span>
            <div>
              <div className="resource-tile__title">MEPOs Reference</div>
              <div className="resource-tile__desc">All 23 program objectives by competency domain.</div>
            </div>
          </button>
          <button className="resource-tile" onClick={() => navigate("/s/" + el.subcommittee)}>
            <span className="resource-tile__icon"><Icon name="users" size={20} /></span>
            <div>
              <div className="resource-tile__title">{sub.name}</div>
              <div className="resource-tile__desc">Members and other elements assigned to this subcommittee.</div>
            </div>
          </button>
        </div>
      </section>
    </>
  );
};

// ─── MEPOs ─────────────────────────────────────────────────────────────
const MEPOView = () => {
  let counter = 0;
  return (
    <>
      <h1 className="h-display">Medical Education Program Objectives</h1>
      <p className="lead">
        All 23 Sinai MEPOs grouped by their competency domain. Referenced throughout the
        Standard 6/7/8/9 evidence requirements — particularly Element 6.1 (linkage), 8.4
        (program-outcome evaluation), and the new 7.x competency tables.
      </p>
      <div className="mepo-numbered">
        {MEPOS.map(g => (
          <div key={g.domain} className="mepo-group">
            <h3 className="mepo-group__title">{g.domain}</h3>
            <ol className="mepo-list" start={counter + 1}
              ref={(node) => { /* no-op; numbering via counter-reset on ancestor */ }}>
              {g.items.map((item, i) => {
                counter++;
                return <li key={i}>{item}</li>;
              })}
            </ol>
          </div>
        ))}
      </div>
    </>
  );
};

// ─── Resources ─────────────────────────────────────────────────────────
const ResourcesView = ({ navigate }) => (
  <>
    <h1 className="h-display">Resources & references</h1>
    <p className="lead">Key documents, dashboards, and reference material for the task force.</p>

    <div className="grid grid--2">
      <a className="card" href={RESOURCES[0].url} target="_blank" rel="noreferrer"
        style={{ textDecoration: "none" }}>
        <div className="row" style={{ gap: 12, marginBottom: 8 }}>
          <span className="resource-tile__icon" style={{ width: 44, height: 44 }}>
            <Icon name="compass" size={24} />
          </span>
          <h3 className="h-card" style={{ flex: 1 }}>ASCEND Curriculum Navigator <Icon name="external" size={14} /></h3>
        </div>
        <p style={{ color: "var(--ink-2)", fontSize: 14, margin: 0 }}>
          Student-facing dashboard with phase, module, and EPO views. Use this to locate
          where DCI-required content lives within the curriculum map.
        </p>
        <div className="row" style={{ marginTop: 10 }}>
          <span className="chip">sinaiascend.github.io</span>
        </div>
      </a>

      <a className="card" href={RESOURCES[2].url} target="_blank" rel="noreferrer"
        style={{ textDecoration: "none" }}>
        <div className="row" style={{ gap: 12, marginBottom: 8 }}>
          <span className="resource-tile__icon" style={{ width: 44, height: 44 }}>
            <Icon name="doc" size={24} />
          </span>
          <h3 className="h-card" style={{ flex: 1 }}>DCI Standards 6/7/8/9 Comparison</h3>
        </div>
        <p style={{ color: "var(--ink-2)", fontSize: 14, margin: 0 }}>
          Element-by-element brief of what changed in the 2027-28 DCI vs. 2026-27. Source
          for every "what changed" section across this site.
        </p>
        <div className="row" style={{ marginTop: 10 }}>
          <span className="chip">PDF · Prepared for the Curricular Affairs Team</span>
        </div>
      </a>

      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <div className="row" style={{ gap: 12, marginBottom: 12 }}>
          <span className="resource-tile__icon" style={{ width: 44, height: 44 }}>
            <Icon name="tree" size={24} />
          </span>
          <h3 className="h-card" style={{ flex: 1 }}>ASCEND MD Curriculum Governance Org Chart</h3>
        </div>
        <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 0 }}>
          Reporting structure for the Dean for Medical Education, standing committees, and
          the four EEC subcommittees referenced throughout the DCI narrative.
        </p>
        <img src="assets/governance-org-chart.png" alt="ASCEND MD Curriculum Governance Org Chart"
          style={{ width: "100%", borderRadius: "var(--r)", border: "1px solid var(--line)" }} />
      </div>

      <button className="card" onClick={() => navigate("/mepos")} style={{ textAlign: "left" }}>
        <div className="row" style={{ gap: 12, marginBottom: 8 }}>
          <span className="resource-tile__icon" style={{ width: 44, height: 44 }}>
            <Icon name="target" size={24} />
          </span>
          <h3 className="h-card" style={{ flex: 1 }}>Medical Education Program Objectives</h3>
        </div>
        <p style={{ color: "var(--ink-2)", fontSize: 14, margin: 0 }}>
          All 23 MEPOs grouped by competency domain. Central to Element 6.1 linkage work
          and 8.4 outcome evaluation.
        </p>
      </button>

      <button className="card" onClick={() => navigate("/elements")} style={{ textAlign: "left" }}>
        <div className="row" style={{ gap: 12, marginBottom: 8 }}>
          <span className="resource-tile__icon" style={{ width: 44, height: 44 }}>
            <Icon name="list" size={24} />
          </span>
          <h3 className="h-card" style={{ flex: 1 }}>All LCME Elements</h3>
        </div>
        <p style={{ color: "var(--ink-2)", fontSize: 14, margin: 0 }}>
          Cross-subcommittee directory of every element assigned to the task force, with
          change-level chips and task counts.
        </p>
      </button>
    </div>
  </>
);

// ─── All elements (cross-subcommittee browse) ─────────────────────────
const AllElementsView = ({ navigate, statuses }) => {
  const [filterSub, setFilterSub] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  const filtered = useMemo(() => {
    return ELEMENTS.filter(e => {
      if (filterSub !== "all" && e.subcommittee !== filterSub) return false;
      if (filterLevel !== "all" && e.changeLevel !== filterLevel) return false;
      return true;
    });
  }, [filterSub, filterLevel]);

  return (
    <>
      <h1 className="h-display">All LCME elements</h1>
      <p className="lead">
        {ELEMENTS.length} elements assigned across all three subcommittees. Tap any element
        for the new DCI requirements, changes from 2026-27, and the linked task list.
      </p>

      <div className="row" style={{ marginBottom: 8, gap: 8 }}>
        <span className="h-eyebrow">Subcommittee</span>
        <div className="filter-pills">
          <button className={"pill " + (filterSub === "all" ? "pill--active" : "")} onClick={() => setFilterSub("all")}>All</button>
          {Object.values(SUBCOMMITTEES).map(s => (
            <button key={s.key} className={"pill " + (filterSub === s.key ? "pill--active" : "")}
              onClick={() => setFilterSub(s.key)}>{s.short}</button>
          ))}
        </div>
      </div>
      <div className="row" style={{ marginBottom: 16, gap: 8 }}>
        <span className="h-eyebrow">Change level</span>
        <div className="filter-pills">
          {["all", "MAJOR", "MINOR", "NONE", "REMOVED"].map(lvl => (
            <button key={lvl} className={"pill " + (filterLevel === lvl ? "pill--active" : "")}
              onClick={() => setFilterLevel(lvl)}>
              {lvl === "all" ? "All" : lvl === "NONE" ? "No change" : (lvl[0] + lvl.slice(1).toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      <ElementList elements={filtered} tasks={TASKS} statuses={statuses} navigate={navigate} />
    </>
  );
};

// ─── All tasks (cross-subcommittee) ───────────────────────────────────
const AllTasksView = ({ navigate, statuses, setStatus }) => {
  const [sub, setSub] = useState("all");
  const filtered = useMemo(() => {
    if (sub === "all") return TASKS;
    return TASKS.filter(t => t.subcommittee === sub);
  }, [sub]);

  return (
    <>
      <h1 className="h-display">All tasks</h1>
      <p className="lead">{TASKS.length} tracked tasks across all three subcommittees. Status is saved on this device.</p>

      <div className="row" style={{ marginBottom: 16, gap: 8 }}>
        <span className="h-eyebrow">Subcommittee</span>
        <div className="filter-pills">
          <button className={"pill " + (sub === "all" ? "pill--active" : "")} onClick={() => setSub("all")}>All</button>
          {Object.values(SUBCOMMITTEES).map(s => (
            <button key={s.key} className={"pill " + (sub === s.key ? "pill--active" : "")}
              onClick={() => setSub(s.key)}>{s.short}</button>
          ))}
        </div>
      </div>

      <TaskBoard tasks={filtered} statuses={statuses} setStatus={setStatus} navigate={navigate} showElementLink={true} />
    </>
  );
};

// (MeView removed — replaced with /members directory in docs.jsx)

// ─── Saved view (tracked tasks) ───────────────────────────────────────
const SavedView = ({ navigate, statuses, setStatus }) => {
  const tracked = TASKS.filter(t => statuses[t.id] && statuses[t.id] !== "not-started");
  const byStatus = {
    "in-progress": tracked.filter(t => statuses[t.id] === "in-progress"),
    "blocked":     tracked.filter(t => statuses[t.id] === "blocked"),
    "complete":    tracked.filter(t => statuses[t.id] === "complete"),
  };

  return (
    <>
      <h1 className="h-display">Saved</h1>
      <p className="lead">
        Tasks you've moved out of "Open" — kept on this device. Reset from the Tweaks panel if needed.
      </p>

      {tracked.length === 0 ? (
        <div className="empty">
          You haven't tracked any tasks yet. Tap a status button (In progress / Done / Blocked) on any task to save it here.
        </div>
      ) : (
        <>
          <div className="row" style={{ marginBottom: 18, flexWrap: "wrap" }}>
            <span className="chip chip--amber">{byStatus["in-progress"].length} in progress</span>
            <span className="chip chip--teal">{byStatus["complete"].length} complete</span>
            <span className="chip chip--crimson">{byStatus["blocked"].length} blocked</span>
          </div>

          {byStatus["in-progress"].length > 0 && (
            <section className="section">
              <h2 className="h-section">In progress ({byStatus["in-progress"].length})</h2>
              <TaskBoard tasks={byStatus["in-progress"]} statuses={statuses} setStatus={setStatus} navigate={navigate} showElementLink={true} />
            </section>
          )}
          {byStatus["blocked"].length > 0 && (
            <section className="section">
              <h2 className="h-section">Blocked ({byStatus["blocked"].length})</h2>
              <TaskBoard tasks={byStatus["blocked"]} statuses={statuses} setStatus={setStatus} navigate={navigate} showElementLink={true} />
            </section>
          )}
          {byStatus["complete"].length > 0 && (
            <section className="section">
              <h2 className="h-section">Complete ({byStatus["complete"].length})</h2>
              <TaskBoard tasks={byStatus["complete"]} statuses={statuses} setStatus={setStatus} navigate={navigate} showElementLink={true} />
            </section>
          )}
        </>
      )}
    </>
  );
};

Object.assign(window, {
  HomeView, SubcommitteeView, ElementView, AllElementsView, AllTasksView,
  MEPOView, ResourcesView, SavedView,
  ElementList, TaskBoard, MembersPanel,
  tasksForElement, tasksForSubcommittee, elementsForSubcommittee,
});
