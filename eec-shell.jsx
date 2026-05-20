// eec-shell.jsx — ASCEND Curriculum Governance Dashboard shell
// Sections live as siblings; sidebar nav swaps which one is visible.

const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS } = React;

const SECTIONS = [
  { id: "overview",   label: "Overview",           icon: "home"      },
  { id: "committees", label: "Committees",         icon: "users"     },
  { id: "attendance", label: "Attendance",         icon: "calendar2" },
  { id: "meetings",   label: "Meetings & Minutes", icon: "calendar"  },
  { id: "motions",    label: "Motions & Votes",    icon: "gavel"     },
  { id: "actions",    label: "Action Items",       icon: "checklist" },
  { id: "reviews",    label: "Curriculum Reviews", icon: "book2"     },
  { id: "members",    label: "Members",            icon: "person"    },
  { id: "policies",   label: "Policies",           icon: "book"      },
  { id: "linkage",    label: "Linkage Map",        icon: "link"      },
];

function Icon({ name, size = 15 }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.8,
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  switch (name) {
    case "home":      return <svg {...props}><path d="M3 12 12 4l9 8"/><path d="M5 10v10h14V10"/></svg>;
    case "users":     return <svg {...props}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M14 20c0-2 2-4 5-4"/></svg>;
    case "calendar":  return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case "calendar2": return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="8" cy="15" r="1.4" fill="currentColor"/><circle cx="12" cy="15" r="1.4" fill="currentColor"/><circle cx="16" cy="15" r="1.4" fill="currentColor"/></svg>;
    case "gavel":     return <svg {...props}><path d="m14 4 6 6"/><path d="m11 7 6 6-2 2-6-6z"/><path d="m9 9-6 6 2 2 6-6"/><path d="M14 21h8"/></svg>;
    case "checklist": return <svg {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2.5 2.5L16 9"/></svg>;
    case "person":    return <svg {...props}><circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>;
    case "book":      return <svg {...props}><path d="M4 5c0-1 1-2 2-2h13v17H6c-1 0-2 .5-2 2"/><path d="M4 5v17"/></svg>;
    case "book2":     return <svg {...props}><path d="M12 4.5c-1.5-1-4-1.5-7-1.5v15c3 0 5.5.5 7 1.5"/><path d="M12 4.5c1.5-1 4-1.5 7-1.5v15c-3 0-5.5.5-7 1.5"/><path d="M12 4.5v15"/></svg>;
    case "link":      return <svg {...props}><path d="M10 13a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 11a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/></svg>;
    case "search":    return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
    case "external":  return <svg {...props}><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M20 14v6H4V4h6"/></svg>;
    default: return null;
  }
}

function Shell() {
  const initial = (typeof window !== "undefined" && window.location.hash || "").replace("#","") || "overview";
  const [section, setSection] = useStateS(SECTIONS.find(s => s.id === initial) ? initial : "overview");
  const [searchOpen, setSearchOpen] = useStateS(false);

  // Tweaks
  const TWEAK_DEFAULTS = window.EEC_TWEAK_DEFAULTS;
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  useEffectS(() => {
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks.density]);

  // Persist section in hash
  useEffectS(() => {
    window.location.hash = section;
  }, [section]);

  // Expose nav API for cross-section deep-links
  useEffectS(() => {
    window.EEC_NAV = {
      go: (sectionId, params) => {
        setSection(sectionId);
        if (params) window.EEC_PENDING = params;
      },
    };
    window.openEecSearch = () => setSearchOpen(true);
    return () => { window.EEC_NAV = null; window.openEecSearch = null; };
  }, []);

  // ⌘K
  useEffectS(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault(); setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Compute badges
  const badges = useMemoS(() => {
    const today = new Date();
    const overdue = window.EEC.ACTIONS.filter(a => a.status !== "Completed" && a.status !== "Deferred" && new Date(a.dueDate) < today).length;
    const upcomingMeetings = window.EEC.MEETINGS.filter(m => new Date(m.date) >= today).length;
    return { overdue, upcomingMeetings };
  }, []);

  const sectionMap = {
    overview:   () => <window.EecOverview />,
    committees: () => <window.EecCommittees />,
    attendance: () => <window.EecAttendance />,
    meetings:   () => <window.EecMeetings />,
    motions:    () => <window.EecMotions />,
    actions:    () => <window.EecActions tweaks={tweaks} setTweak={setTweak} />,
    reviews:    () => <window.EecReviews />,
    members:    () => <window.EecMembers />,
    policies:   () => <window.EecPolicies />,
    linkage:    () => <window.EecLinkage />,
  };

  return (
    <div data-screen-label={SECTIONS.find(s=>s.id===section)?.label || "EEC"} style={{ minHeight: "100vh", background: "var(--grey-1)", display: "flex", flexDirection: "column" }}>
      <TopBar onOpenSearch={() => setSearchOpen(true)} />
      <div style={{ display: "flex", flex: 1, minHeight: 0, alignItems: "flex-start" }}>
        <SideNav section={section} onSelect={setSection} badges={badges} />
        <main style={{ flex: 1, minWidth: 0, padding: "26px 36px 60px", overflowX: "hidden" }}>
          {sectionMap[section]?.() || <div>Section not found.</div>}
        </main>
      </div>

      {window.EecSearch && (
        <window.EecSearch open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={(s, p) => { setSection(s); if (p) window.EEC_PENDING = p; setSearchOpen(false); }} />
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Density" />
        <window.TweakRadio label="Spacing" value={tweaks.density} options={["compact","comfortable"]} onChange={v => setTweak("density", v)} />
        <window.TweakSection label="Action items view" />
        <window.TweakRadio label="Layout" value={tweaks.actionsView} options={["kanban","table","timeline"]} onChange={v => setTweak("actionsView", v)} />
        <window.TweakSection label="LCME badges" />
        <window.TweakToggle label="Show on lists" value={tweaks.showLcme} onChange={v => setTweak("showLcme", v)} />
        <div style={{ fontSize: 11, color: "#777", marginTop: 10, lineHeight: 1.5 }}>
          ASCEND Curriculum Governance Dashboard · Mock data only. Names and details are illustrative.
        </div>
      </window.TweaksPanel>
    </div>
  );
}

function TopBar({ onOpenSearch }) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className="topbar" style={{ borderBottom: "1px solid var(--grey-3)", background: "var(--paper)", padding: "0 28px" }}>
      <div className="logo">
        <span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--brand-violet)", display: "inline-block" }} />
        <span style={{ fontFamily: "var(--serif)" }}>ASCEND Curriculum Governance</span>
        <span style={{ fontSize: 11, color: "var(--grey-11)", fontWeight: 500, fontFamily: "var(--sans)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", border: "1px solid var(--grey-3)", borderRadius: 4 }}>
          AY 2025–26
        </span>
      </div>
      <div className="crumbs" style={{ paddingLeft: 18, borderLeft: "1px solid var(--grey-3)", marginLeft: 4 }}>
        <span style={{ color: "var(--grey-11)" }}>Icahn School of Medicine at Mount Sinai</span>
        <span className="sep">·</span>
        <span style={{ color: "var(--grey-11)" }}>MD Program — ASCEND Curriculum</span>
      </div>
      <div className="spacer" />
      <button onClick={onOpenSearch} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 12px", fontSize: 12, color: "var(--grey-11)",
        background: "var(--grey-1)", border: "1px solid var(--grey-3)",
        borderRadius: 6, cursor: "pointer", minWidth: 240,
      }}>
        <Icon name="search" size={13} />
        <span style={{ flex: 1, textAlign: "left" }}>Search across all governance items…</span>
        <span style={{ fontSize: 10, padding: "1px 5px", border: "1px solid var(--grey-3)", borderRadius: 3, background: "var(--paper)" }}>
          {isMac ? "⌘K" : "Ctrl+K"}
        </span>
      </button>
      <a href="https://sinaiascend.github.io/Dashboard-Directors/" target="_blank" rel="noopener" style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "6px 12px", fontSize: 12, color: "var(--ink)",
        background: "var(--paper)", border: "1px solid var(--grey-3)",
        borderRadius: 6, textDecoration: "none", fontWeight: 500,
      }}>
        <Icon name="external" size={12} /> Curriculum Dashboard
      </a>
    </header>
  );
}

