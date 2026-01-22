// SEALED: This module is stable and must not be modified.
// Any extension requires a new ADDON-Step or a new Phase.

/**
 * T002 ADD-ON Audit Log
 *
 * Governance: ADDON_FUNCTION_BOUNDARY_T002.md
 * Scope: Append-only audit logging (Non-Canonical)
 *
 * PURPOSE: Record ADD-ON operation events for audit trail
 *
 * EXPLICITLY FORBIDDEN:
 * - ❌ Write to user data sheets
 * - ❌ Modify or fix values
 * - ❌ Connect to Phase 6 Validator
 * - ❌ Affect any existing workflow
 *
 * ALLOWED:
 * - ✅ Append to dedicated ADDON_AUDIT_LOG sheet only
 * - ✅ Read-only access to sheet metadata
 */

// ============================================================
// CONFIGURATION
// ============================================================

const AUDIT_CONFIG = Object.freeze({
  // Log sheet name (Non-Canonical, dedicated for ADD-ON)
  logSheetName: 'ADDON_AUDIT_LOG',

  // Log schema columns
  columns: Object.freeze([
    'Timestamp',
    'User',
    'Session ID',
    'Sheet Name',
    'Sheet ID',
    'Function',
    'Result',
    'Details',
    'Governance'
  ]),

  // Function names for logging
  functions: Object.freeze({
    STRUCTURE_CHECK: 'Pre-submit Structure Check',
    SEMANTIC_CHECK: 'Semantic Reasonableness Check',
    UX_ASSIST: 'UX Operation Assist',
    AUDIT_VIEW: 'Audit Log View'
  }),

  // Result statuses
  results: Object.freeze({
    PASS: 'PASS',
    WARNINGS: 'WARNINGS',
    INFO: 'INFO',
    BLOCKED: 'BLOCKED',
    ERROR: 'ERROR'
  })
});

// ============================================================
// MAIN LOGGING FUNCTION
// ============================================================

/**
 * Append audit log entry
 * @param {string} functionName - Function that was triggered
 * @param {string} result - Result status (PASS/WARNINGS/INFO/BLOCKED/ERROR)
 * @param {string} details - Brief details/notes
 * @returns {Object} Log result
 */
