# Data Quality v1 — 封版裁定文件

- 文件：DATA-QUALITY-V1-SEAL.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 狀態：**SEALED**

---

## 一、封版聲明

### 1.1 正式裁定

> **Data Quality v1 = Implemented-Spec / Not-Activated**

| 項目 | 狀態 |
|------|------|
| 規格定義 | ✅ 完成 |
| 可被工程實作 | ✅ 允許 |
| 是否已啟用 | ❌ 未啟用 |
| 啟用條件 | Architect 明確核准 |

### 1.2 一句話裁定

> **Data Quality v1 規格已完成封版，可供工程團隊實作，但未經 Architect 核准不得啟用。**

---

## 二、封版範圍

### 2.1 已完成的規格文件

| 文件名稱 | 類型 | 狀態 |
|----------|------|------|
| `FACT-REGISTRY-v0.md` | FACT 清單 | ✅ 封版 |
| `FACT-QUALITY-BASELINE-v0.md` | 品質基線 | ✅ 封版 |
| `STD-FACT-INGEST-BASELINE-0001.md` | Ingest 規範 | ✅ 封版 |
| `DATA-QUALITY-V1-ENTRY-CRITERIA.md` | 啟動條件 | ✅ 封版 |
| `FACT-QUALITY-RULESET-v1-DRAFT.md` | 規則草案 | ✅ 封版 |
| `FACT-QUALITY-RULESET-v1.schema.json` | 機器可讀規格 | ✅ 封版 |
| `DATA-QUALITY-RUNTIME-SCAN-MAP.md` | 掃描點清單 | ✅ 封版 |
| `FACT-MAIL-LOG-DEFINITION.md` | Mail Log 定義 | ✅ 封版（OPTIONAL） |
| `FACT-PDF-ARCHIVE-DEFINITION.md` | PDF Archive 定義 | ✅ 封版（OPTIONAL） |
| `DATA-QUALITY-v1-ENGINEERING-GUARDRAILS.md` | 工程約束 | ✅ 封版 |
| `DATA-QUALITY-V1-SEAL.md` | 本文件 | ✅ 封版 |

### 2.2 Authority 依賴

| 文件名稱 | 狀態 | 依賴關係 |
|----------|------|----------|
| `S005-AUTHORITY-MCD.md` | ✅ 完成 | v1 啟動前提 |
| `V005-AUTHORITY-MCD.md` | ✅ 完成 | v1 啟動前提 |

---

## 三、核心裁定

### 3.1 v1 定位

| 定位 | 說明 |
|------|------|
| **Read-only** | 只讀取，不寫入 |
| **Report-only** | 只報告，不阻斷 |
| **FACT-only** | 只處理 FACT，不處理 Derived |
| **S005/V005 only** | 只處理 S005/V005，不擴展 |

### 3.2 v1 不做的事

| 禁止項目 | 裁定 |
|----------|------|
| ❌ 自動修正 | 永久禁止（v1） |
| ❌ 流程阻斷 | 永久禁止（v1） |
| ❌ Authority 修改 | 永久禁止 |
| ❌ Derived 計算 | 永久禁止（v1） |
| ❌ 跨模組擴展 | 永久禁止（v1） |

### 3.3 v1 允許的事

| 允許項目 | 裁定 |
|----------|------|
| ✅ 資料讀取 | 依 SCAN-MAP 定義 |
| ✅ 品質檢查 | 依 RULESET 定義 |
| ✅ 報告產出 | 依 BASELINE 定義 |
| ✅ Console Log | 無限制 |

---

## 四、啟用流程

### 4.1 啟用前提

| 前提條件 | 狀態 |
|----------|------|
| Authority MCD 完成 | ✅ |
| 規格文件完成 | ✅ |
| 工程約束文件完成 | ✅ |
| Architect 核准 | ⏸️ 待核准 |

### 4.2 啟用步驟

```
1. 工程團隊閱讀所有 v1 規格文件
2. 依照 ENGINEERING-GUARDRAILS 實作
3. Code Review 確認無違規
4. 測試環境驗證
5. 提交 Architect 審核
6. Architect 核准
7. 正式啟用
```

### 4.3 啟用文件

啟用時需建立：
```
DATA-QUALITY-V1-ACTIVATION-{DATE}.md
```

內容包含：
- 核准日期
- 核准人
- 實作版本
- 部署範圍

---

## 五、封版後的修改規則

### 5.1 允許的修改

| 類型 | 條件 |
|------|------|
| 錯字修正 | 不影響規則語意 |
| 格式調整 | 不影響規則內容 |
| 補充說明 | 不新增規則 |

### 5.2 禁止的修改

| 類型 | 原因 |
|------|------|
| ❌ 新增規則 | 需開啟 v1.1 |
| ❌ 刪除規則 | 需開啟 v1.1 |
| ❌ 修改規則邏輯 | 需開啟 v1.1 |
| ❌ 擴展範圍 | 需開啟 v2 |

### 5.3 版本演進路徑

```
v1.0 (current) → v1.1 (minor fix) → v2.0 (major upgrade)
```

---

## 六、文件索引

### 6.1 規格層文件

| 路徑 | 說明 |
|------|------|
| `HORUS-GOVERNANCE/DATA-QUALITY/FACT-REGISTRY-v0.md` | FACT 清單 |
| `HORUS-GOVERNANCE/DATA-QUALITY/FACT-QUALITY-BASELINE-v0.md` | 品質基線 |
| `HORUS-GOVERNANCE/DATA-QUALITY/STD-FACT-INGEST-BASELINE-0001.md` | Ingest 規範 |
| `HORUS-GOVERNANCE/DATA-QUALITY/FACT-QUALITY-RULESET-v1-DRAFT.md` | 規則草案 |
| `HORUS-GOVERNANCE/DATA-QUALITY/FACT-QUALITY-RULESET-v1.schema.json` | 機器可讀規格 |

### 6.2 執行層文件

| 路徑 | 說明 |
|------|------|
| `HORUS-GOVERNANCE/DATA-QUALITY/DATA-QUALITY-V1-ENTRY-CRITERIA.md` | 啟動條件 |
| `HORUS-GOVERNANCE/DATA-QUALITY/DATA-QUALITY-RUNTIME-SCAN-MAP.md` | 掃描點清單 |
| `HORUS-GOVERNANCE/DATA-QUALITY/DATA-QUALITY-v1-ENGINEERING-GUARDRAILS.md` | 工程約束 |

### 6.3 Optional 定義

| 路徑 | 說明 |
|------|------|
| `HORUS-GOVERNANCE/DATA-QUALITY/FACT-MAIL-LOG-DEFINITION.md` | Mail Log 定義 |
| `HORUS-GOVERNANCE/DATA-QUALITY/FACT-PDF-ARCHIVE-DEFINITION.md` | PDF Archive 定義 |

### 6.4 Authority 依賴

| 路徑 | 說明 |
|------|------|
| `HORUS-GOVERNANCE/S005/S005-AUTHORITY-MCD.md` | S005 Authority MCD |
| `HORUS-GOVERNANCE/V005/V005-AUTHORITY-MCD.md` | V005 Authority MCD |

---

## 七、簽核區

### 7.1 文件制定

| 角色 | 狀態 | 日期 |
|------|------|------|
| AI Agent (Claude Code) | ✅ 完成 | 2026-01-08 |

### 7.2 Architect 核准（待填）

| 角色 | 狀態 | 日期 |
|------|------|------|
| Architect | ⏸️ 待核准 | - |

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版封版 |

