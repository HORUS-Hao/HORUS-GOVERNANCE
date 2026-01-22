# Decision: S005 Deployment Execution Identity Fix

**Decision ID**: DECISION-S005-DEPLOYMENT-EXECUTION-IDENTITY-v2.3
**Date**: 2026-01-12
**Status**: Approved
**Scope**: S005 Web App Deployment
**Version**: v2.3 FREEZE（程式碼未異動）

---

## 1. 問題描述

### 1.1 現象
外部帳號（非 `@horus.tw` / `@dapanda.com.tw`）無法登入 S005 系統。
Console 顯示：
```
Native login result: {"allowedCompanies":[],"email":""}
```

### 1.2 根本原因

| 項目 | 說明 |
|------|------|
| 部署設定 | Web App 設定為「以擁有者身分執行」(owner-run) |
| GAS 行為 | `Session.getActiveUser().getEmail()` 對外部帳號回傳空字串 |
| 結果 | 外部帳號無法取得 email，無法進入 PIN 登入流程 |

**此為 GAS 安全模型行為，不是程式 bug。**

---

## 2. 解決方案

### 2.1 修正內容

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| Execution Identity | 以擁有者身分執行 (owner-run) | 以存取使用者身分執行 (user-run) |
| 存取權限 | 所有人 | 所有人（不變） |

### 2.2 修正性質

| 項目 | 說明 |
|------|------|
| 類型 | Deployment Configuration Fix |
| 程式碼異動 | **無**（Code.gs / Entry.html 完全未改） |
| 版本升級 | **否**（仍為 v2.3 FREEZE） |

---

## 3. 技術說明

### 3.1 GAS Execution Identity 差異

| 設定 | Session.getActiveUser().getEmail() | 適用情境 |
|------|-------------------------------------|----------|
| owner-run | 外部使用者回傳空字串 | 內部系統、不需識別使用者 |
| user-run | 回傳實際使用者 email | 需識別外部使用者 |

### 3.2 為何 v2.3 需要 user-run

S005 外部帳號登入流程：
1. `getCurrentUser()` 取得 email
2. 判斷為外部帳號 → 顯示 PIN 輸入框
3. 使用者輸入 PIN → 驗證 → OTP 流程

**若 email 為空，流程無法啟動。**

---

## 4. Deployment 記錄

| 項目 | 值 |
|------|-----|
| 新 Deployment ID | `【待填入】` |
| 建立時間 | 2026-01-12 |
| Execution Identity | User (存取使用者身分) |
| 用途 | External Account Login Fix |
| Version Lineage | v2.3 FREEZE (no code change) |

> 舊 Deployment 保留不刪除，供歷史追溯。

---

## 5. 影響評估

| 項目 | 影響 |
|------|------|
| Internal 使用者 | 無影響 |
| External 使用者 | 可正常登入（PIN + OTP 流程） |
| 現有 Session | 需重新登入（Deployment 變更） |
| 程式碼 | 完全未異動 |

---

## 6. 裁定聲明

### 6.1 v2.3 FREEZE 合法性

本修正**不屬於程式版本升級**：
- 未修改任何 `.gs` / `.html` / `.js` 檔案
- 僅調整 GAS Deployment Configuration
- 仍視為 v2.3 FREEZE 範疇內的合法修正

### 6.2 文件引用

版本定義請參閱：
`HORUS-GOVERNANCE/RELEASES/S005_V005/v2.3_FREEZE/S005_V005_RELEASE_v2.3_FREEZE.md`

---

*本決策由 Architect 裁定，2026-01-12 生效*
