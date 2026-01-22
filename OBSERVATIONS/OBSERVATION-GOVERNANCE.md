# Observation Governance

> **Status**: EFFECTIVE
> **Version**: v1.0
> **Effective Date**: 2026-01-06
> **Scope**: Runtime Behavior Documentation (Descriptive, Non-authoritative)

---

## 1. Observation 定義

### 1.1 什麼是一次 Observation

**Observation（觀測）** 是指：

- 在特定時間點，對特定平台進行的一次資料擷取行為
- 產生的是「當下快照」，不是「歷史累積」
- 每次 Observation 獨立存在，不與前次合併

### 1.2 Observation 的組成

| 元素 | 說明 |
|------|------|
| 時間戳記 | Observation 發生的確切時間 |
| 平台來源 | 哪個平台被觀測（MOMO / Yahoo / Shopee / PChome） |
| SKU 快照 | 該時間點觀測到的 SKU 上架狀態 |
| Producer | 執行觀測的模組（P0-*） |

### 1.3 Observation 不是什麼

- ❌ 不是權威狀態（Authoritative State）
- ❌ 不是歷史累積（Historical Aggregation）
- ❌ 不是決策依據（Decision Source）
- ❌ 不是 SSOT（Single Source of Truth）

---

## 2. Observation vs FACT 邊界

### 2.1 核心區別

| 屬性 | Observation | FACT |
|------|-------------|------|
| 性質 | 原始觀測快照 | 經治理寫入的權威記錄 |
| 產生者 | P0-* (Producer) | D005 (FACT Writer) |
| 可信度 | 低（未經驗證） | 高（經治理流程） |
| 可消費性 | 不可直接消費 | 可被 Consumer 使用 |
| 生命週期 | 短暫（單次快照） | 持久（歷史記錄） |

### 2.2 邊界規則

```
Observation ──(寫入)──> D005 ──(產出)──> FACT ──(消費)──> Consumer
     ↑                                              ↓
  P0-*                                         C005 / R020
```

**關鍵邊界**：
- Observation 必須經過 D005 才能成為 FACT
- Consumer 只能消費 FACT，不可直接消費 Observation

---

## 3. 為什麼 Observation 不等於權威狀態

### 3.1 Observation 的局限性

| 局限 | 說明 |
|------|------|
| 時效性 | Observation 只反映「觀測當下」，不反映「現況」 |
| 完整性 | 單次觀測可能遺漏 SKU |
| 一致性 | 不同時間的 Observation 可能相互矛盾 |
| 可驗證性 | Observation 本身無法被交叉驗證 |

### 3.2 為什麼需要 D005

D005 作為 FACT Writer 的價值：

1. **時間校正**：將 Observation 對齊到統一時間軸
2. **衝突處理**：當多個 Observation 矛盾時，D005 裁定
3. **完整性補全**：確保 FACT 層資料完整
4. **審計軌跡**：記錄每筆 FACT 的來源與時間

---

## 4. Observation 生命週期

### 4.1 完整生命週期

```
[產生] → [寫入] → [消費]
```

| 階段 | 負責模組 | 說明 |
|------|----------|------|
| 產生 | P0-* | 執行平台觀測，產生原始快照 |
| 寫入 | D005 | 接收 Observation，寫入 FACT 層 |
| 消費 | C005 / R020 | 讀取 FACT 層，進行比對或分析 |

### 4.2 各階段權責

#### 4.2.1 產生階段（P0-*）

- **負責**：執行觀測、產生快照
- **不負責**：驗證、裁決、寫入 FACT

#### 4.2.2 寫入階段（D005）

- **負責**：接收 Observation、寫入 FACT、維護審計軌跡
- **權威**：唯一 FACT Writer

#### 4.2.3 消費階段（C005 / R020）

- **負責**：讀取 FACT、進行比對或分析
- **不負責**：產生或修改 FACT

---

## 5. Observation × 模組對照表

### 5.1 Producer 清單

| Producer | 產生內容 | 寫入對象 | 是否權威 |
|----------|----------|----------|----------|
| P0-MOMO | SKU 上架觀測 | D005 | ❌ |
| P0-Yahoo | SKU 上架觀測 | D005 | ❌ |
| P0-Shopee | SKU 上架觀測 | D005 | ❌ |
| P0-PChome | SKU 上架觀測 | D005 | ❌ |

### 5.2 Writer（唯一）

| Writer | 寫入內容 | 寫入對象 | 是否權威 |
|--------|----------|----------|----------|
| D005 | Listing_History | FACT Layer | ✅ |

### 5.3 Consumer 清單

| Consumer | 消費內容 | 來源 | 是否權威 |
|----------|----------|------|----------|
| C005 | Listing 比對結果 | D005 FACT | ❌（唯讀） |
| R020 | 價格比對結果 | D005 FACT | ❌（唯讀） |

### 5.4 權威聲明

> **Observation 永遠不是 SSOT**
>
> - Observation 只是原始輸入
> - FACT（由 D005 寫入）才是權威
> - Consumer 只能消費 FACT，不可消費 Observation

---

## 6. 禁止事項（FORBID）

### 6.1 絕對禁止

| FORBID | 說明 |
|--------|------|
| ❌ Observation 不得直接被 Mail / Web 當作權威狀態 | Mail 應讀取 FACT，不是 Observation |
| ❌ 不得繞過 D005 直接被 Consumer 使用 | 所有消費必須經過 FACT 層 |
| ❌ 不得補跑歷史 Observation 當作現況 | 歷史觀測 ≠ 當前狀態 |

### 6.2 違規範例

| 違規行為 | 為什麼違規 |
|----------|------------|
| C005 直接讀取 P0 輸出 | 繞過 D005，破壞權威鏈 |
| Mail 顯示「Observation 時間」當作「上架狀態」 | 混淆快照與狀態 |
| 補跑 3 天前的 Observation 並宣稱「更新完成」 | 歷史快照不代表現況 |

### 6.3 AI / Agent 禁止

| FORBID | 說明 |
|--------|------|
| ❌ 不得推論 Observation 為 FACT | Observation ≠ FACT |
| ❌ 不得自行補跑 Observation | 需 Architect 裁定 |
| ❌ 不得建議 Consumer 直接讀取 Observation | 必須經過 FACT 層 |

---

## 7. Governance Guarantees

### 7.1 Observation Layer 保證

本文件保證：

| Guarantee | Description |
|-----------|-------------|
| Descriptive Only | 本文件僅描述既有行為，不創建新規則 |
| Non-authoritative | 本文件不是權威來源，僅供參考 |
| No Code Impact | 本文件不影響任何程式碼或排程 |

### 7.2 Authority

- 本文件為 Runtime 行為說明文件（Descriptive, Non-authoritative）
- 最終裁定權屬於 Architect
- 任何與 Data Contract 衝突處，以 Data Contract 為準

---

## 8. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release - Observation Governance documentation |

---

**END OF OBSERVATION-GOVERNANCE.md**
