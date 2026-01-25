# C005 Phase 2 Eligibility Implementation

> **Status**: IMPLEMENTED
> **Date**: 2026-01-25
> **Architect**: Claude Code
> **Commit**: 2e8bc93

---

## 1. Summary

Phase 2 已啟用：C005 現在讀取 T002-WK-平台建檔名稱 作為「平台上架意圖」，產出 Derived Eligibility 判斷。

---

## 2. Implementation Details

### 2.1 Two-Layer Decision Model

| Layer | Source | Role |
|-------|--------|------|
| Layer 1 | T005.商品狀態 | Master Gate（總開關） |
| Layer 2 | T002-WK.平台建檔名稱 | Platform Strategy（平台意圖） |

### 2.2 Eligibility Logic (硬編碼)

```
Step 1｜Master Gate（總開關）
if T005.商品狀態 NOT IN ["正常銷售"]
→ 全平台 isEligible = false
→ 不再讀 WK

Step 2｜Platform Strategy Gate（僅在 Step 1 通過時）
for each platform in WK:
  if WK.<平台>建檔名稱 IS NOT EMPTY
     → isEligible[platform] = true
  else
     → isEligible[platform] = false
```

### 2.3 Files Modified/Created

| File | Change |
|------|--------|
| `EligibilityService.js` | **NEW** - 核心 Eligibility 計算服務 |
| `Test-EligibilityService.js` | **NEW** - 驗證測試 |
| `Utils.js` | **MODIFIED** - v3.3.0, 整合 EligibilityService (Step 3.6) |

### 2.4 Output Structure

每個 product 現在包含：

```javascript
{
  uid: "...",
  status: "正常銷售",
  // ... 其他欄位 ...

  // Phase 2 新增
  masterGatePassed: true,
  eligibility: {
    MOMO: true,
    PCHOME: false,
    YAHOO: true,
    SHOPEE: false,
    COUPANG: false
  }
}
```

---

## 3. Constraints Enforced

| Constraint | Status |
|------------|--------|
| ❌ 不修改 T002 主表 | ✅ Compliant |
| ❌ 不修改 T005 任何欄位 | ✅ Compliant |
| ❌ 不將 Eligibility 寫回任何 Sheet | ✅ Compliant |
| ✅ WK 僅以 Read-Only 存取 | ✅ Compliant |
| ✅ Eligibility 僅存在於 Runtime/Output | ✅ Compliant |

---

## 4. Platform List (Centralized)

平台清單集中定義於 `EligibilityService.js`:

```javascript
var ELIGIBILITY_PLATFORMS = Object.freeze([
  'MOMO',
  'PCHOME',
  'YAHOO',
  'SHOPEE',
  'COUPANG'
]);
```

**禁止**：不得在 C005 其他地方硬編碼平台清單。

---

## 5. Safe Defaults

| Scenario | Eligibility Result |
|----------|-------------------|
| T005.商品狀態 ≠ "正常銷售" | 全平台 false |
| WK 不存在 | 全平台 false |
| WK 無該 UID | 全平台 false |
| WK 讀取失敗 | 全平台 false |
| EligibilityService 未載入 | 全平台 false |

---

## 6. Verification Tests

執行 `runAllEligibilityTests()` 驗證：

| Test | Description | Expected |
|------|-------------|----------|
| testEligibility_Discontinued | T005=停產 | 全平台 false |
| testEligibility_PartialWK | T005=正常銷售 + 部分 WK | 有名稱=true, 無名稱=false |
| testEligibility_NoWKData | WK 無該 UID | Master Gate 通過, 全平台 false |
| testEligibility_BatchPerformance | 批次計算 100 筆 | 統計正確 |

---

## 7. Related Documents

| Document | Description |
|----------|-------------|
| `T002-WK-PLATFORM-STRATEGY-CONTRACT.md` | 平台策略治理契約 |
| `ADR-T005-LISTING-ELIGIBILITY-SOURCE.md` | Eligibility 來源定義 |
| `T005_Status_Enum.js` | T005 狀態枚舉定義 |

---

## 8. Next Steps

- **Observe**: 觀察人工填寫 WK 行為（2-4 週）
- **Pending**: Phase 3 啟用條件待定

---

**END OF C005-PHASE2-ELIGIBILITY-IMPLEMENTATION.md**
