// SEALED: This module is stable and must not be modified.
// Any extension requires a new ADDON-Step or a new Phase.

/**
 * T002 ADD-ON UX Operation Assist
 *
 * Governance: ADDON_FUNCTION_BOUNDARY_T002.md
 * Scope: Read-only UX assistance (Suggestion-only)
 *
 * PURPOSE: Reduce operation errors through UI guidance
 *
 * EXPLICITLY FORBIDDEN:
 * - ❌ Auto-lock columns
 * - ❌ Auto-trigger checks
 * - ❌ Any write or format change
 * - ❌ Affect user's existing workflow
 */

// ============================================================
// CONFIGURATION (Read-only Reference)
// ============================================================

const UX_CONFIG = Object.freeze({
  // Paste guard threshold
  pasteThreshold: 10, // rows

  // High-risk fields for visual hints
  highRiskFields: Object.freeze([
    '成本價',
    '建議售價',
    '毛利率',
    '毛利%'
  ]),

  // Canonical-aligned fields (suggest lock)
  canonicalAlignedFields: Object.freeze([
    'T002_ID',
    '原廠型號',
    '供應商代碼',
    '品牌',
    '品名',
    '標準化名稱',
    '標準化品牌',
    '標準化型號'
  ]),

  // Check status keys (stored in PropertiesService)
  checkStatusKeys: Object.freeze({
    structureCheck: 'T002_ADDON_STEP2_LAST_RUN',
    semanticCheck: 'T002_ADDON_STEP3_LAST_RUN'
  })
});

// ============================================================
// SESSION STATE (in-memory, not persisted to sheet)
// ============================================================

/**
 * Get check status from document properties
 * @returns {Object} Check status
 */
function getCheckStatus() {
  const props = PropertiesService.getDocumentProperties();
  const keys = UX_CONFIG.checkStatusKeys;

  const step2Last = props.getProperty(keys.structureCheck);
  const step3Last = props.getProperty(keys.semanticCheck);

  return {
    structureCheck: {
      hasRun: !!step2Last,
      lastRun: step2Last ? new Date(step2Last) : null,
      label: 'Step 2: 結構檢查'
    },
    semanticCheck: {
      hasRun: !!step3Last,
      lastRun: step3Last ? new Date(step3Last) : null,
      label: 'Step 3: 語意檢查'
    }
  };
}

/**
 * Record check completion (called from Step 2/3)
 * @param {string} checkType - 'structure' or 'semantic'
 */
function recordCheckCompletion(checkType) {
  const props = PropertiesService.getDocumentProperties();
  const keys = UX_CONFIG.checkStatusKeys;

  if (checkType === 'structure') {
    props.setProperty(keys.structureCheck, new Date().toISOString());
  } else if (checkType === 'semantic') {
    props.setProperty(keys.semanticCheck, new Date().toISOString());
  }
}

// ============================================================
// MAIN ENTRY POINT
// ============================================================

/**
 * Show UX Assist Panel
 */
function showUXAssistUI() {
  const html = HtmlService.createHtmlOutputFromFile('ui')
    .setWidth(380)
    .setHeight(600)
    .setTitle('T002 Operation Assist');

  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Get current sheet analysis for UX hints
 * @returns {Object} Sheet analysis result
 */
function getSheetAnalysis() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  if (values.length < 1) {
    return {
      hasData: false,
      message: '工作表無資料'
    };
  }

  const headers = values[0];
  const rowCount = values.length - 1;

  // Analyze high-risk fields
  const highRiskAnalysis = analyzeHighRiskFields(headers);

  // Analyze canonical-aligned fields
  const canonicalAnalysis = analyzeCanonicalFields(headers);

  // Get check status
  const checkStatus = getCheckStatus();

  // Get selection info for paste guard
  const selection = sheet.getActiveRange();
  const selectionInfo = selection ? {
    rows: selection.getNumRows(),
    cols: selection.getNumColumns(),
    isPotentialLargePaste: selection.getNumRows() >= UX_CONFIG.pasteThreshold
  } : null;

  return {
    hasData: true,
    sheetName: sheet.getName(),
    rowCount: rowCount,
    columnCount: headers.length,
    highRiskFields: highRiskAnalysis,
    canonicalFields: canonicalAnalysis,
    checkStatus: checkStatus,
    selection: selectionInfo,
    workflow: generateWorkflowSuggestion(checkStatus)
  };
}

// ============================================================
// ANALYSIS FUNCTIONS (Read-only)
// ============================================================

/**
 * Analyze high-risk fields in current sheet
 * @param {Array} headers - Column headers
 * @returns {Object} High-risk field analysis
 */
function analyzeHighRiskFields(headers) {
  const found = [];
  const missing = [];

  UX_CONFIG.highRiskFields.forEach(field => {
    const index = headers.indexOf(field);
    if (index >= 0) {
      found.push({
        name: field,
        column: indexToColumn(index),
        columnIndex: index,
        riskLevel: 'HIGH',
        hint: '此欄位影響成本計算，請謹慎操作'
      });
    } else {
      missing.push(field);
    }
  });

  return {
    found: found,
    missing: missing,
    hasHighRisk: found.length > 0
  };
}

