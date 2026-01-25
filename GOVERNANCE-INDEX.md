# HORUS Governance Index (Tier 0)

- 文件：GOVERNANCE-INDEX.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 狀態：**Tier 0 唯一入口文件**
- 用途：**任何人/任何 AI 進入本專案的第一份文件**

---

## 1. 唯一權威主線

| 項目 | 值 |
|------|-----|
| **權威分支** | `base/2026-01-08-clean` |
| **Commit** | `912df34` |
| **用途** | 唯一可測、可改、可擴充 |

> ⚠️ **所有開發、測試、部署必須基於此分支。**
> 任何偏離此分支的工作需 Architect 明確核准。

---

## 2. 分支類型與用途

| 分支前綴 | 用途 | 權限 |
|----------|------|------|
| `base/*` | 權威主線 | ✅ 可測、可改、可擴充 |
| `snapshot/*` | 歷史快照 | 🔒 只讀，不可修改 |
| `recovery/*` | 治理/回收用 | ⚠️ 需審計後才能合併 |
| `archive/*` | 封存參考 | 🚫 不得引用、不得合併 |
| `docs/*` | 純文件 | ✅ 可合併（僅限 .md 文件） |
| `feature/*` | 功能開發 | ⚠️ 需基於 base 建立 |

---

## 3. 已封板模組狀態

### 3.1 已完成封印

| 模組 | 分支 | 狀態 | 備註 |
|------|------|------|------|
| S005 PIN Test | `recovery/s005-pin-verification-test` | ✅ 封印完成 | 僅含 PIN 測試相關 |
| Data Quality Gap | `docs/data-quality-gap-index` | ✅ 封印完成 | 僅含 FACT 盤點文件 |

### 3.2 已確認無技術債

| 模組 | 狀態 | 備註 |
|------|------|------|
| C005 Core | ✅ 無技術債 | base 已包含最新版本 |
| C005 temp_backup | ✅ 已清理 | `recovery/c005-cleanup` |

### 3.3 已封存（僅供參考）

| 模組 | 分支 | 狀態 | 備註 |
|------|------|------|------|
| V005 Modularization | `archive/v005-modularization-reference` | 📦 已封存 | 不得引用，未來重啟需新裁定 |

### 3.4 治理遷移

| 項目 | 分支 | 狀態 |
|------|------|------|
| _GOVERNANCE → HORUS-GOVERNANCE | `recovery/governance-migration` | ✅ 已完成 |

---

## 4. 明確禁止事項

### 4.1 分支操作禁令

| 禁止事項 | 原因 |
|----------|------|
| ❌ 禁止在 `snapshot/*` 上開發 | 歷史快照，只供參考 |
| ❌ 禁止在 `archive/*` 上操作 | 封存參考，不得引用 |
| ❌ 禁止直接 push 到 `base/*` | 需經審計流程 |

### 4.2 程式碼操作禁令

| 禁止事項 | 原因 |
|----------|------|
| ❌ 禁止未經裁定直接動 Code.gs | 核心邏輯需治理審批 |
| ❌ 禁止 AI 同時修改多模組 | 避免跨模組污染 |
| ❌ 禁止「順便優化」 | 範圍蔓延風險 |

### 4.3 治理文件禁令

| 禁止事項 | 原因 |
|----------|------|
| ❌ 禁止引用 snapshot 的內容作為權威 | snapshot 僅為歷史參考 |
| ❌ 禁止在未經 Architect 核准下新增治理制度 | 治理變更需裁定 |

---

## 5. Phase 4-B 完成條件

### 5.1 必要條件

- [x] 本文件存在於 `HORUS-GOVERNANCE/GOVERNANCE-INDEX.md`
- [x] `base/2026-01-08-clean` 分支未被修改
- [x] 所有 recovery 分支已通過審計
- [x] 所有 archive 分支已確認封存

### 5.2 驗證方式

