# GOV-003｜T005 Eligibility Gate Placard

## Authority
- SSOT: SYS-000-HORUS-GOVERNANCE-CONSTITUTION.md

## Artifact
- Tag: t005-eligibility-gate-v2.1.0
- Commit: 4166235
- Verified: pass 909 / block 89 / unknown 0
- Governance: NO MUTATION / NO SIDE EFFECT

## Meaning
Eligibility Gate is a semantic filter layer. It must not:
- mutate T005 canonical fields
- normalize or rewrite T005 status values
- silently block unknown statuses (must fail-open by default unless explicitly decided otherwise)

## Default Policy
- fail-open for unknown status (eligible=true)
- blocked statuses are explicitly enumerated
- eligibility usage must be disclosed in any report/mail as ENABLED or DISABLED
