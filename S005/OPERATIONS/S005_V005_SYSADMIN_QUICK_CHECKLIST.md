# S005 / V005 系統管理者快速檢查表

**版本**: v2.3 FREEZE
**用途**: 一頁式快速參考

---

## 一、啟用前必檢查項目

在啟用外部使用者前，請確認以下項目：

| 檢查項目 | 位置 | 必須狀態 | 未設定後果 |
|----------|------|----------|------------|
| `supervisor_emails` | Company_Profile | 至少一個 Email | 不會寄送任何通知 Mail |
| 使用者帳號 | Admin_Users | email + pin_hash 已設定 | 無法登入 |
| 公司授權 | User_Company_Permission | email + company_code | 公司選單不顯示 |
| Spreadsheet 共用 | Google Sheets | 已共用給執行帳號 | 登入或存取失敗 |

---

## 二、沒收到 Mail 時的三步驟檢查

**問題**：外部使用者已提交，但管理者沒收到審核 Mail

### Step 1：檢查 supervisor_emails

開啟 `Company_Profile` 工作表，確認該公司的 `supervisor_emails` 欄位：

| 狀態 | 結論 |
|------|------|
| 欄位為空 | **正常行為**（設定問題，補齊即可） |
| 欄位有值 | 繼續 Step 2 |

### Step 2：檢查 Email 地址

| 檢查項目 | 處理方式 |
|----------|----------|
| 拼寫是否正確 | 修正錯字 |
| 是否有多餘空白 | 刪除空白 |
| 多個 Email 是否用逗號分隔 | 確認格式 |

### Step 3：檢查郵件匣

| 位置 | 處理方式 |
|------|----------|
| 垃圾郵件匣 | 將寄件者加入白名單 |
| 促銷郵件匣 | 移至主要收件匣 |

---

## 三、何時不用找工程

以下情況為**設定問題**，管理者可自行處理，**不需聯繫工程**：

| 情況 | 原因 | 解法 |
|------|------|------|
| 沒收到審核 Mail | supervisor_emails 未設定 | 補齊設定 |
| 使用者無法登入 | Admin_Users 沒有該帳號 | 新增帳號 |
| 公司選單是空的 | User_Company_Permission 沒有授權 | 新增授權 |
| PIN 錯誤被鎖定 | 連續輸入錯誤 5 次 | 等 15 分鐘或清除 locked_until |

**需要聯繫工程的情況**：
- 以上檢查都正確，但問題仍存在
- 出現系統錯誤訊息
- Deployment 設定需要調整

---

**詳細說明請參閱**：
- `S005_V005_MAIL_PREREQUISITES.md`
- `COMPANY_PROFILE_ADMIN_GUIDE.md`
- `S005_V005_COMMON_ERRORS_GUIDE.md`
