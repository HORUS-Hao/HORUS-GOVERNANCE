# STASH-SPLIT-EXECUTION-GUIDE

## Purpose

本文件說明如何依 ADR-GOV-STASH-DECISION-2026-01-26 的 Split 決策，正確處理 stash 內容。

## Current Stash

```
stash@{0}: On main: pre-governance snapshots & audits (NOT DECIDED)
```

## Prerequisites

在執行任何 stash 操作前，必須滿足以下條件：

1. **INVENTORY-POLICY 已裁定** - 快照治理地位已明確
2. **T005 Gaps ADR 已審閱** - 11 項缺口處置已決定
3. **Architect 明確授權** - 不得自行決定 apply stash

## Split 分類與去向

| 檔案類型 | 識別 Pattern | 正確去向 |
|----------|--------------|----------|
| INVENTORY 快照 | `INVENTORY/DRIVE-TREE-SNAPSHOT*.md` | 依 INVENTORY-POLICY 裁定處置 |
| T005 審計文件 | `T005/AUDIT/*.md` | 取出後升級為正式 ADR 或封存 |
| ARCHIVE 封存檔 | `HORUS-DERIVED/_ARCHIVE/**` | 加入 `.gitignore`，不進 Git |

## Execution Steps (When Authorized)

```bash
# Step 1: 確認 stash 內容
git stash show -p stash@{0}

# Step 2: Apply stash（不刪除）
git stash apply stash@{0}

# Step 3: 依分類處理
# - INVENTORY: 依 POLICY 裁定
# - T005 Audit: 移至正式位置或標記
# - ARCHIVE: 加入 .gitignore

# Step 4: Commit 各分類（分開 commit）
# - 治理文件：governance: ...
# - .gitignore：chore: update .gitignore for archive exclusion

# Step 5: 確認處理完成後，刪除 stash
git stash drop stash@{0}
```

## Prohibitions

- **未完成 G2 前，不得清空 stash**
- **不得直接 `git stash pop`**（會自動刪除 stash）
- **不得將 ARCHIVE 檔案 commit 進治理主線**
- **不得在未授權情況下執行任何 stash 操作**

## Related Documents
- ADR-GOV-STASH-DECISION-2026-01-26.md
- POLICY/INVENTORY-POLICY.md
- T005/ADR-T005-GOVERNANCE-GAPS-2026-01-22.md
