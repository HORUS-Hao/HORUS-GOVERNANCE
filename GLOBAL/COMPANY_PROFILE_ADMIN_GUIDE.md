# Company_Profile 管理者操作指南

**文件版本**: v1.0
**適用版本**: S005 / V005 v2.3 FREEZE
**建立日期**: 2026-01-12
**文件性質**: 系統管理者操作手冊

---

## 一、文件目的

本文件說明 `Company_Profile` 工作表的欄位用途與設定方式。
系統管理者應在啟用公司報價功能前，確認所有必要欄位已正確設定。

---

## 二、工作表位置

| 項目 | 值 |
|------|-----|
| Spreadsheet | S005/V005 共用報價資料庫 |
| 工作表名稱 | `Company_Profile` |

---

## 三、欄位說明

### 3.1 識別欄位

| 欄位名稱 | 必填 | 說明 |
|----------|------|------|
| company_code | 是 | 公司代碼（唯一識別碼，例：HORUS、DAPANDA） |
| company_name | 是 | 公司全名（顯示於報價單） |

### 3.2 範本欄位

| 欄位名稱 | 必填 | 說明 |
|----------|------|------|
| template_code | 否 | 報價單範本代碼 |

### 3.3 印章欄位

| 欄位名稱 | 必填 | 說明 |
|----------|------|------|
| stamp_file_id | 是 | 印章圖片的 Google Drive File ID |
| seal_file_id | 否 | Legacy 欄位，不建議使用 |
| stamp_image_url | 否 | Legacy 欄位，不建議使用 |

### 3.4 聯絡資訊欄位

| 欄位名稱 | 必填 | 說明 |
|----------|------|------|
| contact_person | 否 | 聯絡人姓名 |
| contact_phone | 否 | 聯絡電話 |
| contact_email | 否 | 聯絡 Email |
| contact_address | 否 | 公司地址 |
| tax_id | 否 | 統一編號 |

### 3.5 郵件相關欄位

| 欄位名稱 | 必填 | 說明 |
|----------|------|------|
| mail_footer | 否 | 郵件頁尾文字 |
| **supervisor_emails** | **是** | **監管人 Email（影響 Mail Gate）** |

---

## 四、supervisor_emails 欄位詳細說明

### 4.1 欄位用途

`supervisor_emails` 欄位定義該公司的監管人 Email 清單。
當報價單建立或狀態變更時，系統會發送通知郵件給監管人。

### 4.2 是否必填

**是。此欄位影響 Mail Gate，未設定將導致郵件無法發送。**

### 4.3 格式要求

| 項目 | 說明 |
|------|------|
| 單一 Email | 直接填入，例：`admin@example.com` |
| 多個 Email | 以逗號分隔，例：`admin@example.com,manager@example.com` |
| 空白處理 | 系統會自動去除前後空白 |

### 4.4 未設定的後果

**若未設定 `supervisor_emails`，將導致以下結果：**

| 後果 | 說明 |
|------|------|
| 不會寄出審核通知 Mail | 外部使用者提交報價單後，無人收到通知 |
| 不會寄出核准結果 Mail | 報價單核准後，無人收到結果通知 |
| 不會寄出退回結果 Mail | 報價單退回後，無人收到結果通知 |
| 系統不會補寄 | 即使事後補設定，已錯過的郵件不會補發 |
| 系統不會提醒 | 系統不會主動告知管理者需要設定 |

**此為設計行為，非系統錯誤。**

### 4.5 設定範例

| company_code | supervisor_emails | 說明 |
|--------------|-------------------|------|
| HORUS | `hao.chang@horus.tw` | 單一監管人 |
| DAPANDA | `admin@dapanda.com.tw,manager@dapanda.com.tw` | 多個監管人 |

---

## 五、設定步驟

### 5.1 新增公司

1. 開啟 S005/V005 共用資料庫
2. 切換到 `Company_Profile` 工作表
3. 在最後一列新增資料
4. 填寫所有必填欄位
5. **務必填寫 `supervisor_emails`**

### 5.2 修改現有公司

1. 開啟 S005/V005 共用資料庫
2. 切換到 `Company_Profile` 工作表
3. 找到要修改的公司列
4. 直接修改欄位值
5. 修改立即生效，無需重新部署

### 5.3 停用公司

目前版本（v2.3 FREEZE）不支援停用公司功能。
若需停用，請聯繫系統開發者。

---

## 六、常見問題

### Q1：修改 Company_Profile 後需要重新部署嗎？

**不需要。** 修改工作表資料後立即生效。

### Q2：supervisor_emails 可以填外部 Email 嗎？

**可以。** 任何有效的 Email 地址都可以填入。

### Q3：我填了 supervisor_emails 但還是沒收到信？

請依序確認：
1. Email 地址拼寫是否正確
2. 是否有多餘空白或特殊字元
3. 郵件是否進入垃圾郵件匣
4. 提交流程是否完整執行

### Q4：可以留空 supervisor_emails 嗎？

**技術上可以，但強烈不建議。**

留空將導致：
- 所有通知郵件都不會發送
- 管理者無法得知報價單狀態變更
- 此為可預期結果，非系統故障

---

## 七、相關文件

| 文件 | 路徑 |
|------|------|
| Mail 發送前置條件 | `HORUS-GOVERNANCE/S005/OPERATIONS/S005_V005_MAIL_PREREQUISITES.md` |
| 常見問題判斷指南 | `HORUS-GOVERNANCE/S005/OPERATIONS/S005_V005_COMMON_ERRORS_GUIDE.md` |
| Data Contract Company | `HORUS-GOVERNANCE/GLOBAL/DATA-CONTRACT-COMPANY.md` |

---

**文件結束**

*本文件由 Claude Code 依據 v2.3 FREEZE 治理規範產出*
*建立日期：2026-01-12*
