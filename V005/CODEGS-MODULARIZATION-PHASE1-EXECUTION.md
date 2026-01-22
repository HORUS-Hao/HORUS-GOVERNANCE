# Code.gs Modularization Phase 1 Execution — V005

- 模組：V005
- 類型：Refactor Execution（實際執行指令）
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active

## 一、執行前鎖定條件（Mandatory）

1. Code.gs 當前版本需已 Commit
2. 禁止任何功能調整
3. 禁止重命名既有函式（除非僅搬移檔案）
4. 禁止修改狀態機、資料結構、權限邏輯

## 二、實際拆分順序（嚴格遵守）

### Step 1：mail.service.gs

- 自 Code.gs 中抽離：
  - Mail 發送
  - Mail 樣板組裝
- 新檔案建立於：
  /services/mail.service.gs
- Code.gs 僅保留呼叫入口

### Step 2：pdf.service.gs

- 自 Code.gs 中抽離：
  - PDF 產生
  - 樣板填入
- 新檔案建立於：
  /services/pdf.service.gs
- Code.gs 僅保留呼叫入口

### Step 3：export.service.gs

- 自 Code.gs 中抽離：
  - 資料匯出
- 新檔案建立於：
  /services/export.service.gs

### Step 4：drive.repo.gs

- 自 Code.gs 中抽離：
  - Drive 讀取
  - 路徑解析
- 新檔案建立於：
  /repositories/drive.repo.gs

### Step 5：sheets.repo.gs

- 自 Code.gs 中抽離：
  - Sheet 讀取 / 寫入封裝
- 新檔案建立於：
  /repositories/sheets.repo.gs

## 三、檔案 Header 強制格式

每一新檔案必須包含：

- Module
- File Name
- Version（v0.1.0 起）
- Effective Date
- Related Governance（CODEGS-MODULARIZATION-PHASE1-PLAN）

## 四、完成驗證條件

1. 所有功能行為一致
2. 無錯誤、無 warning
3. Code.gs 行數明顯下降
4. 系統可正常部署

## 五、回報要求

完成後僅回報：

- 新增檔案清單
- Code.gs 行數變化
- 是否有阻斷性問題

不得附加自行解釋。
