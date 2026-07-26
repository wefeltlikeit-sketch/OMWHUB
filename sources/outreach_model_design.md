# Clinical outreach model design

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
