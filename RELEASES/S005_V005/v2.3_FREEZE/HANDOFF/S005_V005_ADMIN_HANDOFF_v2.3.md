# S005 / V005 v2.3 FREEZE 系統管理者操作素材

> **以下內容為 HORUS Quotation System v2.3 FREEZE 的系統管理者操作素材。**
>
> 請依據此內容產出：
> 1. Word 操作手冊
> 2. PPT 系統與權限說明
>
> **規則：**
> - 不可自行推論或新增內容
> - 不可補充未來規劃
> - 若資訊不足，請標註「待補充」

---

## 文件版本聲明

| 項目 | 值 |
|------|-----|
| 系統版本 | S005 / V005 v2.3 FREEZE |
| 文件日期 | 2026-01-12 |
| 盤點來源 | HORUS-GOVERNANCE（唯一權威） |
| 適用範圍 | 本文件僅描述 v2.3 FREEZE 實作，不含未來規劃 |

---

# 一、工程盤點清單

## 1. Sheet 與欄位清單

### 1.1 Admin_Users（使用者登入資料）

| 欄位 | 必填 | 權威性 | 說明 |
|------|------|--------|------|
| user_id | ✅ | SSOT | 內部唯一識別碼（UUID） |
| email | ✅ | SSOT | 登入 Email（唯一、小寫、去空白） |
| display_name | ✅ | - | 顯示名稱（無格式要求，自由文字） |
| pin_hash | ✅ | SSOT | PIN 雜湊值（SHA-256，64 字元 hex） |
| failed_attempts | - | - | 登入失敗次數 |
| locked_until | - | - | 帳號鎖定到期時間 |

**狀態**：✅ 已實作

**管理者操作**：
- 新增使用者時需填寫：`email`、`display_name`
- PIN 透過 `=PIN_HASH(pin_tmp)` 公式產生 `pin_hash`
- **重要**：產生 hash 後必須立即清空 `pin_tmp` 欄位

---

### 1.2 Admin_Sessions（登入 Session 管理）

| 欄位 | 必填 | 說明 |
|------|------|------|
| token_hash | ✅ | Session Token 雜湊 |
| user_id | ✅ | FK → Admin_Users |
| device_id | ✅ | 裝置識別碼 |
| expire_at | ✅ | 過期時間（30 天） |
| revoked | - | 撤銷狀態 |
| last_pin_hash | - | PIN 變更偵測用 |
| last_active | - | 最後活動時間 |

**狀態**：✅ 已實作

**管理者操作**：
- ❌ 一般情況下**不需操作**此表
- Session 由系統自動建立與管理
- 有效期限：30 天

---

### 1.3 Admin_OTP（OTP 驗證記錄）

| 欄位 | 必填 | 說明 |
|------|------|------|
| user_id | ✅ | FK → Admin_Users |
| otp_hash | ✅ | OTP 雜湊值 |
| created_at | ✅ | 建立時間 |
| expire_at | ✅ | 過期時間（15 分鐘） |
| used | - | 使用狀態 |
| purpose | - | OTP 用途（LOGIN / PIN_RESET） |

**狀態**：✅ 已實作

**管理者操作**：
- ❌ 一般情況下**不需操作**此表
- OTP 過期後無需手動清理（系統自動處理）
- 有效期限：15 分鐘

---

### 1.4 USERS_ACCESS（角色權限表）

| 欄位 | 必填 | 說明 |
|------|------|------|
| email | ✅ | FK → Admin_Users.email |
| role | ✅ | 角色（VIEWER / CREATOR / ISSUER / APPROVER） |
| status | ✅ | 狀態（ACTIVE / INACTIVE） |

**狀態**：✅ 已實作

**管理者操作**：
- 新增使用者時需填寫：`email`、`role`、`status`
- ⚠️ **重要**：v2.3 僅 `APPROVER` 角色生效於審核權限
- 其他角色（VIEWER / CREATOR / ISSUER）目前定義存在但**未實際檢查**

---

### 1.5 User_Company_Permission（公司授權表）

