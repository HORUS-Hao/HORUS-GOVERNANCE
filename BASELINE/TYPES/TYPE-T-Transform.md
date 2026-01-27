# TYPE-T: Transform 模組

## 定義

Transform 模組負責資料轉換、清洗、標準化。將原始資料轉換為結構化格式供下游使用。

## Required Artifacts

### MUST
- `README.md` — 模組用途、輸入輸出說明
- `DATA-FLOW.md` — 資料來源、轉換邏輯、輸出目標
- `GOVERNANCE.md` — 負責人、狀態、審核紀錄

### SHOULD
- `DECISIONS.md` — 設計決策與理由
- `CHANGELOG.md` — 變更歷史

### OPTIONAL
- `EXCEPTIONS.md` — 已知例外與處理方式

## 常見缺口與風險

1. 缺 DATA-FLOW → 無法理解資料流向，上下游變更時易誤判
2. 缺 DECISIONS → 不知為何如此設計，修改時易破壞原意
3. 缺 CHANGELOG → 無法追溯何時改了什麼
4. README 過時 → 描述與實際行為不符
5. 缺 GOVERNANCE → 不知該找誰負責
