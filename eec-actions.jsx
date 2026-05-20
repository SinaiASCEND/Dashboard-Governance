// eec-actions.jsx — Action items list with Source / Kind sectioning.
//
// Data model:
//   action.source = 'tracker' | 'meeting'
//   action.kind   = 'tracker' | 'operational' | 'cqi'
//
// Three top-level tabs:
//   1. Tracker         — LCME closed-loop Action Plan Tracker (the 36 items)
//   2. CQI (meetings)  — continuous-improvement items generated in EEC meetings
//   3. Operational     — operational / communications items generated in meetings
//
// Single-column list view (wide rows, plenty of room for text).
// Compact filters along the top.

const { useState: useStateA, useMemo: useMemoA, useEffect: useEffectA } = React;

// LocalStorage-backed user completion overrides. Lets users tick off action
// items as they're completed; survives reloads. Keyed by action.id.
function useCompletedOverrides() {
  const KEY = "eec.action.completed.v1";
  const [map, setMap] = useStateA(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch { return {}; }
  });
  const set = (id, value) => {
    setMap(prev => {
      const next = { ...prev };
      if (value) next[id] = new Date().toISOString();
      else delete next[id];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const has = id => !!map[id];
  return { map, set, has };
}

const TABS = [
  { id: "tracker",     label: "Tracker",        sub: "LCME closed-loop Action Plan Tracker",
    color: "var(--brand-violet)", deep: "var(--brand-violet)", tint: "var(--brand-violet-tint)" },
  { id: "cqi",         label: "CQI · Meetings", sub: "Continuous-improvement actions from meetings",
    color: "var(--brand-cyan)",   deep: "var(--brand-cyan-deep)", tint: "var(--brand-cyan-tint)" },
  { id: "operational", label: "Operational",    sub: "Operational / communications actions from meetings",
    color: "var(--good)",         deep: "#176D3B", tint: "var(--good-tint)" },
];

function EecActions({ tweaks, setTweak }) {
  const A = window.EEC.ACTIONS;
  const completed = useCompletedOverrides();
  const [tab, setTab] = useStateA("tracker");
  const [search, setSearch] = useStateA("");
  const [filterCommittee, setFilterCommittee] = useStateA("all");
  const [filterStatus, setFilterStatus] = useStateA("all");
  const [filterLcme, setFilterLcme] = useStateA("all");
  const [openAction, setOpenAction] = useStateA(null);

  // Consume cross-section navigation
  useEffectA(() => {
    if (window.EEC_PENDING?.action) {
      const id = window.EEC_PENDING.action;
      const a = window.EEC.actionById[id];
      // Auto-switch to the tab the action lives in
      if (a) setTab(a.kind === "tracker" ? "tracker" : a.kind);
      setOpenAction(id);
      window.EEC_PENDING = null;
    }
  }, []);

  // Counts by tab (across the full set, before filters)
  const tabCounts = useMemoA(() => {
    const c = { tracker: 0, cqi: 0, operational: 0 };
    for (const a of A) {
      if (a.kind === "tracker") c.tracker++;
      else if (a.kind === "cqi") c.cqi++;
      else if (a.kind === "operational") c.operational++;
    }
    return c;
  }, []);

  const filtered = useMemoA(() => {
    const q = search.toLowerCase().trim();
    return A.filter(a => {
      if (a.kind !== tab) return false;
      const effective = completed.has(a.id) ? "Completed" : a.status;
      if (filterStatus !== "all" && effective !== filterStatus) return false;
      if (filterCommittee !== "all" && a.committee !== filterCommittee) return false;
      if (filterLcme !== "all" && !a.lcme.includes(filterLcme)) return false;
      if (q) {
        const hay = (a.title + " " + (a.description || "") + " " + (a.ownerLabel || "") + " " + (a.followUp || "")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tab, search, filterCommittee, filterStatus, filterLcme, completed.map]);

  // Group filtered rows by status for visual rhythm (status headings within a single column)
  const groupedByStatus = useMemoA(() => {
    const order = ["Not Started", "In Progress", "Completed", "Deferred"];
    const norm = s => {
      if (s === "Not initiated") return "Not Started";
      if (s === "In progress" || s === "On Track" || s === "At Risk") return "In Progress";
      if (s === "Closed") return "Completed";
      if (s === "Off Track" || s === "Escalated") return "Deferred";
      return s;
    };
    const buckets = new Map(order.map(k => [k, []]));
    for (const a of filtered) {
      const k = norm(completed.has(a.id) ? "Completed" : a.status);
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(a);
    }
    return [...buckets.entries()].filter(([, arr]) => arr.length > 0);
  }, [filtered, completed.map]);

  const tabMeta = TABS.find(t => t.id === tab);

  return (
    <div>
      <window.SectionHead
        eyebrow="Closed-loop CQI · LCME Element 8.1"
        title="Action Items"
        sub={`${A.length} action items across ${window.EEC.MEETINGS.length} meetings, separated by source and category. Each action carries a defined follow-up date per Article II §3 of the bylaws.`}
      />

      {/* Source / kind tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 22, borderBottom: "1px solid var(--grey-3)", flexWrap: "wrap" }}>
        {TABS.map(t => {
          const active = tab === t.id;
          const count = tabCounts[t.id];
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                padding: "10px 18px 12px",
                fontSize: 13, fontWeight: 600, gap: 2,
                background: active ? t.tint : "transparent",
                color: active ? t.deep : "var(--grey-11)",
                border: 0,
                borderBottom: active ? `3px solid ${t.color}` : "3px solid transparent",
                marginBottom: -1,
                cursor: "pointer", fontFamily: "inherit", minWidth: 180, textAlign: "left",
              }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: t.color, flex: "0 0 8px" }} />
                {t.label}
                <span style={{ fontSize: 11, color: active ? t.deep : "var(--grey-7)", fontWeight: 700, opacity: 0.75 }}>{count}</span>
              </span>
              <span style={{ fontSize: 10.5, color: "var(--grey-11)", fontWeight: 500, letterSpacing: 0 }}>{t.sub}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <window.SearchInput value={search} onChange={setSearch} placeholder="Search action items…" width={280} />
        <Divider />
        <FilterChips
          label="Committee"
          value={filterCommittee}
          onChange={setFilterCommittee}
          options={[{ v: "all", l: "All" }, ...window.EEC.COMMITTEES.map(c => ({ v: c.id, l: c.short }))]}
        />
        <Divider />
        <FilterChips
          label="Status"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { v: "all", l: "All" },
            { v: "Not Started", l: "Not started" },
            { v: "In Progress", l: "In progress" },
            { v: "Completed", l: "Completed" },
            { v: "Deferred", l: "Deferred" },
          ]}
        />
        <Divider />
        <LcmeFilter value={filterLcme} onChange={setFilterLcme} />
        <div style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--grey-11)" }}>
          Showing <strong style={{ color: "var(--ink)" }}>{filtered.length}</strong> of {tabCounts[tab]}
        </div>
      </div>

      {/* Single-column list */}
      {filtered.length === 0 ? (
        <window.Card>
          <window.Empty
            title="No action items match these filters"
            sub="Try clearing the search or expanding the status filter."
          />
        </window.Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {groupedByStatus.map(([status, arr]) => (
            <div key={status}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "0 4px 8px",
                marginBottom: 8,
                borderBottom: "1px solid var(--grey-3)",
              }}>
                <StatusDot status={status} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                  {status}
                </span>
                <span style={{ fontSize: 11.5, color: "var(--grey-11)" }}>{arr.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {arr.map(a => <ActionListRow key={a.id} a={a} onOpen={setOpenAction} showLcme={tweaks?.showLcme !== false} accent={tabMeta} completed={completed} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      <ActionDrawer actionId={openAction} onClose={() => setOpenAction(null)} />
    </div>
  );
}

function Divider() {
  return <span style={{ width: 1, height: 18, background: "var(--grey-3)" }} />;
}

function FilterChips({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 10.5, color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", gap: 0, border: "1px solid var(--grey-3)", borderRadius: 6, overflow: "hidden" }}>
        {options.map(o => (
          <button key={o.v} onClick={() => onChange(o.v)}
            style={{
              padding: "5px 10px", fontSize: 11.5, fontWeight: 500,
              background: value === o.v ? "var(--ink)" : "var(--paper)",
              color: value === o.v ? "white" : "var(--ink-2)",
              border: 0, borderRight: "1px solid var(--grey-3)", cursor: "pointer", fontFamily: "inherit",
            }}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function LcmeFilter({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 10.5, color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>LCME</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: "5px 8px", fontSize: 11.5, border: "1px solid var(--grey-3)", borderRadius: 6, fontFamily: "inherit", background: "var(--paper)" }}>
        <option value="all">All</option>
        <optgroup label="Standard 8">
          {window.EEC.LCME.filter(e => e.standard === 8).map(e => <option key={e.id} value={e.id}>{e.id} · {e.short}</option>)}
        </optgroup>
        <optgroup label="Other">
          {window.EEC.LCME.filter(e => e.standard !== 8).map(e => <option key={e.id} value={e.id}>{e.id} · {e.short}</option>)}
        </optgroup>
      </select>
    </div>
  );
}

// ─── Single-column row card ────────────────────────────────────────────────
function ActionListRow({ a, onOpen, showLcme, accent, completed }) {
  const c = window.EEC.committeeById[a.committee];
  const days = window.dayDiff(window.EEC.TODAY, a.dueDate);
  const isCompleted = completed.has(a.id) || a.status === "Completed";
  const overdue = !isCompleted && a.status !== "Deferred" && days < 0;
  const owner = window.EEC.memberById[a.ownerId];
  const ownerName = owner ? owner.name.replace(/,?\s*(MD|PhD|MEd|MPH|DO|MHPE).*$/i, "") : (a.ownerLabel || "—");
  const meeting = a.originatingMeeting ? (window.EEC.meetingById[a.originatingMeeting] || { date: a.originatingMeeting }) : null;
  return (
    <div onClick={() => onOpen(a.id)} className="card" style={{
      padding: "16px 20px",
      display: "grid",
      gridTemplateColumns: "30px minmax(0, 1fr) 220px",
      gap: 18, alignItems: "start",
      borderLeft: `3px solid ${accent.color}`,
      cursor: "pointer",
      opacity: isCompleted ? 0.78 : 1,
      transition: "transform .12s, box-shadow .12s, opacity .18s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ""}
    >
      {/* Tick-off checkbox */}
      <div onClick={e => { e.stopPropagation(); completed.set(a.id, !completed.has(a.id)); }}
           title={completed.has(a.id) ? "Mark as not completed" : "Mark as completed"}
           style={{
             width: 22, height: 22, marginTop: 2,
             border: `1.5px solid ${isCompleted ? "var(--good)" : "var(--grey-5)"}`,
             borderRadius: 5,
             background: isCompleted ? "var(--good)" : "var(--paper)",
             display: "grid", placeItems: "center",
             color: "white", fontWeight: 700, fontSize: 14, lineHeight: 1,
             cursor: "pointer",
             flex: "0 0 22px",
             transition: "background .15s, border-color .15s",
           }}>
        {isCompleted && "\u2713"}
      </div>
      {/* Left column — title + description */}
      <div style={{ minWidth: 0 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 10.5, padding: "1px 7px", borderRadius: 3,
            background: c.tint, color: c.deep, fontWeight: 700,
            fontFamily: "var(--mono)", letterSpacing: "0.02em",
          }}>{a.id}</span>
          <window.CommitteeChip id={a.committee} size="sm" />
          {a.domain && (
            <span style={{
              fontSize: 10, color: "var(--grey-11)", letterSpacing: "0.06em",
              textTransform: "uppercase", fontWeight: 600,
            }}>· {a.domain}</span>
          )}
          {meeting && (
            <span style={{ fontSize: 10.5, color: "var(--grey-7)", fontFamily: "var(--mono)" }}>
              · from {window.fmtDate(meeting.date, "short")}
            </span>
          )}
        </div>
        {/* Title */}
        <div style={{
          fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4, marginBottom: 6,
          textDecoration: isCompleted ? "line-through" : "none",
          textDecorationColor: "var(--grey-7)",
        }}>
          {a.title}
        </div>
        {/* Description */}
        {a.description && a.description !== a.title && (
          <div style={{
            fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55,
            marginBottom: 8, textWrap: "pretty",
          }}>
            {a.description}
          </div>
        )}
        {/* Follow-up note */}
        {a.followUp && (
          <div style={{
            fontSize: 11.5, color: "var(--grey-11)", lineHeight: 1.5,
            padding: "6px 10px", background: "var(--grey-1)",
            borderRadius: 4, borderLeft: "2px solid var(--brand-cyan)",
            marginTop: 8,
          }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "var(--brand-cyan-deep)", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 6 }}>
              Follow-up
            </span>
            {a.followUp}
          </div>
        )}
        {/* LCME badges */}
        {showLcme && a.lcme.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
            {a.lcme.map(l => <window.LcmeBadge key={l} id={l} short />)}
          </div>
        )}
      </div>

      {/* Right column — status, owner, due */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
        <window.StatusPill status={isCompleted ? "Completed" : a.status} percent={isCompleted ? 100 : a.percent} />
        {!isCompleted && (a.status === "In Progress" || a.status === "In progress") && (
          <div style={{ width: "100%" }}>
            <window.MiniBar percent={a.percent} color="var(--brand-cyan)" />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, width: "100%" }}>
          {a.ownerId ? <window.MemberAvatar id={a.ownerId} size={24} /> : <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--grey-2)", display: "inline-block", flex: "0 0 24px" }} />}
          <div style={{ minWidth: 0, fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.3, overflow: "hidden" }}>
            <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ownerName}
            </div>
            <div style={{ fontSize: 10, color: "var(--grey-7)" }}>Owner</div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: overdue ? "var(--bad)" : "var(--ink-2)", fontWeight: overdue ? 600 : 500 }}>
          {window.fmtDate(a.dueDate, "medium")}
          <div style={{ fontSize: 10, color: overdue ? "var(--bad)" : "var(--grey-7)", fontWeight: 500 }}>
            {isCompleted ? "closed" : overdue ? `${-days}d overdue` : `due in ${days}d`}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const color = {
    "Not Started": "var(--grey-7)",
    "In Progress": "var(--brand-cyan)",
    "Completed":   "var(--good)",
    "Deferred":    "var(--warn)",
  }[status] || "var(--grey-7)";
  return <span style={{ width: 9, height: 9, borderRadius: 999, background: color, flex: "0 0 9px" }} />;
}

// ─── Action detail drawer (unchanged feature set, slightly enhanced footer) ─
function ActionDrawer({ actionId, onClose }) {
  const a = actionId ? window.EEC.actionById[actionId] : null;
  if (!a) return <window.Drawer open={false} onClose={onClose} title="" />;
  const c = window.EEC.committeeById[a.committee];
  const meeting = window.EEC.meetingById[a.originatingMeeting];
  const days = window.dayDiff(window.EEC.TODAY, a.dueDate);
  const overdue = a.status !== "Completed" && a.status !== "Deferred" && days < 0;

  const kindLabel = a.kind === "tracker" ? "LCME Action Plan Tracker" : a.kind === "cqi" ? "Meeting · CQI" : "Meeting · Operational";

  return (
    <window.Drawer
      open={!!a}
      onClose={onClose}
      eyebrow={`${a.id} · ${kindLabel}`}
      title={a.title}
      accentColor={c.color}
      width={620}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
        <window.CommitteeChip id={a.committee} size="md" />
        <window.StatusPill status={a.status} percent={a.percent} />
        <span style={{ fontSize: 11, color: overdue ? "var(--bad)" : "var(--grey-11)", fontWeight: 600 }}>
          {a.status === "Completed" ? `Closed ${window.fmtDate(a.closedDate, "medium")}` : overdue ? `${-days}d overdue` : `Due in ${days}d`}
        </span>
      </div>

      {a.description && <Field label="Source finding (why)" value={a.description} />}
      {a.baseline && <Field label="Baseline metric" value={a.baseline} />}
      {a.targetMetric && <Field label="Target metric for closure" value={a.targetMetric} />}
      {a.intervention && <Field label="Intervention specifics" value={a.intervention} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
        <Field label="Primary owner" value={a.ownerLabel} />
        <Field label="Supporting stakeholders" value={a.stakeholders} />
        <Field label="Start date" value={window.fmtDate(a.openedDate, "medium")} />
        <Field label="Target completion" value={a.target || window.fmtDate(a.dueDate, "medium")} />
      </div>

      {a.followUp && (
        <div style={{ marginTop: 14, padding: 12, background: "var(--brand-cyan-tint)", borderLeft: "3px solid var(--brand-cyan)", borderRadius: 4 }}>
          <FieldLabel>Follow-up review schedule</FieldLabel>
          <div style={{ fontSize: 12.5, marginTop: 4, color: "var(--ink-2)", lineHeight: 1.5 }}>{a.followUp}</div>
          {a.followUpItems && <div style={{ fontSize: 12, marginTop: 8, color: "var(--ink-2)", lineHeight: 1.5 }}><strong>Items reviewed:</strong> {a.followUpItems}</div>}
        </div>
      )}

      {a.evidence && (
        <div style={{ marginTop: 14, padding: 12, background: "var(--good-tint)", borderLeft: "3px solid var(--good)", borderRadius: 4 }}>
          <FieldLabel>Evidence required for closure</FieldLabel>
          <div style={{ fontSize: 12.5, marginTop: 4, color: "var(--ink-2)", lineHeight: 1.5 }}>{a.evidence}</div>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <FieldLabel>LCME Element tagging</FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
          {a.lcme.length === 0 ? <span style={{ fontSize: 12, color: "var(--grey-7)" }}>None tagged</span> :
            a.lcme.map(l => <window.LcmeBadge key={l} id={l} />)}
        </div>
      </div>

      {a.mepos && a.mepos.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <FieldLabel>MEPO cross-reference</FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
            {a.mepos.map(m => {
              const mepo = window.EEC.mepoById[m];
              return (
                <span key={m} title={mepo?.objective} style={{
                  fontSize: 10.5, padding: "2px 7px", borderRadius: 3, fontWeight: 600,
                  background: "var(--grey-1)", color: "var(--ink-2)", border: "1px solid var(--grey-3)",
                  fontFamily: "var(--mono)",
                }}>
                  MEPO {m}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {a.closureDetermination && (
        <Field label="Closure determination" value={a.closureDetermination} />
      )}

      {a.notes && <Field label="Notes / escalation" value={a.notes} />}

      {meeting && (
        <div style={{ marginTop: 22, padding: 14, background: "var(--grey-1)", borderRadius: 8, border: "1px solid var(--grey-2)" }}>
          <FieldLabel>Originating meeting</FieldLabel>
          <div onClick={() => { window.EEC_PENDING = { meeting: meeting.id || meeting.date }; window.EEC_NAV.go("meetings"); }} style={{ cursor: "pointer", marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <window.CommitteeChip id={meeting.committee || "EEC"} size="sm" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-cyan-deep)" }}>{window.fmtDate(meeting.date, "medium")} EEC Meeting</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 22, fontSize: 11.5, color: "var(--grey-11)", fontStyle: "italic", lineHeight: 1.5 }}>
        {a.kind === "tracker"
          ? "Action item from the LCME closed-loop Action Plan Tracker (Full Curriculum Review AY 2023-24)."
          : a.kind === "cqi"
            ? "Continuous-improvement action item generated from the meeting record."
            : "Operational / communications action item generated from the meeting record."}
      </div>
    </window.Drawer>
  );
}

function FieldLabel({ children }) {
  return <div className="t-eyebrow" style={{ fontSize: 10, color: "var(--grey-11)" }}>{children}</div>;
}
function Field({ label, value }) {
  return (
    <div style={{ marginTop: 14 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>{value || "—"}</div>
    </div>
  );
}

window.EecActions = EecActions;
window.EecActionDrawer = ActionDrawer;
