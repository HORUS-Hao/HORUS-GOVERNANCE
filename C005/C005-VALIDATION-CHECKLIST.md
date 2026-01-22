# C005 Validation Checklist

> **Status**: EFFECTIVE
> **Module**: C005 - Listing Checker
> **Purpose**: 部署與欄位異動時的制度化驗證流程
> **Version**: v1.0
> **Effective Date**: 2026-01-17

---

## 1. 驗證時機

以下情況**必須**執行本驗證清單：

| 時機 | 說明 |
|------|------|
| 部署後 | 每次 `clasp push` 或手動貼上 GAS Editor 後 |
| T005 欄位異動 | T005 Sheet 新增/刪除/調整欄位後 |
| C005 Utils.js 變更 | 修改 row mapping 邏輯後 |
| 疑似 Schema 不符 | 出現「欄位數不符」或資料錯位時 |

---

## 2. 前端 Console 驗證指令

在 C005 Web App 頁面開啟 DevTools Console，執行以下指令：

### 2.1 版本指紋驗證

```javascript
google.script.run
  .withSuccessHandler(r => console.log('FINGERPRINT:', r))
  .withFailureHandler(e => console.error('FINGERPRINT_ERR:', e))
  .getRuntimeFingerprint();
```

**預期結果**：
```
FINGERPRINT: C005-v2.3.1-2026-01-17
```

### 2.2 T005 Schema 驗證

```javascript
google.script.run
  .withSuccessHandler(r => console.log('T005_SCHEMA:', r))
  .withFailureHandler(e => console.error('T005_SCHEMA_ERR:', e))
  .diag_getT005Schema();
```

**預期結果**：
```javascript
T005_SCHEMA: {
  success: true,
  sheetId: "1MHeqKjpt7Iq1mV7OvLMYIqjr2UVIMgK1DJqFU3a8jSk",
  worksheetName: "T005-1.商品主表",
  headerCount: 21,
  headers: ["UID", "供應商", "PM", "品牌", "商品型號", "商品名稱", ...],
  expectedCount: 21,
  isValid: true,
  message: "Schema 驗證通過 (21 欄)"
}
```

---

## 3. 驗收標準

| 檢查項目 | 預期值 | 不符處理 |
|----------|--------|----------|
| `fingerprint` | 與最新部署版本一致 | 重新部署或確認 clasp push 成功 |
| `headerCount` | 21 | 見 Section 4 |
| `isValid` | true | 見 Section 4 |
| `headers[0]` | "UID" | T005 Sheet 結構可能被異動 |
| `headers[4]` | "商品型號" | 比對主鍵欄位位置 |

---

## 4. 欄位數不符處理流程

若 `headerCount !== expectedCount`：

### 4.1 欄位數 > 21（T005 新增欄位）

1. 確認新增欄位名稱（從 `headers` 陣列末尾查看）
2. 更新 `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md`
3. 更新 `Utils.js` 的 `expectedColumns` 值
4. 更新 `Code.js` 的 `diag_getT005Schema()` 中 `expectedCount`
5. 若 C005 需要使用新欄位，更新 row mapping
6. 提交 Git commit

### 4.2 欄位數 < 21（T005 刪除欄位）

1. **暫停部署** - 確認是否為意外刪除
2. 與 T005 負責人確認變更原因
3. 若為正式變更，更新所有相關文件
4. 更新 C005 row mapping（可能需要調整 index）

---

## 5. 文件同步要求

以下文件的 `expectedCount` / `欄位數` 必須一致：

| 文件位置 | 欄位 |
|----------|------|
| `HORUS-GOVERNANCE/T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | 欄位清單 |
| `C005/webapp/Utils.js` | `expectedColumns = 21` |
| `C005/webapp/Code.js` | `diag_getT005Schema()` 中 `expectedCount = 21` |

**規則**：三處必須同步，否則視為治理缺陷。

---

## 6. Deployment Registry 登記格式

每次部署後，在 `HORUS-GOVERNANCE/C005/DEPLOYMENT-REGISTRY.md` 登記：

```markdown
## [日期] 部署記錄

| 項目 | 值 |
|------|---|
| 版本 | v2.3.1 |
| deploymentId | AKfycb... |
| fingerprint | C005-v2.3.1-2026-01-17 |
| headerCount | 21 |
| 變更摘要 | 新增 diag_getT005Schema 診斷工具 |
| 驗證結果 | PASSED |
```

---

## 7. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-17 | 初版制度化驗證流程 |

---

**END OF C005-VALIDATION-CHECKLIST.md**
