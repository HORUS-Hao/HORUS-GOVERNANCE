# R020 Scheduler Governance Note

> **Status**: Active
> **Version**: v1.2
> **Created**: 2026-01-03
> **Updated**: 2026-01-03
> **Scope**: R020 Price Comparator + Observer-Mail

---

## 0. R020 v1.x 凍結宣告（Architect Decision 2026-01-03）

> **R020 v1.x 狀態：FROZEN**

### 禁止事項

| 類別 | 禁止內容 |
|------|----------|
| 功能新增 | ❌ 不新增任何 R020 v1.x 功能 |
| 行為修改 | ❌ 不修改既有 ingest / compare / mail 行為 |
| 語義擴充 | ❌ 不引入 crawler / attribution / semantic extension |

### v2.x 候選（僅可討論，不得實作）

- `isSelfListing`（市場最低是否為我方）
- 批次爬蟲（`R020_crawlPChomeByBrands` 等）
- `StoreCode` 分拆 SHOPEE 為 GUSENSE / KATAI
- B 區塊競品排除我方商品（競品語義調整）
- 其他語義擴充

### 凍結驗證基準

- 全平台 ingest 成功（5/5）
- 比價成功（4,971 筆我方 / 602 筆 matched）
- 每日 Trigger 已設定（`R020_autoIngestAndCompare` @ 08:00）

---

## 1. 每日排程設計

| Trigger | 函數 | 時間 | 職責 |
|---------|------|------|------|
| **Trigger 1: Fact** | `R020_scheduledCrawl()` | 08:00 | 爬蟲、比價、寫入結果 |
| **Trigger 2: Mail** | `dailyObserverMailJob()` | 09:00 | 讀取 API、渲染、發送郵件 |

---

## 2. 核心原則

### 原則 A: Trigger 成功 ≠ Fact 完成

Mail 層不得以「時間已到」推斷資料完整性。

- Trigger 執行成功僅代表函數被呼叫
- 不代表爬蟲已完成、比價已完成、資料已寫入
- Mail 層不得基於時間假設資料狀態

### 原則 B: crawlStatus 僅供顯示與警示

`crawlStatus` 欄位用途：

| 用途 | 允許 |
|------|------|
| Email 顯示「資料更新時間」 | ✅ |
| Email 警示「資料已過期 X 小時」 | ✅ |
| 觸發補算邏輯 | ❌ |
| 延後發送郵件 | ❌ |
| 自動重跑爬蟲 | ❌ |

### 原則 C: 架構邊界

| 層級 | 專案 | 允許 | 禁止 |
|------|------|------|------|
| **Fact 層** | R020-Price-Comparator | 爬蟲、比價、寫入 Sheet | - |
| **Presentation 層** | Observer-Mail | 讀取 API、渲染 HTML、發送郵件 | 觸發爬蟲、補算、推斷、寫入 Sheet |

---

## 3. v1.x 資料來源說明

### 3.0 Architect Decision（2026-01-03）

> **R020 v1.x 明確採用方案 B（被動 ingest 架構）。**
>
> - 所有市場價格資料**僅來自平台匯出檔之 ingest**
> - **不實作、不啟用**任何自動批次爬蟲
> - 批次爬蟲僅列為 v2.x 之後的候選功能
> - **v1.x 階段禁止引入**

### 3.1 資料來源架構

R020 v1.x **不包含**自動市場批次爬蟲。所有市場價格資料均來自**平台匯出檔之被動 ingest**。

| 功能 | 狀態 | 說明 |
|------|------|------|
| `R020_autoIngestFromDrive_()` | ✅ 實作 | 從 Drive 讀取平台匯出 CSV |
| `crawlPChome(model)` | ✅ 實作 | 單品即時搜尋（UI 用）|
| `R020_crawlPChomeByBrands` | ❌ 設計殘影 | 從未實作，v1.x 禁止引入 |
| `R020_crawlMomoByBrands` | ❌ 設計殘影 | 從未實作，v1.x 禁止引入 |

### 3.2 Git 查證（2026-01-03）

> **結論**：R020 批次爬蟲從未實作，現況為設計殘影，非功能退化。

- `gas_api.js` 首次加入：commit `825f228`（2025-12-31）
- 首次加入時即包含 `typeof R020_crawlPChomeByBrands === 'function'` 守衛
- 函數定義**從未存在**於任何 commit

### 3.3 v1.x 階段原則

- 不新增工程層強制驗證
- 遵守上述原則即可
- 批次爬蟲為 v2.x+ 候選功能，v1.x 禁止實作

---

## 4. 相關檔案

