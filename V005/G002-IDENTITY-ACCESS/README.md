# G002-IDENTITY-ACCESS
Identity and Access Governance Module for V005

## 1. Purpose（模組目的）

本模組用於定義 **V005 系統的身份識別與存取控制治理層**，
建立 Company（公司）與 User（使用者）的治理定義，以及角色權限的邊界規則。

本模組為治理憲法級文件，僅描述「治理定義」，不涉及任何工程實作。

## 2. Core Governance Principles（核心治理原則）

以下原則為不可違反之最高準則：

- **不可進核心原則**：任何身份與存取控制邏輯不得進入 V005 核心程式碼
- **不可硬寫權限原則**：權限判斷不得以硬編碼方式寫入任何模組
- **唯讀治理原則**：本模組僅定義治理規則，不執行任何資料寫入或狀態變更
- **邊界隔離原則**：身份與存取控制必須與業務邏輯完全隔離

## 3. Company Governance Definition（Company 的治理定義）

### 3.1 Company 定義
Company 為系統中的公司實體，代表一個獨立的業務組織單位。

### 3.2 Company 屬性
- Company 必須具備唯一識別碼（company_code）
- Company 必須具備正式名稱（company_name）
- Company 為資料隔離的基本單位

### 3.3 Company 治理規則
- 每個 Company 擁有獨立的資料邊界
- Company 之間不得跨域存取資料
- Company 的建立與變更需經由治理流程，不得由系統自動產生

## 4. User Governance Definition（User 的治理定義）

### 4.1 User 定義
User 為系統中的使用者實體，代表一個可登入並操作系統的個人身份。

### 4.2 User 屬性
- User 必須具備唯一識別碼（user_email）
- User 必須與至少一個 Company 建立關聯
- User 在每個 Company 中必須被賦予明確的角色

### 4.3 User 治理規則
- User 的身份識別以 Email 為唯一依據
- User 必須明確歸屬於特定 Company，不得存在「無 Company 歸屬」的 User
- User 在同一 Company 中僅能擁有一個角色
- User 可跨多個 Company，但每個 Company 的角色需獨立定義

## 5. Role Definition（角色定義）

本模組僅定義以下三種角色，不得新增其他角色：

### 5.1 OWNER（擁有者）
- 擁有 Company 的完整控制權
- 可管理 Company 內的所有 User 與角色分配
- 可設定 Company 層級的系統參數
- 可存取 Company 內的所有資料與功能

### 5.2 OPERATOR（操作者）
- 可執行 Company 內的業務操作
- 可建立、修改、查詢 Company 內的業務資料
- 不得管理 User 或角色分配
- 不得修改 Company 層級的系統參數

### 5.3 VIEWER（檢視者）
- 僅可檢視 Company 內的資料
- 不得建立、修改、刪除任何資料
- 不得執行任何業務操作
- 不得存取系統管理功能

### 5.4 角色繼承規則
- 角色權限為明確列舉，不支援繼承或組合
- 每個角色權限範圍必須明確界定，不得模糊

## 6. Boundary Relationship（邊界關係）

### 6.1 與 V005 的邊界關係
- V005 為業務邏輯層，不得包含身份識別與存取控制邏輯
- V005 必須透過本模組定義的治理規則進行權限判斷
- V005 不得自行定義或擴充角色類型
- V005 不得硬寫任何使用者或 Company 的權限判斷

### 6.2 與 G001 的邊界關係
- G001（HUMAN-APPROVAL）為人工核准治理層，與本模組為平行關係
- G001 的核准流程需遵循本模組定義的角色權限
- G001 不得自行定義或修改角色權限
- 兩個模組共同構成 V005 的治理層，但職責明確分離

### 6.3 治理層級關係
```
V005 (業務邏輯層)
    ↓ 遵循
G002 (身份存取治理層) + G001 (人工核准治理層)
    ↓ 定義
Company / User / Role (治理實體)
```

## 7. Explicit Prohibitions（明確禁止事項）

以下事項明確禁止，任何違反視為治理破壞：

### 7.1 禁止進入核心
- ❌ 禁止將身份識別邏輯寫入 V005 核心程式碼
- ❌ 禁止將存取控制判斷嵌入業務函數中
- ❌ 禁止在 V005 中直接查詢或判斷使用者角色

### 7.2 禁止硬寫權限
- ❌ 禁止在程式碼中以硬編碼方式寫入特定使用者或 Company 的權限
- ❌ 禁止使用 Email 白名單或黑名單進行權限控制
- ❌ 禁止在條件判斷中直接比對使用者 Email 或 Company Code

### 7.3 禁止擴充角色
- ❌ 禁止新增 OWNER / OPERATOR / VIEWER 以外的角色
- ❌ 禁止建立角色繼承或角色組合機制
- ❌ 禁止為特定功能建立臨時角色

### 7.4 禁止跨邊界操作
- ❌ 禁止 Company 之間跨域存取資料
- ❌ 禁止 User 存取未授權的 Company 資料
- ❌ 禁止在未經治理流程的情況下建立 Company 或 User 關聯

## 8. Enforcement（執行機制）

任何違反以上治理規則之實作，視為治理破壞，需立即回滾。

本模組為治理憲法級文件，所有實作必須嚴格遵循，不得以「技術需求」或「業務需求」為由違反治理原則。

---

## Stamp Governance（多印章治理）

### 1. 语意定位
Stamp 为经授权使用的象征性资源，
不等同于权限（Permission）、状态（State）或文件（File）。

### 2. Company 边界规则
- stamp.company_id ≠ user.company_id → 禁止套用

### 3. 角色限制
- OWNER → 允许套用
- OPERATOR → 禁止套用
- VIEWER → 禁止套用

### 4. 状态限制
- stamp.status ≠ ACTIVE → 禁止套用

### 5. 系统边界声明
- Stamp 仅影响输出呈现（如 PDF / Viewer）
- 不回写 V005 核心状态
- 不参与状态机判断
