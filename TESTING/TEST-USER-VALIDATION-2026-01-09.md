# S005 / V005 使用者實證驗證

**測試日期**：2026-01-09
**測試版本**：S005 @97 / V005 @83
**測試執行者**：[待填]

---

## 權限機制說明（Runtime 真實行為）

### Internal / External 判斷方式

| 判斷方式 | 說明 |
|----------|------|
| **Hard Code Domain** | `isInternalUser_()` 檢查 Email Domain |
| Internal 網域 | `@horus.tw`, `@dapanda.com.tw` |
| External | 其他所有網域 |

**重要**：Internal/External 判斷**不查任何表**，純粹依據 Email Domain。

### 權限表用途

| 表名 | 用途 | 查詢時機 |
|------|------|----------|
| **User_Company_Permission** | 決定可代表哪些公司建立報價 | 建立報價時 |
| **USERS_ACCESS** | 角色權限（目前僅 APPROVER 生效） | V005 審核時 |
| **Admin_Users / Admin_Sessions** | 登入驗證、OTP Session | 登入時 |
| **Company_Profile** | 公司資料、印章 (`stamp_file_id`) | 報價/核准時 |

### External 審核阻擋機制

```
External 使用者嘗試審核
    ↓
isInternalUser_(email) = false  ← Hard Code Domain 判斷
    ↓
Server 返回 403 EXTERNAL_FORBIDDEN  ← Hard Gate
```

**注意**：此阻擋為 Hard Gate，不依賴 USERS_ACCESS 或 User_Company_Permission。

---

## Architect Review Required

| 項目 | 結果 |
|------|------|
| DAPANDA 用印 | [PASS / FAIL] |
| External Hard Gate | [PASS / FAIL] |
| 是否存在風險 | [YES / NO] |

---

## 測試前準備檢查

### 需先確認的 Google Sheet 資料

**Spreadsheet ID**: `1Dm_p_8mXYjqB_xTA0xN9NEDdx_DrWOBYS6lcKiGckc8`

| 檢查項目 | Sheet 名稱 | 欄位 | 結果 |
|----------|-----------|------|------|
| DAPANDA 公司設定 | Company_Profile | company_code = 'DAPANDA' | [存在 / 不存在] |
| DAPANDA 印章 | Company_Profile | stamp_file_id (DAPANDA) | [有設定 / 未設定] |
| hao.chang@dapanda.com.tw 公司授權 | User_Company_Permission | user_email + company_code | [存在 / 不存在] |
| haochenchang@gmail.com 公司授權 | User_Company_Permission | user_email + company_code | [存在 / 不存在] |
| hao.chang@horus.tw 審核權限 | USERS_ACCESS | email + role = APPROVER | [存在 / 不存在] |

---

## A. Internal / HORUS

### User: hao.chang@horus.tw

**身分判斷**：`@horus.tw` → Internal（Hard Code Domain）

#### 1. 登入 S005

| 項目 | 結果 | 備註 |
|------|------|------|
| PIN 驗證 | [PASS / FAIL] | |
| OTP 驗證（新裝置） | [PASS / FAIL / N/A] | Internal 新裝置需 OTP |
| 登入成功 | [PASS / FAIL] | |

#### 2. 建立報價單

| 項目 | 結果 | 備註 |
|------|------|------|
| 公司下拉選單包含 HORUS | [PASS / FAIL] | 來源：User_Company_Permission |
| 選擇 HORUS 報價 | [PASS / FAIL] | |
| 填寫報價單內容 | [PASS / FAIL] | |
| 遞交報價單成功 | [PASS / FAIL] | |
| 報價單 REF_ID | | [記錄編號] |

#### 3. V005 檢視

| 項目 | 結果 | 備註 |
|------|------|------|
| 可開啟 V005 | [PASS / FAIL] | |
| 看到審核工具列 | [PASS / FAIL] | 需 USERS_ACCESS.role = APPROVER |
| 看到核准按鈕 | [PASS / FAIL] | |
| 看到駁回按鈕 | [PASS / FAIL] | |

#### 4. 審核流程

| 項目 | 結果 | 備註 |
|------|------|------|
| 核准功能 | [PASS / FAIL] | |
| 駁回功能 | [PASS / FAIL] | |

#### 5. 用印

| 項目 | 結果 | 備註 |
|------|------|------|
| 印章來源 | | Company_Profile.stamp_file_id |
| 核准後 PDF 顯示印章 | [PASS / FAIL] | |
| 印章圖片正確 | [PASS / FAIL] | |

**Notes**:


---

## B. Internal / DAPANDA（關鍵驗證）

### User: hao.chang@dapanda.com.tw

**身分判斷**：`@dapanda.com.tw` → Internal（Hard Code Domain）

#### 1. 登入 S005

| 項目 | 結果 | 備註 |
|------|------|------|
| PIN 驗證 | [PASS / FAIL] | |
| OTP 驗證 | [PASS / FAIL / N/A] | |
| 登入成功 | [PASS / FAIL] | |

#### 2. 建立報價單

| 項目 | 結果 | 備註 |
|------|------|------|
| 公司下拉選單包含「大鵬達」 | [PASS / FAIL] | 來源：User_Company_Permission |
| 只能選擇被授權公司 | [PASS / FAIL] | 列出實際選項: |
| 選擇大鵬達報價 | [PASS / FAIL] | |
| 填寫報價單內容 | [PASS / FAIL] | |
| 遞交報價單成功 | [PASS / FAIL] | |
| 報價單 REF_ID | | [記錄編號] |

#### 3. V005 檢視

| 項目 | 結果 | 備註 |
|------|------|------|
| 可開啟 V005 | [PASS / FAIL] | |
| 看到審核工具列 | [PASS / FAIL] | 需 USERS_ACCESS.role = APPROVER |
| 看到核准按鈕 | [PASS / FAIL] | |
| 看到駁回按鈕 | [PASS / FAIL] | |

#### 4. 審核流程

| 項目 | 結果 | 備註 |
|------|------|------|
| 核准功能 | [PASS / FAIL] | |
| 駁回功能 | [PASS / FAIL] | |

#### 5. 用印（重點驗證）

| 項目 | 結果 | 備註 |
|------|------|------|
| Company_Profile 有 DAPANDA 印章 | [YES / NO] | stamp_file_id 欄位 |
| 使用的印章來源 | | [DAPANDA / HORUS / 無] |
| 印章 file_id | | [記錄 ID] |
| 核准後 PDF 顯示印章 | [PASS / FAIL] | |
| 印章圖片是大鵬達的章 | [PASS / FAIL] | |

**Notes**:


**若有失敗項目**：

| 失敗項目 | 失敗原因 |
|----------|----------|
| | [資料缺 / 權限 / 程式] |

---

## C. External #1

### User: haochenchang@gmail.com

**身分判斷**：`@gmail.com` → External（非 horus.tw / dapanda.com.tw）

#### 1. 登入 S005

| 項目 | 結果 | 備註 |
|------|------|------|
| PIN 驗證 | [PASS / FAIL] | |
| OTP 驗證（每次必要） | [PASS / FAIL] | External 每次登入需 OTP |
| 登入成功 | [PASS / FAIL] | |

#### 2. 建立報價單

| 項目 | 結果 | 備註 |
|------|------|------|
| 可選擇授權公司 | [PASS / FAIL] | 來源：User_Company_Permission |
| 選擇公司報價 | [PASS / FAIL] | |
| 遞交報價單成功 | [PASS / FAIL] | 需 OTP Session 有效 |
| 報價單 REF_ID | | [記錄編號] |

#### 3. V005 檢視

| 項目 | 結果 | 備註 |
|------|------|------|
| 可開啟 V005 | [PASS / FAIL] | |
| 可查看報價單內容 | [PASS / FAIL] | |
| 可下載 PDF | [PASS / FAIL] | |

#### 4. 禁止行為驗證（必測）

**阻擋機制**：`isInternalUser_()` Hard Gate（Domain 判斷，不查表）

