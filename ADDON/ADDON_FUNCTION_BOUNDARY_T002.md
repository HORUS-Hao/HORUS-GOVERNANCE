# ADD-ON Function Boundary – T002

**文件類型**: Governance Boundary Definition
**狀態**: Active
**適用範圍**: T002 ADD-ON 功能邊界
**建立日期**: 2026-01-13
**上位文件**: T002_WRITE_PATH_AUDIT_PHASE6.md

---

## Scope

- Phase 6 Validator Frozen
- ADD-ON operates as pre-submit assistant only

### Boundary Context

| 項目 | 說明 |
|------|------|
| Phase 6 Validator | 已凍結，為唯一合法 Read-only 實作 |
| ADD-ON 定位 | 提交前輔助工具，非 Canonical 操作 |
| 治理依據 | T002_ALLOWED_FIRST_IMPLEMENTATION.md |

---

## Allowed Capabilities

| 功能類型 | 說明 | 寫入權限 |
|----------|------|----------|
| Pre-submit structure checks | 提交前結構檢查 | ❌ 無 |
| Semantic validation (warning only) | 語意驗證（僅警告） | ❌ 無 |
| UI/UX assistance | 使用者介面輔助 | ❌ 無 |
| Read-only audit logs | 唯讀稽核日誌 | ❌ 無 |

### Capability Details

#### Pre-submit Structure Checks

- 欄位完整性預檢
- 格式一致性預檢
- 必填欄位提醒

#### Semantic Validation (Warning Only)

- 資料語意檢查
- 邏輯一致性檢查
- **僅產生警告，不自動修正**

#### UI/UX Assistance

- 輸入提示
- 格式建議
- 錯誤訊息顯示

#### Read-only Audit Logs

- 操作紀錄
- 驗證結果紀錄
- **不寫入 Canonical 資料**

---

## Explicitly Forbidden

| 禁止行為 | 說明 | 違規等級 |
|----------|------|----------|
| Create / duplicate T002 | 建立或複製 T002 | 🔴 Critical |
| Auto-fix or auto-write Canonical data | 自動修正或寫入 Canonical 資料 | 🔴 Critical |
| Bypass Phase 6 Validator | 繞過 Phase 6 Validator | 🔴 Critical |
| Direct write to T002 Canonical sheets | 直接寫入 T002 Canonical 工作表 | 🔴 Critical |

### Forbidden Function Signatures

```
❌ createNewT002Spreadsheet()
❌ SpreadsheetApp.create() [for T002]
❌ sheet.setValues() [to Canonical]
❌ sheet.appendRow() [to Canonical]
❌ Any function that modifies T002 Canonical data
```

---

## Data Interaction Model

### Input Sources

| 來源 | 說明 | 權限 |
|------|------|------|
| User sheet | 使用者工作表 | Read-only |
| Staging view | 暫存檢視 | Read-only |

### Output Destinations

| 目的地 | 說明 | 權限 |
|--------|------|------|
| UI warning | 使用者介面警告 | Display only |
| Log sheet only | 僅日誌工作表 | Append only (非 Canonical) |

### Data Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ User Sheet  │ ──▶  │   ADD-ON    │ ──▶  │ UI Warning  │
│ (Read-only) │      │ (Validate)  │      │ (Display)   │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Log Sheet  │
                     │ (Non-Canon) │
                     └─────────────┘
```

---

## Enforcement

### Governance Breach Definition

| 條件 | 結果 |
|------|------|
| Any violation of Explicitly Forbidden | Governance breach |
| Bypass of Data Interaction Model | Governance breach |
| Write to Canonical without ADR | Governance breach |

### Breach Consequences

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   Any violation = governance breach                   ║
║                                                       ║
║   違規行為將觸發：                                      ║
║   1. 立即停止該 ADD-ON 功能                            ║
║   2. 回溯審計                                         ║
║   3. ADR 檢討                                         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### Compliance Checklist

| 檢查項目 | 要求 |
|----------|------|
| No Canonical write | ✅ 必須 |
| Read-only input | ✅ 必須 |
| Warning-only output | ✅ 必須 |
| Log to non-Canonical only | ✅ 必須 |
| No auto-fix capability | ✅ 必須 |

---

*Document created: 2026-01-13*
*Governance scope: T002 ADD-ON Function Boundary*
*Status: Active*
