# ADR: Phase 6 Read-Only Usage

> **TYPE**: ADR (Architecture Decision Record)
> **STATUS**: ACTIVE
> **PHASE**: 6 (LIMITED / READ-ONLY USAGE)
> **Date**: 2026-01-25
> **Architect**: Claude Code

---

## 1. Context

Phase 4 已完成 Structural Schema Layer，建立 CANONICAL / READ-ONLY 結構。
Phase 6 的目的是開放「引用權限」，但不開放「行為權限」。

**Phase 6 定位：Usage / Binding / Adoption（僅使用，不推論）**

---

## 2. Decision

### 2.1 Phase 6 允許範圍（Allowed Scope）

| 類別 | 允許動作 | 禁止動作 |
|------|----------|----------|
| Read-only 引用 | 讀取 `getNormalizedStatusSchema()`, `listNormalizedStatusDefinitions()` | 任何寫入 |
| UI / Viewer 綁定 | 顯示 status labels / metadata | 條件判斷、流程分支 |
| 文件層引用 | README 標註 "Phase 6 usage" | 新增 runtime 行為 |

### 2.2 Phase 6 明確禁止事項（Hard NO）

| 禁止事項 | 說明 |
|----------|------|
| ❌ 任何推論（if/else、mapping、fallback）| 不可「想」|
| ❌ 任何寫入或回寫 | 不可變異 |
| ❌ 任何策略或 Eligibility 變更 | 不可「決定」|
| ❌ 任何跨模組狀態合併 | 不可擴張 |
| ❌ 任何 Phase 5 行為 | 仍為 RESERVED |

**一句話禁令：**
> Phase 6 可以「看」，不可以「想」，更不可以「決定」。

---

## 3. Exit Criteria

| 條件 | Required |
|------|----------|
| 程式碼僅新增 read-only usage（如 UI binding）| ✅ |
| 無條件判斷、無資料變異 | ✅ |
| C005 / T005 行為零變化 | ✅ |
| 文件標註 "Phase 6 Read-only Usage" | ✅ |
| 可用 grep/diff 證明無推論、無寫入 | ✅ |

---

## 4. Governance Lock

- **Phase 5**: RESERVED / NOT ACTIVE
- 超出範圍需重新請求 Architect 裁定
- 不得自行前進至 Phase 7

---

## 5. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Phase 6 Read-Only Usage |

---

**END OF ADR-PHASE6-READONLY-USAGE.md**
