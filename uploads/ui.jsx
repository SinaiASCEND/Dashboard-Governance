/* global React */
// Shared UI primitives: icons, chips, common bits.

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ─── Icons ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, ...rest }) => {
  const paths = {
    chevron:   <polyline points="6 4 14 10 6 16" />,
    chevronDown: <polyline points="4 7 10 13 16 7" />,
    check:     <polyline points="4 10 8 14 16 6" />,
    arrowR:    <g><line x1="3" y1="10" x2="17" y2="10" /><polyline points="11 4 17 10 11 16" /></g>,
    arrowL:    <g><line x1="17" y1="10" x2="3" y2="10" /><polyline points="9 4 3 10 9 16" /></g>,
    home:      <path d="M3 10 L10 4 L17 10 V16 H12 V11 H8 V16 H3 Z" />,
    users:     <g><circle cx="7" cy="8" r="3" /><circle cx="14" cy="8" r="2.5" /><path d="M2 17 c0-3 2-5 5-5 s5 2 5 5" /><path d="M11 17 c0-2 1-4 3-4 s3 1.5 3 4" /></g>,
    list:      <g><line x1="6" y1="6" x2="17" y2="6" /><line x1="6" y1="10" x2="17" y2="10" /><line x1="6" y1="14" x2="17" y2="14" /><circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="10" r="1" fill="currentColor" /><circle cx="3" cy="14" r="1" fill="currentColor" /></g>,
    compass:   <g><circle cx="10" cy="10" r="7" /><polygon points="10,5 12,10 10,15 8,10" fill="currentColor" /></g>,
    doc:       <g><path d="M5 3 H12 L15 6 V17 H5 Z" /><polyline points="12 3 12 6 15 6" /></g>,
    tree:      <g><rect x="7" y="3" width="6" height="4" rx="1" /><rect x="2" y="13" width="5" height="4" rx="1" /><rect x="13" y="13" width="5" height="4" rx="1" /><path d="M10 7 V11 M4.5 11 H15.5 M4.5 11 V13 M15.5 11 V13" /></g>,
    target:    <g><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="3.5" /><circle cx="10" cy="10" r="0.5" fill="currentColor" /></g>,
    flag:      <g><line x1="4" y1="3" x2="4" y2="17" /><path d="M4 4 H15 L13 7 L15 10 H4" /></g>,
    sparkle:   <g><path d="M10 3 L11.5 8.5 L17 10 L11.5 11.5 L10 17 L8.5 11.5 L3 10 L8.5 8.5 Z" /></g>,
    book:      <g><path d="M4 4 H9 a3 3 0 0 1 3 3 V17 a3 3 0 0 0 -3 -3 H4 Z" /><path d="M16 4 H11 a3 3 0 0 0 -3 3 V17 a3 3 0 0 1 3 -3 H16 Z" /></g>,
    search:    <g><circle cx="9" cy="9" r="5" /><line x1="13" y1="13" x2="17" y2="17" /></g>,
    x:         <g><line x1="5" y1="5" x2="15" y2="15" /><line x1="15" y1="5" x2="5" y2="15" /></g>,
    mail:      <g><rect x="3" y="5" width="14" height="10" rx="1.5" /><polyline points="3 7 10 12 17 7" /></g>,
    settings:  <g><circle cx="10" cy="10" r="2.5" /><path d="M10 3 v2 M10 15 v2 M3 10 h2 M15 10 h2 M5 5 l1.5 1.5 M13.5 13.5 l1.5 1.5 M5 15 l1.5 -1.5 M13.5 6.5 l1.5 -1.5" /></g>,
    open:      <g><path d="M4 10 V16 H16 V10" /><polyline points="7 6 10 3 13 6" /><line x1="10" y1="3" x2="10" y2="13" /></g>,
    external:  <g><path d="M11 3 H17 V9" /><line x1="17" y1="3" x2="9" y2="11" /><path d="M14 11 V16 H4 V6 H9" /></g>,
    alert:     <g><path d="M10 3 L17 16 H3 Z" /><line x1="10" y1="8" x2="10" y2="12" /><circle cx="10" cy="14.5" r="0.7" fill="currentColor" /></g>,
    info:      <g><circle cx="10" cy="10" r="7" /><line x1="10" y1="9" x2="10" y2="14" /><circle cx="10" cy="6.5" r="0.7" fill="currentColor" /></g>,
    minus:     <line x1="5" y1="10" x2="15" y2="10" />,
    bookmark:  <path d="M5 3 H15 V17 L10 13 L5 17 Z" />,
    bookmarkF: <path d="M5 3 H15 V17 L10 13 L5 17 Z" fill="currentColor" stroke="none" />,
    glossary:  <g><path d="M4 4 a1.2 1.2 0 0 1 1.2 -1.2 H16 V14.5 H5.2 a1.2 1.2 0 0 0 -1.2 1.2 Z" /><path d="M4 15.7 a1.2 1.2 0 0 1 1.2 -1.2 H16 V17 H5.2 a1.2 1.2 0 0 1 -1.2 -1.3 Z" /><line x1="7.5" y1="6.5" x2="13" y2="6.5" /><line x1="7.5" y1="9" x2="13" y2="9" /><line x1="7.5" y1="11.5" x2="11" y2="11.5" /></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20"
      fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name] || null}
    </svg>
  );
};

