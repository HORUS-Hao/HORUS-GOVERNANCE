/**
 * T002 Data Completeness Validator
 *
 * Type: Read-only Validator
 * Purpose: Validate T002 data completeness and generate reports
 *
 * CRITICAL CONSTRAINTS:
 * - This script is READ-ONLY
 * - NO writes to T002 or T005 are permitted
 * - NO auto-sync, auto-fill, or modifications allowed
 * - Output is ONLY to validation report files
 *
 * Governed by:
 * - ADR-T002-COLLABORATION-PHASE1.md
 * - T002_ALLOWED_FIRST_IMPLEMENTATION.md
 * - T002_EXECUTION_SANDBOX_BOUNDARY.md
 *
 * @author Claude Code (Read-only Validator)
 * @version 1.0.0
 * @date 2026-01-13
 */

// ============================================================================
// CONFIGURATION - READ-ONLY SETTINGS
// ============================================================================

const CONFIG = {
  // Field definitions based on T002_DATA_COMPLETENESS_STANDARD.md
  P0_FIELDS: ['T002_ID', '供應商ID', '原廠商品名稱'],
  P1_FIELDS: ['標準化名稱', '標準化品牌', '標準化型號', '原廠品牌', '原廠型號', 'AI清洗狀態'],
  P2_FIELDS: ['原始價格', '原始幣別', '備註', '信心度', '確認日期', '人工確認人', '接收日期', '供應商名稱'],

  // Valid AI cleaning status values for T005 transfer
  VALID_AI_STATUS_FOR_T005: ['清洗完成', '已人工確認'],

  // Status that allows T005 transfer
  READY_FOR_T005_STATUS: 'READY_FOR_T005'
};

// ============================================================================
// VALIDATOR CLASS - READ-ONLY OPERATIONS ONLY
// ============================================================================

/**
 * T002DataValidator - Read-only validation class
 *
 * IMPORTANT: This class NEVER modifies any data.
 * All methods are pure functions that read and analyze only.
 */
class T002DataValidator {

  /**
   * Constructor
   * @param {Array<Object>} data - T002 data rows (read-only)
   * @param {Array<string>} headers - Column headers
   */
  constructor(data, headers) {
    // Store as read-only reference
    this.data = Object.freeze(data);
    this.headers = Object.freeze(headers);
    this.headerIndex = this._buildHeaderIndex(headers);
    this.validationResults = [];
  }

  /**
   * Build header index for quick lookup
   * @private
   */
  _buildHeaderIndex(headers) {
    const index = {};
    headers.forEach((header, i) => {
      index[header] = i;
    });
    return Object.freeze(index);
  }

  /**
   * Get field value from row (read-only)
   * @param {Array} row - Data row
   * @param {string} fieldName - Field name
   * @returns {*} Field value or null
   */
  _getFieldValue(row, fieldName) {
    const idx = this.headerIndex[fieldName];
    if (idx === undefined) return null;
    const value = row[idx];
    // Treat empty string, null, undefined as missing
    if (value === null || value === undefined || value === '') return null;
    return value;
  }

  /**
   * Check if field is empty
   * @param {*} value - Field value
   * @returns {boolean} True if empty
   */
  _isEmpty(value) {
    return value === null || value === undefined || value === '';
  }

  /**
   * Validate P0 fields for a single record
   * @param {Array} row - Data row
   * @param {number} rowIndex - Row index (for reporting)
   * @returns {Object} Validation result
   */
  validateP0(row, rowIndex) {
    const missingFields = [];

    CONFIG.P0_FIELDS.forEach(field => {
      const value = this._getFieldValue(row, field);
      if (this._isEmpty(value)) {
        missingFields.push(field);
      }
    });

    return {
      rowIndex: rowIndex,
      t002Id: this._getFieldValue(row, 'T002_ID') || `ROW_${rowIndex}`,
      level: 'P0',
      complete: missingFields.length === 0,
      missingFields: missingFields,
      canFile: missingFields.length === 0,
      message: missingFields.length === 0
        ? 'P0 complete - can file'
        : `P0 incomplete - cannot file (missing: ${missingFields.join(', ')})`
    };
  }

