# Increasing HEDIS OMW Pass Rates: Evidence Review and Model Design

*Osteoporosis Management in Women who had a Fracture (OMW) — a referee-grade literature review, measure specification, and design blueprint for a predictive risk model and clinical outreach program.*

**Scope.** This report synthesizes 49 verified primary sources (all DOIs machine-verified, none retraction-flagged) across three evidence pillars — fracture-risk prediction models, secondary-prevention / Fracture Liaison Services, and quality-improvement outreach — and translates them into two linked, deployable designs: a predictive model that scores who is likely to fail the OMW measure, and a clinical outreach model that acts on those scores. Measure logic is described for **NCQA HEDIS MY2024** and is version-sensitive; confirm against the current NCQA Technical Specifications before implementation.

---

## Executive summary

- **The measure and the model are not the same target.** Published fracture-risk tools (FRAX, Garvan, QFracture) predict *who will fracture*. The OMW measure is failed by women who have *already* fractured and then miss testing or treatment within 180 days. Closing OMW gaps requires a second, distinct model that predicts **failure of the measure**, trained on the OMW-eligible denominator. This is the central design decision in this report.
- **Prediction ceilings are moderate, and complexity rarely pays.** Across validated tools and meta-analyses, discrimination sits around AUC/C-index 0.65-0.80 (hip better than composite endpoints). Machine learning does not consistently beat a well-calibrated Cox/logistic model (Lehmann 2024; Wu 2023). The design therefore prioritizes **calibration, external/temporal validation, and net benefit** over chasing AUC.
- **The most effective gap-closure strategy is well established.** Coordinator-led **Fracture Liaison Services** produce the largest, most consistent gains in post-fracture testing and treatment (Wu 2018), and **multi-component** interventions reliably beat single-component ones (Nayak 2018, meta-analysis of 43 RCTs). Single reminders underperform.
- **OMW failure is patterned - and therefore predictable.** In a Humana OMW cohort, failure was associated with patient, geographic, and provider characteristics (Boytsov 2017). This both justifies the failure-prediction model and defines its most important features.
- **Fairness is built in, not bolted on.** Because failure correlates with race, dual-eligibility, and deprivation, the model uses those signals to direct *more* outreach (and remove barriers), never to ration it - and integrated case-finding has been shown to *reduce* disparities (Navarro 2011).

**Deliverables in this package:** this combined report; the OMW measure specification brief; the predictive-model blueprint; the clinical-outreach model design; and the data tables/figures `literature_corpus.csv`, `prediction_models_comparison.csv`, `feature_catalog.csv`, `outreach_tactics.csv`, plus two figures.

---

## Part 1 - OMW measure specification brief

**Measure:** Osteoporosis Management in Women Who Had a Fracture (OMW)
**Steward:** NCQA (HEDIS) · **Program:** Medicare Stars (CMS Star Rating measure) · **Reference measurement year:** MY2024

> **Validation note.** Cut points, code sets, and exclusion logic below reflect the NCQA HEDIS MY2024 specification as summarized across payer implementation guides. HEDIS is re-published annually and OMW has migrated toward ECDS/administrative reporting; **confirm every value against the current-year NCQA HEDIS Technical Specifications (Volume 2) and the official value sets before coding it into production logic.** Values most likely to change year-to-year are the frailty/advanced-illness exclusion windows and the numerator/exclusion code sets.

---

## 1. What the measure counts

OMW is the percentage of women 67–85 years of age who sustained a qualifying fracture and who then received **either** a bone mineral density (BMD) test **or** a dispensed/prescribed osteoporosis medication **within 180 days (6 months) after the fracture**. A higher rate is better; the fracture is treated as a sentinel event that should trigger osteoporosis evaluation and, where indicated, treatment. This is a Medicare product-line measure reported administratively (claims) with supplemental data permitted, and it feeds the CMS Star Rating.

The clinical premise is that a fragility fracture is itself diagnostic of underlying skeletal fragility: the fracture is the opportunity, and the 6-month window is the deadline to act on it. Nationally, only a minority of eligible women — payer education materials commonly cite roughly one in five — receive post-fracture testing or treatment, so the measure captures a large, addressable care gap rather than a rare failure.

---

## 2. Denominator (eligible population)

A member enters the denominator when **all** of the following hold:

1. **Age:** 67–85 years as of December 31 of the measurement year.
2. **Sex:** administrative gender female at any point in the member's history.
3. **Enrollment:** continuously enrolled from **365 days before the episode date through 180 days after** the episode date (Medicare, medical + pharmacy benefit).
4. **Qualifying fracture during the intake period** — captured as any of:
   - an outpatient visit with a fracture diagnosis,
   - an ED visit with a fracture diagnosis, or
   - an acute or non-acute inpatient discharge with a fracture on the discharge claim.

**Intake period:** July 1 of the year prior to the measurement year through June 30 of the measurement year. The intake period exists to capture the member's **first** qualifying fracture; the 6-month numerator clock then runs from that fracture, so gaps can still close after June 30 (through roughly December 31) as long as care falls within 180 days of the index fracture.

**Key date definitions:**

| Term | Definition |
|---|---|
| **Episode date** | For an outpatient or ED visit: the date of service. For an inpatient stay: the **date of discharge**. For direct transfers: the discharge date from the **last** admission. |
| **IESD (Index Episode Start Date)** | The earliest episode date in the intake period that meets all eligible-population criteria. The numerator window is measured from the IESD. |

The inpatient "discharge date" rule matters operationally: for a hospitalized hip fracture, the 180-day clock starts at discharge, not at admission or at the surgery date.

---

## 3. Numerator (gap closure)

The member is compliant if, **on the IESD or within the 180 days after it**, they have **either**:

- **A BMD test** in any setting (e.g., central DXA), OR
- **Osteoporosis medication therapy** — a dispensed prescription or an administered/infused agent.

Representative code families used to identify the numerator (illustrative, not exhaustive — always use the current NCQA value sets):

- **BMD tests:** CPT 76977, 77078, 77080, 77081, 77085, 77086; plus ICD-10-PCS BMD-study codes.
- **Osteoporosis pharmacotherapy:** oral and injectable agents (bisphosphonates — alendronate, risedronate, ibandronate, zoledronic acid; denosumab; raloxifene; teriparatide/abaloparatide; romosozumab; calcitonin). Administered/infused agents appear via HCPCS J-codes (e.g., J0897 denosumab, J1740 ibandronate, J3110 teriparatide, J3489 zoledronic acid).

