# AI-BOOTSTRAP.md

> **Status**: EFFECTIVE
> **Audience**: All AI Agents / Automation / Cursor / Claude Code
> **Role**: Mandatory bootstrap & boundary declaration
> **Version**: v1.0
> **Effective Date**: 2026-01-06

---

## Purpose

This document establishes the **mandatory governance rules** that ALL AI agents, automation scripts, and development tools must follow when operating within the HORUS system.

**Every AI session MUST read this document before performing any file operations.**

---

## Core Principles

### 1. No Self-Created Structures

AI agents are **STRICTLY PROHIBITED** from:

- Creating new root-level directories
- Creating new layer hierarchies
- Inventing new folder naming conventions
- Adding intermediate directories not defined in the Document Map

### 2. Single Source of Truth for Document Placement

**The ONLY authority for document placement is:**

```
HORUS-GOVERNANCE/REGISTRY/HORUS-DOCUMENT-MAP_v1.0.md
```

All AI agents MUST consult this document before:
- Creating any new file
- Moving any existing file
- Suggesting any structural changes

### 3. When In Doubt, STOP and ASK

If an AI agent encounters ANY of the following situations, it MUST:
1. **STOP** immediately
2. **DO NOT** proceed with assumptions
3. **ASK** the Architect (豪哥) for clarification

Situations requiring human decision:
- Destination path is unclear
- Multiple valid placement options exist
- Document Map does not cover the case
- Structural change is required

---

## HORUS Tri-Layer Architecture

The HORUS system consists of THREE and ONLY THREE root directories:

| Root | Purpose | AI Write Permission |
|------|---------|---------------------|
| `HORUS-GOVERNANCE` | Policies, contracts, registry | ❌ Restricted |
| `HORUS-FACTS` | Raw observed data (immutable) | ❌ Restricted |
| `HORUS-DERIVED` | Computed/aggregated outputs | ⚠️ With approval |

### Permission Rules

1. **HORUS-GOVERNANCE**: AI may NOT create or modify files without explicit Architect approval
2. **HORUS-FACTS**: AI may NOT modify existing facts; new facts require Architect approval
3. **HORUS-DERIVED**: AI may write derived outputs only when explicitly instructed

---

## Mandatory Pre-Flight Check

Before ANY document operation, AI agents MUST execute this checklist:

```markdown
## AI Pre-Flight Checklist

- [ ] Have I read AI-BOOTSTRAP.md? (this document)
- [ ] Have I consulted HORUS-DOCUMENT-MAP_v1.0.md?
- [ ] Is the target path explicitly defined in the Document Map?
- [ ] Am I certain this is NOT creating a new structure?
- [ ] If unsure, have I asked the Architect?
```

---

## Standard Prompt Prefix

When instructing AI agents on document tasks, include this prefix:

```
Before proceeding:
- Read and follow: HORUS-GOVERNANCE/AI-BOOTSTRAP.md
- Use document placement authority:
  HORUS-GOVERNANCE/REGISTRY/HORUS-DOCUMENT-MAP_v1.0.md
```

---

## Prohibited Actions

The following actions are **ABSOLUTELY FORBIDDEN** without explicit Architect approval:

| Action | Reason |
|--------|--------|
| Create new root directory | Violates tri-layer architecture |
| Rename existing directories | May break references |
| Delete any folder (even empty) | May be placeholder for future use |
| Move files between roots | May violate data classification |
| Create new Data Contract | Requires governance review |
| Modify existing YAML/JSON schemas | May break downstream systems |

---

## Enforcement

This document is enforced by:
- All AI agents reading this at session start
- Pre-commit hooks (where applicable)
- Architect review on structural changes

Violations will result in:
1. Immediate rollback of changes
2. Session termination if repeated
3. Documentation of incident for future prevention

---

## Related Documents

- **Document Placement Authority**: `HORUS-GOVERNANCE/REGISTRY/HORUS-DOCUMENT-MAP_v1.0.md`
- **Governance Principles**: `HORUS-GOVERNANCE/GOVERNANCE-PRINCIPLES.md`
- **Field Semantic Charter**: `HORUS-GOVERNANCE/FIELD-SEMANTIC-CHARTER.md`

---

## Change Log

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release |

---

**END OF AI-BOOTSTRAP.md**
