/**
 * HORUS-PDM Governance Scanner v1.2
 * 職責：🔒 Read-Only 掃描，產出 JSON/CSV/MD
 * 不負責：發 Mail（由 GAS A002 負責）
 *
 * GPT 審核修正：
 * - 加入 scanner_version
 * - 風險分級 critical/sensitive
 * - CSV 含 scoring_formula_version
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// 配置區（可依實際路徑調整）
// ==========================================
const SCAN_PATHS = [
    'G:\\我的雲端硬碟\\【Claude Code】\\【HORUS-PDM-Claude-Code】\\10-基礎服務層-BASE-SERVICES',
    'G:\\我的雲端硬碟\\30-HORUS-AUTOMATION'
];

const OUTPUT_PATH = 'G:\\我的雲端硬碟\\HORUS-DERIVED\\reports';

// 高風險權限分級
const RISK_CLASSIFICATION = {
    critical: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/gmail'
    ],
    sensitive: [
        'https://www.googleapis.com/auth/spreadsheets'
    ]
};

// 健康度計算權重（參考用，最終裁定依 SOP-002）
const HEALTH_WEIGHTS = {
    has_readme: 15,
    has_clasp: 15,
    has_manifest: 15,
    has_code: 15,
    has_spec: 8,
    has_changelog: 8,
    has_test: 8
};

// ==========================================
// 工具函式
// ==========================================
function getTimestamp() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}-${hh}${min}`;
}

function safeReadJson(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content);
        }
    } catch (e) {
        console.warn(`[WARN] JSON parse failed: ${filePath}`, e.message);
    }
    return null;
}

// ==========================================
// 核心掃描邏輯
// ==========================================
function analyzeModule(modulePath, folderName) {
    let files;
    try {
        files = fs.readdirSync(modulePath);
    } catch (e) {
        console.warn(`[WARN] Cannot read folder: ${modulePath}`, e.message);
        return null;
    }

    // 1. 檔案存在性檢查
    const checks = {
        has_readme: files.some(f => /^README\.md$/i.test(f)),
        has_clasp: files.includes('.clasp.json'),
        has_manifest: files.includes('appsscript.json'),
        has_code: files.includes('Code.js') ||
                  files.some(f => f.endsWith('.gs')) ||
                  fs.existsSync(path.join(modulePath, 'src', 'Code.js')),
        has_spec: files.some(f => /^SPEC\.md$/i.test(f)),
        has_changelog: files.some(f => /^CHANGELOG\.md$/i.test(f)),
        has_test: files.some(f => /test\.js$/i.test(f) || /\.test\.js$/i.test(f)) ||
                  fs.existsSync(path.join(modulePath, 'tests'))
    };

    // 2. 模組識別規則（至少符合 2 項才視為模組）
    let matchCount = 0;
    if (/[A-Z]\d{3}/.test(folderName)) matchCount++;  // 名稱含代號
    if (checks.has_clasp || checks.has_manifest) matchCount++;  // 有 GAS 設定
    if (checks.has_code) matchCount++;  // 有程式碼

    if (matchCount < 2) return null;  // 非模組，跳過

    // 3. 深度解析
    const details = {
        script_id: '',
        script_url: '',
        root_dir: '',
        scope_count: 0,
        oauth_scopes: [],
        risk_classification: { critical: [], sensitive: [] },
        library_count: 0,
        libraries: []
    };

    // 解析 .clasp.json
    if (checks.has_clasp) {
        const data = safeReadJson(path.join(modulePath, '.clasp.json'));
        if (data) {
            details.script_id = data.scriptId || '';
            details.root_dir = data.rootDir || '';
            if (details.script_id) {
                details.script_url = `https://script.google.com/d/${details.script_id}/edit`;
            }
        }
    }

    // 解析 appsscript.json
    if (checks.has_manifest) {
        const data = safeReadJson(path.join(modulePath, 'appsscript.json'));
        if (data) {
            // Scopes
            if (Array.isArray(data.oauthScopes)) {
                details.oauth_scopes = data.oauthScopes;
                details.scope_count = data.oauthScopes.length;

                // 風險分級
                data.oauthScopes.forEach(scope => {
                    if (RISK_CLASSIFICATION.critical.some(r => scope.startsWith(r))) {
                        details.risk_classification.critical.push(scope);
                    } else if (RISK_CLASSIFICATION.sensitive.some(r => scope.startsWith(r))) {
                        details.risk_classification.sensitive.push(scope);
                    }
                });
            }

            // Libraries
            if (data.dependencies && Array.isArray(data.dependencies.libraries)) {
                details.libraries = data.dependencies.libraries.map(lib => ({
                    userSymbol: lib.userSymbol,
                    libraryId: lib.libraryId,
                    version: lib.version
                }));
                details.library_count = details.libraries.length;
            }
        }
    }

    // 4. 計算參考健康度（NON-AUTHORITATIVE）
    let score = 0;
    Object.keys(HEALTH_WEIGHTS).forEach(key => {
        if (checks[key]) score += HEALTH_WEIGHTS[key];
    });

    let level = '🔴';
    if (score >= 76) level = '🟢';
    else if (score >= 50) level = '🟡';

    return {
        module_id: folderName,
        folder_path: modulePath,
        ...checks,
        ...details,
        health_score_preview: score,
        health_level_preview: level,
        governance_status: "NON-AUTHORITATIVE",
        authoritative_source: "Google Sheets (SOP-002)"
    };
}

// ==========================================
// 主流程
// ==========================================
function scan() {
    console.log('═══════════════════════════════════════');
    console.log('🚀 HORUS-PDM Governance Scanner v1.2');
    console.log('═══════════════════════════════════════');

    const startTime = new Date();
    const results = [];
    const summary = {
        total_folders_scanned: 0,
        modules_identified: 0,
        files_missing: {
            readme: 0,
            manifest: 0,
            spec: 0,
            changelog: 0,
            test: 0
        }
    };

    // 遍歷掃描路徑
    SCAN_PATHS.forEach(scanPath => {
        console.log(`\n📂 掃描：${scanPath}`);

        if (!fs.existsSync(scanPath)) {
            console.warn(`   [SKIP] 路徑不存在`);
            return;
        }

        let folders;
        try {
            folders = fs.readdirSync(scanPath, { withFileTypes: true });
        } catch (e) {
            console.warn(`   [ERROR] 無法讀取：${e.message}`);
            return;
        }

        folders.forEach(dirent => {
            if (!dirent.isDirectory()) return;

            const folderName = dirent.name;

            // 忽略特定目錄
            if (['.git', 'node_modules', '_archive', '_backup'].includes(folderName)) {
                return;
            }

            summary.total_folders_scanned++;

            const moduleData = analyzeModule(
                path.join(scanPath, folderName),
                folderName
            );

            if (moduleData) {
                results.push(moduleData);
                summary.modules_identified++;
                console.log(`   ✓ ${folderName} (${moduleData.health_level_preview} ${moduleData.health_score_preview}%)`);

                // 統計缺失
                if (!moduleData.has_readme) summary.files_missing.readme++;
                if (!moduleData.has_manifest) summary.files_missing.manifest++;
                if (!moduleData.has_spec) summary.files_missing.spec++;
                if (!moduleData.has_changelog) summary.files_missing.changelog++;
                if (!moduleData.has_test) summary.files_missing.test++;
            }
        });
    });

    // 確保輸出目錄存在
    if (!fs.existsSync(OUTPUT_PATH)) {
        fs.mkdirSync(OUTPUT_PATH, { recursive: true });
        console.log(`\n📁 已建立輸出目錄：${OUTPUT_PATH}`);
    }

    const timestamp = getTimestamp();
    const baseFilename = `governance-scan-${timestamp}`;

    // 組裝完整報告
    const fullReport = {
        scanner_version: "v1.2",  // GPT 建議：治理可追溯性
        scan_time: startTime.toISOString(),
        scan_paths: SCAN_PATHS,
        summary,
        modules: results
    };

    // ==========================================
    // 產出報告
    // ==========================================

    // 1. JSON (Timestamped - 歷史記錄)
    const jsonPathTimestamp = path.join(OUTPUT_PATH, `${baseFilename}.json`);
    fs.writeFileSync(jsonPathTimestamp, JSON.stringify(fullReport, null, 2), 'utf8');

    // 2. JSON (Latest - 給 GAS 讀取，固定檔名)
    const jsonPathLatest = path.join(OUTPUT_PATH, 'governance-scan-latest.json');
    fs.writeFileSync(jsonPathLatest, JSON.stringify(fullReport, null, 2), 'utf8');

    // 3. CSV (Raw Facts，含 BOM 支援中文)
    const csvHeader = [
        'module_id',
        'folder_path',
        'has_readme',
        'has_clasp',
        'has_manifest',
        'has_code',
        'has_spec',
        'has_changelog',
        'has_test',
        'script_id',
        'root_dir',
        'scope_count',
        'library_count',
        'oauth_scopes',
        'risk_critical',
        'risk_sensitive',
        'libraries',
        'scoring_formula_version'
    ].join(',') + '\n';

    const csvRows = results.map(m => [
        m.module_id,
        `"${m.folder_path}"`,
        m.has_readme,
        m.has_clasp,
        m.has_manifest,
        m.has_code,
        m.has_spec,
        m.has_changelog,
        m.has_test,
        m.script_id,
        m.root_dir,
        m.scope_count,
        m.library_count,
        `"${m.oauth_scopes.join(';')}"`,
        `"${m.risk_classification.critical.join(';')}"`,
        `"${m.risk_classification.sensitive.join(';')}"`,
        `"${m.libraries.map(l => l.userSymbol).join(';')}"`,
        "SOP-002:v1.0"  // GPT 建議：公式版本追溯
    ].join(','));

    const csvPath = path.join(OUTPUT_PATH, `${baseFilename}-raw.csv`);
    fs.writeFileSync(csvPath, '\uFEFF' + csvHeader + csvRows.join('\n'), 'utf8');

    // 4. Markdown (Human Summary)
    const mdContent = `# HORUS-PDM 治理掃描報告

> Scanner Version: v1.2
> 掃描時間：${timestamp}
> 掃描資料夾：${summary.total_folders_scanned} 個
> 識別模組：${summary.modules_identified} 個

---

## 📊 健康度概覽

| 等級 | 數量 |
|------|------|
| 🟢 健康 (≥76%) | ${results.filter(m => m.health_score_preview >= 76).length} |
| 🟡 警戒 (50-75%) | ${results.filter(m => m.health_score_preview >= 50 && m.health_score_preview < 76).length} |
| 🔴 危險 (<50%) | ${results.filter(m => m.health_score_preview < 50).length} |

---

## 📋 缺失統計

| 檔案 | 缺失數 |
|------|--------|
| README.md | ${summary.files_missing.readme} |
| appsscript.json | ${summary.files_missing.manifest} |
| SPEC.md | ${summary.files_missing.spec} |
| CHANGELOG.md | ${summary.files_missing.changelog} |
| test | ${summary.files_missing.test} |

---

## 📦 模組列表

| 模組 | README | clasp | manifest | code | 健康度 | 線上連結 |
|------|:------:|:-----:|:--------:|:----:|:------:|----------|
${results.map(m => {
    const link = m.script_url ? `[開啟](${m.script_url})` : '-';
    return `| ${m.module_id} | ${m.has_readme ? '✅' : '❌'} | ${m.has_clasp ? '✅' : '❌'} | ${m.has_manifest ? '✅' : '❌'} | ${m.has_code ? '✅' : '❌'} | ${m.health_level_preview} ${m.health_score_preview}% | ${link} |`;
}).join('\n')}

---

## ⚠️ 需關注項目

### 缺少 Manifest（無法確認權限）
${results.filter(m => !m.has_manifest).map(m => `- ${m.module_id}`).join('\n') || '- 無'}

### 🔴 Critical 權限（drive / gmail）
${results.filter(m => m.risk_classification.critical.length > 0).map(m => `- ${m.module_id}: ${m.risk_classification.critical.join(', ')}`).join('\n') || '- 無'}

### 🟡 Sensitive 權限（spreadsheets）
${results.filter(m => m.risk_classification.sensitive.length > 0).map(m => `- ${m.module_id}`).join('\n') || '- 無'}

---

## ⚠️ 免責聲明

> **健康度分數為參考值（NON-AUTHORITATIVE）**
> 最終裁定請依 SOP-002 於 Google Sheets 進行。

---

*Generated by HORUS-PDM Governance Scanner v1.2*
`;

    const mdPath = path.join(OUTPUT_PATH, `${baseFilename}.md`);
    fs.writeFileSync(mdPath, mdContent, 'utf8');

    // ==========================================
    // 完成報告
    // ==========================================
    console.log('\n═══════════════════════════════════════');
    console.log('✅ 掃描完成！');
    console.log('═══════════════════════════════════════');
    console.log(`📊 統計：`);
    console.log(`   - 掃描資料夾：${summary.total_folders_scanned}`);
    console.log(`   - 識別模組：${summary.modules_identified}`);
    console.log(`   - 🟢 健康：${results.filter(m => m.health_score_preview >= 76).length}`);
    console.log(`   - 🟡 警戒：${results.filter(m => m.health_score_preview >= 50 && m.health_score_preview < 76).length}`);
    console.log(`   - 🔴 危險：${results.filter(m => m.health_score_preview < 50).length}`);
    console.log(`\n📁 輸出位置：${OUTPUT_PATH}`);
    console.log(`   - ${baseFilename}.json (歷史記錄)`);
    console.log(`   - governance-scan-latest.json (GAS 讀取用)`);
    console.log(`   - ${baseFilename}-raw.csv`);
    console.log(`   - ${baseFilename}.md`);
    console.log('═══════════════════════════════════════\n');
}

// 執行
scan();