| 欄位 | 必填 | 說明 |
|------|------|------|
| user_email | ✅ | FK → Admin_Users.email |
| company_code | ✅ | FK → Company_Profile.company_code |
| role | - | 預留欄位（v2.3 **未使用於邏輯判斷**） |

**狀態**：✅ 已實作

**管理者操作**：
- 新增使用者時需填寫：`user_email`、`company_code`
- 決定使用者可代表哪些公司建立報價單

---

### 1.6 USER_COMPANIES（Legacy 表，不需填寫）

| 欄位 | 說明 |
|------|------|
| email | 使用者 Email |
| company_code | 公司代碼 |

**狀態**：⚠️ Legacy（早期設計遺留）

**管理者操作**：
- ❌ **不需要填寫**此表
- 此表為早期設計遺留，僅用於系統初始化
- 實際公司授權由 `User_Company_Permission` 控制

**⚠️ 注意**：
- `USER_COMPANIES` 與 `User_Company_Permission` 功能重疊
- v2.3 以 `User_Company_Permission` 為唯一權威來源
- 請勿在此表新增資料，以免造成混淆

---

### 1.7 Company_Profile（公司設定檔）

| 欄位 | 必填 | 說明 |
|------|------|------|
| company_code | ✅ | 公司代碼（唯一識別） |
| company_name | ✅ | 公司名稱 |
| template_code | - | 報價單版型（TEMPLATE_A / TEMPLATE_B） |
| stamp_file_id | - | 印章 Google Drive File ID |
| seal_file_id | - | **Legacy 欄位，未使用** |
| mail_footer | - | Mail 簽名 |
| contact_person | - | 聯絡人 |
| contact_phone | - | 電話 |
| contact_email | - | Email |
| contact_address | - | 地址 |
| tax_id | - | 統一編號 |
| supervisor_emails | - | 監管人 Email（逗號分隔） |

**狀態**：✅ 已實作

**管理者操作**：
- 新增公司時需填寫：`company_code`、`company_name`
- 印章設定：填入 Google Drive File ID 至 `stamp_file_id`
- ⚠️ 印章以 Drive File ID 綁定，重新命名或移動檔案**不影響**系統

---

## 2. 新增使用者 Read / Write Path

### 2.1 必須填寫的 Sheet

| 順序 | Sheet 名稱 | 必填欄位 | 選填欄位 |
|------|------------|----------|----------|
| 1 | Admin_Users | email, display_name, pin_hash | - |
| 2 | USERS_ACCESS | email, role, status | - |
| 3 | User_Company_Permission | user_email, company_code | role（預留） |

### 2.2 PIN 設定流程

1. 在 `Admin_Users` 表的暫存欄位（如 F 欄）輸入明文 PIN
2. 在 `pin_hash` 欄位使用公式 `=PIN_HASH(F2)` 產生雜湊
3. **立即清空**明文 PIN 欄位
4. 透過安全管道將明文 PIN 交付給使用者

**⚠️ 安全警告**：
- 系統**禁止**程式碼存取 `pin_tmp` 欄位
- 系統**不會**自動寄送 PIN 給使用者
- PIN 交付由管理者人工執行

### 2.3 完整新增使用者步驟

```
Step 1: Admin_Users
├─ 填入 email（必須唯一）
├─ 填入 display_name
├─ 產生 pin_hash（使用 PIN_HASH 公式）
└─ 清空暫存 PIN

Step 2: USERS_ACCESS
├─ 填入 email（與 Admin_Users 相同）
├─ 填入 role（VIEWER / CREATOR / ISSUER / APPROVER）
└─ 填入 status（ACTIVE）

Step 3: User_Company_Permission
├─ 填入 user_email（與 Admin_Users 相同）
└─ 填入 company_code（對應 Company_Profile）

Step 4: 人工交付
└─ 將明文 PIN 透過安全管道交給使用者
```

### 2.4 新增使用者啟用檢查清單

新增使用者後，若該使用者無法正常使用系統，請依下列清單逐一檢查：

