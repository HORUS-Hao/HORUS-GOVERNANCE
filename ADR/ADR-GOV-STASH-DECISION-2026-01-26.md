# ADR-GOV-STASH-DECISION-2026-01-26

## Status
ACCEPTED

## Context

HORUS-GOVERNANCE repo 於 SYS-000 生效後，存在一批未裁定的 modified/untracked 檔案。
為保護治理主線純度，已執行 `git stash push -u` 暫存，stash message 為：

> pre-governance snapshots & audits (NOT DECIDED)

Stash 內容包含三類檔案：
1. INVENTORY 快照（自動產出的系統狀態記錄）
2. T005 審計文件（揭露治理缺口的分析報告）
3. ARCHIVE 封存殘留（已封存模組的技術設定檔）

## Problem Statement

這批檔案處於「治理灰區」：
- 未經裁定，不應直接 commit 進治理主線
- 部分內容有潛在價值，不應直接丟棄
- 混合性質使得「整包處理」不合適

需要明確裁定：這批檔案應如何處置？

## Options Considered

### Option A｜Canonical（整包升級為治理事實）
- **結論**：不採用
- **理由**：
  - 混合性質，不符合單一裁定原則
  - T005 Audit 未經審閱，直接升級違反 SYS-000
  - ARCHIVE 檔案不應進入治理主線

### Option B｜Archived（整包封存）
- **結論**：不採用
- **理由**：
  - T005 Audit 有治理價值，不應直接封存
  - INVENTORY 快照有運維價值，需另行裁定

### Option C｜Split（拆解後治理）
- **結論**：採用
- **理由**：
  - 依性質分類處理，符合治理精神
  - 保留有價值內容的升級路徑
  - 明確隔離無治理意義的封存檔案

## Decision

採用 Option C｜Split（拆解後治理）

具體處置：

| 子集 | 處置方式 | 後續動作 |
|------|----------|----------|
| `INVENTORY/DRIVE-TREE-SNAPSHOT*.md` | 建立 `INVENTORY-POLICY` | 由 Architect 裁定快照治理地位 |
| `T005/AUDIT/T005-GOVERNANCE-ALIGNMENT-AUDIT-2026-01-22.md` | 提升為待審 ADR | 由 Architect 審閱後決定是否生效 |
| `HORUS-DERIVED/_ARCHIVE/**` | 加入 `.gitignore` | 保留於磁碟但不進入 Git |

## Consequences

### Positive
- 治理主線保持純淨（僅含已裁定文件）
- 有價值內容保留升級路徑
- 封存區明確隔離

### Negative
- 需要額外裁定動作（INVENTORY-POLICY、T005 Audit 審閱）
- Stash 需保留至拆解完成

### Risks
- 若長期不處理 stash，可能造成技術債
- INVENTORY 快照語意未定，可能影響後續運維

## Related Documents
- SYS-000-HORUS-GOVERNANCE-CONSTITUTION.md
- GOV-001-C005-STATUS.md
- GOV-003-T005-ELIGIBILITY-GATE.md
- POLICY/INVENTORY-POLICY.md (pending)
- T005/ADR-T005-GOVERNANCE-GAPS-2026-01-22.md (pending)

## Decision Date
2026-01-26

## Decision Owner
Architect (豪哥)
