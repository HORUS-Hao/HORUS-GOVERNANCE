# Governance Index (Single Source of Truth)

This file is the **only authoritative entry point** for governance.

---

## Current State
- MCP Phase: **B (Governance Only)**

---

## Active Architecture Decision Records (ADR)

| ID | Title | Status | Path |
|----|------|--------|------|
| ADR-0001 | T005 / T002 Governance (B Phase) | ACTIVE | _GOVERNANCE/ADR/ADR-0001-T005-T002-B.md |

---

## Active Governance Rules (RUL)

| ID | Purpose | Status | Path |
|----|---------|--------|------|
| RUL-0001 | MCP Governance Reminder (Read-Only) | ACTIVE | _GOVERNANCE/RUL/RUL-0001-MCP-Governance-Reminder.md |

---

## Data Contracts (Authority: HORUS-GOVERNANCE)

> All Data Contracts are mirror-backed at: `_GOVERNANCE/MODULE-REGISTRY/`

| Module | Document | Status |
|--------|----------|--------|
| R020 | Scheduler Governance Note | ACTIVE |

---

## Frozen Modules (Soft Launch)

> Modules in this section are frozen for Soft Launch. Only bug fixes, deployment fixes, and permission/URL adjustments are allowed.

| Module | Status | Frozen Date | Notes |
|--------|--------|-------------|-------|
| S005-Submission-Entry | `UI_FROZEN_FOR_SOFT_LAUNCH` | 2026-01-05 | Quick Quotation Tool |
| V005-Quotation-Viewer | `READ_ONLY_PUBLIC_READY` | 2026-01-05 | Public Viewer |
| V005E-PDF | `EXTERNAL_DELIVERY_READY` | 2026-01-05 | PDF Export Sub-module |

**Freeze Rules:**
- No new fields
- No data structure changes
- No permission/edit feature additions
- No version logic modifications
- Phase 3 features explicitly prohibited

---

## Rules of Use

- If it is **not listed here**, it is **not active**.
- **AI Governance**: All AI/Agents MUST read the corresponding file in `_GOVERNANCE/MODULE-REGISTRY/` before modifying or extending any module.
- Do not rely on chat history or personal memory.
- Any MCP, schema, or integration discussion **must start from this file**.
