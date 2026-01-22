# RUL-0001｜MCP 治理提醒規則（只讀）

Status: **ACTIVE**
Type: **Reminder (Read-Only)**
Effective Date: 2026-01-01
Authority: ADR-0001

> 本規則僅用於治理提醒，不涉及任何技術實作。
> 本規則不執行任何阻擋、不觸發任何自動化。

---

## Purpose

當任何人（包含 AI Agent）提議推進 MCP / T005 相關行為時，
**必須先套用本規則進行自我檢查**，再決定是否需要新 ADR。

---

## Trigger Conditions

當討論內容包含以下關鍵字或意圖時，觸發本規則：

| 觸發詞 | 類型 |
|--------|------|
| 啟動 MCP Server | 技術行為 |
| 連接 T005 | 技術行為 |
| 讀取/寫入 T005 資料 | 技術行為 |
| 建立 RUL（非只讀） | 治理行為 |
| 建立 Skill | 技術行為 |
| 設定 OAuth / SSE | 技術行為 |
| 進入 C 階段 | 階段變更 |
| 修改 T005 Schema | Schema 變更 |

---

## Required Actions (Self-Check)

當觸發條件成立時，執行以下步驟：

### Step 1: 查詢 ADR-0001

閱讀 `_GOVERNANCE/ADR/ADR-0001-T005-T002-B.md`

確認當前階段（B / C）

### Step 2: 判斷是否允許

| 當前階段 | 提議行為 | 判斷 |
|----------|----------|------|
| B | 任何技術推進 | ❌ 不允許 |
| B | 新增只讀提醒規則 | ✅ 允許（需 Architect 批准） |
| B | 階段變更討論 | ⚠️ 需先建立新 ADR |
| C | 技術實作 | ✅ 允許（依 ADR 範圍） |

### Step 3: 回應模板

若判斷為「不允許」，使用以下回應：

```
根據 ADR-0001，目前 MCP 處於 B 階段（Governance Only）。
該行為目前不被允許。

如需推進，請先：
1. 確認 Phase Transition Criteria 是否滿足
2. 由 Architect 建立新 ADR
3. 待新 ADR 生效後再執行
```

---

## What This Rule Does NOT Do

- ❌ 不執行任何程式碼
- ❌ 不阻擋任何操作
- ❌ 不連接任何系統
- ❌ 不自動化任何流程

本規則純粹是「提醒機制」，由執行者自行遵守。

---

## Governance Chain

```
RUL-0001 (本規則)
    ↓ 依據
ADR-0001 (權威決策)
    ↓ 定義
Phase B Constraints (行為約束)
```

---

## Examples

### Example 1: 提議啟動 MCP Server

```
提議：「我們來啟動 MCP Server 測試一下」

套用 RUL-0001：
1. 查詢 ADR-0001 → 當前為 B 階段
2. 判斷 → 啟動 MCP Server 屬於技術行為 → 不允許
3. 回應 → 「根據 ADR-0001，目前不被允許...」
```

### Example 2: 討論進入 C 階段

```
提議：「T005 schema 已經分離了，可以進 C 階段嗎？」

套用 RUL-0001：
1. 查詢 ADR-0001 → 確認 Phase Transition Criteria
2. 判斷 → 需要 Architect 評估並建立新 ADR
3. 回應 → 「請 Architect 確認條件是否滿足，並建立階段變更 ADR」
```

### Example 3: 新增只讀提醒規則

```
提議：「新增一個提醒規則來檢查 Schema 變更」

套用 RUL-0001：
1. 查詢 ADR-0001 → 當前為 B 階段
2. 判斷 → 只讀提醒規則 → 允許（需 Architect 批准）
3. 回應 → 「可以進行，請取得 Architect 批准」
```

---

## References

- ADR-0001: `_GOVERNANCE/ADR/ADR-0001-T005-T002-B.md`
- RUL Directory: `_GOVERNANCE/RUL/`

---

*Created: 2026-01-01*
*Author: Architect*
