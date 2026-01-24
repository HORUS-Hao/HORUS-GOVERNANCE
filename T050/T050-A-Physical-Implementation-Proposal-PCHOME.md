# T050-A Physical Implementation Proposal（PCHOME）

> **Status**: Proposal
> **Date**: 2026-01-24
> **Scope**: PCHOME 平台專屬

---

## 1. 實體落地方案

### 1.1 建議使用形式

| 選項 | 建議 | 理由 |
|------|------|------|
| **Google Sheet** | ✅ 推薦（MVP） | 與 T005 一致、人工可編輯、低成本、快速上線 |
| Database | 未來考慮 | 需額外建置、適合規模化後 |
| Notion | 不建議 | 與現有 HORUS 架構不一致 |

### 1.2 建議 Sheet 結構

| 項目 | 建議值 |
|------|-------|
| **Sheet 名稱** | `T050-A-Mapping-PCHOME` |
| **位置** | 與 T005 同一 Spreadsheet，或獨立 Spreadsheet |
| **Header Row** | Row 1 |
| **Data Start Row** | Row 2 |

### 1.3 欄位對照（Google Sheet 實作）

| Column | 欄位名稱 | 資料型別 | 必填 | 說明 |
|--------|---------|---------|-----|------|
| A | `platform_code` | TEXT | ✓ | 固定 `PCHOME` |
| B | `platform_product_id` | TEXT | ✓ | PCHOME 廠商料號（PK） |
| C | `t005_uid` | TEXT | ✓ | HORUS UID |
| D | `product_model_raw` | TEXT | | 商品型號（佐證用） |
| E | `mapping_status` | TEXT | ✓ | active / inactive / suspect |
| F | `mapping_source` | TEXT | ✓ | manual / inferred |
| G | `created_at` | DATETIME | ✓ | 建立時間 |
| H | `updated_at` | DATETIME | ✓ | 更新時間 |
| I | `note` | TEXT | | 備註 |

---

## 2. 初始資料來源

### 2.1 資料來源優先順序

| 優先級 | 來源 | 說明 | 預估筆數 |
|--------|------|------|---------|
| 1 | PCHOME 後台匯出 | 取得 `platform_product_id`（廠商料號） | 待確認 |
| 2 | T005 商品主表 | 取得 `t005_uid` 與 `商品型號` | ~2790 |
| 3 | 人工比對 | 建立 mapping 對應關係 | 首批 MVP |

### 2.2 初始建立流程

```
Step 1: 匯出 PCHOME 商品清單
        └─ 欄位：廠商料號、商品名稱、狀態

Step 2: 匯出 T005 商品主表
        └─ 欄位：UID、商品型號、商品名稱、品牌

Step 3: 人工比對建立 Mapping
        └─ 以「廠商料號 ↔ 商品型號」為輔助比對依據
        └─ 最終對應以 t005_uid 為準

Step 4: 寫入 T050-A Sheet
        └─ mapping_source = 'manual'
        └─ mapping_status = 'active'
```

### 2.3 MVP 初始目標

| 項目 | 目標 |
|------|------|
| 首批筆數 | 100~200 筆（高週轉商品優先） |
| 資料品質 | 100% 人工確認 |
| mapping_source | 全部 `manual` |
| 完成時程 | 依人工作業量 |

---

## 3. Primary Key 實作

### 3.1 Google Sheet 實作方式

| 方法 | 說明 |
|------|------|
| **資料驗證** | Column B (`platform_product_id`) 設定「不可重複」 |
| **程式驗證** | 寫入前檢查 `(platform_code, platform_product_id)` 組合唯一 |

### 3.2 驗證規則

```
寫入前驗證：
1. platform_code = 'PCHOME'（固定值）
2. platform_product_id NOT NULL AND NOT EMPTY
3. t005_uid 必須存在於 T005.UID
4. (platform_code, platform_product_id) 組合唯一
```

---

## 4. 相關文件

- [T050-A-GOVERNANCE.md](./T050-A-GOVERNANCE.md) - T050-A 治理規範（FROZEN）
- [T050-A-Platform-Product-Mapping-PCHOME.md](./T050-A-Platform-Product-Mapping-PCHOME.md) - T050-A 資料表定義（FROZEN）

---

## 5. 版本紀錄

| 版本 | 日期 | 變更說明 |
|-----|------|---------|
| v0.1 | 2026-01-24 | 初版 Proposal |
