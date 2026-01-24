# C005 Phase D-1｜Decision Dependency & Responsibility Ruling

> 治理層級：Governance / Decision Boundary
> 狀態：Phase D-1 Complete / Frozen
> 日期：2026-01-24
> 備註：Architect Reviewed / No code change / Governance authority established

---

## 一、C005 系統定位

### 正式定義

**C005 是 Canonical Decision Engine（標準裁定引擎）**

C005 的唯一職責是：
- 接收上游事實
- 執行裁定邏輯
- 輸出標準化決策結果

### C005 不是什麼

| 誤解 | 澄清 |
|------|------|
| ❌ C005 是 Web App | C005 Listing-Checker/webapp 僅為「裁定結果展示介面」，不是 C005 本體 |
| ❌ C005 是爬蟲 | 爬蟲/觀測由 P0-* Producer 負責，C005 不執行任何資料採集 |
| ❌ C005 維護商品主檔 | 商品主檔 SSOT 為 T005，C005 僅讀取、不寫入 |
| ❌ C005 產生事實 | C005 消費事實、產出決策，事實由 D005 FACT 提供 |

### 核心原則

```
C005 = f(上游事實) → 標準化裁定結果
```

C005 不創造事實，只創造決策。

---

## 二、上游依賴（Input Dependencies）

### 2.1 事實來源矩陣

| 上游模組 | 資料等級 | 提供內容 | C005 使用方式 |
|----------|----------|----------|---------------|
| **D005 FACT** | FACT | 每日各平台 SKU 上架狀態 | 讀取 `is_listed` 作為裁定基礎 |
| **T005 商品主檔** | SSOT | 商品型號、狀態、資格欄位 | 讀取 Eligibility 白名單 |

### 2.2 資料等級定義

| 等級 | 定義 | 可信度 | 變更頻率 |
|------|------|--------|----------|
| **OBSERVATION** | 原始觀測值（未經驗證） | 低 | 即時 |
| **FACT** | 經驗證的觀測事實 | 中 | 每日 |
| **SSOT** | Single Source of Truth（唯一真相來源） | 最高 | 人工維護 |

### 2.3 上游資料流

```
T005 (SSOT) ──────────────────────┐
  商品型號、Eligibility 白名單      │
                                   ▼
                              ┌─────────┐
P0-YAHOO ─┐                   │         │
P0-SHOPEE ┼──▶ D005 FACT ────▶│  C005   │──▶ 裁定結果
P0-MOMO* ─┘    (is_listed)    │         │
                              └─────────┘
```

*P0-MOMO/PCHOME 尚未啟用，以 D005 既有資料為準

---

## 三、C005 內部裁定邏輯

### 3.1 裁定項目

C005 執行以下裁定，**這些是裁定邏輯，不是獨立模組**：

| 裁定項目 | 輸入 | 輸出 | 說明 |
|----------|------|------|------|
| **Eligibility 判定** | T005 `商品型號` | Boolean | SKU 是否納入上架率計算 |
| **上架狀態分類** | D005 `is_listed` | Listed / Not Listed | 標準化上架狀態 |
| **平台聚合** | D005 by platform_code | 各平台上架率 | MOMO / PCHOME / YAHOO / SHOPEE |
| **日期切面** | D005 `fact_date` | 當日快照 | 以 fact_date 為準，非 observed_at |

### 3.2 裁定規則（Hard Rules）

#### Eligibility 判定規則

```
IF sku_uid ∈ T005.商品型號 (正規化後)
THEN eligible = true
ELSE eligible = false
```

正規化函數：`normalizeSkuKey_(sku) = UPPERCASE + 移除空白/連字符/底線/句點`

#### 上架狀態判定規則

```
IF D005.is_listed IN (true, 'true', 'TRUE', 1)
THEN status = 'LISTED'
ELSE status = 'NOT_LISTED'
```

#### Shopee 觀測守衛（Observation Guard）

> ⚠️ **Temporary Guard Rule**
> 本規則為過渡性措施，移除條件見下方說明。

```
IF platform_code = 'SHOPEE'
THEN 強制視為 LISTED（觀測模式，不納入缺上架警報）
```

**移除條件（滿足任一即可移除）：**
1. P0-SHOPEE-Observation-Prod 完成驗證，產出資料品質達 D005 FACT 標準
2. Shopee 平台資料來源切換為官方 API（非爬蟲）
3. Architect 明確裁定 Shopee 觀測資料可信度已達標

### 3.3 聚合輸出

C005 裁定結果寫入 **C005 Derived Sheet**：

| 欄位 | 說明 |
|------|------|
| `fact_date` | 裁定日期 |
| `platform_code` | 平台代碼 |
| `listed_count` | 已上架 SKU 數 |
| `total_count` | 總 Eligible SKU 數 |
| `listing_rate` | 上架率 (listed/total) |

