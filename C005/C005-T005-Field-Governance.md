# C005-T005 欄位治理文件 v1.2

> 建立日期：2026-01-19
> 最後更新：2026-01-19
> v1.2 更新：新增 ADR-003 可銷售公司資料模型、salesCompanies 欄位定義
> v1.1 更新：補充 ownerCompany 明確裁定、排除「可銷售公司」

---

## 0. 關鍵裁定（ADR）

### ADR-001: ownerCompany 為 T005 Canonical 第 24 欄

| 項目 | 內容 |
|------|------|
| **決策日期** | 2026-01-19 |
| **狀態** | ✅ 已裁定 |
| **裁定內容** | `ownerCompany`（商品歸屬公司）為 T005 Canonical Schema 第 24 欄（row[23]） |
| **資料來源** | T005-1.商品主表 第 24 欄 |
| **實作位置** | Utils.js 第 258 行：`ownerCompany: row[23]` |
| **可選值** | `HORUS` / `DAPANDA` / `MAAAI` |

### ADR-002: 「可銷售公司」不納入 T005 Canonical

| 項目 | 內容 |
|------|------|
| **決策日期** | 2026-01-19 |
| **狀態** | ✅ 已裁定 |
| **裁定內容** | 「可銷售公司」欄位**不屬於** T005 Canonical Schema |
| **原因** | C005 僅讀取 24 欄，「可銷售公司」若存在於 T005 Sheet 第 25 欄以後，C005 不讀取 |
| **影響** | ~~C005 不提供「可銷售公司」篩選或顯示功能~~ → 改由 ADR-003 獨立資料模型處理 |
| **未來考量** | ✅ 已由 ADR-003 解決 |

### ADR-003: 可銷售公司資料模型（獨立 FACT）

| 項目 | 內容 |
|------|------|
| **決策日期** | 2026-01-19 |
| **狀態** | ✅ 已裁定 |
| **裁定內容** | `salesCompanies`（可銷售公司）使用獨立 Sheet `T005_SALES_COMPANY` 儲存 |
| **資料來源** | 新 Sheet `T005_SALES_COMPANY`（uid, salesCompanyCode, status） |
| **關係** | 1:N（一商品可多公司銷售） |
| **與 ownerCompany 差異** | ownerCompany = 歸屬公司（1:1），salesCompanies = 銷售授權（1:N） |
| **詳細設計** | 見 [ADR-003-sales-company-model.md](./ADR-003-sales-company-model.md) |

---

## 1. 欄位分類定義

### 1.1 業務欄位（Business）
供業務邏輯使用，前後端皆需存取。

| Key | 說明 |
|-----|------|
| uid | 主鍵 |
| supplier | 供應商 |
| pm | 負責 PM |
| brand | 品牌 |
| model | 型號 |
| name | 商品名稱 |
| categoryMajor | 大分類 |
| categoryMiddle | 中分類 |
| categorySmall | 小分類 |
| status | 商品狀態 |

### 1.2 系統欄位（System）
系統自動維護，一般不對使用者顯示。

| Key | 說明 |
|-----|------|
| createDateTime | 建立時間 |
| updateDateTime | 更新時間 |
| ownerCompany | 所屬公司 |

### 1.3 外部 FACT 欄位（External FACT）
非 T005 Canonical，但有獨立 FACT 來源。

| Key | 說明 | 來源 | ADR |
|-----|------|------|-----|
| salesCompanies | 可銷售公司 | T005_SALES_COMPANY Sheet | ADR-003 |

### 1.4 前端衍生欄位（Derived / UI-only）
前端計算或組合產生，後端無對應欄位。

| Key | 說明 | 來源 |
|-----|------|------|
| erpProductId | ERP 商品 ID | 衍生自 erp 物件 |
| t005Status | T005 狀態（前端 key） | 對應後端 status |
| hasAnomaly | 是否有異常 | 前端分析產生 |
| anomalyText | 異常說明 | 前端分析產生 |
| platform-* | 各平台狀態 | 前端組合 |
| stock | 庫存 | 衍生自 erp 物件 |

### 1.5 不對 UI 暴露欄位（Hidden）
包含敏感資訊或業務無需顯示。

| Key | 說明 | 隱藏原因 |
|-----|------|----------|
| realCostNoTax | 實際成本（未稅） | 成本敏感 |
| costNoTax | 成本（未稅） | 成本敏感 |
| costWithTax | 成本（含稅） | 成本敏感 |
| marketPrice | 市場價 | 非必要顯示 |
| suggestedPrice | 建議售價 | 非必要顯示 |
| profitMargin | 毛利率 | 成本敏感 |
| barcode | 條碼 | 非必要顯示 |
| paymentTerms | 付款條件 | 非必要顯示 |
| notes | 備註 | 非必要顯示 |

---

## 2. T005 → C005 欄位映射表

