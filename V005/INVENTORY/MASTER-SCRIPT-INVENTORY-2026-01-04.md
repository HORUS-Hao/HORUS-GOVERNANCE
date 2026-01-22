# HORUS GAS Script 完整治理清單

**建立日期**: 2026-01-04
**建立人**: Claude Code (赤兔馬)
**資料來源**: clasp list (28 Scripts)
**裁決人**: Architect (豪哥)

---

## 治理原則

| 狀態 | 說明 | 可否刪除 |
|------|------|----------|
| **Active** | 生產環境使用中、有 Trigger | ❌ 禁止 |
| **Dormant** | 曾經使用、目前休眠 | ❌ 需裁決 |
| **Experimental / Test** | 實驗性或測試用途 | ❌ 需裁決 |
| **Backup** | 明確為備份版本 | ⚠️ 需裁決 |
| **Unknown** | 用途不明 | ❌ 禁止 |

---

## 一、核心生產系統 (Active)

| Script Name | Script ID | 治理狀態 | 初判用途 | 備註 |
|-------------|-----------|----------|----------|------|
| D005-Data-Hub | `1U8-gVDcfIfkH_MGH-IEmvyRuq0nlnwW-LVLeIVa1H5Qr0UkrjFaFunhd` | **Active** | FACT 資料中樞 | 核心系統、有 Trigger |
| Observer-Mail-R020-C005 | `1LZxoY-N7CAbgn0bZovoZar6iaL4lP1OtbKNDgLL1EXYPG9ssU_dWfeqw` | **Active** | 每日郵件服務 | 有 Daily Trigger |
| HORUS-E001-Elife-API-V4 | `1SOvydKM252y_SitpE4tGdHbLeSaf2Vrm510AExM5rwdJsh72pD2IeIqs` | **Active** | 全國電子 API v4 | 生產 API |
| T030-Margin-Simulation-Center | `1BWAbjmObajrATGWuqkLfPwoMzuZ3kgue7QDKYFFe4clhQe4m-g8JsiCu` | **Active** | 毛利試算系統 | 可能有 Trigger |
| T002-Material-Management | `1GqBwFMpEpSrXCshb8xECZUcVTaQwH5ytaPf9qbE31rg2I64qycG0_N_z` | **Active** | 物料管理系統 | 可能有 Trigger |

---

## 二、P0 觀察者系列 (Active - 已確認有 Trigger)

| Script Name | Script ID | 治理狀態 | 初判用途 | 備註 |
|-------------|-----------|----------|----------|------|
| P0-Momo-Observation-Test | `1jibvPdIof4sfqMy6hd8LHjq2G3a-gDD5XSjIsKWh5n4bzMP_jbty7oKm` | **Active** | Momo 平台觀測 | 有 Time Trigger |
| P0-PCHOME-Observation-Test | `1k66FtuvYmZE1Hgpg9OEoAj4bK41kDx01Ec2o0zwetzzitRYbeO5b3ZVr` | **Active** | PChome 平台觀測 | 有 Time Trigger |
| P0-SHOPEE-Observation-Test | `1kEfIMgDOzSUECKa2M97KJVyN0v92oE2bEWBbWzq7o_mkFRO4l0Fs2t2e` | **Active** | Shopee 平台觀測 | 有 Time Trigger |
| P0-Yahoo-Observation-Test | `1mk7wcQfJH3uGXgRx6_44qBKNaNctCnmOWVFWSRYReqBsCsCkKEkKB7di` | **Active** | Yahoo 平台觀測 | 有 Time Trigger |

---

## 三、業務應用系統 (Active / Dormant)

| Script Name | Script ID | 治理狀態 | 初判用途 | 備註 |
|-------------|-----------|----------|----------|------|
| AGY-E001-ELife-Sale... | `1LpklKc_v--lwr2jx7MejE53NJOQ4khADDKCz_wZJXQwFUubMZ1KwzQp0` | **Active** | 全國電子銷售同步 | AGY 系列 |
| T030-Procurement-Mail | `1gFT9FzKs17vZrz9W_gSSiD6yRapqEQQFxJSEFOuS5GJsZbBRKk4YDVqX` | **Dormant** | 採購郵件服務 | 可能有 Trigger |
| B2-Listing-Consumer | `1VisCnF8BPc4WYiUJNOWP-Z1sfDtYibmawDzUubEcXCA5ub5n5O6K95c0` | **Dormant** | B2 上架消費者版 | 用途待確認 |
| C005-UI-Mirror | `1wWotT0wj_XDH1xUzvuIWuzZWpHNRp_bhdvgkSBs4VP8nN2CxohZmimnF` | **Dormant** | C005 消費者 UI | 可能是 WebApp |
| E001-API-Sync-v3 | `1fsHN5d5lQ9C5LXRhFLKwKtE3vL8xlwgAVBn9wwuRzAD1arjUxVZKYSJk` | **Dormant** | E001 API 同步 v3 | 可能被 V4 取代 |
| HORUS｜每日系統備份... | `1Up08l-MAwG2wGqBYncd_py35TFBw8lZBL0mwGtwy02IZA3MSaRSf-ZYU` | **Active** | 每日系統備份 | 可能有 Trigger |

