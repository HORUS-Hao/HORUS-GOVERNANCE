# ADR: Phase 4 Structural Schema Layer

> **TYPE**: ADR (Architecture Decision Record)
> **STATUS**: ACTIVE
> **PHASE**: 4 (LIMITED / READ-ONLY / STRUCTURAL-ONLY)
> **Date**: 2026-01-25
> **Architect**: Claude Code

---

## 1. Context

Phase 3 已完成 Status Normalization Framework 的治理定義與程式結構。
Phase 4 的目的是將此結構「落地為可被程式安全引用的 Canonical 結構層」。

**Phase 4 是「結構落地階段」，不是邏輯階段。**

---

## 2. Decision

### 2.1 Phase 4 核心定位

Phase 4 的唯一目的是：

> 將 Phase 3 已完成的 Status Normalization Framework，轉換為「可被程式安全引用的 Canonical 結構層」，但不引入任何策略、判斷、或狀態變異。

### 2.2 Phase 4 允許範圍（Allowed Scope）

| 類別 | 允許動作 |
|------|----------|
| Schema 固化 | 標註 CANONICAL / READ-ONLY，補齊 schema metadata |
| 程式唯讀接點 | 僅建立 `getNormalizedStatusSchema()`, `listNormalizedStatusDefinitions()` |
| 結構對齊註解 | 註解說明未來哪些模組會引用此 schema |
| 治理標記 | 建立 Phase 4 ADR，聲明 Phase 5 為 RESERVED |

### 2.3 Phase 4 明確禁止事項（Hard NO）

| 禁止事項 | 說明 |
|----------|------|
| ❌ Status 推導/合併/轉換邏輯 | 不得新增 |
| ❌ Eligibility/Strategy/Mapping 判斷 | 不得引入 |
| ❌ 業務資料列 | 不得寫入 |
| ❌ Phase 5 啟用或實驗 | 不得提前 |
| ❌ 影響 C005/T005 行為的程式碼 | 不得新增 |

**一句話總結禁止事項：**
> Phase 4 不得「改變世界」，只能「描述世界的語彙表」。

---

## 3. Phase Boundary Declaration

```
Phase 3: Structure Definition (COMPLETE)
  ↓
Phase 4: Schema Hardening (CURRENT)
  - CANONICAL marking
  - READ-ONLY accessors
  - Zero behavior diff
  ↓
Phase 5: Strategy Override Layer (RESERVED - NOT ACTIVE)
  - strategy_mapping activation
  - Override/Restriction logic
```

---

## 4. Exit Criteria

Phase 4 只有在全部成立時才算完成：

| 條件 | 狀態 |
|------|------|
| Status Normalization Sheet 標記為 CANONICAL / READ-ONLY / NO-MUTATION | Required |
| 至少一份 Governance/ADR 文件明確寫出 Phase 4 與 Phase 5 的邊界 | Required |
| 程式碼中僅存在 Read-only accessor | Required |
| 無任何條件判斷、推論、映射 | Required |
| C005 / T005 行為零變化（Zero Behavior Diff）| Required |

---

## 5. Governance Declaration

> **Phase 4 的存在，是為了防止 Phase 5 在沒有結構共識前被誤啟動。**
> **任何試圖在 Phase 4 中加入策略含義的行為，皆屬治理違規。**

---

## 6. Related Documents

| Document | Description |
|----------|-------------|
| `T005-STATUS-NORMALIZATION-GOVERNANCE.md` | Phase 3 治理定義 |
| `STRATEGY-MAPPING-PHASE5-RESERVED.md` | Phase 5 預留聲明 |
| `EligibilityService.js` | Eligibility 服務（Phase 4 唯讀接點）|

---

## 7. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Phase 4 ADR |

---

**END OF ADR-PHASE4-STRUCTURAL-SCHEMA-LAYER.md**
