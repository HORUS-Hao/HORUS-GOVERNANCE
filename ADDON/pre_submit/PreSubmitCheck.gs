// SEALED: This module is stable and must not be modified.
// Any extension requires a new ADDON-Step or a new Phase.

/**
 * T002 ADD-ON Pre-Submit Structure Check
 *
 * Governance: ADDON_FUNCTION_BOUNDARY_T002.md
 * Scope: Read-only pre-submit validation
 *
 * EXPLICITLY FORBIDDEN:
 * - ❌ Auto-fix or auto-write
 * - ❌ Create / duplicate T002
 * - ❌ Direct write to any Sheet
 * - ❌ Access T002 Canonical
 */

// ============================================================
// CANONICAL SCHEMA DEFINITION (Read-only Reference)
// ============================================================

const T002_CANONICAL_SCHEMA = Object.freeze({
  requiredFields: Object.freeze([
    'T002_ID',
    '原廠型號',
    '供應商代碼',
    '品牌',
    '品名'
  ]),

  optionalFields: Object.freeze([
    '標準化名稱',
    '標準化品牌',
    '標準化型號',
    '規格',
    '單位',
    '成本價',
    '建議售價',
    '狀態',
    '備註'
  ]),

  numericFields: Object.freeze([
    '成本價',
    '建議售價'
  ]),

  uniqueKeyFields: Object.freeze([
    'T002_ID',
    '原廠型號'
  ]),

  fieldOrder: Object.freeze([
    'T002_ID',
    '原廠型號',
    '供應商代碼',
    '品牌',
    '品名',
    '標準化名稱',
    '標準化品牌',
    '標準化型號',
    '規格',
    '單位',
    '成本價',
    '建議售價',
    '狀態',
    '備註'
  ])
});

// ============================================================
// MAIN ENTRY POINT
// ============================================================

/**
 * Show Pre-Submit Check UI
 * Triggered from menu or button
 */
function showPreSubmitCheckUI() {
  const html = HtmlService.createHtmlOutputFromFile('ui')
    .setWidth(400)
    .setHeight(500)
    .setTitle('T002 Pre-Submit Structure Check');

  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Run structure check on current selection
 * Called from UI
 * @returns {Object} Validation result (PASS/BLOCKED/WARNINGS)
 */
function runPreSubmitCheck() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selection = sheet.getActiveRange();

  if (!selection) {
    return {
      status: 'BLOCKED',
      message: '請先選取要檢查的資料範圍',
      details: []
    };
  }

  // Get data with headers
  const dataRange = sheet.getDataRange();
  const allData = dataRange.getValues();

  if (allData.length < 2) {
    return {
      status: 'BLOCKED',
      message: '資料不足（需要標題列和至少一筆資料）',
      details: []
    };
  }

  const headers = allData[0];
  const dataRows = allData.slice(1);

  // Run all checks
  const results = {
    requiredFieldCheck: checkRequiredFields(headers),
    fieldOrderCheck: checkFieldOrder(headers),
    typeCheck: checkDataTypes(headers, dataRows),
    duplicateKeyCheck: checkDuplicateKeys(headers, dataRows)
  };

  // Aggregate results
  return aggregateResults(results);
}

// ============================================================
// VALIDATION FUNCTIONS (Read-only)
// ============================================================

/**
 * Check required fields existence
 * @param {Array} headers - Column headers
 * @returns {Object} Check result
 */
function checkRequiredFields(headers) {
  const missing = [];
  const found = [];

  T002_CANONICAL_SCHEMA.requiredFields.forEach(field => {
    if (headers.includes(field)) {
      found.push(field);
    } else {
      missing.push(field);
    }
  });

  return {
    name: '必填欄位檢查',
    passed: missing.length === 0,
    severity: missing.length > 0 ? 'BLOCKED' : 'PASS',
    found: found,
    missing: missing,
    message: missing.length > 0
      ? `缺少必填欄位: ${missing.join(', ')}`
      : '所有必填欄位皆存在'
  };
}

/**
 * Check field order matches canonical schema
 * @param {Array} headers - Column headers
 * @returns {Object} Check result
 */
