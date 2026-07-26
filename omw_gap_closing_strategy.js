const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

function renderIconSvg(IC, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IC, { color, size: String(size) })
  );
}
async function iconPng(IC, color, sz = 256) {
  return (
    "image/png;base64," +
    (await sharp(Buffer.from(renderIconSvg(IC, color, sz))).png().toBuffer()).toString("base64")
  );
}

async function buildDeck() {
  const {
    FaBone,
    FaUserMd,
    FaHospital,
    FaUsers,
    FaClipboardCheck,
    FaClock,
    FaExclamationTriangle,
    FaRoute,
    FaChartLine,
    FaHandsHelping,
    FaPills,
    FaSearchPlus,
    FaFlag,
  } = require("react-icons/fa");

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "OMW Quality Strategy";
  pres.title = "OMW Gap Closing Strategy";
  pres.subject = "HEDIS Osteoporosis Management — strategies to close care gaps";

  const C = {
    navy: "0F2B3C",
    teal: "0D7377",
    tealLight: "14A3A8",
    mint: "A7E8D0",
    white: "FFFFFF",
    offWhite: "F4F7F6",
    lightGray: "E8EDED",
    gray: "6B7F82",
    dkGray: "4A5C60",
    darkText: "1A2E35",
    red: "C0392B",
    amber: "C97B17",
    green: "2D9B6E",
    blue: "1A56DB",
  };
  const F = "Arial";
  const shadow = () => ({
    type: "outer",
    blur: 5,
    offset: 2,
    angle: 135,
    color: "000000",
    opacity: 0.1,
  });

  const TX = 0.5,
    TY = 0.38,
    TW = 9,
    TH = 0.4;
  const LBL_Y = 0.18,
    BODY_Y = 0.9,
    FTR_Y = 5.25,
    FTR_H = 0.375;
  const TOTAL = 14;

  function addFooter(sl, n, src) {
    sl.addShape(pres.shapes.RECTANGLE, {
      x: 0,
      y: FTR_Y,
      w: 10,
      h: FTR_H,
      fill: { color: C.navy },
    });
    sl.addText("OMW Gap Closing Strategy", {
      x: 0.4,
      y: FTR_Y,
      w: 3.2,
      h: FTR_H,
      fontSize: 8,
      fontFace: F,
      color: C.tealLight,
      valign: "middle",
      margin: 0,
      bold: true,
    });
    sl.addText(src || "HEDIS · Medicare Stars  |  Internal strategy draft", {
      x: 3.5,
      y: FTR_Y,
      w: 5.0,
      h: FTR_H,
      fontSize: 7.5,
      fontFace: F,
      color: C.white,
      valign: "middle",
      align: "center",
      margin: 0,
    });
    sl.addText(`${n} / ${TOTAL}`, {
      x: 8.7,
      y: FTR_Y,
      w: 0.95,
      h: FTR_H,
      fontSize: 8,
      fontFace: F,
      color: C.white,
      align: "right",
      valign: "middle",
      margin: 0,
    });
  }
  function addLabel(sl, t) {
    sl.addText(t, {
      x: TX,
      y: LBL_Y,
      w: TW,
      h: 0.18,
      fontSize: 9,
      fontFace: F,
      color: C.teal,
      charSpacing: 2.5,
      bold: true,
      margin: 0,
    });
  }
  function addTitle(sl, t) {
    sl.addText(t, {
      x: TX,
      y: TY,
      w: TW,
      h: TH,
      fontSize: 16,
      fontFace: F,
      color: C.darkText,
      bold: true,
      margin: 0,
      valign: "middle",
    });
  }

  const icoBone = await iconPng(FaBone, "#14A3A8");
  const icoUserMd = await iconPng(FaUserMd, "#0D7377");
  const icoHospital = await iconPng(FaHospital, "#0D7377");
  const icoUsers = await iconPng(FaUsers, "#0D7377");
  const icoCheck = await iconPng(FaClipboardCheck, "#2D9B6E");
  const icoClock = await iconPng(FaClock, "#C97B17");
  const icoWarn = await iconPng(FaExclamationTriangle, "#C0392B");
  const icoRoute = await iconPng(FaRoute, "#0D7377");
  const icoChart = await iconPng(FaChartLine, "#0D7377");
  const icoHands = await iconPng(FaHandsHelping, "#0D7377");
  const icoPills = await iconPng(FaPills, "#0D7377");
  const icoSearch = await iconPng(FaSearchPlus, "#0D7377");
  const icoFlag = await iconPng(FaFlag, "#14A3A8");

  // ══════════════════════════════════════════════
  // SLIDE 1 — TITLE
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 0.14,
      h: 5.625,
      fill: { color: C.teal },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.8,
      y: 0,
      w: 3.2,
      h: 5.625,
      fill: { color: "0A222E" },
    });
    s.addImage({ data: icoBone, x: 7.55, y: 2.0, w: 1.5, h: 1.5 });
    s.addText("HEDIS OMW", {
      x: 7.2,
      y: 3.7,
      w: 2.4,
      h: 0.35,
      fontSize: 12,
      fontFace: F,
      color: C.tealLight,
      align: "center",
      bold: true,
      charSpacing: 2,
      margin: 0,
    });
    s.addText("GAP CLOSING", {
      x: 7.2,
      y: 4.0,
      w: 2.4,
      h: 0.3,
      fontSize: 11,
      fontFace: F,
      color: C.gray,
      align: "center",
      margin: 0,
    });

    s.addText("STRATEGIES TO CLOSE THE CARE GAP", {
      x: 0.55,
      y: 1.15,
      w: 5.9,
      h: 0.3,
      fontSize: 11,
      fontFace: F,
      color: C.tealLight,
      bold: true,
      charSpacing: 2,
      margin: 0,
    });
    s.addText("Osteoporosis Management\nin Women Who Had a Fracture", {
      x: 0.55,
      y: 1.55,
      w: 5.9,
      h: 1.35,
      fontSize: 28,
      fontFace: F,
      color: C.white,
      bold: true,
      margin: 0,
      lineSpacingMultiple: 1.05,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.55,
      y: 3.15,
      w: 2.4,
      h: 0.04,
      fill: { color: C.teal },
    });
    s.addText(
      "Where to focus finite outreach capacity so more women get BMD testing or osteoporosis treatment within 180 days of a qualifying fracture.",
      {
        x: 0.55,
        y: 3.4,
        w: 5.7,
        h: 0.85,
        fontSize: 13,
        fontFace: F,
        color: C.lightGray,
        margin: 0,
      }
    );
    s.addText("Quality  ·  Stars  ·  Care Management  ·  Clinical Rules", {
      x: 0.55,
      y: 4.55,
      w: 5.7,
      h: 0.3,
      fontSize: 11,
      fontFace: F,
      color: C.gray,
      margin: 0,
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 2 — AGENDA
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 2);
    addLabel(s, "AGENDA");
    addTitle(s, "What we will decide: which gap-closing strategies deserve focus.");

    const items = [
      { n: "01", t: "The gap we must close", d: "What OMW counts and why national rates stay low" },
      { n: "02", t: "Why members fail", d: "Seven operational failure modes that strategy must attack" },
      { n: "03", t: "Evidence hierarchy", d: "What works — FLS, multi-component QI, and what doesn’t" },
      { n: "04", t: "Focus portfolio", d: "Five strategies to prioritize with limited capacity" },
      { n: "05", t: "Operating model", d: "Tiers, barrier matching, and the 180-day rhythm" },
      { n: "06", t: "Where to start", d: "Recommended sequencing and success metrics" },
    ];
    items.forEach((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.65;
      const y = BODY_Y + row * 1.25;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 4.4,
        h: 1.1,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.08,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x,
        y,
        w: 0.08,
        h: 1.1,
        fill: { color: C.teal },
      });
      s.addText(it.n, {
        x: x + 0.25,
        y: y + 0.22,
        w: 0.7,
        h: 0.35,
        fontSize: 18,
        fontFace: F,
        color: C.teal,
        bold: true,
        margin: 0,
      });
      s.addText(it.t, {
        x: x + 1.0,
        y: y + 0.22,
        w: 3.1,
        h: 0.32,
        fontSize: 14,
        fontFace: F,
        color: C.darkText,
        bold: true,
        margin: 0,
      });
      s.addText(it.d, {
        x: x + 1.0,
        y: y + 0.55,
        w: 3.1,
        h: 0.4,
        fontSize: 11,
        fontFace: F,
        color: C.dkGray,
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 3 — THE GAP
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 3, "Measure: NCQA HEDIS OMW  |  Numerator = BMD or osteoporosis Rx within 180 days");
    addLabel(s, "THE CARE GAP");
    addTitle(s, "A fracture is the signal. Six months is the deadline. Most women still miss care.");

    // Big stat cards
    const stats = [
      { v: "180", u: "days", l: "Window after index fracture to complete BMD or start therapy" },
      { v: "~1 in 5", u: "", l: "Typical national share receiving post-fracture testing or treatment" },
      { v: "Either", u: "BMD or Rx", l: "Closes the measure — both are not required; evaluation alone counts" },
    ];
    stats.forEach((st, i) => {
      const x = 0.5 + i * 3.1;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: BODY_Y,
        w: 2.95,
        h: 2.15,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.08,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x,
        y: BODY_Y,
        w: 2.95,
        h: 0.08,
        fill: { color: i === 1 ? C.amber : C.teal },
      });
      s.addText(st.v, {
        x,
        y: BODY_Y + 0.35,
        w: 2.95,
        h: 0.55,
        fontSize: 28,
        fontFace: F,
        color: C.darkText,
        bold: true,
        align: "center",
        margin: 0,
      });
      if (st.u) {
        s.addText(st.u, {
          x,
          y: BODY_Y + 0.9,
          w: 2.95,
          h: 0.25,
          fontSize: 12,
          fontFace: F,
          color: C.teal,
          align: "center",
          bold: true,
          margin: 0,
        });
      }
      s.addText(st.l, {
        x: x + 0.15,
        y: BODY_Y + 1.25,
        w: 2.65,
        h: 0.7,
        fontSize: 11,
        fontFace: F,
        color: C.dkGray,
        align: "center",
        margin: 0,
      });
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y: 3.3,
      w: 9,
      h: 1.65,
      fill: { color: C.white },
      shadow: shadow(),
      rectRadius: 0.08,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5,
      y: 3.3,
      w: 0.08,
      h: 1.65,
      fill: { color: C.amber },
    });
    s.addText("Strategic implication", {
      x: 0.8,
      y: 3.45,
      w: 8.4,
      h: 0.3,
      fontSize: 13,
      fontFace: F,
      color: C.darkText,
      bold: true,
      margin: 0,
    });
    s.addText(
      "OMW is not a rare-event quality measure — it is a large, addressable care-gap problem. Strategy should not try to “discover” whether outreach works; the literature is clear. Strategy should decide where finite coordinator and Stars capacity goes first, and which multi-component pathway each member receives inside the 180-day clock.",
      {
        x: 0.8,
        y: 3.85,
        w: 8.4,
        h: 0.9,
        fontSize: 12,
        fontFace: F,
        color: C.dkGray,
        margin: 0,
      }
    );
  }

  // ══════════════════════════════════════════════
  // SLIDE 4 — FAILURE MODES
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 4, "Each failure mode maps to a specific intervention lever");
    addLabel(s, "WHY GAPS STAY OPEN");
    addTitle(s, "Seven operational failure modes — not one generic “noncompliance.”");

    const modes = [
      { t: "No owner after fracture", d: "ED/urgent-care wrist or vertebral fracture never handed to PCP" },
      { t: "Clock quietly expires", d: "Healing + rehab consume 180 days, especially late intake fractures" },
      { t: "Hip discharge without plan", d: "Surgical recovery focus; therapy not started before discharge" },
      { t: "Silent vertebral fractures", d: "Incidental imaging findings under-coded or not communicated" },
      { t: "Coding false positives", d: "Old/history fractures coded acute — wasted outreach unless claim corrected" },
      { t: "Stale care misread", d: "DXA >24 mo or Rx >12 mo no longer excludes; teams assume protected" },
      { t: "Access & adherence barriers", d: "Transport, cost, bisphosphonate hesitancy convert orders to open gaps" },
    ];
    modes.forEach((m, i) => {
      const y = BODY_Y - 0.05 + i * 0.52;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.5,
        y,
        w: 9,
        h: 0.48,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.06,
      });
      s.addShape(pres.shapes.OVAL, {
        x: 0.65,
        y: y + 0.1,
        w: 0.28,
        h: 0.28,
        fill: { color: C.teal },
      });
      s.addText(String(i + 1), {
        x: 0.65,
        y: y + 0.1,
        w: 0.28,
        h: 0.28,
        fontSize: 10,
        fontFace: F,
        color: C.white,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      s.addText(m.t, {
        x: 1.15,
        y: y + 0.08,
        w: 2.8,
        h: 0.32,
        fontSize: 12,
        fontFace: F,
        color: C.darkText,
        bold: true,
        valign: "middle",
        margin: 0,
      });
      s.addText(m.d, {
        x: 4.0,
        y: y + 0.08,
        w: 5.3,
        h: 0.32,
        fontSize: 12,
        fontFace: F,
        color: C.dkGray,
        valign: "middle",
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 5 — EVIDENCE HIERARCHY
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 5, "Wu 2018 FLS meta-analysis · Nayak 2018 multi-component QI (43 RCTs) · Roux 2013 PCP priming");
    addLabel(s, "WHAT THE EVIDENCE SAYS");
    addTitle(s, "Do not debate single mailers. Bundle interventions — and staff a pathway.");

    const cols = [
      {
        title: "Do more of this",
        color: C.green,
        items: [
          "Coordinator-led Fracture Liaison Service (FLS)",
          "Multi-component QI (provider + patient + scheduling)",
          "PCP priming after fracture (intensive > minimal)",
          "In-hospital therapy initiation for hip fracture",
          "Pharmacist-led case finding from claims",
        ],
      },
      {
        title: "Use as enablers",
        color: C.teal,
        items: [
          "Continuous EHR/claims case-finding",
          "NLP on imaging for silent fractures",
          "VFA to surface vertebral fractures",
          "Plan-level care coordination culture",
          "Risk models to rank who needs intensity",
        ],
      },
      {
        title: "Do not rely on alone",
        color: C.red,
        items: [
          "Single patient mailers or one-off SMS",
          "Provider alert without follow-through",
          "Passive gap lists with no owner",
          "Fracture-risk score as outreach priority",
          "Assuming “she already had a DXA”",
        ],
      },
    ];
    cols.forEach((col, i) => {
      const x = 0.45 + i * 3.15;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: BODY_Y,
        w: 3.0,
        h: 3.95,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.08,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x,
        y: BODY_Y,
        w: 3.0,
        h: 0.5,
        fill: { color: col.color },
      });
      s.addText(col.title, {
        x,
        y: BODY_Y,
        w: 3.0,
        h: 0.5,
        fontSize: 13,
        fontFace: F,
        color: C.white,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      col.items.forEach((item, j) => {
        const iy = BODY_Y + 0.7 + j * 0.58;
        s.addShape(pres.shapes.OVAL, {
          x: x + 0.18,
          y: iy + 0.08,
          w: 0.16,
          h: 0.16,
          fill: { color: col.color },
        });
        s.addText(item, {
          x: x + 0.45,
          y: iy,
          w: 2.4,
          h: 0.5,
          fontSize: 11,
          fontFace: F,
          color: C.darkText,
          margin: 0,
          valign: "middle",
        });
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 6 — FOCUS PORTFOLIO OVERVIEW
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 6);
    addLabel(s, "FOCUS PORTFOLIO");
    addTitle(s, "Five strategies to resource — not twenty pilots.");

    const strats = [
      { n: "1", t: "FLS-style pathway", s: "Core", d: "Named coordinator owns testing + treatment through closure" },
      { n: "2", t: "Risk-tiered outreach", s: "Core", d: "Capacity-based tiers: intensive / structured / light-touch" },
      { n: "3", t: "Barrier-matched tactics", s: "Core", d: "Lead action matches why the gap will stay open" },
      { n: "4", t: "Hip inpatient fast-track", s: "Must-do", d: "Start therapy in hospital — override the score" },
      { n: "5", t: "Always-on case finding", s: "Foundation", d: "Claims + ADT + imaging NLP; equity by design" },
    ];
    strats.forEach((st, i) => {
      const y = BODY_Y + i * 0.72;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.5,
        y,
        w: 9,
        h: 0.65,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.06,
      });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.65,
        y: y + 0.12,
        w: 0.42,
        h: 0.42,
        fill: { color: C.teal },
        rectRadius: 0.06,
      });
      s.addText(st.n, {
        x: 0.65,
        y: y + 0.12,
        w: 0.42,
        h: 0.42,
        fontSize: 14,
        fontFace: F,
        color: C.white,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      s.addText(st.t, {
        x: 1.3,
        y: y + 0.1,
        w: 3.4,
        h: 0.45,
        fontSize: 14,
        fontFace: F,
        color: C.darkText,
        bold: true,
        valign: "middle",
        margin: 0,
      });
      const badgeColor = st.s === "Must-do" ? C.red : st.s === "Foundation" ? C.blue : C.teal;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 4.8,
        y: y + 0.18,
        w: 1.15,
        h: 0.3,
        fill: { color: badgeColor },
        rectRadius: 0.05,
      });
      s.addText(st.s, {
        x: 4.8,
        y: y + 0.18,
        w: 1.15,
        h: 0.3,
        fontSize: 10,
        fontFace: F,
        color: C.white,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      s.addText(st.d, {
        x: 6.15,
        y: y + 0.1,
        w: 3.2,
        h: 0.45,
        fontSize: 12,
        fontFace: F,
        color: C.dkGray,
        valign: "middle",
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 7 — STRATEGY 1 FLS
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 7, "Strongest evidence base for post-fracture testing & treatment initiation (Wu 2018)");
    addLabel(s, "STRATEGY 1  ·  CORE");
    addTitle(s, "FLS-equivalent pathway: someone owns the member until the gap closes.");

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y: BODY_Y,
      w: 9,
      h: 0.7,
      fill: { color: C.navy },
      rectRadius: 0.06,
    });
    s.addText(
      "Design principle: multi-component by default. Intensity varies — ownership does not.",
      {
        x: 0.7,
        y: BODY_Y,
        w: 8.6,
        h: 0.7,
        fontSize: 14,
        fontFace: F,
        color: C.white,
        bold: true,
        valign: "middle",
        margin: 0,
      }
    );

    const cards = [
      { ico: icoSearch, t: "Identify", d: "Every qualifying fracture from claims, ADT, and imaging — not referral-only" },
      { ico: icoUserMd, t: "Own", d: "Named coordinator schedules BMD, engages PCP, removes barriers" },
      { ico: icoPills, t: "Treat", d: "Follow through to completed scan or filled/administered Rx" },
      { ico: icoCheck, t: "Close", d: "Document numerator event; feed outcomes back to ranking model" },
    ];
    cards.forEach((c, i) => {
      const x = 0.5 + i * 2.35;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: 1.9,
        w: 2.2,
        h: 2.85,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.08,
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.7,
        y: 2.15,
        w: 0.75,
        h: 0.75,
        fill: { color: C.lightGray },
      });
      s.addImage({ data: c.ico, x: x + 0.88, y: 2.33, w: 0.4, h: 0.4 });
      s.addText(c.t, {
        x: x + 0.1,
        y: 3.1,
        w: 2.0,
        h: 0.35,
        fontSize: 14,
        fontFace: F,
        color: C.teal,
        bold: true,
        align: "center",
        margin: 0,
      });
      s.addText(c.d, {
        x: x + 0.15,
        y: 3.5,
        w: 1.9,
        h: 1.0,
        fontSize: 11,
        fontFace: F,
        color: C.dkGray,
        align: "center",
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 8 — STRATEGY 2 TIERS
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 8, "Tier cut-points follow outreach capacity (top-K), not an abstract probability threshold");
    addLabel(s, "STRATEGY 2  ·  CORE");
    addTitle(s, "Risk-tiered outreach: spend intensity where self-closure is least likely.");

    const tiers = [
      {
        badge: "TIER 1",
        color: C.red,
        t: "Intensive / FLS-equivalent",
        d: "High predicted failure: no PCP, long DXA distance, high deprivation, OP/ED fracture with no follow-up path.",
        a: "Named coordinator · active scheduling · provider engagement · barrier removal",
      },
      {
        badge: "TIER 2",
        color: C.amber,
        t: "Structured multi-component",
        d: "Moderate risk — still needs a bundle, not a single touch.",
        a: "Provider alert + member outreach + scheduling assist",
      },
      {
        badge: "TIER 3",
        color: C.green,
        t: "Light-touch / monitor",
        d: "Likely to close (engaged, has PCP, already scheduled).",
        a: "Single reminder · passive monitoring · escalate at day ~90 if still open",
      },
    ];
    tiers.forEach((t, i) => {
      const y = BODY_Y + i * 1.25;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.5,
        y,
        w: 9,
        h: 1.15,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.08,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5,
        y,
        w: 0.12,
        h: 1.15,
        fill: { color: t.color },
      });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.85,
        y: y + 0.35,
        w: 1.15,
        h: 0.4,
        fill: { color: t.color },
        rectRadius: 0.05,
      });
      s.addText(t.badge, {
        x: 0.85,
        y: y + 0.35,
        w: 1.15,
        h: 0.4,
        fontSize: 11,
        fontFace: F,
        color: C.white,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      s.addText(t.t, {
        x: 2.2,
        y: y + 0.15,
        w: 7.0,
        h: 0.3,
        fontSize: 14,
        fontFace: F,
        color: C.darkText,
        bold: true,
        margin: 0,
      });
      s.addText(t.d, {
        x: 2.2,
        y: y + 0.45,
        w: 7.0,
        h: 0.28,
        fontSize: 11,
        fontFace: F,
        color: C.dkGray,
        margin: 0,
      });
      s.addText(t.a, {
        x: 2.2,
        y: y + 0.75,
        w: 7.0,
        h: 0.28,
        fontSize: 11,
        fontFace: F,
        color: C.teal,
        bold: true,
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 9 — STRATEGY 3 BARRIER MATCHING
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 9, "Reciprocal design: high failure risk → more barrier removal, never less outreach");
    addLabel(s, "STRATEGY 3  ·  CORE");
    addTitle(s, "Match the lead tactic to the barrier — not a generic reminder.");

    const rows = [
      ["No attributed PCP", "Assign/connect PCP; coordinator owns end-to-end scheduling"],
      ["Long DXA distance / access", "Mobile DXA, telehealth, or pharmacy-based initiation"],
      ["Inpatient hip fracture", "In-hospital treatment initiation before discharge"],
      ["Low med adherence history", "Pharmacist counseling + simplified regimen + refills"],
      ["Low provider panel OMW rate", "Order sets, education, panel gap reports"],
      ["Silent vertebral fracture", "VFA / imaging review to confirm and prompt treatment"],
      ["High deprivation / dual-eligible", "SDOH navigation, transport, prioritized coordinator time"],
    ];
    // header
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5,
      y: BODY_Y,
      w: 9,
      h: 0.4,
      fill: { color: C.navy },
    });
    s.addText("Dominant barrier", {
      x: 0.7,
      y: BODY_Y,
      w: 3.3,
      h: 0.4,
      fontSize: 12,
      fontFace: F,
      color: C.white,
      bold: true,
      valign: "middle",
      margin: 0,
    });
    s.addText("Lead intervention", {
      x: 4.1,
      y: BODY_Y,
      w: 5.2,
      h: 0.4,
      fontSize: 12,
      fontFace: F,
      color: C.white,
      bold: true,
      valign: "middle",
      margin: 0,
    });
    rows.forEach((r, i) => {
      const y = BODY_Y + 0.4 + i * 0.48;
      const bg = i % 2 === 0 ? C.white : C.lightGray;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5,
        y,
        w: 9,
        h: 0.48,
        fill: { color: bg },
      });
      s.addText(r[0], {
        x: 0.7,
        y,
        w: 3.3,
        h: 0.48,
        fontSize: 12,
        fontFace: F,
        color: C.darkText,
        bold: true,
        valign: "middle",
        margin: 0,
      });
      s.addText(r[1], {
        x: 4.1,
        y,
        w: 5.2,
        h: 0.48,
        fontSize: 12,
        fontFace: F,
        color: C.dkGray,
        valign: "middle",
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 10 — STRATEGY 4 HIP FAST TRACK
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 10, "Kuiper 2018 — in-hospital initiation markedly improved standard-of-care completion");
    addLabel(s, "STRATEGY 4  ·  MUST-DO");
    addTitle(s, "Hip / inpatient fast-track: do not wait for a risk score.");

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y: BODY_Y,
      w: 4.35,
      h: 3.95,
      fill: { color: C.navy },
      rectRadius: 0.08,
    });
    s.addImage({ data: icoHospital, x: 0.85, y: 1.2, w: 0.55, h: 0.55 });
    s.addText("Why this is non-negotiable", {
      x: 0.85,
      y: 1.95,
      w: 3.7,
      h: 0.4,
      fontSize: 16,
      fontFace: F,
      color: C.white,
      bold: true,
      margin: 0,
    });
    s.addText(
      "Hip fracture patients are the highest-risk group. The 180-day clock starts at discharge. Surgical recovery often crowds out osteoporosis planning. The admission itself is the best single chance to close the gap.",
      {
        x: 0.85,
        y: 2.5,
        w: 3.7,
        h: 1.8,
        fontSize: 13,
        fontFace: F,
        color: C.lightGray,
        margin: 0,
      }
    );

    const rights = [
      { t: "Override tiering", d: "Any qualifying hip fracture during admission routes to fast-track regardless of Model B score." },
      { t: "Order-set / PDSA", d: "Standardize osteoporosis evaluation and treatment offer before discharge." },
      { t: "Hand off residual gaps", d: "If not closed inpatient, auto-enroll to Tier 1 outpatient FLS pathway day 0 post-discharge." },
      { t: "Measure it", d: "Track % of hip episodes with in-hospital Rx or scheduled BMD before discharge." },
    ];
    rights.forEach((r, i) => {
      const y = BODY_Y + i * 0.98;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 5.05,
        y,
        w: 4.45,
        h: 0.9,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.06,
      });
      s.addText(r.t, {
        x: 5.25,
        y: y + 0.12,
        w: 4.05,
        h: 0.28,
        fontSize: 13,
        fontFace: F,
        color: C.teal,
        bold: true,
        margin: 0,
      });
      s.addText(r.d, {
        x: 5.25,
        y: y + 0.42,
        w: 4.05,
        h: 0.4,
        fontSize: 11,
        fontFace: F,
        color: C.dkGray,
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 11 — STRATEGY 5 CASE FINDING
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 11, "Navarro 2011: continuous EMR screening improved rates and reduced disparities");
    addLabel(s, "STRATEGY 5  ·  FOUNDATION");
    addTitle(s, "Always-on case finding — because manual referral entrenches inequity.");

    const boxes = [
      { ico: icoSearch, t: "Claims + pharmacy", d: "Continuous scan for qualifying fractures and numerator events" },
      { ico: icoClock, t: "ADT enrichment", d: "Act when fracture is known — don’t wait for perfect claims lag" },
      { ico: icoRoute, t: "Imaging / NLP", d: "Surface silent vertebral fractures that never get a clear code" },
      { ico: icoUsers, t: "Equity by design", d: "Monitor reach by race, dual status, rurality, deprivation" },
    ];
    boxes.forEach((b, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.65;
      const y = BODY_Y + row * 1.75;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 4.45,
        h: 1.55,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.08,
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.25,
        y: y + 0.4,
        w: 0.65,
        h: 0.65,
        fill: { color: C.lightGray },
      });
      s.addImage({ data: b.ico, x: x + 0.38, y: y + 0.53, w: 0.4, h: 0.4 });
      s.addText(b.t, {
        x: x + 1.15,
        y: y + 0.35,
        w: 3.0,
        h: 0.35,
        fontSize: 15,
        fontFace: F,
        color: C.darkText,
        bold: true,
        margin: 0,
      });
      s.addText(b.d, {
        x: x + 1.15,
        y: y + 0.8,
        w: 3.0,
        h: 0.5,
        fontSize: 12,
        fontFace: F,
        color: C.dkGray,
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 12 — 180 DAY RHYTHM
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 12);
    addLabel(s, "OPERATING RHYTHM");
    addTitle(s, "Run the 180-day clock like a program — with early leading indicators.");

    const steps = [
      { d: "Day 0", t: "Identify & score", x: "ADT/claims → exclusions → tier + barrier" },
      { d: "Days 1–60", t: "Act hard", x: "BMD scheduled target; Tier 1 fully engaged" },
      { d: "Day 60–90", t: "Escalate", x: "Rx initiation target; reopen stalled cases" },
      { d: "Day ~90", t: "Checkpoint", x: "Open Tier 3 → Tier 2; refresh prioritization" },
      { d: "Day 180", t: "Close loop", x: "Final label → model training + provider rates" },
    ];
    // timeline bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.7,
      y: 2.15,
      w: 8.6,
      h: 0.06,
      fill: { color: C.teal },
    });
    steps.forEach((st, i) => {
      const x = 0.55 + i * 1.85;
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.55,
        y: 2.0,
        w: 0.35,
        h: 0.35,
        fill: { color: C.teal },
      });
      s.addText(st.d, {
        x,
        y: 1.15,
        w: 1.7,
        h: 0.3,
        fontSize: 12,
        fontFace: F,
        color: C.teal,
        bold: true,
        align: "center",
        margin: 0,
      });
      s.addText(st.t, {
        x,
        y: 1.5,
        w: 1.7,
        h: 0.35,
        fontSize: 13,
        fontFace: F,
        color: C.darkText,
        bold: true,
        align: "center",
        margin: 0,
      });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: 2.6,
        w: 1.7,
        h: 1.9,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.06,
      });
      s.addText(st.x, {
        x: x + 0.1,
        y: 2.85,
        w: 1.5,
        h: 1.4,
        fontSize: 12,
        fontFace: F,
        color: C.dkGray,
        align: "center",
        margin: 0,
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 13 — RECOMMENDED FOCUS / SEQUENCE
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 13, "Sequence reduces thrash: foundation → must-do → core intensity model");
    addLabel(s, "WHERE TO FOCUS FIRST");
    addTitle(s, "Recommended sequencing if capacity is limited.");

    const phases = [
      {
        p: "Phase A",
        t: "Stop the bleed",
        items: [
          "Stand up hip inpatient fast-track (order set + discharge ownership)",
          "Lock continuous case-finding (claims + ADT crosswalk)",
          "Kill single-touch-only outreach as the default",
        ],
      },
      {
        p: "Phase B",
        t: "Staff the pathway",
        items: [
          "Define FLS-equivalent Tier 1 caseload & SLAs",
          "Launch 3-tier model with capacity-based cut points",
          "Implement barrier → tactic playbook for coordinators",
        ],
      },
      {
        p: "Phase C",
        t: "Sharpen ranking",
        items: [
          "Validate failure-risk scores on prior OMW years",
          "Add mid-window escalation automation (day 90)",
          "Publish equity dashboards; rebalance intensive reach",
        ],
      },
    ];
    phases.forEach((ph, i) => {
      const x = 0.5 + i * 3.1;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: BODY_Y,
        w: 2.95,
        h: 3.95,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.08,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x,
        y: BODY_Y,
        w: 2.95,
        h: 0.85,
        fill: { color: i === 0 ? C.red : i === 1 ? C.teal : C.navy },
      });
      s.addText(ph.p, {
        x,
        y: BODY_Y + 0.12,
        w: 2.95,
        h: 0.28,
        fontSize: 11,
        fontFace: F,
        color: C.mint,
        bold: true,
        align: "center",
        margin: 0,
      });
      s.addText(ph.t, {
        x,
        y: BODY_Y + 0.4,
        w: 2.95,
        h: 0.35,
        fontSize: 15,
        fontFace: F,
        color: C.white,
        bold: true,
        align: "center",
        margin: 0,
      });
      ph.items.forEach((item, j) => {
        const iy = BODY_Y + 1.1 + j * 0.85;
        s.addText(`${j + 1}.`, {
          x: x + 0.15,
          y: iy,
          w: 0.3,
          h: 0.7,
          fontSize: 13,
          fontFace: F,
          color: C.teal,
          bold: true,
          margin: 0,
        });
        s.addText(item, {
          x: x + 0.45,
          y: iy,
          w: 2.3,
          h: 0.75,
          fontSize: 11,
          fontFace: F,
          color: C.darkText,
          margin: 0,
        });
      });
    });
  }

  // ══════════════════════════════════════════════
  // SLIDE 14 — METRICS + CLOSE
  // ══════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addFooter(s, 14);
    addLabel(s, "SUCCESS METRICS  ·  NEXT DECISIONS");
    addTitle(s, "Judge the program on closure, speed, and equitable reach.");

    const metrics = [
      { t: "Primary", d: "OMW rate overall and by subgroup (race, dual, rural, deprivation)" },
      { t: "Operational", d: "Top-K precision · contact rate · days from episode → closure" },
      { t: "Leading", d: "BMD scheduled by day 60 · medication initiated by day 90" },
      { t: "Equity", d: "Intensive-pathway reach among historically failing groups" },
    ];
    metrics.forEach((m, i) => {
      const x = 0.5 + (i % 2) * 4.65;
      const y = BODY_Y + Math.floor(i / 2) * 1.15;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 4.45,
        h: 1.05,
        fill: { color: C.white },
        shadow: shadow(),
        rectRadius: 0.06,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x,
        y,
        w: 0.1,
        h: 1.05,
        fill: { color: C.teal },
      });
      s.addText(m.t, {
        x: x + 0.3,
        y: y + 0.15,
        w: 3.9,
        h: 0.28,
        fontSize: 13,
        fontFace: F,
        color: C.teal,
        bold: true,
        margin: 0,
      });
      s.addText(m.d, {
        x: x + 0.3,
        y: y + 0.5,
        w: 3.9,
        h: 0.4,
        fontSize: 12,
        fontFace: F,
        color: C.dkGray,
        margin: 0,
      });
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y: 3.4,
      w: 9,
      h: 1.55,
      fill: { color: C.navy },
      rectRadius: 0.08,
    });
    s.addText("Decisions we need from this review", {
      x: 0.75,
      y: 3.55,
      w: 8.5,
      h: 0.3,
      fontSize: 13,
      fontFace: F,
      color: C.tealLight,
      bold: true,
      margin: 0,
    });
    s.addText(
      "1) Confirm hip fast-track as mandatory  ·  2) Size Tier 1 coordinator capacity  ·  3) Adopt barrier-matched playbook as standard  ·  4) Sequence Phase A–C owners and dates  ·  5) Set equity + leading-indicator dashboards before go-live",
      {
        x: 0.75,
        y: 3.95,
        w: 8.5,
        h: 0.75,
        fontSize: 13,
        fontFace: F,
        color: C.white,
        margin: 0,
      }
    );
  }

  const out =
    "/Users/basilrunmac/Library/Mobile Documents/com~apple~CloudDocs/OMW Team Hub/OMW_Gap_Closing_Strategy.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Wrote", out);
}

buildDeck().catch((e) => {
  console.error(e);
  process.exit(1);
});
