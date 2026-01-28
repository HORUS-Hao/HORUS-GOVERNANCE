# A002 Risk Expiry Governance

## 1. Overview
- Feature: Time-based Risk Governance (EXPIRED_RISK)
- Version: v1.9.5
- Effective Date: 2026-01-28

## 2. Governance Principle

**System does NOT re-judge decisions.**

When a risk acceptance expires:
- The module retains its WARNING (🟡) status
- System marks `risk_state = EXPIRED`
- Human intervention is required for re-approval
- No automatic escalation to DANGER (🔴)

This preserves governance integrity: only humans make risk decisions.

## 3. Data Model

### MODULE_DECISIONS Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | module_id | Module identifier |
| B | decision_status | ACCEPTED_RISK, FIX_SCHEDULED, DEPRECATED, ACCEPT_DEBT |
| C | owner | Decision owner |
| D | reason | Justification |
| E | target_date | Expiration date (YYYY-MM-DD) |
| F | last_review_time | Last review timestamp |
| G | notes | Additional notes |

### risk_state Values
| State | Meaning |
|-------|---------|
| ACTIVE | Risk accepted, not expired |
| EXPIRED | Risk accepted but past target_date |
| SCHEDULED | Fix scheduled, tracking |
| DEPRECATED | Module deprecated, excluded from metrics |

## 4. Visual Indicators

### Mail Display
- Active Risk: `⚠️ Risk Accepted` (yellow tag)
- Expired Risk: `🟠 EXPIRED_RISK` (orange tag) + `Target: YYYY-MM-DD (EXPIRED)`

### Dashboard
- Expired risks remain in 🟡 (warning) count
- `expired_count` field available for dashboard alerts

### DAILY_SNAPSHOTS
New column: `expired_count` records the number of expired risk acceptances

## 5. Governance Rules

1. **No Auto-Escalation**: System NEVER changes 🟡 back to 🔴 based on expiry
2. **Human Re-Approval**: Expired risks require manual review to extend or resolve
3. **Audit Trail**: All state changes recorded in DAILY_SNAPSHOTS
4. **Warning Visibility**: Expired risks prominently displayed in mail header

## 6. Decision Flow

```
Scanner Output (🔴)
    ↓
Decision Layer reads MODULE_DECISIONS
    ↓
ACCEPTED_RISK found with target_date
    ↓
Is target_date < today?
    ├─ YES → final_status = 🟡, risk_state = EXPIRED
    └─ NO  → final_status = 🟡, risk_state = ACTIVE
    ↓
Mail/Dashboard shows FINAL status with appropriate label
```

## 7. Action Required When Expired

When a risk expires, the governance owner must:
1. Review the original risk acceptance reason
2. Either:
   - Extend target_date if risk still acceptable
   - Create remediation plan and change to FIX_SCHEDULED
   - Complete the fix to remove the decision entry
3. Update MODULE_DECISIONS with new decision

## 8. Affected Files

| File | Version | Change |
|------|---------|--------|
| Code.js | v1.9.5 | Handle expiredCount return value |
| Config.js | v1.9.5 | Version bump |
| DecisionLayer.js | v1.9.5 | Expiry logic, risk_state field |
| MailTemplate.js | v1.9.5 | EXPIRED_RISK display, orange styling |
| SheetWriter.js | v1.9.5 | expired_count column |

## 9. Verification Checklist

- [x] Expired risk shows 🟠 EXPIRED_RISK tag in mail
- [x] Expired risk shows target_date (EXPIRED) label
- [x] Expired count in mail header and footer
- [x] expired_count written to DAILY_SNAPSHOTS
- [x] Final status remains 🟡 (never auto-escalates to 🔴)
- [x] All files version-synchronized to v1.9.5
