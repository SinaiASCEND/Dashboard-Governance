/* global React, Icon, LCME_DATA */
// Self-study reference pages drawn from the May 21, 2026 kickoff deck.
// Six standalone views, each routed from the home screen.

const { useState, useMemo } = React;

// ─── Shared: page hero ────────────────────────────────────────────────
const KickoffHero = ({ eyebrow, title, lead, accent = "var(--magenta)" }) => (
  <div className="kickoff-hero" style={{ "--accent": accent }}>
    <div className="kickoff-hero__eyebrow">{eyebrow}</div>
    <h1 className="kickoff-hero__title">{title}</h1>
    {lead ? <p className="kickoff-hero__lead">{lead}</p> : null}
  </div>
);

// ─── 1. About the self-study ──────────────────────────────────────────
const AboutView = ({ navigate }) => (
  <>
    <KickoffHero
      eyebrow="LCME 2027–28 Cycle"
      title="About this self-study"
      lead='"We are an institution that fundamentally embraces Continuous Quality Improvement (CQI) as our operational standard."'
      accent="var(--magenta)"
    />

    <section className="section">
      <h2 className="h-section">Key dates</h2>
      <div className="keydate-grid">
        <div className="keydate keydate--active">
          <div className="keydate__label">Kickoff event</div>
          <div className="keydate__value">May 21, 2026</div>
          <div className="keydate__sub">Steering Committee + 8 subcommittees launch the self-study.</div>
        </div>
        <div className="keydate">
          <div className="keydate__label">DCI submission due</div>
          <div className="keydate__value">Jul 12, 2027</div>
          <div className="keydate__sub">Executive Summary + DCI submitted to LCME.</div>
        </div>
        <div className="keydate keydate--accent">
          <div className="keydate__label">LCME site visit</div>
          <div className="keydate__value">Oct 18–20, 2027</div>
          <div className="keydate__sub">2.5-day peer review by 4–6 surveyors from other medical schools.</div>
        </div>
        <div className="keydate">
          <div className="keydate__label">Full accreditation cycle</div>
          <div className="keydate__value">AY 2027–28</div>
          <div className="keydate__sub">LCME issues the accreditation decision.</div>
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">The three lenses</h2>
      <p className="lead">How the task force is approaching this work.</p>
      <div className="lens-grid">
        <div className="lens lens--magenta">
          <div className="lens__icon"><Icon name="check" size={22} /></div>
          <div className="lens__name">Accreditation</div>
          <div className="lens__desc">Verify compliance with <strong>83 LCME elements</strong> across <strong>12 standards</strong>.</div>
        </div>
        <div className="lens lens--sky">
          <div className="lens__icon"><Icon name="target" size={22} /></div>
          <div className="lens__name">Reflection</div>
          <div className="lens__desc">A strategic opportunity for ISMMS to identify institutional strengths and address challenges through evidence-based analysis.</div>
        </div>
        <div className="lens lens--teal">
          <div className="lens__icon"><Icon name="users" size={22} /></div>
          <div className="lens__name">Collaboration</div>
          <div className="lens__desc">Engages the entire Sinai MD community — faculty, students, administration — in shaping the future of the MD program.</div>
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">The DCI &amp; the ISA</h2>
      <div className="grid grid--2">
        <button className="card card--hover" onClick={() => navigate("/dci")} style={{ textAlign: "left", cursor: "pointer" }}>
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <span className="resource-tile__icon" style={{ width: 36, height: 36, background: "var(--magenta)", color: "#fff" }}>
              <Icon name="book" size={18} />
            </span>
            <h3 className="h-card" style={{ flex: 1 }}>Data Collection Instrument</h3>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", textWrap: "pretty" }}>
            The institutional "Book of Truth." Data tables + narrative responses for all 83 elements,
            with required appendices: org charts, curriculum map, financial reports, outcomes data.
          </p>
          <div className="row" style={{ marginTop: 10, gap: 6 }}>
            <span className="chip chip--magenta">Open DCI 2027–28</span>
          </div>
        </button>
        <button className="card card--hover" onClick={() => navigate("/isa")} style={{ textAlign: "left", cursor: "pointer" }}>
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <span className="resource-tile__icon" style={{ width: 36, height: 36, background: "var(--sky)", color: "#fff" }}>
              <Icon name="target" size={18} />
            </span>
            <h3 className="h-card" style={{ flex: 1 }}>Independent Student Analysis</h3>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", textWrap: "pretty" }}>
            Required student survey — the most valuable dataset for capturing current student reality.
            Launches October 2026; ~9-month window to analyze, implement, and follow up.
          </p>
          <div className="row" style={{ marginTop: 10, gap: 6 }}>
            <span className="chip chip--sky">Open ISA</span>
          </div>
        </button>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">Task workload</h2>
      <div className="card">
        <div className="row" style={{ gap: 18, marginBottom: 12, flexWrap: "wrap" }}>
          <div className="stat" style={{ minWidth: 100 }}>
            <span className="stat__value">273</span>
            <span className="stat__label">Active tasks at kickoff</span>
          </div>
          <div className="stat" style={{ minWidth: 100 }}>
            <span className="stat__value">4</span>
            <span className="stat__label">Task types</span>
          </div>
          <div className="stat" style={{ minWidth: 100 }}>
            <span className="stat__value">Coda</span>
            <span className="stat__label">Single source of truth</span>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-2)", margin: "0 0 12px", textWrap: "pretty" }}>
          Strategy is <strong>front-loaded workload</strong> — most lift in the first months of the self-study phase.
          Task count is dynamic and will evolve as ISA results come in.
        </p>
        <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
          <span className="chip">Clarifying processes</span>
          <span className="chip">Providing evidence</span>
          <span className="chip">Providing procedures</span>
          <span className="chip">Reviewing DCI content</span>
        </div>
        <div className="callout callout--info" style={{ marginTop: 14 }}>
          <Icon name="info" size={16} />
          <span>Coda outputs are the <strong>exclusive authorized source</strong> for information entering the DCI.</span>
        </div>
      </div>
    </section>
  </>
);

