# Coverage Summary Report

## 報告資訊

- 產出日期：2026-01-28（Phase 3 Re-scan）
- 掃描範圍：C005、T002、T005、T050（第一批 C/T 類型模組）
- 執行者：Claude Code（Read-only 掃描）
- 掃描位置：BASE-SERVICES（含 feature 分支）+ HORUS-GOVERNANCE

---

## Phase 1 vs Phase 3 對比總覽

| 指標 | Phase 1 | Phase 3 | 變化 |
|------|---------|---------|------|
| 模組總數 | 8 | 8 | — |
| MUST 完整率 | 20.8%（5/24） | 54.2%（13/24） | **+33.4%** |
| HIGH 風險模組數 | 6 | 2 | **-4** |
| MED 風險模組數 | 1 | 2 | +1 |
| LOW 風險模組數 | 1 | 2 | +1 |
| PASS 模組數 | 0 | 2 | **+2** |

---

## Phase 3 風險分布

| 風險等級 | 模組數 | 佔比 | 變化 |
|----------|--------|------|------|
| HIGH | 2 | 25% | -4 |
| MED | 2 | 25% | +1 |
| LOW | 2 | 25% | +1 |
| PASS | 2 | 25% | +2 |

---

## Phase 3 模組清單（依風險排序）

| 代號 | 類型 | Phase 1 狀態 | Phase 3 狀態 | 風險等級 | 備註 |
|------|------|--------------|--------------|----------|------|
| C005-Listing-Checker | C | 2/3 MUST 缺 | 2/3 MUST 缺 | **HIGH** | 未補齊 |
| C005-Eligibility | C | 2/3 MUST 缺 | 2/3 MUST 缺 | **HIGH** | 未補齊 |
| T002-原料庫-Material-DB | T | 2/3 MUST 缺 | 2/3 MUST 缺 | MED | 未補齊，但非主模組 |
| T005-Product-Management-v3 | T | 3/3 MUST 缺 | 3/3 MUST 缺 | MED | 疑似廢棄，建議凍結 |
| C005-Decision-Mail-Phase7 | C | 3/3 MUST 缺 | **0/3 MUST 缺** | LOW | **Phase 2.1 補齊** |
| T002-Material-Schema-Design | T | 3/3 MUST 缺 | **1/3 MUST 缺** | LOW | **Phase 2.2 補齊**（缺 DATA-FLOW） |
| T005-商品管理-Product-Mgmt | T | 2/3 MUST 缺 | **1/3 MUST 缺** | PASS | **Phase 2.3 補齊**（缺 DATA-FLOW） |
| T050-Platform-Product-Mapping | T | 0/3 MUST 缺 | **0/3 MUST 缺** | PASS | **Phase 2.4 標準化** |

---

## MUST 文件缺失率變化

| Artifact | Phase 1 缺失 | Phase 3 缺失 | 變化 |
|----------|--------------|--------------|------|
| README | 3/8（37.5%） | 1/8（12.5%） | **-25%** |
| GOVERNANCE | 7/8（87.5%） | 4/8（50%） | **-37.5%** |
| DATA-FLOW | 8/8（100%） | 8/8（100%） | — |
| DECISIONS | 6/8（75%） | 4/8（50%） | **-25%** |

> **注意**：DATA-FLOW 未在 Phase 2 補齊範圍內（僅補 README/GOVERNANCE/DECISIONS）

---

## 補齊後仍模糊的模組

| 模組 | 問題描述 |
|------|----------|
| T002-Material-Schema-Design | 缺 DATA-FLOW.md（T 類型 MUST） |
| T005-商品管理-Product-Mgmt | 缺 DATA-FLOW.md（T 類型 MUST） |
| T050-Platform-Product-Mapping | governance/ 子目錄與根目錄結構關係不清 |

---

## 剩餘 HIGH 風險模組分析

### C005-Listing-Checker
- **缺失**：GOVERNANCE.md, DECISIONS.md
- **特殊情況**：有 `docs/C005-CHANGELOG.md` 但非標準位置
- **建議**：值得補齊（核心 Checker 模組）

### C005-Eligibility
- **缺失**：GOVERNANCE.md, DECISIONS.md
- **特殊情況**：僅有 README + 3 個 .js 檔案
- **建議**：釐清與 C005-Listing-Checker 的關係後再決定

---

## Architect Review Candidates

### 候選 A：應補齊（值得投資）

| 模組 | 理由 |
|------|------|
| C005-Listing-Checker | 核心 Checker，風險最高 |
| DATA-FLOW.md（全模組） | Phase 2 未補，T 類型 MUST |

### 候選 B：可延後

| 模組 | 理由 |
|------|------|
| C005-Eligibility | 需先釐清與 Listing-Checker 的關係 |
| T002-原料庫-Material-DB | 非主模組，功能與 Schema-Design 重疊 |

### 候選 C：應凍結 / 不再補

| 模組 | 理由 |
|------|------|
| T005-Product-Management-v3 | 目錄幾乎為空，疑似已被 T005-商品管理-Product-Mgmt 取代 |

---

## 下一步行動建議

1. **合併 Phase 2 分支**：4 個 feature 分支需合併至 main 使補齊生效
2. **補齊 DATA-FLOW.md**：T002/T005/T050 皆缺，為 T 類型 MUST
3. **裁定 T005-Product-Management-v3**：是否標記 DEPRECATED
4. **釐清 C005 子模組關係**：Listing-Checker vs Eligibility vs Decision-Mail