| # | 後端 Key (Utils.js) | 前端 Key (UI-Constants) | 是否顯示 | 使用模組 |
|---|---------------------|------------------------|----------|----------|
| 1 | uid | - | ❌ | - |
| 2 | supplier | supplier | ✅ | Table, Filter |
| 3 | pm | pm | ✅ | Table |
| 4 | brand | brand | ✅ | Table, Filter |
| 5 | model | model | ✅ | Table |
| 6 | name | name | ✅ | Table, Sort |
| 7 | categoryMajor | categoryMajor | ✅ | Table, Filter |
| 8 | categoryMiddle | categoryMiddle | ✅ | Table, Filter |
| 9 | categorySmall | categorySmall | ✅ | Table, Filter |
| 10 | realCostNoTax | - | ❌ | - |
| 11 | costNoTax | - | ❌ | - |
| 12 | costWithTax | - | ❌ | - |
| 13 | marketPrice | - | ❌ | - |
| 14 | suggestedPrice | - | ❌ | - |
| 15 | profitMargin | - | ❌ | - |
| 16 | status | t005Status | ✅ | Table |
| 17 | barcode | - | ❌ | - |
| 18 | paymentTerms | - | ❌ | - |
| 19 | notes | - | ❌ | - |
| 20 | createDateTime | - | ❌ | - |
| 21 | updateDateTime | - | ❌ | - |
| 22-23 | (保留) | - | - | - |
| 24 | ownerCompany | - | ❌ | - |
| - | (衍生) productId | productId | ✅ | Sort |
| - | (衍生) | erpProductId | ✅ | Table |
| - | (衍生) | platform-* | ✅ | Table, Filter, Sort |
| - | (衍生) | stock | ✅ | Table, Sort |
| - | (衍生) | hasAnomaly | ✅ | Table |
| - | (衍生) | anomalyText | ✅ | Table |
| - | (External FACT) salesCompanies | salesCompanies | ✅ | Table, Filter |

---

## 3. Single Source of Truth 裁定

### 3.1 資料事實層（FACT）
**T005 Schema（Utils.js 第 199-241 行）為唯一真實來源**
- 欄位順序、欄位數量、欄位名稱以 T005 為準
- 任何欄位變更必須先修改 T005

### 3.2 顯示層（VIEW）
**UI-Constants.html 為前端顯示設定**
- 僅定義「需要顯示」的欄位子集
- 不得自行新增「業務欄位 key」
- 衍生欄位需明確標註來源

### 3.3 禁止事項
- ❌ 前端禁止自行新增業務欄位 key
- ❌ 前端禁止假設 T005 欄位順序
- ❌ 前端禁止硬寫 T005 欄位索引

---

## 4. 變更規則（Fail-fast 治理）

### 4.1 T005 欄位變更時，必須同步更新：

| 檔案 | 位置 | 更新內容 |
|------|------|----------|
| Utils.js | 第 199-241 行 | T005_COLUMNS 定義 |
| Utils.js | 第 147-152 行 | 欄位數量檢查（fail-fast） |
| UI-Constants.html | 第 53-70 行 | 前端欄位定義（若需顯示） |
| UI-Table.html | 第 378-457 行 | switch/case 渲染（若需顯示） |
| 本文件 | 第 2 節 | 映射表 |

### 4.2 Fail-fast 機制
- ✅ 允許：欄位數量不符時拋出錯誤
- ❌ 禁止：Silent error（靜默失敗）
- Utils.js 第 147-152 行已實作 fail-fast，禁止移除

### 4.3 變更流程
1. 先更新 T005 Sheet 結構
2. 更新 Utils.js T005_COLUMNS
3. 確認 fail-fast 檢查通過
4. （若需顯示）更新前端相關檔案
5. 更新本治理文件

### 4.4 未來規劃（非本階段）
Utils.js schema-driven 轉換、UI-Table config-driven render 等重構項目，待系統穩定後另案處理。

---

## 附錄：模組風險等級

| 模組 | 風險 | 原因 |
|------|------|------|
| Utils.js | 🔴 高 | 硬寫索引 row[0]~row[23] |
| UI-Table.html | 🟡 中 | switch/case 硬寫 |
| UI-Constants.html | 🟡 中 | 前後端欄位數量不一致 |
| UI-Sort.html | 🟡 中 | 5 種欄位 key 硬寫 |
| UI-Filter.html | 🟢 低 | 動態 key |
| UI-Export.html | 🟢 低 | 依賴 StateManager |

---

## Phase C-Closure（RPC Hardening）

- **狀態**：SEALED / GOVERNED
- **Runtime Version**：v3.0.3
- **驗收器**：verifySalesCompanyPostPush()
- **核心裁定**：
  - assertWritePermission 為唯一合法寫入防線
  - 未經治理裁定，禁止新增或繞過寫入入口
- **生效日期**：2026-01-20
