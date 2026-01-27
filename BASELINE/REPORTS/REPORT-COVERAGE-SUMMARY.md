# Coverage Summary Report

## 報告資訊

- 產出日期：2026-01-28
- 掃描範圍：C005、T002、T005、T050（第一批 C/T 類型模組）
- 執行者：Claude Code（Read-only 掃描）
- 掃描位置：BASE-SERVICES + HORUS-GOVERNANCE

## 總覽

| 指標 | 數值 |
|------|------|
| 模組總數 | 8（含子模組） |
| MUST 完整率 | 20.8%（5/24 MUST 項目存在） |
| 整體 Coverage | 19.6%（9/46 Artifact 存在） |

## 風險分布

| 風險等級 | 模組數 | 佔比 |
|----------|--------|------|
| HIGH | 6 | 75% |
| MED | 1 | 12.5% |
| LOW | 1 | 12.5% |
| PASS | 0 | 0% |

## 模組清單（依風險排序）

| 代號 | 類型 | MUST 缺口數 | 風險等級 | 備註 |
|------|------|-------------|----------|------|
| C005-Decision-Mail-Phase7 | C | 3/3 | HIGH | 無任何文件 |
| T002-Material-Schema-Design | T | 3/3 | HIGH | docs/ 僅有 archived/ |
| T005-Product-Management-v3 | T | 3/3 | HIGH | 幾乎為空，疑似廢棄 |
| C005-Eligibility | C | 2/3 | HIGH | 僅有 README |
| C005-Listing-Checker | C | 2/3 | HIGH | 缺 GOVERNANCE, DATA-FLOW |
| T002-原料庫-Material-DB | T | 2/3 | HIGH | 僅有 README |
| T005-商品管理-Product-Mgmt | T | 2/3 | MED | README 完整，缺 GOV/DATA-FLOW |
| T050-Platform-Product-Mapping | T | 0/3 | LOW | 結構最完整，命名略有差異 |

## 最常缺失的 Artifact

| Artifact | 缺失數 | 缺失率 |
|----------|--------|--------|
| DATA-FLOW | 8/8 | 100% |
| GOVERNANCE | 7/8 | 87.5% |
| EXCEPTIONS | 8/8 | 100% |
| CHANGELOG | 7/8 | 87.5% |
| DECISIONS | 6/8 | 75% |
| README | 3/8 | 37.5% |

## 邊界歧異摘要

| 模組代號 | 子目錄數 | 主要問題 |
|----------|----------|----------|
| C005 | 3 | 主從關係不明確 |
| T002 | 2 | 功能邊界不清 |
| T005 | 6（含 4 DEPRECATED） | Active 模組識別困難 |
| T050 | 1 | 邊界清楚 |

## 下一步行動

1. **釐清模組邊界**：定義 C005、T002、T005 的主模組，標記子模組關係
2. **優先補齊 HIGH 風險模組的 MUST 項目**：
   - 所有模組補 DATA-FLOW.md
   - C005/T002 補 GOVERNANCE.md
3. **統一命名規範**：將 _GOVERNANCE.md、*-INDEX.md 對齊至標準命名
4. **清理廢棄目錄**：確認 T005-Product-Management-v3 是否應標記 DEPRECATED
