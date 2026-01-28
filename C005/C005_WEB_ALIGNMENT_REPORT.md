# C005 Web Alignment Report

> **Status**: PASS (Conditional)
> **Audit Date**: 2026-01-26
> **Phase**: Phase 3 Go-Live
> **Auditor**: Claude Code

---

## 1. EXECUTIVE SUMMARY

| 項目 | 結論 |
|------|------|
| **整體評估** | PASS (Conditional) |
| **欄位一致性** | ✅ PASS - 後端 SSOT 遵循 Output Contract |
| **型別一致性** | ✅ PASS - barcode 保持 string，number 欄位整數化 |
| **語意一致性** | ✅ PASS - UI 不做語意推論或重新計算 |
| **權限控制** | ✅ PASS - 敏感欄位依角色隱藏 |
| **條件說明** | ⚠️ UI-Constants.html 標籤與 Contract 有差異，但不影響資料正確性 |

---

## 2. ARCHITECTURE OVERVIEW

### 2.1 Web 資料流

```
C005 Backend (GAS)
    ↓ performComparison()
Comparison Result (JSON)
    ↓ google.script.run
Web UI (Browser)
    ↓ TableManager.displayResults()
HTML Table (Rendering)

Export Path:
Comparison Result
    ↓ ExportUtils.exportComparisonResults()
    ↓ getFieldValue() + formatBarcodeForExport()
Excel/Sheet (Download)
```

### 2.2 欄位定義 SSOT 層級

| 層級 | 檔案 | 角色 | 欄位數 |
|------|------|------|--------|
| **Contract** | C005_OUTPUT_CONTRACT.md | 治理標準 | 25 欄 |
| **Backend** | ExternalCanonical.js | 匯出 SSOT | 25 欄 |
| **Frontend** | UI-Constants.html | UI 顯示 | 18 欄 |

---

## 3. OUTPUT CONTRACT ALIGNMENT

### 3.1 External Canonical Columns (25 欄)

| # | Contract Key | ExternalCanonical.js | UI-Constants.html | 狀態 |
|---|--------------|---------------------|-------------------|------|
| 1 | supplier | ✅ 供應商 | ✅ 供應商 | PASS |
| 2 | pm | ✅ PM | ✅ PM | PASS |
| 3 | brand | ✅ 品牌 | ⚠️ 品牌(標準化) | PASS (標籤差異) |
| 4 | model | ✅ 商品型號 | ⚠️ 商品型號(標準化) | PASS (標籤差異) |
| 5 | erpProductId | ✅ ERP(產品編號) | ✅ ERP(產品編號) | PASS |
| 6 | name | ✅ 商品名稱 | ⚠️ 商品名稱(標準化) | PASS (標籤差異) |
| 7 | realCostNoTax | ✅ 真實未稅成本 | ❌ 不顯示 | PASS (權限) |
| 8 | costNoTax | ✅ 未稅成本 | ❌ 不顯示 | PASS (權限) |
| 9 | costWithTax | ✅ 含稅成本 | ❌ 不顯示 | PASS (權限) |
| 10 | marketPrice | ✅ 市價 | ❌ 不顯示 | PASS (權限) |
| 11 | barcode | ✅ 國際條碼 | ❌ 不顯示 | PASS (權限) |
| 12 | platform-momo | ✅ MOMO | ✅ MOMO | PASS |
| 13 | platform-pchome | ✅ PChome | ✅ PChome | PASS |
| 14 | platform-yahoo | ✅ Yahoo | ✅ Yahoo | PASS |
| 15 | platform-shopee-gusense | ✅ Shopee Gusense | ✅ Shopee Gusense | PASS |
| 16 | platform-shopee-katai | ✅ Shopee KATAI | ✅ Shopee KATAI | PASS |
| 17 | stock | ✅ ERP(庫存) | ✅ ERP 庫存 | PASS |
| 18 | t005Status | ✅ 商品狀態 | ✅ 商品狀態 | PASS |
| 19 | hasAnomaly | ✅ 異常 | ✅ 異常 | PASS |
| 20 | anomalyText | ✅ 異常說明 | ✅ 異常說明 | PASS |
| 21 | categoryMajor | ✅ 商品大類 | ⚠️ 商品分類(大) | PASS (標籤差異) |
| 22 | categoryMiddle | ✅ 商品中類 | ⚠️ 商品分類(中) | PASS (標籤差異) |
| 23 | categorySmall | ✅ 商品小類 | ⚠️ 商品分類(小) | PASS (標籤差異) |
| 24 | ownerCompany | ✅ 商品歸屬公司 | ❌ 不顯示 | PASS (待確認) |
| 25 | salesCompanies | ✅ 可銷售公司 | ❌ 不顯示 | PASS (待確認) |

### 3.2 不顯示欄位說明

| 欄位 | 原因 | 合規性 |
|------|------|--------|
| 成本欄位 (7-10) | OWNER/ADMIN 權限限制 | ✅ 符合 Visibility 定義 |
| barcode (11) | OWNER/ADMIN 權限限制 | ✅ 符合 Visibility 定義 |
| ownerCompany (24) | UI 未納入 | ⚠️ 可選顯示 |
| salesCompanies (25) | UI 未納入 | ⚠️ 可選顯示 |

---

## 4. DATA TYPE COMPLIANCE

### 4.1 Barcode 處理（CRITICAL）

**Contract 要求**：
- Type: `string` (NEVER number)
- Leading zeros MUST be preserved

