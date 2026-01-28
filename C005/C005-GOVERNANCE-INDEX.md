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

### C005_MAIL_BEHAVIOR_AUDIT-2026-01-26
- 類型：Read-only Behavior Audit
- 日期：2026-01-26
- 狀態：SEALED
- 路徑：./C005_MAIL_BEHAVIOR_AUDIT.md
- 搜尋範圍：
  - R020-Price-Comparator/_clasp-observer-mail/
  - C005-Decision-Mail-Phase7/_clasp/
- 說明：
  - C005 Mail 子系統行為審計
  - 發現 Mail 程式碼位於 R020 模組（非 C005-Listing-Checker）
  - 確認 R020_WriteFence.js 全面禁止寫入（Phase R）
  - 記錄收件人邏輯（硬編碼，無 supervisor_emails）
  - 文件觸發/阻止條件

### C005_WEB_ALIGNMENT_REPORT-2026-01-26
- 類型：Web Alignment Audit (Phase 3)
- 日期：2026-01-26
- 狀態：PASS (Conditional)
- 路徑：./C005_WEB_ALIGNMENT_REPORT.md
- 審計範圍：
  - ExternalCanonical.js (SSOT)
  - ExportUtils.js (匯出)
  - UI-Constants.html (前端欄位)
  - UI-Table.html (表格渲染)
- 說明：
  - Web 輸出對齊 C005_OUTPUT_CONTRACT.md 檢查
  - 確認 25 欄 External Canonical 定義一致
  - 確認 barcode 為 string 型別，前導零保留
  - 確認 UI 不做語意推論或重新計算
  - 條件：UI-Constants 標籤有輕微差異（不影響資料）

---

## ⚖️ ADR（Architecture Decision Records）

### ADR-001-C005-PHASE2-LISTING-COVERAGE
- 日期：2026-01-22
- 狀態：APPROVED
- 路徑：./ADR-001-C005-PHASE2-LISTING-COVERAGE.md
- 說明：Phase 2 上架率計算基準定義

### ADR-002-C005-PHASE3-STRATEGY-UNIVERSE
- 日期：2026-01-22
- 狀態：APPROVED
- 路徑：./ADR-002-C005-PHASE3-STRATEGY-UNIVERSE.md
- 說明：Phase 3 策略母集合定義

### ADR-003-sales-company-model
- 日期：2026-01-22
- 狀態：APPROVED
- 路徑：./ADR-003-sales-company-model.md
- 說明：多公司銷售模型定義

### ADR-003-C005-STRATEGY-MAPPING-SSOT
- 日期：2026-01-23
- 狀態：APPROVED
- 路徑：./ADR-003-C005-STRATEGY-MAPPING-SSOT.md
- 說明：策略映射 SSOT 定義

### ADR-004-rpc-serialization-boundary
- 日期：2026-01-19
- 狀態：APPROVED
- 路徑：./ADR-004-rpc-serialization-boundary.md
- 說明：RPC 序列化邊界定義（解決 Date 物件問題）

---

## ❄️ Freeze / Phase Decisions

### Phase D-2 SEALED
- 日期：2026-01-25
- 狀態：SEALED
- 路徑：./C005-PHASE-D-2-SEALED.md
- 說明：
  - C005_SyncJob.js v1.4.0 驗證通過
  - C005_MailService.js v1.9.0 驗證通過
  - DRY RUN 驗證通過
  - 禁止進一步修改，需 Phase D-3 核准

### GOV-001-C005-STATUS (Module Sealed)
- 日期：2026-01-25
- 狀態：SEALED / GOVERNED
- 路徑：HORUS-GOVERNANCE/GOVERNANCE-STATUS/GOV-001-C005-STATUS.md
- Baseline Commit：c2821a2
- 說明：C005 核心決策邏輯已封存

### C005_GO_LIVE_ACCEPTANCE (Phase 4)
- 日期：2026-01-26
- 狀態：COMPLETE / PRODUCTION READY
- 路徑：./C005_GO_LIVE_ACCEPTANCE.md
- 說明：
  - Phase 4 Go-Live 驗收報告
  - Step 1-4 全部完成
  - 三方一致性驗證：PASS
  - Mail WriteFence：已回鎖（allowMailSend = false）
  - 架構聲明：R020 為 Side-Effect / Fence 層（非業務核心）

---

## 📜 Contracts

### C005_OUTPUT_CONTRACT (Output Schema SSOT)
- 版本：v1.0.0
- 日期：2026-01-26
- 狀態：FROZEN / GOVERNED
- 路徑：./C005_OUTPUT_CONTRACT.md
- Baseline：C005 v3.2.1
- 說明：
  - C005 唯一輸出契約
  - 定義 25 欄 External Canonical 結構
  - 定義欄位穩定性（IMMUTABLE / EXTENDABLE）

### C005_LISTING_HISTORY_SCHEMA (Input Schema SSOT)
- 版本：v2026-01-22.2
- 日期：2026-01-22
- 狀態：SSOT
- 路徑：HORUS-FACTS/C005/C005_LISTING_HISTORY_SCHEMA.md
- 說明：
  - Listing History 11 欄定義
  - STATUS 欄位語意定義

### C005_DATA_CONTRACT_v1.0 (DEPRECATED)
- 狀態：DEPRECATED
- 路徑：HORUS-GOVERNANCE/DATA_CONTRACTS/C005/C005_DATA_CONTRACT_v1.0.md
- 說明：已棄用，指向上述兩份 SSOT

---

## 🧩 Related Modules
- T005（Product Master）
- T002（Material Schema）
- C020（Access / Permission）

---

## 📌 Notes
- 本 Index 不包含裁定
- 所有裁定需由 Architect 明確加入 ADR 區段