| # | 檢查項目 | 檢查位置 | 預期值 | 若不符合會發生什麼 |
|---|----------|----------|--------|-------------------|
| 1 | `Admin_Users` 是否有該 email | Admin_Users | 存在 | 無法登入（帳號不存在） |
| 2 | `pin_hash` 是否已設定 | Admin_Users.pin_hash | 64 字元 hex | 無法登入（PIN 驗證失敗） |
| 3 | `pin_tmp` 是否已清空 | Admin_Users（暫存欄） | 空白 | 安全風險（非功能問題） |
| 4 | `USERS_ACCESS` 是否有該 email | USERS_ACCESS | 存在 | 無法取得角色 |
| 5 | `USERS_ACCESS.status` 是否為 ACTIVE | USERS_ACCESS.status | `ACTIVE` | 帳號被視為停用 |
| 6 | `USERS_ACCESS.role` 是否為 APPROVER | USERS_ACCESS.role | `APPROVER`（若需審核） | 無法執行審核（v2.3 僅 APPROVER 生效） |
| 7 | `User_Company_Permission` 是否綁定公司 | User_Company_Permission | 至少一筆 | 公司選單為空，無法建立報價單 |
| 8 | 公司代碼是否存在於 `Company_Profile` | Company_Profile | 存在 | 公司選單不會顯示該選項 |

**⚠️ 重要提醒**：
- v2.3 僅 `APPROVER` 角色實際生效，設定 VIEWER / CREATOR / ISSUER **不會產生對應權限效果**
- 若使用者僅需「建立報價單」而非「審核」，設定任何角色皆可（角色欄位目前僅為語意標註）

---

# 二、權限與角色行為對照

## 1. 系統角色定義（v2.3 FREEZE）

| 角色 | 常數名稱 | 說明 |
|------|----------|------|
| VIEWER | ROLES.VIEWER | 僅檢視 |
| CREATOR | ROLES.CREATOR | 建立報價單 |
| ISSUER | ROLES.ISSUER | 建立 + 發送 |
| APPROVER | ROLES.APPROVER | 核准 + 印章管理 |

## 2. 角色行為對照表

| 角色 | 建立報價單 | 送審 | 核准/退回 | 發送報價 |
|------|-----------|------|----------|---------|
| VIEWER | ❌ | ❌ | ❌ | ❌ |
| CREATOR | ✅ | ✅ | ❌ | ❌ |
| ISSUER | ✅ | ✅ | ❌ | ✅ |
| APPROVER | ✅ | ✅ | ✅ | ✅ |

## 3. v2.3 實際生效狀態

| 角色 | 定義狀態 | 實際檢查 | 說明 |
|------|----------|----------|------|
| VIEWER | ✅ 已定義 | ❌ 未檢查 | 預留，目前無對應權限控制 |
| CREATOR | ✅ 已定義 | ❌ 未檢查 | 預留，目前無對應權限控制 |
| ISSUER | ✅ 已定義 | ❌ 未檢查 | 預留，目前無對應權限控制 |
| APPROVER | ✅ 已定義 | ✅ 已檢查 | **唯一生效的角色** |

**⚠️ 重要**：v2.3 僅 `APPROVER` 角色實際影響審核權限。

---

## 4. Internal / External 使用者區分

### 4.1 判斷機制

| 項目 | 值 |
|------|-----|
| 判斷方式 | Hard Code Domain（程式碼內建） |
| 判斷函數 | `isInternalUser_(email)` |
| Internal 網域 | `@horus.tw`、`@dapanda.com.tw` |
| External | 其他所有網域 |

**⚠️ 重要**：Internal / External 判斷**不查詢任何資料表**，純粹依據 Email Domain 決定。

### 4.2 行為差異

| 項目 | Internal | External |
|------|----------|----------|
| 建立報價單 | ✅ | ✅（需 OTP） |
| 檢視報價單 | ✅ | ✅ |
| 核准/退回 | ✅（需 APPROVER） | ❌ 永遠禁止 |
| 新裝置 OTP | 首次需要 | 每次登入需要 |

### 4.3 External 限制（Hard Gate）