**實作驗證**：

```javascript
// ExternalCanonical.js:354-368
function formatBarcodeForExport(value, target) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  var strValue = String(value);  // ✅ 強制轉字串

  if (target === EXPORT_TARGET.EXCEL) {
    // Excel: 強制文字，防止科學記號
    return "'" + strValue;  // ✅ 加 ' 前綴
  }

  // Sheet / Canonical: 原值輸出
  return strValue;  // ✅ 保持字串
}
```

**結論**：✅ PASS - barcode 處理完全符合 Contract

### 4.2 Number 欄位處理

```javascript
// ExternalCanonical.js:513-526
function formatDisplayValue(key, value) {
  // 成本/價格欄位 → 顯示整數
  if (COST_PRICE_FIELDS.indexOf(key) !== -1) {
    var n = Number(value);
    if (Number.isFinite(n)) {
      return Math.round(n);  // ✅ 整數化
    }
    return '';
  }
  // ...
}
```

**結論**：✅ PASS - 成本/價格欄位整數化輸出

---

## 5. SEMANTIC INTEGRITY

### 5.1 UI 層禁止行為檢查

| 禁止行為 | 檢查結果 |
|----------|----------|
| Web 重新計算 C005 結果 | ✅ 未發現 |
| Web 覆寫 C005 判斷 | ✅ 未發現 |
| Web 隱藏風險資訊 | ✅ 未發現（異常欄位正常顯示） |
| Web 補資料/推論 | ✅ 未發現 |

### 5.2 UI-Table.html 欄位渲染

```javascript
// UI-Table.html:374-458
_renderCell(result, fieldKey) {
  const td = document.createElement('td');

  switch (fieldKey) {
    case 'hasAnomaly':
      td.textContent = result.hasAnomaly ? '是' : '否';  // ✅ 直接使用 C005 結果
      // ...
      break;
    // ...
  }
}
```

**結論**：✅ UI 僅做顯示格式化，不做語意變更

### 5.3 角色權限檢查

```javascript
// ExternalCanonical.js:167-188
function canViewField(field, role) {
  var userRole = role || CURRENT_USER_ROLE;
  // ...
  return fieldDef.visibility.indexOf(userRole) !== -1;
}
```

**結論**：✅ 角色只影響可見性，不影響判斷結果

---

## 6. FINDINGS

### 6.1 通過項目

| # | 項目 | 說明 |
|---|------|------|
| 1 | 欄位 key 一致 | ExternalCanonical.js 與 Contract 完全一致 |
| 2 | barcode string type | formatBarcodeForExport 強制字串 |
| 3 | Excel 前導零保護 | 加 `'` 前綴 |
| 4 | 權限控制正確 | 敏感欄位依角色隱藏 |
| 5 | 無語意推論 | UI 不修改 C005 判斷 |

### 6.2 觀察項目（非阻擋）

| # | 項目 | 說明 | 建議 |
|---|------|------|------|
| 1 | 標籤差異 | UI 使用「(標準化)」後綴 | 可接受，不影響資料 |
| 2 | 公司欄位未顯示 | ownerCompany/salesCompanies 未在 UI 預設 | 可於 Phase 3+ 加入 |
| 3 | 雙 SSOT 架構 | ExternalCanonical.js (後端) + UI-Constants.html (前端) | 建議統一 |

### 6.3 阻擋項目

**無**

---

## 7. COMPLIANCE DECLARATION

本報告確認 C005 Web 輸出符合以下 Contract 條款：

1. **§2.2.1 T005 Product Information**: ✅ 欄位 key 一致
2. **§3 External Canonical Columns**: ✅ 25 欄 SSOT 正確
3. **§4.1 String Fields - barcode**: ✅ 強制字串，保留前導零
4. **§4.2 Number Fields**: ✅ 成本/價格整數化
5. **§6 Compliance Declaration - No T005 Write-Back**: ✅ UI 只讀

---

## 8. CONCLUSION

### 最終評估：**PASS (Conditional)**

**條件說明**：
- UI-Constants.html 標籤與 Contract 有輕微差異（「標準化」後綴）
- 此差異僅影響 UI 顯示，不影響資料正確性
- 不構成 Go-Live 阻擋因素

### Phase 4 Go-Live 資格

| 項目 | 狀態 |
|------|------|
| 欄位一致性 | ✅ Ready |
| 型別一致性 | ✅ Ready |
| 語意一致性 | ✅ Ready |
| Web Alignment | ✅ Ready |

**建議**：可進入 Phase 4 Go-Live 驗收

---

## 9. AUDIT SEAL

```
SEALED: 2026-01-26
AUDITOR: Claude Code (Phase 3 Go-Live)
SCOPE: C005 Web Alignment
CONCLUSION: PASS (Conditional)
CONTRACT_REF: C005_OUTPUT_CONTRACT.md v1.0.0
```

---

## APPENDIX: Files Audited

| 檔案 | 版本 | 角色 |
|------|------|------|
| ExternalCanonical.js | v3.1.4 | 後端 SSOT |
| ExportUtils.js | v3.1.2 | 匯出工具 |
| UI-Constants.html | v1.8.3 | 前端欄位配置 |
| UI-Table.html | v1.0.0 | 表格渲染 |
| Code.js | v2.3.14 | Web App 主程式 |
| C005_OUTPUT_CONTRACT.md | v1.0.0 | 治理標準 |
