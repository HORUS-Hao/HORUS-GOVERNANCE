# S005 / V005 Sheet Reality Check

**Audit ID**: V-USER-001-REALITY-CHECK
**Audit Date**: 2026-01-09
**Audit Type**: Read-Only Reality Verification
**Mode**: Structure + Code Analysis (無直接存取 Sheet 資料)

---

## 執行方法說明

本次審計透過分析程式碼中的：
1. 初始化函數（initDataSheets, initPermissionSheets）
2. getCompanyProfile() 預設值結構
3. Migration 腳本定義的欄位
4. Runtime 實際使用的 indexOf() 欄位

推斷 Sheet 結構與實際使用情況。

**限制**：無法直接讀取 Google Sheet 實際資料內容，僅能根據程式碼推斷。

---

## 1. USERS_ACCESS

### 1.1 程式碼定義的欄位結構

| 欄位名稱 | 來源 | 說明 |
|----------|------|------|
| email | initPermissionSheets():2951 | 使用者 Email |
| role | initPermissionSheets():2951 | 角色（VIEWER/CREATOR/ISSUER/APPROVER） |
| status | initPermissionSheets():2951 | 狀態 |

### 1.2 Runtime 使用分析

| 欄位 | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 實際用途 |
|------|-----------|-----------|-----------|-----------|----------|
| email | Yes (2705) | Yes (init) | Yes (1524) | No | 查詢鍵 |
| role | Yes (2706) | Yes (init) | Yes (1525) | No | APPROVER 判斷 |
| status | Yes (2707) | Yes (init) | Yes (1526) | No | 帳號狀態 |

### 1.3 role 欄位預期值

根據 ROLES 常數定義 (S005:96-101, V005:39-44)：

| 值 | 說明 | Runtime 使用 |
|----|------|-------------|
| VIEWER | 僅檢視 | 未見明確檢查 |
| CREATOR | 建立報價單 | 未見明確檢查 |
| ISSUER | 建立 + 發送 | 未見明確檢查 |
| APPROVER | 核准 + 印章管理 | **V005 isUserApprover() 檢查** |

### 1.4 治理認知 vs 程式碼現況

| 項目 | 治理文件認知 | 程式碼實況 | 差異 |
|------|-------------|-----------|------|
| USERS_ACCESS 為主要權限表 | FACT-REGISTRY-v0.md 記載 | **V005 使用，S005 部分使用** | S005 主要用 User_Company_Permission |
| role 控制建立報價權限 | 隱含假設 | **未實作**，S005 用 allowedCompanies | 需補文件說明 |
| role 控制審核權限 | 文件記載 | **V005 有實作** isUserApprover() | 一致 |

### 1.5 潛在風險

| 風險 | 說明 | 嚴重度 |
|------|------|--------|
| role 欄位語義模糊 | VIEWER/CREATOR/ISSUER 未被 Runtime 檢查 | 低 |
| S005 不檢查 USERS_ACCESS | External 建立報價不經過此表 | 資訊（設計如此） |

---

## 2. User_Company_Permission

### 2.1 程式碼定義的欄位結構

| 欄位名稱 | 來源 | 說明 |
|----------|------|------|
| user_email | initDataSheets():442 | 使用者 Email |
| company_code | initDataSheets():442 | 公司代碼 |
| role | initDataSheets():442 | 角色（初始化資料為 'admin'） |

### 2.2 初始化範例資料

```
V005 initDataSheets():443-444
['hao.chang@horus.tw', 'HORUS', 'admin']
['hao.chang@horus.tw', 'DAPANDA', 'admin']
```

### 2.3 Runtime 使用分析

| 欄位 | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 實際用途 |
|------|-----------|-----------|-----------|-----------|----------|
| user_email | Yes (1566) | No | No | Yes (init) | 查詢鍵 |
| company_code | Yes (1567) | No | No | Yes (init) | **授權公司** |
| role | Yes (1568) | No | No | Yes (init) | **讀取但未使用於邏輯** |

### 2.4 關鍵發現：role 欄位未使用

```javascript
// S005 getUserAllowedCompanies():1566-1577
var emailIdx = permHeaders.indexOf('user_email');
var codeIdx = permHeaders.indexOf('company_code');
var roleIdx = permHeaders.indexOf('role');  // ← 讀取

for (var i = 1; i < permData.length; i++) {
  if (permData[i][emailIdx] === userEmail) {
    userCompanyCodes.push({
      code: permData[i][codeIdx],
      role: permData[i][roleIdx]  // ← 存入但...
    });
  }
}

// 回傳後的 allowedCompanies 中的 role 未被任何邏輯使用
```

