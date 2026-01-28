/**
 * HORUS-PDM CI/CD Scanner v1.0
 * 職責：掃描所有模組的 CI/CD 設定狀態
 *
 * 掃描項目：
 * - .git 資料夾（Git repo）
 * - .github/workflows/ 資料夾（CI）
 * - .clasp.json（GAS 部署設定）
 * - package.json（Node 設定）
 * - package.json scripts（test/lint）
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// 配置區
// ==========================================
const SCAN_PATHS = [
    'G:\\我的雲端硬碟\\【Claude Code】\\【HORUS-PDM-Claude-Code】',
    'G:\\我的雲端硬碟\\【Claude Code】\\【HORUS-PDM-Claude-Code】\\10-基礎服務層-BASE-SERVICES',
    'G:\\我的雲端硬碟\\30-HORUS-AUTOMATION'
];

const OUTPUT_PATH = 'G:\\我的雲端硬碟\\HORUS-DERIVED\\reports';

// ==========================================
// 工具函式
// ==========================================
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

function getWorkflowFiles(workflowPath) {
    try {
        if (fs.existsSync(workflowPath)) {
            const files = fs.readdirSync(workflowPath);
            return files.filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
        }
    } catch (e) {
        // ignore
    }
    return [];
}

// ==========================================
// 核心掃描邏輯
// ==========================================
function scanModule(modulePath, folderName) {
    const result = {
        module_id: folderName,
        folder_path: modulePath,
        has_git: false,
        has_ci_workflow: false,
        ci_workflow_files: [],
        has_clasp: false,
        clasp_script_id: null,
        has_package_json: false,
        npm_scripts: [],
        ci_cd_score: 0
    };

    // 1. 檢查 .git
    result.has_git = fs.existsSync(path.join(modulePath, '.git'));

    // 2. 檢查 .github/workflows/
    const workflowPath = path.join(modulePath, '.github', 'workflows');
    result.ci_workflow_files = getWorkflowFiles(workflowPath);
    result.has_ci_workflow = result.ci_workflow_files.length > 0;

    // 3. 檢查 .clasp.json
    const claspPath = path.join(modulePath, '.clasp.json');
    if (fs.existsSync(claspPath)) {
        result.has_clasp = true;
        const claspData = safeReadJson(claspPath);
        if (claspData && claspData.scriptId) {
            result.clasp_script_id = claspData.scriptId;
        }
    }

    // 4. 檢查 package.json
    const packagePath = path.join(modulePath, 'package.json');
    if (fs.existsSync(packagePath)) {
        result.has_package_json = true;
        const pkgData = safeReadJson(packagePath);
        if (pkgData && pkgData.scripts) {
            result.npm_scripts = Object.keys(pkgData.scripts);
        }
    }

    // 5. 計算 ci_cd_score
    if (result.has_git) result.ci_cd_score += 20;
    if (result.has_ci_workflow) result.ci_cd_score += 30;
    if (result.has_clasp) result.ci_cd_score += 20;
    if (result.has_package_json) result.ci_cd_score += 10;
    if (result.npm_scripts.includes('test')) result.ci_cd_score += 10;
    if (result.npm_scripts.includes('lint')) result.ci_cd_score += 10;

    return result;
}

// ==========================================
// 主流程
// ==========================================
function scan() {
    console.log('═══════════════════════════════════════');
    console.log('🚀 HORUS-PDM CI/CD Scanner v1.0');
    console.log('═══════════════════════════════════════');

    const startTime = new Date();
    const results = [];
    const summary = {
        total_scanned: 0,
        with_git: 0,
        with_ci: 0,
        with_clasp: 0,
        with_package_json: 0
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
            if (['.git', 'node_modules', '_archive', '_backup', '.github'].includes(folderName)) {
                return;
            }
            if (folderName.startsWith('.')) return;

            const modulePath = path.join(scanPath, folderName);
            const moduleData = scanModule(modulePath, folderName);

            results.push(moduleData);
            summary.total_scanned++;

            if (moduleData.has_git) summary.with_git++;
            if (moduleData.has_ci_workflow) summary.with_ci++;
            if (moduleData.has_clasp) summary.with_clasp++;
            if (moduleData.has_package_json) summary.with_package_json++;

            // 輸出狀態
            const tags = [];
            if (moduleData.has_git) tags.push('GIT');
            if (moduleData.has_ci_workflow) tags.push('CI');
            if (moduleData.has_clasp) tags.push('CLASP');
            if (moduleData.has_package_json) tags.push('NPM');

            const tagStr = tags.length > 0 ? `[${tags.join(',')}]` : '[NONE]';
            console.log(`   ${tagStr} ${folderName} (score: ${moduleData.ci_cd_score})`);
        });
    });

    // 確保輸出目錄存在
    if (!fs.existsSync(OUTPUT_PATH)) {
        fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    }

    // 組裝完整報告
    const fullReport = {
        scan_time: startTime.toISOString(),
        scanner: "ci-cd-scanner-v1.0",
        modules: results,
        summary
    };

    // ==========================================
    // 產出報告
    // ==========================================

    // 1. JSON
    const jsonPath = path.join(OUTPUT_PATH, 'ci-cd-scan-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(fullReport, null, 2), 'utf8');

    // 2. Markdown
    const withCi = results.filter(m => m.has_ci_workflow);
    const claspNoCi = results.filter(m => m.has_clasp && !m.has_ci_workflow);
    const noGit = results.filter(m => !m.has_git);

    const mdContent = `# HORUS-PDM CI/CD 現況報告

> Scanner: ci-cd-scanner-v1.0
> 掃描時間：${startTime.toISOString()}

---

## 摘要

| 項目 | 數量 |
|------|------|
| 總掃描 | ${summary.total_scanned} |
| 有 Git | ${summary.with_git} |
| 有 CI | ${summary.with_ci} |
| 有 clasp | ${summary.with_clasp} |
| 有 package.json | ${summary.with_package_json} |

---

## 有 CI 的模組

${withCi.length > 0 ? `| 模組 | workflow 檔案 | Score |
|------|---------------|-------|
${withCi.map(m => `| ${m.module_id} | ${m.ci_workflow_files.join(', ')} | ${m.ci_cd_score} |`).join('\n')}` : '- 無'}

---

## 有 clasp 但沒 CI 的模組

${claspNoCi.length > 0 ? `| 模組 | Script ID | Score |
|------|-----------|-------|
${claspNoCi.map(m => `| ${m.module_id} | ${m.clasp_script_id || 'N/A'} | ${m.ci_cd_score} |`).join('\n')}` : '- 無'}

---

## 完全沒有版控的模組

${noGit.length > 0 ? noGit.map(m => `- ${m.module_id}`).join('\n') : '- 無'}

---

## 所有模組 CI/CD 分數

| 模組 | Git | CI | clasp | npm | Score |
|------|:---:|:--:|:-----:|:---:|:-----:|
${results.sort((a, b) => b.ci_cd_score - a.ci_cd_score).map(m =>
    `| ${m.module_id} | ${m.has_git ? '✅' : '❌'} | ${m.has_ci_workflow ? '✅' : '❌'} | ${m.has_clasp ? '✅' : '❌'} | ${m.has_package_json ? '✅' : '❌'} | ${m.ci_cd_score} |`
).join('\n')}

---

*Generated by HORUS-PDM CI/CD Scanner v1.0*
`;

    const mdPath = path.join(OUTPUT_PATH, 'ci-cd-scan-report.md');
    fs.writeFileSync(mdPath, mdContent, 'utf8');

    // ==========================================
    // 完成報告
    // ==========================================
    console.log('\n═══════════════════════════════════════');
    console.log('✅ 掃描完成！');
    console.log('═══════════════════════════════════════');
    console.log(`📊 摘要：`);
    console.log(`   - 總掃描：${summary.total_scanned}`);
    console.log(`   - 有 Git：${summary.with_git}`);
    console.log(`   - 有 CI：${summary.with_ci}`);
    console.log(`   - 有 clasp：${summary.with_clasp}`);
    console.log(`   - 有 package.json：${summary.with_package_json}`);
    console.log(`\n📁 輸出位置：${OUTPUT_PATH}`);
    console.log(`   - ci-cd-scan-report.json`);
    console.log(`   - ci-cd-scan-report.md`);
    console.log('═══════════════════════════════════════\n');
}

// 執行
scan();