// ─── 2. Roadmap / Timeline ────────────────────────────────────────────
const ROADMAP = [
  { date: "Sep 2025", title: "LCME/CQI committee and working groups formed",
    desc: "Began review of elements and identification of compliance gaps using data.",
    phase: "Planning", done: true },
  { date: "May 21, 2026", title: "LCME Self-Study Kickoff Event",
    desc: "Steering Committee and the 8 subcommittees launch the self-study. The work begins.",
    phase: "Planning", current: true },
  { date: "Jun 2026 – Jun 2027", title: "Self-Study Phase",
    desc: "Internal review of how the institution meets the 12 LCME standards. Subcommittees begin meeting in June.",
    phase: "Self-Study" },
  { date: "Oct 2026", title: "ISA launch and data collection",
    desc: "Most valuable dataset — captures current student reality.",
    phase: "Self-Study", accent: "var(--sky)" },
  { date: "Oct 2026 – Jun 2027", title: "Critical reflect / implement window",
    desc: "~9 months to analyze data, implement changes, and follow up with focus groups.",
    phase: "Self-Study" },
  { date: "Jul 12, 2027", title: "DCI and Executive Summary submitted",
    desc: "High-quality, evidence-based self-study submitted to LCME.",
    phase: "Submission", milestone: true, accent: "var(--magenta)" },
  { date: "Oct 18–20, 2027", title: "LCME Site Visit",
    desc: "2.5-day peer review; 4–6 surveyors meet with ISMMS members on campus and evaluate compliance.",
    phase: "Site Visit", milestone: true, accent: "var(--magenta)" },
  { date: "AY 2027–28", title: "Full accreditation cycle",
    desc: "LCME issues the accreditation decision.",
    phase: "Decision" },
];

const RoadmapView = ({ navigate }) => (
  <>
    <KickoffHero
      eyebrow="Timeline"
      title="The road to LCME excellence"
      lead="A combined Accreditation Planning Phase (Sep 2025 – Apr 2026) and Self-Study Phase (May 2026 – Jun 2027), leading to submission and the site visit in 2027."
      accent="var(--magenta)"
    />

    <ol className="roadmap">
      {ROADMAP.map((m, i) => (
        <li key={i} className={"roadmap__item"
          + (m.done ? " roadmap__item--done" : "")
          + (m.current ? " roadmap__item--current" : "")
          + (m.milestone ? " roadmap__item--milestone" : "")}>
          <div className="roadmap__rail">
            <div className="roadmap__dot" style={m.accent ? { background: m.accent, borderColor: m.accent } : undefined}>
              {m.done ? <Icon name="check" size={11} /> : null}
              {m.current ? <span className="roadmap__pulse" /> : null}
            </div>
          </div>
          <div className="roadmap__body">
            <div className="roadmap__date">{m.date}</div>
            <div className="roadmap__title">{m.title}</div>
            <p className="roadmap__desc">{m.desc}</p>
            {m.milestone ? <span className="chip chip--magenta" style={{ marginTop: 8 }}>Milestone</span> : null}
            {m.current ? <span className="chip chip--teal" style={{ marginTop: 8 }}>We are here</span> : null}
          </div>
        </li>
      ))}
    </ol>
  </>
);

