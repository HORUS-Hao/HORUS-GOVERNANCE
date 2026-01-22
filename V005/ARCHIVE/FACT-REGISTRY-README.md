# FACT Registry

**建立日期**: 2026-01-07
**建立人**: Claude Code
**核准人**: Architect

---

## Definition (定義)

FACT 層為 HORUS-PDM 系統的「單一事實來源」(Single Source of Truth)。

所有 FACT 資料必須：
- 來自真實業務事件
- 可追溯至原始來源
- 不可推斷、補齊、合成

---

## Write Policy (寫入政策)

| 規則 | 說明 |
|------|------|
| 僅寫入事實 | 禁止寫入推斷值、預估值、合成值 |
| 來源明確 | 每筆資料必須有明確來源 (平台 API / 人工輸入 / 系統生成) |
| 時間戳記 | 所有寫入必須記錄時間 |
| 不可覆蓋 | 歷史資料不可覆蓋，僅能新增版本 |

---

## Registered FACT Sources (已註冊 FACT 來源)

| Source | Sheet/Table | Owner Module | Description |
|--------|-------------|--------------|-------------|
| T005 | T005_Products | D005 | 商品庫主表 (Canonical Schema) |
| T002 | T002_Materials | D005 | 物料管理表 |
| S005_QUOTES | S005_QUOTES | S005 | 報價單資料庫 |
| P0_* | 各平台觀測表 | P0 Series | 平台價格觀測資料 |

---

## Governance Rules (治理規則)

1. **寫入權限限制**: 僅允許指定模組寫入 FACT
2. **Schema 凍結**: FACT 結構變更需 Architect 核准
3. **禁止回寫**: DERIVED 層不得回寫 FACT
4. **稽核追蹤**: 所有寫入操作需可追蹤

---

## evidence/ 資料夾

此資料夾用於存放：
- 原始資料截圖
- API 回應快照
- 人工驗證記錄

---

## Related Documents

- `_GOVERNANCE/MODULE-REGISTRY/D005.md` - FACT 資料中樞
- `_GOVERNANCE/MODULE-REGISTRY/T005.md` - 商品庫主表
- `HORUS-GOVERNANCE/LAYER_DEFINITION.md` - 層級定義

---

*此文件為 FACT 層治理規範，修改需 Architect 核准*
