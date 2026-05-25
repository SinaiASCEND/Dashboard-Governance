// LCME Task Force data — members, elements, tasks, change summaries.
// Sourced from attached uploads (member rosters, task lists, DCI comparison PDF).

window.LCME_DATA = (() => {

  // ─── Subcommittees ────────────────────────────────────────────────────────
  const SUBCOMMITTEES = {
    CCIM: {
      key: "CCIM",
      name: "Curriculum: Content & Instructional Methods",
      short: "Content & Methods",
      blurb: "Owns Standard 6 (curricular design), most of Standard 7 (content), clinical supervision, and extramural electives.",
      accent: "magenta",
      coChairs: [
        { name: "Rainier Soriano", email: "rainier.soriano@mssm.edu" },
        { name: "Staci Leisman",   email: "staci.leisman@mssm.edu" },
        { name: "Teddy Holzer",    email: "horatio.holzer@mountsinai.org" },
      ],
      projectManager: { name: "Kenia Tavares", email: "kenia.tavarez@mssm.edu" },
      members: [
        { name: "Andrea Lendaris",  email: "andrea.lendaris@mssm.edu" },
        { name: "David Portnoy",    email: "david.portnoy@mountsinai.org" },
        { name: "Erik Popil",       email: "erik.popil@mssm.edu" },
        { name: "Hari Natarajan",   email: "Hariharasudan.Natarajan@mountsinai.org" },
        { name: "John D Paulsen",   email: "John.Paulsen@mountsinai.org" },
        { name: "Laura Stein",      email: "Laura.Stein@mssm.edu" },
        { name: "Maaike Vangerwen", email: "Maaike.Vangerwen@mountsinai.org" },
        { name: "Mike Herscher",    email: "michael.herscher@mountsinai.org" },
        { name: "Oren Cohen",       email: "oren.cohen@mountsinai.org" },
        { name: "Samuel Sandowski", email: "Samuel.Sandowski2@mountsinai.org" },
        { name: "Trevor Pour",      email: "trevor.pour@mountsinai.org" },
      ],
    },
    COME: {
      key: "COME",
      name: "Curriculum Oversight, Management & Evaluation",
      short: "Oversight & Mgmt",
      blurb: "Owns curricular governance, phase reviews, student feedback loops, time monitoring, and visiting/assigned student processes.",
      accent: "navy",
      coChairs: [
        { name: "Rainier Soriano", email: "rainier.soriano@mssm.edu" },
        { name: "Shashi Anand",    email: "shashi.anand@mssm.edu" },
        { name: "Kris Alpi",       email: "Kris.Alpi@mssm.edu" },
      ],
      projectManager: { name: "Kenia Tavares", email: "kenia.tavarez@mssm.edu" },
      members: [
        { name: "Eric Kutscher",     email: "Eric.Kutscher@mountsinai.org" },
        { name: "Jared Kutzin",      email: "Jared.Kutzin@mountsinai.org" },
        { name: "Katherine Chen",    email: "katherine.chen@mssm.edu" },
        { name: "Kyounghyun Lee",    email: "Kyunghyun.Lee@mountsinai.org" },
        { name: "Mercedes Perez",    email: "mercedes.perez@mssm.edu" },
        { name: "Michael Kaplan",    email: "Michael.Kaplan@mountsinai.org" },
        { name: "Michelle Francis",  email: "Michelle.Francis@mountsinai.org" },
        { name: "Nisha Chadha",      email: "nisha.chadha@mssm.edu" },
        { name: "Reham Shaaban",     email: "reham.shaaban@mssm.edu", note: "Hasn't confirmed membership" },
        { name: "Sreekala Raghavan", email: "sreekala.raghavan@mssm.edu" },
        { name: "Vasundhara Singh",  email: "Vasundhara.Singh@mountsinai.org" },
      ],
    },
    OA: {
      key: "OA",
      name: "Outcomes & Assessment",
      short: "Outcomes & Assessment",
      blurb: "Owns the assessment system, narrative & formative assessment, summative assessment, comparability, and program outcome evaluation.",
      accent: "teal",
      coChairs: [
        { name: "Rainier Soriano",       email: "rainier.soriano@mssm.edu" },
        { name: "Ravishankar Ramaswamy", email: "ravishankar.ramaswamy@mssm.edu" },
        { name: "Chris Strother",        email: "christopher.strother@mountsinai.org" },
      ],
      projectManager: { name: "Sadyn Angeles", email: "sadyn.angeles@mssm.edu" },
      members: [
        { name: "Adriana Malone",    email: "adriana.malone@mountsinai.org" },
        { name: "Bess Storch",       email: "Bess.Storch@mountsinai.org" },
        { name: "Brian Rice",        email: "Brian.Rice@mountsinai.org" },
        { name: "Deana Chieco",      email: "deanna.chieco@mssm.edu" },
        { name: "Jan Fune",          email: "Jan.Fune@mssm.edu" },
        { name: "Joanne Hojsak",     email: "joanne.hojsak@mssm.edu" },
        { name: "Joel Forman",       email: "joel.forman@mssm.edu" },
        { name: "Leona Hess",        email: "leona.hess@mssm.edu" },
        { name: "Marta Korytkowska", email: "marta.korytkowska@mssm.edu", note: "Hasn't confirmed membership" },
        { name: "Michelle Kaku",     email: "michelle.kaku@mssm.edu" },
        { name: "Rex Hermansen",     email: "Rex.Hermansen@mountsinai.org" },
        { name: "Richard Stern",     email: "Richard.Stern@mountsinai.org" },
        { name: "Robert Fallar",     email: "robert.fallar@mssm.edu" },
      ],
    },
  };

  // ─── Elements ─────────────────────────────────────────────────────────────
  // changeLevel: MAJOR | MINOR | NONE | REMOVED
  // For each element: what changed in the 2027-28 DCI vs. 2026-27, and what
  // the DCI response needs to address. Sourced from DCI_Standard_6789_Comparison.pdf.
  const ELEMENTS = [
    // ── CCIM (Standard 6, 7.1–7.5, 9.3, 11.3) ──
    {
      id: "6.0", title: "MEPO / Curriculum", subcommittee: "CCIM",
      changeLevel: "MINOR",
      changeSummary: "Academic year refs updated to 2026-27. Glossary footnote removed. Each parallel curriculum now needs its own schematic.",
      whatChanged: [
        "Academic year examples in Tables 6.0-1 and 6.0-2 updated from 2025-26 to 2026-27 throughout.",
        "Parallel curriculum data year updated from 2024-25 to 2025-26.",
        "Curriculum schematic requirement updated to 2026-27; footnote about LCME glossary definition of parallel curriculum removed.",
        "Schools with more than one parallel curriculum must provide a schematic for each — not a single combined schematic.",
      ],
      whatToAddress: [
        "Update AY references in Tables 6.0-1 and 6.0-2 to 2026-27.",
        "Update the parallel curriculum data year reference to 2025-26.",
        "Prepare a separate schematic for each parallel curriculum if more than one exists.",
      ],
    },
    {
      id: "6.1", title: "Program and Learning Objectives", subcommittee: "CCIM",
      changeLevel: "MINOR", changeFlag: "Most action-intensive element in Standard 6",
      changeSummary: "Two new narrative questions and new supporting documentation centered on EPO linkage. Table terminology shifts from 'outcome measures' to 'types of assessment'.",
      whatChanged: [
        "Table 6.1-1 instruction changes from 'outcome measure(s) used to assess attainment of each EPO' to 'types of assessment used to assess attainment of each EPO'.",
        "Column header renamed: 'Assessment Measure(s) for Each Objective' → 'Types of Assessment for Each Educational Program Objective'.",
        "Narrative (a) now also asks by what group(s) the EPOs were approved — not just the year.",
        "Narrative (d) now asks about utility 'to support their learning'.",
        "NEW Narrative (e): at least one example of how MEPOs have been used prospectively in making a curriculum content change at the course/clerkship or phase level.",
        "NEW Narrative (f): describe whether course/clerkship objectives are linked to MEPOs, the governance roles in this linkage, and how often it's reviewed.",
        "NEW Supporting documentation: one pre-clerkship course and one clerkship example showing ALL learning objectives linked to MEPO(s).",
      ],
      whatToAddress: [
        "Update Table 6.1-1 column header to 'Types of Assessment for Each Educational Program Objective' and update instructions to match.",
        "Narrative (a): add which group(s) approved the EPOs alongside the year of last review.",
        "Narrative (d): add 'to support their learning'.",
        "Narrative (e) — NEW: identify a concrete example where EPOs were consulted prospectively BEFORE a change was made (not post-hoc).",
        "Narrative (f) — NEW: describe the formal governance process for linking course/clerkship objectives to EPOs — who, when, how often.",
        "NEW: prepare one pre-clerkship course and one clerkship document showing full (not sampled) learning-objective linkage to EPOs.",
      ],
    },
    {
      id: "6.2", title: "Required Clinical Experiences", subcommittee: "CCIM",
      changeLevel: "NONE",
      changeSummary: "No changes detected from the 2026-27 DCI.",
      whatChanged: ["No element-level changes."],
      whatToAddress: ["Carry forward your 2026-27 response, updated for AY 2026-27 data."],
    },
    {
      id: "6.4", title: "Inpatient/Outpatient Experiences", subcommittee: "CCIM",
      changeLevel: "MINOR",
      changeSummary: "Footnote simplified — campus removed from parallel curriculum table instruction. 'And/or' acknowledges joint oversight bodies.",
      whatChanged: [
        "Table footnote: 'Complete a separate table for each parallel curriculum and campus' → 'If relevant, complete a separate table for each parallel curriculum'. (Campus removed.)",
        "Narrative (a): 'mechanisms used by the curriculum committee, a curriculum subcommittee, OR another authority' → 'committee, subcommittee, AND/OR another authority'.",
      ],
      whatToAddress: [
        "If you have parallel curricula, one table per parallel curriculum is now sufficient — no separate tables per campus.",
        "In narrative (a), if both a subcommittee and another authority are involved, name both.",
      ],
    },
    {
      id: "6.5", title: "Elective Opportunities", subcommittee: "CCIM",
      changeLevel: "MINOR",
      changeSummary: "Same footnote simplification as 6.4 — campus dropped from parallel curriculum table instruction.",
      whatChanged: [
        "'Complete a separate table for each parallel curriculum and campus' → 'If relevant, complete a separate table for each parallel curriculum'.",
      ],
      whatToAddress: [
        "If applicable, reduce to one table per parallel curriculum rather than per campus.",
      ],
    },
    {
      id: "6.6", title: "Service-Learning / Community Service", subcommittee: "CCIM",
      changeLevel: "MINOR",
      changeSummary: "Glossary footnote removed. Narrative (b) simplified — student participation data is no longer requested.",
      whatChanged: [
        "Footnote 'See the LCME Glossary for the definitions of service-learning and community service' — removed.",
        "Narrative (b) trimmed: previously also asked for 'school data on the level of students participation'. Second sentence removed.",
      ],
      whatToAddress: [
        "Narrative (b): describe ONLY how students are informed about opportunities. Do not include or collect participation data.",
      ],
    },
    {
      id: "6.7", title: "Academic Environments", subcommittee: "CCIM",
      changeLevel: "MINOR",
      changeSummary: "Table column header renamed from 'Program Sponsor' to 'CME Program Sponsor(s)'.",
      whatChanged: [
        "Column header: 'Program Sponsor' → 'CME Program Sponsor(s)'. Clarifies the column refers to CME sponsors specifically and allows for more than one.",
      ],
      whatToAddress: [
        "Update the column header in your Table 6.7 response to 'CME Program Sponsor(s)'.",
        "If your institution has more than one CME program sponsor, list all of them.",
      ],
    },
    {
      id: "6.8", title: "Education Program Duration", subcommittee: "CCIM",
      changeLevel: "MINOR",
      changeSummary: "Two footnote clarifications. 'Clinical clerkships' is now explicit; campus removed from parallel curriculum note.",
      whatChanged: [
        "Footnote 1: 'time for required clinical and other related activities' → 'time for required clinical CLERKSHIPS and other related activities'.",
        "Footnote 2: 'Note any differences for parallel curricula and/or campuses' → 'If relevant, note any differences for parallel curricula'. (Campuses removed.)",
      ],
      whatToAddress: [
        "No narrative changes required — these are footnote clarifications only.",
        "If noting duration differences, do so at the curriculum level, not by individual campus.",
      ],
    },
    {
      id: "7.1", title: "Foundational Medical Knowledge", subcommittee: "CCIM",
      previousTitle: "Biomedical, Behavioral, Social Sciences",
      changeLevel: "MAJOR", changeFlag: "Reframed around ACGME competencies",
      changeSummary: "GQ data is out — ISA data by organ system and discipline is in. Research education moved here from 7.3. NBME Step 1 graphs now required as supporting docs.",
      whatChanged: [
        "Element is reframed to align with the ACGME 'Foundational Medical Knowledge' competency rather than content domains.",
        "Two new tables: 7.1-1 and 7.1-2 require ISA data by organ system (12 systems) and by discipline — broken down by curriculum year.",
        "New Table 7.1-4: three learning objectives for each of four research topics (basic science, clinical, translational, application to patient care) plus assessment types. This content came from the eliminated old 7.3.",
        "NEW supporting documentation: NBME subject area performance graphs comparing national and school first-time takers for USMLE Step 1 for the past 3 years.",
        "Narrative (a) now asks you to note concerns from the ISA data and describe how you are addressing them — not just identify content gaps.",
      ],
      whatToAddress: [
        "Run and report ISA data by organ system and by discipline, broken down by curriculum year.",
        "Confirm your ISA instrument includes the new organ system and discipline items; update if not.",
        "Map your research curriculum (basic, clinical, translational, application) to 3 learning objectives each with assessment types for Table 7.1-4.",
        "Obtain and submit NBME Step 1 subject area performance comparison graphs for the past 3 years.",
        "In narrative (a), describe how you are addressing any ISA-identified concerns.",
      ],
    },
    {
      id: "7.2", title: "Patient Care", subcommittee: "CCIM",
      previousTitle: "Organ Systems / Life Cycle / Prevention / Symptoms / Signs / Differential Diagnosis, Treatment Planning",
      changeLevel: "MAJOR", changeFlag: "Substantially rewritten — AI and EBM now explicit",
      changeSummary: "Reframed around diagnosis, treatment, and clinical tools. Lifespan content moved to a table. AI and EBM explicitly required. Step 2 CK graphs and Resident Readiness Survey replace GQ tables.",
      whatChanged: [
        "Title and scope substantially rewritten — competency framing around diagnosis, treatment, and clinical tools.",
        "Lifespan content is now a table (7.2-3), not narrative: continuity, preventive, acute, chronic, rehabilitative, end-of-life care by curriculum phase.",
        "NEW Table 7.2-4: learning objectives on appropriate use of AI in disease diagnosis and management (plus room for other emerging technologies).",
        "NEW Table 7.2-5: three learning objectives each for 'Principles of EBM' and 'Application of EBM to clinical decision-making' with courses and assessment types.",
        "NEW supporting documentation: NBME Step 2 CK performance graphs (3 years) + the school's most recent Resident Readiness Survey (or equivalent).",
        "Narrative (a) now has four sub-areas: diagnosis/management, lifespan care, AI/emerging tech, and EBM.",
      ],
      whatToAddress: [
        "Map diagnosis/treatment curriculum in Tables 7.2-1 and 7.2-2 using ISA data.",
        "Complete Table 7.2-3 — lifespan care types across curriculum phases.",
        "Develop 1–2 learning objectives on AI use in diagnosis/management (Table 7.2-4).",
        "Document EBM objectives with courses and assessment types for Table 7.2-5.",
        "Obtain NBME Step 2 CK graphs and Resident Readiness Survey results.",
      ],
    },
    {
      id: "7.3", title: "Health Promotion and Health Maintenance", subcommittee: "CCIM",
      previousTitle: "Scientific Method / Clinical / Translational Research",
      changeLevel: "MAJOR", changeFlag: "Near-complete replacement",
      changeSummary: "Old research methods content moved to 7.1. Element 7.3 now covers health promotion, prevention, nutrition, and impact of societal problems on wellness.",
      whatChanged: [
        "Near-complete content replacement. Research methods content moved to Element 7.1, Table 7.1-4.",
        "Four NEW ISA-based tables (7.3-2 through 7.3-5): ISA data by curriculum year on (1) health promotion / disease prevention, (2) health maintenance, (3) nutrition across the life cycle, (4) challenges to wellness from societal problems.",
        "Societal problems now appear HERE (not 7.5). Narrative (a) requires three common societal problems with: relationship to personal wellness, phases where taught, and assessments used.",
        "Nutrition content is now explicitly required — must appear in your curriculum map.",
      ],
      whatToAddress: [
        "Complete Table 7.3-1 mapping health promotion, health maintenance, nutrition, and wellness challenges across phases.",
        "Confirm your ISA includes items on health promotion, health maintenance, nutrition, and societal wellness challenges; update if needed.",
        "Select 3 societal problems your school explicitly addresses, with phase placement and assessment methods.",
        "Confirm nutrition content appears in your curriculum map.",
      ],
    },
    {
      id: "7.4", title: "Communication and Interprofessional Collaborative Skills", subcommittee: "CCIM",
      previousTitle: "Critical Judgment / Problem-Solving Skills",
      changeLevel: "MAJOR", changeFlag: "Absorbs old 7.8 and 7.9",
      changeSummary: "Absorbs the content of the now-eliminated 7.8 (Communication) and 7.9 (IPE). Old 7.4 problem-solving content lives in the standard framing and in 7.2.",
      whatChanged: [
        "Combines communication skills and IPE under a single competency element.",
        "Table 7.4-1: three learning objectives for each of three communication topics — with patients/families, with physicians, with non-physician health professionals.",
        "Table 7.4-2 (NEW): IPE phase mapping — where students are brought together with other health professions students/practitioners for team roles, team functioning, collaborative care.",
        "Narrative (a) is now about IPE examples — one each for team roles, team functioning, collaborative care — with format, phase, disciplines, and assessment methods.",
      ],
      whatToAddress: [
        "Map 3 learning objectives for each of 3 communication topics in Table 7.4-1 with assessment types.",
        "Complete Table 7.4-2: IPE experiences by phase for team roles, team functioning, collaborative care.",
        "Prepare 3 IPE curricular examples with format, phase, disciplines, and assessment.",
        "Content previously in 7.8/7.9 belongs here — do not duplicate.",
      ],
    },
    {
      id: "7.5", title: "Professionalism", subcommittee: "CCIM",
      previousTitle: "Societal Problems",
      changeLevel: "MAJOR", changeFlag: "Consolidates ethics + cultural awareness",
      changeSummary: "Unified 'Professionalism' competency element. Absorbs medical ethics (old 7.7) and cultural awareness (old 7.6). Societal problems moved to 7.3.",
      whatChanged: [
        "Table 7.5-1 (NEW): list expected professional behaviors with phase(s) and assessment types.",
        "Table 7.5-2: three learning objectives each for biomedical ethics, ethical decision-making, ethical behavior in patient care — with assessment types.",
        "Table 7.5-3: three learning objectives each for cultural awareness/respect and incorporation of cultural awareness into patient interactions.",
        "Tables 7.5-4 and 7.5-5 (NEW ISA): student preparation to understand ethical/professional values; student preparation to care for patients from different backgrounds.",
        "Old 7.7 ethics content and old 7.6 cultural competence content moved here.",
      ],
      whatToAddress: [
        "List all expected professional behaviors with phase and assessment type mapping (Table 7.5-1).",
        "Map 3 learning objectives each for ethics topics (Table 7.5-2) and cultural awareness topics (Table 7.5-3).",
        "Confirm ISA covers the two new professionalism/cultural awareness items; update if needed.",
        "Narrative (b): describe specifically how professional/ethical breaches are identified, remediated, or referred.",
      ],
    },
    {
      id: "9.3", title: "Clinical Supervision of Medical Students", subcommittee: "CCIM",
      changeLevel: "MINOR",
      changeSummary: "One new supporting documentation requirement: the medical school policy/guidelines on student supervision in clinical settings.",
      whatChanged: [
        "NEW supporting documentation: submit a copy of the medical school policy or guidelines on medical student supervision in clinical settings.",
        "No changes to the element definition or narrative questions.",
      ],
      whatToAddress: [
        "Prepare and submit the institutional supervision policy/guidelines as supporting documentation.",
        "If supervision policy exists only inside broader GME/clerkship docs, extract or reference the relevant section.",
      ],
    },
    {
      id: "11.3", title: "Oversight of Extramural Electives", subcommittee: "CCIM",
      changeLevel: "NONE",
      changeSummary: "Not covered in the Standards 6/7/8/9 comparison brief; treat as carry-forward unless otherwise noted.",
      whatChanged: ["No element-level changes identified in the Standard 6/7/8/9 brief."],
      whatToAddress: ["Address the four task-list narratives covering review/approval, risk locations, performance assessment collection, and evaluation use."],
    },

    // ── COME (7.7, 8.x, 10.8, 10.9) ──
    {
      id: "7.7", title: "Systems-Based Practice", subcommittee: "COME",
      previousTitle: "Medical Ethics",
      changeLevel: "MAJOR", changeFlag: "New content area",
      changeSummary: "Old 7.7 medical ethics moved to 7.5. The new 7.7 covers healthcare delivery systems, health outcome disparities, cost-effective care, and patient safety.",
      whatChanged: [
        "Table 7.7-1: three required topics with 3 learning objectives each AND instructional formats AND assessment types — (1) Structure/functioning of healthcare delivery systems, (2) Determinants of disparate outcomes for individuals, (3) Determinants of disparate outcomes for communities/populations.",
        "'Resources needed to optimize outcomes' is explicitly part of the element definition.",
        "Narrative (a) is now a gap/concern analysis — deficiencies and steps taken to address them.",
        "Old 7.7 ethics content moved to 7.5.",
      ],
      whatToAddress: [
        "Map 3 learning objectives for each of the 3 SBP topics in Table 7.7-1 with BOTH instructional formats and assessment types.",
        "Cover health disparities at individual AND community/population level.",
        "Include resources needed to optimize health outcomes.",
        "Narrative (a): identify and address any gaps — review your curriculum map for coverage.",
      ],
    },
    {
      id: "8.1", title: "Curricular Management", subcommittee: "COME",
      changeLevel: "MINOR", changeFlag: "Committee composition tightened",
      changeSummary: "Curriculum committee definition strengthened — new faculty composition and voting requirements made explicit.",
      whatChanged: [
        "Element definition adds 'standing faculty committee' — must be permanent, not ad hoc.",
        "'Authority AND responsibility' (was just 'responsibility'): committee must have formal authority over the curriculum.",
        "'Majority of voting members overall AND AT EACH MEETING must be faculty with medical school appointments'.",
        "'At least one member from the category defined as general faculty' — bylaws must define and seat 'general faculty'.",
        "Narrative (b): 'general faculty from basic science or clinical departments' added as a membership-category example.",
        "Supporting docs: hard copies now available 'at the request of the survey team secretary' rather than automatically.",
      ],
      whatToAddress: [
        "Confirm bylaws explicitly grant the committee AUTHORITY (not just responsibility) over curriculum.",
        "Verify faculty constitute a voting majority overall AND at every quorum meeting.",
        "Confirm bylaws define a 'general faculty' category with at least one voting seat.",
        "Narrative (b): distinguish 'general faculty' from faculty in leadership roles (CDs/CKDs).",
        "Prepare hard copies of minutes — submit only if requested by survey team secretary.",
      ],
    },
    {
      id: "8.3", title: "Curricular Design, Review, Revision, Content Monitoring", subcommittee: "COME",
      changeLevel: "MINOR",
      changeSummary: "Wording clarifications adding specificity. No tables or structural changes.",
      whatChanged: [
        "Narrative (a) now includes 'including preparing students for the next phase of their training'.",
        "Narrative (a), item 1: 'specific data and information sources' — vague references to 'data' now insufficient.",
        "Narrative (a), item 3 renumbered (formatting only).",
        "Narrative (d): 'linkage of … objectives AND EPOs' → 'linkage of … objectives TO EPOs'. Grammar fix.",
      ],
      whatToAddress: [
        "In narrative (a), explicitly address how each phase review evaluates preparation for the next phase.",
        "Name specific data instruments and sources — replace general process descriptions.",
        "Narrative (d): confirm your two examples show EPO-to-course-objective linkage reviews.",
      ],
    },
    {
      id: "8.5", title: "Medical Student Feedback", subcommittee: "COME",
      changeLevel: "MINOR",
      changeSummary: "Institutional language updated. Two narrative questions reframed to emphasize tangible actions and structured data.",
      whatChanged: [
        "Element definition: 'medical school' → 'medical education program'.",
        "Narrative (c): focus shifts to 'actions taken or not taken on courses and clerkships based on their input' — emphasize curricular actions, not just communication.",
        "Narrative (d): 'Discuss data from the ISA' → 'Summarize the data from the ISA' — implies structured presentation with percentages.",
      ],
      whatToAddress: [
        "Narrative (c): describe specific changes made to courses or clerkships in response to feedback.",
        "Narrative (d): present ISA data as a structured summary with specific numbers and trends.",
      ],
    },
    {
      id: "8.8", title: "Monitoring Student Time", subcommittee: "COME",
      changeLevel: "MINOR",
      changeSummary: "Element definition updated. Two tables renamed. Narrative (g) now requires both mechanism and frequency.",
      whatChanged: [
        "Element definition: 'medical school faculty committee' → 'faculty committee'; 'program's administration' → 'education program's administration'.",
        "Table 8.8-2a → Table 8.8-2 (pre-clerkship workload).",
        "Table 8.8-2b → Table 8.8-3 (clerkship workload).",
        "Narrative (g): now requires HOW the committee monitors AND the frequency — describing only frequency is insufficient.",
      ],
      whatToAddress: [
        "Update table references: 8.8-2a → 8.8-2; 8.8-2b → 8.8-3.",
        "Narrative (g): describe both the monitoring mechanism (how) and how often it occurs.",
      ],
    },
    {
      id: "10.8", title: "Visiting Students", subcommittee: "COME",
      changeLevel: "NONE",
      changeSummary: "Not covered in the Standards 6/7/8/9 comparison brief; treat as carry-forward narrative review.",
      whatChanged: ["No element-level changes identified in the Standard 6/7/8/9 brief."],
      whatToAddress: ["Review current state of DCI narrative and provide feedback to the LCME core team for the next draft."],
    },
    {
      id: "10.9", title: "Student Assignment", subcommittee: "COME",
      changeLevel: "NONE",
      changeSummary: "Not covered in the Standards 6/7/8/9 comparison brief; treat as carry-forward.",
      whatChanged: ["No element-level changes identified in the Standard 6/7/8/9 brief."],
      whatToAddress: ["Review DCI narrative and confirm whether the assignment procedures are codified in formal guidelines."],
    },

    // ── OA (7.6, 8.4, 8.6, 8.7, 9.x) ──
    {
      id: "7.6", title: "Practice-Based Learning and Improvement", subcommittee: "OA",
      previousTitle: "Structural Competence, Cultural Competence and Health Inequities",
      changeLevel: "MAJOR", changeFlag: "Absorbs SDL content from eliminated 6.3",
      changeSummary: "Reorganized. Cultural competence → 7.5. Health disparities → 7.7. 7.6 now covers Practice-Based Learning and Improvement, including self-directed learning content previously in the eliminated Element 6.3.",
      whatChanged: [
        "LCME's specific definition of self-directed learning applies: (1) independent self-assessment of learning needs, (2) independent identification/analysis/synthesis of information, (3) independent self-assessment of source credibility, (4) facilitator assessment and feedback — all in a unified sequence over a short time period.",
        "Table 7.6-1: ISA data on whether 'the curriculum provides practice in the skills of self-directed learning as defined by the LCME'.",
        "Table 7.6-2: ISA data on whether 'the curriculum prepared me to use the skills of self-directed learning in the clerkships'.",
        "NEW supporting documentation: sample form used to assess the development of students' self-directed learning skills.",
      ],
      whatToAddress: [
        "Identify a specific learning activity that meets ALL FOUR LCME SDL components in a unified sequence — this is the core of narrative (a).",
        "Each of the four SDL components must be explicitly named and described.",
        "Narrative (b): describe how students recognize strengths, deficiencies, and limitations in their professional development.",
        "Submit a sample SDL assessment form.",
        "Do not include cultural/structural competence content here — moved to 7.5 and 7.7.",
      ],
    },
    {
      id: "8.4", title: "Evaluation of Educational Program Outcomes", subcommittee: "OA",
      changeLevel: "MAJOR",
      changeSummary: "National Norms thresholds updated to rolling national averages. NBME graphs moved out to 7.1/7.2. Table column renamed.",
      whatChanged: [
        "Threshold language replaced fixed benchmarks with rolling national averages: Step 1 first-time pass rate 10% below the 2-year national first-time average; Step 2 CK pass rate 10% below the 2-year national first-time average; attrition ≥5%/year in each of the last two years (national average reference removed); Match rate 10 points below the 2-year national average.",
        "NBME Step 1 / Step 2 CK subject area performance graphs are REMOVED from 8.4 supporting documentation — they now live in 7.1 and 7.2.",
        "Table 8.4-1: first column header renamed from 'Outcome Indicator' to 'Program Outcome Indicator'.",
        "Narrative (a): now says 'all the EPOs' (added 'all'). Narrative (c): lowercases 'national norms of accomplishment'.",
      ],
      whatToAddress: [
        "Update outcome threshold tracking to rolling national averages — know your current national averages for Step 1, Step 2 CK, and Match.",
        "Do NOT include NBME Step 1 or Step 2 CK graphs in 8.4 supporting docs — they now belong in 7.1 and 7.2.",
        "Narrative (a): confirm EPO evaluation covers ALL EPOs, not just a sample.",
        "Update Table 8.4-1 first column header to 'Program Outcome Indicator'.",
      ],
    },
    {
      id: "8.6", title: "Monitoring Completion of Required Clinical Experiences", subcommittee: "OA",
      changeLevel: "MINOR",
      changeSummary: "Two minor narrative clarifications around logging description and alternate-method benchmarks.",
      whatChanged: [
        "Narrative (a): the phrase 'Note whether there is a centralized tool for logging or there are logging processes/tools at the departmental level' has been removed.",
        "Narrative (e): '>20% of cases' reframed as 'the school has set more than 20% of cases in aggregate or at a particular site as its benchmark' — your internal threshold is what LCME evaluates against.",
      ],
      whatToAddress: [
        "Narrative (a): describe how students log encounters and skills — no need to distinguish centralized vs. departmental.",
        "Narrative (e): reference your school-set benchmark for alternate methods (whether 20% or another threshold).",
      ],
    },
    {
      id: "8.7", title: "Comparability of Education / Assessment", subcommittee: "OA",
      changeLevel: "MAJOR", changeFlag: "Table 8.7-1 eliminated; narratives restructured",
      changeSummary: "Supporting data table eliminated. Narrative questions restructured from 3 to 5 with different content. Comparability action examples must now reference student perception data.",
      whatChanged: [
        "Table 8.7-1 ('Actions to Support Comparability') has been ELIMINATED.",
        "Narratives restructured 3 → 5. New (a): how learning objectives, assessment methods, and required clinical experiences are communicated to faculty/residents at each site. (b) takes the substance of old (a). (c) — NEW: how clerkship/site directors receive site-specific student performance and perception data. (d) takes the substance of old (b). (e) — comparability action example must explicitly reference 'students' perceptions of clerkship quality' alongside completion and performance.",
        "Element definition: 'medical school' → 'medical education program'.",
      ],
      whatToAddress: [
        "Do NOT complete Table 8.7-1 — it no longer exists.",
        "New narrative (a): describe communication of LOs, assessments, and required experiences to site faculty and residents.",
        "New narrative (c): describe how site/clerkship directors receive site-specific student performance and perception data.",
        "Narrative (e): comparability action example must reference student perception data, not just completion/grades.",
        "Re-map your old 3-question response into the new 5-question structure (old a→new b, old b→new d, old c→new e).",
      ],
    },
    {
      id: "9.0", title: "Teaching, Supervision, Assessment, and Student & Patient Safety", subcommittee: "OA",
      changeLevel: "NONE",
      changeSummary: "Standard-level: no structural changes. Tasks focus on completing the two 9.0 tables for AY 26-27.",
      whatChanged: ["No standard-level structural changes."],
      whatToAddress: ["Complete Tables 9.0-1 and 9.0-2 to reflect current state as of 06/2027."],
    },
    {
      id: "9.4", title: "Assessment System", subcommittee: "OA",
      changeLevel: "MAJOR", changeFlag: "GQ data out — internal data in",
      changeSummary: "GQ-based tables replaced with ISA and internal-survey data. Tables doubled from 2 to 4. Narrative (a) now explicitly requires formative AND summative assessment description.",
      whatChanged: [
        "All Graduation Questionnaire (GQ) data REMOVED from 9.4.",
        "Table 9.4-1 (rebuilt): types of assessment used for each pre-clerkship clinical skill (history-taking, physical examination, differential diagnosis).",
        "Table 9.4-2 (rebuilt): ISA data by curriculum year on 'I receive adequate clinical skills instruction in the pre-clerkship phase'.",
        "Table 9.4-3 (NEW): internal clerkship evaluation data on % observed performing H&P in each required clerkship.",
        "Table 9.4-4 (NEW): internal final-year survey on % who acquired clinical skills required to begin residency.",
        "Narrative (a) now explicitly requires both 'formative and summative' clinical skills assessment in the pre-clerkship phase.",
        "Narrative (b): minor punctuation fix.",
      ],
      whatToAddress: [
        "Remove all GQ data from 9.4 — not requested anywhere.",
        "Table 9.4-1: map pre-clerkship clinical skills to types of assessment.",
        "Table 9.4-2: pull ISA data by curriculum year for the pre-clerkship clinical skills instruction item.",
        "Table 9.4-3: pull internal clerkship evaluation data on observation rates for H&P.",
        "Table 9.4-4: prepare/adapt the final-year internal survey to include the residency-readiness clinical skills item.",
        "Narrative (a): explicitly address formative AND summative assessment in the pre-clerkship phase.",
      ],
    },
    {
      id: "9.5", title: "Narrative Assessment", subcommittee: "OA",
      changeLevel: "MINOR",
      changeSummary: "Narrative (a) reframed around how circumstances are defined and enforced. New (c) confirms clerkship-by-clerkship compliance. Sample policy is out — full policy required.",
      whatChanged: [
        "Narrative (a) reframed: 'How does the medical school ensure they have DEFINED THE CIRCUMSTANCES in which narrative descriptions will be provided? How does the school ensure they are provided?' (Policy summarization removed.)",
        "NEW Narrative (c): 'Note if narrative descriptions of performance have been provided in each required clerkship.'",
        "Supporting doc: 'Sample requirements' → 'Requirements' (full policy document, not a sample/excerpt).",
      ],
      whatToAddress: [
        "Narrative (a): frame around how the school ensures circumstances are defined and enforced.",
        "Narrative (c) — NEW: confirm narrative descriptions are provided in each required clerkship; note gaps if any.",
        "Supporting documentation: submit the full policy/guideline, not a sample.",
      ],
    },
    {
      id: "9.6", title: "Setting Standards of Achievement", subcommittee: "OA",
      changeLevel: "MINOR",
      changeSummary: "Punctuation correction only (period added at end of item 2 in element definition). No substantive change.",
      whatChanged: ["Punctuation correction only."],
      whatToAddress: ["No changes required to your response."],
    },
    {
      id: "9.7", title: "Formative Assessment and Feedback", subcommittee: "OA",
      changeLevel: "MAJOR", changeFlag: "All ISA tables renumbered; campus data now required",
      changeSummary: "Pre-clerkship formative feedback table moved to front. All ISA tables renumbered. Campus-level data required for multi-campus schools. Narrative (a) no longer requires governance framing.",
      whatChanged: [
        "Old 9.7-1 (mid-clerkship) → new 9.7-2. Old 9.7-2 (pre-clerkship formative) → new 9.7-1 (now first).",
        "Old 9.7-3a/3b/3c/3d → new 9.7-3 through 9.7-6. Campus-level data now required for each.",
        "ISA item wording trimmed in two items (Tables 9.7-3 and 9.7-4): 'of the medical education program' and 'as I progress through this phase of the curriculum' removed.",
        "Narrative (a): no longer requires the governance process to be the mechanism — describes how the school ensures feedback, with policy optional.",
        "Supporting doc: 'Any curriculum committee-approved policy or guideline…' → 'The formally approved policy or guideline…IF AVAILABLE.'",
      ],
      whatToAddress: [
        "Update table numbering: old 9.7-1 → 9.7-2; old 9.7-2 → 9.7-1; old 9.7-3a–3d → 9.7-3 through 9.7-6.",
        "If your school has regional campuses, break out ISA data by campus in Tables 9.7-3 through 9.7-6.",
        "Verify ISA instrument wording matches the new (trimmed) item language.",
        "Narrative (a): describe how the school ensures feedback — via policy, process, or monitoring.",
        "Supporting doc: submit policy if it exists; if not, explain the process in narrative (a).",
      ],
    },
    {
      id: "9.8", title: "Fair and Timely Summative Assessment", subcommittee: "OA",
      changeLevel: "MINOR",
      changeSummary: "AY references rolled forward. Campus-level ISA data now required (multi-campus). Table 9.8-2 ISA item tightened to course level.",
      whatChanged: [
        "AY columns updated: 2023-24/2024-25/2025-26 → 2024-25/2025-26/2026-27.",
        "Table 9.8-2 item: 'Pre-clerkship summative assessments are pertinent to the course objectives… of this phase of the medical education program' → 'Pre-clerkship COURSE summative assessments are pertinent to the course objectives and content taught in THAT COURSE'. (Course-level framing.)",
        "ISA tables: campus-level data now required when school has regional campuses.",
        "Narrative (b): AY 2025-26 → AY 2026-27.",
        "Narrative (d): 'assessments matched/did not match the pre-clerkship course learning objectives' → '…the learning objectives' (now applies to all phases).",
      ],
      whatToAddress: [
        "Update AY references throughout to 2024-25 through 2026-27.",
        "Provide campus-level ISA data in all applicable 9.8 tables if you have regional campuses.",
        "Confirm ISA wording matches Table 9.8-2's tightened (course-level) item.",
        "Update narrative (b) AY reference to 2026-27.",
      ],
    },
  ];

  // ─── Tasks ───────────────────────────────────────────────────────────────
  // Excel serial → ISO date helper
  function excelSerialToISO(serial) {
    if (!serial) return null;
    const n = Number(serial); if (!Number.isFinite(n)) return null;
    const ms = (n - 25569) * 86400000;
    const d = new Date(ms);
    return d.toISOString().slice(0, 10);
  }

  const RAW_TASKS = [
    // ── CCIM ──
    ["6.1-T1","CCIM","6.1","DCI Table","Overhaul the assessment map with focus of type of assessment.",46234],
    ["6.1-T2","CCIM","6.1","Process","Confirm that assessment data exists in a central place and describe where for each assessment that is listed in the revised assessment map to ensure we can review EPO assessment performance data",46234],
    ["6.1-T3","CCIM","6.1","Process","Provide list of any gaps in assessment methods for EPO and plan to address",46234],
    ["6.1-T4","CCIM","6.1","Appendix","Provide the mapping of the Sinai EPOs to the AAMC competencies",46234],
    ["6.1-T5","CCIM","6.1","Process","Better describe the process: 'The MEPOs are scheduled for ongoing review as part of the curriculum evaluation cycle and are referenced in program, phase, and module evaluation.' Provide examples.",46234],
    ["6.1-T6","CCIM","6.1","Appendix","Provide the attestation rates for course and clerkship directors that they received the MEPOs.",46234],
    ["6.1-T7","CCIM","6.1","Process","'Residents receive learning objectives through clerkship directors, coordinators, and site leadership, who ensure dissemination at all clinical sites.' Confirm we do not have a systematic way and that it's left up to the sites? Need a strategy of how we explain this and a table of which sites do what.",46234],
    ["6.1-T8","CCIM","6.1","Appendix","Provide evidence from meeting minutes: 'The relevant subcommittees of the EEC review dissemination practices annually to ensure consistency across all modules, clerkships, and clinical sites.'",46234],
    ["6.1-T9","CCIM","6.1","Appendix","Provide meeting minutes demonstrating: 'These findings are reviewed by the EEC as part of ongoing monitoring of the clarity and utility of the MEPOs.'",46234],
    ["6.1-T10","CCIM","6.1","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback to the LCME core team for the next draft.",46234],
    ["6.0-T1","CCIM","6.0","Appendix","Provide a schematic or diagram that illustrates the structure of the curriculum for the 2026-27 academic year.",46234],
    ["6.0-T2","CCIM","6.0","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback to be embedded into next draft.",46234],
    ["6.0-T3","CCIM","6.0","DCI Table","Complete 6.0-1 to be reflective of 26-27 AY.",46234],
    ["6.0-T4","CCIM","6.0","DCI Table","Complete 6.0-2 to be reflective of 26-27 AY.",46234],
    ["6.2-T1","CCIM","6.2","Process","Provide evidence that clerkship directors reviewed list from 6.2.1 and how they determined student level of responsibility (from meeting minutes).",46234],
    ["6.2-T2","CCIM","6.2","Appendix","'In AY 2026-2027, there were no RCEs that exceeded 5% reliance on alternatives.' For 26-27 provide data for each RCE completion: real vs. alternative.",46234],
    ["6.2-T3","CCIM","6.2","Appendix","Provide example — Clerkship Information Sheet (CIS).",46234],
    ["6.2-T4","CCIM","6.2","Appendix","'Prior to starting each clerkship, students attest to viewing a Clerkship Essentials video.' Provide evidence of 100% attestation rate.",46234],
    ["6.2-T5","CCIM","6.2","Appendix","Provide evidence of 'faculty development sessions led by clerkship directors'.",46234],
    ["6.2-T6","CCIM","6.2","Appendix","Provide evidence: 'The CCS of the EEC reviews dissemination practices annually to ensure that students, faculty, and residents are consistently informed of required clinical encounters and skills, as well as the expected level of student responsibility, across all clerkships and clinical sites.'",46234],
    ["6.2-T7","CCIM","6.2","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["6.4-T1","CCIM","6.4","Appendix","Provide evidence that review on inpatient/outpatient experiences occurs in curricular governance and the data and information used in these reviews.",46234],
    ["6.4-T2","CCIM","6.4","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["6.5-T1","CCIM","6.5","Appendix","Provide the charge of the Electives Working Group and excerpts from minutes that show its impact.",46234],
    ["6.5-T2","CCIM","6.5","Appendix","Provide evidence: 'Annual reports generated by OCA, incorporating enrollment data, utilization patterns, and NRMP match outcomes, inform decisions regarding expansion or modification of offerings…'",46234],
    ["6.5-T3","CCIM","6.5","Appendix","Provide evidence: 'The Director continually monitors enrollment patterns, tracks individual student progress toward elective requirements, and conducts targeted outreach…' How is this monitored, what is tracked?",46234],
    ["6.5-T4","CCIM","6.5","Appendix","Provide evidence: 'Annual elective evaluation reports are disseminated to elective directors, and electives identified as underperforming receive targeted recommendations and support for improvement.'",46234],
    ["6.5-T5","CCIM","6.5","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["6.6-T1","CCIM","6.6","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["6.7-T1","CCIM","6.7","Appendix","Work with Office of Assessment, Evaluation and Accreditation to complete and submit 6.7-1 table.",46234],
    ["6.7-T2","CCIM","6.7","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["6.8-T1","CCIM","6.8","Appendix","Complete and submit table 6.8-1 to be reflective of current state as of 06/2027.",46234],
    ["7.1-T1","CCIM","7.1","Appendix","Complete and provide 7.1-1 table. Work with OAE for types of assessment. Ensure data are easily reportable in electronic format.",46234],
    ["7.1-T2","CCIM","7.1","Process","Obtain NBME copies that compare subject area performance of national and medical school first-time takers for USMLE Step 1 for the past three years. Review as task force and note any concerns.",46234],
    ["7.2-T1","CCIM","7.2","Appendix","Complete and provide 7.2-4 table (AI / emerging technology learning objectives). Ensure data are easily reportable in electronic format.",46234],
    ["7.2-T2","CCIM","7.2","Appendix","Complete and provide 7.2-5 table (EBM learning objectives).",46234],
    ["7.2-T3","CCIM","7.2","Appendix","Complete and provide 7.2-3 table (lifespan care across phases) to be reflective of current state as of 06/2027.",46234],
    ["7.2-T4","CCIM","7.2","Process","Review internal exam results data as it relates to 7.2 content. Note any concerns to be addressed.",46234],
    ["7.2-T5","CCIM","7.2","Process","Obtain NBME copies comparing subject area performance for USMLE Step 2 CK for past three years. Review and note concerns.",46234],
    ["7.2-T6","CCIM","7.2","Process","Obtain copies of Resident Readiness Survey. Note strengths and opportunities for improvement.",46234],
    ["7.3-T1","CCIM","7.3","Appendix","Complete and provide 7.3-1 table (health promotion/maintenance, nutrition, wellness across phases) to be reflective of current state as of 06/2027.",46234],
    ["7.3-T2","CCIM","7.3","Process","Outline process for narrative response: ensure appropriate phase coverage and clear assessments (with accessible data) for each example.",46234],
    ["7.4-T1","CCIM","7.4","Appendix","Complete and provide 7.4-2 table (IPE phase mapping) to be reflective of current state as of 06/2027.",46234],
    ["7.4-T2","CCIM","7.4","Appendix","Complete and provide 7.4-1 table (communication learning objectives + assessment types).",46234],
    ["7.4-T3","CCIM","7.4","Process","Outline process for narrative response: ensure appropriate phase coverage and clear assessments for each example.",46234],
    ["7.5-T1","CCIM","7.5","Appendix","Complete and provide 7.5-1 table (professional behaviors with phases and assessment types).",46234],
    ["7.5-T2","CCIM","7.5","Appendix","Complete and provide 7.5-3 table (cultural awareness learning objectives + assessment types).",46234],
    ["7.5-T3","CCIM","7.5","DCI Table","Review 7.5-2 table for accuracy (current state as of 06/2027) and provide feedback/changes.",46234],
    ["7.5-T4","CCIM","7.5","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["7.5-T5","CCIM","7.5","Appendix","Provide evidence (meeting minutes): 'In response to the M1 gap identified in the ISA, the EEC and its PCCS have initiated a review of Phase 1 learning activities to enhance the visibility and early integration of bias, structural competence, and health equity instruction.'",46234],
    ["9.3-T1","CCIM","9.3","Appendix","Provide evidence that we ensure faculty with supervisory responsibilities are informed of the expectations for supervision. Attestation rates? What evidence exists to confirm.",46234],
    ["9.3-T2","CCIM","9.3","Appendix","Provide the supervision policy noted in the DCI narrative. Have task force review the policy and note if any changes are needed.",46234],
    ["9.3-T3","CCIM","9.3","Appendix","Provide evidence from meeting minutes that student concerns with clinical supervision data are reviewed and acted upon.",46234],
    ["9.3-T4","CCIM","9.3","Appendix","Provide evidence: 'Deans review quarterly data and refer issues to CDs or Chairs.'",46234],
    ["11.3-T1","CCIM","11.3","Process","Describe how and by whom extramural electives are reviewed and approved prior to being made available for student enrollment.",46234],
    ["11.3-T2","CCIM","11.3","Process","Describe how the medical school evaluates and acts on review of electives at locations where there is potential risk to medical student and patient safety.",46234],
    ["11.3-T3","CCIM","11.3","Process","Describe the system for collecting performance assessments of the school's medical students who engage in extramural electives.",46234],
    ["11.3-T4","CCIM","11.3","Process","Describe the system for collecting evaluations of external electives from the school's medical students. How are evaluation data used? How are they made available to students considering their elective options?",46203],

    // ── COME ──
    ["7.7-T1","COME","7.7","Appendix","Complete and provide 7.7-1 table (SBP learning objectives + instructional formats + assessment types).",46234],
    ["8.1-T1","COME","8.1","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft; ensure accuracy of what will be current as of 06/2027.",46234],
    ["8.1-T2","COME","8.1","Appendix","Provide approved bylaws and procedure documents for the EEC and its subcommittees.",46234],
    ["8.1-T3","COME","8.1","Appendix","Provide curriculum meetings from 25-26 AY in a standardized template that we will use for 26-27 meeting minutes.",46248],
    ["8.3-T1","COME","8.3","Process","Outline plans for spring 2027 phase review and all future iterations of phase and program reviews — when they occur, what data is used, how outcomes are monitored.",46248],
    ["8.3-T2","COME","8.3","Process","Provide an update on the current state of the curriculum map, and outline plans to be completed by October 2027.",46234],
    ["8.3-T3","COME","8.3","Appendix","Provide the results of a search of the curriculum database that identifies content in nutrition as it relates to diabetes.",46234],
    ["8.3-T4","COME","8.3","Process","Clarify process of how we evaluate the horizontal and vertical integration of curriculum content.",46234],
    ["8.5-T1","COME","8.5","Appendix","Provide a list of all changes that have occurred over the past academic year tied to students providing feedback. Note where the feedback occurred and how actions were monitored as a result.",46234],
    ["8.5-T2","COME","8.5","Appendix","Provide examples of the 'You said, we did' presentations.",46234],
    ["8.5-T3","COME","8.5","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["8.8-T1","COME","8.8","Appendix","Provide evidence: 'LEGACY: Students report violations via anonymous end-of-clerkship evaluations; data are reviewed quarterly by CCS and reported annually to the EEC.'",46234],
    ["8.8-T2","COME","8.8","Appendix","Provide the policy that outlines student work hours, including how hours of scheduled vs unscheduled time is defined, and CQI for monitoring student work hours.",46234],
    ["8.8-T3","COME","8.8","Appendix","Provide evidence: 'Aggregation/review: The Office of Assessment and Evaluation summarizes responses by clerkship and site quarterly… provided to the CCS for review and action.'",46234],
    ["8.8-T4","COME","8.8","Appendix","Provide sample weekly schedule(s) in the pre-clerkship phase of the curriculum illustrating the amount of unscheduled time in the week(s) to be accurate as of 06/2027.",46234],
    ["8.8-T5","COME","8.8","Appendix","Provide policy relating to duty hours for medical students during the clerkship phase, including on-call requirements for clinical rotations.",46234],
    ["8.8-T6","COME","8.8","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["10.8-T1","COME","10.8","Process","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["10.9-T1","COME","10.9","Process","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["10.9-T2","COME","10.9","Process","Note if the procedures are codified in formal guidelines for this student assignment processes.",46234],

    // ── OA ──
    ["7.6-T1","OA","7.6","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["7.6-T2","OA","7.6","Appendix","Provide sample form used in the assessment of the development of medical students self-directed learning skills.",46234],
    ["8.4-T1","OA","8.4","Appendix","Provide meeting minutes and specific examples of how any of the data listed in 8.4 table is reviewed, and what decisions or actions resulted from these reviews.",46234],
    ["8.4-T2","OA","8.4","Process","Enhance MEPO assessment map: for each MEPO describe what UNIQUE assessment tells us whether or not a student has achieved that MEPO and where the data exists. Note remaining work.",46234],
    ["8.4-T3","OA","8.4","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["8.6-T1","OA","8.6","Appendix","Provide evidence that all students completed all required clinical experiences for all clerkships during the 25-26 AY.",46234],
    ["8.6-T2","OA","8.6","Appendix","Provide evidence: 'aggregate reports of RCE completion for the academic year are reviewed by the CCS as part of its CQI oversight of the clerkship phase.'",46234],
    ["8.6-T3","OA","8.6","Appendix","Provide example of the annual report: 'At the program level, the Office of Assessment and Evaluation generates an annual report of aggregate compliance.'",46234],
    ["8.6-T4","OA","8.6","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["8.7-T1","OA","8.7","Appendix","'The OAE uses a centrally defined core set of indicators to monitor site comparability.' Provide examples of this being reviewed, with resulting decisions and actions.",46234],
    ["8.7-T2","OA","8.7","Process","'The OAE uses a centrally defined core set of indicators…' Provide how criteria for success were determined.",46234],
    ["8.7-T3","OA","8.7","Process","Describe if and how the site comparability report is shared. Who receives it? When is it presented?",46234],
    ["8.7-T4","OA","8.7","Appendix","Provide examples: 'Site Directors review local data (evaluations, RCEs, assessment patterns) and execute immediate fixes (schedule adjustments, preceptor coaching, patient assignment re-balancing).'",46234],
    ["8.7-T5","OA","8.7","Appendix","Provide evidence: 'CCS reviews cross-site comparability trends, approves clerkship-level action plans, and sets follow-up intervals; coordinates with affiliated sites to ensure consistent experiences.'",46234],
    ["8.7-T6","OA","8.7","Appendix","Provide evidence: 'AES monitors assessment reliability and grading consistency across sites and recommends assessment or policy adjustments when cross-site drift appears.'",46234],
    ["9.0-T1","OA","9.0","Appendix","Provide Table 9.0-1 that will be accurate of current state at 06/2027.",46234],
    ["9.0-T2","OA","9.0","Appendix","Provide Table 9.0-2 that will be accurate of current state at 06/2027.",46234],
    ["9.4-T1","OA","9.4","Process","Provide evidence/the process of how we ensure students are observed for required clinical skills for all clerkships. Specify if the process differs across clerkships and how it is monitored at the clerkship level and centrally.",46234],
    ["9.4-T2","OA","9.4","Appendix","Complete and provide 9.4-1 table. Work with OAE for types of assessment.",46234],
    ["9.4-T3","OA","9.4","Appendix","Provide data for AY 25-26 from clerkship survey results that indicate student perceptions of being observed performing required clinical skills. Include the academic year.",46234],
    ["9.4-T4","OA","9.4","Appendix","Provide meeting minutes and reports: 'The CQI and verification process is led by OAE, which consolidates OSCE results, direct-observation completion, H&P quality indicators, and RCE audits by clerkship for CCS review each cycle…'",46234],
    ["9.4-T5","OA","9.4","Process","Describe how, for clinical skills competencies, criteria show that based on assessment outcomes we know students are ready to progress to next phase of the program and graduation.",46234],
    ["9.5-T1","OA","9.5","Appendix","Provide policy that indicates requirements to provide narrative descriptions of student performance.",46234],
    ["9.5-T2","OA","9.5","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["9.6-T1","OA","9.6","Appendix","Provide evidence: 'Clerkship directors submit assessment plans that define grading criteria, passing standards, and gates such as clerkship OSCE pass requirements, required workplace-based direct observations of H&P, RCE completion, mid-clerkship feedback compliance, and narrative expectations on clinical evaluation forms.'",46234],
    ["9.6-T2","OA","9.6","Appendix","Provide evidence: 'AES serves as the EEC's technical reviewer for these plans — vetting rubric quality, OSCE station reliability, checklist use in workplace-based observations, and equity of grade distributions — before CCS approval.'",46234],
    ["9.6-T3","OA","9.6","Appendix","Provide evidence: 'CCS audits OSCE completion, direct-observation compliance, RCE logs, timelines, distributions, and narrative inclusion; OAE supplies cross-clerkship analytics…'",46234],
    ["9.6-T4","OA","9.6","Appendix","Provide evidence: 'PCCS acts on the proposals and, with AES analytics, recommends Phase 1 progression expectations to the EEC. PCCS and OAE monitor compliance with approved plans…'",46234],
    ["9.6-T5","OA","9.6","Appendix","Provide evidence: 'CIS sets and approves standards for longitudinal integration elements, including THINQ and Areas of Concentration as applicable, and oversees the Phase 3 capstone (PEAKS 3).'",46234],
    ["9.6-T6","OA","9.6","Process","Describe in more detail: 'Methodological quality and consistency are ensured by AES, which vets proposed standards and capstone requirements against school-wide assessment policy and measurement evidence, while OAE confirms operational feasibility before EEC action.'",46234],
    ["9.6-T7","OA","9.6","Appendix","Provide examples/reports of 'AES's equity and quality analyses of assessment outcomes'.",46234],
    ["9.6-T8","OA","9.6","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
    ["9.7-T1","OA","9.7","Appendix","Complete and provide 9.7-1 table (pre-clerkship formative feedback).",46234],
    ["9.7-T2","OA","9.7","Appendix","Provide AY 25-26 data on student perception they received mid-course feedback.",46234],
    ["9.7-T3","OA","9.7","Appendix","Describe the process for each clerkship — create a table that outlines, for each clerkship, when MCF occurs, what it entails, and how it is centrally monitored to ensure 100% compliance for all clerkships.",46234],
    ["9.7-T4","OA","9.7","Process","Provide evidence that the mid-course/module feedback occurs.",46234],
    ["9.7-T5","OA","9.7","Appendix","Provide the formal policy that outlines how and when medical students receive formative feedback by at least the mid-point of courses and clerkships of four weeks.",46234],
    ["9.8-T1","OA","9.8","Appendix","Provide the Final Grade Submission policy; ensure it is up to date.",46234],
    ["9.8-T2","OA","9.8","DCI Narrative Review","Have task force review current state of DCI narrative and provide feedback for next draft.",46234],
  ];

  const TASKS = RAW_TASKS.map(([id, sub, element, category, description, dueSerial]) => ({
    id, subcommittee: sub, element, category, description,
    due: excelSerialToISO(dueSerial),
  }));

  // ─── MEPOs (for reference panel) ──────────────────────────────────────────
  const MEPOS = [
    { domain: "A. Patient Care", items: [
      "Gather accurate and essential patient information through history-taking, physical examination, and appropriate use of laboratory data, imaging, and other diagnostic tests.",
      "Interpret laboratory data, imaging studies, and other diagnostic tests relevant to clinical practice.",
      "Make informed decisions regarding diagnostic and therapeutic interventions.",
      "Perform medical, diagnostic, and procedural skills appropriate to the level of training and area of practice.",
      "Counsel and educate patients and families to support participation in care and shared decision-making.",
      "Coordinate care through appropriate referrals, ensuring continuity across providers and settings, and follow-up on patient outcomes.",
      "Deliver healthcare services that promote health maintenance, disease prevention, and overall well-being of patients, families, and communities.",
    ]},
    { domain: "B. Knowledge for Practice", items: [
      "Apply foundational biomedical science knowledge to patient care.",
      "Apply principles of clinical sciences to diagnostic reasoning, therapeutic decision-making, and evidence-based practice.",
      "Apply principles of public and population health to identify health risks, inform prevention strategies, and improve outcomes for individuals and populations.",
      "Apply principles of social and behavioral sciences to the delivery of patient-centered care.",
      "Develop and present a scholarly product relevant to the field of medicine.",
    ]},
    { domain: "C. Practice-Based Learning and Improvement", items: [
      "Locate, critically appraise, and apply evidence from scientific studies to patient care.",
      "Demonstrate self-awareness and situational awareness to guide clinical reasoning, decision-making, and professional behavior.",
    ]},
    { domain: "D. Professionalism", items: [
      "Uphold ethical principles in all aspects of patient care.",
      "Demonstrate honesty, integrity, and respect in interactions with patients, peers, faculty, and healthcare team members.",
    ]},
    { domain: "E. Personal and Professional Development", items: [
      "Assess personal, professional, and educational needs through reflection and engage in strategies that promote growth, resilience, and well-being.",
      "Seek, receive, provide, and apply feedback to improve performance and professional development.",
    ]},
    { domain: "F. Interpersonal and Communication Skills", items: [
      "Communicate effectively with patients, families, and caregivers across diverse socioeconomic and cultural backgrounds.",
      "Communicate effectively with colleagues, interprofessional teams, and health-related agencies.",
      "Maintain accurate, comprehensive, and timely medical documentation.",
    ]},
    { domain: "G. Systems-Based Practice", items: [
      "Identify system-level issues and contribute to solutions that improve the quality, equity, and safety of patient care.",
      "Apply strategies to address structural and social determinants that impact healthcare delivery and patient outcomes.",
    ]},
  ];

  // ─── Resource links ───────────────────────────────────────────────────────
  const RESOURCES = [
    { id: "ascend",     label: "ASCEND Curriculum Navigator",        url: "https://sinaiascend.github.io/Dashboard-Students/", icon: "compass", desc: "Student-facing curriculum dashboard with phase, module, and EPO views." },
    { id: "orgchart",   label: "ASCEND MD Governance Org Chart",     url: "assets/governance-org-chart.png", icon: "tree",   desc: "Reporting structure for the Dean for Medical Education, standing committees, and subcommittees." },
    { id: "comparison", label: "DCI Standards 6/7/8/9 Comparison",   url: "assets/DCI_Standard_6789_Comparison.pdf", icon: "doc", desc: "Element-by-element brief of 2026-27 → 2027-28 changes prepared for the Curricular Affairs Team." },
  ];

  return { SUBCOMMITTEES, ELEMENTS, TASKS, MEPOS, RESOURCES };
})();