```bash
# 確認 base 分支未被修改
git rev-parse base/2026-01-08-clean
# 預期輸出：912df34cdff59f0574354826f874620075f3d3ef

# 確認本文件存在
ls HORUS-GOVERNANCE/GOVERNANCE-INDEX.md
```

---

## 6. 快速導航

### 6.1 開發者入口

1. 切換到權威主線：`git checkout base/2026-01-08-clean`
2. 建立功能分支：`git checkout -b feature/your-feature`
3. 完成後提交 PR，等待審計

### 6.2 審計者入口

1. 審計對象：`recovery/*` 分支
2. 審計標準：單一職責、無跨模組污染
3. 審計通過後：合併至 `base/*`

### 6.3 相關文件

| 文件 | 位置 | 用途 |
|------|------|------|
| S005 PIN MVD | `HORUS-GOVERNANCE/S005/PIN-AUTO-VERIFICATION-MVD.md` | PIN 自動驗證定義 |
| Data Quality Gap | `HORUS-GOVERNANCE/DATA-QUALITY/FACT-COVERAGE-GAP-INDEX.md` | FACT 缺口盤點 |
| V005 Baseline | `HORUS-GOVERNANCE/V005/V005-BASELINE-POINTER.md` | V005 基線指標 |

### 6.4 Strategy Governance (Phase 5)

| 文件 | 位置 | 用途 | 狀態 |
|------|------|------|------|
| Phase 5-A 定義 | `STRATEGY/STRATEGY-MAPPING-PHASE5A-READONLY-JOIN.md` | Read-only Join（REF 欄位顯示） | DONE |
| Phase 5-B 定義 | `STRATEGY/PHASE5B-MINIMAL-DECISION-ACTIVATION.md` | Presentation Layer Only | DONE |
| Phase 5-C Readiness | `STRATEGY/PHASE5C-READINESS-AND-BLAST-RADIUS.md` | 啟用前硬門檻與風險模擬 | PRE-ACTIVATION |
| SSOT 定義 | `STRATEGY/C005-STRATEGY-MAPPING-SSOT-DEFINITION.md` | strategy_mapping 結構與治理 | STRUCTURE COMPLETE |
| Phase 5 Reserved | `STRATEGY/STRATEGY-MAPPING-PHASE5-RESERVED.md` | 原始保留聲明 | SUPERSEDED |

**注意：Strategy 相關文件為治理定義，非 runtime 啟用。Phase 5-C 需滿足 Readiness Gate 才可啟用。**

### 6.5 T002

- T002-WORKING-SHEETS.md — WK working sheets boundary (non-canonical, non-sync)

### 6.6 T005 Governance

| 文件 | 角色 | 適用範圍 | 狀態 |
|------|------|----------|------|
| `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | T005 Schema 定義 | 所有 T005 消費者 | Active |
| `T005-LISTING-ELIGIBILITY-RULES.md` | 定義上架資格母數語義 (listing-eligible universe) | C005 / R020 / MAIL interpretation | **Phase 1 – Definition only, no implementation**

### 6.7 External VIEWER Hard Gate（2026-01-09）

| 文件 | 位置 | 用途 |
|------|------|------|
| 決策文件 | `HORUS-GOVERNANCE/DECISIONS/DECISION-V005-EXTERNAL-VIEWER-HARD-GATE.md` | External 使用者審核權限裁定 |
| 工程變更紀錄 | `HORUS-GOVERNANCE/S005/CHANGELOG-PHASE4-EXTERNAL-VIEWER-HARD-GATE.md` | Phase 4 變更清單 |
| 驗證紀錄 | `HORUS-GOVERNANCE/TESTING/TEST-EXTERNAL-VIEWER-HARD-GATE-2026-01-09.md` | 測試結果紀錄 |

---

## 7. 版本歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（Phase 4-B 治理週期完成） |

---

## 8. 最終聲明

> **本文件為 HORUS 專案的 Tier 0 唯一入口文件。**
> **任何人、任何 AI、任何工具進入本專案，必須先閱讀本文件。**
> **違反本文件規定的操作，一律視為無效並需回滾。**