Either action closes the gap; both are not required. A BMD test closes the gap even if it is normal, because the measure rewards evaluation.

---

## 4. Exclusions

A member who otherwise qualifies is **removed** from the denominator if any of the following apply:

**Prior management (already appropriately managed — the fracture is not a new opportunity):**
- BMD test within **24 months before** the episode date.
- Osteoporosis therapy or a dispensed osteoporosis prescription within **12 months before** the episode date.

**Non-qualifying fracture site:**
- Fractures of the **finger, toe, face, or skull** are not counted (these are not fragility-fracture sentinels).

**Advanced illness / frailty and end-of-life (from July 1 of the prior year through December 31 of the measurement year):**
- Hospice or palliative care.
- Members 67–80 with **advanced illness and frailty** (two indications of frailty plus an advanced-illness marker or dispensed dementia medication).
- Members **81 and older with frailty**.
- Institutional SNP (I-SNP) enrollment or long-term institutional residence.

The prior-management exclusions are the reason "the patient is already on a bisphosphonate" does not hurt the score — they are removed rather than counted as failures. Conversely, a member with a **stale** BMD (>24 months) or **lapsed** therapy (>12 months) remains in the denominator and must be re-evaluated within the window.

---

## 5. Common operational failure modes

These are the recurring, addressable reasons eligible women end up as measure failures — each is a lever for the predictive/outreach model.

1. **The fracture is never recognized as a measure trigger by the care team.** A wrist or vertebral fracture managed in an ED or urgent-care setting generates the qualifying claim, but no one owns the downstream osteoporosis workup. Care fragmentation between the treating orthopedist/ED and the primary care physician is the dominant failure pattern.
2. **The 180-day window closes before anyone acts.** Six months feels long but is easily consumed by fracture healing, rehab, and deferred follow-up. Members whose index fracture lands late in the intake period have the least slack.
3. **Inpatient hip fractures discharged without a plan.** The discharge-date clock start plus a focus on surgical recovery means osteoporosis pharmacotherapy is frequently not initiated before discharge and is not picked up outpatient.
4. **Vertebral compression fractures found incidentally** (on imaging for another indication) may not be coded prominently or communicated, so the trigger is silent.
5. **Coding hygiene creates false positives that cannot be self-corrected.** Coding an **old or unconfirmed** fracture as new (e.g., a healed fracture carried forward, or a "history of" event coded as acute) inappropriately pulls a member into the denominator. The **only** way to remove such a member is to submit a **corrected claim** — there is no retrospective exclusion for a mis-coded trigger.
6. **Stale prior management is misread as protective.** Teams assume a member "already had a DXA" or "is on treatment," not realizing the exclusion requires the BMD within 24 months / therapy within 12 months; lapsed cases stay in the denominator and fail silently.
7. **Access and adherence barriers on the member side** — transportation to DXA, cost concerns about infusions, bisphosphonate hesitancy, and low health literacy — convert an ordered test/prescription into an unfilled gap.

---

## 6. Implications for modeling and outreach

The specification defines the entire target and timeline for the downstream model:

- The **denominator entry event** (qualifying fracture in the intake period) is the trigger to score a member; the model must run **as soon as the fracture claim lands**, because the 180-day clock is already running.
- The **numerator** (BMD or medication within 180 days) is the label; "failure" is the absence of either action by day 180 post-IESD.
- The **exclusions** define who to suppress from outreach (already-managed, frailty/advanced-illness, hospice) to avoid wasted effort and inappropriate contact.
- The **failure modes** map directly to intervention targets: fragmentation → care-manager handoff; late index fractures → prioritize by days-remaining-in-window; inpatient hip → in-hospital treatment initiation; coding false positives → a claims-review lane rather than clinical outreach.

---

## Part 2 - Fracture-risk prediction models: what the evidence says

## Fracture-risk prediction models

Fracture-risk prediction has matured along two tracks that a plan should treat as complementary rather than competing: parsimonious clinical-risk-factor tools designed for the point of care, and data-hungry statistical/machine-learning models designed to run over the same administrative and EHR data a health plan already holds. The practical lesson from two decades of validation work is that discrimination is only moderate for any of them, that hip fracture is consistently easier to predict than the broader "any osteoporotic fracture" endpoint, and that calibration to the local population matters more than the choice of algorithm.

