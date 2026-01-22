# S005 / V005 必要工作表共用清單

**文件版本**: v1.0
**適用版本**: S005 / V005 v2.3 FREEZE
**建立日期**: 2026-01-12
**文件性質**: 系統管理者設定參考

---

## 一、文件目的

本文件列出 S005 / V005 系統所需的工作表，以及各工作表的共用需求。
系統管理者應確認所有工作表已正確共用，否則可能導致登入失敗或功能異常。

---

## 二、主資料庫資訊

| 項目 | 值 |
|------|-----|
| Spreadsheet ID | `1Dm_p_8mXYjqB_xTA0xN9NEDdx_DrWOBYS6lcKiGckc8` |
| 名稱 | S005/V005 共用報價資料庫 |

---

## 三、工作表共用需求

### 3.1 系統運作必要工作表

| 工作表名稱 | 必須共用給 | 權限 | 未共用的後果 |
|------------|------------|------|--------------|
| Admin_Users | GAS 執行帳號 | 編輯 | 登入驗證失敗 |
| Admin_Sessions | GAS 執行帳號 | 編輯 | Session 無法建立 |
| Admin_OTP | GAS 執行帳號 | 編輯 | OTP 驗證失敗 |
| S005_QUOTES | GAS 執行帳號 | 編輯 | 報價單無法儲存 |
| Company_Profile | GAS 執行帳號 | 讀取 | 公司選單無法載入 |
| User_Company_Permission | GAS 執行帳號 | 讀取 | 公司授權檢查失敗 |
| USERS_ACCESS | GAS 執行帳號 | 讀取 | 角色檢查失敗 |

### 3.2 可選工作表

| 工作表名稱 | 必須共用給 | 權限 | 未共用的後果 |
|------------|------------|------|--------------|
| USER_COMPANIES | - | - | Legacy，不影響運作 |
| USER_CUSTOMERS | GAS 執行帳號 | 讀取 | 客戶篩選功能失效 |
| Contacts | GAS 執行帳號 | 編輯 | 聯絡人無法儲存 |

---

## 四、GAS 執行帳號說明

### 4.1 當 Execution Identity = Owner

| 項目 | 值 |
|------|-----|
| 執行帳號 | Web App 擁有者帳號 |
| 需共用 | 所有工作表必須共用給擁有者帳號 |

### 4.2 當 Execution Identity = User

| 項目 | 值 |
|------|-----|
| 執行帳號 | 存取 Web App 的使用者帳號 |
| 需共用 | 所有工作表必須共用給所有可能的使用者 |

**建議**：若使用 User 執行身分，建議將 Spreadsheet 共用設定為「知道連結的人都可以編輯」。

---

## 五、共用設定步驟

### 5.1 共用給特定帳號

1. 開啟 Spreadsheet
2. 點擊右上角「共用」
3. 輸入帳號 Email
4. 選擇權限（編輯者 / 檢視者）
5. 點擊「傳送」

### 5.2 共用給所有人

1. 開啟 Spreadsheet
2. 點擊右上角「共用」
3. 點擊「變更為知道連結的任何人」
4. 選擇權限
5. 點擊「完成」

---

## 六、常見問題

### Q1：出現「無法存取試算表」錯誤

**原因**：Spreadsheet 未共用給執行帳號。

**解法**：確認 Spreadsheet 已正確共用。

### Q2：登入時顯示「無法取得登入資訊」

**可能原因**：
1. Spreadsheet 未共用
2. Execution Identity 設定為 Owner（外部帳號無法取得 Email）

**解法**：
1. 確認共用設定
2. 確認 Execution Identity 設定

### Q3：公司選單是空的

**原因**：
1. Company_Profile 工作表未共用
2. User_Company_Permission 沒有該使用者的授權記錄

**解法**：
1. 確認共用設定
2. 確認使用者授權已設定

---

## 七、相關文件

| 文件 | 路徑 |
|------|------|
| 系統管理者操作手冊 | `HORUS-GOVERNANCE/RELEASES/S005_V005/v2.3_FREEZE/HANDOFF/S005_V005_ADMIN_HANDOFF_v2.3.md` |
| Deployment Execution Identity 說明 | `HORUS-GOVERNANCE/DECISIONS/DECISION-S005-DEPLOYMENT-EXECUTION-IDENTITY-v2.3.md` |

---

**文件結束**

*本文件由 Claude Code 依據 v2.3 FREEZE 治理規範產出*
*建立日期：2026-01-12*
