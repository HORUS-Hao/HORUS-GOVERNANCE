# Suggested Governance Files (建議補齊文件清單)

**建立日期**: 2026-01-07
**建立人**: Claude Code
**依據**: GAP_LIST.md 盤點結果

---

## 一、建議補齊文件總表

| # | 檔案路徑 | 類型 | 優先級 | 預估內容 |
|---|----------|------|--------|----------|
| 1 | `_FACT_REGISTRY/README.md` | 說明文件 | P0 | FACT 層定義、寫入規則、資料來源說明 |
| 2 | `_GOVERNANCE/MODULE-REGISTRY/D005.md` | 模組規格 | P0 | D005 Data Hub 模組定義與治理規則 |
| 3 | `_GOVERNANCE/MODULE-REGISTRY/T005.md` | 模組規格 | P0 | T005 商品庫主表結構與治理規則 |
| 4 | `_GOVERNANCE/MODULE-REGISTRY/C005.md` | 模組規格 | P0 | C005 Listing Checker 模組定義 |
| 5 | `_GOVERNANCE/DEPLOYMENT-REGISTRY.md` | 註冊表 | P0 | 所有 Web App 部署 URL 與版本對照 |
| 6 | `_GOVERNANCE/MODULE-REGISTRY/R020.md` | 模組規格 | P1 | R020 Price Comparator 模組定義 |
| 7 | `_GOVERNANCE/MODULE-REGISTRY/R021.md` | 模組規格 | P1 | R021 Anomaly Routing 模組定義 |
| 8 | `HORUS-GOVERNANCE/README.md` | 說明文件 | P1 | HORUS-GOVERNANCE 目錄用途說明 |
| 9 | `HORUS-GOVERNANCE/LAYER_DEFINITION.md` | 定義文件 | P1 | FACT/DERIVED/GOVERNANCE/OBSERVER 層級詳細定義 |
| 10 | `_GOVERNANCE/URL_REGISTRY.md` | 註冊表 | P1 | 所有公開 URL 註冊 |
| 11 | `_GOVERNANCE/TRIGGER_REGISTRY.md` | 註冊表 | P2 | 所有 GAS Trigger 註冊 |
| 12 | `_GOVERNANCE/SPREADSHEET_REGISTRY.md` | 註冊表 | P2 | 所有 Spreadsheet ID 註冊 |

---

## 二、P0 文件建議內容結構

### 2.1 `_FACT_REGISTRY/README.md`

```markdown
# FACT Registry

## Definition
FACT 層為系統的「單一事實來源」...

## Write Policy
- 僅允許寫入「真實存在的事實資料」
- 禁止推斷、補齊、合成

## Registered FACT Sources
| Source | Sheet/Table | Owner |
|--------|-------------|-------|
| T005 | 商品庫主表 | D005 |
| ... | ... | ... |

## Governance Rules
1. ...
2. ...
```

### 2.2 `_GOVERNANCE/MODULE-REGISTRY/D005.md`

```markdown
# Module: D005-Data-Hub
## Status: ACTIVE
## Description: FACT 資料中樞，負責所有原始資料的收集與整合
## Layer: FACT

## Governance Rules
1. 不得推斷或補齊不存在的資料
2. 所有寫入必須有明確來源
3. ...

## Dependencies
- T005 商品庫
- T002 物料庫
- ...

## Triggers
| Trigger | Schedule | Purpose |
|---------|----------|---------|
| ... | ... | ... |
```

### 2.3 `_GOVERNANCE/MODULE-REGISTRY/T005.md`

```markdown
# Module: T005-Product-Management
## Status: ACTIVE (Canonical Schema)
## Description: 商品庫主表，為系統商品資料的唯一權威來源
## Layer: FACT

## Schema (Frozen)
| Column | Type | Description |
|--------|------|-------------|
| ... | ... | ... |

## Governance Rules
1. Schema 變更需 Architect 核准
2. 不得直接修改，需透過 D005
3. ...
```

