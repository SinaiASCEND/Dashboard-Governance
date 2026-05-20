// eec-shared.jsx — shared visual primitives for EEC Governance Dashboard

const { useState: useStateE, useEffect: useEffectE, useMemo: useMemoE, useRef: useRefE } = React;

// ─── Committee chip ────────────────────────────────────────────────────────
function CommitteeChip({ id, size = "sm", subtle = false, onClick, active = false }) {
  const c = window.EEC.committeeById[id];
  if (!c) return null;
  const isEEC = id === "EEC";
  const pad = size === "lg" ? "5px 12px" : size === "md" ? "3px 9px" : "2px 7px";
  const fz = size === "lg" ? 12 : size === "md" ? 11.5 : 10.5;
  const bg = subtle ? "transparent" : c.tint;
  const border = subtle ? "1px solid var(--grey-3)" : `1px solid ${c.tint}`;
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: pad, fontSize: fz, fontWeight: 600,
        color: c.deep, background: active ? c.color : bg,
        border, borderRadius: 4,
        letterSpacing: "0.02em",
        cursor: onClick ? "pointer" : "default",
        ...(active ? { color: "white", borderColor: c.color } : {}),
      }}
      title={c.name}
    >
      <span style={{ width: 6, height: 6, borderRadius: 2, background: active ? "white" : c.color, flex: "0 0 6px" }} />
      {c.short}
    </span>
  );
}

// ─── Status pill (for action items) ────────────────────────────────────────
function StatusPill({ status, percent }) {
  const map = {
    "Not Started":       { bg: "var(--grey-2)",          color: "var(--grey-11)",        dot: "var(--grey-7)" },
    "Not initiated":     { bg: "var(--grey-2)",          color: "var(--grey-11)",        dot: "var(--grey-7)" },
    "In Progress":       { bg: "var(--brand-cyan-tint)", color: "var(--brand-cyan-deep)", dot: "var(--brand-cyan)" },
    "In progress":       { bg: "var(--brand-cyan-tint)", color: "var(--brand-cyan-deep)", dot: "var(--brand-cyan)" },
    "On Track":          { bg: "var(--good-tint)",       color: "var(--good)",            dot: "var(--good)" },
    "At Risk":           { bg: "var(--warn-tint)",       color: "var(--warn)",            dot: "var(--warn)" },
    "Off Track":         { bg: "var(--bad-tint)",        color: "var(--bad)",             dot: "var(--bad)" },
    "Escalated":         { bg: "var(--bad-tint)",        color: "var(--bad)",             dot: "var(--bad)" },
    "Closed":            { bg: "var(--good-tint)",       color: "var(--good)",            dot: "var(--good)" },
    "Completed":         { bg: "var(--good-tint)",       color: "var(--good)",            dot: "var(--good)" },
    "Deferred":          { bg: "var(--warn-tint)",       color: "var(--warn)",            dot: "var(--warn)" },
    "Deferred/closed":   { bg: "var(--warn-tint)",       color: "var(--warn)",            dot: "var(--warn)" },
    "Not Met":           { bg: "var(--bad-tint)",        color: "var(--bad)",             dot: "var(--bad)" },
  };
  const s = map[status] || map["Not Started"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "2px 8px", fontSize: 11, fontWeight: 600,
      color: s.color, background: s.bg, borderRadius: 4,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot, flex: "0 0 6px" }} />
      {status}
      {(status === "In Progress" || status === "In progress") && typeof percent === "number" && (
        <span style={{ opacity: 0.75, fontVariantNumeric: "tabular-nums" }}>· {percent}%</span>
      )}
    </span>
  );
}

