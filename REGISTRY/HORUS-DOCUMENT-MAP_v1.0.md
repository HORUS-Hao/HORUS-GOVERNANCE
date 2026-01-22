# HORUS Document Placement Map v1.0

> **This document is enforced by:**
> `HORUS-GOVERNANCE/AI-BOOTSTRAP.md`

---

> **Status**: EFFECTIVE
> **Role**: Document Placement SSOT (Single Source of Truth)
> **Version**: v1.0
> **Baseline Date**: 2026-01-06
> **Based On**: 2026-01-05 Full Read-Only Scan Report

---

## Purpose

This document defines the **authoritative placement rules** for ALL documents within the HORUS system. Any AI agent, automation, or human operator MUST consult this map before creating, moving, or organizing files.

---

## Tri-Layer Root Structure

```
G:\我的雲端硬碟\
├── HORUS-GOVERNANCE/    # Policies, contracts, registry (治理層)
├── HORUS-FACTS/         # Raw observed data (事實層)
└── HORUS-DERIVED/       # Computed outputs (衍生層)
```

### Layer Definitions

| Layer | Purpose | Mutability | AI Permission |
|-------|---------|------------|---------------|
| GOVERNANCE | Rules, policies, contracts | Append-only | Restricted |
| FACTS | Raw observations, immutable records | Write-once | Restricted |
| DERIVED | Computed, aggregated, transformed | Overwritable | With approval |

---

## HORUS-GOVERNANCE Structure

```
HORUS-GOVERNANCE/
├── AI-BOOTSTRAP.md              # AI 啟動治理文件 (EFFECTIVE)
├── GOVERNANCE-BOOTSTRAP.md      # 治理啟動文件 (存在)
├── GOVERNANCE-PRINCIPLES.md     # 治理原則 (存在)
├── FIELD-SEMANTIC-CHARTER.md    # 欄位語意憲章 (存在)
├── Registry-HORUS-PDM.gsheet    # 模組註冊表 (存在)
│
├── GOVERNANCE-BOOTSTRAP/        # AI 啟動必讀治理層 (MANDATORY)
│   └── DATA-CONTRACT-INDEX.md   # AI 行為紅線依據 (EFFECTIVE)
│
├── DATA_CONTRACTS/              # 資料契約
│   ├── T005/                    # T005 模組契約 (EFFECTIVE) - Product Master SSOT
│   ├── D005/                    # D005 模組契約 (EFFECTIVE)
│   ├── C005/                    # C005 模組契約 (EFFECTIVE)
│   └── R020/                    # R020 模組契約 (存在)
│
├── REGISTRY/                    # 註冊文件
│   ├── FIELD-SEMANTIC-CHARTER.md  # (存在)
│   └── HORUS-DOCUMENT-MAP_v1.0.md # 本文件 (EFFECTIVE)
│
├── OBSERVATIONS/                # 治理觀測層 (Runtime Behavior Documentation)
│   ├── GOVERNANCE-VIOLATION-LOG.md      # 違規觀測記錄 (Descriptive)
│   ├── GOVERNANCE-OBSERVATION-RULES.md  # 觀測規則說明 (Descriptive)
│   └── OBSERVATION-GOVERNANCE.md        # Observation 治理定義 (Descriptive)
│
├── SCRIPT/                      # 腳本相關文件 (存在)
├── VIEW_POLICIES/               # 視圖策略 (存在)
└── FUTURE-SKILL-RULE/           # 未來技能規則 (存在)
```

### Document Placement Rules - GOVERNANCE

| Document Type | Path | Status |
|---------------|------|--------|
| AI Bootstrap | `/AI-BOOTSTRAP.md` | EFFECTIVE |
| **Data Contract Index** | `/GOVERNANCE-BOOTSTRAP/DATA-CONTRACT-INDEX.md` | **EFFECTIVE** |
| Governance Principles | `/GOVERNANCE-PRINCIPLES.md` | Exists |
| Field Semantic Charter | `/FIELD-SEMANTIC-CHARTER.md` | Exists |
| Module Registry | `/Registry-HORUS-PDM.gsheet` | Exists |
| Data Contract (per module) | `/DATA_CONTRACTS/{MODULE_CODE}/` | Partial |
| Document Map | `/REGISTRY/HORUS-DOCUMENT-MAP_v1.0.md` | EFFECTIVE |
| **Observation Governance** | `/OBSERVATIONS/OBSERVATION-GOVERNANCE.md` | Descriptive |
| Observation Log | `/OBSERVATIONS/GOVERNANCE-VIOLATION-LOG.md` | Descriptive |

---

## HORUS-FACTS Structure

```
HORUS-FACTS/
├── README.md
├── FINANCE/                     # 財務事實 (存在)
├── IMAGES/                      # 圖片事實 (存在)
└── MARKET/                      # 市場事實
    ├── archive/                 # 歷史歸檔
    ├── input/                   # 輸入資料
    │   └── platforms/           # 平台原始資料
    │       ├── momo/
    │       │   └── _current/    # 當前檔案
    │       ├── pchome/
    │       │   └── _current/
    │       ├── shopee/
    │       │   ├── Gusense/
    │       │   │   └── _current/
    │       │   └── KATAI/
    │       │       └── _current/
    │       └── yahoo/
    │           └── _current/
    ├── output/                  # 輸出資料
    └── samples/                 # 樣本資料
```