### 2.4 `_GOVERNANCE/MODULE-REGISTRY/C005.md`

```markdown
# Module: C005-Listing-Checker
## Status: ACTIVE
## Description: 商品上架檢查器，比對平台資料與 ERP
## Layer: DERIVED

## Governance Rules
1. 僅讀取 FACT，不得寫入
2. 比對邏輯不得補齊缺失資料
3. ...

## Web App
| Version | URL | Status |
|---------|-----|--------|
| ... | ... | ... |
```

### 2.5 `_GOVERNANCE/DEPLOYMENT-REGISTRY.md`

```markdown
# Deployment Registry (部署註冊表)

## Web App URLs

### S005 - Submission Entry
| Version | Deployment ID | Status | Date |
|---------|--------------|--------|------|
| @62 | AKfycbwXoLE5G... | ACTIVE | 2026-01-07 |

### V005 - Quotation Viewer
| Version | Deployment ID | Status | Date |
|---------|--------------|--------|------|
| @75 | AKfycbwDW2p-s... | ACTIVE | 2026-01-07 |

### C005 - Listing Checker
| Version | Deployment ID | Status | Date |
|---------|--------------|--------|------|
| ... | ... | ... | ... |

## Change Log
| Date | Module | Change | By |
|------|--------|--------|-----|
| ... | ... | ... | ... |
```

---

## 三、P1 文件建議內容結構

### 3.1 `HORUS-GOVERNANCE/README.md`

```markdown
# HORUS-GOVERNANCE

本目錄為 HORUS 系統層級的治理規範存放處。

## 與 _GOVERNANCE 的分工
- `_GOVERNANCE/`: 模組層級治理（ADR、RUL、MODULE-REGISTRY）
- `HORUS-GOVERNANCE/`: 系統層級標準（Script Header、Layer Definition）

## Contents
- SCRIPT_HEADER.md - Script Header 標準格式
- LAYER_DEFINITION.md - 層級定義與責任
- REPORTS/ - 稽核報告
```

### 3.2 `HORUS-GOVERNANCE/LAYER_DEFINITION.md`

```markdown
# HORUS Layer Definition (層級定義)

## 四層架構

### Layer 1: FACT
- 定義: 原始事實資料
- 寫入權限: 限定模組
- 範例: T005, T002

### Layer 2: DERIVED
- 定義: 從 FACT 計算衍生
- 寫入權限: 禁止回寫 FACT
- 範例: 統計模組、報表模組

### Layer 3: GOVERNANCE
- 定義: 治理與檢查工具
- 寫入權限: 不寫入資料
- 範例: GOV_HeaderInspector

### Layer 4: OBSERVER
- 定義: 觀測與通知
- 寫入權限: 僅讀取
- 範例: Mail 服務、Dashboard
```

---

## 四、整併建議

### 目錄整併方案 (供 Architect 裁決)

**方案 A: 整併至 _GOVERNANCE**
```
_GOVERNANCE/
├── INDEX.md
├── README.md
├── ADR/
├── RUL/
├── MODULE-REGISTRY/
├── STANDARDS/              # 從 HORUS-GOVERNANCE 移入
│   ├── SCRIPT_HEADER.md
│   └── LAYER_DEFINITION.md
└── REPORTS/
```

**方案 B: 維持分離但明確分工**
```
_GOVERNANCE/           # 模組層級
HORUS-GOVERNANCE/      # 系統層級標準
_FACT_REGISTRY/        # FACT 資料註冊
```

---

## 五、執行建議

1. **不立即執行**: 本文件僅為建議，不包含實際建立動作
2. **Architect 裁決**: 建議 Architect 審閱後裁決優先級與執行順序
3. **分批執行**: 建議依 P0 → P1 → P2 順序補齊
4. **整併決策**: 建議先決定目錄整併方案再補齊文件

---

*此文件為建議清單，不包含任何新增內容或程式修改*
*執行需 Architect 核准*