### 2.5 欄位有效性標示

| 欄位 | Runtime 狀態 | 說明 |
|------|-------------|------|
| user_email | **有效** | 查詢必要欄位 |
| company_code | **有效** | 授權檢查核心 |
| role | **無效（冗餘）** | 被讀取但未參與任何判斷 |

### 2.6 治理認知 vs 程式碼現況

| 項目 | 治理文件認知 | 程式碼實況 | 差異 |
|------|-------------|-----------|------|
| role 欄位用途 | 未明確記載 | 讀取但未使用 | 需決定：移除或實作 |
| 此表為公司授權主表 | 未明確記載 | **實際如此** | 需補文件 |

---

## 3. Company_Profile

### 3.1 程式碼定義的欄位結構

**初始化欄位** (V005 initDataSheets():428)：
```
company_code, company_name, template_code, seal_file_id, mail_footer
```

**Migration v1.1 補齊欄位** (V005 migrateCompanyProfile_v1_1():488-499)：
```
contact_person, contact_phone, contact_email, contact_address, tax_id
```

**Security Fix 新增** (S005 migrateCompanyProfile_SecurityFix():2214)：
```
stamp_file_id
```

**Phase 5-B 新增** (S005:3985)：
```
supervisor_emails
```

### 3.2 完整欄位清單（程式碼推斷）

| 欄位名稱 | 初始化 | Migration | 用途 | Runtime 狀態 |
|----------|--------|-----------|------|-------------|
| company_code | v1.0 | - | 公司識別碼 | **有效** |
| company_name | v1.0 | - | 公司名稱 | **有效** |
| template_code | v1.0 | - | 報價單版型 | **有效** |
| seal_file_id | v1.0 | - | 印章（舊） | **Legacy** |
| mail_footer | v1.0 | - | Mail 簽名 | **有效** |
| contact_person | - | v1.1 | 聯絡人 | **有效** |
| contact_phone | - | v1.1 | 電話 | **有效** |
| contact_email | - | v1.1 | Email | **有效** |
| contact_address | - | v1.1 | 地址 | **有效** |
| tax_id | - | v1.1 | 統編 | **有效** |
| stamp_file_id | - | Security Fix | 印章 Drive ID | **有效（主要）** |
| supervisor_emails | - | Phase 5-B | 監管人 Email | **有效** |

### 3.3 seal_file_id vs stamp_file_id

| 欄位 | 建立時間 | Runtime 讀取 | Runtime 寫入 | 狀態 |
|------|----------|-------------|-------------|------|
| seal_file_id | 初始化 v1.0 | 在 defaultProfile 中 | No | **Legacy（未使用）** |
| stamp_file_id | Security Fix | **Yes（主要）** | Migration | **Active（主要印章欄位）** |

**程式碼證據**：
```javascript
// S005 getCompanyProfile():432-434
seal_file_id: '',      // 存在於 defaultProfile 但...
stamp_file_id: ''      // Security Fix: Drive File ID（取代 stamp_image_url）

// 實際使用：
companyProfile.stamp_file_id  // ← 核准時使用此欄位
```

### 3.4 預期公司配置（根據初始化腳本）

| company_code | company_name | template_code | 初始化來源 |
|--------------|--------------|---------------|-----------|
| HORUS | 荷魯斯國際有限公司 | TEMPLATE_A | initDataSheets():429 |
| DAPANDA | 大鵬達有限公司 | TEMPLATE_B* | initDataSheets():430 + migrateToTemplateB():591 |

*註：DAPANDA 初始為 TEMPLATE_A，後由 migrateToTemplateB() 改為 TEMPLATE_B

### 3.5 MAAI 公司配置

**程式碼搜尋結果**：無 MAAI 相關初始化或設定。

| 項目 | 狀態 |
|------|------|
| MAAI 在初始化腳本 | **不存在** |
| MAAI 在 Migration 腳本 | **不存在** |
| MAAI 可能存在於 Sheet | **未知（需人工確認）** |

### 3.6 治理認知 vs 程式碼現況

| 項目 | 治理文件認知 | 程式碼實況 | 差異 |
|------|-------------|-----------|------|
| 印章欄位 | 未明確區分 | seal_file_id (Legacy) vs stamp_file_id (Active) | 需補文件說明 Legacy |
| MAAI 公司 | 測試模板提及 | 程式碼無定義 | 需確認 Sheet 實況 |

---

## 4. 治理認知 vs Sheet 現況 差異總表

