# ADR-T002-COLLABORATION-PHASE1

**Type**: Governance Boundary Definition
**Status**: Approved
**Scope**: T002 only
**Implementation**: Not allowed
**Effective Date**: Pending Architect approval
**Author**: Claude Code
**Created**: 2026-01-13

---

## 一、Purpose

本 ADR 定義 T002 多人協作 Phase 1 的治理邊界。

本文件**不授權任何實作行為**。

---

## 二、Definitions

| 術語 | 定義 |
|------|------|
| T002 | 原料清洗系統（Material Schema Design） |
| T005 | 商品管理系統（Product Management）— Canonical Schema |
| Phase 1 | 治理準備階段（Governance Preparation） |
| Legacy Add-on | ADR-0001 生效前已存在之 Add-on |
| New Add-on | ADR-0001 生效後新建之 Add-on |

---

## 三、Rulings

### 3.1 T002 定位

| 裁定 | 說明 |
|------|------|
| T002 = **Derived / Shadow Layer** | T002 非 Canonical Schema |
| T002 ≠ 獨立模組 | T002 為 T005 的影子層 / 清洗層 |
| T005 = Canonical | T005 為事實主表，T002 為衍生層 |

### 3.2 依賴關係

| 裁定 | 說明 |
|------|------|
| T005 不依賴 T002 | T005 不持有 T002_ID，不參照 T002 資料 |
| T002 依賴 T005 | T002 持有 T005_UID 作為關聯欄位 |
| 表頭同步方向 | T002 表頭 IMPORTRANGE 對齊 T005（單向） |

### 3.3 HOLD 狀態延續

| 裁定 | 說明 |
|------|------|
| ADR-0001 仍有效 | T002 處於 HOLD 狀態，延續 ADR-0001 裁定 |
| 禁止事項維持 | 禁止 Migration、Refactoring、新增 schema 抽象層 |
| 解除條件 | 需 Architect 明確批准並更新 ADR |

### 3.4 Phase 1 範圍

| 允許 | 禁止 |
|------|------|
| 治理準備 | 任何實作 |
| 設計層定義 | 程式碼變更 |
| 治理文件產出 | Sheet / UI / Script 建立 |
| 關係掃描與盤點 | 欄位新增或修改 |

### 3.5 Add-on 裁定

| 類型 | 裁定 |
|------|------|
| **既有 Add-on（Legacy）** | **允許存在**，不修改、不刪除 |
| **新 Add-on** | **明確禁止**，不得建立 |
| T002-Material-Management | Legacy，維持現狀 |
| T005 現有 Add-on | Legacy，與 T002 Phase 1 無直接關聯 |

### 3.6 多人協作裁定

| 項目 | 裁定 |
|------|------|
| 設計層定義 | **僅允許** |
| 進入系統 | **禁止** |
| Change Log 設計 | 可作為設計文件，不可實作 |
| 編輯鎖定機制 | 可作為設計文件，不可實作 |
| Sheet Add-on 開發 | **禁止** |

---

## 四、Constraints

### 4.1 明確禁止事項

| # | 禁止事項 |
|---|----------|
| 1 | 修改任何 Add-on |
| 2 | 建立 Sheet / UI / Script |
| 3 | 調整 T002 / T005 結構或資料 |
| 4 | 預設 Phase 2 實作方向 |
| 5 | 提出「未來可實作建議」 |
| 6 | 任何程式碼變更 |

### 4.2 違反處置

任何違反本 ADR 裁定之行為：
- 立即停止
- 回報 Architect
- 不得自行判斷「例外情況」

### 4.3 AI / Agent 使用限制

在本 ADR 生效前與 Phase 1 階段內：

- 任何 AI 模型、Agent、Automation 工具（包含但不限於 Gemini、AGY / antigravity、Cursor Agent）
  - ❌ 不得被啟用於任何實作行為
  - ❌ 不得綁定至 Sheet、Script、Drive、Workflow
  - ❌ 不得產生任何具有 side-effect 的輸出

- AI / 模型僅可用於：
  - 治理文件草擬
  - 架構與設計層討論
  - 既有文件之分析與摘要

- 「選定模型」不構成「授權執行」。
  任一模型一旦執行實作行為，即視為違反本 ADR。

---

## 五、Evidence References

本 ADR 裁定基於以下治理證據：

| 附件 | 路徑 |
|------|------|
| T002/T005 關係證據 | `ADR/ATTACHMENTS/T002_T005_RELATION_EVIDENCE.md` |
| Add-on 治理脈絡 | `ADR/ATTACHMENTS/T002_T005_ADDON_GOVERNANCE_CONTEXT.md` |

### 5.1 關鍵引用摘要

#### 來自 T002_T005_RELATION_EVIDENCE.md

> T005 不依賴 T002 的 Canonical Key。相反地，T002 持有 `T005_UID` 作為關聯欄位。

> 設計文件建議「已轉入 T005」的 T002 記錄應被鎖定，但此機制尚未實作。

> 若 T002 僅開放備註 / note 欄位供編輯，T005 不會受影響。

#### 來自 T002_T005_ADDON_GOVERNANCE_CONTEXT.md

> T002 Add-on 治理分類: Legacy Add-on（治理前存在）

> 「現存 T005 Add-on 的存在，是否構成 T002 多人協作 Phase 1 必須立刻實作 Add-on 的理由？」— **否**

> T005 Add-on 為 Legacy（早於 ADR-0001 存在），T002 多人協作 Add-on 屬於新實作（尚未存在），ADR-0001 禁止新實作。

---

## 六、Phase Transition

### 6.1 進入 Phase 2 的必要條件

| # | 條件 |
|---|------|
| 1 | Architect 明確批准 |
| 2 | ADR-0001 狀態變更（從 B 階段進入 C 階段） |
| 3 | T005 schema 與 data 分離完成 |
| 4 | 本 ADR 狀態從 Draft 變更為 Approved |

### 6.2 Phase 2 不在本 ADR 範圍

本 ADR **不預設** Phase 2 內容。

Phase 2 需另行建立獨立 ADR。

---

## 七、Approval

| 項目 | 狀態 |
|------|------|
| 草稿建立 | 2026-01-13 |
| Architect 審閱 | Pending |
| 生效日期 | Pending approval |

---

## 八、Related Documents

| 文件 | 說明 |
|------|------|
| ADR-0001-T005-T002-B.md | T005 × T002 治理決策（B 階段） |
| STATE-ANCHOR-2025-12.md | 治理狀態錨點 |
| T002_COLLABORATION_FEASIBILITY_STUDY.md | 多人協作可行性設計（設計層，非實作） |

---

## Architect Approval

- Approved by: Architect
- Approval Date: 2026-01-13
- Notes: Phase 1 governance boundary finalized. Implementation explicitly prohibited.

---

*本 ADR 已核准生效*
*建立日期：2026-01-13*
*建立人：Claude Code*