// ─── Motion result pill ────────────────────────────────────────────────────
function MotionResult({ result, tally }) {
  const map = {
    "Approved": { bg: "var(--good-tint)", color: "var(--good)" },
    "Rejected": { bg: "var(--bad-tint)",  color: "var(--bad)" },
    "Deferred": { bg: "var(--warn-tint)", color: "var(--warn)" },
    "Modified": { bg: "var(--brand-cyan-tint)", color: "var(--brand-cyan-deep)" },
    "Pending":  { bg: "var(--grey-2)", color: "var(--grey-11)" },
  };
  const s = map[result] || map["Pending"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{
        padding: "2px 9px", fontSize: 11, fontWeight: 700,
        color: s.color, background: s.bg, borderRadius: 4,
        letterSpacing: "0.02em",
      }}>
        {result}
      </span>
      {tally && (result === "Approved" || result === "Rejected" || result === "Modified") && (
        <span style={{ fontSize: 11, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>
          {tally.y}-{tally.n}-{tally.a}
        </span>
      )}
    </span>
  );
}

// ─── LCME badge ────────────────────────────────────────────────────────────
function LcmeBadge({ id, short = false, onClick }) {
  const el = window.EEC.lcmeById[id];
  if (!el) return null;
  return (
    <span
      onClick={onClick}
      title={`LCME ${el.id} — ${el.title}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "1.5px 6px", fontSize: 10.5, fontWeight: 700,
        color: "var(--brand-violet)", background: "var(--brand-violet-tint)",
        borderRadius: 3, letterSpacing: "0.03em",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "var(--mono)",
      }}
    >
      {el.id}{short ? "" : <span style={{ opacity: 0.7, fontWeight: 500, marginLeft: 2 }}>· {el.short}</span>}
    </span>
  );
}

// ─── Member avatar ─────────────────────────────────────────────────────────
function MemberAvatar({ id, size = 28, showName = false, onClick }) {
  const mem = window.EEC.memberById[id];
  if (!mem) return null;
  const initials = mem.name.split(/\s|,/).filter(Boolean).slice(0,2).map(p => p[0]).join("").toUpperCase();
  // hash to pick a stable hue
  let h = 0; for (let i = 0; i < mem.id.length; i++) h = (h*31 + mem.id.charCodeAt(i)) & 0xffff;
  const hue = h % 360;
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        cursor: onClick ? "pointer" : "default",
      }}
      title={mem.name + " — " + mem.role}
    >
      <span style={{
        width: size, height: size, borderRadius: "50%",
        background: `oklch(0.88 0.04 ${hue})`,
        color: `oklch(0.35 0.12 ${hue})`,
        display: "grid", placeItems: "center",
        fontSize: size * 0.40, fontWeight: 700,
        letterSpacing: 0, flex: `0 0 ${size}px`,
      }}>{initials}</span>
      {showName && (
        <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{mem.name}</span>
          <span style={{ fontSize: 11, color: "var(--grey-11)" }}>{mem.role}</span>
        </span>
      )}
    </span>
  );
}

// ─── Drawer (right slide-out for details) ──────────────────────────────────
function Drawer({ open, onClose, title, eyebrow, accentColor, children, width = 540 }) {
  useEffectE(() => {
    function onKey(e) { if (e.key === "Escape" && open) onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      pointerEvents: open ? "auto" : "none",
    }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(20,20,20,0.30)",
        opacity: open ? 1 : 0,
        transition: "opacity 0.18s ease",
      }} />
      <aside style={{
        position: "absolute", right: 0, top: 0, bottom: 0,
        width, maxWidth: "92vw",
        background: "var(--paper)",
        borderLeft: "1px solid var(--grey-3)",
        boxShadow: "0 0 30px rgba(0,0,0,0.10)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.22s ease",
        display: "flex", flexDirection: "column",
      }}>
        <header style={{
          padding: "14px 22px 12px",
          borderBottom: "1px solid var(--grey-3)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14,
          borderTop: `3px solid ${accentColor || "var(--brand-violet)"}`,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            {eyebrow && (
              <div className="t-eyebrow" style={{ marginBottom: 4, color: accentColor || "var(--brand-violet)" }}>{eyebrow}</div>
            )}
            <h2 style={{ fontSize: 18, fontFamily: "var(--serif)", lineHeight: 1.25 }}>{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            border: "1px solid var(--grey-3)", background: "var(--paper)",
            width: 28, height: 28, borderRadius: 6, cursor: "pointer",
            fontSize: 14, color: "var(--grey-11)",
          }}>✕</button>
        </header>
        <div style={{ padding: "18px 22px 32px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </aside>
    </div>
  );
}

// ─── Section header with eyebrow ───────────────────────────────────────────
function SectionHead({ eyebrow, title, sub, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 18 }}>
      <div>
        {eyebrow && <div className="t-eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>}
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 28 }}>{title}</h1>
        {sub && <div style={{ fontSize: 13, color: "var(--grey-11)", marginTop: 4 }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}

// ─── Date helpers ──────────────────────────────────────────────────────────
function fmtDate(s, mode = "long") {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(+d)) return s;
  if (mode === "short") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (mode === "medium") return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}
function dayDiff(a, b) {
  const da = new Date(a), db = new Date(b);
  return Math.round((+db - +da) / 86400000);
}

// ─── Mini bar (progress) ───────────────────────────────────────────────────
function MiniBar({ percent, color = "var(--brand-cyan)", height = 5, width = "100%" }) {
  return (
    <span style={{
      display: "inline-block", width, height, background: "var(--grey-2)",
      borderRadius: 3, overflow: "hidden", verticalAlign: "middle",
    }}>
      <span style={{
        display: "block", height: "100%", width: `${Math.max(0, Math.min(100, percent))}%`,
        background: color, transition: "width .2s",
      }} />
    </span>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────
function Empty({ title, sub }) {
  return (
    <div style={{
      padding: "44px 22px", textAlign: "center",
      color: "var(--grey-11)", border: "1px dashed var(--grey-3)",
      borderRadius: 10, background: "var(--grey-1)",
    }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink-2)", marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 12.5 }}>{sub}</div>}
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────
function Card({ children, style, pad = true, className = "" }) {
  return (
    <div className={"card " + className} style={{ padding: pad ? undefined : 0, ...style }}>
      {children}
    </div>
  );
}

// ─── Search input ──────────────────────────────────────────────────────────
function SearchInput({ value, onChange, placeholder = "Search…", width = 240 }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "6px 10px", border: "1px solid var(--grey-3)",
      borderRadius: 6, background: "var(--paper)", width,
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grey-11)" strokeWidth="2">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: 0, outline: "none", fontSize: 12.5, flex: 1, background: "transparent", fontFamily: "inherit" }}
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear" style={{ border: 0, background: "transparent", color: "var(--grey-11)", cursor: "pointer", fontSize: 13 }}>✕</button>
      )}
    </div>
  );
}

Object.assign(window, {
  CommitteeChip, StatusPill, MotionResult, LcmeBadge, MemberAvatar,
  Drawer, SectionHead, MiniBar, Empty, Card, SearchInput,
  fmtDate, dayDiff,
});
