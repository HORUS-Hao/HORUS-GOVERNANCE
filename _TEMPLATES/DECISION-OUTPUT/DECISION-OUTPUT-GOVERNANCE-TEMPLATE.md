# Decision Output Governance Template

## 1. Output Identification
- Output Name:
- Output Type: (Mail / Dashboard / API / Export / Other)
- Owner:
- Affected Audience:

## 2. Governance Rules
- Output MUST use DecisionLayer FINAL data only
- Raw data MUST NOT appear in this output
- ACCEPTED_RISK must be explicitly labeled (e.g. 🟡 Risk Accepted)

## 3. Engineering Requirements
- Git commit required (no squash with unrelated changes)
- Commit message must describe decision-channel behavior
- Annotated Git tag required to mark effective date

## 4. Governance Artifacts (Required)
- Governance Changelog (.md)
- Governance Contract (code comment or doc)
- Reference commit hash
- Reference tag

## 5. Verification Checklist
- Output values = Final Snapshot
- Subject/Header/Body (if applicable) are consistent
- Raw data not exposed
- Manual test evidence recorded

## 6. Status
- Draft / Active / Sealed
- Effective Date:
