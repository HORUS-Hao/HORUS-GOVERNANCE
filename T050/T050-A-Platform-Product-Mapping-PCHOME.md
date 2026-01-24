# T050-A-Platform-Product-Mapping-PCHOME

> **Status**: FROZEN
> **Effective Date**: 2026-01-24
> **Governance Level**: Canonical
> **Version**: v1.0
> **Created**: 2026-01-24
> **Author**: Claude Code (Architect Mode)

---

> **Freeze Notice**
>
> 本文件已凍結為 T050-A 治理基準版本。
> 後續任何變更需透過新版本（v1.x）或新 Phase（T050-B）進行。
> 直接修改本文件屬違規行為，需經 Architect 審核。

---

## 1. 概述

本文件定義 **T050-A-Platform-Product-Mapping-PCHOME** 資料表結構，
用於建立 PCHOME 平台商品頁面與 HORUS T005 Canonical 商品的映射關係。

---

## 2. 資料表欄位定義

| 欄位名稱 | 資料型別 | 必填 | 說明 |
|---------|---------|-----|------|
| `platform_code` | STRING | ✓ | 固定 `PCHOME`（預留多平台擴展） |
| `platform_product_id` | STRING | ✓ | 平台唯一識別碼（PK 之一） |
| `t005_uid` | STRING | ✓ | HORUS T005 Canonical UID（PK 之一） |
| `product_model_raw` | STRING | | 原始商品型號（比對佐證，**非唯一鍵**） |
| `mapping_status` | ENUM | ✓ | `active` / `inactive` / `suspect` |
| `mapping_source` | ENUM | ✓ | `manual` / `inferred` |
| `created_at` | TIMESTAMP | ✓ | 建立時間 |
| `updated_at` | TIMESTAMP | ✓ | 最後更新時間 |
| `note` | STRING | | 備註 |

---

## 3. 主鍵設計

### Composite Primary Key

```
PK: (platform_code, platform_product_id)
```

### 設計理由

- `platform_code` 固定為 `PCHOME`，但保留以支援未來 T050-B（MOMO）、T050-C（YAHOO）等
- `platform_product_id` 為平台原生識別碼，在該平台內唯一
- 不使用 `t005_uid` 作為 PK 的一部分，因為允許多筆平台商品對應同一 HORUS 商品

---

## 4. 關鍵約束

### 禁止事項

| 約束 | 說明 |
|-----|------|
| **禁止** 以 `product_model_raw` 作為主鍵或唯一索引 | 商品型號不唯一、不穩定 |
| **禁止** 假設 1:1 對應關係 | 同一商品可能有多個平台頁面（一型多頁） |
| **禁止** 允許 `t005_uid` 為 NULL | 必須對應到 T005 才有意義 |
| **禁止** 允許 `platform_product_id` 為 NULL | 必須有平台識別碼 |

### 允許事項

| 約束 | 說明 |
|-----|------|
| **允許** 多筆 `platform_product_id` 對應同一 `t005_uid` | 處理「一型多頁」情境 |
| **允許** 同一 `t005_uid` 出現在不同平台 Mapping 表 | 支援跨平台對應 |
| **允許** `product_model_raw` 為 NULL | 僅為佐證欄位 |

---

## 5. Enum 值定義

### mapping_status

| 值 | 說明 |
|----|------|
| `active` | 有效映射，可用於計算 |
| `inactive` | 已停用，歷史保留 |
| `suspect` | 存疑，需人工校驗 |

### mapping_source

| 值 | 說明 |
|----|------|
| `manual` | 人工建立或校正 |
| `inferred` | 系統推導（需標註推導邏輯） |

---

## 6. 索引建議

| 索引名稱 | 欄位 | 類型 | 用途 |
|---------|------|-----|------|
| `pk_t050a_pchome` | `(platform_code, platform_product_id)` | PRIMARY | 主鍵 |
| `idx_t050a_t005uid` | `t005_uid` | INDEX | 反查：由 HORUS 商品找平台頁面 |
| `idx_t050a_status` | `mapping_status` | INDEX | 過濾有效/無效映射 |

---

## 7. 版本紀錄

| 版本 | 日期 | 變更說明 |
|-----|------|---------|
| v0.1 | 2026-01-24 | 初版 Draft |
| v1.0 | 2026-01-24 | Freeze T050-A governance baseline |

---

## 8. 相關文件

- [T050-A-GOVERNANCE.md](./T050-A-GOVERNANCE.md) - 治理規範
- [T005_SHEET_SCHEMA_CANONICAL_v2026-01.md](../T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md) - T005 Canonical Schema
