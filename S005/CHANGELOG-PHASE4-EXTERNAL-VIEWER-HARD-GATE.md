# Change Log: Phase 4 External VIEWER Hard Gate

**Version**: Phase 4 (4-A / 4-B / 4-C)
**Date**: 2026-01-09
**Scope**: S005 / V005
**Branch**: `feature/s005-v1.5-identity-patch`
**最後更新**: 2026-01-12

---

## 版本引用聲明

> **重要**：本文件記錄 Phase 4 變更歷史，不宣稱系統版本。
>
> S005/V005 系統版本定義請參閱：
> `HORUS-GOVERNANCE/RELEASES/S005_V005/v2.3_FREEZE/S005_V005_RELEASE_v2.3_FREEZE.md`
>
> 若本文件與權威文件衝突，以權威文件為準。

---

## 1. Phase 4 各階段內容

| Phase | 名稱 | 內容 |
|-------|------|------|
| Phase 4-A | Server Gate | V005 Code.gs `submitForApproval()` 新增 `isInternalUser_()` 檢查，External 返回 403 EXTERNAL_FORBIDDEN |
| Phase 4-B | External Creator Write Gate | S005 Code.gs `processSubmission()` 新增分支：Internal 走原邏輯，External 走 OTP + allowedCompanies |
| Phase 4-C | UI Guard | V005_Viewer.html 新增 `IS_INTERNAL` 判斷，External 隱藏審核工具列 |

---

## 2. 主要修改檔案與位置

### S005 Code.gs（Phase 4-B）

```
位置：processSubmission() Line 225-280
新增：
- isInternalUser_(userEmail) 判斷
- Internal：原邏輯 checkPermission()
- External：hasValidOtpSession_() + getUserAllowedCompanies() 檢查
```

### V005 Code.gs（Phase 4-A）

```
位置：submitForApproval() Line 890+
新增：
- assert isInternalUser_(userEmail) === true
- 否則 throw Error('權限不足: EXTERNAL_FORBIDDEN')
```

### V005_Viewer.html（Phase 4-C）

```
位置：Line 1464-1473（IS_INTERNAL 定義）
位置：Line 1567（canShowReviewToolbar 條件）
新增：
- INTERNAL_DOMAINS = ['horus.tw', 'dapanda.com.tw']
- IS_INTERNAL = domain check
- cond4 = IS_INTERNAL 加入 toolbar 可見性判斷
```

---

## 3. Commit Hash 清單

| Commit | 內容 |
|--------|------|
| `32b2de2` | Phase 4-B External Creator Write Gate (S005 Code.gs) |
| `42b082d` | Phase 4-C UI Guard (V005_Viewer.html) |
| `e46aab5` | Update V005_URL to @83 in Entry.html |
| `0702499` | Update V005_BASE_URL in Code.gs to @83 |

---

## 4. Hotfix 記錄

### Entry.html 覆蓋事件

| 項目 | 說明 |
|------|------|
| 問題 | clasp pull 覆蓋了 Entry.html，導致 GIS_CLIENT_ID 為 PENDING 造成登入失敗 |
| 發現 | 新部署 @96 無法登入，但舊版 @86/@91 可以 |
| 原因 | @86 使用 v1.7.8 PIN+OTP 登入，git 版本使用 v1.5 GIS 登入（CLIENT_ID 未設定） |
| 解法 | 從 @86 pull 回 v1.7.8 Entry.html，更新 V005_URL 到 @83，重新 push |
| 最終版本 | S005 @97 |

---

## 5. 影響評估

| 項目 | 影響 |
|------|------|
| Internal 流程是否變動 | 否，完全不變 |
| Internal 使用者體驗 | 無變化，原有權限與流程維持 |
| External 行為限制 | 新增限制：無法審核，UI 隱藏審核工具列 |
| External 建立報價單 | 可行，需 OTP + allowedCompanies |

---

## 6. 部署版本（歷史記錄）

> **注意**：以下為 Phase 4 實施當時的部署版本，僅供歷史參考。
> 最新部署資訊請參閱權威文件。

| 模組 | 版本 | Deployment ID |
|------|------|---------------|
| S005 | @97 | `AKfycbzUTNutekgaLpPo3vU0TaCARX6wnvNpLZNKEb8_AfL_BEtwPifwnt6e7rac3i-3075M` |
| V005 | @83 | `AKfycbzRYOPoIWMZJLDYS0fyI1ikpSVm5SvqktkPOgg7EVvjT0leiYSs_Xh5st7TMLRKdTw` |

---

## 7. 相關文件

| 文件 | 路徑 |
|------|------|
| 決策文件 | `HORUS-GOVERNANCE/DECISIONS/DECISION-V005-EXTERNAL-VIEWER-HARD-GATE.md` |
| 驗證紀錄 | `HORUS-GOVERNANCE/TESTING/TEST-EXTERNAL-VIEWER-HARD-GATE-2026-01-09.md` |

---

## 8. v2.3 FREEZE 裁定補充（2026-01-11）

### 8.1 IS_INTERNAL UI Guard 已移除裁定

v2.3 FREEZE 起，V005 UI Guard **不再區分 Internal / External**，
僅以 Server-side Role（`IS_APPROVER`）與 `REVIEW_MODE` 為準。
原 `IS_INTERNAL` 判斷已於後續版本移除，UI Guard 條件簡化為 `cond1 && cond2 && cond3`。

### 8.2 Hard Gate 函數未實作裁定

`assertApprovalPermission_` / `throwForbidden_` / `logSecurityAudit`
為**設計階段交付內容**，v2.3 FREEZE **未實作**，列為後續安全強化項目。
現行實作使用 `isFinalApprover()` + `FINAL_APPROVERS` 作為審核權限控管。

### 8.3 Client-side Guard 非安全邊界

Client-side 檢查（如 `canShowReviewToolbar`）**僅為 UX 輔助**，非安全權威來源。
Server-side `isInternalUser_()` + `isFinalApprover()` 為唯一安全邊界。

### 8.4 Line Number 說明

本文件中標示的行號為記錄當時版本，後續版本因新增功能可能有所偏移。
如需查詢實際位置，請直接搜尋函數名稱。

---

*本紀錄由 Claude Code 整理，2026-01-09*
*v2.3 FREEZE 裁定補充，2026-01-11*
*版本引用聲明補充，2026-01-12*
