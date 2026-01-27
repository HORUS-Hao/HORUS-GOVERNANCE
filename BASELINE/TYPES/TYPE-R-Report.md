# TYPE-R: Report 模組

## 定義

Report 模組負責產出報表、摘要、通知。將處理結果彙整為人類可讀的格式。

## Required Artifacts

### MUST
- `README.md` — 報表用途、內容說明
- `DATA-FLOW.md` — 資料來源與報表輸出目標

### SHOULD
- `GOVERNANCE.md` — 負責人、狀態、審核紀錄
- `CHANGELOG.md` — 變更歷史

### OPTIONAL
- `DECISIONS.md` — 格式或呈現方式的決策
- `EXCEPTIONS.md` — 特殊情況處理

## 常見缺口與風險

1. 缺 DATA-FLOW → 不知報表資料來源，上游變更時報表失準
2. 缺 README → 不知報表該如何解讀
3. 缺 CHANGELOG → 報表格式變更無紀錄，歷史比較困難
4. 缺 GOVERNANCE → 報表需求變更時不知找誰
5. 輸出格式未標準化 → 下游自動化處理困難
