# D005 Platform Ingestion Status

> **Canonical Reference** for platform data ingestion status in D005 Listing_History

## Platform Status Table

| Platform | Ingestion Status | FACT Writable | C005 Participation | Notes |
|----------|------------------|---------------|--------------------| ------|
| **MOMO** | FACT_READY | YES | YES | 已納入 D005 Listing_History |
| **PCHOME** | FACT_READY | YES | YES | 已納入 D005 Listing_History |
| **YAHOO** | NOT_INGESTED | NO | NO | 尚未接入 FACT，未參與計算 |
| **SHOPEE_KATAI** | OBSERVATION | NO | NO | Observation 階段（ADR-C005-P0-SHOPEE） |
| **SHOPEE_GUSENSE** | OBSERVATION | NO | NO | Observation 階段（ADR-C005-P0-SHOPEE） |

## Status Definitions

### FACT_READY
- 平台已完成 Ingestion Pipeline
- 資料已寫入 D005 Listing_History
- C005 Observer Mail 納入計算
- 上架率統計包含此平台

### NOT_INGESTED
- 平台尚未建立 Ingestion Pipeline
- 無任何 FACT 資料存在
- C005 僅在「平台接入狀態」區塊揭露
- **不參與任何數值計算**

### OBSERVATION
- 平台處於觀測階段
- 存在已知的 Schema Mismatch 或技術障礙
- 需要 ADR 文件記錄問題與解決方案
- **不參與任何數值計算**

## Governance Rules

### C005 消費規則

1. **C005 僅消費 D005 FACT**
   - C005 不產生 FACT，只讀取 D005 Listing_History
   - Observer Mail 的上架率來自 D005 聚合結果

2. **Ingestion 未完成 ≠ 平台無資料**
   - 平台可能有原始資料，但尚未 normalize 寫入 D005
   - NOT_INGESTED 僅表示 D005 無該平台 FACT

3. **禁止捏造 FACT**
   - 禁止為 NOT_INGESTED/OBSERVATION 平台生成假 FACT
   - Observer Mail 誠實揭露各平台接入狀態

### 新增平台流程

1. 建立 `D005-{PLATFORM}-Listing-Ingestion` 模組
2. 定義 Schema（raw + normalized）
3. 定義 Field Mapping
4. 實作 Ingestion Pipeline
5. 驗證資料品質
6. 更新本文件狀態為 FACT_READY
7. C005 自動納入計算

## Related Documents

- [D005-YAHOO-Listing-Ingestion](../10-基礎服務層-BASE-SERVICES/D005-YAHOO-Listing-Ingestion/README.md)
- [D005-SHOPEE-Listing-Ingestion](../10-基礎服務層-BASE-SERVICES/D005-SHOPEE-Listing-Ingestion/README.md)
- ADR-C005-P0-SHOPEE-D005-SCHEMA-MISMATCH
- C005_SHOPEE_PLATFORM_DECISION.md

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-26 | Initial creation | Claude Code |
| 2026-01-26 | MOMO/PCHOME marked FACT_READY | Claude Code |
| 2026-01-26 | YAHOO marked NOT_INGESTED | Claude Code |
| 2026-01-26 | SHOPEE marked OBSERVATION | Claude Code |

---

Governed by: HORUS-PDM
Last Updated: 2026-01-26
