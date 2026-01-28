# Decision Registry (Governance Ledger)

/**
 * Governance Rule:
 * - Decision Registry is descriptive, not executable.
 * - System behavior is driven by DecisionLayer.
 * - Registry exists to explain and justify decisions to humans and auditors.
 */

This registry records all human governance decisions applied to the system.
It is the authoritative, human-readable explanation layer for DecisionLayer behavior.

---

## Decision Entry Template

- Decision ID:
- Decision Type: (ACCEPTED_RISK / REJECTED / APPROVED / OTHER)
- Scope: (Affected Modules / Outputs)
- Description:
- Rationale:
- Owner:
- Approved By:
- Effective Date:
- Target Date (if applicable):
- Status: (ACTIVE / EXPIRED / REVOKED)
- Related Commit / Tag:
- Notes:

---

## Registered Decisions

### DEC-001: A002 Final-Only Decision Output

- **Decision ID:** DEC-001
- **Decision Type:** APPROVED
- **Scope:** A002 Governance Mail, Dashboard, DAILY_SNAPSHOTS
- **Description:** All decision outputs (Mail, Dashboard) must display FINAL statistics only. Raw scanner data is forbidden in external-facing outputs.
- **Rationale:** Governance decisions override raw scanner results. Stakeholders should only see the official, human-reviewed state. Exposing raw data would undermine governance authority and create confusion.
- **Owner:** Architect
- **Approved By:** Governance Layer
- **Effective Date:** 2026-01-28
- **Target Date:** N/A (Permanent policy)
- **Status:** ACTIVE
- **Related Commit / Tag:** 8be890b / gov-mail-final-v1.9.1
- **Notes:** This decision established the principle that DecisionLayer output is the single source of truth for all decision channels. Raw data remains available in DAILY_SNAPSHOTS for audit purposes only.

---

### DEC-002: ACCEPTED_RISK Governance Semantics

- **Decision ID:** DEC-002
- **Decision Type:** APPROVED
- **Scope:** DecisionLayer, MODULE_DECISIONS, Mail, Dashboard
- **Description:** Modules with ACCEPTED_RISK decision are displayed as WARNING (🟡) regardless of raw scanner status (🔴). The risk acceptance must include owner, reason, and optional target_date.
- **Rationale:** Risk acceptance is a human judgment that technical debt is tolerable within defined constraints. System must honor this decision without re-judging. The 🟡 status signals "acknowledged but not resolved" to stakeholders.
- **Owner:** Architect
- **Approved By:** Governance Layer
- **Effective Date:** 2026-01-28
- **Target Date:** N/A (Permanent policy)
- **Status:** ACTIVE
- **Related Commit / Tag:** 8be890b / gov-mail-final-v1.9.1
- **Notes:** ACCEPTED_RISK entries are stored in MODULE_DECISIONS sheet with columns: module_id, decision_status, owner, reason, target_date, last_review_time, notes.

---

### DEC-003: Time-Based Risk Expiry (EXPIRED_RISK)

- **Decision ID:** DEC-003
- **Decision Type:** APPROVED
- **Scope:** DecisionLayer v1.9.5, MODULE_DECISIONS.target_date, Mail, DAILY_SNAPSHOTS.expired_count
- **Description:** When an ACCEPTED_RISK passes its target_date, the system marks it as EXPIRED but does NOT re-judge the status. The module retains 🟡 (WARNING) status with an 🟠 EXPIRED_RISK label. Human intervention is required for re-approval or resolution.
- **Rationale:**
  - System does NOT re-judge decisions (governance principle)
  - Expiry is a notification, not an automatic escalation
  - Only humans can change risk acceptance status
  - This preserves governance integrity while ensuring expired risks are visible
- **Owner:** Architect
- **Approved By:** Governance Layer
- **Effective Date:** 2026-01-28
- **Target Date:** N/A (Permanent policy)
- **Status:** ACTIVE
- **Related Commit / Tag:** 175520a / gov-mail-final-v1.9.5
- **Notes:**
  - Expired risks display: `🟠 EXPIRED_RISK` with `Target: YYYY-MM-DD (EXPIRED)`
  - expired_count field added to DAILY_SNAPSHOTS for dashboard alerting
  - When expired, governance owner must: extend target_date, create FIX_SCHEDULED, or complete remediation

---

### DEC-004: Dashboard as Official Decision Output

- **Decision ID:** DEC-004
- **Decision Type:** APPROVED
- **Scope:** Looker Studio Dashboard (HORUS 治理戰情室)
- **Description:** The Governance Dashboard is designated as an official Decision Output, bound by the same FINAL-only rule as A002 Mail. Dashboard must use final_healthy, final_warning, final_danger columns exclusively.
- **Rationale:** Dashboard and Mail must show identical numbers. Any divergence is a governance breach. Using raw_* columns in Dashboard would violate the Final-only principle.
- **Owner:** Architect
- **Approved By:** Governance Layer
- **Effective Date:** 2026-01-28
- **Target Date:** N/A (Permanent policy)
- **Status:** ACTIVE
- **Related Commit / Tag:** N/A (Dashboard configuration)
- **Notes:**
  - Dashboard URL: https://lookerstudio.google.com/reporting/23963830-51b4-4a0b-a258-6bbb017abbec
  - Data Source: GOV-001-Governance-Ledger → DAILY_SNAPSHOTS
  - Forbidden columns: raw_healthy, raw_warning, raw_danger

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-01-28 | Initial registry with DEC-001 through DEC-004 |
