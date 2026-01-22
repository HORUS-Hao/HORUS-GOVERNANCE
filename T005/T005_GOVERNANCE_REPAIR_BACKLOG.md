# T005 Governance Repair Backlog

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: TRACKING ONLY (No Action)
> **Authority**: HORUS-GOVERNANCE

---

## Purpose

This document lists known governance gaps and technical debt items for T005.

**This is a tracking document only. Items listed here are NOT being addressed in the current phase.**

Each item requires a dedicated Engineering Phase with proper risk assessment before implementation.

---

## Backlog Items

### ITEM-001: T005 `status` Enum Undefined

| Attribute | Value |
|-----------|-------|
| **Description** | T005 `status` column has no formal enum definition |
| **Current State** | Free-form string values observed: 正常銷售, 停止銷售, 庫存不足, 新品開發, 停產 |
| **Risk Level** | MEDIUM |
| **Affects Runtime** | NO (soft validation only) |
| **Affected Modules** | C005, T030 |
| **Requires Engineering Phase** | YES |
| **Notes** | T005-LISTING-ELIGIBILITY-RULES.md defers status-based filtering until enum is defined |

---

### ITEM-002: Schema Column Count Mismatch (24 vs 28)

| Attribute | Value |
|-----------|-------|
| **Description** | T005 Main.gs hardcodes 28 columns, Canonical Schema defines 24 |
| **Current State** | 4-column discrepancy (columns Y-AB in Main.gs) |
| **Risk Level** | MEDIUM |
| **Affects Runtime** | NO (extra columns unused by downstream) |
| **Affected Modules** | T005 GAS |
| **Requires Engineering Phase** | YES |
| **Notes** | Extra columns may be legacy or undocumented. Need audit before removal. |

---

### ITEM-003: JSON Legacy Field Naming

| Attribute | Value |
|-----------|-------|
| **Description** | T005 JSON exports use legacy field names inconsistent with Canonical Schema |
| **Current State** | Observed: `productId` vs `UID`, `productName` vs `name` |
| **Risk Level** | LOW |
| **Affects Runtime** | NO (consumers adapt to current naming) |
| **Affected Modules** | T005 GAS, downstream JSON consumers |
| **Requires Engineering Phase** | YES |
| **Notes** | Breaking change if modified. Requires consumer impact analysis. |

---

### ITEM-004: UID Has No Locking Mechanism

| Attribute | Value |
|-----------|-------|
| **Description** | T005 UID column has no uniqueness enforcement or lock |
| **Current State** | UID uniqueness relies on convention, not system enforcement |
| **Risk Level** | HIGH |
| **Affects Runtime** | POTENTIAL (duplicate UID would cause data corruption) |
| **Affected Modules** | T005, C005, R020, T030 |
| **Requires Engineering Phase** | YES |
| **Notes** | Recommend implementing UID validation before write operations |

---

### ITEM-005: MODULE-REGISTRY/D005.md Write Permission Declaration

| Attribute | Value |
|-----------|-------|
| **Description** | D005.md declares "D005 為 T005/T002 Schema 的唯一寫入者" but T005 GAS is actual writer |
| **Current State** | Documentation error (ruled 2026-01-23) |
| **Risk Level** | LOW |
| **Affects Runtime** | NO |
| **Affected Modules** | Documentation only |
| **Requires Engineering Phase** | NO (documentation fix only) |
| **Notes** | Can be addressed in Governance-only Phase. See T005_CANONICAL_AUTHORITY.md Ruling 3. |

---

### ITEM-006: MODULE-REGISTRY/T005.md Schema Outdated

| Attribute | Value |
|-----------|-------|
| **Description** | MODULE-REGISTRY/T005.md shows only 8 columns, Canonical has 24 |
| **Current State** | Marked OUTDATED (2026-01-23), header block added |
| **Risk Level** | MEDIUM (misinformation risk) |
| **Affects Runtime** | NO |
| **Affected Modules** | New developer onboarding |
| **Requires Engineering Phase** | NO (documentation alignment only) |
| **Notes** | Header block warns readers. Full update deferred to future phase. |

---

## Risk Summary

| Risk Level | Count | Items |
|------------|-------|-------|
| HIGH | 1 | ITEM-004 |
| MEDIUM | 3 | ITEM-001, ITEM-002, ITEM-006 |
| LOW | 2 | ITEM-003, ITEM-005 |

---

## Runtime Impact Summary

| Affects Runtime | Count | Items |
|-----------------|-------|-------|
| YES | 0 | - |
| POTENTIAL | 1 | ITEM-004 |
| NO | 5 | ITEM-001, ITEM-002, ITEM-003, ITEM-005, ITEM-006 |

---

## Prohibited Actions

Until a dedicated Engineering Phase is approved:

- Do not attempt to fix any items in this backlog
- Do not "quick fix" schema mismatches
- Do not add validation logic
- Do not modify runtime behavior

---

## Next Steps (Requires Architect Approval)

1. **Governance-only Phase**: Address ITEM-005, ITEM-006 (documentation only)
2. **Engineering Phase A**: UID locking mechanism (ITEM-004)
3. **Engineering Phase B**: Schema alignment audit (ITEM-002, ITEM-003)
4. **Engineering Phase C**: Status enum definition (ITEM-001)

---

## Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-23 | v2026-01.1 | Initial backlog creation | Claude Code |

---

**END OF T005_GOVERNANCE_REPAIR_BACKLOG.md**
