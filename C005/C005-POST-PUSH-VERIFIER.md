# C005 Post-Push Verifier Specification

## Purpose
Validates that clasp push operations maintain schema integrity and RPC contract compliance.

## Verification Checkpoints

### 1. Code Signature Check
- Validates BUILD_FINGERPRINT exists and is non-empty
- Pass criteria: `typeof BUILD_FINGERPRINT === 'string' && BUILD_FINGERPRINT.length > 0`

### 2. Header Structure Check
- Validates T005_SALES_COMPANY headers match canonical schema
- Required headers (Chinese canonical):
  - 主鍵UID
  - 商品型號
  - 成本
  - 定價
  - 銷售公司
  - 類別

### 3. Primary Key Check
- Validates UID column exists and contains unique values
- Pass criteria: No duplicate UIDs in dataset

### 4. Human Field Check
- Validates at least one human-readable field exists
- Pass criteria: 商品型號 or model field present

## Execution

### Manual Execution (GAS Console)
```javascript
// Step 1: Refresh seed data
refreshT005SalesCompanySeed();

// Step 2: Run verifier
verifySalesCompanyPostPush();
```

### Expected Output
```
=== T005_SALES_COMPANY Post-Push Verifier (v3.0.3) ===
[1/4] Code Signature: PASS
[2/4] Header Structure: PASS
[3/4] Primary Key (UID): PASS
[4/4] Human Field (商品型號): PASS
=== 驗證完成: 4/4 PASS ===
```

## Failure Handling

| Check | Failure Cause | Resolution |
|-------|---------------|------------|
| Code Signature | BUILD_FINGERPRINT missing | Verify clasp push completed |
| Header Structure | Schema mismatch | Check T005 canonical headers |
| Primary Key | Duplicate UIDs | Debug data source |
| Human Field | Missing 商品型號 | Verify T005 schema alignment |

## Integration with CI

Currently manual execution only. Future enhancement may include:
- Automated trigger post-clasp-push
- GitHub Actions integration for deployment validation

## Related Documents
- C005-GOVERNANCE.md
- C005-RPC-CONTRACT.md
- ADR-001: CI Minimal Guardrail