| 表名 | 欄位/項目 | 治理認知 | 程式碼實況 | 建議行動 |
|------|----------|----------|-----------|----------|
| USERS_ACCESS | role 控制建立權限 | 隱含假設 | **未實作** | 補文件說明 |
| User_Company_Permission | role 欄位 | 未記載 | **讀取但未使用** | 決定移除或實作 |
| User_Company_Permission | 為公司授權主表 | 未明確 | **實際如此** | 補文件說明 |
| Company_Profile | seal_file_id | 未區分 | **Legacy 未使用** | 補文件標示 |
| Company_Profile | stamp_file_id | 未明確 | **Active 主要欄位** | 補文件說明 |
| Company_Profile | MAAI 公司 | 測試提及 | **程式碼無定義** | 人工確認 Sheet |
| EXTERNAL_ACCESS | 測試模板引用 | 存在 | **不存在** | 修正測試模板 |

---

## 5. 使用者/管理者誤操作風險

### 5.1 高風險

| 風險 | 說明 | 影響 |
|------|------|------|
| 修改 seal_file_id 以為有效 | 管理員可能誤以為此欄位控制印章 | 印章不會變更，實際需改 stamp_file_id |
| 設定 User_Company_Permission.role | 管理員設定 role 期望控制權限 | **無效果**，role 未被使用 |

### 5.2 中風險

| 風險 | 說明 | 影響 |
|------|------|------|
| USERS_ACCESS.role 設定非 APPROVER | 管理員期望限制審核權限 | **有效**，但僅影響 V005 顯示審核按鈕 |
| 新增公司未設定 stamp_file_id | 僅設定公司基本資料 | 核准時無印章，可能出錯 |

### 5.3 低風險

| 風險 | 說明 | 影響 |
|------|------|------|
| USERS_ACCESS 設定 VIEWER/CREATOR/ISSUER | 管理員期望分級權限 | **無效果**，僅 APPROVER 有實際檢查 |

---

## 6. 結論與建議

### 6.1 僅需補文件（不需程式調整）

| 項目 | 說明 |
|------|------|
| seal_file_id 標示為 Legacy | 文件明確說明此欄位已棄用 |
| stamp_file_id 說明 | 文件說明此為 Security Fix 後的主要印章欄位 |
| User_Company_Permission 功能說明 | 文件說明此表控制「可代表哪些公司建立報價」 |
| USERS_ACCESS 功能說明 | 文件說明此表僅 APPROVER 角色有實際效果 |
| EXTERNAL_ACCESS 參照修正 | 測試模板應改為 User_Company_Permission |

### 6.2 未來可能需程式調整（不執行）

| 項目 | 說明 | 優先級 |
|------|------|--------|
| User_Company_Permission.role 欄位 | 決定移除或實作功能 | 低 |
| USERS_ACCESS VIEWER/CREATOR/ISSUER | 決定是否實作分級權限 | 低 |
| seal_file_id 欄位 | 可考慮移除或保留相容 | 極低 |

### 6.3 需人工確認的項目

| 項目 | 確認方式 |
|------|----------|
| MAAI 公司是否存在於 Company_Profile | 開啟 Google Sheet 確認 |
| 各公司 stamp_file_id 是否已設定 | 開啟 Google Sheet 確認 |
| USERS_ACCESS 實際 role 值分布 | 開啟 Google Sheet 確認 |
| User_Company_Permission 實際內容 | 開啟 Google Sheet 確認 |

---

## 7. 附錄：關鍵程式碼位置

| 函數 | 檔案 | 行號 | 用途 |
|------|------|------|------|
| initPermissionSheets() | S005 Code.gs | 2944-2979 | 建立 USERS_ACCESS 等表 |
| initDataSheets() | V005 Code.gs | 420-468 | 建立 Company_Profile 等表 |
| getUserAllowedCompanies() | S005 Code.gs | 1557-1609 | 讀取 User_Company_Permission |
| getCompanyProfile() | S005 Code.gs | 418-455 | 讀取 Company_Profile |
| getUserRole() | S005 Code.gs | 2694-2722 | 讀取 USERS_ACCESS |
| isUserApprover() | V005 Code.gs | 1635-1660 | 檢查 APPROVER 角色 |
| migrateCompanyProfile_v1_1() | V005 Code.gs | 478-517 | 補齊聯絡資訊欄位 |
| migrateCompanyProfile_SecurityFix() | S005 Code.gs | 2201-2230 | 新增 stamp_file_id |

---

*Audit completed: 2026-01-09*
*This is a read-only reality check. No modifications were made to any Sheet or code.*
