# C005 Phase 2 Readiness Checklist

> **Status**: READY FOR REVIEW
> **Version**: 1.0.0
> **Date**: 2026-01-23
> **Author**: Architect

---

## 1. Phase 2 目標

將「listing-eligible」從治理文件變成可計算資料，為 C005 決策級 / 策略級 KPI 鋪路。

---

## 2. Readiness Checklist

### 2.1 Eligibility Infrastructure

| Item | Status | Location |
|------|--------|----------|
| Eligibility Schema 定義 | ✅ READY | `HORUS-GOVERNANCE/C005/C005_LISTING_ELIGIBILITY_SCHEMA.md` |
| EligibilityReader.js | ✅ READY | `10-基礎服務層-BASE-SERVICES/C005-Eligibility/` |
| EligibilityAggregator.js | ✅ READY | `10-基礎服務層-BASE-SERVICES/C005-Eligibility/` |
| EligibilityView.js | ✅ READY | `10-基礎服務層-BASE-SERVICES/C005-Eligibility/` |

### 2.2 FactWriter Integration

| Item | Status | Notes |
|------|--------|-------|
| USE_ELIGIBILITY_FILTER flag | ✅ READY | 預設 `false`，不影響既有行為 |
| Eligibility View 整合點 | ✅ READY | 已預留，待 flag 啟用 |
| 既有聚合行為 | ✅ UNCHANGED | 母數 = 全商品 |

### 2.3 Mail Display

| Item | Status | Notes |
|------|--------|-------|
| 決策級上架率欄位 | ✅ READY | 顯示 "-"（Eligibility 未啟用） |
| 策略級上架率欄位 | ✅ READY | 顯示 "-"（Eligibility 未啟用） |
| Eligibility 狀態說明 | ✅ READY | 語意 gate 已加入 |
| 三層指標說明 | ✅ READY | 待啟用後顯示 |

---

## 3. 尚未啟用項目

| Item | Status | Blocker |
|------|--------|---------|
| KPI 實際計算 | ❌ NOT ENABLED | 待 Architect 核准 USE_ELIGIBILITY_FILTER = true |
| T005 資料來源 | ❌ NOT CONFIGURED | 待填入 SPREADSHEET_ID |
| ERP 資料來源 | ❌ NOT CONFIGURED | 待填入 SPREADSHEET_ID |
| MANUAL 覆寫 | ❌ PHASE 3 | 設計文件待撰寫 |

---

## 4. Architect Decision Required

### 4.1 預設 Eligibility 值

| Question | Recommended | Decision |
|----------|-------------|----------|
| 若無 eligibility 記錄，預設值？ | `eligible = true` | ⏳ PENDING |

**建議理由**：
- Phase 2 起點，避免誤排除商品
- 保守策略：先全納入，再逐步排除

### 4.2 MANUAL 覆寫

| Question | Recommended | Decision |
|----------|-------------|----------|
| 是否允許 MANUAL 覆寫 eligibility？ | `false`（Phase 3 再開） | ⏳ PENDING |

**建議理由**：
- 避免人工輸入造成資料不一致
- 先建立自動化規則，再開放人工例外

---

## 5. Stop Conditions 驗證

| Condition | Verified |
|-----------|----------|
| 不新增任何 trigger | ✅ |
| 不回填歷史資料 | ✅ |
| 不修改 T005 / ERP 結構 | ✅ |
| 不產生任何實際 KPI 數值 | ✅ |

---

## 6. 新增檔案清單

### Governance Documents
```
HORUS-GOVERNANCE/C005/
├─ C005_LISTING_ELIGIBILITY_SCHEMA.md  (NEW)
└─ C005_PHASE2_READINESS.md            (NEW)
```

### Code Modules
```
10-基礎服務層-BASE-SERVICES/C005-Eligibility/
├─ EligibilityReader.js      (NEW)
├─ EligibilityAggregator.js  (NEW)
└─ EligibilityView.js        (NEW)
```

### Modified Files
```
10-基礎服務層-BASE-SERVICES/R020-Price-Comparator/_clasp-observer-mail/
├─ C005_FactWriter.js   (v1.5.0 - 新增 USE_ELIGIBILITY_FILTER flag)
└─ C005_MailService.js  (v1.8.0 - 新增 Eligibility 語意 gate)
```

---

## 7. Next Steps (Phase 2 Activation)

1. **Architect 核准** Eligibility 預設值決策
2. **配置** T005 / ERP 資料來源 SPREADSHEET_ID
3. **測試** Eligibility View 輸出正確性
4. **設定** USE_ELIGIBILITY_FILTER = true
5. **驗證** Mail 顯示決策級/策略級 KPI

---

## 8. Related Documents

- `C005_LISTING_ELIGIBILITY_SCHEMA.md` - Eligibility 資料結構
- `C005_TOTAL_POPULATION_SNAPSHOT.md` - 母數定義
- `C005_SHOPEE_PLATFORM_DECISION.md` - 平台拆分決策
- `C005_MAIL_SEMANTIC_GUARDS.md` - Mail 語意守則

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-23 | Architect | Initial Phase 2 readiness assessment |
