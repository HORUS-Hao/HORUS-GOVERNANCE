# INVENTORY-POLICY

## Status
SKELETON - PENDING DECISION

## Purpose

定義 HORUS-GOVERNANCE 中 INVENTORY 快照的治理地位、保留規則與命名規範。

## Scope

- `INVENTORY/DRIVE-TREE-SNAPSHOT.latest.md`
- `INVENTORY/DRIVE-TREE-SNAPSHOT-<date>.md`
- 其他未來可能的系統狀態快照

## Open Questions

1. **快照是否為治理事實？**
   - 若是，應納入 Git 版控並遵循 commit 規範
   - 若否，應加入 `.gitignore` 或移至非治理區域

2. **歷史快照保留週期為何？**
   - 保留全部歷史？
   - 僅保留最近 N 天/週？
   - 僅保留 `.latest.md` 作為 SSOT？

3. **快照產生機制為何？**
   - 手動產生？
   - 自動化腳本？
   - 觸發條件為何？

4. **快照與其他治理文件的關係？**
   - 是否應被其他 ADR/GOV 文件引用？
   - 是否作為審計證據？

## Decision Owner

**Architect (豪哥)**

## Related Documents
- ADR-GOV-STASH-DECISION-2026-01-26.md
- SYS-000-HORUS-GOVERNANCE-CONSTITUTION.md