function appendAuditLog(functionName, result, details) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logSheet = getOrCreateLogSheet(ss);

    // Gather log data
    const timestamp = new Date().toISOString();
    const user = getUserIdentifier();
    const sessionId = getSessionId();
    const activeSheet = ss.getActiveSheet();
    const sheetName = activeSheet ? activeSheet.getName() : 'N/A';
    const sheetId = activeSheet ? activeSheet.getSheetId() : 'N/A';

    // Build log row
    const logRow = [
      timestamp,
      user,
      sessionId,
      sheetName,
      sheetId,
      functionName,
      result,
      details || '',
      'ADDON_FUNCTION_BOUNDARY_T002.md'
    ];

    // Append only (never update or delete)
    logSheet.appendRow(logRow);

    return {
      success: true,
      timestamp: timestamp,
      message: 'Log entry appended'
    };
  } catch (error) {
    // Log errors should not break main functionality
    console.error('Audit log error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================
// LOG SHEET MANAGEMENT
// ============================================================

/**
 * Get or create the audit log sheet
 * @param {Spreadsheet} ss - Spreadsheet object
 * @returns {Sheet} Log sheet
 */
function getOrCreateLogSheet(ss) {
  let logSheet = ss.getSheetByName(AUDIT_CONFIG.logSheetName);

  if (!logSheet) {
    // Create new log sheet
    logSheet = ss.insertSheet(AUDIT_CONFIG.logSheetName);

    // Set up headers
    const headerRange = logSheet.getRange(1, 1, 1, AUDIT_CONFIG.columns.length);
    headerRange.setValues([AUDIT_CONFIG.columns]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3f3f3');

    // Freeze header row
    logSheet.setFrozenRows(1);

    // Set column widths
    logSheet.setColumnWidth(1, 180); // Timestamp
    logSheet.setColumnWidth(2, 150); // User
    logSheet.setColumnWidth(3, 100); // Session ID
    logSheet.setColumnWidth(4, 120); // Sheet Name
    logSheet.setColumnWidth(5, 100); // Sheet ID
    logSheet.setColumnWidth(6, 200); // Function
    logSheet.setColumnWidth(7, 80);  // Result
    logSheet.setColumnWidth(8, 250); // Details
    logSheet.setColumnWidth(9, 250); // Governance

    // Add governance note as first log entry
    logSheet.appendRow([
      new Date().toISOString(),
      'SYSTEM',
      'INIT',
      AUDIT_CONFIG.logSheetName,
      logSheet.getSheetId(),
      'Log Sheet Created',
      'INFO',
      'This sheet is Non-Canonical. Append-only.',
      'ADDON_FUNCTION_BOUNDARY_T002.md'
    ]);
  }

  return logSheet;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get user identifier (email or anonymous)
 * @returns {string} User identifier
 */
function getUserIdentifier() {
  try {
    const email = Session.getActiveUser().getEmail();
    return email || 'Anonymous';
  } catch (e) {
    return 'Anonymous';
  }
}

/**
 * Get or generate session ID
 * @returns {string} Session ID
 */
function getSessionId() {
  const props = PropertiesService.getUserProperties();
  let sessionId = props.getProperty('ADDON_SESSION_ID');

  if (!sessionId) {
    // Generate new session ID
    sessionId = 'S' + Date.now().toString(36).toUpperCase();
    props.setProperty('ADDON_SESSION_ID', sessionId);
  }

  return sessionId;
}

// ============================================================
// INTEGRATION HOOKS (Called from Step 2/3/4)
// ============================================================

/**
 * Log structure check result
 * @param {Object} result - Check result from Step 2
 */
function logStructureCheck(result) {
  const details = result.summary
    ? `Total: ${result.summary.total}, Passed: ${result.summary.passed}, Warnings: ${result.summary.warnings}`
    : '';

  appendAuditLog(
    AUDIT_CONFIG.functions.STRUCTURE_CHECK,
    result.status || AUDIT_CONFIG.results.ERROR,
    details
  );
}

/**
 * Log semantic check result
 * @param {Object} result - Check result from Step 3
 */
function logSemanticCheck(result) {
  const details = result.summary
    ? `Total: ${result.summary.total}, OK: ${result.summary.ok}, Warnings: ${result.summary.warning}`
    : '';

  appendAuditLog(
    AUDIT_CONFIG.functions.SEMANTIC_CHECK,
    result.status || AUDIT_CONFIG.results.ERROR,
    details
  );
}

/**
 * Log UX assist access
 * @param {Object} analysis - Sheet analysis from Step 4
 */
function logUXAssist(analysis) {
  const details = analysis.hasData
    ? `Sheet: ${analysis.sheetName}, Rows: ${analysis.rowCount}`
    : 'No data';

  appendAuditLog(
    AUDIT_CONFIG.functions.UX_ASSIST,
    AUDIT_CONFIG.results.INFO,
    details
  );
}

// ============================================================
// LOG VIEWER
// ============================================================

/**
 * Get recent log entries for display
 * @param {number} limit - Number of entries to retrieve
 * @returns {Object} Log entries
 */
function getRecentLogs(limit) {
  limit = limit || 50;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logSheet = ss.getSheetByName(AUDIT_CONFIG.logSheetName);

    if (!logSheet) {
      return {
        success: true,
        entries: [],
        message: 'No audit log found'
      };
    }

    const lastRow = logSheet.getLastRow();
    if (lastRow <= 1) {
      return {
        success: true,
        entries: [],
        message: 'Log is empty'
      };
    }

    // Get recent entries (skip header)
    const startRow = Math.max(2, lastRow - limit + 1);
    const numRows = lastRow - startRow + 1;
    const data = logSheet.getRange(startRow, 1, numRows, AUDIT_CONFIG.columns.length).getValues();

    // Convert to objects
    const entries = data.map(row => ({
      timestamp: row[0],
      user: row[1],
      sessionId: row[2],
      sheetName: row[3],
      sheetId: row[4],
      function: row[5],
      result: row[6],
      details: row[7],
      governance: row[8]
    })).reverse(); // Most recent first

    return {
      success: true,
      entries: entries,
      total: lastRow - 1
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Show audit log viewer UI
 */
function showAuditLogUI() {
  // Log the view action
  appendAuditLog(
    AUDIT_CONFIG.functions.AUDIT_VIEW,
    AUDIT_CONFIG.results.INFO,
    'Audit log viewed'
  );

  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; font-family: 'Google Sans', Arial, sans-serif; }
        body { margin: 0; padding: 16px; background: #f8f9fa; }
        .header { text-align: center; margin-bottom: 16px; }
        .header h2 { margin: 0 0 4px 0; font-size: 16px; color: #202124; }
        .header .sub { font-size: 11px; color: #5f6368; }
        .log-entry { background: white; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); font-size: 11px; }
        .log-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .log-time { color: #5f6368; }
        .log-result { padding: 2px 6px; border-radius: 8px; font-size: 10px; }
        .log-result.PASS { background: #e6f4ea; color: #137333; }
        .log-result.WARNINGS { background: #fef7e0; color: #b06000; }
        .log-result.INFO { background: #e8f0fe; color: #1967d2; }
        .log-result.BLOCKED { background: #fce8e6; color: #c5221f; }
        .log-result.ERROR { background: #fce8e6; color: #c5221f; }
        .log-func { font-weight: 500; color: #202124; }
        .log-details { color: #5f6368; margin-top: 4px; }
        .log-user { color: #5f6368; font-size: 10px; }
        .empty { text-align: center; padding: 20px; color: #5f6368; }
        .note { margin-top: 16px; padding: 10px; background: #e8f0fe; border-radius: 6px; font-size: 10px; color: #1967d2; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Audit Log</h2>
        <div class="sub">Non-Canonical | Append-only</div>
      </div>
      <div id="logs"><div class="empty">Loading...</div></div>
      <div class="note">此日誌為唯讀顯示，不影響任何資料。</div>
      <script>
        google.script.run.withSuccessHandler(function(data) {
          var container = document.getElementById('logs');
          if (!data.success || data.entries.length === 0) {
            container.innerHTML = '<div class="empty">' + (data.message || 'No logs') + '</div>';
            return;
          }
          container.innerHTML = data.entries.map(function(e) {
            var time = new Date(e.timestamp).toLocaleString('zh-TW');
            return '<div class="log-entry">' +
              '<div class="log-header">' +
                '<span class="log-time">' + time + '</span>' +
                '<span class="log-result ' + e.result + '">' + e.result + '</span>' +
              '</div>' +
              '<div class="log-func">' + e.function + '</div>' +
              '<div class="log-details">' + e.details + '</div>' +
              '<div class="log-user">' + e.user + ' | ' + e.sheetName + '</div>' +
            '</div>';
          }).join('');
        }).getRecentLogs(30);
      </script>
    </body>
    </html>
  `)
    .setWidth(360)
    .setHeight(500)
    .setTitle('T002 Audit Log');

  SpreadsheetApp.getUi().showSidebar(html);
}

// ============================================================
// MENU INTEGRATION
// ============================================================

/**
 * Complete menu setup for all ADD-ON functions
 */
function setupCompleteAddonMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('T002 ADD-ON (Stable)')
    .addItem('Step 2: Structure Check', 'showPreSubmitCheckUI')
    .addItem('Step 3: Semantic Check', 'showSemanticCheckUI')
    .addItem('Step 4: Operation Assist', 'showUXAssistUI')
    .addSeparator()
    .addItem('View Audit Log', 'showAuditLogUI')
    .addToUi();
}