function SideNav({ section, onSelect, badges }) {
  return (
    <nav className="sidenav" style={{
      width: 220, flex: "0 0 220px",
      padding: "20px 12px",
      background: "var(--paper)", borderRight: "1px solid var(--grey-3)",
      position: "sticky", top: 0,
      alignSelf: "flex-start",
      maxHeight: "100vh",
      overflowY: "auto",
    }}>
      <div className="group">
        <div className="group-label">Governance</div>
        {SECTIONS.map(s => {
          const active = section === s.id;
          let badge = null;
          if (s.id === "actions" && badges.overdue) badge = <span style={{
            fontSize: 10, padding: "1px 6px", background: "var(--bad-tint)",
            color: "var(--bad)", borderRadius: 999, fontWeight: 700,
          }}>{badges.overdue} overdue</span>;
          if (s.id === "meetings" && badges.upcomingMeetings) badge = <span style={{
            fontSize: 10, padding: "1px 6px", background: "var(--grey-2)",
            color: "var(--grey-11)", borderRadius: 999, fontWeight: 600,
          }}>{badges.upcomingMeetings}</span>;
          return (
            <div key={s.id} className={"nav-item" + (active ? " active" : "")}
                 onClick={() => onSelect(s.id)}>
              <Icon name={s.icon} />
              <span>{s.label}</span>
              {badge && <span style={{ marginLeft: "auto" }}>{badge}</span>}
            </div>
          );
        })}
      </div>

      <div className="group">
        <div className="group-label">Committees</div>
        {window.EEC.COMMITTEES.map(c => (
          <div key={c.id}
               onClick={() => { window.EEC_PENDING = { committee: c.id }; onSelect("committees"); }}
               className="nav-item"
               style={{ fontSize: 11.5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flex: "0 0 8px" }} />
            <span style={{ fontWeight: c.id === "EEC" ? 700 : 500 }}>{c.short}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--grey-7)" }}>
              {c.votingSeats}v
            </span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--grey-3)", marginTop: 14, paddingTop: 12, fontSize: 10.5, color: "var(--grey-7)", padding: "12px 12px 0" }}>
        <div style={{ marginBottom: 4 }}>Office of Curricular Affairs</div>
        <div>Last sync: {new Date().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </nav>
  );
}

window.EecShell = Shell;
window.EEC_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "compact",
  "actionsView": "kanban",
  "showLcme": true
}/*EDITMODE-END*/;
