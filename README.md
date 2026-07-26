# OMW Team Hub

A shareable, offline-friendly package that consolidates OMW (Osteoporosis Management in Women Who Had a Fracture) research, measure logic, dual risk models, outreach design, engineering specs, and interactive demos.

## How to open

1. Open **`index.html`** in any modern browser (Chrome, Edge, Safari, Firefox).
2. Use the left navigation or role-based “Start here” paths.
3. Linked demos, CSVs, markdown, and Word specs open from the same folder.

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
| `index.html` | Navigable hub (start here) |
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

## Important caveat

Measure logic and token work reference HEDIS materials around MY2024–MY2026 drafts. **Confirm all code sets, exclusion windows, and value sets against the current NCQA HEDIS Technical Specifications before production use.**

## Source folders (originals)

- `…/CloudDocs/OMW Claude Research/` — literature-backed strategy package  
- `…/CloudDocs/HEDIS/` — broader HEDIS engine materials and additional prototypes  
