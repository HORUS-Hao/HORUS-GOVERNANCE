# FIELD-SEMANTIC-CHARTER.md

> **文件性質**：Registry-HORUS-PDM.gsheet 治理解釋文件
> **狀態**：ACTIVE
> **生效日期**：2026-01-03
> **權威落點**：`G:\我的雲端硬碟\HORUS-GOVERNANCE\FIELD-SEMANTIC-CHARTER.md`
> **上位權威**：Registry-HORUS-PDM.gsheet

---

## 文件定位

本文件為 Registry-HORUS-PDM.gsheet 的治理解釋文件。

**本文件不新增任何欄位、不改動現有定義，僅對欄位語義與禁止事項進行正式化。**

Registry-HORUS-PDM.gsheet 為欄位定義上位權威（SSOT）；
本文件僅為其解釋與應用指引。

---

## 1. 核心概念語義

### 1.1 SKU / Model / 商品型號

| 概念 | 語義 | 適用場景 |
|------|------|---------|
| **SKU** | 在 HORUS-PDM 上下文中，SKU 指「商品型號」，非 UID | R020 比價匹配 |
| **Model** | 商品型號的英文表述，與 SKU 同義 | Price_Results 工作表 |
| **商品型號** | 中文標準名稱，為 Registry 定義的正式欄位名 | T005 商品主檔 |
| **UID** | 唯一識別碼，與 SKU/Model 不同 | 系統內部索引 |

**語義規則**：
- SKU = Model = 商品型號（同義）
- SKU ≠ UID
- 不得混用 SKU 與 UID

---

### 1.2 Platform（平台）

| 有效值 | 說明 |
|--------|------|
| PCHOME | 完整比價平台 |
| MOMO | 完整比價平台 |
| YAHOO | listingOnly（僅上架，無售價比對） |
| SHOPEE | listingOnly（僅上架，無售價比對） |

**語義規則**：
- 平台值一律全大寫
- listingOnly 平台不參與價格競爭力計算

---

### 1.3 Price / Cost 語義

| 欄位 | 語義 | SSOT |
|------|------|------|
| **myPrice**（我方售價） | 平台即時匯出的銷售價格 | R020_MyPrices |
| **platformCost**（平台成本） | 該平台上架的成本價格 | R020_MyPrices |
| **costT005**（商品成本） | 商品主檔記錄的含稅成本 | T005 `含稅成本` 欄位 |
| **marketMin**（市場最低） | 競品中的最低價格 | Price_Results 計算 |
| **marketAvg**（市場均價） | 競品的平均價格 | Price_Results 計算 |

**語義規則**：
- platformCost ≠ costT005（語義不同，不得混用）
- myPrice 來源為平台匯出，非手動輸入
- C005 不作為 R020 即時比價來源

---

### 1.4 Stock（庫存）語義

| 值 | 語義 |
|----|------|
| **null** | 未知（資料缺失或未同步） |
| **0** | 確定缺貨 |
| **> 0** | 有庫存 |

**語義規則**：
- null ≠ 0（語義不同）
- 嚴禁 null → 0 fallback

---

## 2. NULL / Zero 語義規範

### 2.1 通用原則

| 原則 | 說明 |
|------|------|
| **NULL = UNKNOWN** | null 代表未知、缺失、未計算 |
| **0 = ZERO** | 0 代表確定的零值 |
| **禁止混用** | 不得將 null fallback 為 0 |

### 2.2 欄位級語義

| 欄位 | null 語義 | 0 語義 | 禁止行為 |
|------|-----------|--------|---------|
| stock | 未知 | 缺貨 | null → 0 |
| platformCost | 未知 | 確定為零 | null → 0 |
| marketMin | 無市場資料 | — | null → 0 |
| competitorCount | 未計算 | 無競品 | ⚠️ DEPRECATE（語義模糊） |
| priceDiffPercent | 無資料 | 無價差 | ⚠️ DEPRECATE（語義模糊） |