| 項目 | 預期結果 | 實際結果 | 備註 |
|------|----------|----------|------|
| 看不到審核工具列 | 不可見 | [不可見 / 可見] | UI Guard |
| 看不到核准按鈕 | 不可見 | [不可見 / 可見] | UI Guard |
| 看不到駁回按鈕 | 不可見 | [不可見 / 可見] | UI Guard |
| Console 強制呼叫審核 API | 403 | [403 / 其他] | Server Hard Gate |
| Server Gate 阻擋訊息 | EXTERNAL_FORBIDDEN | [正確 / 錯誤] | |

**Notes**:


---

## C. External #2

### User: [待從 User_Company_Permission 確認]

**身分判斷**：External（非 horus.tw / dapanda.com.tw）

#### 1. 登入 S005

| 項目 | 結果 | 備註 |
|------|------|------|
| PIN 驗證 | [PASS / FAIL] | |
| OTP 驗證（每次必要） | [PASS / FAIL] | External 每次登入需 OTP |
| 登入成功 | [PASS / FAIL] | |

#### 2. 建立報價單

| 項目 | 結果 | 備註 |
|------|------|------|
| 可選擇授權公司 | [PASS / FAIL] | 來源：User_Company_Permission |
| 選擇公司報價 | [PASS / FAIL] | |
| 遞交報價單成功 | [PASS / FAIL] | 需 OTP Session 有效 |
| 報價單 REF_ID | | [記錄編號] |

#### 3. V005 檢視

| 項目 | 結果 | 備註 |
|------|------|------|
| 可開啟 V005 | [PASS / FAIL] | |
| 可查看報價單內容 | [PASS / FAIL] | |
| 可下載 PDF | [PASS / FAIL] | |

#### 4. 禁止行為驗證（必測）

**阻擋機制**：`isInternalUser_()` Hard Gate（Domain 判斷，不查表）

| 項目 | 預期結果 | 實際結果 | 備註 |
|------|----------|----------|------|
| 看不到審核工具列 | 不可見 | [不可見 / 可見] | UI Guard |
| 看不到核准按鈕 | 不可見 | [不可見 / 可見] | UI Guard |
| 看不到駁回按鈕 | 不可見 | [不可見 / 可見] | UI Guard |
| Console 強制呼叫審核 API | 403 | [403 / 其他] | Server Hard Gate |
| Server Gate 阻擋訊息 | EXTERNAL_FORBIDDEN | [正確 / 錯誤] | |

**Notes**:


---

## 測試總結

| 使用者類型 | 帳號 | 身分判斷 | 登入 | 建立報價 | 審核 | 用印 | 整體 |
|-----------|------|----------|------|---------|------|------|------|
| Internal/HORUS | hao.chang@horus.tw | Domain Hard Code | | | | | |
| Internal/DAPANDA | hao.chang@dapanda.com.tw | Domain Hard Code | | | | | |
| External #1 | haochenchang@gmail.com | Domain Hard Code | | | N/A (Hard Gate) | N/A | |
| External #2 | [待確認] | Domain Hard Code | | | N/A (Hard Gate) | N/A | |

---

## 風險與問題清單

| 編號 | 問題描述 | 嚴重度 | 需要處理 |
|------|----------|--------|----------|
| | | | |

---

## 附錄：權限表查詢說明

### 公司授權查詢

```
表：User_Company_Permission
查詢：user_email = [登入者 Email]
結果：該使用者可代表的 company_code 清單
```

### 審核權限查詢（V005）

```
表：USERS_ACCESS
查詢：email = [登入者 Email]
條件：role = 'APPROVER' AND status = 'ACTIVE'
結果：允許/拒絕顯示審核按鈕
```

### External 審核阻擋（不查表）

```
函數：isInternalUser_(email)
邏輯：email.domain in ['horus.tw', 'dapanda.com.tw']
結果：false → 403 EXTERNAL_FORBIDDEN
```

---

*測試紀錄由 [測試者] 填寫，[日期]*
