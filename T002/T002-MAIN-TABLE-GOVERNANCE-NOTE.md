# T002-1.商品主表 治理備註

> **Status**: ACTIVE
> **Date**: 2026-01-25
> **Scope**: T002-1.商品主表 Schema 補充說明

---

## 重要治理聲明

### 平台上架策略

**平台是否上架不由本表定義。**

請參考：`T002-WK-平台建檔名稱`

### 商品狀態與 Eligibility

本表的「商品狀態」欄位定義商品生命週期，但：

- **不直接決定**平台上架資格
- 需經由 `T005_LISTING_ELIGIBILITY` 映射
- 詳見 `ADR-T005-LISTING-ELIGIBILITY-SOURCE.md`

---

## T002-1.商品主表 欄位概覽

| Col | 欄位 | 說明 |
|-----|------|------|
| 1-21 | 業務欄位 | 商品身分、規格、成本 |
| 22 | 同步狀態 | PENDING / READY / BLOCKED / SYNCED |
| 23 | 同步原因 | 阻斷理由（若有） |

---

## 禁止事項

❌ 不可在本表新增「是否上 MOMO」「是否上 Shopee」等欄位

❌ 不可在本表新增「平台上架狀態」欄位

❌ 平台策略僅能在 `T002-WK-平台建檔名稱` 維護

---

## Related Documents

| 文件 | 說明 |
|------|------|
| `T002-WK-PLATFORM-STRATEGY-CONTRACT.md` | 平台策略治理契約 |
| `ADR-T005-LISTING-ELIGIBILITY-SOURCE.md` | Eligibility 來源定義 |
| `00-Config.js` | T002 欄位配置 |

---

**END OF T002-MAIN-TABLE-GOVERNANCE-NOTE.md**
