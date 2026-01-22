# Code.gs Modularization Phase 1 Plan — V005

- 模組：V005
- 類型：Refactor Plan（模組化拆分計畫）
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active

## 一、階段目標
本階段目標為「低風險、零行為變更」的模組拆分，
僅抽離穩定、邊界清楚、可獨立的功能模組。

## 二、拆分原則（強制）

1. 不改變任何對外行為
2. 不調整既有狀態機
3. 不修改資料結構
4. 僅做程式碼位置重整

## 三、Phase 1 拆分清單（裁定）

### A. Service 類（優先）

#### 1. mail.service.gs
- 來源：Code.gs
- 職責：所有 Mail 發送、樣板組裝
- 讀取：設定 / 治理（只讀）
- 寫入：無

#### 2. pdf.service.gs
- 來源：Code.gs
- 職責：PDF 產生、樣板填入
- 讀取：資料 / 治理（只讀）
- 寫入：無

#### 3. export.service.gs
- 來源：Code.gs
- 職責：資料匯出（Drive / Download）
- 讀取：資料
- 寫入：無

### B. Infra 類（次優先）

#### 4. drive.repo.gs
- 來源：Code.gs
- 職責：Drive 讀取、路徑解析
- 讀取：Drive
- 寫入：Drive（既有行為）

#### 5. sheets.repo.gs
- 來源：Code.gs
- 職責：Sheet 讀取、寫入封裝
- 讀取：Sheet
- 寫入：Sheet（既有行為）

## 四、Code.gs 調整範圍

- 保留全域函式宣告
- 呼叫新模組
- 不得新增業務邏輯

## 五、版本與紀錄

- 每一新模組初始版本：v0.1.0
- 需於檔頭標示：
  - Module
  - Version
  - Effective Date
  - Related Governance

## 六、完成定義

- 原功能行為完全一致
- Code.gs 行數顯著下降
- 無任何使用者感知變更

## 七、生效聲明
本文件為 V005 Code.gs 模組化第一階段之唯一拆分依據。
