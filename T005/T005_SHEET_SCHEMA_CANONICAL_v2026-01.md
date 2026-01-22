# T005 Sheet Schema - Canonical (Production)

> **STATUS**: EFFECTIVE
> **Version**: v2026-01.1
> **Effective Date**: 2026-01-17
> **Last Updated**: 2026-01-17 (新增 owner_company, _sync_source, _synced_at)
> **Authority**: Architect 裁定 (豪哥)

---

## 裁定語句

**C005 讀取 T005 以 row index 對應此 schema；不得引用已過期之抽象契約文件判定 row mapping。**

**C005 僅可讀取業務欄位（Column 1-21 + owner_company），禁止讀取 system 欄位（_sync_source, _synced_at）。**

---

## T005-1. 商品主表 - Production Schema (24 欄)

### 業務欄位（Business Fields）- C005 可讀取

| Column | Index (0-based) | Field Name (中文) | English Key | Data Type | C005 可用 |
|--------|-----------------|-------------------|-------------|-----------|-----------|
| 1 | 0 | UID | uid | string | ✅ |
| 2 | 1 | 供應商 | supplier | string | ✅ |
| 3 | 2 | PM | pm | string | ✅ |
| 4 | 3 | 品牌 | brand | string | ✅ |
| 5 | 4 | 商品型號 | model | string | ✅ |
| 6 | 5 | 商品名稱 | name | string | ✅ |
| 7 | 6 | 商品大類 | categoryMajor | string | ✅ |
| 8 | 7 | 商品中類 | categoryMiddle | string | ✅ |
| 9 | 8 | 商品小類 | categorySmall | string | ✅ |
| 10 | 9 | 真實未稅成本 | realCostNoTax | number | ✅ |
| 11 | 10 | 未稅成本 | costNoTax | number | ✅ |
| 12 | 11 | 含稅成本 | costWithTax | number | ✅ |
| 13 | 12 | 市價 | marketPrice | number | ✅ |
| 14 | 13 | 建議售價 | suggestedPrice | number | ✅ |
| 15 | 14 | 毛利率 | profitMargin | number | ✅ |
| 16 | 15 | 商品狀態 | status | string | ✅ |
| 17 | 16 | 國際條碼 | barcode | string | ✅ |
| 18 | 17 | 付款條件 | paymentTerms | string | ✅ |
| 19 | 18 | 備註 | notes | string | ✅ |
| 20 | 19 | 建檔日期時間 | createDateTime | datetime | ✅ |
| 21 | 20 | 最後更新日期時間 | updateDateTime | datetime | ✅ |
| 22 | 21 | 商品歸屬公司 | owner_company | enum | ✅ |

### System 欄位（System Reserved）- C005 禁止讀取

| Column | Index (0-based) | Field Name (中文) | English Key | Data Type | C005 可用 |
|--------|-----------------|-------------------|-------------|-----------|-----------|
| 23 | 22 | 同步來源 | _sync_source | string | ❌ |
| 24 | 23 | 同步時間 | _synced_at | datetime (ISO 8601) | ❌ |

---

## 欄位詳細規範

### owner_company（商品歸屬公司）

| 屬性 | 值 |
|------|-----|
| 類型 | enum |
| 允許值 | `HORUS`, `DAPANDA`, `MAAI` |
| 預設值 | 空（需人工填入）|
| 修改權限 | 僅人工或主資料流程 |
| 禁止行為 | ❌ 同步程式自動覆寫、❌ 平台資料推導 |

### _sync_source（同步來源）

| 屬性 | 值 |
|------|-----|
| 類型 | string |
| 說明 | 記錄資料同步來源系統 |
| 典型值 | `T002`, `MANUAL`, `API` |
| 修改權限 | 僅同步程式 |

### _synced_at（同步時間）

| 屬性 | 值 |
|------|-----|
| 類型 | datetime (ISO 8601) |
| 說明 | 最近一次同步的時間戳記 |
| 格式 | `2025-12-24T05:03:17.948Z` |
| 修改權限 | 僅同步程式 |

---

## C005 Row Mapping Contract

C005 Utils.js `readT005Data()` 必須使用以下 0-based index 映射：

```javascript
var product = {
  uid: row[0],              // UID
  supplier: row[1],         // 供應商
  pm: row[2],               // PM
  brand: row[3],            // 品牌
  model: row[4],            // 商品型號
  name: row[5],             // 商品名稱
  categoryMajor: row[6],    // 商品大類
  categoryMiddle: row[7],   // 商品中類
  categorySmall: row[8],    // 商品小類
  realCostNoTax: row[9],    // 真實未稅成本
  costNoTax: row[10],       // 未稅成本
  costWithTax: row[11],     // 含稅成本
  marketPrice: row[12],     // 市價
  suggestedPrice: row[13],  // 建議售價
  profitMargin: row[14],    // 毛利率
  status: row[15],          // 商品狀態
  barcode: row[16],         // 國際條碼
  paymentTerms: row[17],    // 付款條件
  notes: row[18],           // 備註
  createDateTime: row[19],  // 建檔日期時間
  updateDateTime: row[20],  // 最後更新日期時間

  // 比對用主鍵：使用商品型號
  productId: row[4] || row[0] || ''  // 優先商品型號，次 UID
};
```

---

## Validation Rules

| Rule | Expected Value |
|------|----------------|
| expectedColumns | 21 |
| Primary Key for matching | 商品型號 (row[4]) |
| Fallback Key | UID (row[0]) |

---

## Supersedes

本文件取代以下過期文件：
- `T005_DATA_CONTRACT_v1.0.md` (DEPRECATED)

---

## Changelog

| Version | Date | Description |
|---------|------|-------------|
| v2026-01 | 2026-01-17 | Initial Canonical Schema based on Production T005 Sheet (21 columns) |

---

**END OF T005_SHEET_SCHEMA_CANONICAL_v2026-01.md**