| 限制 | 說明 | 實作位置 |
|------|------|----------|
| 審核禁止 | Server-side 強制拒絕 | `isInternalUser_()` |
| UI 隱藏 | 不顯示審核工具列 | Client-side Guard（非安全邊界） |
| 403 錯誤 | `EXTERNAL_FORBIDDEN` | Server-side |

**⚠️ 安全邊界**：
- Server-side `isInternalUser_()` + `isFinalApprover()` 為**唯一安全邊界**
- Client-side 檢查僅為 UX 輔助，**非安全權威來源**

---

## 5. FINAL_APPROVERS（最終核准人）

### 5.1 定義位置

| 項目 | 值 |
|------|-----|
| 定義位置 | S005 Code.gs 常數 |
| 變數名稱 | `FINAL_APPROVERS` |
| v2.3 唯一成員 | `hao.chang@horus.tw` |

### 5.2 新增/移除核准人

| 步驟 | 說明 |
|------|------|
| 1 | 修改 S005 Code.gs 中的 `FINAL_APPROVERS` 常數 |
| 2 | 重新部署 Web App |
| 3 | 確認 USERS_ACCESS 表中該使用者 role = APPROVER |

**⚠️ 注意**：`FINAL_APPROVERS` 為程式碼常數，無法透過 Sheet 管理。

---

## 6. 系統管理者權限邊界（v2.3 明確聲明）

### 6.1 系統管理者 ≠ 超級權限

**系統管理者透過 Sheet 或 UI 操作，無法變更以下項目**：

| 項目 | 無法變更的原因 | 變更方式 |
|------|----------------|----------|
| `FINAL_APPROVERS` 清單 | 定義於 Code.gs 常數 | 修改程式碼 + 重新部署 |
| Internal / External 判斷邏輯 | Hard Code Domain | 修改程式碼 + 重新部署 |
| 授予 External 使用者審核權限 | 程式碼層級 Hard Gate | **無法變更**（設計禁止） |
| OTP / Session 有效期限 | 定義於 Code.gs 常數 | 修改程式碼 + 重新部署 |

### 6.2 無法透過 Sheet 設定產生的效果

| 設定動作 | v2.3 實際效果 |
|----------|---------------|
| 在 USERS_ACCESS 設定 role = VIEWER | **無效果**（v2.3 未檢查此角色） |
| 在 USERS_ACCESS 設定 role = CREATOR | **無效果**（v2.3 未檢查此角色） |
| 在 USERS_ACCESS 設定 role = ISSUER | **無效果**（v2.3 未檢查此角色） |
| 在 User_Company_Permission 設定 role 欄位 | **無效果**（v2.3 未使用此欄位） |
| 將 External 使用者設為 APPROVER | **無法審核**（Hard Gate 阻擋） |

### 6.3 明確否定清單

以下操作在 v2.3 **不可能達成**，無論如何設定 Sheet：

- ❌ 讓 External 使用者執行審核（核准/退回）
- ❌ 讓非 `FINAL_APPROVERS` 成員成為最終核准人
- ❌ 透過 Sheet 新增 FINAL_APPROVERS 成員
- ❌ 讓 VIEWER / CREATOR / ISSUER 角色產生實際權限差異

**結論**：系統管理者的權限範圍為「使用者帳號管理」與「公司授權設定」，**不包含**系統核心權限邏輯的調整。

---

# 三、PIN / OTP / Session 認證機制

## 1. PIN 驗證

| 項目 | 值 |
|------|-----|
| 儲存位置 | Admin_Users.pin_hash |
| 儲存格式 | SHA-256 Hash（64 字元 hex） |
| 驗證函數 | `verifyPin(email, pin, deviceId)` |
| 錯誤次數上限 | 5 次 |
| 鎖定時間 | 15 分鐘 |

### 1.1 PIN 生命週期

```
產生 → 使用 → 失效
  │      │      │
  │      │      └─ 管理者手動清空 pin_tmp
  │      └─ =PIN_HASH(pin_tmp) 產生 hash
  └─ 管理者手動輸入明文 PIN
```

### 1.2 首次 PIN 設定

