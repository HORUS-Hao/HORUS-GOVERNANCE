# ADR-004: GAS RPC Serialization Boundary

> **Status**: Accepted
> **Date**: 2026-01-19
> **Scope**: C005 Listing Checker

## 1. Problem

GAS `google.script.run` 回傳物件時，若包含 `Date`、`undefined`、或其他非 JSON-safe 型別，**整個回傳值可能變成 `null`**。

症狀：
- 前端收到 `raw=null`
- T005 載入卡在 90%
- 需二次點擊才能載入

## 2. Rule

**所有 RPC 出口（供 `google.script.run` 呼叫的函式）必須在 `return` 前執行 JSON round-trip：**

```javascript
// ✅ 正確
return JSON.parse(JSON.stringify(result));

// ❌ 錯誤
return result;
```

## 3. Scope

| 適用範圍 | 說明 |
|----------|------|
| Code.js | 所有 RPC 函式（getT005Data, getT005DataPaged, performComparison, getHistoryList, etc.） |
| Utils.js | readT005Data() 回傳點 |

**不適用：**
- 內部函式呼叫（非 RPC boundary）
- T005 Canonical Schema（不修改）
- FACT 資料寫入

## 4. Implementation

v3.2.1 已完成以下函式的序列化硬化：

- `getT005Data()` / `getT005DataPaged()`
- `performComparison()`
- `getHistoryList()` / `getHistoryDetail()` / `deleteHistory()`
- `processUploadedFile()` / `processUploadedFileWithMapping()`
- `exportComparisonResultsToExcel()`
- `getT005DataMinimal()` / `getT005DataSingle()` / `getT005DataTen()`
- `getPlatformStatusConfig()`

## 5. Governance Statement

- T005 Canonical `row[0]~row[23]` **未變動**
- `ownerCompany = row[23]` 照舊
- 本 ADR 僅規範 RPC 輸出層，不影響 FACT 或 DERIVED 資料

---

**Reference**: Code.js v2.3.15, Utils.js v3.2.0
