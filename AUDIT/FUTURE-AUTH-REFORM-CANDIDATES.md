# 未來可能要改，但現在不動

**Audit Date**: 2026-01-09
**Status**: 僅列清單，不執行

---

## 說明

本清單列出「技術債」或「設計落差」項目，供未來決策參考。

**現階段不執行任何修改。**

---

## 1. 權限架構類

### 1.1 User_Company_Permission.role 欄位

| 項目 | 說明 |
|------|------|
| 現況 | 欄位存在，被讀取，但未參與任何邏輯判斷 |
| 風險 | 低 — 無功能影響，僅冗餘 |
| 候選動作 | 移除欄位 / 實作欄位功能 |
| 影響範圍 | User_Company_Permission 表、getUserAllowedCompanies() |

### 1.2 USERS_ACCESS VIEWER/CREATOR/ISSUER 角色

| 項目 | 說明 |
|------|------|
| 現況 | 角色定義存在，但無對應權限檢查 |
| 風險 | 中 — 管理員可能設定錯誤角色期望有效果 |
| 候選動作 | 實作分級權限 / 移除未使用角色 |
| 影響範圍 | USERS_ACCESS 表、checkPermission()、checkApproverPermission_() |

### 1.3 USER_COMPANIES 與 User_Company_Permission 並存

| 項目 | 說明 |
|------|------|
| 現況 | 兩表功能重疊，USER_COMPANIES 可能為 Legacy |
| 風險 | 低 — 目前未造成衝突 |
| 候選動作 | 合併 / 棄用其一 / 明確分工 |
| 影響範圍 | initPermissionSheets()、可能的未來查詢 |

---

## 2. 欄位清理類

### 2.1 seal_file_id (Legacy)

| 項目 | 說明 |
|------|------|
| 現況 | Company_Profile 中存在，但 Runtime 使用 stamp_file_id |
| 風險 | 中 — 管理員可能誤改此欄位 |
| 候選動作 | 移除欄位 / 保留相容但標示棄用 |
| 影響範圍 | Company_Profile 表、V005 initDataSheets() |

### 2.2 Quote_Status_Version 表

| 項目 | 說明 |
|------|------|
| 現況 | 初始化時建立，無 Runtime 使用 |
| 風險 | 極低 — 無功能影響 |
| 候選動作 | 移除 / 實作版本控制功能 |
| 影響範圍 | V005 initDataSheets() |

---

## 3. Hard Code 類

### 3.1 INTERNAL_DOMAINS Hard Code

| 項目 | 說明 |
|------|------|
| 現況 | `['horus.tw', 'dapanda.com.tw']` 寫死於程式碼 |
| 風險 | 低 — 新增公司需改 Code |
| 候選動作 | 改為讀取 Company_Profile 的 domain 欄位 |
| 影響範圍 | S005:144-147、isInternalUser_() |

### 3.2 Fallback 管理員 Email Hard Code

| 項目 | 說明 |
|------|------|
| 現況 | `hao.chang@horus.tw`, `hao.chang@dapanda.com.tw` 多處寫死 |
| 風險 | 低 — 人員異動需改 Code |
| 候選動作 | 改為讀取 Company_Profile.supervisor_emails |
| 影響範圍 | S005:172-173, 181-182, 2314, 3432-3433；V005:1398-1399 |

---

## 4. 表結構類

### 4.1 USERS_ACCESS 與 User_Company_Permission 分工不明

| 項目 | 說明 |
|------|------|
| 現況 | USERS_ACCESS 管角色，User_Company_Permission 管公司授權 |
| 風險 | 中 — 文件未清楚說明，易混淆 |
| 候選動作 | 合併為單表 / 保持分離但補文件 |
| 影響範圍 | 權限架構設計 |

### 4.2 Admin_* 表與 USERS_ACCESS 重疊

| 項目 | 說明 |
|------|------|
| 現況 | Admin_Users 存 email/pin，USERS_ACCESS 存 email/role |
| 風險 | 低 — 目前設計如此 |
| 候選動作 | 評估是否合併 user 識別 |
| 影響範圍 | 登入與權限架構 |

---

## 5. 風險等級總覽

| 風險等級 | 項目數 | 說明 |
|----------|--------|------|
| 高 | 0 | 無立即風險 |
| 中 | 3 | 可能造成誤操作或混淆 |
| 低 | 5 | 技術債，暫無影響 |
| 極低 | 1 | 可忽略 |

---

## 6. 建議優先順序（僅供參考，不執行）

| 順序 | 項目 | 理由 |
|------|------|------|
| 1 | seal_file_id 處理 | 避免管理員誤操作 |
| 2 | ROLES 生效範圍說明 | 避免權限設定誤解 |
| 3 | User_Company_Permission.role | 決定移除或實作 |
| 4 | Hard Code Domain | 擴展性考量 |
| 5 | 其他 | 優先級低 |

---

*此清單僅供未來決策參考，現階段不執行任何修改。*
