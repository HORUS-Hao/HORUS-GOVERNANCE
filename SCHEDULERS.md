# HORUS Governance – Schedulers Registry

## Purpose
This document is the single source of truth for all automated schedulers
in the HORUS Governance System.

Any machine rebuild, laptop change, or disaster recovery
MUST refer to this document.

---

## Scheduler ID: GOV-SCAN-DAILY

### Type
Windows Task Scheduler

### Purpose
Daily governance scan (Node.js Scanner v1.5.3)

### Entry Point
G:\我的雲端硬碟\HORUS-GOVERNANCE\schedulers\run-governance-scan.bat

### Schedule
- Frequency: Daily
- Time: 09:00 (Local)

### Outputs
- JSON: HORUS-DERIVED/reports/governance-scan-latest.json
- CSV / MD reports
- Google Sheet: GOV-001-Governance-Ledger → DAILY_SNAPSHOTS
- Dashboard: [HORUS 治理戰情室](https://lookerstudio.google.com/reporting/23963830-51b4-4a0b-a258-6bbb017abbec/page/pUimF)

### Recovery Instructions
1. Clone / sync Google Drive
2. Install Node.js + npm
3. Open Windows Task Scheduler
4. Recreate task pointing to the Entry Point above

### Owner
HORUS / Architect

### Status
ACTIVE
