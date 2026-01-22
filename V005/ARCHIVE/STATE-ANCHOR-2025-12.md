# HORUS-PDM Governance State Anchor

**Document ID:** STATE-ANCHOR-2025-12
**Effective Date:** 2025-12-31
**Status:** ACTIVE
**Authority:** Architect (豪哥)

---

## 1. Frozen States (不可更動)

### 1.1 T005 Canonical Schema v1.0

| Item | Status | Details |
|------|--------|---------|
| Schema Definition | **FROZEN** | 19 sheets, 134 headers migrated |
| Runtime | **ACTIVE** | Canonical names enforced |
| Governance Commit | `20459e6` | Branch: `refactor/split-phase1` |
| Git Tag | `t005-schema-phase5-complete` | Immutable anchor |

**Prohibited Actions:**
- Modify schema definition
- Add/remove/rename fields
- Refactor legacy code
- Clean up old versions
- Any "quick fix"

### 1.2 Task A (Governance Push)

| Item | Status |
|------|--------|
| Commit | `20459e6` |
| Branch | `refactor/split-phase1` |
| Push | **COMPLETED** |

**No further action required.**

### 1.3 T002 Migration

| Item | Status |
|------|--------|
| Decision | **HOLD** |
| Legacy References | ~98 occurrences (6 files) |
| Action Allowed | None |

**Prohibited Actions:**
- Migration work
- Refactoring
- Legacy reference fixes
- New branch creation
- Workarounds or fallbacks

**Only Allowed:** Acknowledge HOLD status exists.

### 1.4 T002 Schema 定位補充（Governance Clarification）

#### 模組定位

| Item | Definition |
|------|------------|
| T002 | **非獨立模組** |
| 角色 | T005 的影子層 / 清洗層 |
| 關係 | T005 = Canonical（事實主表），T002 = 衍生層 |

#### 表頭設計選擇

T002 表頭維持 **IMPORTRANGE 對齊 T005**，此為刻意治理設計。

**設計目的：**
- 視覺一致：人工操作時欄位名稱與 T005 同步
- 降低人為欄位錯誤：避免手動維護造成的不一致
- 防止雙 schema 漂移：單一事實來源（T005）

#### 明確聲明

| 聲明 | 說明 |
|------|------|
| 設計性質 | **刻意治理設計** |
| 非技術債 | 此為正式架構選擇，非待修復項目 |
| 非暫時方案 | 長期有效，直到 Architect 另行決策 |

#### 未來規劃

- 完整 Schema 獨立（Level C）將由 Architect 另行啟動
- 當前階段不做任何 schema registry / migration 設計
- T002 定位為：「為了讓人不犯錯而存在的影子表，不是工程展示品」

#### 禁止事項（T002 相關）

- ❌ 不得將 T002 表頭改為靜態
- ❌ 不得優化成「更乾淨的架構」
- ❌ 不得新增任何 schema 抽象層
- ❌ 不得進行「為了以後更好」的設計

---

## 2. Protected Stash Entries (不可刪除)

The following stash entries are governance or structural anchors:

| Stash # | Description | Reason |
|---------|-------------|--------|
| `stash@{8}` | feat(governance): 跨模組治理檢查 | Governance anchor |
| `stash@{19}` | T030 fix: v3.9.3 | Fix anchor |
| `stash@{21}` | C020 v5.6.7 欄位對齊 | Field alignment anchor |
| `stash@{22}` | C020 v5.6.7 欄位對齊 | Field alignment anchor |
| `stash@{23}` | C020 v5.6.7 欄位對齊 | Field alignment anchor |

**Prohibited Actions on Protected Stashes:**
- `git stash drop`
- `git stash pop`
- `git stash apply`

**Status:** Mark as preserved, do not touch.

---

## 3. Allowed vs Prohibited Behaviors

### 3.1 Currently Allowed

| Action | Scope |
|--------|-------|
| View | Any file, branch, stash |
| Inventory | List and document status |
| Mark/Label | Document state in governance files |
| Report | Status updates to Architect |
| Create governance docs | `_GOVERNANCE/` directory only |

### 3.2 Strictly Prohibited

| Action | Reason |
|--------|--------|
| `git stash apply/pop/drop` | Governance period |
| Branch cleanup/delete | Requires dedicated session |
| Migration/refactor | HOLD status |
| Code modification | Governance-only phase |
| "Quick fix" of any kind | Introduces uncertainty |
| Self-judgment on ambiguous cases | Must report to Architect |

---

## 4. Branch Status Reference

### 4.1 Protected Branches

| Branch | Status |
|--------|--------|
| `refactor/split-phase1` | Current HEAD, governance baseline |
| `main` | Production |

### 4.2 HOLD Branches (Do Not Touch)

| Branch | Reason |
|--------|--------|
| `feature/t002-material-management` | T002 HOLD |
| `feature/t002-material-db` | T002 HOLD (local only) |

### 4.3 Pending Cleanup (Future Session)

| Category | Count | Action |
|----------|-------|--------|
| `backup/*` | 3 | Deferred cleanup |
| Legacy `feature/*` | ~15 | Requires Architect approval |
| `claude/*` (remote) | 2 | Auto-generated, low priority |

---

## 5. Session Management

Any cleanup or modification requires:

1. **Explicit Architect instruction**
2. **Dedicated Session** with clear scope
3. **Completion confirmation** before next phase

Current phase: **Governance Documentation (Session 1)**

---

## 6. Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-31 | Initial anchor document created | Claude (赤兔馬) |
| 2025-12-31 | Added T002 Schema Governance Clarification (Section 1.4) | Claude (赤兔馬) |

---

## 7. Acknowledgment

This document serves as the authoritative state anchor for HORUS-PDM governance period.

Any deviation requires explicit Architect approval.

**Last Updated:** 2025-12-31 23:30 (Asia/Taipei)
