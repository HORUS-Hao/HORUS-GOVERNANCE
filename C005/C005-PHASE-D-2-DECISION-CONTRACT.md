# C005 Phase D-2｜Decision Contract & SLA

> 治理層級：Decision Contract / SLA
> 狀態：Draft v0.1
> 日期：2026-01-24
> 前置：C005-PHASE-D-1-DECISION-DEPENDENCY.md (Frozen)

---

## 一、fact_date 裁定不可變性（Immutability Policy）

### 1.1 核心原則

```
一旦 C005 對某 fact_date 完成裁定並寫入 C005 Derived，該裁定結果視為不可變。
```

### 1.2 允許重算條件

| 條件 | 允許 | 說明 |
|------|------|------|
| 當日重算（fact_date = TODAY） | ✅ 允許 | D005 資料可能持續補入 |
| 偵測到 D005 回填（backfill） | ✅ 允許 | 須記錄回填事件 |
| Architect 明確指示 | ✅ 允許 | 須留下裁定紀錄 |
| 下游模組要求 | ❌ 禁止 | 下游不得觸發重算 |
| 自動排程觸發歷史重算 | ❌ 禁止 | 避免數據飄移 |

### 1.3 重算紀錄要求

若執行重算，須在 log 中記錄：
- 重算觸發原因
- 原始值 vs 新值
- 觸發者身份（系統/人工/Architect）

---

## 二、C005 Derived 輸出契約

### 2.1 欄位契約（不得隨意改名/改語意）

| 欄位名稱 | 資料型態 | 語意定義 | 可否變更 |
|----------|----------|----------|----------|
| `fact_date` | Date | 裁定日期（YYYY-MM-DD） | ❌ 凍結 |
| `platform_code` | String | 平台代碼（MOMO/PCHOME/YAHOO/SHOPEE） | ❌ 凍結 |
| `listed_count` | Integer | 已上架 SKU 數 | ❌ 凍結 |
| `total_count` | Integer | 總 Eligible SKU 數 | ❌ 凍結 |
| `listing_rate` | Float | 上架率 (listed/total) | ❌ 凍結 |
| `data_status` | String | 資料狀態（COMPLETE/NO_FACT/PARTIAL） | ✅ 新增（v0.2） |
| `anomaly_flags` | String | 異常標記（JSON array） | ✅ 新增（v0.2） |

### 2.2 欄位變更規則

- **凍結欄位**：不得改名、不得改語意、不得刪除
- **新增欄位**：須經 Architect 核准，須向下相容
- **廢棄欄位**：須保留至少 30 天，標註 deprecated

---

## 三、缺資料政策（NO_FACT / PARTIAL_FACT）

### 3.1 資料狀態定義

| 狀態 | 定義 | 處理方式 |
|------|------|----------|
| `COMPLETE` | 平台當日有完整 FACT 資料 | 正常計算上架率 |
| `NO_FACT` | 平台當日無任何 FACT 資料 | 列入揭露，不計算上架率，不視為下架 |
| `PARTIAL_FACT` | 平台當日 FACT 資料不完整（<80% 預期量） | 列入揭露，標註警告 |

### 3.2 NO_FACT 處理規則

```
IF platform has NO_FACT for fact_date:
  - listed_count = NULL (不是 0)
  - total_count = NULL (不是 0)
  - listing_rate = NULL (不是 0% 或 -100%)
  - data_status = 'NO_FACT'
  - Mail 顯示: "今日無 FACT（平台未產出或未寫入），非下架"
```

### 3.3 重要聲明

> **NO_FACT ≠ 下架**
>
> 平台無資料可能原因：P0 Producer 未執行、平台檔案未更新、系統異常。
> 這些情況不應被解讀為「商品全部下架」。

---

## 四、告警級別定義

### 4.1 級別說明

| 級別 | 代碼 | 行為 | 說明 |
|------|------|------|------|
| **INFO** | `INFO` | 記錄 + 揭露 | 資訊性提示，無需處理 |
| **WARN** | `WARN` | 記錄 + 揭露 + 標註 | 需關注但不阻斷 |
| **BLOCK** | `BLOCK` | 阻斷流程 | Phase D-2 不實作，保留定義 |

### 4.2 Phase D-2 實作範圍

- ✅ INFO：正常運行資訊
- ✅ WARN：異常偵測但不阻斷
- ❌ BLOCK：暫不實作（避免誤阻斷 Mail）

### 4.3 告警項目

| 項目 | 級別 | 觸發條件 |
|------|------|----------|
| 平台缺 FACT | WARN | 某平台 fact_date 無資料 |
| 母數異常變動 | WARN | total_count 與前日差異 >±30% |
| 數值邏輯錯誤 | WARN | listed_count > total_count 或負數 |
| Shopee 觀測模式 | INFO | Shopee 使用 Observation Guard |
| Eligibility 未啟用 | INFO | USE_ELIGIBILITY_FILTER = false |

---

## 五、Mail 與 Web 一致性承諾

### 5.1 同源原則

```
Mail 與 Web UI 必須讀取同一份 C005 Derived 資料，禁止各自重算。
```

### 5.2 一致性保證

| 項目 | 保證 |
|------|------|
| 數據來源 | 兩者皆從 C005 Derived Sheet 讀取 |
| 計算邏輯 | C005 Derived 已完成計算，下游僅展示 |
| 時間點 | 以 fact_date 為準，非讀取時間 |
| 格式差異 | 允許展示格式不同，數值必須一致 |

### 5.3 禁止行為

- ❌ Mail 自行從 D005 重新聚合
- ❌ Web UI 自行計算上架率
- ❌ 兩端使用不同的 Eligibility 邏輯

---

## 六、Eligibility 啟用門檻

### 6.1 啟用前提條件

Eligibility Filter 啟用須滿足以下**全部條件**：

| 條件 | 門檻 | 驗證方式 |
|------|------|----------|
| T005↔D005 key match rate | ≥ 99% | generateEligibilityMatchingReport_() |
| Mismatch samples 可解釋 | 100% | 人工審核 mismatch 清單 |
| Architect 核准 | 必須 | 書面/口頭指示 |
| Dry-run 無異常 | 必須 | runDailySnapshot_DRYRUN() |

### 6.2 啟用流程

1. 執行 Eligibility Matching Report
2. 確認 match_rate ≥ 99%
3. 人工審核 mismatch samples
4. 取得 Architect 核准
5. 設定 USE_ELIGIBILITY_FILTER = true
6. 監控首次 LIVE 執行結果

---

## 七、變更紀錄

| 版本 | 日期 | 變更內容 |
|------|------|----------|
| v0.1 | 2026-01-24 | 初版建立（Draft） |

---

*文件結束*