// ─── 3. Leadership & responsibility layers ────────────────────────────
const LEADERS = [
  { role: "Faculty Accreditation Lead (FAL)",
    name: "David C. Thomas, MD, MHPE",
    title: "Dean for Medical Education; Chair, Leni and Peter May Department of Medical Education; Professor of Medicine, Medical Education and Rehabilitation and Human Performance, Icahn School of Medicine at Mount Sinai." },
  { role: "Self-Study Process Lead",
    name: "Jacob Shreffler, PhD",
    title: "Senior Associate Dean for Assessment, Evaluation, Accreditation." },
  { role: "Project Manager Lead",
    name: "Peter Zweig, MPA",
    title: "Program Manager, Process Improvement & Strategy." },
  { role: "Site Visit Coordinator",
    name: "Helen Ngai, MBA",
    title: "Director of Operations." },
];

const STEERING = [
  { name: "Eric J. Nestler, MD, PhD",
    role: "Steering Co-Chair",
    title: "Anne and Joel Ehrenkranz Dean; Chief Scientific Officer, Mount Sinai Health System." },
  { name: "David C. Thomas, MD, MHPE",
    role: "Steering Co-Chair",
    title: "Dean for Medical Education; Chair, Department of Medical Education." },
  { name: "Chloe Martin, MSW",
    role: "Steering Project Manager",
    title: "Project Manager for Continuous Quality Improvement." },
];

const LAYERS = [
  { name: "Steering Committee", duties: [
      "Strategic oversight of self-study process",
      "Synthesizes overarching themes",
      "Final review and approval of DCI",
    ], accent: "var(--magenta)" },
  { name: "Senior Associate Dean for AEA", duties: [
      "Educates on LCME intent",
      "Inputs verified task data into DCI",
      "Updates Steering Committee on progress",
    ], accent: "var(--magenta-2)" },
  { name: "Project Managers", duties: [
      "Maintain strict project deadlines",
      "Organize and archive all evidence",
      "Track completion of action items",
    ], accent: "var(--sky)" },
  { name: "Task Force Co-Chairs", duties: [
      "Lead all subcommittee meetings",
      "Review and edit narrative responses",
      "Work with Steering Committee",
    ], accent: "var(--sky-2)" },
  { name: "Task Force Members", duties: [
      "Review assigned LCME standards",
      "Identify institutional gaps",
      "Suggest CQI action plans",
      "Gather evidence and improve processes",
      "Be prepared for site visit Oct 18–20, 2027",
    ], accent: "var(--teal)" },
  { name: "Sinai Community", duties: [
      "Collaborate across groups",
    ], accent: "var(--navy)" },
];

