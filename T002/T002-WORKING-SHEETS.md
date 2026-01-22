# T002 Working Sheets (WK) Boundary Declaration

> Status: ACTIVE
> Version: 1.0.0
> Created: 2025-01-20
> Author: PM + AI Governance

---

## 1. Purpose

This document declares the boundary and governance rules for **Working Sheets (WK)** within the T002 spreadsheet. WK sheets are non-canonical, human-editable extensions that do NOT participate in HORUS data sync pipelines.

---

## 2. WK Sheet Registry

| Sheet Name | Purpose | Editable Columns | Protected Columns |
|------------|---------|------------------|-------------------|
| `T002-WK-平台建檔名稱` | E-commerce platform product naming | J-O (Platform names + Notes) | A-I (UID + Reference data) |

---

## 3. Governance Rules

### 3.1 Naming Convention
- All working sheets MUST use prefix: `T002-WK-`
- Example: `T002-WK-平台建檔名稱`

### 3.2 Data Boundary
- WK sheets are **DERIVED** layer data
- WK sheets **DO NOT** feed back into T002 canonical tables
- WK sheets **DO NOT** sync to T005 or any SSOT

### 3.3 Protection Policy
- System columns (UID + reference formulas) MUST be protected
- User-editable columns MUST be clearly marked with distinct header color
- Row 1 (headers) and reference columns MUST be frozen

### 3.4 Sync Policy
- WK sheets receive data FROM T002-1 via ARRAYFORMULA/VLOOKUP
- WK sheets NEVER write data TO T002-1 or T005
- UID sync is one-way: T002-1 → WK sheet

---

## 4. Technical Implementation

### 4.1 GAS Functions
- `setupSafePlatformSheet()` - Creates and configures WK sheet
- `syncNewUIDs()` - Syncs new UIDs from T002-1 to WK sheet
- `addPlatformNamingMenu()` - Adds menu entry for WK operations

### 4.2 Source File
- `11-PlatformNamingSheet.js` in T002 scripts/core

---

## 5. Change Log

| Date | Version | Change |
|------|---------|--------|
| 2025-01-20 | 1.0.0 | Initial declaration for T002-WK-平台建檔名稱 |

---

## 6. Related Documents

- `ECOM-EXCEL欄位整合裁定表.md` - Field integration rulings
- `T002_T005_DATA_BOUNDARY_FINAL.md` - T002/T005 data boundary
- `SYSTEM-DATA-LAYERS.md` - HORUS data layer architecture
