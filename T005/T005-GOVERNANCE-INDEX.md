# T005 Governance Index

本文件為 T005（Product Master）模組之治理索引入口。
所有分析、審計、裁定、ADR 文件，皆需在此登錄。

---

## Blind Audits

### T005-READONLY-AUDIT-2026-01-22
- **Type**: Blind Read-only Audit
- **Date**: 2026-01-22
- **Scope**: T005-商品管理-Product-Mgmt (Canonical Root)
- **Status**: SEALED / PENDING DECISION
- **Evidence**: T005/AUDIT/T005-READONLY-AUDIT-2026-01-22.md
- **Description**:
  - 在不引入既有治理裁定的情況下，完整還原 T005 實際行為與風險輪廓
  - 識別 7 個 GAS 檔案職責、16 個 Sheet（11 業務 + 5 系統）
  - 重建 FACT / DERIVED / GOVERNANCE 資料層級分類
  - 盤點所有寫入點與高風險行為
  - 識別 Schema 不一致問題（JSON 配置仍使用 Legacy 名稱）

---

## Alignment Audits

### T005-GOVERNANCE-ALIGNMENT-AUDIT
- **Type**: Alignment Audit
- **Path**: T005/T005-GOVERNANCE-ALIGNMENT-AUDIT.md
- **Status**: REFERENCE
- **Description**:
  - 歷史對齊審計文件

---

## Schema Documents

### T005_SHEET_SCHEMA_CANONICAL_v2026-01
- **Type**: SSOT Schema
- **Path**: T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md
- **Status**: ACTIVE
- **Description**:
  - T005 商品主表 24 欄 Canonical Schema 定義
  - SpreadsheetId: `1MHeqKjpt7Iq1mV7OvLMYIqjr2UVIMgK1DJqFU3a8jSk`

---

## ADR（Architecture Decision Records）
- （尚未登錄）

---

## Freeze / Phase Decisions
- （尚未登錄）

---

## Related Modules
- T002（Material Schema）
- C005（Listing Checker）
- R020（Price Comparator）
- T030（Margin Simulation）
- P005（Image Library）
- A005（AI Library）

---

## Notes
- 本 Index 不包含裁定
- 所有裁定需由 Architect 明確加入 ADR 區段