  /**
   * Validate P1 fields for a single record
   * @param {Array} row - Data row
   * @param {number} rowIndex - Row index (for reporting)
   * @returns {Object} Validation result
   */
  validateP1(row, rowIndex) {
    const missingFields = [];

    CONFIG.P1_FIELDS.forEach(field => {
      const value = this._getFieldValue(row, field);
      if (this._isEmpty(value)) {
        missingFields.push(field);
      }
    });

    // Special check: AI cleaning status must be valid
    const aiStatus = this._getFieldValue(row, 'AI清洗狀態');
    const hasValidAiStatus = CONFIG.VALID_AI_STATUS_FOR_T005.includes(aiStatus);

    // Check for human confirmation if AI status requires it
    const humanConfirmed = !this._isEmpty(this._getFieldValue(row, '人工確認人'));

    return {
      rowIndex: rowIndex,
      t002Id: this._getFieldValue(row, 'T002_ID') || `ROW_${rowIndex}`,
      level: 'P1',
      complete: missingFields.length === 0,
      missingFields: missingFields,
      aiStatusValid: hasValidAiStatus,
      humanConfirmed: humanConfirmed,
      canTransferToT005: missingFields.length === 0 && (hasValidAiStatus || humanConfirmed),
      message: missingFields.length === 0
        ? 'P1 complete'
        : `P1 incomplete (missing: ${missingFields.join(', ')})`
    };
  }

  /**
   * Validate P2 fields for a single record (informational only)
   * @param {Array} row - Data row
   * @param {number} rowIndex - Row index (for reporting)
   * @returns {Object} Validation result
   */
  validateP2(row, rowIndex) {
    const missingFields = [];

    CONFIG.P2_FIELDS.forEach(field => {
      const value = this._getFieldValue(row, field);
      if (this._isEmpty(value)) {
        missingFields.push(field);
      }
    });

    return {
      rowIndex: rowIndex,
      t002Id: this._getFieldValue(row, 'T002_ID') || `ROW_${rowIndex}`,
      level: 'P2',
      complete: missingFields.length === 0,
      missingFields: missingFields,
      // P2 never blocks anything
      canFile: true,
      canTransferToT005: true,
      message: missingFields.length === 0
        ? 'P2 complete'
        : `P2 incomplete (missing: ${missingFields.join(', ')}) - does not block`
    };
  }

  /**
   * Check if record can proceed to READY_FOR_T005 status
   * Based on T002_STATUS_GATE_SPEC.md Gate-F requirements
   * @param {Array} row - Data row
   * @param {number} rowIndex - Row index
   * @returns {Object} Gate check result
   */
  checkReadyForT005Gate(row, rowIndex) {
    const p0Result = this.validateP0(row, rowIndex);
    const p1Result = this.validateP1(row, rowIndex);

    const currentStatus = this._getFieldValue(row, '商品狀態') ||
                          this._getFieldValue(row, 'Status') ||
                          'UNKNOWN';

    const gatesPassed = [];
    const gatesFailed = [];

    // Gate check: P0 complete
    if (p0Result.complete) {
      gatesPassed.push('P0_COMPLETE');
    } else {
      gatesFailed.push({ gate: 'P0_COMPLETE', reason: p0Result.missingFields });
    }

    // Gate check: P1 complete
    if (p1Result.complete) {
      gatesPassed.push('P1_COMPLETE');
    } else {
      gatesFailed.push({ gate: 'P1_COMPLETE', reason: p1Result.missingFields });
    }

    // Gate check: AI status or human confirmed
    if (p1Result.aiStatusValid || p1Result.humanConfirmed) {
      gatesPassed.push('CLEANING_VERIFIED');
    } else {
      gatesFailed.push({ gate: 'CLEANING_VERIFIED', reason: 'AI status not valid and no human confirmation' });
    }

    const canProceed = gatesFailed.length === 0;

    return {
      rowIndex: rowIndex,
      t002Id: p0Result.t002Id,
      currentStatus: currentStatus,
      canProceedToReadyForT005: canProceed,
      gatesPassed: gatesPassed,
      gatesFailed: gatesFailed,
      message: canProceed
        ? 'All gates passed - can proceed to READY_FOR_T005'
        : `Gates failed: ${gatesFailed.map(g => g.gate).join(', ')}`
    };
  }