| 步驟 | 操作者 | 說明 |
|------|--------|------|
| 1 | 管理者 | 在 Admin_Users 暫存欄位輸入明文 PIN |
| 2 | 管理者 | 使用 `=PIN_HASH(F2)` 產生 hash |
| 3 | 管理者 | **立即清空**暫存欄位 |
| 4 | 管理者 | 透過安全管道交付 PIN 給使用者 |

---

## 2. OTP 驗證

| 項目 | 值 |
|------|-----|
| 儲存位置 | Admin_OTP |
| 有效期限 | 15 分鐘（`OTP_EXPIRY_MS`） |
| 用途 | LOGIN（登入）/ PIN_RESET（PIN 變更） |
| 發送方式 | Email |

### 2.1 OTP 觸發時機

| 使用者類型 | 觸發時機 |
|-----------|----------|
| Internal | 新裝置首次登入 |
| External | 每次登入 |

### 2.2 管理者需知

- ❌ 一般情況下**不需操作** Admin_OTP 表
- OTP 過期後**無需手動清理**
- 若使用者收不到 OTP，請檢查 Email 地址是否正確

---

## 3. Session 管理

| 項目 | 值 |
|------|-----|
| 儲存位置 | Admin_Sessions |
| 有效期限 | 30 天（`DEVICE_SESSION_EXPIRY_MS`） |
| 識別方式 | token_hash + device_id |

### 3.1 強制登出

管理者可透過以下方式強制登出使用者：
1. 在 Admin_Sessions 表找到對應記錄
2. 將 `revoked` 欄位設為 `TRUE`

---

# 四、常見錯誤與結果

## 1. 新增使用者常見錯誤

| 錯誤情況 | 結果 |
|----------|------|
| Admin_Users 未填 email | 無法登入 |
| Admin_Users 未填 pin_hash | 無法登入（PIN 驗證失敗） |
| USERS_ACCESS 未填記錄 | 無法取得角色權限 |
| User_Company_Permission 未填記錄 | 公司選單為空 |
| email 大小寫不一致 | 系統可能無法正確比對 |

## 2. 權限相關錯誤

| 錯誤訊息 | 原因 | 解決方式 |
|----------|------|----------|
| `EXTERNAL_FORBIDDEN` | External 使用者嘗試審核 | 設計如此，無法授權 External 審核 |
| `OTP_REQUIRED` | 未完成 OTP 驗證 | 重新登入並完成 OTP 驗證 |
| `COMPANY_NOT_ALLOWED` | 無該公司存取權限 | 檢查 User_Company_Permission |
| `權限不足` | 帳號權限不足 | 檢查 USERS_ACCESS.role |

## 3. PIN 相關錯誤

| 錯誤情況 | 結果 |
|----------|------|
| PIN 錯誤超過 5 次 | 帳號鎖定 15 分鐘 |
| pin_hash 格式錯誤 | PIN 驗證永遠失敗 |
| 忘記清空 pin_tmp | 安全風險（明文 PIN 曝露） |

---

# 五、已知限制（v2.3 FREEZE）

## 1. 設計階段提案但未實作

| 設計 | v2.3 狀態 | 說明 |
|------|-----------|------|
| `APPROVER_WHITELIST` | ❌ 未採用 | 使用 `FINAL_APPROVERS` 常數 |
| `assertApprovalPermission_` | ❌ 未實作 | 後續安全強化項目 |
| `throwForbidden_` | ❌ 未實作 | 後續安全強化項目 |
| `logSecurityAudit` | ❌ 未實作 | 後續安全強化項目 |

## 2. 欄位存在但未使用

| Sheet | 欄位 | 狀態 |
|-------|------|------|
| Company_Profile | seal_file_id | Legacy，實際使用 stamp_file_id |
| User_Company_Permission | role | 被讀取但未參與邏輯判斷 |
| Quote_Status_Version | 全部 | 僅初始化時建立，無運行時使用 |

## 3. 角色未實際檢查

| 角色 | 說明 |
|------|------|
| VIEWER | 定義存在，未檢查 |
| CREATOR | 定義存在，未檢查 |
| ISSUER | 定義存在，未檢查 |

**結論**：v2.3 僅 `APPROVER` 角色實際生效。

---

# 六、稽核與追溯依據（v2.3 現況）

