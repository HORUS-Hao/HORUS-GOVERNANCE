# Coverage Detail Report

## 報告資訊

- 產出日期：2026-01-28
- 掃描範圍：C005、T002、T005、T050（第一批 C/T 類型模組）
- 執行方式：Read-only 掃描，檢查 BASE-SERVICES + GOVERNANCE 層

## 邊界說明

> ⚠️ 部分模組在 BASE-SERVICES 有多個子目錄，以下分別列出。
> 治理文件來源同時檢查 BASE-SERVICES 模組目錄 + HORUS-GOVERNANCE 對應目錄。

---

## C005（Checker 類型）

### C005-Listing-Checker（主要模組）

- **類型**：C
- **風險等級**：**HIGH**
- **位置**：`BASE-SERVICES/C005-Listing-Checker/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✓ | `README.md` 存在 |
| GOVERNANCE | MUST | ✗ | 模組目錄無 GOVERNANCE.md；HORUS-GOVERNANCE/C005/ 有 INDEX 但無標準 GOVERNANCE.md |
| DATA-FLOW | SHOULD | ✗ | 無 DATA-FLOW.md |
| DECISIONS | MUST | ⚠ | 模組目錄無；HORUS-GOVERNANCE/C005/ 有多份 ADR 但命名不一致 |
| EXCEPTIONS | SHOULD | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | OPTIONAL | ✓ | `docs/C005-CHANGELOG.md` 存在 |

**缺口說明**：缺少標準 GOVERNANCE.md 與 DATA-FLOW.md，判斷標準（DECISIONS）分散在治理層多份 ADR，無統一入口。

---

### C005-Decision-Mail-Phase7（子模組）

- **類型**：C
- **風險等級**：**HIGH**
- **位置**：`BASE-SERVICES/C005-Decision-Mail-Phase7/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✗ | 無 README.md |
| GOVERNANCE | MUST | ✗ | 無 GOVERNANCE.md |
| DATA-FLOW | SHOULD | ✗ | 無 DATA-FLOW.md |
| DECISIONS | MUST | ✗ | 無 DECISIONS.md |
| EXCEPTIONS | SHOULD | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | OPTIONAL | ✗ | 無 CHANGELOG.md |

**缺口說明**：模組目錄幾乎無文件，僅有 .gscript 連結與子目錄。高風險。

---

### C005-Eligibility（子模組）

- **類型**：C
- **風險等級**：**HIGH**
- **位置**：`BASE-SERVICES/C005-Eligibility/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✓ | `README.md` 存在 |
| GOVERNANCE | MUST | ✗ | 無 GOVERNANCE.md |
| DATA-FLOW | SHOULD | ✗ | 無 DATA-FLOW.md |
| DECISIONS | MUST | ✗ | 無 DECISIONS.md |
| EXCEPTIONS | SHOULD | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | OPTIONAL | ✗ | 無 CHANGELOG.md |

**缺口說明**：僅有 README，缺少 Checker 必要的 DECISIONS 與 GOVERNANCE。

---

## T002（Transform 類型）

### T002-Material-Schema-Design（主要模組）

- **類型**：T
- **風險等級**：**HIGH**
- **位置**：`BASE-SERVICES/T002-Material-Schema-Design/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✗ | 無 README.md |
| GOVERNANCE | MUST | ✗ | 模組目錄無；HORUS-GOVERNANCE/T002/ 有 INDEX 但無標準格式 |
| DATA-FLOW | MUST | ✗ | 無 DATA-FLOW.md |
| DECISIONS | SHOULD | ⚠ | 模組目錄無；治理層有多份但命名不一致 |
| EXCEPTIONS | OPTIONAL | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | SHOULD | ✗ | 無 CHANGELOG.md |

**缺口說明**：缺少所有 MUST 項目。docs/ 目錄內僅有 archived/ 子目錄。

---

### T002-原料庫-Material-DB（子模組）

