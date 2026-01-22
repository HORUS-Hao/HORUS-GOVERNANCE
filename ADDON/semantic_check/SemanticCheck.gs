// SEALED: This module is stable and must not be modified.
// Any extension requires a new ADDON-Step or a new Phase.

/**
 * T002 ADD-ON Semantic Reasonableness Check
 *
 * Governance: ADDON_FUNCTION_BOUNDARY_T002.md
 * Scope: Read-only semantic validation (Warning-only)
 *
 * EXPLICITLY FORBIDDEN:
 * - ❌ Auto-fix or auto-correct
 * - ❌ Auto-fill values
 * - ❌ Any Sheet write
 * - ❌ Any Canonical comparison
 *
 * OUTPUT LEVELS:
 * - OK: No issues detected
 * - WARNING: Potential issue detected
 * - INFO: Informational note
 * - ❌ BLOCK is NOT used (BLOCK belongs to Step 2 only)
 */

// ============================================================
// CONFIGURATION (Read-only Reference)
// ============================================================

const SEMANTIC_CONFIG = Object.freeze({
  // Price field names
  priceFields: Object.freeze({
    cost: '成本價',
    sellPrice: '建議售價',
    margin: '毛利率',
    marginPercent: '毛利%'
  }),

  // Thresholds for extreme value detection
  thresholds: Object.freeze({
    maxCost: 1000000,        // 100萬
    minCost: 1,              // 1元
    maxSellPrice: 2000000,   // 200萬
    minSellPrice: 1,         // 1元
    marginTolerance: 0.05,   // 5% margin calculation tolerance
    extremeMarginHigh: 0.9,  // 90% margin is suspicious
    extremeMarginLow: -0.5   // -50% margin is suspicious
  }),

  // Unit patterns for detection
  unitPatterns: Object.freeze({
    wan: /萬|万/,
    yuan: /元/,
    taxIncluded: /含稅/,
    taxExcluded: /未稅|不含稅/
  })
});

// ============================================================
// MAIN ENTRY POINT
// ============================================================

/**
 * Show Semantic Check UI
 * Triggered from menu or button
 */