const LeadershipView = ({ navigate }) => {
  const initials = (n) => n.split(/[\s,]+/).filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();
  return (
    <>
      <KickoffHero
        eyebrow="Self-study leadership"
        title="Who runs the self-study"
        lead="Faculty Accreditation Lead, Steering Committee, and the six layers of responsibility that move the work from oversight down to the broader Sinai community."
        accent="var(--magenta)"
      />

      <section className="section">
        <h2 className="h-section">Self-study leadership</h2>
        <div className="leader-grid">
          {LEADERS.map((l, i) => (
            <div key={i} className="leader-card">
              <div className="leader-card__avatar">{initials(l.name)}</div>
              <div className="leader-card__role">{l.role}</div>
              <div className="leader-card__name">{l.name}</div>
              <div className="leader-card__title">{l.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h-section">Steering Committee</h2>
        <div className="grid grid--3">
          {STEERING.map((l, i) => (
            <div key={i} className="leader-card leader-card--steering">
              <div className="leader-card__avatar leader-card__avatar--steering">{initials(l.name)}</div>
              <div className="leader-card__role">{l.role}</div>
              <div className="leader-card__name">{l.name}</div>
              <div className="leader-card__title">{l.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h-section">The six layers of responsibility</h2>
        <p className="lead">From oversight down to broad community engagement — each layer is essential.</p>
        <div className="layers">
          {LAYERS.map((l, i) => (
            <div key={i} className="layer" style={{ "--accent": l.accent }}>
              <div className="layer__num">{String(i + 1).padStart(2, "0")}</div>
              <div className="layer__body">
                <div className="layer__name">{l.name}</div>
                <ul className="layer__duties">
                  {l.duties.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

// ─── 4. All 8 subcommittees ───────────────────────────────────────────
const SUBCOMMITTEES_8 = [
  { id: "gov", name: "Institutional Governance",
    desc: "Evaluate governance structures, leadership, strategic planning, and institutional integrity.",
    coChairs: [
      { name: "Ann-Gel S. Palermo, DrPH, MPH, TIPC, ACC", title: "Senior Associate Dean for Academic Community and Culture" },
      { name: "Shema Patel", title: "Dean for Administration and Faculty Affairs" },
    ],
    pm: { name: "Chloe Martin, MSW", title: "Project Manager for Continuous Quality Improvement" },
    accent: "var(--magenta)" },
  { id: "res", name: "Resources, Enrollment & Student Health",
    desc: "Assess adequacy and equity of resources, enrollment management, and student health services.",
    coChairs: [
      { name: "Steve Paik, MD, EdM", title: "Senior Associate Dean for Student Affairs" },
      { name: "Michelle Sainté Willis", title: "Senior Associate Dean for Medical Education Administration" },
    ],
    pm: { name: "Yakhira Encarnacion-Patterson, MPH", title: "Senior Program Coordinator, Medical Student Research Office (MSRO)" },
    accent: "var(--magenta-2)" },
  { id: "adm", name: "Admissions",
    desc: "Review admissions policies, processes, and outcomes, including alignment with mission and diversity goals.",
    coChairs: [
      { name: "Talia Swartz, MD, PhD", title: "Senior Associate Dean for MD-PhD Education; Director, Medical Scientist Training Program" },
      { name: "Valerie Parkas, MD", title: "Senior Associate Dean of Admissions and Recruitment" },
    ],
    pm: { name: "Jacquelyn Chudow", title: "Associate Director of Medical School Admissions" },
    accent: "var(--sky-2)" },
  { id: "stu", name: "Student Affairs",
    desc: "Evaluate academic support, advising, wellness services, and student progression policies.",
    coChairs: [
      { name: "Lauren Linkowski, EdD", title: "Assistant Dean for Student Affairs" },
      { name: "Steve Paik, MD, EdM", title: "Senior Associate Dean for Student Affairs" },
    ],
    pm: { name: "Lindsie Whyte", title: "Associate Director for Student Life and Community Building" },
    accent: "var(--sky)" },
  { id: "fac", name: "Faculty & Residents",
    desc: "Assess faculty sufficiency, development, and resident preparation for teaching roles.",
    coChairs: [
      { name: "Mirna Mohanraj, MD", title: "Vice Chair for Strategic Community Engagement, Mount Sinai Health System" },
      { name: "Reena Karani, MD, MHPE", title: "Director, Institute of Medical Education" },
    ],
    pm: { name: "Daniel Conover", title: "Program Manager, Institute for Medical Education" },
    accent: "var(--teal)" },
  { id: "ccim", name: "Curriculum: Content & Instructional Methods (CCIM)",
    desc: "Review curriculum design, integration, and instructional approaches.",
    coChairs: [
      { name: "Rainier Soriano, MD", title: "Senior Associate Dean for Curricular Affairs" },
      { name: "Teddy Holzer, MD", title: "Director of Clinical Curriculum" },
      { name: "Staci Leisman, MD", title: "Director of Preclerkship Curriculum" },
    ],
    pm: { name: "Kenia Tavarez", title: "Program Evaluation Manager, Office of Assessment and Evaluation" },
    tracked: "CCIM",
    accent: "var(--magenta)" },
  { id: "come", name: "Curriculum: Oversight, Management & Evaluation (COME)",
    desc: "Assess curriculum governance, monitoring processes, and CQI effectiveness.",
    coChairs: [
      { name: "Rainier Soriano, MD", title: "Senior Associate Dean for Curricular Affairs" },
      { name: "Shashi Anand, MEd", title: "Associate Dean, UME Affairs" },
      { name: "Kristine Alpi, MLS, MPH, PhD", title: "Associate Dean of Libraries and Information Sciences" },
    ],
    pm: { name: "Kenia Tavarez", title: "Program Evaluation Manager, Office of Assessment and Evaluation" },
    tracked: "COME",
    accent: "var(--navy-2)" },
  { id: "oa", name: "Outcomes & Assessment (OA)",
    desc: "Evaluate assessment systems and achievement of program objectives.",
    coChairs: [
      { name: "Rainier Soriano, MD", title: "Senior Associate Dean for Curricular Affairs" },
      { name: "Ravi Ramaswamy, MD", title: "Director, Integration and Transitions Phase" },
      { name: "Christopher Strother, MD", title: "Director of Clinical Competency" },
    ],
    pm: { name: "Sadyn Angeles", title: "Program Coordinator, Office of Assessment and Evaluation" },
    tracked: "OA",
    accent: "var(--teal)" },
];

const AllSubcommitteesView = ({ navigate }) => {
  const initials = (n) => n.split(/[\s,]+/).filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();
  return (
    <>
      <KickoffHero
        eyebrow="Self-study structure"
        title="The eight subcommittees"
        lead="The full self-study is organized across 8 subcommittees, broader than the 3 curriculum-focused groups (CCIM, COME, OA) currently tracked in this dashboard."
        accent="var(--magenta)"
      />

      <div className="callout callout--info" style={{ marginBottom: 20 }}>
        <Icon name="info" size={16} />
        <span>
          The three curriculum subcommittees with active task tracking are marked
          <span className="chip chip--magenta" style={{ marginLeft: 6, marginRight: 6 }}>Tracked here</span>
          — tap them to drill in.
        </span>
      </div>

      <div className="sc8-list">
        {SUBCOMMITTEES_8.map((sc) => (
          <article key={sc.id} className="sc8-card" style={{ "--accent": sc.accent }}>
            <div className="sc8-card__head">
              <div className="sc8-card__name">{sc.name}</div>
              {sc.tracked ? (
                <button className="chip chip--magenta" onClick={() => navigate("/s/" + sc.tracked)}>
                  Tracked here <Icon name="arrowR" size={11} />
                </button>
              ) : (
                <span className="chip chip--outline">Self-study only</span>
              )}
            </div>
            <p className="sc8-card__desc">{sc.desc}</p>

            <div className="sc8-card__people">
              {sc.coChairs.map((c, i) => (
                <div key={i} className="sc8-person">
                  <div className="sc8-person__avatar">{initials(c.name)}</div>
                  <div className="sc8-person__body">
                    <div className="sc8-person__role">Co-chair</div>
                    <div className="sc8-person__name">{c.name}</div>
                    <div className="sc8-person__title">{c.title}</div>
                  </div>
                </div>
              ))}
              <div className="sc8-person sc8-person--pm">
                <div className="sc8-person__avatar sc8-person__avatar--pm">{initials(sc.pm.name)}</div>
                <div className="sc8-person__body">
                  <div className="sc8-person__role">Project Manager</div>
                  <div className="sc8-person__name">{sc.pm.name}</div>
                  <div className="sc8-person__title">{sc.pm.title}</div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

// ─── 5. Site visit ────────────────────────────────────────────────────
const SiteVisitView = ({ navigate }) => (
  <>
    <KickoffHero
      eyebrow="Oct 18–20, 2027"
      title="The LCME site visit"
      lead="A group of 4–6 peer surveyors (Deans and Faculty) from other medical schools visit for 2.5 days to verify what we submitted."
      accent="var(--magenta)"
    />

    <div className="visit-grid">
      <div className="visit-card visit-card--days">
        <div className="visit-card__big">2.5</div>
        <div className="visit-card__big-label">Days on campus</div>
      </div>
      <div className="visit-card">
        <div className="visit-card__icon"><Icon name="users" size={20} /></div>
        <div className="visit-card__num">4–6</div>
        <div className="visit-card__label">Peer surveyors</div>
        <div className="visit-card__sub">Deans &amp; faculty from other medical schools.</div>
      </div>
      <div className="visit-card">
        <div className="visit-card__icon"><Icon name="check" size={20} /></div>
        <div className="visit-card__num">12</div>
        <div className="visit-card__label">Standards verified</div>
        <div className="visit-card__sub">Across 83 elements documented in the DCI.</div>
      </div>
    </div>

    <section className="section">
      <h2 className="h-section">What surveyors are looking for</h2>
      <div className="grid grid--2">
        <div className="card">
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <span className="resource-tile__icon" style={{ width: 36, height: 36, background: "var(--magenta)", color: "#fff" }}>
              <Icon name="users" size={18} />
            </span>
            <h3 className="h-card">In-person interviews</h3>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", textWrap: "pretty" }}>
            Surveyors meet with students, faculty, and leadership across the 2.5 days.
            They are looking for <strong>consistency</strong> between what we reported
            in the DCI and what they hear from people on campus.
          </p>
        </div>
        <div className="card">
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <span className="resource-tile__icon" style={{ width: 36, height: 36, background: "var(--sky)", color: "#fff" }}>
              <Icon name="doc" size={18} />
            </span>
            <h3 className="h-card">Document verification</h3>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", textWrap: "pretty" }}>
            Verify the institution against the DCI submitted in July — narratives,
            tables, appendices, ISA results, and the supporting evidence base.
          </p>
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">How to prepare</h2>
      <ol className="prep-list">
        <li>
          <span className="prep-list__n">1</span>
          <div>
            <div className="prep-list__title">Participate in Town Halls and briefing sessions.</div>
            <div className="prep-list__sub">Live throughout the months leading up to October 2027.</div>
          </div>
        </li>
        <li>
          <span className="prep-list__n">2</span>
          <div>
            <div className="prep-list__title">Be honest and professional.</div>
            <div className="prep-list__sub">Surveyors are peers — direct, candid conversation is more useful than rehearsed talking points.</div>
          </div>
        </li>
        <li>
          <span className="prep-list__n">3</span>
          <div>
            <div className="prep-list__title">Know what was submitted in the DCI.</div>
            <div className="prep-list__sub">Familiarity with the narratives and data tables relevant to your area.</div>
          </div>
        </li>
      </ol>
      <button className="card card--cta" onClick={() => navigate("/dci")}
        style={{ marginTop: 16, textAlign: "left", cursor: "pointer", width: "100%" }}>
        <div className="row" style={{ gap: 12 }}>
          <span className="resource-tile__icon" style={{ width: 40, height: 40, background: "var(--magenta)", color: "#fff" }}>
            <Icon name="book" size={20} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="h-eyebrow">Reference</div>
            <div className="h-card">Browse the DCI 2027–28</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              12 standards · 83 elements · narratives, tables, supporting docs.
            </div>
          </div>
          <Icon name="arrowR" size={18} />
        </div>
      </button>
    </section>
  </>
);

// ─── 6. ASCEND curriculum overview ────────────────────────────────────
const PHASE_1 = [
  { block: "Foundational Block (Sem 1)",
    modules: ["POM I", "MCG", "Anatomy", "FIM", "Pathology"] },
  { block: "First Organ System Block (Sem 2)",
    modules: ["POM II", "Neuroscience", "Behavioral Science", "Cardiology", "Pulmonary Medicine", "Renal"] },
  { block: "Second Organ System Block (Sem 3)",
    modules: ["POM III", "Hematology", "Endocrinology", "GU-SRH", "Gastroenterology", "MSK"] },
];

const PHASE_2_CLERKSHIPS = [
  { n: 1, name: "Pediatrics", weeks: 6, after: "CAMP I" },
  { n: 2, name: "Psychiatry", weeks: 6, after: "CAMP II" },
  { n: 3, name: "Inpatient Medicine", weeks: 6, after: "CAMP III" },
  { n: 4, name: "Surgery–Anesthesiology", weeks: 6, after: "CAMP IV" },
  { n: 5, name: "Obstetrics & Gynecology", weeks: 6, after: "CAMP V" },
  { n: 6, name: "Neurology + Palliative Care", weeks: 6, after: "CAMP VI" },
  { n: 7, name: "Emergency Medicine + 2-wk elective", weeks: 6, after: "PEAKS II" },
];

const AOCS = [
  { code: "PCA", name: "Patient-Centered Advocacy",
    items: ["Resource-Limited Healthcare", "Global Health", "Healthcare Access", "Community Health", "Patient Communication", "Environmental & Health Factors", "Injury Prevention", "Preventive Medicine"],
    accent: "var(--magenta)" },
  { code: "SSD", name: "Scientific & Scholarly Discovery",
    items: ["AI in Medicine", "POCUS", "Biostatistics", "Research", "Literature Evaluation", "EBM", "Medical Decision-Making", "Clinical Reasoning"],
    accent: "var(--sky)" },
  { code: "LPI", name: "Leadership & Professional Identity Formation",
    items: ["Medical Education", "Longitudinal Care", "Aging & Complex Care", "Teaching", "Communication", "Teamwork / IPE"],
    accent: "var(--teal)" },
  { code: "HDS", name: "Healthcare Delivery Science",
    items: ["Healthcare Economics", "Patient Safety", "Clinical Informatics", "Emergency Preparedness", "Quality Improvement", "Public Health", "Population Health"],
    accent: "var(--magenta-2)" },
];

const COHORTS_AT_VISIT = [
  { cls: "Class of 2028", status: "Phase 3 — final year (first ASCEND graduating class)" },
  { cls: "Class of 2029", status: "Phase 2 → Transition to Phase 3" },
  { cls: "Class of 2030", status: "Phase 1 Year 2 → Phase 2 starts" },
  { cls: "Class of 2031", status: "Phase 1 Year 1 (entering)" },
];

const AscendView = ({ navigate }) => (
  <>
    <KickoffHero
      eyebrow="Curriculum context"
      title="The ASCEND curriculum"
      lead="Future-ready · patient-centered · evidence-anchored. A response to the Second Flexner Report, built to graduate physicians for the healthcare system that exists now — not the one Flexner described in 1910."
      accent="var(--magenta)"
    />

    <section className="section">
      <h2 className="h-section">The four ASCEND pillars</h2>
      <div className="pillar-grid">
        <div className="pillar pillar--1">
          <div className="pillar__num">01</div>
          <div className="pillar__name">Curricular content</div>
          <div className="pillar__tag">Integrated, clinically grounded</div>
          <p className="pillar__desc">Integration across phases · early clinical reasoning · whole-patient, community-centered · health systems science · IPE · social determinants.</p>
        </div>
        <div className="pillar pillar--2">
          <div className="pillar__num">02</div>
          <div className="pillar__name">Curricular framework</div>
          <div className="pillar__tag">Efficient, flexible, career-ready</div>
          <p className="pillar__desc">Minimizes extraneous cognitive load · flexible pace and engagement · early clinical experience · space for concentrations and career exploration.</p>
        </div>
        <div className="pillar pillar--3">
          <div className="pillar__num">03</div>
          <div className="pillar__name">Learner assessment</div>
          <div className="pillar__tag">Frequent, competency-based</div>
          <p className="pillar__desc">Frequent feedback and progression tracking · simulation and standardized patients · competency-based outcomes at the core.</p>
        </div>
        <div className="pillar pillar--4">
          <div className="pillar__num">04</div>
          <div className="pillar__name">Support &amp; resources</div>
          <div className="pillar__tag">Individualized, sustaining</div>
          <p className="pillar__desc">Individualized learning · career preparedness with compassion · wellbeing for students, faculty, and staff · faculty/staff development as a first-order priority.</p>
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">Phase-based, not year-based</h2>
      <p className="lead">Three phases progress students through foundational, core clinical, and advanced clinical learning. Phase transitions are anchored by <strong>PEAKS I, II, III</strong> — not by calendar year.</p>

      <div className="phase-strip">
        <div className="phase phase--1">
          <div className="phase__id">Phase 1</div>
          <div className="phase__name">Pre-Clerkship</div>
          <div className="phase__cap">BaseCamp · 3 blocks · PEAKS I → 6-wk Step 1 Dedicated → Transition</div>
        </div>
        <div className="phase__arrow"><Icon name="arrowR" size={18} /></div>
        <div className="phase phase--2">
          <div className="phase__id">Phase 2</div>
          <div className="phase__name">Clinical Clerkships</div>
          <div className="phase__cap">7 × 6-wk slots · CAMP cycles · PEAKS II → Transition</div>
        </div>
        <div className="phase__arrow"><Icon name="arrowR" size={18} /></div>
        <div className="phase phase--3">
          <div className="phase__id">Phase 3</div>
          <div className="phase__name">Integration &amp; Transitions</div>
          <div className="phase__cap">Chronic Care · 5 AIs · Electives + Interview Blocks · Match → T2R → Graduation</div>
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">Cohorts active at the October 2027 site visit</h2>
      <div className="cohort-grid">
        {COHORTS_AT_VISIT.map((c, i) => (
          <div key={i} className="cohort">
            <div className="cohort__cls">{c.cls}</div>
            <div className="cohort__status">{c.status}</div>
            <div className="cohort__pill">ASCEND</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12, textWrap: "pretty" }}>
        The Legacy Curriculum (Classes of 2026 and 2027) is no longer producing students at the visit but remains part of the institutional record.
      </p>
    </section>

    <section className="section">
      <h2 className="h-section">Phase 1 — Pre-Clerkship blocks</h2>
      <p className="lead">BaseCamp (1 week) opens the phase, followed by three named blocks across three semesters. POM I/II/III is the longitudinal clinical-skills spine. THINQ runs monthly; ILT half-days are unstructured curricular time.</p>
      <div className="block-grid">
        {PHASE_1.map((b, i) => (
          <div key={i} className="block">
            <div className="block__head">
              <div className="block__num">0{i+1}</div>
              <div className="block__name">{b.block}</div>
            </div>
            <div className="block__modules">
              {b.modules.map((m, j) => <span key={j} className="block__mod">{m}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 14, background: "var(--paper-2)", borderStyle: "dashed" }}>
        <div className="h-eyebrow">Closeout</div>
        <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 4 }}>
          <strong>PEAKS I</strong> (Phase 1 capstone) → 6-week Dedicated Block for Step 1 → 1-week Transition to Phase 2.
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">Phase 2 — Clinical Clerkships</h2>
      <p className="lead">Opens with the Transition to Phase 2 week. Eight clerkships across seven 6-week slots; every student completes each. CAMP cycles follow each of the first six rotations.</p>
      <ol className="clerkship-list">
        {PHASE_2_CLERKSHIPS.map(c => (
          <li key={c.n} className="clerkship">
            <div className="clerkship__n">{c.n}</div>
            <div className="clerkship__name">{c.name}</div>
            <div className="clerkship__wks">{c.weeks} wks</div>
            <div className="clerkship__arrow"><Icon name="arrowR" size={12} /></div>
            <div className="clerkship__after">{c.after}</div>
          </li>
        ))}
      </ol>
      <div className="grid grid--3" style={{ marginTop: 14 }}>
        <div className="mini-card">
          <div className="h-eyebrow">CAMP</div>
          <div className="mini-card__title">Coaching, Advising, Mentoring, Preparation</div>
          <p className="mini-card__desc">Six cycles, one after each of the first six rotations. Integrative content, scholarly progress, structured reflection.</p>
        </div>
        <div className="mini-card">
          <div className="h-eyebrow">FlexTime</div>
          <div className="mini-card__title">Truly off in Phase 2</div>
          <p className="mini-card__desc">No curricular sessions, no clinical responsibilities. Distinct from ILT (unstructured curricular schedule time).</p>
        </div>
        <div className="mini-card">
          <div className="h-eyebrow">RCEs</div>
          <div className="mini-card__title">Required Clinical Experiences</div>
          <p className="mini-card__desc">Scenarios and procedures every student must document. Aligned to LCME Element 6.2. Tracked in One45, reported via Blackboard.</p>
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">Phase 3 — Integration &amp; Transitions</h2>
      <div className="grid grid--2">
        <div className="card">
          <div className="h-eyebrow">Core requirements</div>
          <div className="h-card" style={{ marginTop: 4, marginBottom: 8 }}>Chronic Care + 5 Acting Internships</div>
          <ul className="bullet-list">
            <li><strong>Chronic Care Clerkship</strong> — 8-week longitudinal ambulatory clerkship.</li>
            <li>Acting Internships — General Surgery AI · Pediatrics AI · Medicine AI · Surgical Subspecialty AI · Emergency Medicine AI.</li>
          </ul>
        </div>
        <div className="card">
          <div className="h-eyebrow">Closeout</div>
          <div className="h-card" style={{ marginTop: 4, marginBottom: 8 }}>Electives → Match → Graduation</div>
          <ul className="bullet-list">
            <li>Multiple elective blocks with <strong>two protected Interview Blocks</strong> timed to residency interview season.</li>
            <li><strong>Transition to Residency</strong> — 2-week module after Match, immediately before Graduation.</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">Areas of Concentration (AOCs)</h2>
      <p className="lead">Threaded across the four years at various intensities. Governed by the Curriculum Integration Subcommittee. THINQ (Phase 1) consolidates AOC discussions and runs deep dives.</p>
      <div className="aoc-grid">
        {AOCS.map(a => (
          <div key={a.code} className="aoc" style={{ "--accent": a.accent }}>
            <div className="aoc__head">
              <div className="aoc__code">{a.code}</div>
              <div className="aoc__name">{a.name}</div>
            </div>
            <div className="aoc__items">
              {a.items.map((i, j) => <span key={j} className="aoc__item">{i}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <div className="h-eyebrow">Additional content-area threads</div>
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Physiology", "Artificial Intelligence", "Embryology", "Pharmacology", "Communication Skills", "Microbiology", "Medical Ethics"].map(t => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <h2 className="h-section">Governance &amp; outcomes</h2>
      <div className="grid grid--2">
        <div className="card">
          <div className="h-eyebrow">Governance</div>
          <div className="h-card" style={{ marginTop: 4, marginBottom: 8 }}>Executive Education Committee (EEC)</div>
          <p style={{ fontSize: 14, color: "var(--ink-2)", margin: "0 0 10px", textWrap: "pretty" }}>
            Principal faculty governance body, co-chaired by a Faculty Co-Chair (voting) and the Senior Associate Dean for Curricular Affairs (non-voting). Four subcommittees:
          </p>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            <span className="chip chip--magenta">PCCS · Pre-Clerkship</span>
            <span className="chip chip--magenta">CCS · Clinical Curriculum</span>
            <span className="chip chip--magenta">CIS · Curriculum Integration</span>
            <span className="chip chip--magenta">AES · Assessment &amp; Evaluation</span>
          </div>
        </div>
        <button className="card card--hover" onClick={() => navigate("/mepos")} style={{ textAlign: "left", cursor: "pointer" }}>
          <div className="h-eyebrow">Outcomes</div>
          <div className="h-card" style={{ marginTop: 4, marginBottom: 8 }}>MEPOs — 23 program objectives</div>
          <p style={{ fontSize: 14, color: "var(--ink-2)", margin: "0 0 10px", textWrap: "pretty" }}>
            What every ASCEND graduate will be able to do. Mapping appears in module reports, clerkship reports, and assessment alignment.
          </p>
          <span className="chip chip--magenta">Open all 23 MEPOs <Icon name="arrowR" size={11} /></span>
        </button>
      </div>
    </section>
  </>
);

// ─── Export ───────────────────────────────────────────────────────────
Object.assign(window, {
  AboutView, RoadmapView, LeadershipView, AllSubcommitteesView, SiteVisitView, AscendView,
});