- **類型**：T
- **風險等級**：**HIGH**
- **位置**：`BASE-SERVICES/T002-原料庫-Material-DB/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✓ | `README.md` 存在 |
| GOVERNANCE | MUST | ✗ | 無 GOVERNANCE.md |
| DATA-FLOW | MUST | ✗ | 無 DATA-FLOW.md |
| DECISIONS | SHOULD | ✗ | 無 DECISIONS.md |
| EXCEPTIONS | OPTIONAL | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | SHOULD | ✗ | 無 CHANGELOG.md |

**缺口說明**：僅有 README，缺少 Transform 必要的 GOVERNANCE 與 DATA-FLOW。

---

## T005（Transform 類型）

### T005-商品管理-Product-Mgmt（主要模組）

- **類型**：T
- **風險等級**：**MED**
- **位置**：`BASE-SERVICES/T005-商品管理-Product-Mgmt/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✓ | `README.md` 存在（12KB，較完整） |
| GOVERNANCE | MUST | ✗ | 模組目錄無；HORUS-GOVERNANCE/T005/ 有 INDEX |
| DATA-FLOW | MUST | ✗ | 無標準 DATA-FLOW.md；有 DATA-QUALITY-GUIDE.md 但非標準格式 |
| DECISIONS | SHOULD | ⚠ | 治理層有 T005_GOVERNANCE_DECISIONS_G2.md |
| EXCEPTIONS | OPTIONAL | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | SHOULD | ✗ | 無 CHANGELOG.md |

**缺口說明**：README 完整，但缺少 GOVERNANCE 與 DATA-FLOW。DECISIONS 存於治理層但未在模組目錄引用。

---

### T005-Product-Management-v3（子模組/可能 active）

- **類型**：T
- **風險等級**：**HIGH**
- **位置**：`BASE-SERVICES/T005-Product-Management-v3/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✗ | 無 README.md |
| GOVERNANCE | MUST | ✗ | 無 GOVERNANCE.md |
| DATA-FLOW | MUST | ✗ | 無 DATA-FLOW.md |
| DECISIONS | SHOULD | ✗ | 無 DECISIONS.md |
| EXCEPTIONS | OPTIONAL | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | SHOULD | ✗ | 無 CHANGELOG.md |

**缺口說明**：目錄幾乎為空，僅有 scripts/ 子目錄。可能已被 T005-商品管理-Product-Mgmt 取代，但未標記 DEPRECATED。

---

## T050（Transform 類型）

### T050-Platform-Product-Mapping

- **類型**：T
- **風險等級**：**LOW**
- **位置**：`BASE-SERVICES/T050-Platform-Product-Mapping/`

| Artifact | 要求 | 狀態 | 備註 |
|----------|------|------|------|
| README | MUST | ✓ | `README.md` 存在 |
| GOVERNANCE | MUST | ✓ | `_GOVERNANCE.md` 存在（命名略有差異） |
| DATA-FLOW | MUST | ⚠ | 無標準 DATA-FLOW.md；有 `docs/T050-A-Data-Entry-Specification.md` |
| DECISIONS | SHOULD | ⚠ | 無獨立 DECISIONS.md；governance/ 有 T050-A/B-GOVERNANCE.md 含決策 |
| EXCEPTIONS | OPTIONAL | ✗ | 無 EXCEPTIONS.md |
| CHANGELOG | SHOULD | ✗ | 無 CHANGELOG.md；有 `_status/FROZEN_v1.0` 標記版本 |

**缺口說明**：基本結構最完整。缺少標準 DATA-FLOW.md 與 CHANGELOG.md，但有替代文件可追溯。

---

## 掃描發現的邊界歧異

| 模組 | 歧異描述 | 標記 |
|------|----------|------|
| C005 | 有 3 個子目錄，不確定主從關係 | AMBIGUOUS |
| T002 | 有 2 個子目錄，功能邊界不清 | AMBIGUOUS |
| T005 | 有 6 個子目錄（4 個 DEPRECATED/ARCHIVE），2 個可能 active | AMBIGUOUS |
| T050 | 單一目錄，邊界清楚 | CLEAR |

---

## 命名歧異

| 發現 | 標準名稱 | 實際名稱 | 位置 |
|------|----------|----------|------|
| GOVERNANCE 命名 | GOVERNANCE.md | _GOVERNANCE.md | T050 |
| DECISIONS 分散 | DECISIONS.md | 多份 ADR-*.md | C005/T002 治理層 |
| INDEX 命名 | GOVERNANCE.md | *-GOVERNANCE-INDEX.md | 治理層各模組 |
