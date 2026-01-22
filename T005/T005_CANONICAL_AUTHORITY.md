# T005 Canonical Authority

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: FINAL / SEALED
> **Authority**: Architect Ruling (2026-01-23)

---

## Purpose

This document establishes the **single source of truth** for T005 governance decisions.

**All other documents, if conflicting with this file, are superseded by this document.**

---

## Ruling 1: T005 Canonical Schema

| Item | Ruling |
|------|--------|
| **Canonical Schema** | **24 columns** |
| **Authority Level** | **Unique / Final** |
| **Source File** | `HORUS-GOVERNANCE/T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` |

### Implications

- 24-column schema is the **only authoritative definition**
- 28-column (Main.gs legacy) = historical artifact, no governance authority
- 8-column (MODULE-REGISTRY) = outdated, no governance authority
- 29-column (deprecated contract) = superseded, no governance authority

### Column Reference (24 Columns)

| # | Column | Type |
|---|--------|------|
| A | UID | string |
| B | sku | string |
| C | name | string |
| D | brand | string |
| E | category | string |
| F | cost | number |
| G | price | number |
| H | status | string |
| I | spec | string |
| J | barcode | string |
| K | weight | number |
| L | dimension | string |
| M | supplier | string |
| N | supplier_sku | string |
| O | moq | number |
| P | lead_time | number |
| Q | warranty | string |
| R | origin | string |
| S | certification | string |
| T | launch_date | date |
| U | discontinue_date | date |
| V | note | string |
| W | created_at | datetime |
| X | updated_at | datetime |

---

## Ruling 2: MODULE-REGISTRY Status

| Item | Ruling |
|------|--------|
| **File** | `HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md` |
| **Status** | **OUTDATED / Non-Authoritative** |
| **Action** | Mark only, do not modify content |

### Implications

- MODULE-REGISTRY/T005.md shows only 8 columns (severely incomplete)
- It **must not** be used as schema reference
- It **must not** be updated to match Canonical (would require Engineering Phase)
- An OUTDATED header block will be added to prevent misuse

---

## Ruling 3: Write Permission Authority

| Item | Ruling |
|------|--------|
| **Declared Writer** | D005 (per MODULE-REGISTRY/D005.md) |
| **Actual Writer** | T005 GAS |
| **Ruling** | **Governance documentation error** |

### Implications

- T005 GAS is the **actual and legitimate sole writer** to T005 Sheet
- D005 declaration in MODULE-REGISTRY is **incorrect documentation**
- This does **not** constitute unauthorized access (no越權)
- No Engineering Phase required to fix runtime behavior
- Documentation correction may be addressed in future Governance Phase

---

## Conflict Resolution

If any document conflicts with this file:

1. **This document takes precedence**
2. Conflicting document should be marked as OUTDATED or SUPERSEDED
3. No runtime changes should be made based on conflicting documents

---

## Prohibited Actions (Under Current FREEZE)

- Modifying T005 Sheet structure
- Adjusting T005 GAS code
- Adding/removing columns
- Changing write permissions at runtime
- "Quick fixes" or "improvements"

---

## Authorized Dependencies

The following modules may safely depend on T005 as SSOT:

| Module | Dependency Type |
|--------|-----------------|
| C005 | Base Universe (read-only) |
| R020 | Product reference (read-only) |
| T030 | Margin simulation source (read-only) |

---

## Change Log

| Date | Version | Change | Authority |
|------|---------|--------|-----------|
| 2026-01-23 | v2026-01.1 | Initial ruling document | Architect |

---

## Approval

| Role | Status | Date |
|------|--------|------|
| Architect | APPROVED | 2026-01-23 |

---

**END OF T005_CANONICAL_AUTHORITY.md**
