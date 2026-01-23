# C005 Platform FACT Schema

## Status
- State: FROZEN
- Version: v1
- Effective Date: 2026-01-23

## FACT Definition
- Grain: Platform / Day
- Snapshot Type: DAILY
- Snapshot ID: DAILY-YYYY-MM-DD-<timestamp>

## Source of Truth
- Canonical Source: D005 Listing_History
- Aggregation: Daily aggregation by platform
- Platforms: MOMO, PCHOME, YAHOO, SHOPEE

## Aggregation Rules
- is_listed = true counted as listed
- coverage_rate = listed / total
- No inference, no backfill, no platform guessing

## Write Policy
- Append-only per snapshot_id
- No overwrite on same day
- One row per platform per day

## Verification Evidence
- Date: 2026-01-23
- Platforms OK: 4
- Source Rows (D005): 2909
- Write Result: 4 inserted, 0 overwritten, 0 skipped

## Notes
- PCHOME coverage < 100% is treated as data quality issue upstream (P0/D005), not C005 error.
