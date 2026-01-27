# Coverage Detail Report

## 報告資訊

- 產出日期：2026-01-28（Phase 3 Re-scan）
- 掃描範圍：C005、T002、T005、T050（第一批 C/T 類型模組）
- 對比基準：Phase 1 掃描報告（2026-01-28）

---

## C005-Listing-Checker

- **類型**：C
- **Phase 1 風險等級**：HIGH
- **Phase 3 風險等級**：**HIGH**
- **改善狀態**：❌ 無改善

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✓ | ✓ | |
| GOVERNANCE | MUST | ✗ | ✗ | |
| DATA-FLOW | SHOULD | ✗ | ✗ | |
| DECISIONS | MUST | ✗ | ✗ | |
| EXCEPTIONS | SHOULD | ✗ | ✗ | |
| CHANGELOG | OPTIONAL | ⚠ | ⚠ | docs/C005-CHANGELOG.md 存在但非標準位置 |

### 缺口說明

缺少 GOVERNANCE.md 和 DECISIONS.md。作為核心 Checker 模組，應優先補齊。

---

## C005-Decision-Mail-Phase7

- **類型**：C
- **Phase 1 風險等級**：HIGH
- **Phase 3 風險等級**：**LOW**
- **改善狀態**：✅ 顯著改善（Phase 2.1 補齊）

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✗ | ✓ | Phase 2.1 新增 |
| GOVERNANCE | MUST | ✗ | ✓ | Phase 2.1 新增 |
| DATA-FLOW | SHOULD | ✗ | ✗ | |
| DECISIONS | MUST | ✗ | ✓ | Phase 2.1 新增 |
| EXCEPTIONS | SHOULD | ✗ | ✗ | |
| CHANGELOG | OPTIONAL | ✗ | ✗ | |

### 改善說明

Phase 2.1 補齊 README/GOVERNANCE/DECISIONS，所有 MUST 項目完成。
Branch: `feature/c005-decision-mail-phase7-docs-v1`（待合併）

---

## C005-Eligibility

- **類型**：C
- **Phase 1 風險等級**：HIGH
- **Phase 3 風險等級**：**HIGH**
- **改善狀態**：❌ 無改善

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✓ | ✓ | |
| GOVERNANCE | MUST | ✗ | ✗ | |
| DATA-FLOW | SHOULD | ✗ | ✗ | |
| DECISIONS | MUST | ✗ | ✗ | |
| EXCEPTIONS | SHOULD | ✗ | ✗ | |
| CHANGELOG | OPTIONAL | ✗ | ✗ | |

### 缺口說明

缺少 GOVERNANCE.md 和 DECISIONS.md。需釐清與 C005-Listing-Checker 的關係。

---

## T002-Material-Schema-Design

- **類型**：T
- **Phase 1 風險等級**：HIGH
- **Phase 3 風險等級**：**LOW**
- **改善狀態**：✅ 顯著改善（Phase 2.2 補齊）

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✗ | ✓ | Phase 2.2 新增 |
| GOVERNANCE | MUST | ✗ | ✓ | Phase 2.2 新增 |
| DATA-FLOW | MUST | ✗ | ✗ | T 類型 MUST，未補齊 |
| DECISIONS | SHOULD | ✗ | ✓ | Phase 2.2 新增 |
| EXCEPTIONS | OPTIONAL | ✗ | ✗ | |
| CHANGELOG | SHOULD | ✗ | ✗ | |

### 改善說明

Phase 2.2 補齊 README/GOVERNANCE/DECISIONS。
**仍缺 DATA-FLOW.md**（T 類型 MUST）。
Branch: `feature/t002-material-schema-governance-docs-v1`（待合併）

### 補齊後仍模糊

DATA-FLOW 未補，無法完整回答「資料從哪來、到哪去」。

---

## T002-原料庫-Material-DB

- **類型**：T
- **Phase 1 風險等級**：HIGH
- **Phase 3 風險等級**：**MED**
- **改善狀態**：⚠ 降級但未補齊

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✓ | ✓ | |
| GOVERNANCE | MUST | ✗ | ✗ | |
| DATA-FLOW | MUST | ✗ | ✗ | |
| DECISIONS | SHOULD | ✗ | ✗ | |
| EXCEPTIONS | OPTIONAL | ✗ | ✗ | |
| CHANGELOG | SHOULD | ✗ | ✗ | |

### 缺口說明

未在 Phase 2 補齊範圍內。功能可能與 T002-Material-Schema-Design 重疊，需釐清後決定是否補齊。

---

## T005-商品管理-Product-Mgmt

