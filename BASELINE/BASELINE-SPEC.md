# Baseline Specification v0.1

## A) 名詞定義

| 術語 | 定義 |
|------|------|
| **Artifact** | 模組應具備的文件或結構項目 |
| **MUST** | 必要項目，缺少即為不完整 |
| **SHOULD** | 建議項目，缺少會降低可維護性 |
| **OPTIONAL** | 選擇性項目，視情況需要 |
| **Coverage** | 實際具備的 Artifacts 佔應有 Artifacts 的比例 |
| **Gap** | 應有但缺少的 Artifact |

## B) 適用範圍

本規格僅針對模組的**文件與結構完整性**進行評估：

- 評估對象：T（Transform）、C（Checker）、R（Report）、P（Producer）類型模組
- 評估內容：README、GOVERNANCE、DATA-FLOW、DECISIONS、EXCEPTIONS、CHANGELOG
- 不評估：程式碼品質、測試覆蓋率、效能指標

## C) 風險分級規則

| 等級 | 條件 | 影響 |
|------|------|------|
| **HIGH** | 缺少 DECISIONS 或 DATA-FLOW 或 GOVERNANCE | 無法理解模組行為，誤判風險高 |
| **MED** | 缺少 EXCEPTIONS 或 CHANGELOG | 例外情況不明，變更歷史不可追溯 |
| **LOW** | 格式不一致或缺少 OPTIONAL 項目 | 可維護性降低但不影響正確性 |

## D) 報告輸出格式

### Summary Report
- 模組總數
- 各風險等級模組數量
- 整體 Coverage 百分比

### Detail Report
- 每模組的 Artifact 清單
- 缺口標示（✓ 有 / ✗ 缺）
- 風險等級