### Document Placement Rules - FACTS

| Document Type | Path | Status |
|---------------|------|--------|
| Platform raw data | `/MARKET/input/platforms/{platform}/_current/` | Active |
| Archived data | `/MARKET/archive/{platform}/{date}/` | Historical |
| Output data | `/MARKET/output/` | Processing |
| Sample data | `/MARKET/samples/` | Reference |

---

## HORUS-DERIVED Structure

```
HORUS-DERIVED/
└── R020/                        # R020 衍生資料 (存在)
```

### Document Placement Rules - DERIVED

| Document Type | Path | Status |
|---------------|------|--------|
| R020 derived outputs | `/R020/` | Exists |
| Module derived data | `/{MODULE_CODE}/` | As needed |

---

## Module × Data Contract Coverage Matrix

| Module Code | GOVERNANCE Contract | FACTS Location | DERIVED Output | Status |
|-------------|---------------------|----------------|----------------|--------|
| R020 | ✅ Exists | N/A | ✅ Exists | Complete |
| T005 | ✅ EFFECTIVE | N/A | N/A | Contract-Governed (SSOT) |
| D005 | ✅ EFFECTIVE | N/A | N/A | Contract-Governed |
| C005 | ✅ EFFECTIVE | N/A | N/A | Contract-Governed |
| P0 (MOMO) | ❌ Missing | ✅ Exists | N/A | Needs Contract |
| P0 (PChome) | ❌ Missing | ✅ Exists | N/A | Needs Contract |
| P0 (Shopee) | ❌ Missing | ✅ Exists | N/A | Needs Contract |
| P0 (Yahoo) | ❌ Missing | ✅ Exists | N/A | Needs Contract |

---

## Known Issues & Recommendations

### Structural Issues (Needs Architect Decision)

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Duplicate FIELD-SEMANTIC-CHARTER.md | Root & REGISTRY | Architect to decide canonical location |
| Missing Data Contracts | Multiple modules | Gradual rollout recommended |

### Explicitly Missing (Suggested to Add)

| Document | Suggested Path | Priority |
|----------|----------------|----------|
| ~~C005 Data Contract~~ | `/DATA_CONTRACTS/C005/` | ✅ Done |
| ~~D005 Data Contract~~ | `/DATA_CONTRACTS/D005/` | ✅ Done |
| ~~T005 Data Contract~~ | `/DATA_CONTRACTS/T005/` | ✅ Done |
| P0 Template Contract | `/DATA_CONTRACTS/P0/` | Medium |
| LISTING_JOIN_POLICY | `/DATA_CONTRACTS/POLICIES/` | High |

---

## AI Agent Instructions

### Mandatory Bootstrap (啟動必讀)

> **GOVERNANCE-BOOTSTRAP 為 AI 啟動必讀治理層**
> - `DATA-CONTRACT-INDEX.md` 為 AI 行為紅線依據
> - 不得忽略、不屬於補充文件
> - AI 必須在操作 T005 / D005 / C005 前讀取此文件
>
> **Semantic Authority Chain（語義權威鏈）**
> ```
> T005 (Product Master SSOT)
>   → D005 (FACT Writer)
>   → C005 (Consumer)
>   → R020 (Price Comparator)
>   → T030 (Margin Simulation)
> ```

### Before Creating Any File

1. **Consult this document** to find the correct placement
2. **Read GOVERNANCE-BOOTSTRAP/** for Contract-Governed modules
3. **If path is not listed**, STOP and ask Architect
4. **Never create new directories** without explicit approval
5. **Verify layer classification** (GOVERNANCE/FACTS/DERIVED)

### File Naming Conventions

| Layer | Convention | Example |
|-------|------------|---------|
| GOVERNANCE | `{NAME}_v{VERSION}.md` | `HORUS-DOCUMENT-MAP_v1.0.md` |
| FACTS | `{source}_{date}_{time}.{ext}` | `ProductQueryDetail_20251231184453.xlsx` |
| DERIVED | `{MODULE}_{OUTPUT}_{date}.{ext}` | `R020_PriceComparison_20260106.json` |

---

## Change Log

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release based on 2026-01-05 scan |
| v1.0.1 | 2026-01-06 | Add GOVERNANCE-BOOTSTRAP, D005/C005 Contract-Governed |
| v1.0.2 | 2026-01-06 | Add T005 Contract-Governed (SSOT), semantic authority chain |
| v1.0.3 | 2026-01-06 | Add OBSERVATIONS/ (Runtime Behavior Documentation, Descriptive) |

---

## Enforcement

This document is the **Single Source of Truth** for document placement.

- **Authority**: HORUS-GOVERNANCE/AI-BOOTSTRAP.md
- **Scope**: All AI agents, automation, and manual operations
- **Violation Handling**: Rollback + Architect review

---

**END OF HORUS-DOCUMENT-MAP_v1.0.md**
