# T005 Governance Decisions – Phase G2

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: FINAL / SEALED
> **Authority**: Architect
> **Input**: GOVERNANCE_REPAIR_BACKLOG_PHASE_G1.md

---

## Purpose

本文件為 T005 Backlog 8 項缺口的正式治理裁定。
所有裁定為 FINAL，後續工程依此執行。

---

## Decision Summary

| ID | Title | Risk | Decision | Action |
|----|-------|------|----------|--------|
| GR-T005-G1-001 | Canonical 24 欄未被 MODULE-REGISTRY 引用 | HIGH | CANONICAL_REQUIRED | G3 工程 |
| GR-T005-G1-002 | Main.gs 28 欄 vs Canonical 24 欄 | MEDIUM | MAIN_GS_SUBORDINATE | 標註 |
| GR-T005-G1-003 | MODULE-REGISTRY 未標 OUTDATED | LOW | ✅ RESOLVED | 已完成 |
| GR-T005-G1-004 | D005.md 寫入權限宣告錯誤 | MEDIUM | DOC_FIX_REQUIRED | G3 文件修正 |
| GR-T005-G1-005 | status enum 未定義 | MEDIUM | ENUM_DEFINE_REQUIRED | G3 工程 |
| GR-T005-G1-006 | UID 無鎖定機制 | HIGH | UID_LOCK_REQUIRED | G3 工程 |
| GR-T005-G1-007 | SSOT 指向多處 | LOW | TRACK_ONLY | 追蹤 |
| GR-T005-G1-008 | JSON Legacy Naming | LOW | TRACK_ONLY | 追蹤 |

---

## Detailed Decisions

### GR-T005-G1-001｜CANONICAL_REQUIRED

**裁定**: MODULE-REGISTRY 必須唯一引用 Canonical 24 欄

**依據**:
- Canonical Schema 已定錨於 `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md`
- MODULE-REGISTRY 作為模組入口，內容嚴重過時（8 欄 vs 24 欄）
- 新進開發者依據錯誤資訊開發將造成系統風險

**執行要求**:
- MODULE-REGISTRY/T005.md 保留 OUTDATED 標記
- 加入明確指向 Canonical Schema 的 pointer
- 不修改原有內容（保留歷史）

---

### GR-T005-G1-002｜MAIN_GS_SUBORDINATE

**裁定**: Main.gs 28 欄屬 runtime legacy，Canonical 24 欄為唯一權威

**依據**:
- 治理層以 Canonical Schema 為準
- Main.gs 的 4 欄差異為 runtime 實作細節
- 修改 Main.gs 需另起 Engineering Phase

**執行要求**:
- 不修改 Main.gs
- 治理文件標註「runtime 實作可能有差異，以 Canonical 為權威」
- 差異欄位列入未來 Engineering Phase backlog

---

### GR-T005-G1-003｜RESOLVED

**裁定**: ✅ 已於 G1 Phase 完成

**執行記錄**:
- 2026-01-23: MODULE-REGISTRY/T005.md 加入 OUTDATED HEADER BLOCK

---

### GR-T005-G1-004｜DOC_FIX_REQUIRED

**裁定**: D005.md 寫入權限宣告需修正

**依據**:
- D005.md 宣告 "D005 為 T005/T002 Schema 的唯一寫入者"
- 實際觀測：T005 GAS 執行所有寫入
- Architect 已裁定為「治理文件宣告錯誤」

**執行要求**:
- 修正 D005.md 的寫入權限描述
- 明確標示 T005 GAS 為實際寫入者
- 不影響 runtime 行為

---

### GR-T005-G1-005｜ENUM_DEFINE_REQUIRED

**裁定**: T005 status 欄位必須定義 enum 允許值

**依據**:
- status 欄位為自由文字，無驗證
- C005/T030 需基於 status 做商業邏輯判斷
- 缺乏定義導致上架率母數語義模糊

**執行要求**:
- 建立 `T005_STATUS_ENUM.md` 定義允許值
- 在 GAS 加入 readonly enum map（不改 Sheet）
- 不回寫或清理舊資料

**允許值定義**:
| Status | 語義 | 上架資格 |
|--------|------|---------|
| 正常銷售 | 正常可銷售商品 | YES |
| 停止銷售 | 暫停銷售 | NO |
| 庫存不足 | 庫存警示 | YES（風險標註） |
| 新品開發 | 開發中商品 | NO |
| 停產 | 已停產商品 | NO |

---

### GR-T005-G1-006｜UID_LOCK_REQUIRED

**裁定**: UID 必須為 Create-once / Immutable

**依據**:
- UID 為主鍵，下游模組（C005/R020/T030）依賴 UID 做 join
- 目前無鎖定機制，理論上可被修改
- UID 變更將造成資料孤兒

**執行要求**:
- UID 僅允許 Create（首次寫入）
- Update 流程若偵測 UID 變更 → throw governance error
- 不回寫舊資料
- 不修改 Sheet 結構

**Guard 實作**:
```javascript
// Governance Guard: UID immutability
if (existingUID && newUID !== existingUID) {
  throw new Error('[T005-GOVERNANCE] UID is immutable. Cannot change from ' + existingUID + ' to ' + newUID);
}
```

---

### GR-T005-G1-007｜TRACK_ONLY

**裁定**: SSOT 指向問題追蹤，暫不處理

**依據**:
- HORUS-GOVERNANCE 與 HORUS-FACTS 兩處 Schema 內容一致
- 影響範圍小，不影響 runtime
- 完整解決需定義三層架構（GOVERNANCE/FACTS/DERIVED）權責

**執行要求**:
- 列入長期 backlog
- 不影響當前 Phase

---

### GR-T005-G1-008｜TRACK_ONLY

**裁定**: JSON Legacy Naming 追蹤，暫不處理

**依據**:
- 修改 JSON field naming 為 breaking change
- 需審計所有 JSON 消費者
- 當前無急迫性

**執行要求**:
- 列入長期 backlog
- 不影響當前 Phase

---

## Governance Constraints

本裁定執行時必須遵守：

| 禁止事項 | 原因 |
|---------|------|
| 改 Sheet header | 影響所有消費者 |
| 洗資料 | 無法回滾 |
| 重構流程 | 超出 scope |
| 非必要 API 串接 | 增加依賴 |

---

## Changelog

| Date | Version | Change | Authority |
|------|---------|--------|-----------|
| 2026-01-23 | v2026-01.1 | Initial G2 decisions | Architect |

---

**END OF T005_GOVERNANCE_DECISIONS_G2.md**
