# BACKLOG: ERP Snapshot Metadata (Option B)

> **Status**: Backlog (Not Started)
> **Type**: Future Enhancement
> **Priority**: Low (no immediate business need)
> **Created**: 2026-01-17
> **Owner**: Pending Assignment

---

## Summary

Establish a proper metadata mechanism for ERP inventory snapshots at the **upstream** layer.

---

## Scope

### In Scope

- Define `source_status.json` schema
- Modify ERP export workflow to generate metadata
- Document ingestion pipeline requirements

### Out of Scope

- C020 code changes (C020 is consumer only)
- Any client-side date inference
- Retroactive metadata for historical exports

---

## Proposed Schema

```json
// source_status.json
{
  "current_file": {
    "file_date": "YYYY-MM-DD",
    "export_timestamp": "YYYY-MM-DDTHH:mm:ss+08:00",
    "source": "ERP_EXCEL_EXPORT",
    "record_count": 1234
  }
}
```

---

## Responsibility Boundary

| Layer | Responsibility |
|-------|----------------|
| ERP Export Process | **Generates** metadata |
| Ingestion Pipeline | **Writes** metadata alongside data |
| C020 | **Consumes only** (read-only, no generation) |

---

## Principles

1. **C020 does not generate metadata** — it only consumes
2. **No fallback** — if metadata absent, display "N/A"
3. **Single source of truth** — metadata comes from export process only

---

## Prerequisites

Before implementation:

1. ERP export process must be formalized
2. Ingestion pipeline must exist
3. Business requirement must justify effort
4. Separate Phase task and Architect ruling required

---

## References

- `ERP_SCHEMA_CONTRACT.md` — Current canonical schema
- `ERP_INVENTORY_DATE_OPTIONS.md` — Full options analysis
- `C020_BASELINE_v6.7.5.md` — Final ruling documentation

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-17 | Backlog item created |

---

**END OF BACKLOG-ERP-SNAPSHOT-METADATA.md**