---

## 四、工具 / 校準器 (Experimental / Dormant)

| Script Name | Script ID | 治理狀態 | 初判用途 | 備註 |
|-------------|-----------|----------|----------|------|
| PDM-Calibrator | `178wI2om1sZW8EOrb1Lc_E-12tXoj6Njg_KaU_-nrWcC-qi4th5oKsCMq` | **Experimental** | PDM 校準器 | 操作 T005 資料 |
| T005商品庫結構更新... (1) | `1GpC4ECj458lmCXMMjiIb3ShY4h3GOjOw8ZwcKGd5Nm8oM1PWS9D_1ByB` | **Dormant** | T005 結構更新 | 一次性工具 |
| T005商品庫結構更新... (2) | `1gKHC_gwPbSOWq6VHKHTk2GUKxEKRw6v3avBAkWc8ngWigDWHYaSy7qPP` | **Dormant** | T005 結構更新 | 重複版本？ |
| T002原料庫完整系統v... | `1FiATlZ3V5n9uS4gtJDhXxs2k87bFRLY-EPsC1MYuGs5g2_pZN9k3IPco` | **Dormant** | T002 舊版系統 | 可能被新版取代 |

---

## 五、測試 / 實驗性 (Test)

| Script Name | Script ID | 治理狀態 | 初判用途 | 備註 |
|-------------|-----------|----------|----------|------|
| T030-Test | `14P-95a9EPwIoPH_QJ17TAZt51DktWQnCd1ysfp_VdFLgBLC_aAE0Yf6j` | **Test** | T030 測試腳本 | 測試用途 |
| Gemini-CLI-Email-Test | `1kpb-s3lBXOyNLiGoEiqWvekHXgi4hA8KwdR8DENltMz-5N_PX7ykKjY9` | **Test** | Gemini 郵件測試 | 測試用途 |
| R099_CodexSkillTest | `1kUkNC9RHWvVrORFezRpNFPZ3WfemqpIlYHJ-QWeGW5r8WuvanKmP3qvo` | **Test** | Codex Skill 測試 | 測試用途 |

---

## 六、備份版本 (Backup)

| Script Name | Script ID | 治理狀態 | 初判用途 | 備註 |
|-------------|-----------|----------|----------|------|
| HORUS_SaleSync_Elif... (1) | `1LvUdngDlBXwqhHL3G4zzIHsIHP_ALvqixtgWkmSkbyo8xwvSdJLdLSxJ` | **Backup** | 銷售同步備份 | 2025/06 備份 |
| HORUS_SaleSync_Elif... (2) | `1r8t3WR24lX8Kv4tlNkCYlGNktzDN0ik-N0glnT-bQdRPNRUxR1YSlkzJ` | **Backup** | 銷售同步備份 | 另一版本 |
| HORUS_StockSync_Elif... (1) | `1Sd9AVm3wkPZ39rtjVvet0D13Eo2wSdMWy6poL_XRgTRdB9h38cx9CECM` | **Backup** | 庫存同步備份 | 2025/06 備份 |
| HORUS_StockSync_Elif... (2) | `1zXD1PbkD5x6nGNKf7Jip8evR-9hAo3yR5whKPvI3-VprtPzBlIHUVcXV` | **Backup** | 庫存同步備份 | 另一版本 |
| 《getElifeSaleDetail... | `11_U0h5oZqFXKZ284aJHrOwe91v8q6kMSsBg9lPUmdAjEPUEF2IdDUOWS` | **Backup** | 全國電子抓取備份 | 2025/06 歷史 |

---

## 七、空白專案 (Dormant)

| Script Name | Script ID | 治理狀態 | 初判用途 | 備註 |
|-------------|-----------|----------|----------|------|
| 未命名的專案 | `1k2X5kaMI5cM2_BWujrWUzxQ2qZEYPcFLWaSexEA841paB7SNkFp34Olb` | **Dormant** | 空白專案 | 僅含空函數 `myFunction(){}` |

