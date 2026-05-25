/* global React, ReactDOM, LCME_DATA, LCME_DCI, LCME_ISA, LCME_GLOSSARY,
   HomeView, SubcommitteeView, ElementView, AllElementsView, AllTasksView,
   MEPOView, ResourcesView, MembershipView, GlossaryView, RosterView, AllPhasesView,
   DCIIndexView, DCIStandardView, DCIElementView, ISAIndexView, ISADomainView,
   AboutView, RoadmapView, LeadershipView, AllSubcommitteesView, SiteVisitView, AscendView,
   Breadcrumbs, Icon, useTaskStatuses, DocSearchBar,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakButton */
// LCME Task Force — App root with hash router + breadcrumbs + tweaks.

const { useState, useEffect, useMemo, useCallback } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "sinai",
  "density": "comfortable"
}/*EDITMODE-END*/;

// ─── Hash router ──────────────────────────────────────────────────────
function useHashRoute() {
  const parse = () => (window.location.hash || "#/").replace(/^#/, "") || "/";
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const fn = () => setRoute(parse());
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  const navigate = useCallback((path) => {
    if (path.startsWith("#")) path = path.slice(1);
    if (!path.startsWith("/")) path = "/" + path;
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return [route, navigate];
}

// ─── Header ───────────────────────────────────────────────────────────
const Header = ({ navigate }) => (
  <header className="app-header">
    <div className="app-header__bar">
      <a className="app-header__brand" href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
        <div className="app-header__crest">LC</div>
        <div>
          <div className="app-header__title">LCME Task Force</div>
          <div className="app-header__sub">Mount Sinai · 2027–28 DCI Cycle</div>
        </div>
      </a>
      <span className="app-header__spacer" />
      <button className="app-header__back" onClick={() => navigate("/")}>
        <Icon name="home" size={13} /> Home
      </button>
    </div>
  </header>
);

// ─── Build breadcrumb trail from current view ─────────────────────────
function trailFor(view, navigate) {
  const base = { label: "Home", path: "/" };
  switch (view.type) {
    case "home":              return [{ label: "Home" }];
    case "subcommittee":      return [base, { label: window.LCME_DATA.SUBCOMMITTEES[view.key]?.short || view.key }];
    case "element": {
      const tf = window.LCME_DATA.ELEMENTS.find(e => e.id === view.id);
      const subName = tf ? window.LCME_DATA.SUBCOMMITTEES[tf.subcommittee].short : null;
      const trail = [base];
      if (tf) trail.push({ label: subName, path: "/s/" + tf.subcommittee });
      trail.push({ label: "Element " + view.id });
      return trail;
    }
    case "all-elements":      return [base, { label: "All elements" }];
    case "all-tasks":         return [base, { label: "All tasks" }];
    case "mepos":             return [base, { label: "MEPOs" }];
    case "resources":         return [base, { label: "Resources" }];
    case "members":           return [base, { label: "Membership" }];
    case "glossary":          return [base, { label: "Glossary" }];
    case "phases":            return [base, { label: "ASCEND Phases" }];
    case "roster": {
      const labels = { phase1: "Phase 1 modules", phase2: "Phase 2 clerkships", phase3: "Phase 3 experiences" };
      return [base, { label: labels[view.id] || "Roster" }];
    }
    case "dci":               return [base, { label: "DCI 2027–28" }];
    case "dci-standard":      return [base, { label: "DCI 2027–28", path: "/dci" }, { label: "Standard " + view.id }];
    case "dci-element": {
      let standardId = null;
      for (const std of (window.LCME_DCI || [])) if (std.elements.find(e => e.id === view.id)) { standardId = std.id; break; }
      const trail = [base, { label: "DCI 2027–28", path: "/dci" }];
      if (standardId) trail.push({ label: "Standard " + standardId, path: "/dci/s/" + standardId });
      trail.push({ label: "Element " + view.id });
      return trail;
    }
    case "isa":               return [base, { label: "ISA" }];
    case "isa-domain": {
      const d = (window.LCME_ISA || [])[Number(view.idx)];
      return [base, { label: "ISA", path: "/isa" }, { label: d ? "Domain " + (Number(view.idx)+1) : "Domain" }];
    }
    case "about":             return [base, { label: "About the self-study" }];
    case "roadmap":           return [base, { label: "Roadmap" }];
    case "leadership":        return [base, { label: "Leadership & roles" }];
    case "sc8":               return [base, { label: "All 8 subcommittees" }];
    case "site-visit":        return [base, { label: "Site visit" }];
    case "ascend":            return [base, { label: "ASCEND curriculum" }];
    default:                  return [{ label: "Home" }];
  }
}

// ─── Search overlay ───────────────────────────────────────────────────
const SearchOverlay = ({ open, onClose, navigate }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  const go = (path) => { onClose(); navigate(path); };
  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-overlay__panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-overlay__head">
          <h3 className="search-overlay__title">Search the DCI &amp; ISA</h3>
          <button className="search-overlay__close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>
        <DocSearchBar placeholder="Search standards, elements, narratives, tables, ISA items…" navigate={go} />
        <div className="search-overlay__hint">
          Tip: try a topic ("self-directed"), an element ID ("7.6"), or a table name.
        </div>
      </div>
    </div>
  );
};

// ─── Bottom bar ───────────────────────────────────────────────────────
const BottomBar = ({ route, navigate, onSearch }) => {
  const active = (path) => route.startsWith(path);
  return (
    <nav className="bottom-bar" aria-label="Primary">
      <button className="bottom-bar__btn" onClick={onSearch}>
        <Icon name="search" size={20} />
        <span>Search</span>
      </button>
      <button className={"bottom-bar__btn " + (active("/dci") ? "is-active" : "")}
        onClick={() => navigate("/dci")}>
        <Icon name="book" size={20} />
        <span>DCI</span>
      </button>
      <button className={"bottom-bar__btn " + (active("/members") ? "is-active" : "")}
        onClick={() => navigate("/members")}>
        <Icon name="users" size={20} />
        <span>Members</span>
      </button>
      <button className={"bottom-bar__btn " + (active("/glossary") ? "is-active" : "")}
        onClick={() => navigate("/glossary")}>
        <Icon name="glossary" size={20} />
        <span>Glossary</span>
      </button>
    </nav>
  );
};

// ─── App ──────────────────────────────────────────────────────────────
const App = () => {
  const [route, navigate] = useHashRoute();
  const [statuses, setStatus] = useTaskStatuses();
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  const [tab, setTab] = useState("elements");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "sinai");
  }, [tweaks.theme]);

  useEffect(() => { setTab("elements"); }, [route]);

  const view = useMemo(() => {
    const parts = route.split("/").filter(Boolean);
    if (parts.length === 0)              return { type: "home" };
    if (parts[0] === "s"  && parts[1])   return { type: "subcommittee", key: parts[1] };
    if (parts[0] === "e"  && parts[1])   return { type: "element", id: parts[1] };
    if (parts[0] === "elements")         return { type: "all-elements" };
    if (parts[0] === "tasks")            return { type: "all-tasks" };
    if (parts[0] === "mepos")            return { type: "mepos" };
    if (parts[0] === "resources")        return { type: "resources" };
    if (parts[0] === "members")          return { type: "members" };
    if (parts[0] === "glossary")         return { type: "glossary" };
    if (parts[0] === "phases")           return { type: "phases" };
    if (parts[0] === "roster" && parts[1]) return { type: "roster", id: parts[1] };
    if (parts[0] === "dci" && parts[1] === "s" && parts[2]) return { type: "dci-standard", id: parts[2] };
    if (parts[0] === "dci" && parts[1] === "e" && parts[2]) return { type: "dci-element", id: parts[2] };
    if (parts[0] === "dci")              return { type: "dci" };
    if (parts[0] === "isa" && parts[1])  return { type: "isa-domain", idx: parts[1] };
    if (parts[0] === "isa")              return { type: "isa" };
    if (parts[0] === "about")            return { type: "about" };
    if (parts[0] === "roadmap")          return { type: "roadmap" };
    if (parts[0] === "leadership")       return { type: "leadership" };
    if (parts[0] === "sc8")              return { type: "sc8" };
    if (parts[0] === "site-visit")       return { type: "site-visit" };
    if (parts[0] === "ascend")           return { type: "ascend" };
    return { type: "home" };
  }, [route]);

  const trail = trailFor(view, navigate);

  return (
    <>
      <Header navigate={navigate} />
      <main className="app-main" key={route}>
        {view.type !== "home" ? <Breadcrumbs trail={trail} navigate={navigate} /> : null}

        {view.type === "home"               && <HomeView navigate={navigate} statuses={statuses} />}
        {view.type === "subcommittee"       && <SubcommitteeView subKey={view.key} tab={tab} setTab={setTab}
                                                navigate={navigate} statuses={statuses} setStatus={setStatus} />}
        {view.type === "element"            && <ElementView elementId={view.id} navigate={navigate}
                                                statuses={statuses} setStatus={setStatus} />}
        {view.type === "all-elements"       && <AllElementsView navigate={navigate} statuses={statuses} />}
        {view.type === "all-tasks"          && <AllTasksView navigate={navigate} statuses={statuses} setStatus={setStatus} />}
        {view.type === "mepos"              && <MEPOView />}
        {view.type === "resources"          && <ResourcesView navigate={navigate} />}
        {view.type === "members"            && <MembershipView navigate={navigate} />}
        {view.type === "glossary"           && <GlossaryView navigate={navigate} />}
        {view.type === "phases"             && <AllPhasesView navigate={navigate} />}
        {view.type === "roster"             && <RosterView phaseId={view.id} navigate={navigate} />}
        {view.type === "dci"                && <DCIIndexView navigate={navigate} />}
        {view.type === "dci-standard"       && <DCIStandardView standardId={view.id} navigate={navigate} />}
        {view.type === "dci-element"        && <DCIElementView elementId={view.id} navigate={navigate} />}
        {view.type === "isa"                && <ISAIndexView navigate={navigate} />}
        {view.type === "isa-domain"         && <ISADomainView domainIdx={view.idx} navigate={navigate} />}
        {view.type === "about"              && <AboutView navigate={navigate} />}
        {view.type === "roadmap"            && <RoadmapView navigate={navigate} />}
        {view.type === "leadership"         && <LeadershipView navigate={navigate} />}
        {view.type === "sc8"                && <AllSubcommitteesView navigate={navigate} />}
        {view.type === "site-visit"         && <SiteVisitView navigate={navigate} />}
        {view.type === "ascend"             && <AscendView navigate={navigate} />}
      </main>

      <footer className="app-footer">
        Mount Sinai LCME Task Force · 2027–28 DCI Cycle · 
        <a href="https://sinaiascend.github.io/Dashboard-Students/" target="_blank" rel="noreferrer"> ASCEND Curriculum Navigator </a>
         · Status saved on this device
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Visual theme" />
        <TweakRadio
          label="Theme"
          value={tweaks.theme}
          onChange={v => setTweak("theme", v)}
          options={[
            { value: "sinai",  label: "ASCEND" },
            { value: "calm",   label: "Calm institutional" },
            { value: "modern", label: "Modern productivity" },
          ]} />

        <TweakSection label="Task data" />
        <TweakButton label="Reset task status" secondary onClick={() => {
          if (confirm("Clear all task status (this device only)?")) {
            localStorage.removeItem("lcme.taskforce.statuses.v1");
            location.reload();
          }
        }} />
        <TweakButton label="Show progress summary" onClick={() => {
          const tasks = window.LCME_DATA.TASKS;
          const total = tasks.length;
          const counts = { complete: 0, "in-progress": 0, blocked: 0 };
          for (const t of tasks) {
            const s = statuses[t.id];
            if (s && counts[s] !== undefined) counts[s]++;
          }
          const notStarted = total - counts.complete - counts["in-progress"] - counts.blocked;
          alert(`Status saved on this device:\n• Complete: ${counts.complete}\n• In progress: ${counts["in-progress"]}\n• Blocked: ${counts.blocked}\n• Not started: ${notStarted}\n• Total: ${total}`);
        }} />
      </TweaksPanel>

      <BottomBar route={route} navigate={navigate} onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} navigate={navigate} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