## 1. 報價單稽核欄位

| 欄位 | 說明 | 來源 Sheet |
|------|------|-----------|
| ref_id | 報價單唯一編號 | S005_QUOTES |
| submitted_by | 送審者 | S005_QUOTES |
| submitted_at | 送審時間 | S005_QUOTES |
| approved_by | 核准者 | S005_QUOTES |
| approved_at | 核准時間 | S005_QUOTES |
| rejected_by | 退回者 | S005_QUOTES |
| rejected_at | 退回時間 | S005_QUOTES |
| reject_reason | 退回原因 | S005_QUOTES |
| quotation_snapshot_json | 報價快照 | S005_QUOTES |

## 2. 責任鏈追溯

```
報價單建立 (submitted_by)
    ↓
送審 (submitted_at)
    ↓
核准 (approved_by, approved_at)
  或
退回 (rejected_by, rejected_at, reject_reason)
    ↓
發送 (狀態 SENT)
```

## 3. v2.3 無獨立稽核日誌表

| 項目 | v2.3 狀態 |
|------|-----------|
| 獨立 Audit Log 表 | ❌ 未實作 |
| 操作追溯 | 依賴 S005_QUOTES 欄位 |
| 登入記錄 | Admin_Sessions 有 last_active |

---

# 七、系統管理者手冊必備章節清單

## 建議手冊結構

1. **系統版本與 FREEZE 聲明**
   - v2.3 FREEZE 定義
   - 本手冊涵蓋範圍
   - 不含未來規劃聲明

2. **新增使用者前的準備資料**
   - 使用者 Email
   - 使用者顯示名稱
   - 初始 PIN（6 位數）
   - 指定角色
   - 授權公司代碼

3. **新增使用者實際操作步驟**
   - Step 1: 填寫 Admin_Users
   - Step 2: 填寫 USERS_ACCESS
   - Step 3: 填寫 User_Company_Permission
   - Step 4: 人工交付 PIN

4. **權限與角色說明**
   - 四種角色定義
   - v2.3 實際生效狀態（僅 APPROVER）
   - Internal / External 區分

5. **FINAL_APPROVERS 管理**
   - 定義位置（Code.gs 常數）
   - 新增/移除步驟
   - 需重新部署

6. **常見錯誤與解決方式**
   - 登入失敗
   - 權限不足
   - 公司選單為空

7. **已知限制**
   - 角色未實際檢查清單
   - 未使用欄位清單

8. **稽核與追溯**
   - 責任鏈欄位
   - 目前無獨立 Audit Log

9. **治理與責任聲明**
   - 系統不防呆所有錯誤
   - 管理者責任範圍
   - 設定錯誤的責任歸屬

---

# 八、治理與責任聲明

## 1. 治理優先原則

v2.3 的設計理念為**「治理優先於自動化」**。

| 原則 | 說明 |
|------|------|
| 人工為主 | 使用者帳號、公司設定、印章管理皆由管理者人工操作 |
| 系統不猜測 | 系統不會自動推論或補齊缺失的設定 |
| 錯誤不防呆 | 系統不會阻擋所有錯誤的 Sheet 設定 |
| 責任明確 | 設定錯誤由設定者負責，非系統設計問題 |

## 2. 系統不會自動阻擋的錯誤設定

以下設定錯誤，系統**不會**主動阻擋或警告：

| 錯誤設定 | 系統行為 | 後果 |
|----------|----------|------|
| email 欄位大小寫不一致 | 無警告 | 可能無法比對，導致權限異常 |
| company_code 不存在於 Company_Profile | 無警告 | 授權無效，公司選單不顯示 |
| pin_tmp 未清空 | 無警告 | 明文 PIN 曝露（安全風險） |
| 同一 email 在 USERS_ACCESS 重複 | 無警告 | 行為不可預期 |
| stamp_file_id 指向不存在的檔案 | 無警告（產生 PDF 時才會失敗） | 報價單印章顯示異常 |

## 3. 管理者責任範圍

### 3.1 管理者應負責

