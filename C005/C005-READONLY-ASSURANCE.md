# C005 Phase D: Read-only Assurance

> **Version**: v1.1.0
> **Created**: 2026-01-20
> **Status**: ACTIVE
> **Authority**: HORUS-GOVERNANCE
> **Prerequisite**: Phase C-Closure (c005-phase-c-closure-v3.0.3) SEALED

---

## 1. Read-only Definition (Hard Specification)

### 1.1 Allowed Operations (Phase D Scope)

Phase D **ONLY** permits:

| Operation | Description |
|-----------|-------------|
| Read in-memory results | Access cached/computed data |
| Read comparison snapshot | If already exists, read-only |
| Read schema metadata | Schema hash, column definitions |
| Output console/return | `console.log()`, `return { metrics: ... }` |

### 1.2 Forbidden Patterns (Strict Prohibition)

The following patterns are **STRICTLY FORBIDDEN** in Phase D:

```javascript
// === Spreadsheet Write Operations ===
SpreadsheetApp.*.set*          // Any setter method
SpreadsheetApp.*.appendRow     // Append operations
Range.setValue                 // Single cell write
Range.setValues                // Multi-cell write
Range.clear*                   // Clear operations

// === Drive Write Operations ===
DriveApp.create*               // Create files/folders
DriveApp.makeCopy              // Copy operations
DriveApp.setSharing            // Permission changes

// === Network Write Operations ===
UrlFetchApp.fetch              // Unless SEALED & governed (Phase D adds none)

// === Properties Write Operations ===
PropertiesService.getScriptProperties().set*
PropertiesService.getUserProperties().set*
PropertiesService.getDocumentProperties().set*

// === Log Sheet Write Operations ===
// Any custom log sheet write is FORBIDDEN
```

### 1.3 Grep-Verifiable Patterns

For static verification, search for these regex patterns:

```
SpreadsheetApp\.[^(]*set
\.setValue
\.setValues
\.appendRow
\.clear
DriveApp\.create
\.makeCopy
PropertiesService\.[^(]*set
```

---

## 2. Read-only Whitelist (Verification Basis)

### 2.1 Allowed Function Types

| Function Pattern | Purpose | Notes |
|------------------|---------|-------|
| `getRuntimeIdentity()` | Return runtime version/build ID | Read-only |
| `getSchemaHash()` | Return schema fingerprint | Read-only |
| `runComparisonDry()` | Dry-run comparison (metadata only) | No persistence |
| `emitObservabilityMetrics()` | Return metrics object | Console/return only |
| `verify*()` | Verification functions | Read-only scan |

### 2.2 Governance Note

This whitelist defines **categories of acceptable behavior**, not a requirement to implement these functions. The focus is on establishing clear boundaries and verifiable patterns.

---

## 3. Violation Rollback Conditions (Hard Decision)

### 3.1 Immediate Rollback Triggers

Any Phase D commit containing **forbidden patterns** (Section 1.2) triggers:

1. **Immediate tag withdrawal** - Phase D tag revoked
2. **Rollback to**: `c005-phase-c-closure-v3.0.3`
3. **No hotfix allowed** - Must re-enter Phase D cleanly

### 3.2 Rollback Procedure

```bash
# If Phase D violation detected:
git tag -d c005-phase-d-*        # Delete Phase D tag
git reset --hard c005-phase-c-closure-v3.0.3
git push origin --force-with-lease
```

### 3.3 Re-entry Requirement

After rollback, Phase D re-entry requires:
- Full static verification PASS
- Architect approval
- Clean working directory

---

## 4. Observability Metrics (Output Layer Only)

### 4.1 Metrics Whitelist

| Metric | Type | Description |
|--------|------|-------------|
| `runtime_version` | string | Current runtime version |
| `tag_or_build_id` | string | Git tag or build identifier |
| `comparison_count` | number | Number of comparisons executed |
| `missing_field_count` | number | Fields with missing data |
| `schema_hash` | string | Hash of current schema |
| `execution_time_ms` | number | Execution duration |

### 4.2 Output Restrictions (Hard Specification)

**ALLOWED**:
```javascript
console.log(metrics);
return { metrics: { ... } };
```

**FORBIDDEN**:
```javascript
// Log to Sheet
logSheet.appendRow([...]);
// New RPC endpoint (RPC Hardening SEALED)
// Any persistent storage
```

### 4.3 Existing Log-to-Sheet Behavior

If existing code contains log-to-sheet behavior:
- **DO NOT MODIFY** (Phase C SEALED)
- Document as "existing behavior" in this file
- Note risk level
- Do not add new log-to-sheet patterns

---

## 5. Non-blocking Submodule Dirty Exception

### 5.1 Exception Record

| Item | Value |
|------|-------|
| **Submodule** | `80-聊天記錄-CHAT-LOGS/Gemini-Chat-Logger` |
| **Dirty Reason** | `desktop.ini` files tracked in upstream repo but not present in Google Drive environment |
| **Commit Status** | Correct (`a6efec3450fa2fefff4c07a19880998975ef2e32`) |
| **Working Tree** | Shows deleted `desktop.ini` (environment-specific) |

### 5.2 Why This Does Not Affect Phase D

1. **Location**: Submodule is in `80-聊天記錄-CHAT-LOGS/`, completely outside C005 scope
2. **No Code Dependency**: C005 has zero dependency on this submodule
3. **Read-only Assurance Scope**: Phase D only verifies `C005-Listing-Checker/webapp/` files
4. **Root Cause**: Upstream tracking error, not Phase D violation

