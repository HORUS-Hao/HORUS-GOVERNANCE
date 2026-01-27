# TYPE-P: Producer 模組

## 定義

Producer 模組負責產生原始資料、觸發流程、建立初始狀態。是資料流的起點。

## Required Artifacts

### MUST
- `README.md` — 模組用途、產出說明
- `DATA-FLOW.md` — 產出資料的目標與下游消費者
- `GOVERNANCE.md` — 負責人、狀態、審核紀錄

### SHOULD
- `DECISIONS.md` — 產出邏輯的決策依據
- `EXCEPTIONS.md` — 異常情況與補救措施

### OPTIONAL
- `CHANGELOG.md` — 變更歷史

## 常見缺口與風險

1. 缺 DATA-FLOW → 不知資料流向何處，變更時影響範圍不明
2. 缺 GOVERNANCE → 資料來源問題時不知找誰
3. 缺 EXCEPTIONS → 產出失敗時無標準處理流程
4. 缺 DECISIONS → 不知產出頻率、格式的決策依據
5. README 不含 Schema → 下游無法正確解析
