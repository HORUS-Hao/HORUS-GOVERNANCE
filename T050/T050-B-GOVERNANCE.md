# T050-B Governance Document

> **Status**: FROZEN
> **Effective Date**: 2026-01-24
> **Governance Level**: Canonical
> **Phase**: T050-B
> **Version**: v1.0
> **Created**: 2026-01-24
> **Author**: Claude Code (Architect Mode)

---

> **Freeze Notice**
>
> 本文件已凍結為 T050-B 治理基準版本。
> 後續任何變更需透過新版本（v1.x）或新 Phase（T050-C）進行。
> 直接修改本文件屬違規行為，需經 Architect 審核。

---

## 1. Purpose

T050-B Replenishment FACT Snapshot 用於：

- 產生平台補貨決策所需的 FACT 快照
- 整合 T005 商品主檔與平台庫存/銷售資訊
- 提供補貨計算所需的基礎資料層

### 1.1 設計原則

| 原則 | 說明 |
|------|------|
| **FACT 層級** | 本模組產出為 FACT（事實資料），非 DERIVED（推導資料） |
| **快照導向** | 每次執行產生時間點快照，不回溯歷史 |
| **無預測** | 不包含任何 AI/ML 預測邏輯 |
| **無策略** | 不包含補貨策略判斷，僅提供資料 |

---

## 2. Scope

### 2.1 In Scope（本模組負責）

| 項目 | 說明 |
|------|------|
| 整合 T005 商品主檔快照 | 讀取 T005 當前狀態 |
| 整合平台庫存快照 | 讀取各平台當前庫存數量 |
| 整合平台銷售快照 | 讀取各平台近期銷售數量（如有） |
| 產生 Replenishment FACT | 合併上述資料為單一快照表 |
| 透過 T050-A 關聯平台商品 | 使用 `t005_uid + platform_code` 關聯 |

### 2.2 Out of Scope（本模組不負責）

| 項目 | 負責模組 | 說明 |
|------|---------|------|
| 補貨數量計算 | T060 | T050-B 僅提供資料，不計算建議量 |
| 補貨策略判斷 | T060 / Strategy | 本模組不含策略邏輯 |
| 價格比對 | R020 | 本模組不讀取/寫入 R020 |
| 上架狀態判斷 | C005 | 本模組不讀取/寫入 C005 |
| 平台商品映射維護 | T050-A | 本模組僅讀取 T050-A，不寫入 |
| AI/ML 預測 | N/A | 本模組不含任何預測邏輯 |

### 2.3 明確禁止

| 禁止事項 | 原因 |
|----------|------|
| ❌ 寫入 R020 | 價格比對為獨立模組 |
| ❌ 寫入 C005 | 上架檢查為獨立模組 |
| ❌ 寫入 T050-A | Mapping 維護有專屬流程 |
| ❌ 使用商品型號做 JOIN | 違反 Canonical 約束 |
| ❌ 包含預測邏輯 | 本模組為純 FACT 層 |
| ❌ 包含策略判斷 | 策略屬 DERIVED 層 |

---

## 3. Input FACT Sources

### 3.1 資料來源矩陣

| 來源 | 類型 | 讀取方式 | 說明 |
|------|------|---------|------|
| T005 商品主檔 | FACT | Snapshot | 商品基本資料、狀態、分類 |
| T050-A Platform Mapping | FACT | Lookup | 平台 ↔ HORUS 商品對應 |
| Platform Inventory | FACT | Snapshot | 各平台當前庫存數量 |
| Platform Sales (Optional) | FACT | Snapshot | 各平台近期銷售數量 |
| ERP Inventory (Optional) | FACT | Snapshot | ERP 系統庫存數量 |

### 3.2 關聯規則

```
T050-B JOIN 規則：

1. T005 ←→ T050-A
   JOIN ON: T005.UID = T050-A.t005_uid

2. T050-A ←→ Platform Inventory
   JOIN ON: T050-A.platform_code = Platform.platform_code
        AND T050-A.platform_product_id = Platform.product_id

3. 禁止：
   JOIN ON 商品型號 = ANY_FIELD  ❌
```

### 3.3 資料更新頻率

| 來源 | 建議頻率 | 說明 |
|------|---------|------|
| T005 | 每日 | 商品主檔變更頻率低 |
| T050-A Mapping | 每日 | Mapping 變更需審核 |
| Platform Inventory | 每日/每次執行 | 依平台 API 限制 |
| Platform Sales | 每日 | 依平台報表週期 |

---

## 4. Non-Goals

本模組明確不處理以下事項：

### 4.1 不處理的計算

| 項目 | 說明 | 應由誰處理 |
|------|------|-----------|
| 建議補貨數量 | 需要策略與演算法 | T060 |
| 安全庫存水位 | 需要歷史分析 | T060 / Analytics |
| 銷售預測 | 需要 ML 模型 | 未來模組 |
| 價格競爭力分析 | 需要價格比對 | R020 |

### 4.2 不處理的狀態判斷

| 項目 | 說明 | 應由誰處理 |
|------|------|-----------|
| 是否應上架 | 策略判斷 | C005 Strategy |
| 是否缺貨 | 需定義閾值 | T060 |
| 是否需補貨 | 需策略規則 | T060 |

### 4.3 不處理的資料維護

| 項目 | 說明 | 應由誰處理 |
|------|------|-----------|
| 平台商品 Mapping | 對應關係維護 | T050-A |
| 商品主檔維護 | 基本資料維護 | T005 |
| 平台 API 整合 | 資料擷取 | Platform Connector |

---

## 5. 與其他模組的關係

### 5.1 上游依賴

```
T005 (商品主檔)
    │
    ▼
T050-A (Platform Mapping)  ◀── 必須先建立
    │
    ▼
T050-B (Replenishment FACT)  ◀── 本模組
```

### 5.2 下游消費者

```
T050-B (Replenishment FACT)
    │
    ├──▶ T060 (補貨計算) - 讀取 FACT 進行計算
    ├──▶ T070 (報表) - 讀取 FACT 產生報表
    └──▶ Dashboard - 讀取 FACT 顯示現況
```

### 5.3 無關模組（不互動）

| 模組 | 說明 |
|------|------|
| R020 | 價格比對，獨立運作 |
| C005 Phase 2/3 | 上架率計算，獨立運作 |

---

## 6. 版本紀錄

| 版本 | 日期 | 變更說明 |
|-----|------|---------|
| v0.1 | 2026-01-24 | 初版 Draft |
| v1.0 | 2026-01-24 | Freeze T050-B canonical baseline（含語意裁定） |

---

## 7. 相關文件

- [T050-A-GOVERNANCE.md](./T050-A-GOVERNANCE.md) - T050-A 治理規範（FROZEN）
- [T050-A-Platform-Product-Mapping-PCHOME.md](./T050-A-Platform-Product-Mapping-PCHOME.md) - T050-A 資料表定義
- [T050-B-Replenishment-FACT.md](./T050-B-Replenishment-FACT.md) - T050-B 資料表定義
