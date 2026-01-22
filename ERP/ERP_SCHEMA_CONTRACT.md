# ERP Schema Contract (Canonical)

## Status
- Governance Level: Canonical
- Owner: HORUS
- Affected Modules: C005, C020
- Source Type: External ERP Excel Export

## Header Definition

- Header Row Index: 4 (1-based)
- Data Start Row: 5

## Canonical Headers

| Index | Header Name       | Description                  | Notes |
|------:|-------------------|------------------------------|-------|
| 1     | 倉庫名稱          | 倉別名稱                     | 單倉 |
| 2     | 產品編號          | ERP 商品主鍵（對 T005）      | 必填 |
| 5     | 產品說明          | 商品描述                     |       |
| 6     | 現有數量          | ERP 可用庫存（顯示用）       | C020 使用 |
| 4     | 實際在庫存量      | ERP 實際庫存量               | 備用 |
| 14    | 安全存量          | 安全庫存                     |       |

## Constraints
- Header row is fixed at row 4.
- Header names are authoritative; Consumers must not guess or alias.
- File name is not used as identifier.
- Single warehouse only (current phase).

## Explicit Non-Fields

The following fields are **NOT** provided by the ERP export:

| Field | Status | Rationale |
|-------|--------|-----------|
| `file_date` | Not provided | ERP export contains quantity only |
| `export_timestamp` | Not provided | No metadata in current export format |
| `snapshot_id` | Not provided | Non-snapshot data source |

**Design Decision**: ERP inventory is quantity-only data. Consumers must not fabricate temporal metadata.

## Notes
- Any schema change requires updating this contract before code changes.
- See `ERP_INVENTORY_DATE_OPTIONS.md` for future enhancement options.
