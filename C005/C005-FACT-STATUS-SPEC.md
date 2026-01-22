# C005 FACT Status Specification

> **Title**: C005 FACT Status Specification
> **Scope**: C005 Daily Platform FACT
> **Authority**: HORUS-GOVERNANCE
> **Applies To**: FactWriter / Mail / Trigger
> **Version**: v2026-01-22.1
> **Status**: GOVERNANCE / ACTIVE
> **Created**: 2026-01-22

---

## 1. 概述

本文件定義 C005 Listing History FACT 的四種狀態碼語意。

所有 FactWriter、Mail、Trigger 的行為 **必須** 依據本文件執行，不可自行擴充或修改狀態語意。

---

## 2. Status 定義

### 2.1 OK

| 項目 | 內容 |
|------|------|
| **A. 定義 (Definition)** | 資料正常，掃描成功且有有效數據 |
| **B. 何時產生 (When to Use)** | 掃描成功 AND total > 0 AND 資料通過完整性驗證 |
| **C. FactWriter 行為 (Write Rule)** | 寫入完整 FACT 記錄，所有數值欄位必須有值 |
| **D. Mail 顯示規則 (Mail Policy)** | 正常顯示所有數值，進行差異比對，無警告 |
| **E. 是否可作為決策依據 (Decision Usability)** | **YES** — 可完全信賴並作為營運決策依據 |

---

### 2.2 NO_DATA

| 項目 | 內容 |
|------|------|
| **A. 定義 (Definition)** | 掃描成功但無資料（平台無商品或無上架記錄） |
| **B. 何時產生 (When to Use)** | 掃描成功 AND total = 0 AND 無錯誤發生 |
| **C. FactWriter 行為 (Write Rule)** | 寫入 FACT 記錄，數值欄位為 0，STATUS = NO_DATA |
| **D. Mail 顯示規則 (Mail Policy)** | 顯示「無資料」標記，不進行差異比對，顯示黃色警告 |
| **E. 是否可作為決策依據 (Decision Usability)** | **LIMITED** — 可確認「確實無資料」，但不建議用於數值決策 |

#### 2.2.1 NO_DATA vs ERROR 區分

- NO_DATA：掃描 **成功**，但結果為空
- ERROR：掃描 **失敗**，無法取得結果

---

### 2.3 ERROR

| 項目 | 內容 |
|------|------|
| **A. 定義 (Definition)** | 掃描失敗，無法取得有效資料 |
| **B. 何時產生 (When to Use)** | 網路錯誤 OR 解析失敗 OR 權限不足 OR 平台異常 OR 超時 |
| **C. FactWriter 行為 (Write Rule)** | 寫入 FACT 記錄，數值欄位為 null 或 -1，STATUS = ERROR，SOURCE 欄位記錄錯誤類型 |
| **D. Mail 顯示規則 (Mail Policy)** | 顯示紅色錯誤標記，不顯示數值，不進行差異比對，明確警告 |
| **E. 是否可作為決策依據 (Decision Usability)** | **NO** — 禁止作為決策依據，必須等待修復後重新掃描 |

#### 2.3.1 ERROR 細分類型（記錄於 SOURCE 欄位）

| 錯誤類型 | 說明 |
|----------|------|
| `error:network` | 網路連線失敗 |
| `error:parse` | 資料解析失敗 |
| `error:auth` | 權限驗證失敗 |
| `error:timeout` | 請求超時 |
| `error:platform` | 平台端異常 |
| `error:unknown` | 未知錯誤 |

---

### 2.4 DELAY

| 項目 | 內容 |
|------|------|
| **A. 定義 (Definition)** | 資料未在預期時間內更新（使用舊資料） |
| **B. 何時產生 (When to Use)** | 當日掃描未完成 AND 存在前一日有效 FACT AND 超過預定掃描時間 |
| **C. FactWriter 行為 (Write Rule)** | 寫入 FACT 記錄，複製前一日數值，STATUS = DELAY，SNAPSHOT_ID 標記為延遲批次 |
| **D. Mail 顯示規則 (Mail Policy)** | 顯示橙色警告，標註「資料為前日」，可顯示數值但加註過期標記 |
| **E. 是否可作為決策依據 (Decision Usability)** | **CAUTION** — 可參考但必須註明為過期資料，不建議用於即時決策 |

