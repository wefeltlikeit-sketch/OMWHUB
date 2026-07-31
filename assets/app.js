"use strict";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const M = window.OMWMetrics;
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const number = value => new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
const pct = value => `${number(value)}%`;
const clone = value => JSON.parse(JSON.stringify(value));

const defaults = {
  target: { currentDenominator: 1200, currentNumerator: 330, targetRate: 35, denominatorChangePct: 0, naturalClosures: 34, bufferPct: 5, monthsRemaining: 6, coordinatorCount: 4, capacityClosures: 62 },
  interventions: [
    {id:"inpatient",name:"Inpatient treatment initiation",barrier:"Care transition",eligible:90,reachRate:72,effect:24,effectLow:15,effectHigh:31,costPerMember:165,hoursPerMember:.8,readiness:"Medium",evidence:"Moderate",equityImpact:"Positive",difficulty:62},
    {id:"fls",name:"Fracture Liaison Service coordination",barrier:"Fragmented ownership",eligible:140,reachRate:64,effect:22,effectLow:14,effectHigh:29,costPerMember:230,hoursPerMember:1.35,readiness:"Medium",evidence:"Strong",equityImpact:"Positive",difficulty:78},
    {id:"bmd",name:"Active BMD scheduling",barrier:"Scheduling friction",eligible:240,reachRate:58,effect:17,effectLow:10,effectHigh:23,costPerMember:82,hoursPerMember:.55,readiness:"High",evidence:"Moderate",equityImpact:"Neutral",difficulty:44},
    {id:"provider_alert",name:"Provider workflow alert",barrier:"Awareness",eligible:320,reachRate:74,effect:8,effectLow:3,effectHigh:13,costPerMember:18,hoursPerMember:.08,readiness:"High",evidence:"Limited",equityImpact:"Neutral",difficulty:25},
    {id:"panel",name:"Provider panel report",barrier:"Panel visibility",eligible:400,reachRate:51,effect:6,effectLow:2,effectHigh:10,costPerMember:9,hoursPerMember:.04,readiness:"High",evidence:"Limited",equityImpact:"Neutral",difficulty:18},
    {id:"phone",name:"Patient phone outreach",barrier:"Navigation",eligible:260,reachRate:46,effect:14,effectLow:8,effectHigh:19,costPerMember:54,hoursPerMember:.42,readiness:"High",evidence:"Moderate",equityImpact:"Mixed",difficulty:38},
    {id:"digital",name:"Patient text or mail reminder",barrier:"Recall",eligible:420,reachRate:69,effect:5,effectLow:1,effectHigh:9,costPerMember:6,hoursPerMember:.02,readiness:"High",evidence:"Limited",equityImpact:"Mixed",difficulty:10},
    {id:"pharmacy",name:"Pharmacy consultation",barrier:"Medication concern",eligible:130,reachRate:45,effect:13,effectLow:6,effectHigh:18,costPerMember:95,hoursPerMember:.7,readiness:"Medium",evidence:"Moderate",equityImpact:"Positive",difficulty:55},
    {id:"transport",name:"Transportation support",barrier:"Physical access",eligible:85,reachRate:70,effect:19,effectLow:11,effectHigh:27,costPerMember:145,hoursPerMember:.22,readiness:"Medium",evidence:"Limited",equityImpact:"High positive",difficulty:48},
    {id:"telehealth",name:"Telehealth osteoporosis visit",barrier:"Visit access",eligible:180,reachRate:52,effect:16,effectLow:9,effectHigh:22,costPerMember:110,hoursPerMember:.62,readiness:"Medium",evidence:"Moderate",equityImpact:"Positive",difficulty:52},
    {id:"pa",name:"Prior-authorization support",barrier:"Coverage friction",eligible:75,reachRate:78,effect:21,effectLow:13,effectHigh:28,costPerMember:72,hoursPerMember:.48,readiness:"Medium",evidence:"Moderate",equityImpact:"Positive",difficulty:46},
    {id:"day90",name:"Day-90 escalation",barrier:"Stalled pathway",eligible:150,reachRate:60,effect:12,effectLow:6,effectHigh:18,costPerMember:44,hoursPerMember:.3,readiness:"High",evidence:"Planning assumption",equityImpact:"Neutral",difficulty:30}
  ],
  scenarios: [
    {id:"baseline",name:"Current-state baseline",description:"Natural closure only; no added portfolio.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:80,overlapDiscount:0,unnecessaryContactRate:12,scale:1,interventionIds:[]},
    {id:"digital",name:"Light-touch digital",description:"Low-cost broad reach with provider and patient reminders.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:62,overlapDiscount:12,unnecessaryContactRate:18,scale:1,interventionIds:["digital","provider_alert","panel"]},
    {id:"coordinator",name:"Coordinator-intensive",description:"Navigation, scheduling, and escalation centered.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:70,overlapDiscount:18,unnecessaryContactRate:9,scale:1,interventionIds:["phone","bmd","fls","day90"]},
    {id:"inpatient",name:"Inpatient-first",description:"Fast-track high-opportunity transition moments.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:72,overlapDiscount:10,unnecessaryContactRate:6,scale:1,interventionIds:["inpatient","fls","pa"]},
    {id:"provider",name:"Provider-panel",description:"Workflow alerts plus panel visibility.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:58,overlapDiscount:15,unnecessaryContactRate:17,scale:1,interventionIds:["provider_alert","panel","telehealth"]},
    {id:"equity",name:"Equity-prioritized",description:"Additional support for access and navigation barriers.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:65,overlapDiscount:12,unnecessaryContactRate:7,scale:1,interventionIds:["transport","phone","telehealth","pa"]},
    {id:"balanced",name:"Balanced recommended",description:"A mixed portfolio across workflow, navigation, and access.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:73,overlapDiscount:22,unnecessaryContactRate:10,scale:1,interventionIds:["provider_alert","bmd","phone","transport","day90"],preferred:true},
    {id:"stretch",name:"Aggressive stretch",description:"High-intensity multi-channel portfolio.",denominator:1200,baselineRate:27.5,naturalClosureRate:2.8,capacityHours:240,confidence:55,overlapDiscount:32,unnecessaryContactRate:15,scale:1,interventionIds:["inpatient","fls","bmd","provider_alert","phone","transport","telehealth","pa","day90"]}
  ],
  assumptions: [
    {id:"A-001",name:"Synthetic denominator",category:"Population",value:1200,lower:1050,upper:1350,unit:"members",source:"Synthetic baseline",confidence:"Medium",owner:"Measure strategy role",lastReviewed:"2026-07-15",reviewDate:"2026-08-15",status:"Active",impact:"High"},
    {id:"A-002",name:"Baseline compliance",category:"Measure",value:27.5,lower:25,upper:30,unit:"percent",source:"Synthetic baseline",confidence:"High",owner:"Measure strategy role",lastReviewed:"2026-07-15",reviewDate:"2026-09-01",status:"Active",impact:"High"},
    {id:"A-003",name:"Natural closure rate",category:"Operations",value:2.8,lower:1.5,upper:4.2,unit:"percent",source:"Illustrative planning value",confidence:"Low",owner:"Operations role",lastReviewed:"2026-06-20",reviewDate:"2026-08-05",status:"Needs review",impact:"High"},
    {id:"A-004",name:"Coordinator capacity",category:"Staffing",value:240,lower:180,upper:320,unit:"hours",source:"Synthetic capacity",confidence:"Medium",owner:"Care management role",lastReviewed:"2026-07-10",reviewDate:"2026-08-10",status:"Active",impact:"High"},
    {id:"A-005",name:"Portfolio overlap discount",category:"Intervention effect",value:22,lower:10,upper:35,unit:"percent",source:"Illustrative planning value",confidence:"Low",owner:"Analytics role",lastReviewed:"2026-06-10",reviewDate:"2026-08-01",status:"Needs review",impact:"High"},
    {id:"A-006",name:"Claims latency median",category:"Data latency",value:18,lower:10,upper:35,unit:"days",source:"Synthetic source profile",confidence:"Low",owner:"Data engineering role",lastReviewed:"2026-06-01",reviewDate:"2026-08-01",status:"Stale",impact:"Medium"},
    {id:"A-007",name:"Contact success rate",category:"Operations",value:46,lower:35,upper:60,unit:"percent",source:"Illustrative outreach assumption",confidence:"Medium",owner:"Care management role",lastReviewed:"2026-07-12",reviewDate:"2026-08-20",status:"Active",impact:"Medium"},
    {id:"A-008",name:"Planning target",category:"Measure",value:35,lower:33,upper:38,unit:"percent",source:"Synthetic strategy target",confidence:"Medium",owner:"Leadership role",lastReviewed:"2026-07-20",reviewDate:"2026-08-30",status:"Active",impact:"High"}
  ],
  decisions: [
    {id:"D-001",title:"Adopt dual-model architecture",status:"Approved",owner:"Analytics leadership role",statement:"Separate fracture risk from probability of OMW failure.",rationale:"The models answer different intervention questions and require different scoring times.",reviewDate:"2026-10-01",successMeasure:"Distinct operational actions for both scores"},
    {id:"D-002",title:"Use top-K capacity thresholds",status:"Under review",owner:"Care management role",statement:"Prioritize the highest-value actionable cases within weekly capacity.",rationale:"A fixed probability threshold ignores finite staff capacity.",reviewDate:"2026-08-15",successMeasure:"Incremental closures per 100 contacts"},
    {id:"D-003",title:"Fast-track inpatient hip fractures",status:"Piloting",owner:"Clinical operations role",statement:"Route qualifying inpatient hip-fracture signals to rapid treatment review.",rationale:"The care transition offers a narrow, high-value intervention moment.",reviewDate:"2026-09-15",successMeasure:"Order or initiation within 14 days"},
    {id:"D-004",title:"Apply real-time exclusion refresh",status:"Draft",owner:"Measure operations role",statement:"Refresh known exclusions immediately before outreach assignment.",rationale:"Avoid unnecessary outreach when eligibility changes.",reviewDate:"2026-08-20",successMeasure:"Reduced avoidable contacts"},
    {id:"D-005",title:"Test a 7-day hold window",status:"Under review",owner:"Data strategy role",statement:"Hold non-urgent outreach for seven days while faster evidence sources settle.",rationale:"Balance duplicate avoidance against time-sensitive intervention.",reviewDate:"2026-08-12",successMeasure:"Net unnecessary contacts avoided"},
    {id:"D-006",title:"Escalate open gaps at day 90",status:"Approved",owner:"Care management role",statement:"Reassess unresolved synthetic cases at day 90 for a higher-intensity pathway.",rationale:"Preserve adequate time for scheduling and evidence latency.",reviewDate:"2026-11-01",successMeasure:"Closure lift among escalated cases"}
  ],
  roadmap: [
    {id:"R-001",initiative:"Validate numerator and exclusion logic",workstream:"Measure validation",status:"In progress",priority:"High",target:"2026-08-14",dependency:"Current specification review",decision:"D-004"},
    {id:"R-002",initiative:"Profile synthetic signal latency",workstream:"Data readiness",status:"In progress",priority:"High",target:"2026-08-21",dependency:"Source inventory",decision:"D-005"},
    {id:"R-003",initiative:"Define dual-model cohorts",workstream:"Cohort development",status:"Planned",priority:"High",target:"2026-09-04",dependency:"R-001",decision:"D-001"},
    {id:"R-004",initiative:"Design inpatient fast-track workflow",workstream:"Intervention design",status:"In progress",priority:"High",target:"2026-08-28",dependency:"Clinical review",decision:"D-003"},
    {id:"R-005",initiative:"Build capacity threshold simulation",workstream:"Model development",status:"Planned",priority:"Medium",target:"2026-09-11",dependency:"R-003",decision:"D-002"},
    {id:"R-006",initiative:"Specify enriched workflow alert",workstream:"Workflow integration",status:"Blocked",priority:"High",target:"2026-09-18",dependency:"Platform decision",decision:"D-002"},
    {id:"R-007",initiative:"Prepare synthetic pilot protocol",workstream:"Pilot preparation",status:"Planned",priority:"Medium",target:"2026-09-25",dependency:"R-004, R-005",decision:"D-003"},
    {id:"R-008",initiative:"Define disparity monitoring guardrails",workstream:"Governance",status:"Backlog",priority:"Medium",target:"2026-10-09",dependency:"Subgroup definitions",decision:"D-001"}
  ],
  risks: [
    {id:"RK-01",title:"Insufficient outreach capacity",severity:"severe",trigger:s=>M.scenarioResult(s, state.interventions).capacityUtilization>100,detail:"Selected work exceeds available coordinator hours.",route:"portfolio"},
    {id:"RK-02",title:"Overestimated intervention effect",severity:"moderate",trigger:s=>s.confidence<65,detail:"Confidence is low relative to the projected lift.",route:"assumptions"},
    {id:"RK-03",title:"Delayed claims evidence",severity:"moderate",trigger:()=>true,detail:"Synthetic median latency may create unnecessary contact.",route:"journey"},
    {id:"RK-04",title:"Uneven subgroup reach",severity:"moderate",trigger:s=>s.id!=="equity",detail:"Portfolio has no explicit equity-prioritized allocation.",route:"portfolio"},
    {id:"RK-05",title:"Portfolio overlap",severity:"moderate",trigger:s=>s.overlapDiscount>25,detail:"Multiple channels may target the same synthetic members.",route:"scenarios"}
  ],
  funnel: [
    {name:"Fracture signal received",ratio:1,time:1},
    {name:"Qualifying event confirmed",ratio:.93,time:2},
    {name:"Exclusions refreshed",ratio:.88,time:3},
    {name:"Risk and barrier assigned",ratio:.84,time:2},
    {name:"Intervention assigned",ratio:.72,time:4},
    {name:"Contact attempted",ratio:.68,time:6},
    {name:"Contact successful",ratio:.43,time:12},
    {name:"BMD or treatment ordered",ratio:.31,time:18},
    {name:"Scheduled or initiated",ratio:.24,time:24},
    {name:"Numerator evidence received",ratio:.19,time:29},
    {name:"Gap closed",ratio:.18,time:3}
  ]
};

let state = clone(defaults);
state.selectedScenarioId = "balanced";
state.selectedInterventions = ["provider_alert","bmd","phone","transport","day90"];
state.portfolioCapacity = 240;
state.portfolioBudget = 30000;

const targetFields = [
  ["currentDenominator","Current denominator","number","Synthetic count"],
  ["currentNumerator","Current numerator","number","Synthetic compliant count"],
  ["targetRate","Target rate","number","Percent"],
  ["denominatorChangePct","Expected denominator change","number","Percent; negative reduces denominator"],
  ["naturalClosures","Natural closures","number","Expected without added intervention"],
  ["bufferPct","Planning buffer","number","Percent above minimum closures"],
  ["monthsRemaining","Months remaining","number","Planning period"],
  ["coordinatorCount","Coordinator count","number","Capacity allocation"],
  ["capacityClosures","Capacity closure ceiling","number","Maximum incremental closures"]
];
const scenarioFields = [
  ["denominator","Denominator","number","Synthetic population"],
  ["baselineRate","Baseline rate","number","Percent"],
  ["naturalClosureRate","Natural closure rate","number","Percent"],
  ["capacityHours","Available hours","number","Coordinator capacity"],
  ["confidence","Confidence","number","Percent"],
  ["overlapDiscount","Overlap discount","number","Percent"],
  ["unnecessaryContactRate","Unnecessary contact rate","number","Percent"],
  ["scale","Portfolio scale","number","Multiplier"]
];
const decisionStatuses = ["Draft","Under review","Approved","Rejected","Piloting","Operational","Superseded","Retired"];

function kpi(label,value,delta="",tone="") {
  return `<article class="kpi-card ${tone}"><div class="label">${label}</div><div class="value">${value}</div>${delta?`<div class="delta">${delta}</div>`:""}</article>`;
}
function selectedScenario(){ return state.scenarios.find(s=>s.id===state.selectedScenarioId)||state.scenarios[0]; }
function scenarioResult(s=selectedScenario()){ return M.scenarioResult(s,state.interventions); }
function targetResult(){ return M.targetPlan(state.target); }
function showToast(message){ const el=$("#toast"); el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400); }
function routeTo(id){
  if(!document.getElementById(id)) id="cockpit";
  $$(".page").forEach(el=>el.classList.toggle("active",el.id===id));
  $$("#nav a[data-route]").forEach(el=>el.classList.toggle("active",el.dataset.route===id));
  $("#pageTitle").textContent=$(`#${id}`).dataset.title;
  $(".sidebar").classList.remove("open");
  $("#menuButton").setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"smooth"});
  renderAll();
}

function renderTargetInputs(){
  $("#targetInputs").innerHTML=targetFields.map(([key,label,type,help])=>`<label>${label}<input type="${type}" name="${key}" value="${state.target[key]}" step="${["targetRate","denominatorChangePct","bufferPct"].includes(key)?".1":"1"}"><span class="field-help">${help}</span></label>`).join("");
}
function renderTarget(){
  const r=targetResult();
  $("#targetResults").innerHTML=[
    kpi("Current rate",pct(r.currentRate)),
    kpi("Projected denominator",number(r.projectedDenominator)),
    kpi("Required numerator",number(r.requiredNumerator),"At target","plum"),
    kpi("Additional closures",number(r.additionalClosures),"After natural closures",r.additionalClosures>state.target.capacityClosures?"danger":""),
    kpi("Buffered closures",number(r.bufferedClosures),`${state.target.bufferPct}% buffer`),
    kpi("Closures / month",number(r.closuresPerMonth)),
    kpi("Closures / coordinator",number(r.closuresPerCoordinator)),
    kpi("Maximum achievable rate",pct(r.maximumAchievableRate),r.maximumAchievableRate<state.target.targetRate?"Below target":"Capacity sufficient",r.maximumAchievableRate<state.target.targetRate?"danger":"")
  ].join("");
  const values=[
    ["Current",state.target.currentNumerator,""],
    ["Natural projection",r.projectedNaturalNumerator,""],
    ["Target",r.requiredNumerator,"target"],
    ["Buffered plan",r.projectedNaturalNumerator+r.bufferedClosures,"target"]
  ];
  const max=Math.max(...values.map(v=>v[1]));
  $("#numeratorLadder").innerHTML=values.map(([label,value,tone])=>`<div class="ladder-item ${tone}"><div class="ladder-bar" style="height:${Math.max(8,value/max*150)}px">${number(value)}</div><small>${label}</small></div>`).join("");
  $("#targetNarrative").textContent=`At a projected denominator of ${number(r.projectedDenominator)}, a ${pct(state.target.targetRate)} target requires ${number(r.requiredNumerator)} compliant synthetic members. With ${number(r.projectedNaturalNumerator)} projected after natural closures, the strategy must generate at least ${number(r.additionalClosures)} additional closures. A ${pct(state.target.bufferPct)} planning buffer increases the operational target to ${number(r.bufferedClosures)} closures.`;
  const base=r.projectedDenominator;
  const points=[-.12,-.06,0,.06,.12].map(change=>{
    const denominator=Math.max(1,Math.round(base*(1+change)));
    return {denominator,closures:Math.max(0,Math.ceil(denominator*state.target.targetRate/100)-r.projectedNaturalNumerator)};
  });
  const chartMax=Math.max(...points.map(p=>p.closures),1);
  $("#sensitivityChart").innerHTML=points.map(p=>`<div class="bar-group"><div class="bar" style="height:${Math.max(3,p.closures/chartMax*140)}px">${p.closures}</div><small>${number(p.denominator)} denominator</small></div>`).join("");
}

function renderCockpit(){
  const s=selectedScenario(),sr=scenarioResult(s),tr=targetResult();
  const target=state.target.targetRate;
  const gap=M.round(target-sr.projectedRate,1);
  const closuresRequired=Math.max(0,Math.ceil((target-sr.projectedRate)/100*s.denominator));
  $("#cockpitKpis").innerHTML=[
    kpi("Synthetic denominator",number(s.denominator)),
    kpi("Synthetic numerator",number(Math.round(s.denominator*sr.projectedRate/100))),
    kpi("Current compliance",pct(s.baselineRate)),
    kpi("Target compliance",pct(target),"Planning target","plum"),
    kpi("Projected final rate",pct(sr.projectedRate),`${pct(sr.lowRate)}–${pct(sr.highRate)} expected range`,gap>0?"warn":""),
    kpi("Additional closures required",number(closuresRequired),gap>0?"Remaining to target":"Target met",gap>0?"danger":""),
    kpi("Expected incremental closures",number(sr.incrementalClosures)),
    kpi("Capacity utilization",pct(sr.capacityUtilization),sr.capacityUtilization>100?"Exceeds capacity":"Within capacity",sr.capacityUtilization>100?"danger":""),
    kpi("Estimated cost / closure",money(sr.costPerClosure)),
    kpi("Members contacted",number(Math.round(sr.contacted))),
    kpi("Potential unnecessary contacts",number(sr.unnecessaryContacts),`${s.unnecessaryContactRate}% assumption`,"warn"),
    kpi("Days remaining",number(state.target.monthsRemaining*30),"Planning period")
  ].join("");
  const status=gap<=0?"On track":gap<=2?"Near target":"Below target";
  $("#outlookStatus").textContent=status;
  $("#outlookStatus").className=`status-pill ${gap>2?"danger":gap>0?"warn":""}`;
  $("#strategyStatement").textContent=gap>0
    ? `Under the current synthetic assumptions, “${s.name}” is projected to finish ${pct(gap)} below target. Reaching the target requires about ${closuresRequired} additional closures. The portfolio is expected to produce ${number(sr.incrementalClosures)} incremental closures while using ${pct(sr.capacityUtilization)} of available coordinator capacity.`
    : `Under the current synthetic assumptions, “${s.name}” is projected to meet the ${pct(target)} target, with an expected range of ${pct(sr.lowRate)} to ${pct(sr.highRate)}. The plan still depends on the stated effect and capacity assumptions.`;
  $("#projectedRateLabel").textContent=pct(sr.projectedRate);
  $("#projectedRateBar").style.width=`${Math.min(100,sr.projectedRate/50*100)}%`;
  $("#targetMarker").style.left=`${Math.min(100,target/50*100)}%`;
  $("#rateContext").textContent=`Target marker: ${pct(target)} · Scenario range: ${pct(sr.lowRate)}–${pct(sr.highRate)}`;
  const risks=state.risks.filter(r=>r.trigger(s)).slice(0,4);
  $("#riskCount").textContent=`${risks.length} active`;
  $("#riskList").innerHTML=risks.map(r=>`<div class="risk-item"><span class="risk-marker ${r.severity}"></span><div><strong>${r.title}</strong><span>${r.detail}</span></div><button data-risk-route="${r.route}">Review →</button></div>`).join("");
  const decision=state.decisions.find(d=>["Under review","Draft"].includes(d.status))||state.decisions[0];
  $("#nextDecisionTitle").textContent=decision.title; $("#nextDecisionMeta").textContent=`${decision.status} · Review ${decision.reviewDate}`;
  const weak=[...state.assumptions].sort((a,b)=>(a.confidence==="Low"?0:1)-(b.confidence==="Low"?0:1))[0];
  $("#weakAssumptionTitle").textContent=weak.name; $("#weakAssumptionMeta").textContent=`${weak.confidence} confidence · ${weak.impact} outcome impact`;
  const blocked=state.roadmap.find(r=>r.status==="Blocked")||state.roadmap[0];
  $("#roadmapSignalTitle").textContent=blocked.initiative; $("#roadmapSignalMeta").textContent=`${blocked.status} · target ${blocked.target}`;
}

function renderScenarioTabs(){
  $("#scenarioTabs").innerHTML=state.scenarios.map(s=>{const r=scenarioResult(s);return `<button class="scenario-tab ${s.id===state.selectedScenarioId?"active":""} ${s.preferred?"preferred":""}" data-scenario="${s.id}"><strong>${s.name}</strong><small>${pct(r.projectedRate)} · ${pct(r.capacityUtilization)} capacity</small></button>`}).join("");
}
function renderScenarioEditor(){
  const s=selectedScenario();
  $("#scenarioEditorTitle").textContent=s.name;
  $("#scenarioInputs").innerHTML=scenarioFields.map(([key,label,type,help])=>`<label>${label}<input type="${type}" name="${key}" value="${s[key]}" step="${["baselineRate","naturalClosureRate","scale"].includes(key)?".1":"1"}"><span class="field-help">${help}</span></label>`).join("");
  $("#preferScenario").textContent=s.preferred?"Preferred scenario ★":"Mark preferred";
  const r=scenarioResult(s);
  const drivers=[
    ["Intervention effect",Math.min(100,r.incrementalClosures/55*100),`${number(r.incrementalClosures)} closures`],
    ["Natural closure",Math.min(100,r.naturalClosures/45*100),`${number(r.naturalClosures)} closures`],
    ["Reach volume",Math.min(100,r.contacted/700*100),`${number(Math.round(r.contacted))} contacts`],
    ["Capacity pressure",Math.min(100,r.capacityUtilization),pct(r.capacityUtilization)],
    ["Uncertainty",100-s.confidence,`${100-s.confidence}%`]
  ];
  $("#driverList").innerHTML=drivers.map(([name,width,value])=>`<div class="driver-row"><span>${name}</span><div class="driver-track"><span style="width:${width}%"></span></div><strong>${value}</strong></div>`).join("");
  $("#scenarioWarning").innerHTML=r.capacityUtilization>100?`<div class="warning-box"><strong>Capacity warning:</strong> This scenario needs ${number(r.hours)} hours against ${number(s.capacityHours)} available. Reduce scale or remove high-effort interventions.</div>`:`<div class="callout">Expected range: ${pct(r.lowRate)}–${pct(r.highRate)}. This range reflects scenario confidence, not a statistical forecast.</div>`;
}
function renderScenarioTable(){
  const selected=state.scenarios.slice(0,8);
  $("#scenarioHead").innerHTML="<tr><th>Scenario</th><th>Projected rate</th><th>Range</th><th>Incremental closures</th><th>Contacts</th><th>Staff hours</th><th>Cost</th><th>Cost / closure</th><th>Capacity</th></tr>";
  $("#scenarioBody").innerHTML=selected.map(s=>{const r=scenarioResult(s);return `<tr><td><strong>${s.name}${s.preferred?" ★":""}</strong></td><td>${pct(r.projectedRate)}</td><td>${pct(r.lowRate)}–${pct(r.highRate)}</td><td>${number(r.incrementalClosures)}</td><td>${number(Math.round(r.contacted))}</td><td>${number(r.hours)}</td><td>${money(r.cost)}</td><td>${money(r.costPerClosure)}</td><td class="${r.capacityUtilization>100?"confidence-low":""}">${pct(r.capacityUtilization)}</td></tr>`}).join("");
}
function renderScenarios(){renderScenarioTabs();renderScenarioEditor();renderScenarioTable()}

function portfolioResult(){return M.portfolioResult(state.interventions.filter(i=>state.selectedInterventions.includes(i.id)),state.portfolioCapacity,state.portfolioBudget)}
function renderPortfolio(){
  $("#portfolioCapacity").value=state.portfolioCapacity;$("#portfolioBudget").value=state.portfolioBudget;
  const r=portfolioResult();
  $("#portfolioSummary").innerHTML=[
    kpi("Selected interventions",state.selectedInterventions.length),
    kpi("Expected closures",number(r.closures),"Illustrative"),
    kpi("Staff hours",number(r.hours),`${pct(r.capacityUtilization)} of capacity`,r.overCapacity?"danger":""),
    kpi("Portfolio cost",money(r.cost),`${pct(r.budgetUtilization)} of budget`,r.overBudget?"danger":""),
    kpi("Cost / closure",money(r.costPerClosure)),
    kpi("Members contacted",number(Math.round(r.contacted)))
  ].join("");
  $("#interventionBody").innerHTML=state.interventions.map(i=>`<tr><td><input type="checkbox" data-intervention="${i.id}" aria-label="Select ${i.name}" ${state.selectedInterventions.includes(i.id)?"checked":""}></td><td><strong>${i.name}</strong><br><small>${i.evidence} evidence</small></td><td>${i.barrier}</td><td>${i.effect}% <small>(${i.effectLow}–${i.effectHigh})</small></td><td>${number(M.interventionResult(i).hours)}</td><td>${money(M.interventionResult(i).cost)}</td><td>${i.readiness}</td></tr>`).join("");
  $("#impactMatrix").innerHTML=state.interventions.map(i=>`<div class="matrix-point ${state.selectedInterventions.includes(i.id)?"":"unselected"}" style="left:${Math.max(4,Math.min(96,i.difficulty))}%;bottom:${Math.max(4,Math.min(96,i.effect/25*100))}%"><span>${i.name}: ${i.effect}% effect / ${i.difficulty} effort</span></div>`).join("");
  const warnings=[];if(r.overCapacity)warnings.push(`Portfolio exceeds capacity by ${number(r.hours-state.portfolioCapacity)} hours.`);if(r.overBudget)warnings.push(`Portfolio exceeds budget by ${money(r.cost-state.portfolioBudget)}.`);if(!state.selectedInterventions.includes("transport"))warnings.push("No explicit transportation-support intervention is selected.");
  $("#portfolioWarnings").innerHTML=warnings.length?`<div class="warning-box"><strong>Constraint review</strong><ul>${warnings.map(w=>`<li>${w}</li>`).join("")}</ul></div>`:`<div class="callout">Portfolio is within the entered staff-hour and budget constraints.</div>`;
}

function renderJourney(){
  $("#funnelScenario").innerHTML=state.scenarios.map(s=>`<option value="${s.id}" ${s.id===state.selectedScenarioId?"selected":""}>${s.name}</option>`).join("");
  const s=selectedScenario(),base=Math.round(s.denominator*.32);
  const stages=state.funnel.map(stage=>({...stage,count:Math.round(base*stage.ratio)}));
  $("#funnel").innerHTML=stages.map((stage,index)=>{const width=45+stage.ratio*55;const conv=index?stage.count/stages[index-1].count*100:100;return `<button class="funnel-stage" style="width:${width}%" title="Average ${stage.time} days in stage"><span>${stage.name}</span><strong>${stage.count} · ${pct(conv)}</strong></button>`}).join("");
  const losses=stages.slice(1).map((stage,index)=>({name:stage.name,loss:stages[index].count-stage.count,prior:stages[index].name}));
  const biggest=losses.sort((a,b)=>b.loss-a.loss)[0];
  $("#leakageTitle").textContent=`${biggest.prior} → ${biggest.name}`;
  $("#leakageText").textContent=`The largest synthetic leakage is ${biggest.loss} people between these stages. Treat this as a hypothesis generator: the count is fictional, but the workflow question is real.`;
  const causes=[
    ["Unable to reach member","Contactability and timing","phone"],
    ["Scheduling friction","Access to DXA appointment","bmd"],
    ["Evidence arrives late","Claims or EMR latency","day90"]
  ];
  $("#failureCauses").innerHTML=causes.map(([a,b,id])=>`<div class="risk-item"><span class="risk-marker"></span><div><strong>${a}</strong><span>${b}</span></div><button data-pick-intervention="${id}">Select intervention →</button></div>`).join("");
  const bands=[["0–30",19],["31–60",31],["61–90",48],["91–120",61],["121–150",54],["151–180",42],["Expired",28]];
  const max=Math.max(...bands.map(b=>b[1]));
  $("#timeBands").innerHTML=bands.map(([label,value])=>`<div class="time-band"><div style="height:${value/max*150}px">${value}</div><small>Day ${label}</small></div>`).join("");
}

function renderDecisions(){
  const statuses=[...new Set(state.decisions.map(d=>d.status))];
  const current=$("#decisionFilter").value||"all";
  $("#decisionFilter").innerHTML=`<option value="all">All statuses</option>${decisionStatuses.map(s=>`<option ${s===current?"selected":""}>${s}</option>`).join("")}`;
  const q=$("#decisionSearch").value.toLowerCase();
  const list=state.decisions.filter(d=>(current==="all"||d.status===current)&&Object.values(d).join(" ").toLowerCase().includes(q));
  $("#decisionList").innerHTML=list.map(d=>`<article class="registry-card"><div class="meta"><span class="status-chip ${d.status.toLowerCase().replaceAll(" ","-")}">${d.status}</span><p>${d.id}</p><p>Review<br>${d.reviewDate}</p></div><div><h3>${d.title}</h3><p><strong>Decision:</strong> ${d.statement}</p><p><strong>Rationale:</strong> ${d.rationale}</p><p><strong>Success:</strong> ${d.successMeasure}</p></div><button class="text-button" data-edit-decision="${d.id}">Edit</button></article>`).join("")||`<div class="panel">No decisions match this filter.</div>`;
}
function renderAssumptions(){
  const categories=[...new Set(state.assumptions.map(a=>a.category))].sort(),current=$("#assumptionFilter").value||"all";
  $("#assumptionFilter").innerHTML=`<option value="all">All categories</option>${categories.map(c=>`<option ${c===current?"selected":""}>${c}</option>`).join("")}`;
  const q=$("#assumptionSearch").value.toLowerCase();
  const list=state.assumptions.filter(a=>(current==="all"||a.category===current)&&Object.values(a).join(" ").toLowerCase().includes(q)).sort((a,b)=>(a.confidence==="Low"?0:1)-(b.confidence==="Low"?0:1));
  $("#assumptionBody").innerHTML=list.map(a=>`<tr><td><strong>${a.name}</strong><br><small>${a.id} · ${a.source}</small></td><td>${a.category}</td><td><input class="assumption-value" data-assumption="${a.id}" type="number" value="${a.value}" step=".1" aria-label="${a.name} value"> ${a.unit}</td><td>${a.lower}–${a.upper}</td><td class="confidence-${a.confidence.toLowerCase()}">${a.confidence}</td><td>${a.impact}</td><td>${a.reviewDate}<br><small>${a.status}</small></td></tr>`).join("");
}
function renderRoadmap(){
  const statuses=["Backlog","Planned","In progress","Blocked"];
  $("#roadmapBoard").innerHTML=statuses.map(status=>`<section class="kanban-column"><h3>${status} · ${state.roadmap.filter(r=>r.status===status).length}</h3>${state.roadmap.filter(r=>r.status===status).map(r=>`<article class="kanban-card priority-${r.priority.toLowerCase()}"><strong>${r.initiative}</strong><span>${r.workstream}</span><br><span>Target ${r.target}</span><br><span>Depends on: ${r.dependency}</span></article>`).join("")}</section>`).join("");
  $("#roadmapBody").innerHTML=state.roadmap.map(r=>`<tr><td><strong>${r.initiative}</strong></td><td>${r.workstream}</td><td>${r.status}</td><td>${r.priority}</td><td>${r.target}</td><td>${r.dependency}</td></tr>`).join("");
}
function renderSearch(q=""){
  if(q.length<2){$("#searchResults").innerHTML=`<p class="callout">Type at least two characters. Search covers decisions, assumptions, interventions, risks, and roadmap initiatives.</p>`;return}
  const collections=[
    ["Decision","decisions",state.decisions,d=>`${d.title} ${d.statement} ${d.rationale}`],
    ["Assumption","assumptions",state.assumptions,a=>`${a.name} ${a.category} ${a.source}`],
    ["Intervention","portfolio",state.interventions,i=>`${i.name} ${i.barrier} ${i.evidence}`],
    ["Risk","cockpit",state.risks,r=>`${r.title} ${r.detail}`],
    ["Roadmap","roadmap",state.roadmap,r=>`${r.initiative} ${r.workstream} ${r.dependency}`]
  ];
  const results=collections.flatMap(([type,route,items,text])=>items.filter(item=>text(item).toLowerCase().includes(q.toLowerCase())).map(item=>({type,route,title:item.title||item.name||item.initiative,detail:text(item)}))).slice(0,20);
  $("#searchResults").innerHTML=results.map(r=>`<a href="#${r.route}" class="search-result" data-search-route="${r.route}"><strong>${r.type}: ${r.title}</strong><span>${r.detail.slice(0,150)}</span></a>`).join("")||`<p class="callout">No matching planning content.</p>`;
}
function renderAll(){
  renderTarget();renderCockpit();renderScenarios();renderPortfolio();renderJourney();renderDecisions();renderAssumptions();renderRoadmap();
}
function download(name,content,type="text/plain"){
  const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function executiveSummary(){
  const s=selectedScenario(),r=scenarioResult(s),t=targetResult();
  return `OMW STRATEGY STUDIO — SYNTHETIC PLANNING SUMMARY

Scenario: ${s.name}
Generated: ${new Date().toLocaleDateString()}

Planning outlook
- Synthetic denominator: ${number(s.denominator)}
- Baseline compliance: ${pct(s.baselineRate)}
- Planning target: ${pct(state.target.targetRate)}
- Projected final rate: ${pct(r.projectedRate)} (illustrative range ${pct(r.lowRate)}–${pct(r.highRate)})
- Expected incremental closures: ${number(r.incrementalClosures)}
- Staff hours: ${number(r.hours)} (${pct(r.capacityUtilization)} capacity utilization)
- Estimated portfolio cost: ${money(r.cost)}
- Estimated cost per incremental closure: ${money(r.costPerClosure)}

Target plan
- Required numerator: ${number(t.requiredNumerator)}
- Additional closures required after natural closures: ${number(t.additionalClosures)}
- Buffered operational closure target: ${number(t.bufferedClosures)}

Important: This planning artifact is based on synthetic or user-entered assumptions. It is not a company forecast and contains no validated company performance data.`;
}

function bindEvents(){
  window.addEventListener("hashchange",()=>routeTo(location.hash.slice(1)));
  $$("#nav a[data-route],.route-button").forEach(el=>el.addEventListener("click",event=>{event.preventDefault();const id=el.dataset.route||el.dataset.go;history.pushState(null,"",`#${id}`);routeTo(id)}));
  $("#menuButton").addEventListener("click",()=>{const nav=$(".sidebar");nav.classList.toggle("open");$("#menuButton").setAttribute("aria-expanded",nav.classList.contains("open"))});
  $("#targetForm").addEventListener("input",event=>{if(event.target.name){state.target[event.target.name]=Number(event.target.value);renderTarget();renderCockpit()}});
  $("#resetTarget").addEventListener("click",()=>{state.target=clone(defaults.target);renderTargetInputs();renderAll();showToast("Target assumptions restored")});
  $("#scenarioTabs").addEventListener("click",event=>{const tab=event.target.closest("[data-scenario]");if(tab){state.selectedScenarioId=tab.dataset.scenario;renderAll()}});
  $("#scenarioForm").addEventListener("input",event=>{if(event.target.name){selectedScenario()[event.target.name]=Number(event.target.value);renderAll()}});
  $("#preferScenario").addEventListener("click",()=>{state.scenarios.forEach(s=>s.preferred=s.id===state.selectedScenarioId);renderAll();showToast("Preferred scenario updated")});
  $("#duplicateScenario").addEventListener("click",()=>{const copy=clone(selectedScenario());copy.id=`custom-${Date.now()}`;copy.name=`${copy.name} copy`;copy.preferred=false;state.scenarios.push(copy);state.selectedScenarioId=copy.id;renderAll();showToast("Scenario duplicated locally")});
  $("#exportScenarios").addEventListener("click",()=>{const rows=[["scenario","projected_rate","low_rate","high_rate","incremental_closures","staff_hours","cost","capacity_utilization"],...state.scenarios.map(s=>{const r=scenarioResult(s);return[s.name,r.projectedRate,r.lowRate,r.highRate,r.incrementalClosures,M.round(r.hours,1),M.round(r.cost,0),r.capacityUtilization]})];download("omw-synthetic-scenario-comparison.csv",rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n"),"text/csv")});
  $("#interventionBody").addEventListener("change",event=>{if(event.target.dataset.intervention){const id=event.target.dataset.intervention;state.selectedInterventions=event.target.checked?[...new Set([...state.selectedInterventions,id])]:state.selectedInterventions.filter(x=>x!==id);renderPortfolio()}});
  $("#portfolioCapacity").addEventListener("input",e=>{state.portfolioCapacity=Number(e.target.value);renderPortfolio()});
  $("#portfolioBudget").addEventListener("input",e=>{state.portfolioBudget=Number(e.target.value);renderPortfolio()});
  $("#recommendPortfolio").addEventListener("click",()=>{const ranked=state.interventions.map(i=>({i,r:M.interventionResult(i)})).sort((a,b)=>(b.r.closures/(b.r.hours+1))-(a.r.closures/(a.r.hours+1)));let hours=0,cost=0;state.selectedInterventions=[];ranked.forEach(({i,r})=>{if(hours+r.hours<=state.portfolioCapacity&&cost+r.cost<=state.portfolioBudget){state.selectedInterventions.push(i.id);hours+=r.hours;cost+=r.cost}});renderPortfolio();showToast("Balanced portfolio recommended from entered constraints")});
  $("#funnelScenario").addEventListener("change",e=>{state.selectedScenarioId=e.target.value;renderAll()});
  $("#failureCauses").addEventListener("click",e=>{const b=e.target.closest("[data-pick-intervention]");if(b){state.selectedInterventions=[...new Set([...state.selectedInterventions,b.dataset.pickIntervention])];routeTo("portfolio");showToast("Intervention added to portfolio")}});
  $("#riskList").addEventListener("click",e=>{const b=e.target.closest("[data-risk-route]");if(b)routeTo(b.dataset.riskRoute)});
  $("#decisionFilter").addEventListener("change",renderDecisions);$("#decisionSearch").addEventListener("input",renderDecisions);
  $("#addDecision").addEventListener("click",()=>openDecision());
  $("#decisionList").addEventListener("click",e=>{const b=e.target.closest("[data-edit-decision]");if(b)openDecision(state.decisions.find(d=>d.id===b.dataset.editDecision))});
  $("#saveDecision").addEventListener("click",e=>{e.preventDefault();const form=$("#decisionForm"),fd=new FormData(form);if(!form.reportValidity())return;const id=fd.get("id")||`D-${String(state.decisions.length+1).padStart(3,"0")}`;const existing=state.decisions.find(d=>d.id===id);const data={id,title:fd.get("title"),status:fd.get("status"),owner:fd.get("owner")||"Owner placeholder",statement:fd.get("statement"),rationale:fd.get("rationale"),reviewDate:fd.get("reviewDate"),successMeasure:fd.get("successMeasure")};if(existing)Object.assign(existing,data);else state.decisions.push(data);$("#decisionDialog").close();renderAll();showToast("Decision saved in this browser tab")});
  $("#assumptionFilter").addEventListener("change",renderAssumptions);$("#assumptionSearch").addEventListener("input",renderAssumptions);
  $("#assumptionBody").addEventListener("change",e=>{if(e.target.dataset.assumption){const a=state.assumptions.find(x=>x.id===e.target.dataset.assumption);a.value=Number(e.target.value);if(a.id==="A-001"){state.target.currentDenominator=a.value;state.scenarios.forEach(s=>s.denominator=a.value)}if(a.id==="A-002")state.scenarios.forEach(s=>s.baselineRate=a.value);if(a.id==="A-003")state.scenarios.forEach(s=>s.naturalClosureRate=a.value);if(a.id==="A-004"){state.portfolioCapacity=a.value;state.scenarios.forEach(s=>s.capacityHours=a.value)}if(a.id==="A-005")state.scenarios.forEach(s=>s.overlapDiscount=a.value);if(a.id==="A-008")state.target.targetRate=a.value;renderTargetInputs();renderAll();showToast("Linked planning outputs updated")}});
  $("#exportAssumptions").addEventListener("click",()=>download("omw-synthetic-assumptions.json",JSON.stringify({notice:"Synthetic or user-entered planning assumptions; not company performance.",assumptions:state.assumptions},null,2),"application/json"));
  $$("[data-roadmap-view]").forEach(b=>b.addEventListener("click",()=>{$$("[data-roadmap-view]").forEach(x=>x.classList.toggle("active",x===b));$("#roadmapBoard").classList.toggle("hidden",b.dataset.roadmapView!=="board");$("#roadmapTablePanel").classList.toggle("hidden",b.dataset.roadmapView!=="table")}));
  $("#searchButton").addEventListener("click",()=>{$("#searchDialog").showModal();$("#globalSearch").focus();renderSearch("")});$("#globalSearch").addEventListener("input",e=>renderSearch(e.target.value));$("#searchResults").addEventListener("click",e=>{const a=e.target.closest("[data-search-route]");if(a){$("#searchDialog").close();routeTo(a.dataset.searchRoute)}});
  $("#exportButton").addEventListener("click",()=>download("omw-strategy-summary.txt",executiveSummary()));
  $("#resetAll").addEventListener("click",()=>{if(confirm("Restore all synthetic defaults? Local edits in this tab will be discarded.")){const route=$(".page.active").id;state=clone(defaults);state.selectedScenarioId="balanced";state.selectedInterventions=["provider_alert","bmd","phone","transport","day90"];state.portfolioCapacity=240;state.portfolioBudget=30000;renderTargetInputs();renderAll();routeTo(route);showToast("All synthetic defaults restored")}});
}
function openDecision(decision=null){
  const form=$("#decisionForm");form.reset();form.elements.status.innerHTML=decisionStatuses.map(s=>`<option>${s}</option>`).join("");
  if(decision)Object.keys(decision).forEach(key=>{if(form.elements[key])form.elements[key].value=decision[key]});
  $("#decisionDialogTitle").textContent=decision?"Edit decision":"Add decision";$("#decisionDialog").showModal();
}

renderTargetInputs();
bindEvents();
routeTo(location.hash.slice(1)||"cockpit");