function checkFieldOrder(headers) {
  const issues = [];
  const canonicalOrder = T002_CANONICAL_SCHEMA.fieldOrder;

  // Find fields that exist in both
  const matchedFields = headers.filter(h => canonicalOrder.includes(h));

  // Check order
  let lastIndex = -1;
  matchedFields.forEach(field => {
    const canonicalIndex = canonicalOrder.indexOf(field);
    if (canonicalIndex < lastIndex) {
      issues.push(`欄位 "${field}" 順序不正確`);
    }
    lastIndex = Math.max(lastIndex, canonicalIndex);
  });

  // Check for unknown fields
  const unknownFields = headers.filter(h =>
    h && !canonicalOrder.includes(h) && h.toString().trim() !== ''
  );

  if (unknownFields.length > 0) {
    issues.push(`發現非標準欄位: ${unknownFields.join(', ')}`);
  }

  return {
    name: '欄位順序/名稱檢查',
    passed: issues.length === 0,
    severity: issues.length > 0 ? 'WARNING' : 'PASS',
    issues: issues,
    message: issues.length > 0
      ? issues.join('; ')
      : '欄位順序正確'
  };
}

/**
 * Check data types (numeric fields)
 * @param {Array} headers - Column headers
 * @param {Array} dataRows - Data rows
 * @returns {Object} Check result
 */
function checkDataTypes(headers, dataRows) {
  const issues = [];
  const numericFields = T002_CANONICAL_SCHEMA.numericFields;

  numericFields.forEach(field => {
    const colIndex = headers.indexOf(field);
    if (colIndex === -1) return;

    dataRows.forEach((row, rowIndex) => {
      const value = row[colIndex];

      // Check for non-numeric values (excluding empty)
      if (value !== '' && value !== null && value !== undefined) {
        if (isNaN(Number(value))) {
          issues.push({
            row: rowIndex + 2, // +2 for header and 0-index
            field: field,
            value: value,
            issue: '非數字值'
          });
        }
      }

      // Check for NaN
      if (typeof value === 'number' && isNaN(value)) {
        issues.push({
          row: rowIndex + 2,
          field: field,
          value: 'NaN',
          issue: 'NaN 值'
        });
      }
    });
  });

  return {
    name: '型別檢查',
    passed: issues.length === 0,
    severity: issues.length > 0 ? 'WARNING' : 'PASS',
    issues: issues,
    message: issues.length > 0
      ? `發現 ${issues.length} 個型別問題`
      : '型別檢查通過'
  };
}

/**
 * Check for duplicate keys
 * @param {Array} headers - Column headers
 * @param {Array} dataRows - Data rows
 * @returns {Object} Check result
 */
function checkDuplicateKeys(headers, dataRows) {
  const issues = [];
  const uniqueKeyFields = T002_CANONICAL_SCHEMA.uniqueKeyFields;

  uniqueKeyFields.forEach(field => {
    const colIndex = headers.indexOf(field);
    if (colIndex === -1) return;

    const seen = new Map();

    dataRows.forEach((row, rowIndex) => {
      const value = row[colIndex];
      if (value === '' || value === null || value === undefined) return;

      const valueStr = String(value).trim();
      if (seen.has(valueStr)) {
        issues.push({
          field: field,
          value: valueStr,
          rows: [seen.get(valueStr), rowIndex + 2]
        });
      } else {
        seen.set(valueStr, rowIndex + 2);
      }
    });
  });

  return {
    name: '重複鍵檢查',
    passed: issues.length === 0,
    severity: issues.length > 0 ? 'WARNING' : 'PASS',
    issues: issues,
    message: issues.length > 0
      ? `發現 ${issues.length} 個重複鍵`
      : '無重複鍵'
  };
}

// ============================================================
// RESULT AGGREGATION
// ============================================================

/**
 * Aggregate all check results
 * @param {Object} results - All check results
 * @returns {Object} Aggregated result
 */
function aggregateResults(results) {
  const checks = Object.values(results);

  // Determine overall status
  const hasBlocked = checks.some(c => c.severity === 'BLOCKED');
  const hasWarnings = checks.some(c => c.severity === 'WARNING');

  let status;
  if (hasBlocked) {
    status = 'BLOCKED';
  } else if (hasWarnings) {
    status = 'WARNINGS';
  } else {
    status = 'PASS';
  }

  return {
    status: status,
    timestamp: new Date().toISOString(),
    summary: {
      total: checks.length,
      passed: checks.filter(c => c.passed).length,
      warnings: checks.filter(c => c.severity === 'WARNING').length,
      blocked: checks.filter(c => c.severity === 'BLOCKED').length
    },
    details: checks,
    governance: {
      note: 'This is a READ-ONLY check. No data was modified.',
      boundary: 'ADDON_FUNCTION_BOUNDARY_T002.md'
    }
  };
}

// ============================================================
// MENU SETUP
// ============================================================

/**
 * Create custom menu on spreadsheet open
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('T002 ADD-ON')
    .addItem('Pre-Submit Structure Check', 'showPreSubmitCheckUI')
    .addToUi();
}
