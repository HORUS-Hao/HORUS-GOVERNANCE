# TYPE-C: Checker 模組

## 定義

Checker 模組負責資料驗證、品質檢查、條件判斷。判定資料是否符合預期並產生檢查結果。

## Required Artifacts

### MUST
- `README.md` — 模組用途、檢查規則說明
- `DECISIONS.md` — 判斷邏輯與閾值的決策依據
- `GOVERNANCE.md` — 負責人、狀態、審核紀錄

### SHOULD
- `DATA-FLOW.md` — 資料來源與檢查結果輸出
- `EXCEPTIONS.md` — 已知例外情況與處理方式

### OPTIONAL
- `CHANGELOG.md` — 變更歷史

## 常見缺口與風險

1. 缺 DECISIONS → 不知判斷標準從何而來，無法驗證正確性
2. 缺 EXCEPTIONS → 例外情況未記錄，誤報或漏報無據可查
3. 缺 GOVERNANCE → 規則變更時不知該找誰確認
4. 缺 DATA-FLOW → 不知檢查的是什麼資料
5. README 不含規則細節 → 無法理解檢查邏輯
