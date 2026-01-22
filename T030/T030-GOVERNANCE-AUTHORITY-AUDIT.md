# T030 Authority Governance Alignment Audit

- Module: T030 (Margin Simulation Center / 商品毛利試算中心)
- File: T030-GOVERNANCE-AUTHORITY-AUDIT.md
- Version: v1.0.0
- Audit Date: 2026-01-08
- Status: **Read-Only Inventory**
- Audit Scope: Authority (Company / User / Role / Stamp)
- Reference: GLOBAL Data Contract

---

## 一、Audit Scope Statement

本次盤點**僅限** Authority 相關概念：
- Company
- User
- Role
- Stamp

**明確排除**：
- ❌ 計算邏輯（Profit Engine）
- ❌ 費率公式
- ❌ 欄位映射
- ❌ 任何 migration 建議

---

## 二、模組基本資訊

| 項目 | 內容 |
|------|------|
| 模組 ID | T030 |
| 模組名稱 | 商品毛利試算中心 (Margin Simulation Center) |
| 版本 | v3.9.14 |
| 模組定位 | **純計算工具** — 商品毛利試算與提案匯出 |
| 程式碼位置 | ✅ 在本次工程倉內 |

---

## 三、Authority 適用性裁定

### 3.1 Company 概念

| 檢查項目 | 現況 |
|----------|------|
| 是否有 company_id 欄位 | ❌ 無 |
| 是否有 Company_Profile 結構 | ❌ 無 |
| 資料來源設定 | 固定 Spreadsheet ID（單一來源） |

**裁定**：⚪ **尚未出現 / 不適用**

T030 為純計算工具，使用固定資料來源（T030_Data 或 T005 商品主表），隱含單一公司假設。無多公司隔離需求。

---

### 3.2 User 概念

| 檢查項目 | 現況 |
|----------|------|
| 是否有 user_id 欄位 | ❌ 無 |
| 是否有登入/Session 機制 | ❌ 無 |
| 是否有操作者追蹤 | ❌ 無 |
| PM 欄位 | ✅ 存在（字串型態，非 User Entity） |

**PM 欄位分析**：

```javascript
// T030_Config.js
BASE_FIELDS: {
  PM: 'PM',  // index 1
  // ...
}
```

| 項目 | 說明 |
|------|------|
| 欄位用途 | 標示商品負責人（識別用） |
| 資料型態 | 純字串 |
| 是否關聯 User Entity | ❌ 否 |
| 是否用於權限控制 | ❌ 否 |

**裁定**：⚪ **尚未出現 / 不適用**

T030 的 PM 欄位僅為商品屬性標註，非 Authority 層級的 User 概念。無登入、無 Session、無操作追蹤。

---

### 3.3 Role 概念

| 檢查項目 | 現況 |
|----------|------|
| 是否有 ROLES 定義 | ❌ 無 |
| 是否有 checkPermission | ❌ 無 |
| 是否有操作權限分級 | ❌ 無 |

**裁定**：❌ **不適用**

T030 為開放式計算工具，所有使用者可執行所有操作（試算、匯出）。無角色權限需求。

---

### 3.4 Stamp 概念

| 檢查項目 | 現況 |
|----------|------|
| 是否有 stamp_id 欄位 | ❌ 無 |
| 是否涉及文件簽章 | ❌ 無 |
| 是否有審批流程 | ❌ 無 |

**裁定**：❌ **不適用**

毛利試算為內部計算工具，不涉及對外文件、無需印章蓋章。

---

## 四、風險標註

### 4.1 已識別風險

| 風險項目 | 等級 | 說明 |
|----------|------|------|
| 隱含單一公司 | ⚠️ 低 | 固定資料來源，無多公司需求 |
| 無操作追蹤 | ⚠️ 低 | 純計算工具，低稽核需求 |

### 4.2 風險評估

T030 作為**內部計算工具**，其風險等級整體偏低：

- 不產生對外文件（提案匯出為內部參考）
- 不涉及交易或審批
- 不需身份認證或授權

---

## 五、適用性總結

| Authority 概念 | 適用性 | 裁定理由 |
|----------------|--------|----------|
| Company | ⚪ 不適用 | 純計算工具，無多公司隔離需求 |
| User | ⚪ 不適用 | PM 僅為商品屬性，非 Authority User |
| Role | ❌ 不適用 | 無權限分級需求 |
| Stamp | ❌ 不適用 | 無文件簽章需求 |

---

## 六、最終裁定

> **T030 為純計算工具模組，GLOBAL Data Contract 之 Authority 概念（Company / User / Role / Stamp）對其不適用。本模組無需進行 Authority 層級的治理對齊。**

---

## 七、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（Authority 適用性審計） |

