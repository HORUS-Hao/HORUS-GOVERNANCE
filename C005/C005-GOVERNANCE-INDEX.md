# C005 Governance Index

本文件為 C005（Listing Checker）模組之治理索引入口。
所有分析、審計、裁定、ADR 文件，皆需在此登錄。

---

## 📘 Audits

### C005-READONLY-AUDIT-2026-01-22
- 類型：Read-only Blind Audit
- 日期：2026-01-22
- 狀態：SEALED / PENDING DECISION
- 路徑：
  - ./AUDIT/C005-READONLY-AUDIT-2026-01-22.md
- 說明：
  - 本文件為未引入既有治理前之盲掃審計
  - 作為後續 Alignment / ADR / Phase Freeze 之事實依據

---

## 🧭 Alignment Audits

### C005-GOVERNANCE-ALIGNMENT-AUDIT-2026-01-22
- 類型：Read-only Alignment Audit
- 日期：2026-01-22
- 狀態：SEALED / PENDING DECISION
- 路徑：
  - ./ALIGNMENT/C005-GOVERNANCE-ALIGNMENT-AUDIT-2026-01-22.md
- 輸入來源：
  - C005-READONLY-AUDIT-2026-01-22.md
  - HORUS-GOVERNANCE/
  - HORUS-FACTS/
- 說明：
  - 將 Blind Audit 結果與既有 HORUS 治理體系進行對照
  - 識別一致項目、不一致項目、治理缺口
  - 提供裁定建議（非最終裁定）

---

## 🔍 Discovery Audits

### T005-CANONICAL-ROOT-DISCOVERY-2026-01-22
- 類型：Read-only Discovery
- 日期：2026-01-22
- 狀態：SEALED / PENDING DECISION
- 路徑：
  - ./AUDIT/T005-CANONICAL-ROOT-DISCOVERY-2026-01-22.md
- 搜尋範圍：
  - BASE-SERVICES 全目錄
- 說明：
  - 識別所有與 T005 商品主表相關的程式碼位置
  - 分類為：✅ T005 核心 / ⚠️ T005 周邊 / ❌ 非 T005（僅引用）
  - 確認 T005 核心 GAS 檔案 7 個，引用 T005 的外部模組 5 個
  - 識別 SYNC_T005_SALES_COMPANY.js 越界寫入問題

---

## ⚖️ ADR（Architecture Decision Records）
- （尚未登錄）

---

## ❄️ Freeze / Phase Decisions
- （尚未登錄）

---

## 🧩 Related Modules
- T005（Product Master）
- T002（Material Schema）
- C020（Access / Permission）

---

## 📌 Notes
- 本 Index 不包含裁定
- 所有裁定需由 Architect 明確加入 ADR 區段