/**
 * Analyze canonical-aligned fields
 * @param {Array} headers - Column headers
 * @returns {Object} Canonical field analysis
 */
function analyzeCanonicalFields(headers) {
  const found = [];

  UX_CONFIG.canonicalAlignedFields.forEach(field => {
    const index = headers.indexOf(field);
    if (index >= 0) {
      found.push({
        name: field,
        column: indexToColumn(index),
        columnIndex: index,
        suggestion: '建議鎖定以避免誤動',
        isKey: field === 'T002_ID' || field === '原廠型號'
      });
    }
  });

  return {
    found: found,
    count: found.length,
    hasCriticalKeys: found.some(f => f.isKey)
  };
}

/**
 * Convert column index to letter (0 -> A, 1 -> B, etc.)
 * @param {number} index - Column index (0-based)
 * @returns {string} Column letter
 */
function indexToColumn(index) {
  let column = '';
  let temp = index;

  while (temp >= 0) {
    column = String.fromCharCode((temp % 26) + 65) + column;
    temp = Math.floor(temp / 26) - 1;
  }

  return column;
}

// ============================================================
// PASTE GUARD
// ============================================================

/**
 * Check if current selection suggests large paste operation
 * @returns {Object} Paste guard result
 */
function checkPasteGuard() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selection = sheet.getActiveRange();

  if (!selection) {
    return {
      triggered: false,
      message: '無選取範圍'
    };
  }

  const rowCount = selection.getNumRows();
  const checkStatus = getCheckStatus();

  if (rowCount >= UX_CONFIG.pasteThreshold) {
    const warnings = [];

    if (!checkStatus.structureCheck.hasRun) {
      warnings.push('尚未執行 Step 2（結構檢查）');
    }

    if (!checkStatus.semanticCheck.hasRun) {
      warnings.push('尚未執行 Step 3（語意檢查）');
    }

    return {
      triggered: true,
      rowCount: rowCount,
      threshold: UX_CONFIG.pasteThreshold,
      warnings: warnings,
      suggestion: warnings.length > 0
        ? '建議先完成檢查流程再進行大量貼上'
        : '檢查流程已完成，可進行貼上操作',
      checksCompleted: warnings.length === 0
    };
  }

  return {
    triggered: false,
    rowCount: rowCount,
    message: '選取範圍在安全閾值內'
  };
}

// ============================================================
// WORKFLOW SUGGESTION (Mini Wizard)
// ============================================================

/**
 * Generate workflow suggestion based on current status
 * @param {Object} checkStatus - Current check status
 * @returns {Object} Workflow suggestion
 */
function generateWorkflowSuggestion(checkStatus) {
  const steps = [
    {
      step: 1,
      name: '結構檢查',
      description: '確認欄位完整性與格式',
      status: checkStatus.structureCheck.hasRun ? 'DONE' : 'PENDING',
      lastRun: checkStatus.structureCheck.lastRun,
      action: 'showPreSubmitCheckUI'
    },
    {
      step: 2,
      name: '語意檢查',
      description: '確認資料合理性',
      status: checkStatus.semanticCheck.hasRun ? 'DONE' : 'PENDING',
      lastRun: checkStatus.semanticCheck.lastRun,
      action: 'showSemanticCheckUI'
    },
    {
      step: 3,
      name: '提交',
      description: '完成檢查後提交資料',
      status: (checkStatus.structureCheck.hasRun && checkStatus.semanticCheck.hasRun)
        ? 'READY' : 'BLOCKED',
      lastRun: null,
      action: null
    }
  ];

  // Determine current step
  let currentStep = 1;
  if (checkStatus.structureCheck.hasRun && !checkStatus.semanticCheck.hasRun) {
    currentStep = 2;
  } else if (checkStatus.structureCheck.hasRun && checkStatus.semanticCheck.hasRun) {
    currentStep = 3;
  }

  return {
    steps: steps,
    currentStep: currentStep,
    isReadyToSubmit: currentStep === 3,
    message: currentStep === 3
      ? '檢查流程已完成，可進行提交'
      : `建議先完成 Step ${currentStep}`
  };
}

/**
 * Reset check status (for new data batch)
 */
function resetCheckStatus() {
  const props = PropertiesService.getDocumentProperties();
  const keys = UX_CONFIG.checkStatusKeys;

  props.deleteProperty(keys.structureCheck);
  props.deleteProperty(keys.semanticCheck);

  return {
    success: true,
    message: '檢查狀態已重置'
  };
}

// ============================================================
// MENU INTEGRATION
// ============================================================

/**
 * Add UX Assist to menu
 */
function addUXAssistMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('T002 ADD-ON')
    .addItem('Pre-Submit Structure Check', 'showPreSubmitCheckUI')
    .addItem('Semantic Reasonableness Check', 'showSemanticCheckUI')
    .addSeparator()
    .addItem('Operation Assist Panel', 'showUXAssistUI')
    .addToUi();
}
