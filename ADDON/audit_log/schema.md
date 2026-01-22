# ADDON_AUDIT_LOG Schema

**文件類型**: Schema Definition
**狀態**: Active
**適用範圍**: T002 ADD-ON Audit Log
**建立日期**: 2026-01-13
**治理文件**: ADDON_FUNCTION_BOUNDARY_T002.md

---

## Overview

This document defines the schema for the `ADDON_AUDIT_LOG` sheet, which is a **Non-Canonical** logging destination for T002 ADD-ON operations.

---

## Sheet Properties

| Property | Value |
|----------|-------|
| Sheet Name | `ADDON_AUDIT_LOG` |
| Type | Non-Canonical (Audit Only) |
| Access Mode | Append-only |
| Update Allowed | ❌ No |
| Delete Allowed | ❌ No |

---

## Column Schema

| # | Column Name | Type | Description | Required |
|---|-------------|------|-------------|----------|
| 1 | Timestamp | ISO 8601 String | Log entry creation time | ✅ Yes |
| 2 | User | String | User email or "Anonymous" | ✅ Yes |
| 3 | Session ID | String | Unique session identifier (e.g., S1A2B3C4) | ✅ Yes |
| 4 | Sheet Name | String | Active sheet name at trigger time | ✅ Yes |
| 5 | Sheet ID | Number/String | Active sheet ID | ✅ Yes |
| 6 | Function | String | Triggered function name | ✅ Yes |
| 7 | Result | Enum | Operation result status | ✅ Yes |
| 8 | Details | String | Brief description/notes | ⚪ Optional |
| 9 | Governance | String | Reference to governance document | ✅ Yes |

---

## Function Values

| Value | Description |
|-------|-------------|
| `Pre-submit Structure Check` | Step 2 structure validation |
| `Semantic Reasonableness Check` | Step 3 semantic validation |
| `UX Operation Assist` | Step 4 UX guidance |
| `Audit Log View` | Audit log viewer access |
| `Log Sheet Created` | Initial log sheet creation |

---

## Result Values

| Value | Description | Color Code |
|-------|-------------|------------|
| `PASS` | All checks passed | Green |
| `WARNINGS` | Warnings detected | Yellow |
| `INFO` | Informational | Blue |
| `BLOCKED` | Critical issues | Red |
| `ERROR` | System error | Red |

---

## Governance Constraints

### Allowed Operations

| Operation | Allowed |
|-----------|---------|
| Append new row | ✅ Yes |
| Read existing rows | ✅ Yes |
| Create sheet (if missing) | ✅ Yes |

### Forbidden Operations

| Operation | Allowed |
|-----------|---------|
| Update existing row | ❌ No |
| Delete row | ❌ No |
| Clear sheet | ❌ No |
| Write to other sheets | ❌ No |

---

## Example Log Entry

```
| Timestamp                | User              | Session ID | Sheet Name | Sheet ID | Function                    | Result   | Details                              | Governance                        |
|--------------------------|-------------------|------------|------------|----------|--------------------------------|----------|--------------------------------------|-----------------------------------|
| 2026-01-13T10:30:00.000Z | user@example.com  | S1A2B3C4   | T002_Data  | 12345    | Pre-submit Structure Check     | WARNINGS | Total: 50, Passed: 3, Warnings: 1    | ADDON_FUNCTION_BOUNDARY_T002.md   |
```

---

## Integration Points

### Step 2 Integration

```javascript
// Called after structure check completes
logStructureCheck(result);
```

### Step 3 Integration

```javascript
// Called after semantic check completes
logSemanticCheck(result);
```

### Step 4 Integration

```javascript
// Called when UX assist panel opens
logUXAssist(analysis);
```

---

## Non-Canonical Declaration

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ADDON_AUDIT_LOG is NOT part of T002 Canonical Schema        ║
║                                                               ║
║   - No data validation dependency                             ║
║   - No Phase 6 Validator integration                          ║
║   - No T005 transfer impact                                   ║
║   - Purely operational audit trail                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

*Schema version: 1.0*
*Created: 2026-01-13*
*Governance: ADDON_FUNCTION_BOUNDARY_T002.md*
