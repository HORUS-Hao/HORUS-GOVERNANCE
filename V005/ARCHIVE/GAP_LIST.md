# Governance Document Gap List (治理文件缺口清單)

**盤點日期**: 2026-01-07
**盤點人**: Claude Code
**範圍**: _FACT_REGISTRY, _GOVERNANCE, HORUS-GOVERNANCE

---

## 一、盤點結果總覽

| 目錄 | 現有文件數 | 缺口數 | 狀態 |
|------|-----------|--------|------|
| `_FACT_REGISTRY` | 0 (空) | 5+ | 嚴重缺失 |
| `_GOVERNANCE` | 9 | 3 | 部分缺失 |
| `HORUS-GOVERNANCE` | 1 | 4 | 嚴重缺失 |

---

## 二、_FACT_REGISTRY 現況

### 已存在文件
```
_FACT_REGISTRY/
└── evidence/
    └── (空)
```

**結論**: 目錄存在但完全沒有治理文件。

### 缺口清單

| # | 缺失文件 | 用途 | 嚴重性 |
|---|----------|------|--------|
| 1 | `README.md` | FACT 層定義與使用規範 | HIGH |
| 2 | `FACT_SCHEMA.md` | FACT 資料結構定義 | HIGH |
| 3 | `FACT_SOURCES.md` | 原始資料來源註冊表 | HIGH |
| 4 | `FACT_WRITE_POLICY.md` | FACT 寫入權限與規則 | HIGH |
| 5 | `evidence/README.md` | 證據資料夾說明 | MEDIUM |

---

## 三、_GOVERNANCE 現況

### 已存在文件
```
_GOVERNANCE/
├── INDEX.md                              # 治理入口索引
├── README.md                             # 目錄說明
├── STATE-ANCHOR-2025-12.md               # 狀態錨點
├── MASTER-SCRIPT-INVENTORY-2026-01-04.md # GAS Script 清單
├── DRIVE-ROOT-RISK-ASSESSMENT-2026-01-04.md # Drive 風險評估
├── P0-OBSERVATION-SCRIPTS-INVENTORY.md   # P0 觀測腳本清單
├── ADR/
│   ├── README.md
│   └── ADR-0001-T005-T002-B.md           # T005/T002 治理決策
├── MODULE-REGISTRY/
│   ├── S005.md                           # S005 模組規格
│   ├── V005.md                           # V005 模組規格
│   └── V005E.md                          # V005E 模組規格
└── RUL/
    └── RUL-0001-MCP-Governance-Reminder.md # MCP 治理提醒
```

### 缺口清單

| # | 缺失文件 | 用途 | 嚴重性 |
|---|----------|------|--------|
| 1 | `MODULE-REGISTRY/C005.md` | C005 模組規格 (生產使用中) | HIGH |
| 2 | `MODULE-REGISTRY/R020.md` | R020 模組規格 (有 Daily Trigger) | HIGH |
| 3 | `MODULE-REGISTRY/R021.md` | R021 模組規格 (Mail 相關) | MEDIUM |
| 4 | `MODULE-REGISTRY/D005.md` | D005 模組規格 (FACT 資料中樞) | HIGH |
| 5 | `MODULE-REGISTRY/T005.md` | T005 模組規格 (商品庫主表) | HIGH |
| 6 | `MODULE-REGISTRY/T002.md` | T002 模組規格 (物料管理) | MEDIUM |
| 7 | `MODULE-REGISTRY/T030.md` | T030 模組規格 (毛利試算) | MEDIUM |
| 8 | `MODULE-REGISTRY/P0-*.md` | P0 觀測系列模組規格 | MEDIUM |
| 9 | `ADR/ADR-0002-*.md` | 後續架構決策記錄 | LOW |
| 10 | `DEPLOYMENT-REGISTRY.md` | 部署 URL 與版本對照表 | HIGH |

---

## 四、HORUS-GOVERNANCE 現況

### 已存在文件
```
HORUS-GOVERNANCE/
├── SCRIPT_HEADER.md    # Script Header 標準
└── REPORTS/
    └── (空)
```

### 缺口清單

| # | 缺失文件 | 用途 | 嚴重性 |
|---|----------|------|--------|
| 1 | `README.md` | 目錄說明與入口 | HIGH |
| 2 | `LAYER_DEFINITION.md` | FACT/DERIVED/GOVERNANCE/OBSERVER 層級定義 | HIGH |
| 3 | `DATA_CONTRACT_TEMPLATE.md` | 資料契約範本 | MEDIUM |
| 4 | `REPORTS/HEADER_AUDIT_*.md` | Header 稽核報告 | MEDIUM |

---

## 五、跨目錄治理缺口

### 目錄職責重疊問題

| 問題 | 說明 |
|------|------|
| `_GOVERNANCE` vs `HORUS-GOVERNANCE` | 兩個目錄職責不明確，應整併或明確分工 |
| `00-系統管理中心/.../CORE` vs `_GOVERNANCE` | STAMP-GOVERNANCE.md 放在 CORE 而非 _GOVERNANCE |

### 缺失的全域治理文件

| # | 缺失文件 | 建議位置 | 用途 |
|---|----------|----------|------|
| 1 | `URL_REGISTRY.md` | `_GOVERNANCE/` | 所有 Web App URL 註冊表 |
| 2 | `TRIGGER_REGISTRY.md` | `_GOVERNANCE/` | 所有 GAS Trigger 註冊表 |
| 3 | `SPREADSHEET_REGISTRY.md` | `_GOVERNANCE/` | 所有 Spreadsheet ID 註冊表 |
| 4 | `STATUS_MACHINE.md` | `_GOVERNANCE/` | 各模組狀態機定義 |
| 5 | `PERMISSION_MATRIX.md` | `_GOVERNANCE/` | 權限矩陣 (Role/Module/Action) |

---

## 六、優先級建議

### P0 (必須立即補齊)
1. `_GOVERNANCE/MODULE-REGISTRY/D005.md` - FACT 中樞
2. `_GOVERNANCE/MODULE-REGISTRY/T005.md` - 商品庫主表
3. `_GOVERNANCE/MODULE-REGISTRY/C005.md` - 生產模組
4. `_GOVERNANCE/DEPLOYMENT-REGISTRY.md` - 部署管理
5. `_FACT_REGISTRY/README.md` - FACT 層定義

### P1 (建議補齊)
1. `_GOVERNANCE/MODULE-REGISTRY/R020.md`
2. `HORUS-GOVERNANCE/README.md`
3. `HORUS-GOVERNANCE/LAYER_DEFINITION.md`
4. `_GOVERNANCE/URL_REGISTRY.md`

### P2 (可延後)
1. ADR 後續編號
2. REPORTS 資料夾內容
3. 其他輔助文件

---

*此文件為盤點結果，不包含任何新增內容或程式修改*