### 2.3 DEPRECATE 欄位說明

以下欄位目前使用 `|| 0` 處理，導致語義不可區分：

| 欄位 | 問題 | 狀態 |
|------|------|------|
| competitorCount | 0 可能是「無競品」或「未計算」 | DEPRECATE（Deferred – not in v1.x） |
| priceDiffPercent | 0 可能是「無價差」或「無資料」 | DEPRECATE（Deferred – not in v1.x） |

**處置**：v1.x 不動，待 v2 評估重構。

---

## 3. 空字串語義

| 情況 | 語義 | 問題 |
|------|------|------|
| `''`（空字串） | 模糊 | 無法區分「欄位不存在」vs「值為空」 |
| `null` | 明確 | 代表欄位不存在或值未知 |

**現況**：T005 JOIN 欄位（supplier, brand 等）使用空字串 '' 作為 fallback。

**狀態**：DEPRECATE（Deferred – not in v1.x）

---

## 4. 禁止事項

### 4.1 語義層禁止

| 禁止項目 | 說明 |
|---------|------|
| ❌ NULL → 0 | 不得將 null 合理化為 0 |
| ❌ 推斷語義 | 不得因「感覺合理」而推導欄位語義 |
| ❌ 混用概念 | 不得混用 SKU/UID、platformCost/costT005 |
| ❌ 補算 | 不得因資料缺失而自行計算補值 |

### 4.2 操作層禁止

| 禁止項目 | 說明 |
|---------|------|
| ❌ 新增欄位 | 未經 Registry 審批，不得新增欄位 |
| ❌ 改動定義 | 未經 Architect 裁決，不得改動現有定義 |
| ❌ 自動補 Schema | 不得自動產生 YAML / Schema |
| ❌ 從 Code 推斷 | 程式碼行為不構成欄位定義 |

### 4.3 來源層禁止

| 禁止項目 | 說明 |
|---------|------|
| ❌ 從 SKU 推測品牌 | 不得從商品型號推斷品牌資訊 |
| ❌ 從商品名稱推測品牌 | 同上 |
| ❌ View 寫回 Fact | View 層資料不得寫入 Fact 層 |

---

## 5. T005 Canonical Schema 欄位清單

以下為 T005_CANONICAL_FIELDS 定義（SCHEMA FROZEN - 2025-12-31）：

| 欄位名稱 | 說明 |
|---------|------|
| 供應商 | Supplier |
| 品牌 | Brand |
| 商品型號 | SKU/Model |
| 商品名稱 | Product Name |
| 商品大類 | Category L1 |
| 商品中類 | Category L2 |
| 商品小類 | Category L3 |
| 含稅成本 | Cost (Tax Included) |

**狀態**：FROZEN（不得擅自新增或修改）

---

## 6. 權威鏈

```
Registry-HORUS-PDM.gsheet（上位權威）
    │
    └── FIELD-SEMANTIC-CHARTER.md（本文件：語義解釋）
            │
            └── DATA_CONTRACTS/{模組}/*.md（模組契約：引用語義）
```

**規則**：
- Registry 為欄位定義 SSOT
- 本文件僅解釋，不定義
- 模組契約引用本文件語義

---

## 7. 版本控制

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0 | 2026-01-03 | 初版建立：語義正式化，禁止事項整理 |

---

## 附錄：現行 DEPRECATE 項目追蹤

| 項目 | 來源 | 狀態 | 說明 |
|------|------|------|------|
| competitorCount `|| 0` | R020-CONTRACT-033 | DEPRECATE | v1.x 不動 |
| priceDiffPercent `|| 0` | R020-CONTRACT-034 | DEPRECATE | v1.x 不動 |
| T005 JOIN 空字串 fallback | R020-CONTRACT-035 | DEPRECATE | v1.x 不動 |

---

**文件結束**