> **2026-01-05 檢查結果**: 此 Script 僅包含空函數，無 Trigger、無 Dependencies、無實際功能。建議保留但標記為 Dormant。

---

## 八、統計摘要

| 治理狀態 | 數量 | 說明 |
|----------|------|------|
| **Active** | 12 | 生產使用中 |
| **Dormant** | 8 | 休眠狀態 (含空白專案) |
| **Test** | 3 | 測試用途 |
| **Experimental** | 1 | 實驗性 |
| **Backup** | 5 | 備份版本 |
| **總計** | **28** | |

> **2026-01-05 更新**: Unknown (未命名的專案) 經檢查後確認為空白專案，已重新分類為 Dormant。

---

## 九、GAS 編輯器連結總表

| Script Name | 編輯器連結 |
|-------------|-----------|
| D005-Data-Hub | https://script.google.com/d/1U8-gVDcfIfkH_MGH-IEmvyRuq0nlnwW-LVLeIVa1H5Qr0UkrjFaFunhd/edit |
| Observer-Mail-R020-C005 | https://script.google.com/d/1LZxoY-N7CAbgn0bZovoZar6iaL4lP1OtbKNDgLL1EXYPG9ssU_dWfeqw/edit |
| HORUS-E001-Elife-API-V4 | https://script.google.com/d/1SOvydKM252y_SitpE4tGdHbLeSaf2Vrm510AExM5rwdJsh72pD2IeIqs/edit |
| T030-Margin-Simulation-Center | https://script.google.com/d/1BWAbjmObajrATGWuqkLfPwoMzuZ3kgue7QDKYFFe4clhQe4m-g8JsiCu/edit |
| T002-Material-Management | https://script.google.com/d/1GqBwFMpEpSrXCshb8xECZUcVTaQwH5ytaPf9qbE31rg2I64qycG0_N_z/edit |
| P0-Momo-Observation-Test | https://script.google.com/d/1jibvPdIof4sfqMy6hd8LHjq2G3a-gDD5XSjIsKWh5n4bzMP_jbty7oKm/edit |
| P0-PCHOME-Observation-Test | https://script.google.com/d/1k66FtuvYmZE1Hgpg9OEoAj4bK41kDx01Ec2o0zwetzzitRYbeO5b3ZVr/edit |
| P0-SHOPEE-Observation-Test | https://script.google.com/d/1kEfIMgDOzSUECKa2M97KJVyN0v92oE2bEWBbWzq7o_mkFRO4l0Fs2t2e/edit |
| P0-Yahoo-Observation-Test | https://script.google.com/d/1mk7wcQfJH3uGXgRx6_44qBKNaNctCnmOWVFWSRYReqBsCsCkKEkKB7di/edit |
| AGY-E001-ELife-Sale... | https://script.google.com/d/1LpklKc_v--lwr2jx7MejE53NJOQ4khADDKCz_wZJXQwFUubMZ1KwzQp0/edit |
| T030-Procurement-Mail | https://script.google.com/d/1gFT9FzKs17vZrz9W_gSSiD6yRapqEQQFxJSEFOuS5GJsZbBRKk4YDVqX/edit |
| B2-Listing-Consumer | https://script.google.com/d/1VisCnF8BPc4WYiUJNOWP-Z1sfDtYibmawDzUubEcXCA5ub5n5O6K95c0/edit |
| C005-UI-Mirror | https://script.google.com/d/1wWotT0wj_XDH1xUzvuIWuzZWpHNRp_bhdvgkSBs4VP8nN2CxohZmimnF/edit |
| E001-API-Sync-v3 | https://script.google.com/d/1fsHN5d5lQ9C5LXRhFLKwKtE3vL8xlwgAVBn9wwuRzAD1arjUxVZKYSJk/edit |
| HORUS｜每日系統備份... | https://script.google.com/d/1Up08l-MAwG2wGqBYncd_py35TFBw8lZBL0mwGtwy02IZA3MSaRSf-ZYU/edit |
| PDM-Calibrator | https://script.google.com/d/178wI2om1sZW8EOrb1Lc_E-12tXoj6Njg_KaU_-nrWcC-qi4th5oKsCMq/edit |
| T005商品庫結構更新... (1) | https://script.google.com/d/1GpC4ECj458lmCXMMjiIb3ShY4h3GOjOw8ZwcKGd5Nm8oM1PWS9D_1ByB/edit |
| T005商品庫結構更新... (2) | https://script.google.com/d/1gKHC_gwPbSOWq6VHKHTk2GUKxEKRw6v3avBAkWc8ngWigDWHYaSy7qPP/edit |
| T002原料庫完整系統v... | https://script.google.com/d/1FiATlZ3V5n9uS4gtJDhXxs2k87bFRLY-EPsC1MYuGs5g2_pZN9k3IPco/edit |
| T030-Test | https://script.google.com/d/14P-95a9EPwIoPH_QJ17TAZt51DktWQnCd1ysfp_VdFLgBLC_aAE0Yf6j/edit |
| Gemini-CLI-Email-Test | https://script.google.com/d/1kpb-s3lBXOyNLiGoEiqWvekHXgi4hA8KwdR8DENltMz-5N_PX7ykKjY9/edit |
| R099_CodexSkillTest | https://script.google.com/d/1kUkNC9RHWvVrORFezRpNFPZ3WfemqpIlYHJ-QWeGW5r8WuvanKmP3qvo/edit |
| HORUS_SaleSync_Elif... (1) | https://script.google.com/d/1LvUdngDlBXwqhHL3G4zzIHsIHP_ALvqixtgWkmSkbyo8xwvSdJLdLSxJ/edit |
| HORUS_SaleSync_Elif... (2) | https://script.google.com/d/1r8t3WR24lX8Kv4tlNkCYlGNktzDN0ik-N0glnT-bQdRPNRUxR1YSlkzJ/edit |
| HORUS_StockSync_Elif... (1) | https://script.google.com/d/1Sd9AVm3wkPZ39rtjVvet0D13Eo2wSdMWy6poL_XRgTRdB9h38cx9CECM/edit |
| HORUS_StockSync_Elif... (2) | https://script.google.com/d/1zXD1PbkD5x6nGNKf7Jip8evR-9hAo3yR5whKPvI3-VprtPzBlIHUVcXV/edit |
| 《getElifeSaleDetail... | https://script.google.com/d/11_U0h5oZqFXKZ284aJHrOwe91v8q6kMSsBg9lPUmdAjEPUEF2IdDUOWS/edit |
| 未命名的專案 | https://script.google.com/d/1k2X5kaMI5cM2_BWujrWUzxQ2qZEYPcFLWaSexEA841paB7SNkFp34Olb/edit |