#### 2.4.1 DELAY vs ERROR 區分

- DELAY：有舊資料可用，只是尚未更新
- ERROR：完全無法取得資料

---

## 3. Status → Mail 行為對照表

| Status | Mail 是否顯示數值 | 是否進差異比對 | 是否顯示警告 | 是否建議決策 |
|--------|------------------|----------------|--------------|--------------|
| `OK` | YES | YES | NO | YES |
| `NO_DATA` | NO (顯示「無資料」) | NO | YES (黃色) | LIMITED |
| `ERROR` | NO (顯示「錯誤」) | NO | YES (紅色) | NO |
| `DELAY` | YES (加註過期) | YES (與前日比) | YES (橙色) | CAUTION |

### 3.1 警告顏色定義

| 顏色 | 含義 | 對應 Status |
|------|------|-------------|
| 綠色 / 無色 | 正常 | OK |
| 黃色 | 注意 | NO_DATA |
| 橙色 | 警告 | DELAY |
| 紅色 | 錯誤 | ERROR |

### 3.2 Mail 顯示文字規範

| Status | 顯示文字 |
|--------|----------|
| `OK` | （正常顯示數值） |
| `NO_DATA` | 「無資料」或「N/A」 |
| `ERROR` | 「錯誤：{錯誤類型}」 |
| `DELAY` | 「{數值} (過期)」 |

---

## 4. Status → Trigger 行為說明

### 4.1 哪些狀態可以寄 Mail

| Status | 可否寄 Mail | 說明 |
|--------|-------------|------|
| `OK` | YES | 正常寄送，包含完整報表 |
| `NO_DATA` | YES | 寄送，但報表中該平台標記為無資料 |
| `ERROR` | YES | 寄送，但報表中該平台標記為錯誤 |
| `DELAY` | YES | 寄送，但報表中該平台標記為過期資料 |

**原則**：只要有 FACT 記錄（無論狀態），Mail 就會寄出。Mail 的價值在於「告知狀態」，而非「只報喜不報憂」。

### 4.2 哪些狀態必須警告

| Status | 警告層級 | 警告內容 |
|--------|----------|----------|
| `OK` | 無 | — |
| `NO_DATA` | WARN | 「{平台} 今日無資料，不建議作為決策依據」 |
| `ERROR` | ALERT | 「{平台} 掃描失敗，請檢查系統狀態」 |
| `DELAY` | WARN | 「{平台} 資料為前日，請注意時效性」 |

### 4.3 未來可能延遲寄送的情境（裁定，不實作）

以下情境 **未來** 可能觸發 Mail 延遲寄送：

| 情境 | 裁定 | 說明 |
|------|------|------|
| 全平台 ERROR | 延遲 | 若所有平台皆為 ERROR，延遲 1 小時後重試 |
| 關鍵平台 ERROR | 延遲 | 若 MOMO 或 PChome 為 ERROR，延遲 30 分鐘後重試 |
| 超過 50% 平台異常 | 延遲 | 若超過半數平台為 ERROR 或 DELAY，延遲並通知管理員 |

**MVP 階段**：上述情境暫不實作，僅記錄裁定。Mail 依照每日固定時間寄出。

---

## 5. Status 優先順序

當單一平台同日有多筆記錄時，以最新一筆為準。

若需合併判斷，優先順序為：

```
OK > DELAY > NO_DATA > ERROR
```

意即：只要有一筆 OK，該平台當日狀態視為 OK。

---

## 6. 相關文件

| 文件 | 路徑 | 關係 |
|------|------|------|
| FACT Schema | `HORUS-FACTS/C005/C005_LISTING_HISTORY_SCHEMA.md` | STATUS 欄位定義 |
| DERIVED 說明 | `HORUS-DERIVED/C005/scan/README.md` | 資料流向上游 |

---

## 7. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-22 | v2026-01-22.1 | 初始建立，定義四種 Status 及 Mail/Trigger 行為 |

---

**本文件為 HORUS-GOVERNANCE 治理規格，FactWriter / Mail / Trigger 行為必須依據本文件執行。**
