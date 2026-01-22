# Runtime Behavior Matrix

> **Status**: Descriptive (Non-authoritative)
> **Version**: v1.0
> **Date**: 2026-01-06
> **Scope**: Runtime Behavior Documentation

---

## 1. Scope Declaration

### 1.1 本文件僅描述「現況」

本文件記錄 HORUS 系統中 **實際存在的 runtime 行為**，基於：
- 既有程式碼的觀察
- 既有 Trigger 的設定
- 既有 Mail 的發送行為

### 1.2 本文件不構成

| 不構成 | 說明 |
|--------|------|
| 規範 | 本文件不定義「應該如何」 |
| 指令 | 本文件不觸發任何工程動作 |
| 未來承諾 | 本文件不保證未來行為一致 |
| 權威來源 | 本文件不是 SSOT |

---

## 2. Observed Runtime Behaviors

### 2.1 P0 Producer 模組（Daily Observation）

| 模組 | 行為描述 | 觸發來源 | 是否寫入 FACT | Governance Classification |
|------|----------|----------|---------------|---------------------------|
| P0-MOMO | 每日觀測 MOMO 平台 SKU 上架狀態 | Trigger (07:00) | Yes (via D005) | Accepted |
| P0-PChome | 每日觀測 PChome 平台 SKU 上架狀態 | Trigger (07:30) | Yes (via D005) | Accepted |
| P0-Yahoo | 每日觀測 Yahoo 平台 SKU 上架狀態 | Trigger (08:00) | Yes (via D005) | Accepted |
| P0-Shopee | 每日觀測 Shopee 平台 SKU 上架狀態（Gusense + KATAI） | Trigger (08:30) | Yes (via D005) | Accepted |

### 2.2 P0 Entry Points（函數層級）

| 模組 | 函數名稱 | 行為描述 | 觸發來源 | 是否寫入 FACT | Governance Classification |
|------|----------|----------|----------|---------------|---------------------------|
| P0-MOMO | dailyRun() | 每日執行入口，呼叫 startDaily() | Trigger | Yes (via D005) | Accepted |
| P0-MOMO | startDaily() | 啟動 chunked execution | dailyRun() 呼叫 | Yes (via D005) | Accepted |
| P0-MOMO | runAutoChunked() | 分批處理 SKU，超時自動續跑 | startDaily() 呼叫 | Yes (via D005) | Accepted |
| P0-PChome | dailyRun() | 每日執行入口 | Trigger | Yes (via D005) | Accepted |
| P0-PChome | startDaily() | 啟動 chunked execution | dailyRun() 呼叫 | Yes (via D005) | Accepted |
| P0-PChome | runAutoChunked() | 分批處理 SKU | startDaily() 呼叫 | Yes (via D005) | Accepted |
| P0-Yahoo | dailyRun() | 每日執行入口 | Trigger | Yes (via D005) | Accepted |
| P0-Yahoo | startDaily() | 啟動 chunked execution | dailyRun() 呼叫 | Yes (via D005) | Accepted |
| P0-Yahoo | runAutoChunked() | 分批處理 SKU | startDaily() 呼叫 | Yes (via D005) | Accepted |
| P0-Shopee | dailyRun() | 每日執行入口（處理 Gusense + KATAI） | Trigger | Yes (via D005) | Accepted |
| P0-Shopee | startDaily() | 啟動 chunked execution | dailyRun() 呼叫 | Yes (via D005) | Accepted |
| P0-Shopee | runAutoChunked() | 分批處理 SKU | startDaily() 呼叫 | Yes (via D005) | Accepted |

### 2.3 Chunked Execution 續跑機制

| 模組 | 行為描述 | 觸發來源 | 是否寫入 FACT | Governance Classification |
|------|----------|----------|---------------|---------------------------|
| P0-* (all) | Trigger continuation：超過執行時間時自動建立續跑 Trigger | Implicit (runtime) | No (control flow only) | Accepted |
| P0-* (all) | Progress tracking：使用 ScriptProperties 記錄進度 | Implicit (runtime) | No (state management) | Accepted |
| P0-* (all) | Auto-cleanup：完成後自動清除續跑 Trigger | Implicit (runtime) | No (cleanup) | Accepted |

### 2.4 D005 FACT Writer

| 模組 | 行為描述 | 觸發來源 | 是否寫入 FACT | Governance Classification |
|------|----------|----------|---------------|---------------------------|
| D005 | 接收 P0 Observation，寫入 Listing_History | P0 呼叫 | Yes | Accepted (Authoritative) |
| D005 | 維護 SKU 層級上架歷史記錄 | P0 呼叫 | Yes | Accepted (Authoritative) |

### 2.5 Observer-Mail 模組（D-P0-QUALITY）

| 模組 | 行為描述 | 觸發來源 | 是否寫入 FACT | Governance Classification |
|------|----------|----------|---------------|---------------------------|
| Observer-Mail | 每日發送 Daily Health Mail | Trigger | No | Observation Only |
| Observer-Mail | 讀取 D005 Listing_History 產生報表 | Trigger | No | Observation Only |
| Observer-Mail | 計算各平台上架率並顯示於 Mail | Trigger | No | Observation Only |
| Observer-Mail | 對無 listing fact 平台顯示「未觀測」 | Trigger | No | Observation Only |

### 2.6 手動執行行為

