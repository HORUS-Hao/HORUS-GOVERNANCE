# T050-A Governance Document

> **Status**: Draft
> **Phase**: T050-A
> **Version**: v0.1
> **Created**: 2026-01-24
> **Author**: Claude Code (Architect Mode)

---

## 1. 用途與責任邊界

### 1.1 用途

T050-A-Platform-Product-Mapping-PCHOME 用於：

- 建立 PCHOME 平台商品頁面 ↔ HORUS T005 Canonical 商品的映射關係
- 處理「一型多頁」情境（同一商品在平台有多個頁面）
- 作為 T050 / T060 / T070 系列模組的基礎 SSOT

### 1.2 責任邊界

| 責任 | 本表負責 | 本表不負責 |
|-----|---------|----------|
| 平台 ↔ HORUS 商品識別碼對應 | ✓ | |
| T005 商品主檔定義與維護 | | ✓（由 T005 負責）|
| 平台價格資訊 | | ✓（由 R020 負責）|
| 上架狀態判斷 | | ✓（由 C005 負責）|
| 平台策略判斷 | | ✓（由 Strategy Mapping 負責）|
| 庫存數量 | | ✓（由上游系統負責）|
| 補貨計算 | | ✓（由 T060 負責，本表僅提供對應）|

---

## 2. 為何它是 T050 / T060 / T070 的 SSOT

### 2.1 模組依賴關係

| 模組 | 依賴 T050-A 的理由 |
|-----|-------------------|
| T050 | 需要知道「這個 platform_product_id 對應哪個 t005_uid」 |
| T060 | 需要透過 mapping 反查庫存、計算補貨數量 |
| T070 | 報表需要正確歸屬平台銷售至 HORUS 商品 |

### 2.2 SSOT 原則

```
┌─────────────────────────────────────────────────────────────┐
│  任何模組需要「PCHOME 商品頁 ↔ HORUS 商品」對應時，         │
│  必須且只能查詢 T050-A                                      │
│                                                             │
│  禁止模組內部維護平行 mapping                                │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 資料流向

```
T005 (Canonical)
    │
    ▼
T050-A (Mapping)  ◀── 唯一寫入點
    │
    ├──▶ T050 (讀取)
    ├──▶ T060 (讀取)
    ├──▶ T070 (讀取)
    ├──▶ C005 (讀取)
    └──▶ R020 (讀取)
```

---

## 3. 讀寫權限矩陣

| 模組/角色 | 讀取 | 寫入 | 說明 |
|----------|-----|-----|------|
| **T050-A 管理者** | ✓ | ✓ | 唯一具備寫入權限 |
| T050 核心模組 | ✓ | ✗ | 僅讀取 mapping 資料 |
| T060 補貨計算 | ✓ | ✗ | 透過 mapping 反查商品 |
| T070 報表模組 | ✓ | ✗ | 用於銷售歸屬 |
| C005 Listing Checker | ✓ | ✗ | 用於上架狀態比對 |
| R020 價格比對 | ✓ | ✗ | 用於價格歸屬計算 |
| 手動校正工具 | ✓ | ✓* | 需經審核流程，標註 `mapping_source = 'manual'` |

> *手動寫入需遵循審核流程，並在 `note` 欄位註明原因

### 3.1 寫入權限控管

```
寫入前置條件：
1. 確認 t005_uid 存在於 T005
2. 確認 platform_product_id 格式正確
3. 若為 inferred，需記錄推導邏輯
4. 若為 manual，需記錄操作者與原因
```

---

## 4. 常見錯誤用法

### 4.1 錯誤用法列表

| 錯誤類型 | 說明 | 後果 | 預防措施 |
|---------|------|-----|---------|
| **禁止** 以商品型號當主鍵 | `product_model_raw` 不唯一、不穩定 | 一型多頁無法處理、資料衝突 | 僅將型號作為佐證欄位 |
| **禁止** 假設 1:1 關係 | 同型號可能多頁、同頁面可能合併型號 | JOIN 結果錯誤、計算失真 | 使用 LEFT JOIN，處理多筆結果 |
| **禁止** 繞過 T050-A 直接建立 mapping | 模組內部維護平行對照表 | 資料不一致、維護成本增加 | 所有 mapping 需求統一查詢 T050-A |
| **禁止** 用 NULL t005_uid | 缺少 HORUS canonical 對應 | 孤立資料、無法追溯 | 寫入時驗證 t005_uid 必填 |
| **風險** 忽略 mapping_status | 使用 `inactive` 或 `suspect` 資料參與計算 | 統計失真 | 查詢時加入 `WHERE mapping_status = 'active'` |
| **風險** 忽略 mapping_source | 無法區分人工校正與系統推導 | 資料品質無法追蹤 | 報表需標註資料來源分佈 |

### 4.2 正確用法範例

```sql
-- 正確：查詢有效映射
SELECT *
FROM T050_A_Platform_Product_Mapping_PCHOME
WHERE mapping_status = 'active'
  AND platform_product_id = ?

-- 正確：處理一型多頁
SELECT t005.*, mapping.platform_product_id
FROM T005 t005
LEFT JOIN T050_A_Platform_Product_Mapping_PCHOME mapping
  ON t005.uid = mapping.t005_uid
  AND mapping.mapping_status = 'active'

-- 錯誤：以商品型號做 JOIN
SELECT *
FROM T005 t005
JOIN SomeTable other
  ON t005.商品型號 = other.model  -- 禁止！
```

---

## 5. 與其他模組的整合規範

### 5.1 與 T005 的關係

- T050-A 的 `t005_uid` **必須** 對應到 T005 中存在的 UID
- T005 變更不影響 T050-A 結構，但需定期驗證參照完整性

### 5.2 與 C005 Strategy Mapping 的關係

- C005 Strategy Mapping 使用 `product_id + platform_code`
- **待釐清**：C005 的 `product_id` 應為 `t005_uid`
- 整合時透過 `t005_uid` 關聯

### 5.3 與 R020 的關係

- R020 價格比對結果應透過 T050-A 關聯至 T005
- **風險**：目前 R020 使用商品型號做 JOIN，需遷移計畫

---

## 6. 維護與審計

### 6.1 定期檢查項目

| 檢查項目 | 頻率 | 說明 |
|---------|------|------|
| 孤立記錄檢查 | 每週 | `t005_uid` 不存在於 T005 |
| suspect 狀態清理 | 每週 | 處理存疑記錄 |
| 重複映射檢查 | 每月 | 同一 platform_product_id 多筆 active |
| 參照完整性驗證 | 每月 | 與 T005 的 UID 對照 |

### 6.2 變更記錄

所有對 T050-A 的寫入操作應記錄：
- 操作時間
- 操作類型（新增/修改/刪除）
- 操作者（系統或人工）
- 變更前後值

---

## 7. 版本紀錄

| 版本 | 日期 | 變更說明 |
|-----|------|---------|
| v0.1 | 2026-01-24 | 初版 Draft |

---

## 8. 相關文件

- [T050-A-Platform-Product-Mapping-PCHOME.md](./T050-A-Platform-Product-Mapping-PCHOME.md) - 資料表定義
- [T050-A-MAPPING-RISK-ANALYSIS.md](../_RISK-AUDIT/T050-A-MAPPING-RISK-ANALYSIS.md) - 風險分析
- [T005_SHEET_SCHEMA_CANONICAL_v2026-01.md](../T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md) - T005 Canonical Schema