  /**
   * Run full validation on all data
   * @returns {Object} Complete validation results
   */
  runFullValidation() {
    const results = {
      timestamp: new Date().toISOString(),
      totalRecords: this.data.length,
      summary: {
        p0Complete: 0,
        p1Complete: 0,
        p2Complete: 0,
        readyForT005: 0,
        cannotFile: 0,
        cannotTransfer: 0
      },
      details: {
        p0Gaps: [],
        p1Gaps: [],
        p2Gaps: [],
        gateResults: []
      }
    };

    this.data.forEach((row, index) => {
      const rowIndex = index + 2; // Assuming header is row 1

      // P0 validation
      const p0 = this.validateP0(row, rowIndex);
      if (p0.complete) {
        results.summary.p0Complete++;
      } else {
        results.summary.cannotFile++;
        results.details.p0Gaps.push(p0);
      }

      // P1 validation
      const p1 = this.validateP1(row, rowIndex);
      if (p1.complete) {
        results.summary.p1Complete++;
      } else {
        results.summary.cannotTransfer++;
        results.details.p1Gaps.push(p1);
      }

      // P2 validation (informational)
      const p2 = this.validateP2(row, rowIndex);
      if (p2.complete) {
        results.summary.p2Complete++;
      } else {
        results.details.p2Gaps.push(p2);
      }

      // Gate check
      const gate = this.checkReadyForT005Gate(row, rowIndex);
      if (gate.canProceedToReadyForT005) {
        results.summary.readyForT005++;
      }
      results.details.gateResults.push(gate);
    });

    return results;
  }
}

// ============================================================================
// REPORT GENERATOR - OUTPUT ONLY, NO WRITES TO SHEETS
// ============================================================================

/**
 * Generate Markdown report from validation results
 * @param {Object} results - Validation results
 * @returns {string} Markdown formatted report
 */
