# PLATFORM MATURITY MATRIX (C005 Scope)

> 裁定日期：2026-01-25
> 裁定者：Architect
> 狀態：ACTIVE

| Platform | P0 Module | Execution Mode | Trigger | Current Phase | Writes D005 Today | Notes |
|----------|-----------|----------------|---------|---------------|-------------------|-------|
| MOMO     | P0-Momo-Observation-Test | Manual (runOnce) | ❌ | Observation | ✅ | 人工執行產生 1266 筆 |
| PCHOME   | P0-PCHOME-Observation-Test | Auto (chunked) | ✅ | Semi-Prod | ✅ | startDaily 建立續跑 Trigger |
| SHOPEE   | P0-SHOPEE-Observation-Prod | Manual | ❌ | Observation | ❌ | 今日未執行 |
| YAHOO    | P0-YAHOO-Observation-Prod | Manual | ❌ | Phase-2 Pending | ❌ | README 標示待部署 |

---

## Definitions

| Phase | 說明 |
|-------|------|
| **Observation** | 僅代表平台存在率（非真實上架），手動執行 |
| **Semi-Prod** | 有自動續跑機制，但非全面治理（無每日固定 Trigger） |
| **Prod** | 有每日 Trigger + 治理文件 + 回歸驗證 |

---

## Evidence (2026-01-25)

### C005_FactWriter Log
```
[FactWriter] D005 今日筆數: 1932
[FactWriter] 聚合: MOMO → 1266/1266 (100%)
[FactWriter] 聚合: PCHOME → 525/666 (79%)
[FactWriter] 聚合完成，平台數: 2
```

### 缺席平台
- SHOPEE_KATAI / SHOPEE_GUSENSE：P0 未執行
- YAHOO：P0 未執行

---

## Architect Decision (Next Phase)

1. **C005**：繼續 Observation Guard 驗證（已完成）
2. **P0 平台**：
   - 不立即補 Trigger
   - 待 n8n / Scheduler 統一設計後一次處理
3. **禁止**平台各自私加 Trigger，避免治理破裂

---

## Related Documents

- `HORUS-GOVERNANCE/C005/C005-PHASE-D-2-DECISION-CONTRACT.md`
- `10-基礎服務層-BASE-SERVICES/P0-*/README.md`
- `10-基礎服務層-BASE-SERVICES/D005-Listing-Writer/README.md`
