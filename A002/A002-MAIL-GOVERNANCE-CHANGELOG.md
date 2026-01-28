# A002 Mail Governance Injection

- Date: 2026-01-28
- Version: v1.9.1
- Change Type: Decision Channel Alignment

## Summary
Mail output has been aligned with DecisionLayer Final status.
Raw statistics are no longer exposed via Email.

## Effects
- ACCEPTED_RISK displayed as 🟡 with Risk Accepted label
- Subject/Header/Footer reflect Final statistics only
- V005-Quotation-Viewer now shows as 🟡 (Risk Accepted) instead of 🔴

## Technical Changes
- MailTemplate.js: Uses final_status for grouping and display
- Code.js: Passes dualStats and overrides to buildMailBody()
- Config.js: VERSION updated to v1.9.1

## Governance Contract
- Mail MUST reflect DecisionLayer FINAL status only
- Raw data is strictly forbidden in Email output
- Any violation is considered a governance breach

## Reference
- Git commit: 8be890b
- Git tag: gov-mail-final-v1.9.1
- GAS Script ID: 1YAuuS4XjhfjX7CjOHY5VTpkoyTGnFmCohz1xrhQCCdpR5Xi0uMvANKm6
