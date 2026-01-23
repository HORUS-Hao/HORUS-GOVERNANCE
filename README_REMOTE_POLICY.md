# HORUS-GOVERNANCE Remote Policy

## Canonical Status

This repository is designated as a **Local Canonical Governance Vault**.

The canonical authority of HORUS governance artifacts is defined by
its physical filesystem location, not by any remote Git repository.

Authoritative path:
G:\我的雲端硬碟\HORUS-GOVERNANCE

## Remote Policy

- This repository **MUST NOT** attach any Git remote.
- This repository **MUST NOT** be pushed to GitHub, GitLab, or any external Git service.
- Any cloned or mirrored copy is **NON-AUTHORITATIVE** by definition.

## Git Usage Scope

Git is used **locally only** for:
- Change history tracking
- Audit trail
- Governance evolution review

Git is **NOT** used for:
- Distribution
- Synchronization
- Collaboration

## Related Canonical Layers

- HORUS-DERIVED: Analysis / Audit / Regenerable Outputs
- HORUS-FACTS: Canonical Facts (Single Source of Truth)
- HORUS-GOVERNANCE: Constitution / Policy / Decisions (**this repository**)

These three layers are governed by **path-based authority**, not by remote repositories.

## Enforcement

Any request to:
- add a Git remote
- push this repository
- fork or mirror this repository

must be explicitly approved by the HORUS Architect.

Absent such approval, the default action is **DENY**.

---

Status: ACTIVE
Effective Date: 2026-01-23
Authority: HORUS Architect