function generateMarkdownReport(results) {
  const lines = [];

  lines.push('# T002 Data Validation Report');
  lines.push('');
  lines.push('## Validation Metadata');
  lines.push('');
  lines.push(`- **Generated**: ${results.timestamp}`);
  lines.push(`- **Total Records**: ${results.totalRecords}`);
  lines.push(`- **Validator Type**: Read-only (No data modifications)`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Count | Percentage |');
  lines.push('|--------|-------|------------|');
  lines.push(`| P0 Complete | ${results.summary.p0Complete} | ${(results.summary.p0Complete / results.totalRecords * 100).toFixed(1)}% |`);
  lines.push(`| P1 Complete | ${results.summary.p1Complete} | ${(results.summary.p1Complete / results.totalRecords * 100).toFixed(1)}% |`);
  lines.push(`| P2 Complete | ${results.summary.p2Complete} | ${(results.summary.p2Complete / results.totalRecords * 100).toFixed(1)}% |`);
  lines.push(`| Ready for T005 | ${results.summary.readyForT005} | ${(results.summary.readyForT005 / results.totalRecords * 100).toFixed(1)}% |`);
  lines.push(`| Cannot File (P0 gaps) | ${results.summary.cannotFile} | ${(results.summary.cannotFile / results.totalRecords * 100).toFixed(1)}% |`);
  lines.push(`| Cannot Transfer (P1 gaps) | ${results.summary.cannotTransfer} | ${(results.summary.cannotTransfer / results.totalRecords * 100).toFixed(1)}% |`);
  lines.push('');

  // P0 Gap Details
  if (results.details.p0Gaps.length > 0) {
    lines.push('## P0 Gap Details (Cannot File)');
    lines.push('');
    lines.push('| Row | T002_ID | Missing Fields |');
    lines.push('|-----|---------|----------------|');
    results.details.p0Gaps.slice(0, 50).forEach(gap => {
      lines.push(`| ${gap.rowIndex} | ${gap.t002Id} | ${gap.missingFields.join(', ')} |`);
    });
    if (results.details.p0Gaps.length > 50) {
      lines.push(`| ... | ... | (${results.details.p0Gaps.length - 50} more records) |`);
    }
    lines.push('');
  }

  // P1 Gap Details
  if (results.details.p1Gaps.length > 0) {
    lines.push('## P1 Gap Details (Cannot Transfer to T005)');
    lines.push('');
    lines.push('| Row | T002_ID | Missing Fields |');
    lines.push('|-----|---------|----------------|');
    results.details.p1Gaps.slice(0, 50).forEach(gap => {
      lines.push(`| ${gap.rowIndex} | ${gap.t002Id} | ${gap.missingFields.join(', ')} |`);
    });
    if (results.details.p1Gaps.length > 50) {
      lines.push(`| ... | ... | (${results.details.p1Gaps.length - 50} more records) |`);
    }
    lines.push('');
  }

  lines.push('## Governance Reminder');
  lines.push('');
  lines.push('This report is **READ-ONLY**. No data was modified during validation.');
  lines.push('');
  lines.push('Prohibited actions:');
  lines.push('- ❌ Write to T005 (Canonical boundary)');
  lines.push('- ❌ Write to T002 (Main data protection)');
  lines.push('- ❌ Auto-sync or auto-fill');
  lines.push('- ❌ Any automated remediation');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*Generated by T002 Data Completeness Validator (Read-only)*');
  lines.push(`*Timestamp: ${results.timestamp}*`);

  return lines.join('\n');
}

/**
 * Generate JSON report from validation results
 * @param {Object} results - Validation results
 * @returns {string} JSON formatted report
 */
function generateJsonReport(results) {
  return JSON.stringify({
    ...results,
    _metadata: {
      validatorType: 'Read-only',
      dataModified: false,
      governanceCompliant: true
    }
  }, null, 2);
}

/**
 * Generate CSV report from validation results
 * @param {Object} results - Validation results
 * @returns {string} CSV formatted report
 */
function generateCsvReport(results) {
  const lines = [];

  // Header
  lines.push('Row,T002_ID,P0_Complete,P1_Complete,P2_Complete,Ready_For_T005,Missing_P0,Missing_P1,Missing_P2');

  // Combine all results
  const allRows = new Map();

  results.details.gateResults.forEach(gate => {
    allRows.set(gate.rowIndex, {
      rowIndex: gate.rowIndex,
      t002Id: gate.t002Id,
      p0Complete: true,
      p1Complete: true,
      p2Complete: true,
      readyForT005: gate.canProceedToReadyForT005,
      missingP0: [],
      missingP1: [],
      missingP2: []
    });
  });

  results.details.p0Gaps.forEach(gap => {
    const row = allRows.get(gap.rowIndex);
    if (row) {
      row.p0Complete = false;
      row.missingP0 = gap.missingFields;
    }
  });

  results.details.p1Gaps.forEach(gap => {
    const row = allRows.get(gap.rowIndex);
    if (row) {
      row.p1Complete = false;
      row.missingP1 = gap.missingFields;
    }
  });

  results.details.p2Gaps.forEach(gap => {
    const row = allRows.get(gap.rowIndex);
    if (row) {
      row.p2Complete = false;
      row.missingP2 = gap.missingFields;
    }
  });

  // Output rows
  allRows.forEach(row => {
    lines.push([
      row.rowIndex,
      `"${row.t002Id}"`,
      row.p0Complete,
      row.p1Complete,
      row.p2Complete,
      row.readyForT005,
      `"${row.missingP0.join('; ')}"`,
      `"${row.missingP1.join('; ')}"`,
      `"${row.missingP2.join('; ')}"`
    ].join(','));
  });

  return lines.join('\n');
}

// ============================================================================
// MAIN ENTRY POINT - FOR DEMONSTRATION WITH MOCK DATA
// ============================================================================

/**
 * Run validation with mock data (for testing/demonstration)
 * This function demonstrates the validator without connecting to real sheets
 */
function runValidationDemo() {
  // Mock headers based on T002_DATA_COMPLETENESS_STANDARD.md
  const mockHeaders = [
    'T002_ID', '供應商ID', '原廠商品名稱',
    '標準化名稱', '標準化品牌', '標準化型號', '原廠品牌', '原廠型號', 'AI清洗狀態',
    '原始價格', '原始幣別', '備註', '信心度', '確認日期', '人工確認人', '接收日期', '供應商名稱',
    '商品狀態'
  ];

  // Mock data for demonstration
  const mockData = [
    // Complete record - ready for T005
    ['T002-001', 'SUP-001', '商品A', '標準商品A', '品牌A', 'MODEL-A', '原廠品牌A', 'OEM-A', '清洗完成', 100, 'TWD', '', 0.95, '', '', '2026-01-01', '供應商1', 'READY_FOR_T005'],
    // P0 gap - cannot file
    ['', 'SUP-002', '商品B', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'INCOMPLETE'],
    // P1 gap - cannot transfer
    ['T002-003', 'SUP-003', '商品C', '', '', '', '原廠品牌C', 'OEM-C', '待處理', 200, 'USD', '', '', '', '', '2026-01-02', '供應商3', 'PENDING_AI_CLEAN'],
    // P2 gap only - can proceed
    ['T002-004', 'SUP-004', '商品D', '標準商品D', '品牌D', 'MODEL-D', '原廠品牌D', 'OEM-D', '清洗完成', '', '', '', '', '', '', '', '', 'READY_FOR_T005'],
    // Human confirmed
    ['T002-005', 'SUP-005', '商品E', '標準商品E', '品牌E', 'MODEL-E', '原廠品牌E', 'OEM-E', '需人工確認', 300, 'TWD', '已確認', 0.6, '2026-01-10', 'User1', '2026-01-03', '供應商5', 'READY_FOR_T005']
  ];

  // Run validation
  const validator = new T002DataValidator(mockData, mockHeaders);
  const results = validator.runFullValidation();

  // Generate reports
  const mdReport = generateMarkdownReport(results);
  const jsonReport = generateJsonReport(results);
  const csvReport = generateCsvReport(results);

  // Log to console (read-only output)
  console.log('=== T002 Validation Demo Complete ===');
  console.log('');
  console.log('Summary:');
  console.log(`- Total Records: ${results.totalRecords}`);
  console.log(`- P0 Complete: ${results.summary.p0Complete}`);
  console.log(`- P1 Complete: ${results.summary.p1Complete}`);
  console.log(`- Ready for T005: ${results.summary.readyForT005}`);
  console.log('');
  console.log('Reports generated (in memory, not written to sheets):');
  console.log('- Markdown Report');
  console.log('- JSON Report');
  console.log('- CSV Report');

  return {
    results: results,
    reports: {
      markdown: mdReport,
      json: jsonReport,
      csv: csvReport
    }
  };
}

// ============================================================================
// EXPORTS FOR TESTING
// ============================================================================

// For module testing if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    T002DataValidator,
    generateMarkdownReport,
    generateJsonReport,
    generateCsvReport,
    runValidationDemo,
    CONFIG
  };
}