| 責任項目 | 說明 |
|----------|------|
| 使用者資料正確性 | 確保 email、display_name 正確 |
| 公司授權正確性 | 確保 User_Company_Permission 與 Company_Profile 一致 |
| PIN 安全管理 | 產生後清空 pin_tmp、安全交付明文 PIN |
| 印章檔案管理 | 確保 stamp_file_id 指向有效檔案 |
| 帳號停用 | 需主動將 status 設為 INACTIVE |

### 3.2 管理者不應期望系統做到

| 不應期望 | 原因 |
|----------|------|
| 自動驗證 email 格式 | 系統不檢查 |
| 自動驗證 company_code 存在 | 系統不檢查 |
| 自動清空 pin_tmp | 系統禁止存取此欄位 |
| 自動同步多表資料 | 系統不會跨表同步 |
| 自動停用離職員工 | 系統不知道誰離職 |

## 4. 設定錯誤的責任歸屬

| 情境 | 責任歸屬 |
|------|----------|
| 管理者設定錯誤導致使用者無法登入 | 管理者 |
| 管理者未清空 pin_tmp 導致密碼洩漏 | 管理者 |
| 管理者授權錯誤公司導致報價單建立在錯誤公司 | 管理者 |
| 管理者忘記將離職員工停用 | 管理者 |
| 系統設計導致 External 無法審核 | **非錯誤**（設計如此） |
| 系統設計導致 VIEWER 角色無實際效果 | **非錯誤**（v2.3 限制） |

## 5. 治理聲明

> **v2.3 FREEZE 系統的設定權責完全在管理者。**
>
> 系統不提供：
> - 設定驗證
> - 自動修正
> - 防呆機制
>
> 管理者必須：
> - 理解每個欄位的作用
> - 確保跨表資料一致
> - 為自己的設定負責
>
> 若因設定錯誤導致問題，應檢討設定流程，而非要求系統增加防呆。

---

# 附錄：標註說明

| 標註 | 說明 |
|------|------|
| ✅ 已實作 | v2.3 FREEZE 已實作並生效 |
| ❌ 未實作 | 設計提案但 v2.3 未實作 |
| ⚠️ 注意 | 重要提醒或安全警告 |
| SSOT | Single Source of Truth（唯一權威來源） |
| Legacy | 歷史遺留，不建議使用 |

---

**文件結束**

*本素材由赤兔馬（Claude Code）依據 HORUS-GOVERNANCE 權威文件盤點產出*
*初版日期：2026-01-12*
*補齊日期：2026-01-12（新增：系統管理者權限邊界、新增使用者啟用檢查清單、治理與責任聲明）*

---

# 附錄 A：Deployment Execution Identity 說明（重要）

## 1. 什麼是 Execution Identity

GAS Web App 有兩種執行身分設定：

| 設定 | 英文 | 效果 |
|------|------|------|
| 以擁有者身分執行 | Owner | 外部帳號的 email 會回傳空字串 |
| 以存取使用者身分執行 | User | 可正常取得外部帳號 email |

## 2. 對外部帳號登入的影響

| Execution Identity | 外部帳號能否登入 |
|--------------------|------------------|
| Owner | **無法登入**（無法取得 email，PIN 流程無法啟動） |
| User | **可以登入**（正常進入 PIN + OTP 流程） |

## 3. 重要注意事項

| 項目 | 說明 |
|------|------|
| 新增/管理使用者 | **不需要**重新部署 |
| 部署設定為 Owner | 外部帳號**無法登入**（OTP 流程也無法完成） |
| 變更部署設定 | 需要建立新的 Deployment |

## 4. 管理者不可自行更動的事項

| 項目 | 原因 |
|------|------|
| 部署設定（Execution Identity） | 需由系統開發者操作，錯誤設定會導致外部帳號全部無法登入 |
| Deployment ID | 變更後需更新所有使用此 URL 的地方 |

## 5. 相關裁定文件

`HORUS-GOVERNANCE/DECISIONS/DECISION-S005-DEPLOYMENT-EXECUTION-IDENTITY-v2.3.md`

---

*補齊日期：2026-01-12（新增：附錄 A - Deployment Execution Identity 說明）*