---

## 十、變更歷史

| 日期 | 操作 | 執行人 |
|------|------|--------|
| 2026-01-04 | 建立完整 Inventory，涵蓋 clasp list 全部 28 個 Script | Claude Code |
| 2026-01-05 | Unknown Script 檢查完成，重新分類為 Dormant | Claude Code |

---

## 十一、Drive 根目錄整理記錄

### Phase 1 整理 (2026-01-05)

已移動 14 個「可安全移動」檔案至 `99_ARCHIVE/_SAFE_TO_MOVE/`：

| # | 檔名 | 類型 | 原始用途 |
|---|------|------|----------|
| 1 | _temp_momo_parse_1765565264244.gsheet | Temp | Momo 暫存解析 |
| 2 | E001_資料_篩選結果_20251112_003219.gsheet | Export | E001 匯出 |
| 3 | E001_銷售資料_全部資料_20251111_094207.gsheet | Export | E001 匯出 |
| 4 | E001_銷售資料_篩選結果_20251111_164220.gsheet | Export | E001 匯出 |
| 5 | HCTStandardV2 - (空白) 20250722.gsheet | Template | HCT 空白範本 |
| 6 | T005_Export_20251030_142629.gsheet | Export | T005 匯出 |
| 7 | T005-FULL-BACKUP-Before-Phase26-2025-10-11-1553.gsheet | Backup | T005 完整備份 |
| 8 | T005診斷結果_2025-10-13T16 50 53.664Z.gdoc | Report | 診斷報告 |
| 9 | T005診斷結果_2025-10-13T16 51 59.623Z.gdoc | Report | 診斷報告 |
| 10 | R021_Email_Preview_20251213_0908.html | Preview | R021 郵件預覽 |
| 11 | 商品資料 20251030 的副本.xlsx | Copy | 商品資料副本 |
| 12 | 庫存 結算盤點 20240406.xlsx | Archive | 2024 盤點資料 |
| 13 | 《getElifeSaleDetailBatch》...gscript | Backup | 2025/06 備份 |
| 14 | HORUS_SaleSync_ElifeDaily_Backup_20250628.gscript | Backup | 2025/06 備份 |
| 15 | HORUS_StockSync_ElifeDaily_Backup_20250628.gscript | Backup | 2025/06 備份 |

---

*此文件為 HORUS GAS Script 主治理清單，禁止未經授權修改*
