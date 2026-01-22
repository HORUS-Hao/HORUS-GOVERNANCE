# HORUS-PDM Governance

本目錄包含 HORUS-PDM 系統的治理文件與架構決策記錄。

---

## Governance & MCP

- T005 is the **Canonical Schema**.
- MCP operates under explicit **Decision Records**.
- Current phase: **B (Governance Only)**

---

## Active Decision Records

| ADR | Title | Status | Phase |
|-----|-------|--------|-------|
| [ADR-0001](ADR/ADR-0001-T005-T002-B.md) | T005 × T002 Governance | ACTIVE | B |

---

## Active Rules

| RUL | Title | Type | Authority |
|-----|-------|------|-----------|
| [RUL-0001](RUL/RUL-0001-MCP-Governance-Reminder.md) | MCP Governance Reminder | Read-Only | ADR-0001 |

---

## Key Principles

1. **Any MCP, schema, or integration change MUST reference an ADR.**
2. **ADR is the sole authority** - not Slack, not conversation history.
3. **Phase transitions require explicit Architect approval.**

---

## Directory Structure

```
_GOVERNANCE/
├── README.md           # This file
├── ADR/
│   ├── README.md       # ADR 說明
│   └── ADR-0001-T005-T002-B.md   # T005 × T002 治理決策（B 階段）
└── RUL/
    └── RUL-0001-MCP-Governance-Reminder.md   # MCP 治理提醒規則
```

---

## For AI Agents

If you are an AI agent working on this codebase:

1. **Before any MCP / T005 action** → Apply RUL-0001 first.
2. **Do not rely on memory** → Check the ADR.
3. **Do not infer permissions** → The ADR is explicit.

Current constraints (B Phase):
- Do NOT start MCP Server
- Do NOT write technical RUL / Skill
- Do NOT let MCP read/write T005
- Reminder-only RUL is allowed (with Architect approval)

---

*Maintained by: Architect*
*Last updated: 2026-01-01*
