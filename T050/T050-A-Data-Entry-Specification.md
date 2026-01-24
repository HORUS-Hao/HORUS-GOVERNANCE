# T050-A Data Entry Specification

> **Version**: v1.0
> **Effective Date**: 2026-01-24
> **Scope**: T050-A-PCHOME Sheet

---

## 1. 適用範圍

- **適用 Sheet**：【T050】Platform-Product-Mapping / T050-A-PCHOME
- **適用人員**：經授權之 T050-A 資料管理者
- **適用情境**：人工建立 PCHOME 平台商品對應

---

## 2. 欄位填寫規範（A–I）

| Column | 欄位 | 必填 | 格式要求 | 合法值 |
|--------|------|-----|---------|--------|
| A | `platform_code` | ✓ | 大寫英文 | 固定填 `PCHOME` |
| B | `platform_product_id` | ✓ | 原值照填 | PCHOME 廠商料號（⚠️ **不可填錯**） |
| C | `t005_uid` | ✓ | UID 格式 | T005 現存 UID（⚠️ **不可填錯**） |
| D | `product_model_raw` | | 原值照填 | 商品型號（佐證用） |
| E | `mapping_status` | ✓ | 小寫英文 | `active` / `inactive` / `suspect` |
| F | `mapping_source` | ✓ | 小寫英文 | `manual` / `inferred` |
| G | `created_at` | ✓ | ISO 格式 | `YYYY-MM-DD HH:mm` |
| H | `updated_at` | ✓ | ISO 格式 | `YYYY-MM-DD HH:mm` |
| I | `note` | | 自由文字 | 備註說明 |

### 必須填 `suspect` 的情況

- 廠商料號與商品型號不完全吻合
- 同一廠商料號疑似對應多個 UID
- 對應關係來自推測而非明確佐證

### 禁止建立 mapping 的情況

- ❌ `platform_product_id` 在 PCHOME 後台查無此料號
- ❌ `t005_uid` 在 T005 中不存在
- ❌ 無法確認對應關係且無佐證資料
- ❌ 同一 `(platform_code, platform_product_id)` 組合已存在

---

## 3. 填寫前檢查清單

- [ ] PCHOME 廠商料號已從後台確認存在
- [ ] T005 UID 已從 T005 Sheet 確認存在
- [ ] 該 `platform_product_id` 尚未建立 mapping
- [ ] 對應關係有明確佐證（型號比對或人工確認）

---

## 4. 填寫後驗證清單

- [ ] Column B 無重複值
- [ ] Column C 所有 UID 皆存在於 T005
- [ ] Column E 僅含 `active` / `inactive` / `suspect`
- [ ] Column F 僅含 `manual` / `inferred`
- [ ] Column G、H 格式正確（YYYY-MM-DD HH:mm）
- [ ] 無空白必填欄位

---

## 5. 修正與簽核規則

| 操作 | 權限 | 規則 |
|-----|------|------|
| 新增 mapping | 資料管理者 | 需通過填寫前檢查 |
| 修改 `mapping_status` | 資料管理者 | 需更新 `updated_at` |
| 修改 `platform_product_id` | 🔴 禁止 | 應刪除後重建 |
| 修改 `t005_uid` | 🔴 禁止 | 應刪除後重建 |
| 刪除 mapping | 資料管理者 + 審核者 | 需確認無下游引用 |

**簽核流程**：填寫者自檢 → 審核者抽驗 → 標記為 `active`
