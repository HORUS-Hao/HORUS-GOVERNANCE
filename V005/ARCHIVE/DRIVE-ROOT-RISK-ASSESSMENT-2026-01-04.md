# Google Drive 根目錄風險評估報告

**評估日期**: 2026-01-04
**最後更新**: 2026-01-05 (Phase 1 結案)
**執行人**: Claude Code (赤兔馬)
**掃描範圍**: `G:\我的雲端硬碟\` 根目錄
**目的**: 判斷哪些檔案可安全移動、需標註風險、或嚴禁移動

---

## 一、掃描統計

| 類型 | 數量 | 說明 |
|------|------|------|
| .gscript | 17 | Google Apps Script 專案 |
| .gsheet | 15 | Google Sheets 試算表 |
| .html | 1 | HTML 檔案 |
| .xlsx | 2 | Excel 暫存檔 |
| **總計** | **35** | 目標檔案 |

---

## 二、.gscript 風險評估

### ❌ 嚴禁移動（Active / Trigger / Core）

| 檔名 | 在 Inventory | 初判用途 | 風險理由 |
|------|--------------|----------|----------|
| D005-Data-Hub.gscript | ✅ 已知 | FACT 核心資料中樞 | **觸發器主機、被多系統引用** |
| Observer-Mail-R020-C005.gscript | ✅ 已知 | 每日郵件觸發器 | **有 Daily Trigger、呼叫 R020 API** |
| T030-Margin-Simulation-Center.gscript | ✅ 已知 | 毛利試算系統 | **Container-bound 或有 Trigger** |
| T002-Material-Management.gscript | ⚠️ 需確認 | 物料管理系統 | **可能有 Trigger** |
| HORUS-E001-Elife-API-V4.gscript | ✅ 已知 | 全國電子 API v4 | **生產系統、每日 Trigger** |

### ⚠️ 需標註風險（可能被引用或測試用途）

| 檔名 | 在 Inventory | 初判用途 | 風險理由 |
|------|--------------|----------|----------|
| C005-UI-Mirror - 上架狀態查詢 (Consumer).gscript | ❌ 未登記 | C005 消費者版 UI | 可能是 C005 Consumer Web App |
| T030-Procurement-Mail.gscript | ❌ 未登記 | 採購郵件服務 | 可能有 Mail Trigger |
| T030-Test.gscript | ❌ 未登記 | T030 測試腳本 | 測試用途，但可能有殘留 Trigger |
| PDM-Calibrator.gscript | ❌ 未登記 | PDM 校準器 | 可能操作 T005 資料 |
| Gemini-CLI-Email-Test.gscript | ❌ 未登記 | Gemini 郵件測試 | 測試用途 |

### ❌ 嚴禁移動 - P0 觀察者系列（已確認有 Trigger，已納入治理）

| 檔名 | Script ID | 初判用途 | 風險理由 |
|------|-----------|----------|----------|
| P0-Momo-Observation-Test.gscript | `1jibvPdIof4sfqMy6hd8LHjq2G3a-gDD5XSjIsKWh5n4bzMP_jbty7oKm` | Momo 觀測 | **有 Trigger、已登記** |
| P0-PCHOME-Observation-Test.gscript | `1k66FtuvYmZE1Hgpg9OEoAj4bK41kDx01Ec2o0zwetzzitRYbeO5b3ZVr` | PChome 觀測 | **有 Trigger、已登記** |
| P0-SHOPEE-Observation-Test.gscript | `1kEfIMgDOzSUECKa2M97KJVyN0v92oE2bEWBbWzq7o_mkFRO4l0Fs2t2e` | Shopee 觀測 | **有 Trigger、已登記** |
| P0-Yahoo-Observation-Test.gscript | `1mk7wcQfJH3uGXgRx6_44qBKNaNctCnmOWVFWSRYReqBsCsCkKEkKB7di` | Yahoo 觀測 | **有 Trigger、已登記** |

> 詳細治理資訊見：`_GOVERNANCE/P0-OBSERVATION-SCRIPTS-INVENTORY.md`

### ✅ 可安全移動（Backup / Legacy / Test）

| 檔名 | 在 Inventory | 初判用途 | 說明 |
|------|--------------|----------|------|
| 《getElifeSaleDetailBatch》...gscript | ❌ 未登記 | 2025/06 歷史備份 | **命名含日期，明確備份** |
| HORUS_SaleSync_ElifeDaily_Backup_20250628.gscript | ❌ 未登記 | 2025/06 備份 | **命名含 Backup 與日期** |
| HORUS_StockSync_ElifeDaily_Backup_20250628.gscript | ❌ 未登記 | 2025/06 備份 | **命名含 Backup 與日期** |

---

## 三、.gsheet 風險評估

### ❌ 嚴禁移動（DataSource / FACT / 控制表）

| 檔名 | 在 Inventory | 初判用途 | 風險理由 |
|------|--------------|----------|----------|
| 📊 E001 全國電子資料同步.gsheet | ✅ 已知 | E001 主資料表 | **被 API 以 ID 引用** |
| T030｜商品毛利試算中心（DataSource）.gsheet | ✅ 已知 | T030 資料來源 | **命名含 DataSource** |
| HORUS-PDM T005商品庫系統 v3.3.gsheet | ✅ 已知 | T005 商品主表 | **核心資料表，被多系統引用** |
| B003-Restock-Decision.gsheet | ⚠️ 需確認 | 補貨決策表 | **可能是 B003 系統資料來源** |

### ⚠️ 需標註風險（可能被引用）

| 檔名 | 在 Inventory | 初判用途 | 風險理由 |
|------|--------------|----------|----------|
| PDM-Calibrator - T005 商品主表 (測試) (1).gsheet | ❌ 未登記 | PDM 測試表 | 可能是 Calibrator 專用 |
| 供應商圖片報表 v1.gsheet | ❌ 未登記 | 供應商報表 | 用途不明 |
| Verbatim_PChome_Slogan_v1.0_2025-10-15.gsheet | ❌ 未登記 | PChome 標語表 | 可能是 R020 參照 |

### ✅ 可安全移動（Export / Backup / Temp）

| 檔名 | 在 Inventory | 初判用途 | 說明 |
|------|--------------|----------|------|
| _temp_momo_parse_1765565264244.gsheet | ❌ 未登記 | Momo 暫存解析 | **命名含 _temp** |
| E001_資料_篩選結果_20251112_003219.gsheet | ❌ 未登記 | E001 匯出 | **命名含日期，匯出結果** |
| E001_銷售資料_全部資料_20251111_094207.gsheet | ❌ 未登記 | E001 匯出 | **命名含日期，匯出結果** |
| E001_銷售資料_篩選結果_20251111_164220.gsheet | ❌ 未登記 | E001 匯出 | **命名含日期，匯出結果** |
| HCTStandardV2 - (空白) 20250722.gsheet | ❌ 未登記 | HCT 範本 | **命名含(空白)與日期** |
| T005_Export_20251030_142629.gsheet | ❌ 未登記 | T005 匯出 | **命名含 Export 與時間戳** |
| T005-FULL-BACKUP-Before-Phase26-2025-10-11-1553.gsheet | ❌ 未登記 | T005 完整備份 | **命名含 BACKUP 與日期** |
| T005診斷結果_2025-10-13T16 50 53.664Z.gdoc | ❌ 未登記 | 診斷報告 | **命名含時間戳** |
| T005診斷結果_2025-10-13T16 51 59.623Z.gdoc | ❌ 未登記 | 診斷報告 | **命名含時間戳** |

---

## 四、.html 風險評估

| 檔名 | 在 Inventory | 初判用途 | 移動風險 |
|------|--------------|----------|----------|
| R021_Email_Preview_20251213_0908.html | ❌ 未登記 | R021 郵件預覽 | ✅ 可移動（預覽輸出） |

---

## 五、.xlsx 風險評估

| 檔名 | 在 Inventory | 初判用途 | 移動風險 |
|------|--------------|----------|----------|
| 商品資料 20251030 的副本.xlsx | ❌ 未登記 | 商品資料副本 | ✅ 可移動（副本） |
| 庫存 結算盤點 20240406.xlsx | ❌ 未登記 | 2024/04 盤點 | ✅ 可移動（歷史資料） |

---

## 六、摘要統計

### 移動風險分類（Phase 1 結案後）

| 風險等級 | 原始數量 | Phase 1 已移動 | 根目錄剩餘 |
|----------|----------|----------------|------------|
| ❌ 嚴禁移動 | 13 | 0 | **13** |
| ⚠️ 需標註風險 | 8 | 0 | **8** |
| ✅ 可安全移動 | 14 | **14** | **0** |
| **總計** | **35** | **14** | **21** |

> ✅ **2026-01-05 Phase 1 完成**: 14 個「可安全移動」檔案已全數移至 `99_ARCHIVE/_SAFE_TO_MOVE/`

### 治理狀態分類（Phase 1 結案後）

| 狀態 | 數量 | 說明 |
|------|------|------|
| ✅ 已在 Inventory | 28 | 全部 Script 已登記（見 MASTER-SCRIPT-INVENTORY） |
| ⚠️ 需確認 | 0 | - |
| ❌ 未登記 | 0 | - |

> ✅ **2026-01-05 更新**: 所有 clasp list 列出的 28 個 Script 已納入 `MASTER-SCRIPT-INVENTORY-2026-01-04.md`

---

## 七、重要發現

### 1. Unknown Script 裁決結果

| Script Name | Script ID | 裁決狀態 | 依據 |
|-------------|-----------|----------|------|
| 未命名的專案 | `1k2X5kaMI5cM2_BWujrWUzxQ2qZEYPcFLWaSexEA841paB7SNkFp34Olb` | **Dormant** | 空白內容（僅含 `function myFunction(){}`）、無 Trigger、無 Dependencies |

> ✅ **2026-01-05 裁決**: 經 clasp clone 檢查，確認為空白專案，重新分類為 Dormant。

### 2. P0 觀察者系列確認結果

| 檔名 | 狀態 | 備註 |
|------|------|------|
| P0-Momo-Observation-Test.gscript | ✅ 已確認有 Trigger | 已納入治理 |
| P0-PCHOME-Observation-Test.gscript | ✅ 已確認有 Trigger | 已納入治理 |
| P0-SHOPEE-Observation-Test.gscript | ✅ 已確認有 Trigger | 已納入治理 |
| P0-Yahoo-Observation-Test.gscript | ✅ 已確認有 Trigger | 已納入治理 |

> 詳細 Script ID 見：`_GOVERNANCE/P0-OBSERVATION-SCRIPTS-INVENTORY.md`

### 3. Phase 1 已整理物件

以下 14 個檔案已移動至 `99_ARCHIVE/_SAFE_TO_MOVE/`：

| 類型 | 數量 | 檔案 |
|------|------|------|
| Backup gscript | 3 | HORUS_SaleSync_*, HORUS_StockSync_*, 《getElife...》 |
| Temp gsheet | 1 | _temp_momo_parse_* |
| Export gsheet | 4 | E001_*, T005_Export_* |
| Backup gsheet | 1 | T005-FULL-BACKUP-* |
| 診斷報告 | 2 | T005診斷結果_* |
| Excel 暫存 | 2 | *.xlsx |
| HTML 預覽 | 1 | R021_Email_Preview_* |

**Phase 1 已完成**: 14 個檔案

---

## 八、Phase 執行記錄

### Phase 1: 可安全移動物件整理 ✅ Completed

| 項目 | 內容 |
|------|------|
| 狀態 | **已完成** |
| 執行日期 | 2026-01-05 |
| 移動數量 | 14 個檔案 |
| 目標路徑 | `G:\我的雲端硬碟\99_ARCHIVE\_SAFE_TO_MOVE\` |
| 執行人 | Claude Code (赤兔馬) |

### Phase 2: 重複 Script 清理 ❌ 未執行

| 項目 | 內容 |
|------|------|
| 狀態 | **未啟動** |
| 說明 | 依裁決禁令，不處理重複 Script |
| 涉及物件 | HORUS_SaleSync x2, HORUS_StockSync x2, T005商品庫結構更新 x2 |

### Phase 3: Dormant/Test Script 重構 ❌ 未執行

| 項目 | 內容 |
|------|------|
| 狀態 | **未啟動** |
| 說明 | 依裁決禁令，不開啟新重構 |

---

## 九、未執行項目清單

以下項目**明確標註為未執行**，等待後續裁決：

| 項目 | 狀態 | 備註 |
|------|------|------|
| 重複 Script 清理 | 未執行 | 需 Architect 裁決 |
| Active/Dormant Script 調整 | 未執行 | 依禁令保持原狀 |
| 新重構任務 | 未執行 | 依禁令不開啟 |
| 根目錄剩餘 21 個物件整理 | 未執行 | 需後續 Phase 裁決 |

---

## 十、限制聲明

- ⛔ 本報告基於 2026-01-04 掃描結果
- ⛔ Phase 1 已執行移動操作（14 個檔案）
- ⛔ 未執行重構或清除 cache
- ⛔ 無法直接存取 Google Drive 雲端 API（僅透過本地同步資料夾）

---

## 十一、相關文件

| 文件 | 說明 |
|------|------|
| `MASTER-SCRIPT-INVENTORY-2026-01-04.md` | 完整 28 個 Script 治理清單 |
| `P0-OBSERVATION-SCRIPTS-INVENTORY.md` | P0 觀察者系列專屬清單 |

---

*報告產出時間: 2026-01-04*
*Phase 1 結案時間: 2026-01-05*
*報告狀態: Phase 1 Completed, Phase 2/3 未啟動*
