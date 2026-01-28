/**
 * HORUS-PDM Governance Scanner v1.5.3 (Dashboard Ready)
 * 職責：🔒 Read-Only 掃描，產出 JSON/CSV/MD
 * 包含：v1.5.2 統計修復 + v1.5.3 新增 Dashboard 欄位
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// 1. 配置區
// ==========================================
const SCAN_PATHS = [
    'G:\\我的雲端硬碟\\【Claude Code】\\【HORUS-PDM-Claude-Code】\\10-基礎服務層-BASE-SERVICES',
    'G:\\我的雲端硬碟\\30-HORUS-AUTOMATION'
];

const OUTPUT_PATH = 'G:\\我的雲端硬碟\\HORUS-DERIVED\\reports';

const QUALITY_GATES = {
    readme_size: 200,
    spec_size: 300,
    changelog_size: 100,
    code_size: 500,
    manifest_size: 50
};

const RISK_CLASSIFICATION = {
    critical: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/gmail'],
    sensitive: ['https://www.googleapis.com/auth/spreadsheets']
};

const HEALTH_WEIGHTS = {
    has_readme: 15, has_clasp: 15, has_manifest: 15, has_code: 15,
    has_spec: 8, has_changelog: 8, has_test: 8
};

// ==========================================
// 2. 工具函式
// ==========================================

function getTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
}

function getLocalTimeStr() {
    // 簡單模擬 Asia/Taipei 格式: YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
}

function safeReadJson(filePath) {
    try {
        if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) { return null; }
    return null;
}

function validateFile(folderPath, filename, type) {
    const filePath = path.join(folderPath, filename);
    if (!fs.existsSync(filePath)) return false;

    try {
        const stats = fs.statSync(filePath);
        let minSize = 0;
        switch(type) {
            case 'readme': minSize = QUALITY_GATES.readme_size; break;
            case 'spec': minSize = QUALITY_GATES.spec_size; break;
            case 'changelog': minSize = QUALITY_GATES.changelog_size; break;
            case 'code': minSize = QUALITY_GATES.code_size; break;
            case 'manifest': minSize = QUALITY_GATES.manifest_size; break;
            default: minSize = 10;
        }
        if (stats.size < minSize) return false;
        if (filename.endsWith('.json')) {
            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
        }
        return true;
    } catch (e) { return false; }
}

function findAndValidate(files, pattern, folderPath, type) {
    const target = files.find(f => pattern.test(f));
    if (!target) return false;
    return validateFile(folderPath, target, type);
}

// ==========================================
// 3. 核心掃描
// ==========================================

function analyzeModule(modulePath, folderName) {
    let files;
    try { files = fs.readdirSync(modulePath); } catch (e) { return null; }

    const checks = {
        has_readme: findAndValidate(files, /^README\.md$/i, modulePath, 'readme'),
        has_clasp: validateFile(modulePath, '.clasp.json', 'manifest'),
        has_manifest: validateFile(modulePath, 'appsscript.json', 'manifest'),
        has_code: validateFile(modulePath, 'Code.js', 'code') ||
                  (fs.existsSync(path.join(modulePath, 'src')) && validateFile(path.join(modulePath, 'src'), 'Code.js', 'code')),
        has_spec: findAndValidate(files, /^SPEC\.md$/i, modulePath, 'spec'),
        has_changelog: findAndValidate(files, /^CHANGELOG\.md$/i, modulePath, 'changelog'),
        has_test: files.some(f => /test\.js$/i.test(f) || /\.test\.js$/i.test(f))
    };

    let matchCount = 0;
    if (/[A-Z]\d{3}/.test(folderName)) matchCount++;
    if (checks.has_clasp || checks.has_manifest) matchCount++;
    if (checks.has_code) matchCount++;
    if (matchCount < 2) return null;

    const details = {
        script_id: '', script_url: '',
        oauth_scopes: [], risk_classification: { critical: [], sensitive: [] },
        libraries: []
    };

    if (checks.has_clasp) {
        const data = safeReadJson(path.join(modulePath, '.clasp.json'));
        if (data?.scriptId) details.script_url = `https://script.google.com/d/${data.scriptId}/edit`;
    }

    if (fs.existsSync(path.join(modulePath, 'appsscript.json'))) {
        const data = safeReadJson(path.join(modulePath, 'appsscript.json'));
        if (data) {
            if (data.oauthScopes) {
                details.oauth_scopes = data.oauthScopes;
                data.oauthScopes.forEach(s => {
                    if (RISK_CLASSIFICATION.critical.some(r => s.startsWith(r))) details.risk_classification.critical.push(s);
                    else if (RISK_CLASSIFICATION.sensitive.some(r => s.startsWith(r))) details.risk_classification.sensitive.push(s);
                });
            }
            if (data.dependencies?.libraries) {
                details.libraries = data.dependencies.libraries;
            }
        }
    }

    let score = 0;
    Object.keys(HEALTH_WEIGHTS).forEach(k => { if (checks[k]) score += HEALTH_WEIGHTS[k]; });
    const level = score >= 76 ? '🟢' : score >= 50 ? '🟡' : '🔴';

    return {
        module_id: folderName,
        folder_path: modulePath,
        ...checks,
        ...details,
        health_score_preview: score,
        health_level_preview: level,
        governance_status: "NON-AUTHORITATIVE"
    };
}

function scan() {
    console.log(`🚀 HORUS-PDM Scanner v1.5.3 (Dashboard Ready)`);
    console.log(`🛡️  Quality Gates: Active`);

    const startTime = new Date();
    const results = [];
    const summary = {
        total: 0,
        modules: 0,
        files_missing: { readme: 0, manifest: 0, spec: 0, changelog: 0, test: 0 }
    };
    // [New] Dashboard 統計
    const countByLevel = { healthy: 0, warning: 0, danger: 0 };

    SCAN_PATHS.forEach(p => {
        console.log(`   Scanning: ${p}`);
        if (!fs.existsSync(p)) { console.warn(`   ⚠️ Path NOT FOUND: ${p}`); return; }

        try {
            fs.readdirSync(p, { withFileTypes: true }).forEach(d => {
                if (!d.isDirectory() || ['.git', 'node_modules', '_archive'].includes(d.name)) return;
                summary.total++;
                const m = analyzeModule(path.join(p, d.name), d.name);
                if (m) {
                    results.push(m);
                    summary.modules++;

                    // 1. 缺失統計 (v1.5.2 fix)
                    if (!m.has_readme) summary.files_missing.readme++;
                    if (!m.has_manifest) summary.files_missing.manifest++;
                    if (!m.has_spec) summary.files_missing.spec++;
                    if (!m.has_changelog) summary.files_missing.changelog++;
                    if (!m.has_test) summary.files_missing.test++;

                    // 2. 等級統計 (v1.5.3 new)
                    if (m.health_score_preview >= 76) countByLevel.healthy++;
                    else if (m.health_score_preview >= 50) countByLevel.warning++;
                    else countByLevel.danger++;

                    console.log(`     [${m.health_level_preview}] ${d.name.padEnd(30)} Score: ${m.health_score_preview}%`);
                }
            });
        } catch (e) { console.error(`   ❌ Error: ${e.message}`); }
    });

    if (!fs.existsSync(OUTPUT_PATH)) fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    const ts = getTimestamp();
    const base = `governance-scan-${ts}`;

    // [Modified] 增加 Dashboard 欄位
    const report = {
        scanner_version: "v1.5.3",
        scan_time: startTime.toISOString(),
        scan_time_local: getLocalTimeStr(), // [New]
        module_count_by_level: countByLevel, // [New]
        size_thresholds: QUALITY_GATES,
        summary,
        modules: results
    };

    fs.writeFileSync(path.join(OUTPUT_PATH, `${base}.json`), JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(OUTPUT_PATH, `governance-scan-latest.json`), JSON.stringify(report, null, 2));

    // CSV
    const csvHeader = 'module_id,folder_path,has_readme,has_clasp,has_manifest,has_code,has_spec,has_changelog,has_test,script_id,scope_count,library_count,risk_critical,risk_sensitive,scoring_formula_version\n';
    const csvRows = results.map(m => [
        m.module_id, `"${m.folder_path}"`,
        m.has_readme, m.has_clasp, m.has_manifest, m.has_code, m.has_spec, m.has_changelog, m.has_test,
        m.script_id, m.scope_count, m.library_count,
        `"${m.risk_classification.critical.join(';')}"`,
        `"${m.risk_classification.sensitive.join(';')}"`,
        "SOP-002:v1.0"
    ].join(','));
    fs.writeFileSync(path.join(OUTPUT_PATH, `${base}-raw.csv`), '\uFEFF' + csvHeader + csvRows.join('\n'));

    // MD
    const md = `# HORUS-PDM 治理掃描報告 v1.5.3
> 時間：${report.scan_time_local} | 模式：Anti-Gaming (Strict)

## 📊 Dashboard 摘要
- 🟢 健康：${countByLevel.healthy}
- 🟡 警戒：${countByLevel.warning}
- 🔴 危險：${countByLevel.danger}

## 📊 缺失統計
- README: ${summary.files_missing.readme}
- SPEC: ${summary.files_missing.spec}
- CHANGELOG: ${summary.files_missing.changelog}

## 模組列表
| 模組 | README | SPEC | Code | 分數 |
|------|:---:|:---:|:---:|:---:|
${results.map(m => `| ${m.module_id} | ${m.has_readme?'✅':'❌'} | ${m.has_spec?'✅':'❌'} | ${m.has_code?'✅':'❌'} | ${m.health_level_preview} ${m.health_score_preview} |`).join('\n')}
`;
    fs.writeFileSync(path.join(OUTPUT_PATH, `${base}.md`), md);
    console.log(`\n✅ 掃描完成 (v1.5.3 Dashboard Ready)。`);
}

scan();
