# OMW Measure Specification Brief

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