- **類型**：T
- **Phase 1 風險等級**：MED
- **Phase 3 風險等級**：**PASS**
- **改善狀態**：✅ 顯著改善（Phase 2.3 補齊）

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✓ | ✓ | Phase 2.3 覆寫（加入 Canonical 宣告） |
| GOVERNANCE | MUST | ✗ | ✓ | Phase 2.3 新增 |
| DATA-FLOW | MUST | ✗ | ✗ | T 類型 MUST，未補齊 |
| DECISIONS | SHOULD | ✗ | ✓ | Phase 2.3 新增 |
| EXCEPTIONS | OPTIONAL | ✗ | ✗ | |
| CHANGELOG | SHOULD | ✗ | ✗ | |

### 改善說明

Phase 2.3 補齊 README/GOVERNANCE/DECISIONS，明確宣告 Canonical Authority。
**仍缺 DATA-FLOW.md**（T 類型 MUST）。
Branch: `feature/t005-product-mgmt-canonical-governance-docs-v1`（待合併）

### 補齊後仍模糊

DATA-FLOW 未補。原 README 詳細內容被精簡，詳細技術說明需從 docs/ 取得。

---

## T005-Product-Management-v3

- **類型**：T
- **Phase 1 風險等級**：HIGH
- **Phase 3 風險等級**：**MED**
- **改善狀態**：⚠ 降級但建議凍結

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✗ | ✗ | |
| GOVERNANCE | MUST | ✗ | ✗ | |
| DATA-FLOW | MUST | ✗ | ✗ | |
| DECISIONS | SHOULD | ✗ | ✗ | |
| EXCEPTIONS | OPTIONAL | ✗ | ✗ | |
| CHANGELOG | SHOULD | ✗ | ✗ | |

### 缺口說明

目錄幾乎為空（僅 scripts/ 子目錄），疑似已被 T005-商品管理-Product-Mgmt 取代。
**建議凍結，不再補齊**。

---

## T050-Platform-Product-Mapping

- **類型**：T
- **Phase 1 風險等級**：LOW
- **Phase 3 風險等級**：**PASS**
- **改善狀態**：✅ 完善（Phase 2.4 標準化）

### Artifact 清單

| Artifact | 要求 | Phase 1 | Phase 3 | 備註 |
|----------|------|---------|---------|------|
| README | MUST | ✓ | ✓ | Phase 2.4 更新 |
| GOVERNANCE | MUST | ⚠ | ✓ | Phase 2.4 新增標準命名（保留 _GOVERNANCE.md） |
| DATA-FLOW | MUST | ⚠ | ⚠ | 有 docs/ 替代文件但非標準命名 |
| DECISIONS | SHOULD | ⚠ | ✓ | Phase 2.4 新增 |
| EXCEPTIONS | OPTIONAL | ✗ | ✗ | |
| CHANGELOG | SHOULD | ✗ | ✗ | |

### 改善說明

Phase 2.4 建立標準命名 GOVERNANCE.md/DECISIONS.md，保留原有 _GOVERNANCE.md。
作為 Reference Implementation，命名已對齊。
Branch: `feature/t050-platform-product-mapping-governance-docs-v1`（待合併）

### 補齊後仍模糊

- DATA-FLOW 僅有替代文件（docs/T050-A-Data-Entry-Specification.md）
- governance/ 子目錄與根目錄結構關係需文件說明

---

## 掃描發現的邊界歧異（Phase 3 更新）

| 模組 | Phase 1 狀態 | Phase 3 狀態 | 說明 |
|------|--------------|--------------|------|
| C005 | AMBIGUOUS | AMBIGUOUS | 仍有 3 個子目錄，主從關係未裁定 |
| T002 | AMBIGUOUS | PARTIAL | Schema-Design 已補，Material-DB 未補 |
| T005 | AMBIGUOUS | PARTIAL | 商品管理 已補，v3 建議凍結 |
| T050 | CLEAR | CLEAR | 結構清楚，已標準化 |

---

## 待合併分支清單

| 分支 | 模組 | 狀態 |
|------|------|------|
| feature/c005-decision-mail-phase7-docs-v1 | C005-Decision-Mail-Phase7 | 待合併 |
| feature/t002-material-schema-governance-docs-v1 | T002-Material-Schema-Design | 待合併 |
| feature/t005-product-mgmt-canonical-governance-docs-v1 | T005-商品管理-Product-Mgmt | 待合併 |
| feature/t050-platform-product-mapping-governance-docs-v1 | T050-Platform-Product-Mapping | 待合併 |