| 模組 | 函數名稱 | 行為描述 | 觸發來源 | 是否寫入 FACT | Governance Classification |
|------|----------|----------|----------|---------------|---------------------------|
| P0-* (all) | manualRun() | 手動執行一次觀測（測試用） | Manual | Yes (via D005) | Accepted |
| P0-* (all) | diagnose() | 診斷系統狀態（Config / Folder / Progress / Trigger） | Manual | No | Non-Authoritative |
| Observer-Mail | sendDailyHealthMail() | 手動發送 Daily Health Mail | Manual | No | Observation Only |

---

## 3. Governance Classification 定義

### 3.1 Accepted

- **定義**：被治理層允許的行為
- **性質**：符合 Data Contract，可持續運行
- **範例**：P0 每日觀測、D005 FACT 寫入

### 3.2 Observation Only

- **定義**：僅作為觀測記錄，不具權威性
- **性質**：輸出不可被當作 SSOT 使用
- **範例**：Daily Health Mail

### 3.3 Non-Authoritative

- **定義**：明確標示為非權威的輸出
- **性質**：僅供參考，不可作為決策依據
- **範例**：Mail 內容、Log 記錄

---

## 4. Mail 行為語義說明

### 4.1 Mail 是否為權威輸出

**結論：否**

Mail 不是權威輸出，理由如下：

| 屬性 | Mail | 權威來源 (FACT) |
|------|------|-----------------|
| 可追溯性 | 低（發送後不可修改） | 高（有審計軌跡） |
| 一致性 | 不保證（依賴 snapshot） | 保證（D005 維護） |
| 可驗證性 | 無法驗證 | 可交叉驗證 |
| 時效性 | 發送當下 snapshot | 持續更新 |

### 4.2 Mail 的定位

| 定位 | 說明 |
|------|------|
| Notification | 通知性質，告知當日觀測結果 |
| Observation Artifact | 觀測產出物，非權威記錄 |

### 4.3 Mail 不是

- ❌ 不是 SSOT
- ❌ 不是決策依據
- ❌ 不是歷史記錄
- ❌ 不是 FACT

### 4.4 Mail 不構成任何治理承諾

| 不構成 | 說明 |
|--------|------|
| 資料正確性承諾 | Mail 內容可能與實際 FACT 有差異 |
| 送達承諾 | Mail 可能因技術原因未送達 |
| 格式穩定性承諾 | Mail 格式可能隨版本變更 |
| 頻率承諾 | Mail 發送頻率可能調整 |
| 內容完整性承諾 | Mail 僅呈現摘要，非完整資料 |

### 4.5 Mail 與 FACT 的關係

```
D005 (FACT Layer)
    ↓ (讀取)
Observer-Mail
    ↓ (產出)
Daily Health Mail (Observation Artifact)
```

**關鍵區別**：
- Mail 讀取 FACT，但 Mail 本身不是 FACT
- Mail 是 FACT 的「觀測產出物」，不是「權威副本」
- 收件者不可將 Mail 內容視為 SSOT

---

## 5. Explicit Non-Guarantees

### 5.1 本文件不保證的事項

| 不保證 | 說明 |
|--------|------|
| 行為一致性 | 未來 runtime 行為可能變更 |
| 完整性 | 可能遺漏未觀測到的行為 |
| 正確性 | 描述基於當下觀察，可能有誤差 |
| 時效性 | 本文件不會自動更新 |

### 5.2 Mail 不保證的事項

| 不保證 | 說明 |
|--------|------|
| 數據準確性 | Mail 內容可能與 FACT 有時間差 |
| 送達保證 | Mail 可能因技術原因未送達 |
| 完整性 | Mail 可能僅呈現部分資訊 |
| 即時性 | Mail 發送時間可能延遲 |
| 一致性 | 不同日期 Mail 格式可能不同 |

### 5.3 Runtime 行為不保證的事項

| 不保證 | 說明 |
|--------|------|
| 執行時間 | Trigger 執行時間可能有 ±15 分鐘誤差 |
| 完成時間 | Chunked execution 完成時間不可預測 |
| 續跑成功 | 續跑 Trigger 可能因系統限制失敗 |
| 資料順序 | 多平台觀測順序不保證一致 |

---

## 6. No-Action Clause

### 6.1 聲明

**本文件不觸發任何後續工程動作。**

具體而言：

| 不觸發 | 說明 |
|--------|------|
| 程式碼修改 | 本文件不要求修改任何 .gs / .js |
| Trigger 調整 | 本文件不要求調整任何排程 |
| Mail 修改 | 本文件不要求修改任何 Mail 內容或行為 |
| Schema 變更 | 本文件不要求修改任何 FACT schema |
| Data Contract 更新 | 本文件不要求修改任何契約 |

### 6.2 後續動作條件

任何基於本文件的工程動作，必須：
1. 由 Architect 明確裁定
2. 產生獨立的工程指令
3. 不可引用本文件作為執行依據

### 6.3 明確聲明

**本文件不觸發任何工程、排程、Mail、資料或治理變更。**

| 不觸發 | 具體說明 |
|--------|----------|
| 工程變更 | 不修改任何 .gs / .js / .html 檔案 |
| 排程變更 | 不調整任何 Trigger 時間或頻率 |
| Mail 變更 | 不修改 Mail 內容、格式、收件者 |
| 資料變更 | 不寫入、修改、刪除任何 FACT |
| 治理變更 | 不修改任何 Data Contract 或 Policy |

---

## 7. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release - Runtime behavior observation |

---

**END OF RUNTIME-BEHAVIOR-MATRIX.md**
