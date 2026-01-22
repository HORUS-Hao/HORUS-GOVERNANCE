# ERP Inventory Date Display — Options Analysis

> **Document Type**: Architecture Decision Record (ADR)
> **Status**: DECIDED
> **Date**: 2026-01-17
> **Author**: Claude Code (Fact Check Agent)
> **Decision Authority**: Architect (Hao)
> **Final Decision**: **Option A Adopted** (2026-01-17)

---

## Background

### Confirmed Facts

| Item | Status |
|------|--------|
| `source_status.json` | Does not exist |
| `file_date` field | Not defined in ERP Schema Contract |
| ERP Inventory Data Type | **Quantity-only, non-snapshot** |
| C020 v5.12.0 Behavior | DEPLOYED / CORRECT / FAIL-CLOSED |

### Current ERP Schema Contract

Per `ERP_SCHEMA_CONTRACT.md`:

```
Source Type: External ERP Excel Export
Canonical Headers:
- 產品編號 (Product ID)
- 現有數量 (Available Quantity) ← C020 uses this
- (No date field defined)
```

**The ERP data source provides quantity values only. No temporal metadata exists.**

---

## Option A: Maintain Current State (Recommended)

### Description

Accept that ERP inventory has **no associated date** as a design fact.

### Implementation

1. **No code changes** to C020
2. Update UI documentation/tooltips to clarify:
   - "ERP Inventory: quantity reference only"
   - "Date not available from source"
3. Add governance note to `C020_BASELINE`:
   ```
   ERP Date: Not provided by upstream
   Design Choice: Quantity-only display
   ```

### Rationale

- **Honesty**: Displays only what the data source actually provides
- **Governance Integrity**: No fabricated metadata
- **Stability**: Zero code changes, zero regression risk

### Trade-offs

| Pro | Con |
|-----|-----|
| Maintains data honesty | Users don't know data freshness |
| No deployment risk | May cause confusion initially |
| Aligns with fail-closed principle | Requires user education |

---

## Option B: Establish ERP Snapshot Metadata (Future Enhancement)

### Description

Create a proper snapshot metadata mechanism at the **upstream ERP export/ingestion layer**.

### Required Upstream Change

When ERP data is exported or received, generate:

```json
// source_status.json
{
  "current_file": {
    "file_date": "2026-01-17",
    "export_timestamp": "2026-01-17T09:30:00+08:00",
    "source": "ERP_EXCEL_EXPORT",
    "record_count": 1234
  }
}
```

### Responsibility Boundary

| Layer | Responsibility |
|-------|----------------|
| ERP Export Process | **Generates** `source_status.json` |
| Ingestion Pipeline | **Writes** metadata alongside data |
| C020 | **Consumes only** (read-only) |

### Implementation Steps

1. Define metadata schema in `ERP_SCHEMA_CONTRACT.md`
2. Modify ERP export workflow to generate metadata
3. C020 reads metadata if present, displays "N/A" if absent

### Rationale

- **Proper Architecture**: Date comes from source of truth
- **Scalable**: Pattern reusable for other data sources
- **Honest**: Only displays date when genuinely known

### Trade-offs

| Pro | Con |
|-----|-----|
| Correct architecture | Requires upstream process change |
| Reusable pattern | Implementation effort outside C020 |
| Audit-friendly | Dependency on external workflow |

---

## Option C: Client-Side Fallback (NOT RECOMMENDED)

### Description

Use `lastModified` / `now()` / filename parsing to infer a date.

### Why This Is Rejected

| Violation | Explanation |
|-----------|-------------|
| **Governance Honesty** | Displays fabricated data as if it were fact |
| **Fail-Closed Principle** | Violates "no data = no display" rule |
| **Audit Trail** | Creates false impression of data currency |
| **User Trust** | Misleads users about data freshness |

### Explicit Prohibition

```
DO NOT:
- Parse date from filename
- Use file lastModified timestamp
- Use current date/time as proxy
- Display "estimated" or "approximate" dates
```

**This option is documented only to explicitly reject it.**

---

## Recommendation

**Option A (Maintain Current State)** for immediate term.

**Option B (ERP Snapshot Metadata)** as future enhancement when:
- ERP export process is formalized
- Ingestion pipeline exists
- Business requirement justifies effort

---

## Decision Record

| Date | Decision | Authority |
|------|----------|-----------|
| 2026-01-17 | Options documented | Claude Code |
| 2026-01-17 | **Option A Adopted** | Architect (Hao) |
| 2026-01-17 | Option B deferred to backlog | Architect (Hao) |
| 2026-01-17 | Option C permanently rejected | Architect (Hao) |

---

## References

- `ERP_SCHEMA_CONTRACT.md` — Canonical ERP field definitions
- `C020_BASELINE_v6.7.5.md` — C020 frozen baseline
- `GOV-UAG/User-Access-Gate.md` — Governance pattern reference

---

**END OF ERP_INVENTORY_DATE_OPTIONS.md**
