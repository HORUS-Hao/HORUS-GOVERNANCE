# V005 Code.gs Modularization — Phase 2 Plan

- Module: V005
- File: CODEGS-MODULARIZATION-PHASE2-PLAN.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Draft**
- Related Governance:
  - CODEGS-MODULARIZATION-PHASE1-PLAN
  - CODEGS-MODULARIZATION-PHASE1-COMPLETION

---

## 一、Phase 2 目標

Phase 2 **僅處理「治理與邊界」**，非工程實作。

目標說明：
1. 釐清 V005 與 S005 之間的依賴邊界
2. 評估 Export Service 是否需要獨立模組化
3. 建立後續模組化作業的治理框架
4. **不進行任何程式碼變更**

---

## 二、Phase 2 可能處理範圍（列舉，不裁定）

### 2.1 Export Service

| 項目 | 說明 |
|------|------|
| 現況 | 目前無獨立 Export Service，PDF/Mail 已於 Phase 1 拆分 |
| 是否進場 | **待 Architect 裁定** |
| 潛在範圍 | 若啟動，可能包含 Excel 匯出、批次匯出等功能 |

### 2.2 與 S005 的依賴關係

| 依賴項目 | 說明 |
|----------|------|
| CONFIG.QUOTES_SPREADSHEET_ID | V005 讀取 S005 建立的報價單資料 |
| CONFIG.QUOTES_SHEET_NAME | 共用 S005_QUOTES 工作表 |
| CONFIG.USERS_ACCESS_SHEET | 共用 USERS_ACCESS 權限表 |
| getQuote() | 讀取 S005 建立的報價資料 |
| updateQuoteStatus() | 更新 S005 建立的報價單狀態 |

**處理方式**：僅描述依賴關係，不進行任何整合或重構。

---

## 三、不可動清單（Red Lines）

以下項目於 Phase 2 **絕對禁止變更**：

| 禁止項目 | 說明 |
|----------|------|
| S005 任何檔案 | 不動 S005 模組的任何程式碼 |
| Status Machine | 不動 STATUS_TRANSITIONS、isValidTransition、updateQuoteStatus、getQuoteStatus |
| Role & Permission | 不動 ROLES、getUserRole_、checkApproverPermission_、getUserApproverStatus |
| Approval Flow | 不動 approveQuotation、rejectQuotation、buildApprovalSnapshot_ |
| Existing Triggers | 不動任何既有 Trigger 設定 |
| Phase 1 已拆分模組 | 不動 mail.service.gs、pdf.service.gs |
| Code.gs Wrapper | 不動 Phase 1 建立的 wrapper 函數 |

---

## 四、進場條件（Entry Criteria）

Phase 2 啟動前必須滿足以下條件：

| 條件 | 狀態 | 說明 |
|------|------|------|
| Phase 1 封版完成 | ✅ 已滿足 | CODEGS-MODULARIZATION-PHASE1-COMPLETION.md 已建立 |
| 回滾策略明確 | ⏳ 待確認 | 見第五章 |
| 驗證方式清楚 | ⏳ 待確認 | 見第五章 |
| Architect 明示裁定 | ❌ 未啟動 | 需 Architect 明確核准 |

---

## 五、回滾與驗證策略

### 5.1 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| Web App 入口正常 | doGet 回傳正確 HTML |
| 報價單檢視正常 | getQuote 回傳完整資料 |
| PDF 匯出正常 | exportQuotePDF 回傳 Base64 |
| Mail 發送正常 | sendQuotationMail 成功發送 |
| 審批流程正常 | approveQuotation / rejectQuotation 狀態轉移正確 |
| 權限檢查正常 | getUserApproverStatus 回傳正確角色 |

### 5.2 回滾策略

若 Phase 2 實作後發生異常，回滾方式如下：

1. **Git 回滾**
   - 回到 Phase 1 封版 commit
   - 重新部署 Web App

2. **手動回滾**
   - 將 Code.gs 恢復至 Phase 1 封版狀態（1,506 行）
   - 保留 services/mail.service.gs 與 services/pdf.service.gs
   - 移除 Phase 2 新增的任何檔案

3. **驗證回滾成功**
   - 執行 5.1 所列驗證項目
   - 確認所有功能正常運作

---

## 六、生效與裁定方式

### 6.1 生效條件

本文件為 **Draft** 狀態，僅作為規劃參考。

Phase 2 **僅在以下條件滿足後才可啟動**：

1. Architect 明示裁定「Phase 2 啟動」
2. 進場條件（第四章）全部滿足
3. 回滾策略（第五章）經 Architect 確認

### 6.2 裁定流程

```
[Draft] → [Architect 審閱] → [Architect 裁定啟動] → [Phase 2 執行]
          ↓                    ↓
        [修訂]              [拒絕/延後]
```

### 6.3 聲明

本文件不授權任何程式碼變更。
Phase 2 實作需另行建立執行計畫（CODEGS-MODULARIZATION-PHASE2-EXECUTION.md）。

---

## 七、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（Draft） |