### 5.3 Exception Classification

> ⚠️ **This exception is SPECIFIC to this case and does NOT constitute a general bypass.**
>
> Future submodule dirty states require individual Architect review.
> This exception applies ONLY to:
> - Submodule: `Gemini-Chat-Logger`
> - Reason: `desktop.ini` environment incompatibility
> - Phase: D (Read-only Assurance)

---

## 6. Static Verifier Reference

### 6.1 Verifier Location

```
scripts/phase-verifiers/C005_PhaseD_Readonly_Verifier.js
```

### 6.2 Verifier Output Specification

| Result | Meaning |
|--------|---------|
| `PASS` | No **new** forbidden patterns introduced (existing exceptions allowed) |
| `FAIL` | New forbidden patterns found outside exception list |
| `BLOCK` | Scan failed or path unclear |

### 6.3 Scan Scope

- Target: `10-基礎服務層-BASE-SERVICES/C005-Listing-Checker/webapp/**/*.js`
- Extensions: `.js`, `.gs`
- Excludes: `node_modules/`, `.git/`, `temp_backup_*/`

### 6.4 Verifier Semantic Clarification

The Verifier distinguishes between:
- **(A) New forbidden patterns** (Phase D introduced) → **FAIL**
- **(B) Existing forbidden patterns** (Phase C SEALED) → **ALLOW with exception**

Phase D goal: **Prevent new write patterns**, not eliminate existing ones.

---

## 7. Existing Write Behavior Exceptions (Phase C SEALED)

> ⚠️ **CRITICAL GOVERNANCE STATEMENT**
>
> The following files contain write operations that **pre-date Phase D**.
> These are **Phase C SEALED** behaviors. They:
> - **MUST NOT be modified**
> - **MUST NOT be removed**
> - **MUST NOT be expanded** (no new write calls in these files)
> - Are allowed to exist as **documented exceptions**

### 7.1 Exception Registry

| File | Write Behavior | Purpose | Exception Reason |
|------|---------------|---------|------------------|
| `DiagnosticTools.js` | `setValue`, `setValues` | Write diagnostic data to sheet | Debug/diagnostic tool, not user-facing |
| `ExportUtils.js` | `setValues` | Export comparison results to sheet | Core export functionality (user-requested) |
| `HistoryManager.js` | `setValues`, `appendRow` | Record comparison history | History tracking (user-requested) |
| `SheetDataWriter.js` | `clear`, `setValues`, `appendRow` | Generic sheet write utility | Infrastructure for export/history |
| `SYNC_T005_SALES_COMPANY.js` | `setValues`, `clearContent` | Sync T005_SALES_COMPANY data | **Phase C Governed** (assertWritePermission) |

### 7.2 Per-File Exception Details

#### 7.2.1 DiagnosticTools.js

| Item | Value |
|------|-------|
| **Patterns Found** | `setValue` (7), `setValues` (8) |
| **Behavior** | Writes raw data snapshots to diagnostic sheet |
| **Risk Level** | Low (diagnostic only, not production data path) |
| **Governance** | Existing behavior, DO NOT MODIFY |

#### 7.2.2 ExportUtils.js

| Item | Value |
|------|-------|
| **Patterns Found** | `setValues` (4) |
| **Behavior** | Exports comparison results to new sheet |
| **Risk Level** | Medium (creates sheets, but user-initiated) |
| **Governance** | Existing behavior, DO NOT MODIFY |

#### 7.2.3 HistoryManager.js

| Item | Value |
|------|-------|
| **Patterns Found** | `setValues` (4), `appendRow` (1) |
| **Behavior** | Records comparison history for audit trail |
| **Risk Level** | Medium (persistent storage, but append-only) |
| **Governance** | Existing behavior, DO NOT MODIFY |

#### 7.2.4 SheetDataWriter.js

| Item | Value |
|------|-------|
| **Patterns Found** | `clear` (1), `setValues` (3), `appendRow` (1) |
| **Behavior** | Generic utility for sheet write operations |
| **Risk Level** | High (used by multiple modules) |
| **Governance** | Existing behavior, DO NOT MODIFY |

#### 7.2.5 SYNC_T005_SALES_COMPANY.js

| Item | Value |
|------|-------|
| **Patterns Found** | `setValues` (2), `clearContent` (1) |
| **Behavior** | Sync T005_SALES_COMPANY schema and data |
| **Risk Level** | **Governed** (Phase C RPC Hardening) |
| **Governance** | **SEALED** - protected by `assertWritePermission()` |

### 7.3 Expansion Prohibition

> ❌ **PROHIBITED ACTIONS**
>
> 1. Adding new `setValue`/`setValues`/`appendRow`/`clear*` calls to ANY of the above files
> 2. Creating new files with write patterns
> 3. Modifying existing write calls (even "improvements")
> 4. Removing write calls (breaks existing functionality)
>
> Any such change requires **new Phase** with Architect approval.

---

## 8. Phase D Governance Summary

| Item | Status |
|------|--------|
| Prerequisite | Phase C-Closure SEALED ✅ |
| Scope | C005 only |
| Allowed | Read, console.log, return |
| Forbidden | Any write operation |
| Rollback Point | `c005-phase-c-closure-v3.0.3` |
| Verification | Static scan required |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-20 | v1.1.0 | Add Existing Write Behavior Exceptions (Phase C SEALED); Update Verifier semantics | Claude Code |
| 2026-01-20 | v1.0.0 | Initial Phase D Read-only Assurance document | Claude Code |

---

**END OF C005-READONLY-ASSURANCE.md**
