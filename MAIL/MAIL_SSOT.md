# HORUS Mail SSOT (Single Source of Truth)

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: ACTIVE
> **Authority**: Architect
> **Scope**: S005 / V005 / T030 / C005 / R020 / Observer-Mail

---

## Purpose

本文件定義 HORUS 系統 Mail 發送的唯一治理規則。
Mail = Gate，不只是通知。

---

## 1. Mail Event Classification

### 1.1 必須寄送 (MUST_SEND)

| Event | Module | Trigger Condition | Recipients |
|-------|--------|-------------------|------------|
| DAILY_STATUS_REPORT | C005 | 每日 08:30 | PM / Architect |
| PRICE_ALERT | R020 | 價差 > 10% | PM |
| CRITICAL_ERROR | ALL | Runtime exception | Architect |
| GOVERNANCE_VIOLATION | Guards | Policy breach detected | Architect |
| DATA_SYNC_FAILURE | T002/T005 | Sync failed | PM |

### 1.2 不得寄送 (MUST_NOT_SEND)

| Event | Reason |
|-------|--------|
| DEBUG_LOG | 開發用途，不應到生產 |
| HEARTBEAT | 系統內部健康檢查 |
| PREVIEW_ONLY | 預覽模式下的測試郵件 |
| DUPLICATE_WITHIN_HOUR | 同一事件 1 小時內已寄過 |

### 1.3 條件性寄送 (CONDITIONAL_SEND)

| Event | Condition | Recipients |
|-------|-----------|------------|
| NO_UPDATE_REPORT | 連續 3 天無更新 | PM |
| STALE_DATA_WARNING | FACT 超過 24 小時 | PM / Architect |
| LOW_INVENTORY_ALERT | 庫存 < 閾值 | PM |

---

## 2. Exception Conditions

### 2.1 Company-based Exceptions

| Company | Override Rule |
|---------|---------------|
| HORUS | Default rules apply |
| DAPANDA | Same as HORUS |
| MAAAI | CC to additional PM |

### 2.2 Domain-based Exceptions

| Domain | Rule |
|--------|------|
| @horus.tw | Full access |
| @dapanda.com.tw | Full access |
| External domains | No CC |

### 2.3 Role-based Exceptions

| Role | Override Rule |
|------|---------------|
| Architect | Receives all CRITICAL |
| PM | Receives module-specific alerts |
| Operator | No direct mail (use dashboard) |

---

## 3. Mail Router Architecture

### 3.1 Single Entry Point

所有模組寄送郵件必須透過 **Mail Router**。

```
┌──────────────────────────────────────────────────┐
│                   Mail Router                     │
│  (Single Entry Point for all HORUS modules)       │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │  C005   │  │  R020   │  │  T030   │  ...      │
│  └────┬────┘  └────┬────┘  └────┬────┘           │
│       │            │            │                 │
│       └────────────┼────────────┘                 │
│                    ▼                              │
│            ┌──────────────┐                       │
│            │ Mail Router  │                       │
│            │ (Gate Logic) │                       │
│            └──────┬───────┘                       │
│                   │                               │
│          ┌───────┴───────┐                        │
│          ▼               ▼                        │
│     [SEND]          [BLOCK]                       │
│                                                   │
└──────────────────────────────────────────────────┘
```

### 3.2 Router Decision Logic

```javascript
function shouldSendMail(event) {
  // 1. Check MUST_NOT_SEND
  if (isMustNotSend(event)) return false;

  // 2. Check duplicate within hour
  if (isDuplicateWithinHour(event)) return false;

  // 3. Check MUST_SEND
  if (isMustSend(event)) return true;

  // 4. Check CONDITIONAL_SEND
  return evaluateConditional(event);
}
```

---

## 4. Prohibited Patterns

### 4.1 直接呼叫 MailApp

```javascript
// PROHIBITED
MailApp.sendEmail(recipient, subject, body);

// REQUIRED
MailRouter.send(event, data);
```

### 4.2 寄信端判斷

```javascript
// PROHIBITED - 呼叫端自行判斷
if (shouldSend) {
  sendMail();
}

// REQUIRED - Router 判斷
MailRouter.send(event, data); // Router 決定寄不寄
```

---

## 5. Audit Trail

### 5.1 必須記錄的欄位

| Field | Description |
|-------|-------------|
| timestamp | 發送時間 |
| event_type | 事件類型 |
| module | 來源模組 |
| recipient | 收件人 |
| decision | SEND / BLOCK |
| reason | 決策原因 |

### 5.2 Audit Sheet

| Location | Purpose |
|----------|---------|
| `_mail_audit_log` | 所有 mail 決策記錄 |

---

## 6. Governance Compliance

### 6.1 實作要求

| Requirement | Status |
|-------------|--------|
| Single Router entry point | REQUIRED |
| No direct MailApp calls | REQUIRED |
| Audit trail logging | REQUIRED |
| Duplicate prevention | REQUIRED |

### 6.2 驗證方式

```javascript
// Guard: detect direct MailApp usage
function auditDirectMailUsage() {
  // Scan for MailApp.sendEmail calls outside Router
}
```

---

## 7. Related Documents

| Document | Purpose |
|----------|---------|
| `C005-GOVERNANCE.md` | C005 Mail policy |
| `R020_CONFIG.md` | R020 alert thresholds |
| `Observer-Mail/Config.js` | Mail configuration |

---

## Changelog

| Date | Version | Change | Authority |
|------|---------|--------|-----------|
| 2026-01-23 | v2026-01.1 | Initial SSOT definition | Architect |

---

**END OF MAIL_SSOT.md**
