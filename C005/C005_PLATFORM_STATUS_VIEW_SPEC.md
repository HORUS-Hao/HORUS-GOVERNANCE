# C005 Platform Status View Specification

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: ACTIVE
> **Authority**: Architect
> **Purpose**: 定義 C005 Platform Status View 的欄位與顯示規則

---

## 1. Overview

本文件定義 C005 Platform Status View 的最小可用欄位。
View 為 Listing_History 的衍生視圖，用於人工查閱平台狀態。

---

## 2. Required Columns

| Column | Header | Type | Source | Description |
|--------|--------|------|--------|-------------|
| A | Platform | string | Listing_History.platform_code | 平台代碼 |
| B | Platform Name | string | Listing_History.platform_name | 平台名稱 |
| C | FACT Date | date | Listing_History.fact_date | 資料日期 |
| D | Total Products | number | Listing_History.total_products | 總商品數 |
| E | Listed Count | number | Listing_History.listed_count | 已上架數 |
| F | Unlisted Count | number | Listing_History.unlisted_count | 未上架數 |
| G | Listing Rate | percentage | Listing_History.listing_rate | 上架率 |
| H | Is Today | boolean | calculated | 是否為今日資料 |
| I | Status | enum | calculated | OK / STALE / NO_DATA |

---

## 3. Status Calculation Rules

### 3.1 Is Today (Column H)

```javascript
// Asia/Taipei timezone
var today = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
var isToday = (factDate === today);
```

### 3.2 Status (Column I)

| Condition | Status | Color |
|-----------|--------|-------|
| `factDate == today` | OK | GREEN |
| `factDate < today` | STALE | YELLOW |
| No record | NO_DATA | RED |

---

## 4. Display Format

### 4.1 Today Highlight

| Is Today | Row Style |
|----------|-----------|
| TRUE | 綠色背景 (#e8f5e9) |
| FALSE | 黃色背景 (#fff3e0) |

### 4.2 Date Format

```
FACT Date: yyyy-MM-dd
```

### 4.3 Rate Format

```
Listing Rate: 56% (1559/2790)
```

---

## 5. View Location Options

| Location | Purpose | Implementation |
|----------|---------|----------------|
| Listing_History Sheet (new tab) | 與 FACT 同一 Spreadsheet | 新增 View tab |
| C005 Dashboard Spreadsheet | 獨立查閱 | Query from Listing_History |

---

## 6. Refresh Policy

| Trigger | Action |
|---------|--------|
| daily_snapshot 執行後 | 自動更新 |
| 手動 | 可隨時刷新 |

---

## 7. Compliance

| Item | Status |
|------|--------|
| 顯示 FACT Date | ✅ Required |
| 顯示 Today/Non-Today | ✅ Required |
| 顯示完整數字 | ✅ Required |
| 不含 KPI | ✅ Required |
| Timezone = Asia/Taipei | ✅ Required |

---

## Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-23 | v2026-01.1 | Initial specification |

---

**END OF C005_PLATFORM_STATUS_VIEW_SPEC.md**
