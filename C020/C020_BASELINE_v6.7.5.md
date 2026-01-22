# C020 Baseline v6.7.5

## Status
- **Type**: Read-Only Viewer
- **Stability**: STABLE / FROZEN
- **Date**: 2026-01-15
- **Git Tag**: `c020-v6.7.5-stable`
- **Git Commit**: `ee9b68a`
- **GAS Deployment**: @122

## Key Decisions

### JSON Stringify 穩定性修復
- **問題**: `google.script.run` 回傳大量資料時會被 GAS 自動截斷
- **解法**: 後端使用 `JSON.stringify()` 回傳字串，前端 `JSON.parse()` 還原
- **性質**: 穩定性修復，非功能變更

### API Response Contract
```json
{
  "success": true,
  "count": number,
  "data": [...]
}
```

### Canonical Field Alignment
- T005 Canonical Schema v1.0.1 enforced
- Canonical Fields: 品牌 / 商品型號 / 商品名稱 / 商品大類 / 商品中類 / 商品小類
- `category_mid` = 商品中類（API internal key, documented）
- 前端不得自行假設 Canonical 名稱，必須依照 API 回傳

### Authentication
- No OTP (Read-only, Google Login only)

## Data Source

### 讀取來源
- **T005-1.商品主表**: 商品基本資訊（UID, 品牌, 型號, 名稱, 分類, 狀態）
- **T005-3.商品功能規格表**: 承重(KG)、尺寸、VESA規格
- **ERP**: Optional / Read-only（庫存數量，非即時）

### Data Boundary
- `商品大類 = '壁掛架'`（硬條件，不可繞過）

### 明確不讀取
- ❌ D001（訂單）
- ❌ D002（出貨）
- ❌ D005（SKU mapping）

## Verified Capabilities
- **Filter**: 品牌 / 商品大類 / 商品中類 / 商品小類 / 商品狀態 / ERP庫存 / 電視尺寸
- **Search**: 型號 / 名稱 / 品牌（關鍵字即時搜尋）
- **Stats**: total / 現貨 / 停產（統計卡片快速篩選，數字一致）
- **Compare**: 最多 5 件商品並排比較
- **UI**: Full width layout, R020-style filters, field settings modal, responsive design
- **Detail**: 單商品詳情 Modal

## Explicit Non-Goals
- ❌ No write operations
- ❌ No workflow
- ❌ No OTP authentication
- ❌ No user role logic yet
- ❌ 非即時庫存系統（ERP 為快照，非 live data）

## Technical Notes

### JSON Stringify 傳輸
- GAS `google.script.run` 大物件回傳被截斷問題
- 改用 JSON string 傳輸，前端 parse 還原
- 此為已知 GAS 限制的 workaround

### Canonical / Legacy 欄位對齊
- `category_mid` = 商品中類（API 輸出 key）
- `category_main` = 商品大類
- `category_sub` = 商品小類
- v6.7.5 修正 `populateCategorySelect()` 的 fieldName 參數錯誤

### TV Size Filter 修正
- v6.7.5 修正邏輯：只顯示有尺寸規格且符合範圍的商品
- 支援格式：`32-65`、`32~65`、`32"-65"`、`32～65`

### Known Constraints
- 首次載入需抓完整資料 → 較慢（已知限制）
- 未實作 Cache / Lazy Load（留待下一階段）
- 吋↔公分自動換算（bidirectional sync）

### UI Features
- Field settings: 可拖曳調整欄位順序，勾選控制顯示/隱藏
- Loading overlay: API 呼叫時顯示載入動畫
- Compare cards: 無圖片時保留圖片區域大小

## Next Phase
- Introduce `C020_USER_ACCESS` (whitelist + role)
- Column-level visibility control
- Export functionality
- 效能優化（Cache / 延遲載入）
- UX 微調（非 baseline 範圍）

---

## Final Ruling: ERP Inventory Date (2026-01-17)

### Status

| Item | Value |
|------|-------|
| C020 Version | v5.12.0 → v6.7.5 (current baseline) |
| Deployment Status | **DEPLOYED / CORRECT** |
| Behavior | **FAIL-CLOSED (Snapshot-Fact)** |
| ERP Date Display | **N/A** (Upstream not provided) |
| Verdict | **NOT A BUG** |

### Architect Decision

- **Option A Adopted**: Maintain current state (honest display of "no date")
- **Option B Deferred**: ERP Snapshot Metadata as future independent project
- **Option C Rejected**: Client-side fallback permanently forbidden

### Mandatory Prohibitions (Permanent)

The following are **permanently forbidden** in C020:

| Prohibition | Rationale |
|-------------|-----------|
| `now()` / `new Date()` as ERP date | Fabricates non-existent data |
| `getLastUpdated()` / `lastModified` | File metadata ≠ data currency |
| Filename date parsing | Unreliable, violates governance |
| Secondary source injection | Breaks single-source-of-truth |
| Any UI "prettification" of missing date | Violates data honesty principle |
| `clasp` introduction | Requires separate Phase task and ruling |

### Reference

- `ERP_SCHEMA_CONTRACT.md` — Explicit Non-Fields section
- `ERP_INVENTORY_DATE_OPTIONS.md` — Full options analysis

---

## Workspace Governance (Engineering Isolation)

### Canonical Workspace

```
C:\HORUS-GIT-TEMP\HORUS-PDM-Claude-Code = Canonical Git Workspace
```

- **Status**: Authoritative for all git operations
- **Allowed**: commit, push, deploy, clasp (if authorized)

### Reference-Only Location

```
G:\我的雲端硬碟\...\C020-Wallmount-Checker = Reference-Only
```

- **Status**: DO NOT use for deploy or git operations
- **Reason**: Google Drive sync causes race conditions, corrupts git clean state

### Isolation Rationale

| Risk | Mitigation |
|------|------------|
| Drive sync race condition | Use local workspace only |
| Git state corruption | Never `git` from Drive path |
| Deployment mismatch | Single canonical source |

---

**FROZEN**: This baseline is immutable. All new features must branch from tag `c020-v6.7.5-stable`.
