# S005 External 使用者流程聲明

**文件版本**: v1.1
**適用版本**: S005 v2.3 FREEZE
**建立日期**: 2026-01-13
**更新日期**: 2026-01-13
**文件性質**: 治理聲明（Authoritative）

---

## 一、現行行為聲明

### 1.1 External 使用者建立報價單後的系統行為

| 項目 | v2.3 FREEZE 行為 |
|------|------------------|
| 報價單狀態 | **DRAFT**（草稿） |
| 自動送審 | **不會**自動送審（Auto-Submit 不穩定） |
| 審核通知 Mail | **保證寄送**（v2.3 FREEZE Hotfix） |

### 1.2 明確聲明

**External 使用者（非 @horus.tw / @dapanda.com.tw 網域）建立報價單後：**

1. 系統建立 DRAFT 狀態的報價單
2. 系統**不會**自動執行 `submitForApproval()`（Auto-Submit 不穩定）
3. 系統**保證**發送審核通知 Mail 給 `supervisor_emails`（External Mail Fallback）

**Mail 發送為產品必須行為，與 Auto-Submit 解耦。**

---

## 二、原因說明

### 2.1 技術原因

| 項目 | 說明 |
|------|------|
| Auto-Submit 依賴條件 | `hasValidOtpSession_(userEmail)` 必須回傳 `true` |
| OTP Session 儲存機制 | 依賴 Google Sheets + Script Execution Context |
| 已知問題 | OTP Session 狀態在跨 request 時可能不一致 |
| 結果 | Auto-Submit 行為為 **non-deterministic**（不穩定） |

### 2.2 治理原因

| 考量 | 說明 |
|------|------|
| 避免誤送 | 不穩定的 Auto-Submit 可能在不預期的情況下觸發 |
| 避免漏送 | 不穩定的 Auto-Submit 可能在應觸發時未觸發 |
| 權限邊界 | External 使用者的行為需明確可控 |
| 可交付性 | 不穩定功能不應包含在正式交付版本中 |

### 2.3 裁定結論

**v2.3 FREEZE 明確將 External Auto-Submit 定義為「未啟用功能」（Not Enabled Feature）。**

程式碼中的 Auto-Submit 區塊保留，但因 runtime 條件不穩定，實際不會觸發。

---

## 三、使用者影響與因應

### 3.1 對 External 使用者的影響

| 情境 | 影響 |
|------|------|
| 建立報價單 | 可正常建立，狀態為 DRAFT |
| 送審 | 需由 Internal 使用者手動執行，或等待後續版本支援 |
| 收到審核結果 | 依賴手動送審後的流程 |

### 3.2 對管理者的影響

| 情境 | 影響 |
|------|------|
| 審核通知 | 不會自動收到 External 使用者建立報價單的通知 |
| 監控方式 | 需主動檢查 S005_QUOTES 工作表中的 DRAFT 報價單 |

### 3.3 建議因應方式

1. 管理者定期檢查 S005_QUOTES 中狀態為 DRAFT 的報價單
2. External 使用者建立報價單後，透過其他管道通知管理者
3. 等待 v2.4+ 版本的 External Auto-Submit 功能正式啟用

---

## 四、未來版本註記

### 4.1 External Auto-Submit 功能規劃

| 項目 | 規劃 |
|------|------|
| 功能名稱 | External Auto-Submit |
| 預計版本 | v2.4+ |
| 啟用條件 | OTP Session 穩定機制重新設計完成 |
| 目標行為 | External + OTP Verified → 自動送審 + 自動發送審核 Mail |

### 4.2 啟用前必須完成的項目

1. **OTP Session 穩定性強化**
   - 解決跨 request 的 session 狀態不一致問題
   - 考慮使用 CacheService 或其他穩定儲存機制

2. **Auto-Submit 測試覆蓋**
   - 建立完整的 E2E 測試案例
   - 驗證 External + OTP 條件下的行為一致性

3. **治理文件更新**
   - 更新本文件為「已啟用」狀態
   - 更新 HANDOFF 文件

---

## 五、相關文件

| 文件 | 路徑 |
|------|------|
| v2.3 FREEZE 封版規格 | `HORUS-GOVERNANCE/RELEASES/S005_V005/v2.3_FREEZE/S005_V005_RELEASE_v2.3_FREEZE.md` |
| External Submit Gate 決策 | `HORUS-GOVERNANCE/DECISIONS/DECISION-S005-EXTERNAL-SUBMIT-GATE.md` |
| Mail 發送前置條件 | `HORUS-GOVERNANCE/S005/OPERATIONS/S005_V005_MAIL_PREREQUISITES.md` |

---

## 六、External Mail Guarantee (v2.3 FREEZE Hotfix)

### 6.1 Hotfix 說明

**問題**：Auto-Submit 依賴 `hasValidOtpSession_()`，該條件不穩定，導致 Mail 有時不會寄出。

**解決方案**：Mail 觸發與 Auto-Submit 解耦。

### 6.2 實作位置

| 項目 | 值 |
|------|-----|
| 檔案 | `Code.gs` |
| 函數 | `processSubmission()` |
| 區塊名稱 | `External Mail Fallback — v2.3 FREEZE SAFETY NET` |
| 行號 | 約 405-434 行 |

### 6.3 行為定義

**External 使用者建立報價單後：**

| 項目 | 行為 |
|------|------|
| 報價單狀態 | DRAFT（不變） |
| Auto-Submit | 不保證觸發（依賴 OTP Session） |
| Mail 發送 | **保證發送**（不依賴 OTP Session） |

### 6.4 觸發條件

```javascript
if (
  userEmail &&
  !isInternalUser_(userEmail) &&
  refId
) {
  sendApprovalRequestMail_(refId, mailPayload, userEmail);
}
```

**條件說明**：
- `userEmail` 存在
- 非 Internal 使用者（@horus.tw / @dapanda.com.tw）
- `refId` 已產生（報價單建立成功）

**不依賴**：`hasValidOtpSession_()`

### 6.5 驗證 Log

成功時會出現：
```
[External Mail Fallback] Sending approval mail for refId: HRS-xxxxxxxx-xxxx
```

---

## 七、聲明

> **本文件為 S005 v2.3 FREEZE External 使用者流程的權威聲明。**
>
> External Auto-Submit 在 v2.3 FREEZE 中為「非保證行為」。
> External Mail 發送為「保證行為」（v2.3 FREEZE Hotfix）。
> 報價單狀態維持 DRAFT，Mail 為通知用途。

---

*本文件由 Claude Code 依據 Architect 裁定產出*
*建立日期：2026-01-13*
*更新日期：2026-01-13（新增 External Mail Guarantee Hotfix）*
