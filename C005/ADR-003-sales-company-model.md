# ADR-003: 可銷售公司資料模型設計

> 建立日期：2026-01-19
> 狀態：✅ 已裁定
> 關聯文件：C005-T005-Field-Governance.md

---

## 1. 決策背景

### 1.1 問題陳述
C005 Listing Checker 需要顯示「可銷售公司」（salesCompanies）欄位，表示商品實際可在哪些公司銷售/上架。

### 1.2 現有限制
- T005 Canonical Schema 固定為 24 欄（ADR-001/ADR-002 已裁定）
- `ownerCompany`（第 24 欄）表示「商品歸屬公司」，與「可銷售公司」語意不同
- 一個商品可能歸屬 HORUS，但同時可在 DAPANDA、MAAAI 銷售（1:N 關係）

---

## 2. 決策內容

### 2.1 為什麼不用 T005 第 25 欄？

| 原因 | 說明 |
|------|------|
| **治理已鎖定** | ADR-002 已裁定 C005 僅讀取 24 欄，擴展需另案 |
| **語意不同** | ownerCompany = 歸屬，salesCompanies = 授權銷售 |
| **1:N 關係** | 單欄無法優雅表達多公司（需逗號分隔或 JSON） |
| **維護成本** | 修改 T005 Schema 影響範圍大，需同步更新多模組 |

### 2.2 為什麼使用獨立資料表？

| 優點 | 說明 |
|------|------|
| **關注點分離** | T005 管「商品基本資料」，新表管「銷售授權」 |
| **彈性擴展** | 可新增欄位（status、授權日期、備註）無需改 T005 |
| **效能可控** | C005 可選擇性 join，不影響其他讀取 T005 的模組 |
| **治理明確** | 新 FACT 有獨立 ADR，變更可追溯 |

### 2.3 與 ownerCompany 的差異

| 欄位 | 語意 | 資料來源 | 關係 |
|------|------|----------|------|
| ownerCompany | 商品「歸屬」哪家公司（資產持有者） | T005 第 24 欄 | 1:1 |
| salesCompanies | 商品「可在」哪些公司銷售（銷售授權） | T005_SALES_COMPANY | 1:N |

**範例**：
- 商品 `NB-F80` 歸屬 HORUS（ownerCompany = 'HORUS'）
- 但 DAPANDA、MAAAI 也可銷售（salesCompanies = ['HORUS', 'DAPANDA', 'MAAAI']）

---

## 3. 資料模型設計

### 3.1 新 Sheet：T005_SALES_COMPANY

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| uid | STRING | 商品 UID（對應 T005.uid） | `NB-F80` |
| salesCompanyCode | STRING | 可銷售公司代碼 | `HORUS` / `DAPANDA` / `MAAAI` |
| status | STRING | 狀態 | `ACTIVE` / `DISABLED` |

### 3.2 資料範例

| uid | salesCompanyCode | status |
|-----|------------------|--------|
| NB-F80 | HORUS | ACTIVE |
| NB-F80 | DAPANDA | ACTIVE |
| NB-F80 | MAAAI | ACTIVE |
| ITW-S70 | HORUS | ACTIVE |
| ITW-S70 | DAPANDA | DISABLED |

### 3.3 Sheet 位置

- **Sheet ID**：與 T005 同一 Spreadsheet（`1MHeqKjpt7Iq1mV7OvLMYIqjr2UVIMgK1DJqFU3a8jSk`）
- **Worksheet Name**：`T005_SALES_COMPANY`

---

## 4. C005 讀取邏輯

### 4.1 讀取流程

```
1. 讀取 T005（24 欄 Canonical）→ products[]
2. 讀取 T005_SALES_COMPANY → salesCompanyMap
3. 以 uid JOIN：
   for each product in products:
     product.salesCompanies = salesCompanyMap[product.uid] || []
4. 返回給前端
```

### 4.2 效能考量

| 策略 | 說明 |
|------|------|
| Batch 讀取 | 一次讀取整個 T005_SALES_COMPANY，不逐筆查詢 |
| 快取 | 與 T005 共用 5 分鐘快取策略 |
| Lazy Load | 若前端不需要 salesCompanies，可跳過 join |

### 4.3 禁止事項

- ❌ 禁止修改 T005 Canonical 欄位
- ❌ 禁止在 T005 加入第 25 欄
- ❌ 禁止影響既有 T005 fail-fast 機制

---

## 5. 前端整合

### 5.1 已有定義（無需修改）

- `ExternalCanonical.js:151` - salesCompanies 欄位定義
- `UI-Table.html:499-505` - 渲染邏輯
- `UI-Filter.html:360-362` - 篩選邏輯

### 5.2 資料格式

```javascript
// product 物件結構
{
  uid: 'NB-F80',
  ownerCompany: 'HORUS',           // FACT from T005 row[23]
  salesCompanies: ['HORUS', 'DAPANDA', 'MAAAI']  // FACT from T005_SALES_COMPANY
}
```

---

## 6. 治理規則

### 6.1 變更規則

| 變更類型 | 需要更新的檔案 |
|----------|----------------|
| 新增公司代碼 | T005_SALES_COMPANY Sheet |
| 修改讀取邏輯 | Utils.js / SalesCompanyService.js |
| 修改顯示 | ExternalCanonical.js、UI-Table.html |
| 治理變更 | 本 ADR 文件 |

### 6.2 驗收條件

- [ ] T005_SALES_COMPANY Sheet 已建立並有測試資料
- [ ] C005 能正確讀取並產生非空 salesCompanies
- [ ] T005 Canonical（24 欄）完全未修改
- [ ] 前端能正確顯示與篩選

---

## 7. 版本歷史

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2026-01-19 | v1.0 | 初版建立 |

---

## 附錄：相關 ADR

- ADR-001: ownerCompany 為 T005 Canonical 第 24 欄
- ADR-002: 「可銷售公司」不納入 T005 Canonical
- ADR-003: 可銷售公司資料模型設計（本文件）
