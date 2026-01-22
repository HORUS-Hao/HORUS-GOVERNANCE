# Multi-User Governance

- Module: GLOBAL
- File: GOVERNANCE-MULTI-USER.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Active**

---

## 一、Purpose（目的與適用範圍）

本文件定義 HORUS-PDM 系統中「多使用者」治理模型之概念與邊界。

**適用範圍**：
- 所有涉及使用者識別、權限控制、角色判斷之模組
- S005、V005 及其他依賴使用者身分之服務

**目的**：
- 確立使用者作為操作主體之基本單位
- 定義使用者與公司之關係
- 規範角色模型與權限邊界

---

## 二、User 定義

### 2.1 UserId（使用者識別碼）

| 屬性 | 說明 |
|------|------|
| 識別方式 | `user_id`（UUID）或 `email`（唯一） |
| 主要識別 | `email`（小寫，去除空白） |
| 來源 | `Admin_Users.email` |
| 不可變性 | Email 一經建立不得變更 |

### 2.2 User 屬性

| 屬性 | 說明 |
|------|------|
| `user_id` | 使用者 UUID |
| `email` | 使用者 Email（唯一識別） |
| `display_name` | 顯示名稱 |
| `pin_hash` | PIN 雜湊值 |
| `failed_attempts` | 登入失敗次數 |
| `locked_until` | 鎖定到期時間 |

### 2.3 所屬 Company

- 使用者與公司之關係由 `USER_COMPANIES` 定義
- 一位使用者可被授權操作多家公司
- 使用者對每家公司之角色由 `USERS_ACCESS` 定義

---

## 三、角色模型

### 3.1 角色定義

| 角色 | 代碼 | 說明 |
|------|------|------|
| Owner | `APPROVER` | 最高權限，可核准、管理印章 |
| Operator | `ISSUER` | 可建立、發送報價單 |
| Operator | `CREATOR` | 可建立報價單 |
| Viewer | `VIEWER` | 僅可檢視 |

### 3.2 角色層級

```
APPROVER > ISSUER > CREATOR > VIEWER
```

- 高層級角色隱含低層級權限
- APPROVER 可執行 ISSUER、CREATOR、VIEWER 之操作
- ISSUER 可執行 CREATOR、VIEWER 之操作

### 3.3 角色職責

| 角色 | 建立報價 | 發送報價 | 核准/退回 | 印章管理 |
|------|----------|----------|-----------|----------|
| APPROVER | ✅ | ✅ | ✅ | ✅ |
| ISSUER | ✅ | ✅ | ❌ | ❌ |
| CREATOR | ✅ | ❌ | ❌ | ❌ |
| VIEWER | ❌ | ❌ | ❌ | ❌ |

---

## 四、使用者與公司關係

### 4.1 關聯模型

- 一位使用者可關聯多家公司
- 每個關聯需指定角色
- 關聯定義於 `USER_COMPANIES` 與 `USERS_ACCESS`

### 4.2 關聯屬性

| 屬性 | 說明 |
|------|------|
| `email` | 使用者 Email |
| `company_code` | 公司識別碼 |
| `role` | 該使用者對該公司之角色 |
| `status` | 關聯狀態（ACTIVE / INACTIVE） |

### 4.3 關聯原則

- 使用者登入後，可操作所有已授權公司
- 操作報價單時，權限依據該報價單所屬公司之授權角色
- 無授權之公司資料不可見、不可操作

---

## 五、權限邊界（禁止事項）

以下行為 **絕對禁止**：

| 禁止事項 | 說明 |
|----------|------|
| 越權操作 | 不得執行超出角色權限之操作 |
| 冒用身分 | 不得以他人身分執行操作 |
| 繞過驗證 | 不得繞過 PIN / OTP / Session 驗證 |
| 未授權存取 | 不得存取未授權公司之資料 |
| 角色自升 | 使用者不得自行提升角色 |

---

## 六、與人工核准、狀態機的關係

### 6.1 人工核准

- 報價單核准需由具備 `APPROVER` 角色之使用者執行
- 核准操作記錄核准人 Email 與時間
- 非 `APPROVER` 角色不可執行核准操作

### 6.2 狀態機

- 狀態轉移操作受角色限制
- `DRAFT → SUBMITTED`：CREATOR 以上可執行
- `SUBMITTED → APPROVED`：僅 APPROVER 可執行
- `APPROVED → SENT`：ISSUER 以上可執行

### 6.3 審計追蹤

- 所有狀態轉移記錄操作人 Email
- 核准/退回記錄於 `approved_by` / `rejected_by`
- 發送記錄於 Mail 日誌

---

## 七、生效與裁定方式

### 7.1 生效條件

本文件自 2026-01-08 起生效，適用於所有 HORUS-PDM 模組。

### 7.2 變更裁定

- 本文件之變更需經 Architect 明確裁定
- 角色定義變更需同步更新所有相關模組

### 7.3 例外處理

- 本文件不授權任何例外
- 如有特殊需求，需另行建立裁定文件

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立 |

