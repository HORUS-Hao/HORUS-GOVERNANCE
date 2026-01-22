# C005 T005 Schema Adapter

> **Status**: EFFECTIVE
> **Module**: C005 - Listing Checker
> **Purpose**: Align C005 field references with T005 Canonical Schema
> **Version**: v1.0
> **Effective Date**: 2026-01-17
> **Reference**: T005_DATA_CONTRACT_v1.0.md

---

## 1. Problem Statement

C005 uses legacy field names that do not match T005 Canonical Schema:

| C005 Legacy Name | T005 Canonical Name | Impact |
|------------------|---------------------|--------|
| `產品編號` | `UID` | Primary key lookup fails |
| `商品分類(大)` | `商品大類` | Category filter fails |
| `商品分類(中)` | `商品中類` | Category filter fails |
| `商品分類(小)` | `商品小類` | Category filter fails |

---

## 2. Schema Adapter Definition

### 2.1 T005_CANONICAL_FIELDS (Authoritative)

```javascript
/**
 * T005 Canonical Field Names
 * Source: HORUS-GOVERNANCE/DATA_CONTRACTS/T005/T005_DATA_CONTRACT_v1.0.md
 *
 * RULE: All C005 code MUST use these canonical names when referencing T005 fields.
 */
var T005_CANONICAL_FIELDS = {
  // Primary Key
  PRIMARY_KEY: 'UID',

  // Core Identity Fields
  BRAND: '品牌',
  MODEL: '商品型號',
  NAME: '商品名稱',

  // Category Fields (Canonical Names)
  CATEGORY_MAJOR: '商品大類',
  CATEGORY_MIDDLE: '商品中類',
  CATEGORY_SMALL: '商品小類',

  // Reference Fields
  SUPPLIER: '供應商',
  STATUS: '商品狀態'
};
```

### 2.2 Legacy to Canonical Mapping

```javascript
/**
 * Legacy Field Name Resolver
 * Maps deprecated field names to T005 Canonical names
 *
 * DEPRECATION WARNING: These legacy names are FORBIDDEN in new code.
 * This mapping exists ONLY for backward compatibility during migration.
 */
var T005_LEGACY_TO_CANONICAL = {
  // Primary Key variants (ALL map to 'UID')
  '產品編號': 'UID',
  'productId': 'UID',
  'product_id': 'UID',

  // Category variants (Map to Canonical)
  '商品分類(大)': '商品大類',
  '商品分類（大）': '商品大類',
  '分類(大)': '商品大類',

  '商品分類(中)': '商品中類',
  '商品分類（中）': '商品中類',
  '分類(中)': '商品中類',

  '商品分類(小)': '商品小類',
  '商品分類（小）': '商品小類',
  '分類(小)': '商品小類'
};
```

### 2.3 Field Resolver Function

```javascript
/**
 * Resolves field name to T005 Canonical name
 * @param {string} fieldName - Field name (may be legacy or canonical)
 * @returns {string} - T005 Canonical field name
 */
function resolveT005FieldName(fieldName) {
  // If already canonical, return as-is
  var canonicalValues = Object.values(T005_CANONICAL_FIELDS);
  if (canonicalValues.indexOf(fieldName) !== -1) {
    return fieldName;
  }

  // Check legacy mapping
  if (T005_LEGACY_TO_CANONICAL[fieldName]) {
    console.warn('[C005] DEPRECATED: Using legacy field name "' + fieldName +
                 '". Use canonical name "' + T005_LEGACY_TO_CANONICAL[fieldName] + '" instead.');
    return T005_LEGACY_TO_CANONICAL[fieldName];
  }

  // Unknown field, return as-is with warning
  console.warn('[C005] Unknown field name: ' + fieldName);
  return fieldName;
}
```

---

## 3. Required Config Changes

### 3.1 FIELD_MAPPING.T005 (Config.gs)

**BEFORE (Legacy - FORBIDDEN):**
```javascript
FIELD_MAPPING: {
  T005: {
    productId: '產品編號',           // WRONG: Not a T005 field
    categoryMajor: '商品分類(大)',   // WRONG: Legacy name
    categoryMiddle: '商品分類(中)',  // WRONG: Legacy name
    categorySmall: '商品分類(小)'    // WRONG: Legacy name
  }
}
```

**AFTER (Canonical - REQUIRED):**
```javascript
FIELD_MAPPING: {
  T005: {
    primaryKey: 'UID',               // Canonical: T005 primary key
    brand: '品牌',                   // Canonical
    model: '商品型號',               // Canonical
    name: '商品名稱',                // Canonical
    categoryMajor: '商品大類',       // Canonical
    categoryMiddle: '商品中類',      // Canonical
    categorySmall: '商品小類',       // Canonical
    supplier: '供應商',              // Canonical
    status: '商品狀態'               // Canonical
  }
}
```

---

## 4. Affected Files

| File | Change Required | Priority |
|------|-----------------|----------|
| `Config.gs` | Update FIELD_MAPPING.T005 | HIGH |
| `Utils.gs` | Use T005_CANONICAL_FIELDS.PRIMARY_KEY for lookups | HIGH |
| `ExportUtils.gs` | Update display labels (keep UI labels, fix data keys) | MEDIUM |
| `UI.html` | Update filter labels if needed | LOW |

---

## 5. Validation Rules

### 5.1 Build-time Validation

C005 deployment MUST fail if:
- Any code references `產品編號` as T005 field
- Any code references `商品分類(大/中/小)` as T005 field

### 5.2 Runtime Validation

C005 SHOULD log warnings if:
- Legacy field names are used (via resolveT005FieldName)
- T005 data is missing expected Canonical fields

---

## 6. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-17 | Initial Schema Adapter specification |

---

**END OF C005-T005-SCHEMA-ADAPTER.md**