| 檔案 | 位置 |
|------|------|
| R020 排程函數 | `R020-Price-Comparator/gas_api.js` → `R020_scheduledCrawl()` |
| Observer Trigger | `Observer-Mail-R020-C005/TriggerSetup.gs` → `dailyObserverMailJob()` |
| Observer 排程設定 | `Observer-Mail-R020-C005/Config.gs` → `R021_CONFIG.SCHEDULE` |

---

## 5. v2.x 候選功能技術說明

### 5.1 B 區塊競品資料來源與語義

#### 資料來源

B 區塊「需關注商品」的競品資料來自 `Price_Results` 工作表。

| 資料流 | 說明 |
|--------|------|
| 來源表 | `Price_Results`（市場價格爬蟲結果）|
| 索引函數 | `buildPriceResultsIndex_(ss)` |
| 查詢函數 | `findCompetitorsFromIndex_(sku, index)` |
| 匹配邏輯 | 包含匹配（SKU 包含 Model 或 Model 包含 SKU）|

#### 為何會出現我方商品於競品

`Price_Results` 包含**所有平台的爬蟲結果**，包括：
- 競品商品（第三方賣家）
- 我方商品（HORUS 上架）

`findCompetitorsFromIndex_` 函數**不區分賣家身份**，僅依型號匹配。因此：
- E1001-GD、E1001-SL 等我方商品
- 與查詢的 SKU 型號匹配
- 被納入「競品」清單回傳

#### 為何這不是 v1.x Bug

| 判斷依據 | 說明 |
|----------|------|
| **設計意圖** | v1.x 的「競品」定義為「市場上同型號商品」，**不含賣家歸屬語義** |
| **一致性** | 此行為從首次實作至今**從未改變** |
| **功能完整** | 系統正確回傳「市場上所有同型號商品」 |
| **語義變更** | 若要排除我方商品，需引入 `isSelfListing` 語義，屬於**功能擴充** |

> **結論**：這是 v1.x 的設計行為，非 Bug。排除我方商品屬於語義擴充，歸類為 v2.x 候選。

---

### 5.2 SHOPEE StoreCode 分拆

#### 現況

| 項目 | 說明 |
|------|------|
| `StoreCode` 欄位 | ✅ 已存在於 `R020_CompareResult`（第 19 欄）|
| `StoreCode` 值 | GUSENSE / KATAI（區分蝦皮賣場）|
| `platformStats` 統計 | ❌ 僅使用原始 `平台` 欄位，不讀取 StoreCode |

#### 為何 StoreCode 分拆屬於 Fact 行為變更

| 變更層面 | 影響 |
|----------|------|
| **資料讀取** | `getMailData_` 需新增 `cr['StoreCode']` 讀取 |
| **統計邏輯** | `platformStats[platform]` 需改為 `platformStats[viewPlatform]` |
| **輸出結構** | API 回傳的 `platformStats` 鍵值從 `SHOPEE` 變為 `SHOPEE (GUSENSE)` / `SHOPEE (KATAI)` |
| **下游影響** | Observer-Mail 的 C 區塊渲染邏輯需配合調整 |

> **結論**：StoreCode 分拆改變了 Fact 層的統計輸出結構，屬於行為變更，歸類為 v2.x 候選。

---

### 5.3 v2.x 候選功能完整清單

| 功能 | 類型 | 說明 |
|------|------|------|
| `isSelfListing` | 語義擴充 | 標記市場最低是否為我方商品 |
| 批次爬蟲 | 功能新增 | `R020_crawlPChomeByBrands` 等 |
| StoreCode 分拆 | 行為變更 | SHOPEE 依賣場分拆統計 |
| 競品排除我方 | 語義擴充 | B 區塊競品清單過濾我方商品 |

---

## 6. 相關檔案

| 檔案 | 位置 |
|------|------|
| R020 排程函數 | `R020-Price-Comparator/gas_api.js` → `R020_scheduledCrawl()` |
| R020 API | `R020-Price-Comparator/gas_api.js` → `R020_getMailData_()` |
| 競品索引 | `R020-Price-Comparator/gas_api.js` → `buildPriceResultsIndex_()` |
| 競品查詢 | `R020-Price-Comparator/gas_api.js` → `findCompetitorsFromIndex_()` |
| Observer Trigger | `Observer-Mail-R020-C005/TriggerSetup.gs` → `dailyObserverMailJob()` |
| Observer 排程設定 | `Observer-Mail-R020-C005/Config.gs` → `R021_CONFIG.SCHEDULE` |

---

*此文件為 R020 排程治理原則之唯一權威版本。*
*v1.2 更新：2026-01-03（新增 §5 v2.x 候選功能技術說明）*
