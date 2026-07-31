# OMW Strategy Studio

A data-safe, offline-friendly planning environment for OMW targets, intervention strategy, operational capacity, decisions, assumptions, and implementation work. It remains useful without real company or member data.

The original OMW Team Hub is preserved as `knowledge.html` and remains the knowledge-library portion of the application.

## How to open

1. Open **`index.html`** in any modern browser (Chrome, Edge, Safari, Firefox).
2. Use the navigation to open the Strategy Cockpit, Target Planner, Scenario Lab, Intervention Portfolio, Journey Funnel, Decision Registry, Assumption Ledger, Roadmap, Data Safety page, or original Evidence Library.
3. Adjust synthetic assumptions and export local planning summaries.

No install or server required.

## How to share with the team

**Option A — Folder share (recommended)**  
Share the entire `OMW Team Hub` folder via iCloud, OneDrive, Teams, or a zip. Recipients keep the folder structure so relative links work.

**Option B — Zip**

```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs
zip -r "OMW_Team_Hub.zip" "OMW Team Hub"
```

Send `OMW_Team_Hub.zip`. Recipients unzip and open `index.html`.

## What’s inside

| Path | Contents |
|------|----------|
| `index.html` | OMW Strategy Studio (start here) |
| `knowledge.html` | Preserved OMW Team Hub and evidence library |
| `assets/` | Shared design system, application behavior, and metric calculations |
| `data/` | Human-readable synthetic configuration and central metric definitions |
| `tests/` | Calculation and public-repository privacy checks |
| `OMW_Gap_Closing_Strategy.pptx` | 14-slide strategy deck on gap-closing focus areas |
| `sources/` | Strategy report, measure brief, model & outreach designs, CSVs |
| `specs/` | PRE_OMW risk score, token specs, strategic risk analysis (docx) |
| `demos/` | Intelligence layer, what-if, and triage HTML prototypes |
| `figures/` | Prediction-model and outreach effect-size charts |

## Audience paths

- **Leadership / Stars strategy** → Key takeaways → Strategic risks → Success metrics  
- **Quality / measure ops** → Measure spec → Failure modes → Timeline  
- **Analytics** → Two models → Feature catalog → Evidence ceiling  
- **Care management** → Outreach → Tiers → Tactics  
- **Engineering** → Architecture → PRE_OMW_RISK_SCORE → Demos  

## Data boundary

This public repository must contain only public knowledge, synthetic demonstrations, generic assumptions, and blank templates. Do not commit PHI, member-identifiable information, provider-identifiable performance, proprietary company values, credentials, internal URLs, screenshots, or system exports.

The application:

- makes no external API calls;
- includes no analytics or telemetry;
- stores no edits beyond the current browser tab;
- labels demonstrations and exports as synthetic or user-entered planning assumptions.

## Validation

```bash
npm test
npm run privacy-check
```

## Important measure caveat

Measure logic and token work reference HEDIS materials around MY2024–MY2026 drafts. **Confirm all code sets, exclusion windows, and value sets against the current NCQA HEDIS Technical Specifications before production use.**

## Source folders (originals)

- `…/CloudDocs/OMW Claude Research/` — literature-backed strategy package  
- `…/CloudDocs/HEDIS/` — broader HEDIS engine materials and additional prototypes  
