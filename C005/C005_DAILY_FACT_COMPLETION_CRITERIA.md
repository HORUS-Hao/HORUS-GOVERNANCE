# C005 Daily FACT Completion Criteria

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: ACTIVE
> **Purpose**: 定義「今日 FACT 產出」的完成判定標準

---

## 1. 今日判定標準

| 條件 | 判定 |
|------|------|
| `factDate == today` | **OK** |
| `factDate < today` | **STALE** |
| 無資料 | **NO_DATA** |

### 1.1 日期計算基準

```javascript
// 唯一標準：Asia/Taipei 時區
var today = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd");
```

---

## 2. 成功條件

| Metric | Target |
|--------|--------|
| OK 平台數 | 2 (MOMO + PCHOME) |
| STALE 平台數 | 0 |
| NO_DATA 平台數 | 0 |
| 今日完成率 | 100% |

---

## 3. Mail Subject 規則

| 狀態 | Subject 格式 |
|------|-------------|
| 全 OK | `[C005] 每日上架狀態彙整報告 - {date}` |
| 有 STALE | `[C005] 每日上架狀態彙整報告 - {date} [STALE:{n}]` |
| 有 NO_DATA | `[C005] 每日上架狀態彙整報告 - {date} [MISSING:{n}]` |

---

## 4. 驗收 Checklist

- [ ] MOMO: factDate == today
- [ ] PCHOME: factDate == today
- [ ] Mail subject 不含 STALE
- [ ] OK=2, STALE=0, NO_DATA=0

---

## 5. Scope 限制

| 項目 | 狀態 |
|------|------|
| MOMO | IN SCOPE |
| PCHOME | IN SCOPE |
| YAHOO | OUT OF SCOPE |
| SHOPEE | OUT OF SCOPE |

---

**END OF C005_DAILY_FACT_COMPLETION_CRITERIA.md**