---

## 四、下游影響與責任裁定

### 4.1 下游模組清單

| 下游模組 | 依賴類型 | 接收內容 | 歸屬 |
|----------|----------|----------|------|
| **R020-Observer-Mail** | 執行者 | 讀取 C005 裁定結果，發送日報 | C005 Decision Boundary |
| **C005 WebApp UI** | 展示者 | 讀取 C005 Derived，呈現上架率 | C005 Decision Boundary |
| **B2-Listing-Consumer** | D005 消費者 | 讀取 D005 FACT，計算差異報告 | **不屬於 C005 Decision Boundary** |

> 📋 **Architect 裁定**
> B2-Listing-Consumer 為 D005 FACT Consumer，直接消費 D005 資料，不經過 C005 裁定層。B2 的責任邊界獨立於 C005，其輸出正確性由 B2 自行負責。

### 4.2 下游行為規範

#### 強制規範（MUST）

| 規範 | 說明 |
|------|------|
| ✅ 下游必須接受 C005 裁定結果 | 不得質疑、不得重算、不得覆寫 |
| ✅ 下游必須使用 C005 Derived Sheet | 禁止自行從 D005 重新聚合 |
| ✅ 下游發現異常必須回報 C005 | 由 C005 決定是否修正裁定邏輯 |

#### 禁止事項（MUST NOT）

| 禁止 | 說明 |
|------|------|
| ❌ 下游自行重算上架率 | 上架率唯一來源為 C005 |
| ❌ 下游反駁 Eligibility 判定 | Eligibility 由 C005 + T005 共同決定 |
| ❌ 下游修改 C005 Derived 資料 | C005 Derived 為 Read-Only（對下游） |

### 4.3 責任歸屬矩陣（Responsibility Matrix）

| 錯誤情境 | 最終責任 | 協同責任 | 說明 |
|----------|----------|----------|------|
| **Eligibility 判定錯誤** | **C005** | T005（若主檔有誤） | C005 負責裁定邏輯正確性 |
| **上架狀態判定錯誤** | **C005** | D005（若事實有誤） | C005 負責狀態轉換邏輯 |
| **上架率計算錯誤** | **C005** | — | C005 負責聚合邏輯 |
| **Mail 內容錯誤** | **C005** | — | C005 提供錯誤裁定結果 |
| **Mail 發送失敗/漏發** | **R020** | — | R020 負責執行正確性 |
| **Mail 發送對象錯誤** | **R020** | — | R020 負責收件人配置 |
| **UI 顯示錯誤** | **WebApp** | C005（若資料有誤） | UI 負責呈現正確性 |

### 4.4 責任裁定原則

> **嚴禁以「資料來源在別的模組」作為卸責理由**

具體而言：

1. **C005 不得說「D005 資料錯所以不是我的問題」**
   - C005 有責任驗證 D005 資料合理性
   - 若 D005 有系統性錯誤，C005 應觸發警報而非靜默輸出錯誤結果

2. **C005 不得說「T005 沒維護所以 Eligibility 錯」**
   - C005 應在 T005 資料不足時發出警告
   - Eligibility 邏輯本身的正確性由 C005 負責

3. **R020 不得說「C005 給我錯的所以 Mail 錯」**
   - R020 負責「執行」正確性（發送成功、格式正確、對象正確）
   - R020 不負責「內容」正確性（上架率數字、SKU 清單）

> 📋 **Phase D-2 延伸項目**
> 「C005 對 D005 資料合理性的主動檢測機制」實作延至 Phase D-2。
> 本文件先確立責任聲明，具體檢測邏輯（如：異常值警報、資料缺漏偵測）於後續階段實作。

---

## 五、Sheet 權限矩陣

| Sheet | 寫入權限 | 讀取權限 |
|-------|----------|----------|
| T005 商品主檔 | 人工維護 | C005, R020 |
| D005 FACT | P0-*, D005-Writer | C005, B2, R020 |
| C005 Derived | **C005 (C005_SyncJob)** | R020, WebApp |

> 📋 **備註**
> B2-Listing-Consumer 直接讀取 D005 FACT，不讀取 C005 Derived。

---

## 六、治理聲明

本文件為 C005 Decision Boundary 的正式治理規範。

任何對 C005 裁定邏輯的修改，必須：
1. 更新本文件
2. 經 Architect 審核
3. 通知所有下游模組負責人

任何下游模組若發現 C005 裁定結果異常，必須：
1. 立即回報（不得自行修正）
2. 等待 C005 裁定修正
3. 禁止繞過 C005 自行計算

---

*文件結束*
