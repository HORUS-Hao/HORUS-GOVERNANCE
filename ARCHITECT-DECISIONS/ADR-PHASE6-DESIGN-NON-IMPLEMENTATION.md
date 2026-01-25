# ADR: Phase 6 Intentional Non-Implementations

> **TYPE**: GOVERNANCE / ARCHITECT DECISION RECORD
> **STATUS**: ACCEPTED
> **DATE**: 2026-01-25
> **AUTHOR**: Claude Code (Architect)

---

## Context

During Phase 6 (Read-Only Usage) gap scan, several items were identified as "NOT IMPLEMENTED" or "RESERVED". This ADR formally documents these as **intentional design decisions**, not missing features.

---

## Decision

The following items are **BY DESIGN** not implemented in Phase 6:

### 1. strategy_mapping Sheet

| Item | Status | Rationale |
|------|--------|-----------|
| strategy_mapping | PHASE 5 RESERVED | Not needed for read-only display usage |
| Strategy inference logic | NOT IMPLEMENTED | Phase 6 is display-only, no inference |

**Governance Lock:**
- strategy_mapping remains RESERVED until explicit Architect directive
- No code shall read or reference strategy_mapping sheet

### 2. Eligibility Inference

| Item | Status | Rationale |
|------|--------|-----------|
| Eligibility conditional logic | NOT IMPLEMENTED | Phase 6 is read-only |
| Status-based decisions | FORBIDDEN | No if/else on status values |
| Automatic eligibility assignment | NOT IMPLEMENTED | Human-only workflow |

### 3. T005_SALES_COMPANY Inference

| Item | Status | Rationale |
|------|--------|-----------|
| `if (商品歸屬公司 ...)` | FORBIDDEN | Read-only projection only |
| `if (可銷售公司 ...)` | FORBIDDEN | Local write zone, no logic |
| Automatic sales company assignment | NOT IMPLEMENTED | Human-only workflow |

### 4. Phase 7+ Features

| Item | Status | Rationale |
|------|--------|-----------|
| sales_company_manual_result | RESERVED | Future Phase 7+ |
| sales_company_manual_note | RESERVED | Future Phase 7+ |
| filled_by / filled_at | RESERVED | Future Phase 7+ |
| R020 dependency on C005-Eligibility | NOT ACTIVE | Await Architect directive |

---

## Consequences

### Positive

- Clear governance boundary for Phase 6
- Prevents misinterpretation of "gaps" as bugs
- Documents intentional simplicity

### Negative

- None - these are explicit design choices

---

## Verification

All items listed above have been verified as:
1. Not present in codebase (grep verified)
2. Explicitly documented as RESERVED or NOT IMPLEMENTED
3. Protected by governance guards in code

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `PHASE6-CLOSURE.md` | Phase 6 progress record |
| `ADR-PHASE6-READONLY-USAGE.md` | Phase 6 definition |
| `T005_SALES_COMPANY_PHASE6_USAGE.md` | Column usage declaration |
| `STRATEGY-MAPPING-PHASE5-RESERVED.md` | Phase 5 reservation |

---

## Status

**ACCEPTED** - These non-implementations are intentional design decisions for Phase 6.

---

**END OF ADR-PHASE6-DESIGN-NON-IMPLEMENTATION.md**
