# Dashboard Decision Output

## 1. Output Identification
- Output Name: Governance Dashboard (HORUS 治理戰情室)
- Output Type: Dashboard
- Owner: Governance Layer
- Affected Audience: Internal Decision Makers, Architects, Management

## 2. Governance Rules
- Dashboard MUST display DecisionLayer FINAL data only
- Raw data MUST NOT appear in Dashboard
- ACCEPTED_RISK must be explicitly labeled as 🟡 Risk Accepted
- Dashboard and A002 Mail share the same Final Snapshot Source
- Dashboard MUST NOT recalculate statistics independently

## 3. Engineering Requirements
- Data source: DAILY_SNAPSHOTS (final_healthy, final_warning, final_danger)
- Git commit required for any behavioral changes
- Commit message must describe decision-channel behavior
- Annotated Git tag required to mark effective date

## 4. Governance Artifacts (Required)
- Governance Changelog: This document
- Governance Contract: Looker Studio data source configuration
- Reference: Looker Studio Report ID 23963830-51b4-4a0b-a258-6bbb017abbec

## 5. Verification Checklist
- [x] Dashboard values = Final Snapshot (final_healthy, final_warning, final_danger)
- [x] Dashboard values match A002 Mail subject line
- [x] Raw data columns not exposed in Dashboard
- [x] ACCEPTED_RISK modules counted in 🟡 warning

## 6. Data Source Alignment
- Primary Source: GOV-001-Governance-Ledger → DAILY_SNAPSHOTS
- Final Columns Used:
  - final_healthy (🟢)
  - final_warning (🟡)
  - final_danger (🔴)
  - overrides_applied
- Raw Columns (FORBIDDEN in Dashboard):
  - raw_healthy
  - raw_warning
  - raw_danger

## 7. Status
- State: SEALED
- Effective Date: 2026-01-28
- Version: v1.0

## 8. Reference Links
- Dashboard URL: https://lookerstudio.google.com/reporting/23963830-51b4-4a0b-a258-6bbb017abbec/page/pUimF
- Data Source: Google Sheet GOV-001-Governance-Ledger
- Related Output: A002 Mail (gov-mail-final-v1.9.1)