function showSemanticCheckUI() {
  const html = HtmlService.createHtmlOutputFromFile('ui')
    .setWidth(420)
    .setHeight(550)
    .setTitle('T002 Semantic Reasonableness Check');

  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Run semantic check on current sheet
 * Called from UI
 * @returns {Object} Validation result with row-level warnings
 */
function runSemanticCheck() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const allData = dataRange.getValues();

  if (allData.length < 2) {
    return {
      status: 'INFO',
      message: '資料不足（需要標題列和至少一筆資料）',
      rows: []
    };
  }

  const headers = allData[0];
  const dataRows = allData.slice(1);

  // Find column indices
  const colIndices = findColumnIndices(headers);

  // Run checks on each row
  const rowResults = dataRows.map((row, index) => {
    return checkRow(row, index + 2, colIndices, headers);
  });

  // Aggregate results
  return aggregateSemanticResults(rowResults);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Find column indices for price-related fields
 * @param {Array} headers - Column headers
 * @returns {Object} Column indices
 */
function findColumnIndices(headers) {
  const pf = SEMANTIC_CONFIG.priceFields;
  return {
    cost: headers.indexOf(pf.cost),
    sellPrice: headers.indexOf(pf.sellPrice),
    margin: headers.indexOf(pf.margin),
    marginPercent: headers.indexOf(pf.marginPercent),
    headers: headers
  };
}

/**
 * Check a single row for semantic issues
 * @param {Array} row - Row data
 * @param {number} rowNum - Row number (1-indexed)
 * @param {Object} colIndices - Column indices
 * @param {Array} headers - All headers
 * @returns {Object} Row check result
 */
function checkRow(row, rowNum, colIndices, headers) {
  const warnings = [];
  const infos = [];

  // Get values
  const cost = colIndices.cost >= 0 ? parseNumeric(row[colIndices.cost]) : null;
  const sellPrice = colIndices.sellPrice >= 0 ? parseNumeric(row[colIndices.sellPrice]) : null;
  const margin = colIndices.margin >= 0 ? parseNumeric(row[colIndices.margin]) : null;
  const marginPercent = colIndices.marginPercent >= 0 ? parseNumeric(row[colIndices.marginPercent]) : null;

  // 1. Price Logic Check
  const priceWarnings = checkPriceLogic(cost, sellPrice, rowNum);
  warnings.push(...priceWarnings);

  // 2. Extreme Value Check
  const extremeWarnings = checkExtremeValues(cost, sellPrice, rowNum);
  warnings.push(...extremeWarnings);

  // 3. Unit/Format Check
  const unitInfos = checkUnitFormat(row, headers, rowNum);
  infos.push(...unitInfos);

  // 4. Cross-field Consistency
  const consistencyWarnings = checkMarginConsistency(cost, sellPrice, margin, marginPercent, rowNum);
  warnings.push(...consistencyWarnings);

  // Determine row status
  let status = 'OK';
  if (warnings.length > 0) {
    status = 'WARNING';
  } else if (infos.length > 0) {
    status = 'INFO';
  }

  return {
    row: rowNum,
    status: status,
    warnings: warnings,
    infos: infos,
    values: {
      cost: cost,
      sellPrice: sellPrice
    }
  };
}

/**
 * Parse numeric value from cell
 * @param {*} value - Cell value
 * @returns {number|null} Parsed number or null
 */
function parseNumeric(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// ============================================================
// SEMANTIC CHECK FUNCTIONS
// ============================================================

/**
 * Check price logic (cost vs sell price)
 * @param {number|null} cost - Cost value
 * @param {number|null} sellPrice - Sell price value
 * @param {number} rowNum - Row number
 * @returns {Array} Warning messages
 */
function checkPriceLogic(cost, sellPrice, rowNum) {
  const warnings = [];

  // Both values must exist for comparison
  if (cost !== null && sellPrice !== null) {
    // Cost > Sell Price
    if (cost > sellPrice && sellPrice > 0) {
      warnings.push({
        type: 'PRICE_LOGIC',
        message: `成本(${cost}) > 售價(${sellPrice})`,
        severity: 'WARNING'
      });
    }
  }

  // Zero or negative check
  if (cost !== null && cost <= 0) {
    warnings.push({
      type: 'PRICE_ZERO',
      message: `成本為 ${cost}（零或負數）`,
      severity: 'WARNING'
    });
  }

  if (sellPrice !== null && sellPrice <= 0) {
    warnings.push({
      type: 'PRICE_ZERO',
      message: `售價為 ${sellPrice}（零或負數）`,
      severity: 'WARNING'
    });
  }

  return warnings;
}

/**
 * Check for extreme values
 * @param {number|null} cost - Cost value
 * @param {number|null} sellPrice - Sell price value
 * @param {number} rowNum - Row number
 * @returns {Array} Warning messages
 */
function checkExtremeValues(cost, sellPrice, rowNum) {
  const warnings = [];
  const t = SEMANTIC_CONFIG.thresholds;

  // Extreme cost
  if (cost !== null) {
    if (cost > t.maxCost) {
      warnings.push({
        type: 'EXTREME_VALUE',
        message: `成本(${cost})可能異常偏高`,
        severity: 'WARNING'
      });
    }
    if (cost > 0 && cost < t.minCost) {
      warnings.push({
        type: 'EXTREME_VALUE',
        message: `成本(${cost})可能異常偏低`,
        severity: 'WARNING'
      });
    }
  }

  // Extreme sell price
  if (sellPrice !== null) {
    if (sellPrice > t.maxSellPrice) {
      warnings.push({
        type: 'EXTREME_VALUE',
        message: `售價(${sellPrice})可能異常偏高`,
        severity: 'WARNING'
      });
    }
    if (sellPrice > 0 && sellPrice < t.minSellPrice) {
      warnings.push({
        type: 'EXTREME_VALUE',
        message: `售價(${sellPrice})可能異常偏低`,
        severity: 'WARNING'
      });
    }
  }

  // Extreme margin
  if (cost !== null && sellPrice !== null && sellPrice > 0) {
    const calculatedMargin = (sellPrice - cost) / sellPrice;
    if (calculatedMargin > t.extremeMarginHigh) {
      warnings.push({
        type: 'EXTREME_MARGIN',
        message: `毛利率(${(calculatedMargin * 100).toFixed(1)}%)可能異常偏高`,
        severity: 'WARNING'
      });
    }
    if (calculatedMargin < t.extremeMarginLow) {
      warnings.push({
        type: 'EXTREME_MARGIN',
        message: `毛利率(${(calculatedMargin * 100).toFixed(1)}%)為負值，可能異常`,
        severity: 'WARNING'
      });
    }
  }

  return warnings;
}

/**
 * Check for unit/format issues
 * @param {Array} row - Row data
 * @param {Array} headers - Column headers
 * @param {number} rowNum - Row number
 * @returns {Array} Info messages
 */
function checkUnitFormat(row, headers, rowNum) {
  const infos = [];
  const patterns = SEMANTIC_CONFIG.unitPatterns;

  // Scan all cells for unit patterns
  row.forEach((cell, colIndex) => {
    if (cell === null || cell === undefined) return;
    const cellStr = String(cell);

    // Check for 萬 (wan) unit
    if (patterns.wan.test(cellStr)) {
      infos.push({
        type: 'UNIT_CHECK',
        field: headers[colIndex],
        message: `欄位「${headers[colIndex]}」含有「萬」單位，請確認是否正確`,
        severity: 'INFO'
      });
    }

    // Check for tax notation
    if (patterns.taxIncluded.test(cellStr) || patterns.taxExcluded.test(cellStr)) {
      infos.push({
        type: 'TAX_CHECK',
        field: headers[colIndex],
        message: `欄位「${headers[colIndex]}」含稅/未稅標記，請確認一致性`,
        severity: 'INFO'
      });
    }
  });

  return infos;
}

/**
 * Check margin consistency
 * @param {number|null} cost - Cost value
 * @param {number|null} sellPrice - Sell price value
 * @param {number|null} margin - Margin value
 * @param {number|null} marginPercent - Margin percent value
 * @param {number} rowNum - Row number
 * @returns {Array} Warning messages
 */
function checkMarginConsistency(cost, sellPrice, margin, marginPercent, rowNum) {
  const warnings = [];
  const tolerance = SEMANTIC_CONFIG.thresholds.marginTolerance;

  // Calculate expected margin
  if (cost !== null && sellPrice !== null && sellPrice > 0) {
    const expectedMargin = (sellPrice - cost) / sellPrice;

    // Check against margin field
    if (margin !== null) {
      // Margin could be stored as decimal or percentage
      const marginDecimal = margin > 1 ? margin / 100 : margin;
      const diff = Math.abs(expectedMargin - marginDecimal);

      if (diff > tolerance) {
        warnings.push({
          type: 'MARGIN_INCONSISTENT',
          message: `毛利率(${(marginDecimal * 100).toFixed(1)}%)與計算值(${(expectedMargin * 100).toFixed(1)}%)不一致`,
          severity: 'WARNING'
        });
      }
    }

    // Check against margin percent field
    if (marginPercent !== null) {
      const mpDecimal = marginPercent > 1 ? marginPercent / 100 : marginPercent;
      const diff = Math.abs(expectedMargin - mpDecimal);

      if (diff > tolerance) {
        warnings.push({
          type: 'MARGIN_INCONSISTENT',
          message: `毛利%(${(mpDecimal * 100).toFixed(1)}%)與計算值(${(expectedMargin * 100).toFixed(1)}%)不一致`,
          severity: 'WARNING'
        });
      }
    }
  }

  return warnings;
}

// ============================================================
// RESULT AGGREGATION
// ============================================================

/**
 * Aggregate all row results
 * @param {Array} rowResults - All row check results
 * @returns {Object} Aggregated result
 */
function aggregateSemanticResults(rowResults) {
  const summary = {
    total: rowResults.length,
    ok: rowResults.filter(r => r.status === 'OK').length,
    warning: rowResults.filter(r => r.status === 'WARNING').length,
    info: rowResults.filter(r => r.status === 'INFO').length
  };

  // Determine overall status
  let status = 'OK';
  if (summary.warning > 0) {
    status = 'WARNING';
  } else if (summary.info > 0) {
    status = 'INFO';
  }

  // Filter rows with issues for display
  const issueRows = rowResults.filter(r => r.status !== 'OK');

  return {
    status: status,
    timestamp: new Date().toISOString(),
    summary: summary,
    rows: issueRows,
    allRows: rowResults,
    governance: {
      note: 'This is a READ-ONLY check. No data was modified.',
      outputLevels: ['OK', 'WARNING', 'INFO'],
      boundary: 'ADDON_FUNCTION_BOUNDARY_T002.md'
    }
  };
}

// ============================================================
// MENU INTEGRATION
// ============================================================

/**
 * Add to existing menu (called from main onOpen or separately)
 */
function addSemanticCheckMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('T002 ADD-ON')
    .addItem('Pre-Submit Structure Check', 'showPreSubmitCheckUI')
    .addItem('Semantic Reasonableness Check', 'showSemanticCheckUI')
    .addToUi();
}
