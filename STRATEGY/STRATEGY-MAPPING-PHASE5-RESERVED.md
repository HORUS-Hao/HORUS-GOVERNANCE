# Strategy Mapping - Phase 5 Reserved

> **TYPE**: GOVERNANCE / RESERVED
> **STATUS**: NOT ACTIVE
> **PHASE**: 5 (FUTURE)
> **MUTATION**: NONE
> **Date**: 2026-01-25
> **Architect**: Claude Code

---

## 1. Purpose

本文件明確鎖定 `strategy_mapping` Sheet 為 Phase 5 Reserved，禁止任何提前使用。

---

## 2. Critical Declaration

### 2.1 Forbidden Usage

**`strategy_mapping` 不得作為 Phase 2 / Phase 3 / Phase 4 的 Eligibility 判斷來源。**

### 2.2 Current Active Eligibility Path (Phase 2-4)

```
T005 Lifecycle (Master Gate)
  → T005 Status Normalization (Phase 3+)
  → T002-WK Naming = Intent
```

### 2.3 Phase 5 Role (Future)

本表僅允許在 Phase 5 啟動，且僅能作為：
- **Override Layer**: 覆寫特定商品的平台策略
- **Restriction Layer**: 限制特定商品的上架範圍

---

## 3. Sheet Information

| 項目 | 值 |
|------|-----|
| Sheet Name | `strategy_mapping` |
| Sheet URL | https://docs.google.com/spreadsheets/d/1UrvQW7OK7n-1AiHi4zkDur3lLtwBowj8o7AJtHwHI1Y |
| Current Status | **NOT ACTIVE** |
| Activation Phase | Phase 5 |

---

## 4. Forbidden Actions (Red Lines)

| 項目 | 狀態 |
|------|------|
| 任何模組讀取此 Sheet（Phase < 5）| ❌ 禁止 |
| C005 Eligibility 判斷使用此表 | ❌ 禁止 |
| R020 使用此表 | ❌ 禁止 |
| T030 使用此表 | ❌ 禁止 |
| AI 自動填寫策略資料 | ❌ 禁止 |
| 人類在 Phase 5 前填寫策略資料 | ❌ 禁止 |

---

## 5. Activation Conditions

只有在 Architect 明確下達以下指令之一，才可啟用：

1. 「Phase 5 啟動，允許讀取 strategy_mapping」
2. 「解除 Phase 5 鎖定，啟用策略覆寫層」

---

## 6. Sheet Columns (Structure Only)

| Column | Description |
|--------|-------------|
| product_id | 商品 ID |
| brand | 品牌 |
| platform_code | 平台代碼 |
| strategy_scope | 策略範圍 |
| effective_start_date | 生效開始日 |
| effective_end_date | 生效結束日 |
| input_by | 輸入者 |
| input_date | 輸入日期 |
| status | 狀態 |
| approved_by | 核准者 |
| approved_date | 核准日期 |
| note | 備註 |

---

## 7. Related Documents

| Document | Description |
|----------|-------------|
| `T005-STATUS-NORMALIZATION-GOVERNANCE.md` | Phase 3 Normalization 治理 |
| `T002-WK-PLATFORM-STRATEGY-CONTRACT.md` | Platform Intent 契約 |
| `EligibilityService.js` | Eligibility 判斷服務 |

---

## 8. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Lock as Phase 5 Reserved |

---

**END OF STRATEGY-MAPPING-PHASE5-RESERVED.md**