// ─── Change-level chip ─────────────────────────────────────────────────
const ChangeChip = ({ level }) => {
  const label = level === "NONE" ? "No change" : level.toLowerCase();
  return <span className={`change-chip change-chip--${level}`}>{label}</span>;
};

// ─── Tab strip ─────────────────────────────────────────────────────────
const Tabs = ({ tabs, value, onChange }) => (
  <div className="tabs" role="tablist">
    {tabs.map(t => (
      <button key={t.id}
        role="tab"
        aria-selected={value === t.id}
        className={"tab " + (value === t.id ? "tab--active" : "")}
        onClick={() => onChange(t.id)}>
        {t.label}
        {typeof t.count === "number" ? <span className="tab__count">{t.count}</span> : null}
      </button>
    ))}
  </div>
);

// ─── Initials avatar helper ────────────────────────────────────────────
const initialsFor = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Sticky progress fraction ──────────────────────────────────────────
const fractionLabel = (done, total) => {
  if (total === 0) return "—";
  return `${done}/${total}`;
};

// ─── Date helpers ──────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return null;
  try {
    const d = new Date(iso + "T12:00:00Z");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (_) { return iso; }
};
const formatDateShort = (iso) => {
  if (!iso) return null;
  try {
    const d = new Date(iso + "T12:00:00Z");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch (_) { return iso; }
};

// ─── External link helper ──────────────────────────────────────────────
const isExternal = (url) => /^https?:\/\//.test(url);

// ─── Storage hook for task statuses ────────────────────────────────────
// statuses: { [taskId]: "not-started" | "in-progress" | "complete" | "blocked" }
const STORAGE_KEY = "lcme.taskforce.statuses.v1";
const NAME_KEY    = "lcme.taskforce.me.v1";

function useTaskStatuses() {
  const [statuses, setStatuses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (_) { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses)); } catch (_) {}
  }, [statuses]);
  const setStatus = useCallback((taskId, status) => {
    setStatuses(prev => {
      const next = { ...prev };
      if (!status || status === "not-started") delete next[taskId];
      else next[taskId] = status;
      return next;
    });
  }, []);
  return [statuses, setStatus];
}

function useMe() {
  const [me, setMeState] = useState(() => {
    try { return localStorage.getItem(NAME_KEY) || ""; } catch (_) { return ""; }
  });
  const setMe = useCallback((name) => {
    setMeState(name);
    try {
      if (name) localStorage.setItem(NAME_KEY, name);
      else localStorage.removeItem(NAME_KEY);
    } catch (_) {}
  }, []);
  return [me, setMe];
}

// ─── Export to window for cross-file access ───────────────────────────
Object.assign(window, {
  Icon, ChangeChip, Tabs,
  initialsFor, fractionLabel, formatDate, formatDateShort, isExternal,
  useTaskStatuses, useMe,
});
