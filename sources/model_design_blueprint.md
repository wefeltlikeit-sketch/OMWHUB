# Predictive model design blueprint

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