The reference tool is **FRAX**, which estimates 10-year probabilities of major osteoporotic and hip fracture from a fixed set of clinical risk factors — age, BMI, prior fracture, parental hip fracture, glucocorticoid use, rheumatoid arthritis, smoking, and alcohol — with or without femoral-neck BMD, calibrated country by country ([Kanis 2008](https://doi.org/10.1007/s00198-007-0543-5)). Its strength is portability and guideline endorsement; its ceiling is discrimination in the 0.65–0.75 range for major osteoporotic fracture, better for hip. The **Garvan** calculator takes a deliberately different design stance, using counts of prior fractures and falls rather than binary flags, and in a large Manitoba registry it stratified risk with a strong gradient and outperformed clinical risk factors and BMD used alone ([Nguyen 2008](https://doi.org/10.1007/s00198-008-0588-0); [Agarwal 2021](https://doi.org/10.1007/s00198-021-06252-3)). **QFracture** goes furthest toward the health-plan use case: it is derived entirely from routine primary-care records across roughly thirty variables and requires no BMD, which makes it computable from data a payer already has ([Hippisley-Cox 2012](https://doi.org/10.1136/bmj.e3427)).

Head-to-head evaluation keeps these claims honest. In an independent New Zealand cohort of older postmenopausal women with near-normal BMD, both FRAX and Garvan discriminated fracture only modestly and showed imperfect calibration, a reminder that a tool validated in one population can misestimate absolute risk in another ([Bolland 2010](https://doi.org/10.1002/jbmr.215)). A retrospective comparison of FRAX, Garvan, and QFracture on population-based UK electronic health records found all three usable but none dominant, with hip fracture better discriminated than the composite osteoporotic endpoint and calibration the recurring weak point ([Dagan 2017](https://doi.org/10.1136/bmj.i6755)). The FRAX consortium continues to refine inputs rather than replace the model — incorporating previous falls, quantified from an individual-level meta-analysis of 46 cohorts ([Vandenput 2024](https://doi.org/10.1007/s00198-023-07012-1)), and updating the BMI relationship from 63 cohorts spanning 1.7 million people ([Harvey 2025](https://doi.org/10.1093/jbmr/zjaf091)) — which is itself evidence that the marginal predictive value of any single new factor is small.

The machine-learning literature has largely confirmed, not overturned, that picture. A meta-analysis of 53 studies, 86 models, and more than 15 million patients put the pooled C-index for ML fracture-risk models near 0.80 but with high heterogeneity and predominantly internal validation ([Wu 2023](https://doi.org/10.1136/bmjopen-2022-071430)), and a systematic review of AI/ML hip-fracture models reached a similar verdict of promising but externally under-validated performance ([Cha 2023](https://doi.org/10.11005/jbm.2023.30.3.245)). The most informative single study for a payer is the Swiss Osteoporosis Registry analysis, which trained traditional survival models and machine-learning survival models on the same data and validated both externally in the UK Biobank: the machine-learning models did not consistently beat a well-specified Cox model, and the clinical risk factors that mattered were the familiar ones ([Lehmann 2024](https://doi.org/10.1093/jbmr/zjae089)). Where ML earns its place is in exploiting data a fixed-form tool cannot — high-dimensional EHR features, opportunistic imaging, and comorbidity patterns — and in producing a score that runs automatically over the plan's own records rather than requiring a clinician to enter risk factors. Common-data-model implementations demonstrate this operational advantage: a Korean OMOP-CDM score built from prior fracture, age, spine and hip T-scores, and cardiovascular disease was developed and validated across independent hospital cohorts, showing that a model can be portable across institutions when it is built on a shared data schema ([Kong 2023](https://doi.org/10.1007/s00198-023-06787-7)). Simpler ML pipelines over survey and claims-style features also reproduce moderate-to-good discrimination while identifying which women should proceed to densitometry ([Shim 2020](https://doi.org/10.1007/s11657-020-00802-8); [Wu 2023b](https://doi.org/10.3346/jkms.2023.38.e162)).

Two design implications follow directly for an OMW model. First, because discrimination is intrinsically moderate and calibration is fragile across populations, the right target for a health plan is not a marginally better AUC but a model **calibrated to its own membership and validated temporally**, with decision-curve analysis to confirm it adds net benefit at the operating threshold that outreach capacity can actually serve. Second, the fracture-risk literature answers only half the question. These tools predict *who will fracture*; the OMW measure is failed by women who *have already fractured* and then do not receive testing or treatment. That gap — the probability of failing the measure given a qualifying fracture — is a distinct prediction target that the fracture-risk tools were never built for, and it is where the modeling design in this report departs from the published risk calculators.

![Reported discrimination of eight fracture-risk models. Traditional clinical tools (blue) and machine-learning models (red); whiskers span reported ranges, dotted line marks AUC 0.70. Discrimination is moderate across the board and ML does not consistently exceed calibrated traditional tools.]({{artifact:art_5c57e761-3345-4ddb-9a19-af906d216c7e}})

A model-by-model comparison with key references and verified DOIs is provided in `prediction_models_comparison.csv`.

---

## Part 3 - Closing the OMW gap: what actually works

## Closing the OMW gap: what actually works

The starting condition is stark and well documented: most people who sustain a fragility fracture are never evaluated or treated for the underlying osteoporosis. In a five-year prospective Canadian cohort, 90% of men with fragility fractures remained undiagnosed and untreated ([Papaioannou 2008](https://doi.org/10.1007/s00198-007-0483-0)), and the pattern in older women — the OMW population — is the same order of magnitude. The intervention literature is therefore not about discovering that a gap exists but about ranking the strategies that close it, and the ranking is unusually consistent across systematic reviews.

The strongest and most reproducible intervention is the **Fracture Liaison Service (FLS)** — a coordinator-led model, typically nurse-run, that systematically identifies every patient presenting with a fragility fracture and drives them through evaluation and treatment initiation. A systematic review and meta-analysis of FLS programs found consistent, substantial increases in BMD testing and osteoporosis treatment initiation relative to usual care ([Wu 2018](https://doi.org/10.1016/j.bone.2018.03.018)), and a companion structured review isolated the design features that separate effective services from ineffective ones: a dedicated coordinator, an identification step that captures fractures across care settings rather than relying on referral, and enough intensity to follow patients through to a filled prescription or completed scan rather than stopping at a recommendation ([Wu 2018b](https://doi.org/10.1007/s00198-017-4370-z)). For a health plan, the FLS is the reference design because its mechanism maps one-to-one onto the OMW numerator: it exists precisely to convert a fracture into a BMD test or a medication within the post-fracture window.

Where a full FLS is not feasible, the evidence points to **multi-component quality-improvement interventions** as the next best thing, and — critically — warns against expecting much from single-component ones. The definitive synthesis is a meta-analysis of 43 randomized studies which found that strategies combining provider education, reminders, and care coordination produced the largest gains in DXA testing and treatment initiation, while interventions acting on only one lever were substantially weaker ([Nayak 2018](https://doi.org/10.1002/jbmr.3437)). This is the single most important design constraint for an outreach program: bundling matters, and a lone patient mailer or a lone provider alert will underperform. Consistent with that, a randomized trial that "primed" primary care physicians after a patient's fragility fracture increased treatment initiation over standard care, with a more intensive, repeated-contact arm outperforming a minimal one ([Roux 2013](https://doi.org/10.3899/jrheum.120908)).

The remaining tactics are best understood as components that a plan assembles into the bundle, each targeting a specific failure mode from the measure specification. For the highest-risk and most-often-missed group — hospitalized hip fractures — **initiating osteoporosis medication during the admission itself** converts a discharge that would otherwise fail the measure into a compliant one, and a Plan-Do-Study-Act quality initiative reported a marked rise in patients meeting standard of care once in-hospital treatment was offered ([Kuiper 2018](https://doi.org/10.1007/s00198-018-4416-x)). **Pharmacist-led case-finding**, in which a clinical pharmacist identifies untreated post-fracture patients and recommends BMD testing and pharmacotherapy, improved screening and treatment initiation among elderly patients ([Nadrash 2008](https://doi.org/10.1345/aph.1K541)) and is attractive to a plan because it can be run centrally against pharmacy and medical claims. The identification step itself can be automated: continuous EHR screening in a large integrated health plan improved DXA and treatment rates and, notably, reduced ethnic disparities in post-fracture care ([Navarro 2011](https://doi.org/10.1007/s11999-011-1852-8)), and natural-language processing over imaging reports can surface osteoporotic fractures that never generate a prominent diagnosis code, prompting a physician reminder ([Bolton 2024](https://doi.org/10.1071/AH24214)). Adding vertebral fracture assessment to an FLS pathway surfaces silent vertebral fractures that reclassify risk and prompt treatment ([Greene 2023](https://doi.org/10.1136/bmjoq-2023-002303)).

Two studies speak directly to the health-plan and HEDIS framing and should anchor a payer's strategy. First, member-experienced care coordination is associated with measurably better HEDIS clinical-process performance: linking Medicare Advantage CAHPS care-coordination reports to individual HEDIS records across 152,069 beneficiaries showed that beneficiaries reporting better coordination performed better on clinical-process measures ([Elliott 2021](https://doi.org/10.1007/s11606-021-07122-8)), which frames care coordination as a plan-level lever rather than only a clinic-level one. Second — and most directly actionable for a predictive model — an analysis of the OMW measure in a Humana cohort of women 67–85 identified the patient and provider characteristics associated with *failing* the measure, including race, geographic region, and care setting ([Boytsov 2017](https://doi.org/10.1177/1062860617691123)). That study is effectively a feature-importance study for the OMW-failure prediction target, and it establishes that failure is patterned and therefore predictable — the premise the outreach model depends on.

The synthesis for program design is straightforward. Build the outreach model around an FLS-style coordinated pathway; make every touch multi-component rather than a lone reminder; place a dedicated in-hospital pathway for hip fractures; use automated EHR/claims case-finding to feed identification and to guard against the disparities the measure can otherwise entrench; and use a predictive model to concentrate the most intensive (and most expensive) coordinator effort on the women the evidence says are most likely to fail. What the literature cannot supply is the plan's own capacity constraint — how many women a care team can actually reach within the 180-day window — which is exactly why the intervention evidence has to be paired with a risk model that ranks whom to call first.

![Gap-closure strategies ranked by evidence strength (x-axis) and reported impact on post-fracture testing/treatment (y-axis), colored by intervention target. Fracture Liaison Services and multi-component QI occupy the strong-evidence/large-impact corner.]({{artifact:art_811136f0-4ab6-44e6-9db6-da3af6f1883c}})

The full tactic catalogue - mechanism, target, reported effect, evidence tier, HEDIS relevance, and verified DOI for each - is in `outreach_tactics.csv`.

---

## Part 4 - Predictive model design blueprint

## 1. The central design decision: two targets, not one

The most consequential choice in this program is recognizing that "score women at risk" and "score women likely to fail the HEDIS measure" are **two different prediction problems** that require two different models trained on two different populations. The published fracture-risk calculators (FRAX, Garvan, QFracture) answer the first; none of them answers the second, because the OMW measure is failed by women who have *already* fractured and then do not receive testing or treatment. Conflating them produces a model that ranks women by fracture risk when the plan actually needs to rank them by the probability of an open, closable care gap within a 180-day clock.

**Model A — Fracture-risk / screening model.** Population: the broader eligible female membership (roughly 50+, and especially 67–85) without a recent fracture. Target: incident major osteoporotic or hip fracture within a defined horizon (e.g., 2 years). Purpose: primary prevention and pre-emptive BMD testing so that osteoporosis is diagnosed and treated *before* a fracture forces the OMW clock to start. This is the model with published precedent, and its realistic ceiling is a C-index around 0.70–0.80 (better for hip).

**Model B — OMW-failure model (the operational core).** Population: exactly the OMW-eligible denominator — women 67–85 with a qualifying fragility fracture in the intake period, continuously enrolled, not excluded. Target: **failure of the measure**, i.e., no BMD test and no osteoporosis medication in the 180-day post-episode window. Purpose: rank the current gap list so that finite coordinator capacity is spent first on the women least likely to close the gap on their own. This is the model the outreach program consumes daily, and its evidentiary anchor is Boytsov 2017, which showed OMW failure is patterned by patient, geographic, and provider characteristics in a real health-plan cohort.

The two models are sequential in the patient journey — A tries to prevent the fracture; B manages the gap once a qualifying fracture has occurred — and they share much of their feature infrastructure while differing in population, label, and time horizon.

## 2. Target definition (Model B, in detail)

- **Unit of analysis:** one row per qualifying fracture episode for an OMW-eligible woman (the denominator event), anchored on the Index Episode Start Date / discharge date.
- **Label:** `fail = 1` if, by day 180 after the episode date, the member has neither a qualifying BMD test nor a dispensed/administered osteoporosis medication; `fail = 0` if either numerator component is met. This mirrors the measure logic exactly (see the OMW measure specification brief).
- **Scoring time:** the model must score at (or within days of) the episode date, using only information available then — no post-episode leakage. The 180-day outcome is what you predict; nothing observed after the episode may be a feature.
- **Censoring:** members who disenroll before day 180 leave the denominator under the measure's continuous-enrollment rule; handle them per specification rather than labeling them as failures.
- **Exclusions as a modeling boundary:** women excluded from the denominator (prior BMD within 24 months, prior therapy within 12 months, frailty/advanced-illness, hospice, non-qualifying sites) are removed *before* modeling — the model predicts within the true denominator, not the raw fracture population. Some exclusion signals (frailty, prior therapy) are still useful features for edge cases and for a separate "should this person even be in scope" check.

## 3. Feature catalog

The full catalog is provided as `feature_catalog.csv` — 29 features across eight domains (demographics, geography/SDOH, fracture event, clinical/BMD, medication, comorbidity, utilization, provider), each tagged to Model A, Model B, or both, with data source and rationale. The design principles behind it:

- **Everything computable from data a plan already holds.** Enrollment, medical claims, pharmacy claims, provider directory, and address-derived SDOH. This is the QFracture/common-data-model philosophy (Hippisley-Cox 2012; Kong 2023): no reliance on a clinician entering risk factors, so the score runs automatically over the whole gap list.
- **Model A leans on the validated fracture predictors** — age, prior fracture count, prior falls, glucocorticoids, BMI, T-score where present, cardiovascular disease — the same factors the FRAX consortium keeps confirming (Vandenput 2024 falls; Harvey 2025 BMI).
- **Model B leans on access, engagement, and provider features** — distance to a DXA facility, area deprivation, medication adherence history, PCP attribution and visit frequency, prior HEDIS-gap performance, treating-provider specialty and panel OMW rate, and FLS availability. These encode *why a gap stays open*, which is a different construct from *why a bone breaks*. Boytsov 2017's finding that provider and regional factors predict OMW failure is what motivates the provider-level and geographic block.
- **Fracture site and setting** appear in both models: site drives recurrence risk (Model A) and simultaneously routes the patient into a specific care pathway that changes closure probability (Model B — an inpatient hip fracture has a natural in-hospital treatment opportunity that an outpatient wrist fracture does not).

## 4. Algorithm choice

The evidence does not justify reaching for the most complex model available. Lehmann 2024 trained ML survival models and a well-specified Cox model on the same registry and validated both externally; the ML models did **not** consistently beat Cox, and the meta-analytic pooled C-index for ML fracture models (~0.80, Wu 2023) came with high heterogeneity and mostly internal validation. The implication is a staged approach:

1. **Baseline / benchmark:** penalized logistic regression (Model B) and a Cox proportional-hazards model (Model A). Transparent, well-calibrated, easy to audit for fairness, and — per Lehmann — often within striking distance of anything fancier. This is the model you can defend to a clinical committee and a regulator.
2. **Primary candidate:** gradient-boosted trees (XGBoost/LightGBM). They handle the mixed-type, missing-heavy, nonlinear claims feature space well, and they are the workhorse behind most of the strong ML results in the review literature. Use monotonic constraints on clinically-directional features (e.g., age, prior fracture count) to keep the model sensible.
3. **Only if it earns net benefit:** more complex ensembles or neural approaches, adopted **only** if they beat the boosted-tree model on *external/temporal* validation and on decision-curve net benefit at the operating threshold — not on AUC in cross-validation. The review evidence says this bar is rarely cleared.

Calibration is treated as a first-class deliverable, not an afterthought: fit isotonic or Platt calibration on a held-out set, because every downstream decision (whom to call, in what tier) depends on the predicted probability being meaningful, and the literature is unanimous that fracture-model calibration degrades across populations.

## 5. Validation plan

- **Temporal (out-of-time) validation is mandatory.** Train on earlier measurement years, validate on the most recent — this is the honest analogue of how the model will be deployed (scoring next year's gap list) and it catches specification drift when NCQA updates the measure.
- **Geographic/plan cross-validation** if the plan spans regions, to confirm the model does not simply learn one market.
- **Discrimination:** report C-index/AUC with confidence intervals, but treat it as necessary-not-sufficient given the moderate ceiling.
- **Calibration:** calibration plots and calibration-in-the-large + slope, by decile and within key subgroups.
- **Clinical utility:** decision-curve analysis to confirm net benefit at the threshold outreach capacity can actually serve, plus the operational metric that matters — **precision/recall of the top-K gap list**, since the program will work a ranked list of fixed length, not a probability cutoff.
- **Benchmark against the trivial baselines** (e.g., "call all hip fractures," "call everyone with no PCP visit") so the model's incremental value over a simple rule is explicit.

## 6. Fairness and governance

This is non-negotiable given the target. OMW failure is correlated with race, dual-eligibility, and neighborhood deprivation (Boytsov 2017; and Navarro 2011 showed integrated case-finding can *reduce* disparities). A model that ranks whom to help must not become a model that quietly deprioritizes the already-underserved.

- **Use protected and SDOH attributes for auditing and for directing *more* outreach, never for rationing it.** The failure model should surface access barriers so the program can remove them, not treat them as reasons to give up on a member.
- **Subgroup performance parity:** report discrimination, calibration, and — most importantly — outreach *reach* and gap-closure rates by race, dual status, rurality, and ADI. Equal opportunity to be contacted is the operational fairness criterion.
- **Reciprocal design:** because low predicted closure often reflects access friction, pair a high failure-risk score with the intervention that addresses the specific barrier (transportation/telehealth for distance, in-hospital initiation for inpatient hip fractures) rather than a generic reminder. This links Model B directly to the outreach model.
- **Transparency and drift monitoring:** ship SHAP-style explanations for each member's tier, log feature and outcome drift each measurement year, and re-validate whenever NCQA revises the OMW specification (the measure logic is version-sensitive, per the measure brief).

## 7. How the two models feed the program

Model A runs on the general eligible population to drive pre-fracture BMD testing and treatment (keeping women out of the OMW denominator in the best possible way — by preventing the fracture). Model B runs continuously on the live OMW gap list, scoring each newly qualifying fracture at the episode date and ranking it by failure probability so the outreach model (next section of this report) can assign the right intervention intensity within the 180-day window. The predicted-failure score is the input to risk tiering; the outreach model is what turns a tier into an action.

The complete feature specification (29 features across eight domains, tagged to each model with data source and rationale) is in `feature_catalog.csv`.

---

## Part 5 - Clinical outreach model design

## 1. Purpose and operating principle

The outreach model turns the Model B failure score (see the predictive model blueprint) into concrete action within the 180-day post-episode window. Its operating principle comes directly from the intervention evidence: the single most effective strategy is a coordinated, Fracture-Liaison-Service-style pathway (Wu 2018), and multi-component interventions consistently beat single-component ones (Nayak 2018). The model therefore does not choose *whether* to intervene multi-modally — it always does — it chooses *how intensely*, and *which barrier-specific* action to lead with, based on the member's predicted failure risk and the feature pattern driving that risk.

The unit of work is the **live OMW gap list**: every newly qualifying fracture episode, scored at the episode date and re-scored as the window elapses. The clock is the constraint. A member scored on day 5 has ~175 days of runway; one identified late (a delayed claim) may have far less, and time-to-deadline is itself an input to tier assignment.

## 2. Risk tiering

Members are stratified by predicted failure probability into three action tiers, with tier cut-points set by outreach *capacity* (a top-K operating point), not by an abstract probability threshold — the program works a ranked list of the length its coordinators can actually staff.

- **Tier 1 — High failure risk (intensive / FLS-equivalent).** The top of the ranked list: high predicted failure probability, typically driven by access barriers (no attributed PCP, long DXA distance, high deprivation), low historical adherence, or an outpatient/ED fracture with no natural follow-up. These members receive the full coordinator-led pathway — a named care coordinator, active scheduling of BMD testing, provider engagement, and barrier removal — because the evidence says this is the only thing that reliably moves the hardest cases.
- **Tier 2 — Moderate failure risk (structured multi-component).** Middle of the list: a bundled but less labor-intensive package — provider alert plus patient outreach plus a scheduling assist — reflecting Nayak's finding that bundles work and single touches do not.
- **Tier 3 — Low failure risk (light-touch / monitoring).** Members likely to close the gap on their own (engaged, has PCP, already scheduled). A single reminder and passive monitoring; escalate to Tier 2 if the gap is still open at a mid-window checkpoint (e.g., day 90).

A parallel **hip-fracture / inpatient fast-track** overrides tiering: any qualifying hip fracture identified during an admission is routed to in-hospital treatment initiation (Kuiper 2018) regardless of score, because that is the highest-risk group and the in-admission window is the best single opportunity to close the gap.

## 3. Intervention mapping (barrier → tactic)

Because a high failure score often encodes *why* the gap will stay open, the model pairs the score with the barrier-specific tactic rather than a generic reminder. This reciprocal design is what keeps a "whom to help" model from becoming a "whom to abandon" model.

| Dominant barrier (from features) | Lead intervention |
|---|---|
| No attributed PCP / no usual source of care | Assign/connect to PCP; coordinator owns scheduling end-to-end |
| Long distance / no nearby DXA facility | Mobile DXA, telehealth osteoporosis visit, or pharmacy-based initiation to bypass testing friction |
| Inpatient hip fracture | In-hospital treatment initiation before discharge (fast-track) |
| Low medication-adherence history | Pharmacist-led counseling + simplified regimen + refill support |
| Provider with low panel OMW rate | Provider-directed education, order-set prompts, panel-level gap reports |
| Silent/under-coded vertebral fracture | VFA / imaging review to confirm and prompt treatment |
| High deprivation / dual-eligible | SDOH navigation, transportation support, prioritized coordinator time |

Every tier's package is multi-component; this table sets the *lead* action that addresses the member's specific friction.

## 4. Workflow

1. **Identify (continuous):** automated case-finding over medical claims, pharmacy claims, and imaging reports (NLP where available — Bolton 2024; Navarro 2011) flags every qualifying fracture and constructs the denominator, applying exclusions from the measure specification. Continuous EHR/claims screening is emphasized because it both feeds the list and guards against the disparities manual referral tends to entrench.
2. **Score & tier (daily):** Model B scores each new episode; tier is assigned from score + time-to-deadline + dominant-barrier feature.
3. **Assign & act:** route to the matching pathway (Tier 1 coordinator, Tier 2 bundle, Tier 3 reminder, or hip fast-track). Provider-facing and member-facing components fire together, not sequentially.
4. **Track to closure:** monitor for the numerator event (BMD claim or osteoporosis dispense). Re-score at mid-window checkpoints; escalate members whose gap remains open as the deadline approaches.
5. **Close or document:** record closure, or document exclusion/disenrollment per specification.
6. **Feed back:** closure outcomes become next cycle's training labels for Model B and next cycle's provider panel-rate features — the program is a closed learning loop.

## 5. Evidence-based tactics (ranked)

The specific tactics, their mechanisms, targets, reported effects, evidence tier, and HEDIS relevance are catalogued in `outreach_tactics.csv` and summarized in the accompanying effect-size figure. In brief, ranked by strength of evidence and expected impact:

1. **Fracture Liaison Service / coordinator-led pathway** (strongest; Wu 2018) — the backbone of Tier 1.
2. **Multi-component QI bundle** (strong meta-analytic support; Nayak 2018) — the default for every tier.
3. **PCP priming after fracture** (RCT; Roux 2013) — provider component.
4. **Inpatient treatment initiation for hip fracture** (QI; Kuiper 2018) — the fast-track.
5. **Pharmacist-led case-finding and initiation** (QI; Nadrash 2008) — central, claims-driven, scalable.
6. **Automated EHR/NLP case-finding with disparity reduction** (program evaluation; Navarro 2011, Bolton 2024) — the identification engine.
7. **VFA integration** (QI; Greene 2023) — surfaces silent qualifying fractures.
8. **Plan-level care coordination** (observational, HEDIS-linked; Elliott 2021) — the organizational enabler.

## 6. Success metrics and targets

- **Primary:** OMW rate (numerator/denominator) overall and, critically, **within subgroups** — the fairness criterion is that gap-closure improves for the historically-failing groups (Boytsov 2017), not just on average.
- **Operational:** top-K list precision (share of worked members who would have failed without contact), coordinator contact rate, and time-from-episode-to-closure.
- **Reach equity:** outreach contact and closure rates by race, dual status, rurality, and deprivation — monitored so the intensive pathway reaches the members who need it most.
- **Leading indicators within the window:** BMD scheduled by day 60, medication initiated by day 90 — early signals that predict end-of-window closure while there is still time to escalate.

## 7. Link back to the predictive model

The outreach model consumes two scores. Model A (fracture risk) drives *pre-fracture* prevention — BMD testing and treatment before a fracture ever starts the OMW clock. Model B (OMW-failure risk) drives the live gap list and sets tier and lead-tactic. The intervention that a tier triggers is chosen to address the specific barrier the failure model surfaced, closing the loop: prediction identifies who and why; outreach supplies the matched, evidence-based how.

---

## References

*All 49 DOIs below were machine-verified against CrossRef; none were retraction-flagged at time of compilation.*

1. Agarwal (2021). *Predictive performance of the Garvan Fracture Risk Calculator: a registry-based cohort study.* {'title': 'Osteoporosis international : a journal established as result of cooperation between the European Foundation for Osteoporosis and the National Osteoporosis Foundation of the USA', 'iso_abbreviation': 'Osteoporos Int'}. https://doi.org/10.1007/s00198-021-06252-3
2. Alves (2026). *An orthogeriatric quality improvement initiative from the European Academy for Medicine of Ageing (EAMA): enhancing osteoporosis treatment and fall prevention.* {'title': 'European geriatric medicine', 'iso_abbreviation': 'Eur Geriatr Med'}. https://doi.org/10.1007/s41999-026-01497-9
3. Amarnath (2023). *Classification of Osteoporosis.* {'title': 'Indian journal of orthopaedics', 'iso_abbreviation': 'Indian J Orthop'}. https://doi.org/10.1007/s43465-023-01058-3
4. Bolland (2010). *Evaluation of the FRAX and Garvan fracture risk calculators in older women.* {'title': 'Journal of bone and mineral research : the official journal of the American Society for Bone and Mineral Research', 'iso_abbreviation': 'J Bone Miner Res'}. https://doi.org/10.1002/jbmr.215
5. Bolton (2024). *A quality improvement project to increase treatment rates of osteoporosis in general practice.* {'title': 'Australian health review : a publication of the Australian Hospital Association', 'iso_abbreviation': 'Aust Health Rev'}. https://doi.org/10.1071/AH24214
6. Boytsov (2017). *Patient and Provider Characteristics Associated With Optimal Post-Fracture Osteoporosis Management.* {'title': 'American journal of medical quality : the official journal of the American College of Medical Quality', 'iso_abbreviation': 'Am J Med Qual'}. https://doi.org/10.1177/1062860617691123
7. Cha (2023). *Effect of Artificial Intelligence or Machine Learning on Prediction of Hip Fracture Risk: Systematic Review.* {'title': 'Journal of bone metabolism', 'iso_abbreviation': 'J Bone Metab'}. https://doi.org/10.11005/jbm.2023.30.3.245
8. Chen (2022). *Development and Validation of Machine Learning Models for Prediction of Fracture Risk in Patients with Elderly-Onset Rheumatoid Arthritis.* {'title': 'International journal of general medicine', 'iso_abbreviation': 'Int J Gen Med'}. https://doi.org/10.2147/IJGM.S380197
9. Cosman (2014). *Clinician’s Guide to Prevention and Treatment of Osteoporosis* Osteoporosis International. https://doi.org/10.1007/s00198-014-2794-2
10. Dagan (2017). *External validation and comparison of three prediction tools for risk of osteoporotic fractures using data from population based electronic health records: retrospective cohort study* BMJ. https://doi.org/10.1136/bmj.i6755
11. Elliott (2021). *Patient-Reported Care Coordination is Associated with Better Performance on Clinical Care Measures.* {'title': 'Journal of general internal medicine', 'iso_abbreviation': 'J Gen Intern Med'}. https://doi.org/10.1007/s11606-021-07122-8
12. FLS-CARE study group (2021). *Implementation of an integrated care programme to avoid fragility fractures of the hip in older adults in 18 Bavarian hospitals - study protocol for the cluster-randomised controlled fracture liaison service FLS-CARE.* {'title': 'BMC geriatrics', 'iso_abbreviation': 'BMC Geriatr'}. https://doi.org/10.1186/s12877-020-01966-1
13. Foley (2007). *Assessment of the clinical management of fragility fractures and implications for the new HEDIS osteoporosis measure.* {'title': 'Medical care', 'iso_abbreviation': 'Med Care'}. https://doi.org/10.1097/MLR.0b013e3180536764
14. Fülling (2020). *Dresdener Network Osteoporosis.* {'title': 'Zeitschrift fur Orthopadie und Unfallchirurgie', 'iso_abbreviation': 'Z Orthop Unfall'}. https://doi.org/10.1055/a-1149-9588
15. Greene (2023). *Quality improvement initiative: implementing routine vertebral fracture assessments into an Australian Fracture Liaison Service.* {'title': 'BMJ open quality', 'iso_abbreviation': 'BMJ Open Qual'}. https://doi.org/10.1136/bmjoq-2023-002303
16. Gulseth (2008). *Gender differences in health care expenditures, resource utilization, and quality of care.* {'title': 'Journal of managed care pharmacy : JMCP', 'iso_abbreviation': 'J Manag Care Pharm'}. https://doi.org/10.18553/jmcp.2008.14.S6-A.2
17. Harvey (2025). *Body mass index and subsequent fracture risk: a meta-analysis to update FRAX.* {'title': 'Journal of bone and mineral research : the official journal of the American Society for Bone and Mineral Research', 'iso_abbreviation': 'J Bone Miner Res'}. https://doi.org/10.1093/jbmr/zjaf091
18. Hippisley-Cox (2012). *Derivation and validation of updated QFracture algorithm to predict risk of osteoporotic fracture in primary care in the United Kingdom: prospective open cohort study* BMJ. https://doi.org/10.1136/bmj.e3427
19. Hsieh (2025). *The global, regional, and national burden attributable to low bone mineral density, 1990-2020: an analysis of a modifiable risk factor from the Global Burden of Disease Study 2021.* {'title': 'The Lancet. Rheumatology', 'iso_abbreviation': 'Lancet Rheumatol'}. https://doi.org/10.1016/S2665-9913(25)00105-5
20. Jung (2018). *Gender differences in anti-osteoporosis drug treatment after osteoporotic fractures.* {'title': 'Journal of bone and mineral metabolism', 'iso_abbreviation': 'J Bone Miner Metab'}. https://doi.org/10.1007/s00774-018-0904-5
21. Kanis (2008). *FRAX and the assessment of fracture probability in men and women from the UK.* {'title': 'Osteoporosis international : a journal established as result of cooperation between the European Foundation for Osteoporosis and the National Osteoporosis Foundation of the USA', 'iso_abbreviation': 'Osteoporos Int'}. https://doi.org/10.1007/s00198-007-0543-5
22. Keppler (2024). *Orthogeriatric co-management in pelvic and acetabular fractures.* {'title': 'Archives of orthopaedic and trauma surgery', 'iso_abbreviation': 'Arch Orthop Trauma Surg'}. https://doi.org/10.1007/s00402-024-05566-1
23. Kong (2023). *Development and validation of common data model-based fracture prediction model using machine learning algorithm.* {'title': 'Osteoporosis international : a journal established as result of cooperation between the European Foundation for Osteoporosis and the National Osteoporosis Foundation of the USA', 'iso_abbreviation': 'Osteoporos Int'}. https://doi.org/10.1007/s00198-023-06787-7
24. Kuiper (2018). *After the fall: improving osteoporosis treatment following hip fracture.* {'title': 'Osteoporosis international : a journal established as result of cooperation between the European Foundation for Osteoporosis and the National Osteoporosis Foundation of the USA', 'iso_abbreviation': 'Osteoporos Int'}. https://doi.org/10.1007/s00198-018-4416-x
25. Lehmann (2024). *Fracture risk prediction in postmenopausal women with traditional and machine learning models in a nationwide, prospective cohort study in Switzerland with validation in the UK Biobank.* {'title': 'Journal of bone and mineral research : the official journal of the American Society for Bone and Mineral Research', 'iso_abbreviation': 'J Bone Miner Res'}. https://doi.org/10.1093/jbmr/zjae089
26. Leslie (2019). *Population-Based Osteoporosis Primary Prevention and Screening for Quality of Care in Osteoporosis, Current Osteoporosis Reports.* {'title': 'Current osteoporosis reports', 'iso_abbreviation': 'Curr Osteoporos Rep'}. https://doi.org/10.1007/s11914-019-00542-w
27. McKinley (2002). *Performance indicators in women's health: incorporating women's health in the health plan employer data and information set (HEDIS).* {'title': "Women's health issues : official publication of the Jacobs Institute of Women's Health", 'iso_abbreviation': 'Womens Health Issues'}. https://doi.org/10.1016/s1049-3867(01)00120-7
28. Nadrash (2008). *Clinical pharmacists' role in improving osteoporosis treatment rates among elderly patients with untreated atraumatic fractures.* {'title': 'The Annals of pharmacotherapy', 'iso_abbreviation': 'Ann Pharmacother'}. https://doi.org/10.1345/aph.1K541
29. Navarro (2011). *Minimizing disparities in osteoporosis care of minorities with an electronic medical record care plan.* {'title': 'Clinical orthopaedics and related research', 'iso_abbreviation': 'Clin Orthop Relat Res'}. https://doi.org/10.1007/s11999-011-1852-8
30. Nayak (2018). *How Can We Improve Osteoporosis Care? A Systematic Review and Meta-Analysis of the Efficacy of Quality Improvement Strategies for Osteoporosis.* {'title': 'Journal of bone and mineral research : the official journal of the American Society for Bone and Mineral Research', 'iso_abbreviation': 'J Bone Miner Res'}. https://doi.org/10.1002/jbmr.3437
31. Nguyen (2008). *Development of prognostic nomograms for individualizing 5-year and 10-year fracture risks* Osteoporosis International. https://doi.org/10.1007/s00198-008-0588-0
32. Osuna (2017). *FRACTURE LIAISON SERVICES: MULTIDISCIPLINARY APPROACHES TO SECONDARY FRACTURE PREVENTION.* {'title': 'Endocrine practice : official journal of the American College of Endocrinology and the American Association of Clinical Endocrinologists', 'iso_abbreviation': 'Endocr Pract'}. https://doi.org/10.4158/EP161433.RA
33. Papaioannou (2007). *The osteoporosis care gap in men with fragility fractures: the Canadian Multicentre Osteoporosis Study.* {'title': 'Osteoporosis international : a journal established as result of cooperation between the European Foundation for Osteoporosis and the National Osteoporosis Foundation of the USA', 'iso_abbreviation': 'Osteoporos Int'}. https://doi.org/10.1007/s00198-007-0483-0
34. Peng (2025). *A cross-sectional study comparing machine learning and logistic regression techniques for predicting osteoporosis in a group at high risk of cardiovascular disease among old adults.* {'title': 'BMC geriatrics', 'iso_abbreviation': 'BMC Geriatr'}. https://doi.org/10.1186/s12877-025-05840-w
35. Qi (2025). *Machine learning-driven prediction of risk factors for postoperative re-fractures in elderly OVCF patients with underlying diseases: model development and validation.* {'title': 'Frontiers in medicine', 'iso_abbreviation': 'Front Med (Lausanne)'}. https://doi.org/10.3389/fmed.2025.1616923
36. Roux (2013). *Priming primary care physicians to treat osteoporosis after a fragility fracture: an integrated multidisciplinary approach.* {'title': 'The Journal of rheumatology', 'iso_abbreviation': 'J Rheumatol'}. https://doi.org/10.3899/jrheum.120908
37. Sandhu (2009). *Prognosis of fracture: evaluation of predictive accuracy of the FRAX™ algorithm and Garvan nomogram* Osteoporosis International. https://doi.org/10.1007/s00198-009-1026-7
38. Sanjari (2023). *Mind the osteoporosis care gap with timely diagnosis: an executive summary of nationwide osteoporosis Campaigns 2019-2021.* {'title': 'Journal of diabetes and metabolic disorders', 'iso_abbreviation': 'J Diabetes Metab Disord'}. https://doi.org/10.1007/s40200-023-01257-7
39. Shim (2020). *Application of machine learning approaches for osteoporosis risk prediction in postmenopausal women.* {'title': 'Archives of osteoporosis', 'iso_abbreviation': 'Arch Osteoporos'}. https://doi.org/10.1007/s11657-020-00802-8
40. Solomon (2005). *Medication use patterns for osteoporosis: an assessment of guidelines, treatment rates, and quality improvement interventions.* {'title': 'Mayo Clinic proceedings', 'iso_abbreviation': 'Mayo Clin Proc'}. https://doi.org/10.4065/80.2.194
41. Sun (2025). *Risk prediction of osteoporotic vertebral compression fractures in postmenopausal osteoporotic women by machine learning modelling.* {'title': 'Frontiers in medicine', 'iso_abbreviation': 'Front Med (Lausanne)'}. https://doi.org/10.3389/fmed.2025.1664219
42. Usategui-Martín (2025). *Assessment of the risk of osteoporotic bone fracture in postmenopausal women using machine learning methods.* {'title': 'Scientific reports', 'iso_abbreviation': 'Sci Rep'}. https://doi.org/10.1038/s41598-025-27226-z
43. Vandenput (2024). *A meta-analysis of previous falls and subsequent fracture risk in cohort studies.* {'title': 'Osteoporosis international : a journal established as result of cooperation between the European Foundation for Osteoporosis and the National Osteoporosis Foundation of the USA', 'iso_abbreviation': 'Osteoporos Int'}. https://doi.org/10.1007/s00198-023-07012-1
44. Wu (2018). *Fracture liaison services improve outcomes of patients with osteoporosis-related fractures: A systematic literature review and meta-analysis.* {'title': 'Bone', 'iso_abbreviation': 'Bone'}. https://doi.org/10.1016/j.bone.2018.03.018
45. Wu (2018). *Identifying characteristics of an effective fracture liaison service: systematic literature review.* {'title': 'Osteoporosis international : a journal established as result of cooperation between the European Foundation for Osteoporosis and the National Osteoporosis Foundation of the USA', 'iso_abbreviation': 'Osteoporos Int'}. https://doi.org/10.1007/s00198-017-4370-z
46. Wu (2023). *A Prediction Model for Osteoporosis Risk Using a Machine-Learning Approach and Its Validation in a Large Cohort.* {'title': 'Journal of Korean medical science', 'iso_abbreviation': 'J Korean Med Sci'}. https://doi.org/10.3346/jkms.2023.38.e162
47. Wu (2023). *Predictive value of machine learning on fracture risk in osteoporosis: a systematic review and meta-analysis.* {'title': 'BMJ open', 'iso_abbreviation': 'BMJ Open'}. https://doi.org/10.1136/bmjopen-2022-071430
48. Yu (2019). *The Fracture Liaison Service to close the osteoporosis care gap: a leadership educational model for undergraduate and postgraduate trainees.* {'title': 'Clinical rheumatology', 'iso_abbreviation': 'Clin Rheumatol'}. https://doi.org/10.1007/s10067-019-04796-8
49. Zhang (2025). *Development and validation of a machine learning-based risk prediction model for postoperative delirium in older patients with hip fracture.* {'title': 'The journals of gerontology. Series A, Biological sciences and medical sciences', 'iso_abbreviation': 'J Gerontol A Biol Sci Med Sci'}. https://doi.org/10.1093/gerona/glaf200
