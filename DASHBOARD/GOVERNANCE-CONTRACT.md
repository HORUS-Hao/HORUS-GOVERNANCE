# Dashboard Governance Contract

/**
 * Governance Contract:
 * - Dashboard is an Official Decision Output
 * - FINAL data only
 * - Raw data forbidden
 * - Any deviation is a governance breach
 */

## Data Source Configuration

### Looker Studio Data Source
- Connected Sheet: GOV-001-Governance-Ledger
- Target Tab: DAILY_SNAPSHOTS

### Allowed Fields (FINAL)
| Field | Description | Usage |
|-------|-------------|-------|
| scan_time_local | Scan timestamp | X-axis, filter |
| final_healthy | 🟢 after decisions | Scorecard, chart |
| final_warning | 🟡 after decisions | Scorecard, chart |
| final_danger | 🔴 after decisions | Scorecard, chart |
| overrides_applied | Decision count | Metric |

### Forbidden Fields (RAW)
| Field | Reason |
|-------|--------|
| raw_healthy | Raw data, not decision output |
| raw_warning | Raw data, not decision output |
| raw_danger | Raw data, not decision output |

## Enforcement
- Any chart/scorecard using raw_* fields is a governance violation
- Dashboard must be audited if Mail and Dashboard numbers diverge
- Changes to data source require governance review

## Verification
- Dashboard 🟢 = Mail subject 🟢 = DAILY_SNAPSHOTS.final_healthy
- Dashboard 🟡 = Mail subject 🟡 = DAILY_SNAPSHOTS.final_warning
- Dashboard 🔴 = Mail subject 🔴 = DAILY_SNAPSHOTS.final_danger
