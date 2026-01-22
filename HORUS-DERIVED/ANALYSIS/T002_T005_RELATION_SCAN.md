# T002 / T005 關係掃描分析

**文件類型**: Derived Analysis (衍生分析)
**掃描日期**: 2026-01-13
**掃描性質**: 只讀 (Read-Only)
**掃描人**: Claude Code (governance/feasibility-scan 分支)

---

## 一、掃描目的

本掃描回答以下四個問題：

1. T005 是否實際依賴 T002 的 Canonical Key
2. 是否存在「隱性假設 T002 可被多人編輯」
3. T005 轉入後是否有鎖定 / read-only 行為
4. 若 T002 僅開放 remark / note，T005 是否受影響

---

## 二、事實盤點

### 2.1 T002 → T005 資料流結構

| 項目 | 來源 | 事實 |
|------|------|------|
| T002 主鍵 | T002_COLLABORATION_FEASIBILITY_STUDY.md:25 | `T002_ID`（格式：T002_YYYYMMDD_NNN） |
| T005 關聯欄位 | T002_COLLABORATION_FEASIBILITY_STUDY.md:27 | `T005_UID` 存於 T002 表內 |
| 轉入狀態欄位 | T002_COLLABORATION_FEASIBILITY_STUDY.md:28 | `T005轉入狀態`（Enum: 轉入完成 / 轉入中 / 未轉入） |
| 關聯函數 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:184 | `createRelation_()` 建立 T002 → T005 關聯 |

### 2.2 T002 與 T005 定位關係

| 項目 | 來源 | 事實 |
|------|------|------|
| T002 定位 | STATE-ANCHOR-2025-12.md:62-63 | T002 = **非獨立模組**，為 T005 的影子層 / 清洗層 |
| T005 定位 | STATE-ANCHOR-2025-12.md:63 | T005 = **Canonical（事實主表）** |
| 表頭設計 | STATE-ANCHOR-2025-12.md:67 | T002 表頭維持 **IMPORTRANGE 對齊 T005**，此為刻意治理設計 |

### 2.3 T002 欄位責任分類

| 欄位 | 責任分類 | 可編輯者 | 來源 |
|------|----------|----------|------|
| T002_ID | System-Owned | 無 | T002_COLLABORATION_FEASIBILITY_STUDY.md:62 |
| T005_UID | Sync-Derived | 無 | T002_COLLABORATION_FEASIBILITY_STUDY.md:64 |
| T005轉入狀態 | System-Owned | 系統 | T002_COLLABORATION_FEASIBILITY_STUDY.md:65 |
| 標準化名稱 | AI-Generated | AI / 人工覆寫 | T002_COLLABORATION_FEASIBILITY_STUDY.md:77 |
| 標準化品牌 | AI-Generated | AI / 人工覆寫 | T002_COLLABORATION_FEASIBILITY_STUDY.md:78 |
| 標準化型號 | AI-Generated | AI / 人工覆寫 | T002_COLLABORATION_FEASIBILITY_STUDY.md:79 |
| 備註 | Human-Input | 多人 | T002_COLLABORATION_FEASIBILITY_STUDY.md:70 |
| 人工確認人 | Human-Input | 操作者 | T002_COLLABORATION_FEASIBILITY_STUDY.md:66 |

### 2.4 ADR 禁止事項

| 禁止事項 | 來源 |
|----------|------|
| T002 處於 HOLD 狀態 | ADR-0001-T005-T002-B.md (全文) |
| 禁止 Migration work | STATE-ANCHOR-2025-12.md:47 |
| 禁止 Refactoring | STATE-ANCHOR-2025-12.md:48 |
| 禁止新增 schema 抽象層 | STATE-ANCHOR-2025-12.md:93 |
| 禁止「為了以後更好」的設計 | STATE-ANCHOR-2025-12.md:94 |

---

## 三、問題回答

### 問題 1：T005 是否實際依賴 T002 的 Canonical Key

| 項目 | 事實 |
|------|------|
| 依賴關係 | **否**，方向相反 |
| 實際關係 | T002 依賴 T005 的 UID（`T005_UID` 欄位存於 T002） |
| 證據來源 | T002_COLLABORATION_FEASIBILITY_STUDY.md:27, 64 |
| 關係定義 | T005 = Canonical Schema，T002 = 衍生層 |

**結論**：T005 不依賴 T002 的 Canonical Key。相反地，T002 持有 `T005_UID` 作為關聯欄位，表示 T002 記錄「來自哪個 T005 商品」或「將轉入哪個 T005 商品」。

---

### 問題 2：是否存在「隱性假設 T002 可被多人編輯」

| 項目 | 事實 |
|------|------|
| 隱性假設存在 | **是** |
| 證據 1 | T002_COLLABORATION_FEASIBILITY_STUDY.md 整份文件設計多人協作機制 |
| 證據 2 | 備註欄位標記為「多人」可編輯（T002_COLLABORATION_FEASIBILITY_STUDY.md:70） |
| 證據 3 | 提出 T002_CHANGE_LOG 設計以追蹤多人編輯（T002_COLLABORATION_FEASIBILITY_STUDY.md:92-124） |
| 證據 4 | Phase 1 試行建議允許 1-2 位內部測試者（T002_COLLABORATION_FEASIBILITY_STUDY.md:175） |
| 矛盾點 | 但 ADR-0001 將 T002 標記為 HOLD，禁止任何實作 |

**結論**：治理文件中存在對「T002 多人編輯」的設計假設，但該假設目前因 ADR-0001 HOLD 狀態而被凍結，未付諸實作。

---

### 問題 3：T005 轉入後是否有鎖定 / read-only 行為

| 項目 | 事實 |
|------|------|
| 設計意圖 | **是，有提出** |
| 證據來源 | T002_COLLABORATION_FEASIBILITY_STUDY.md:213-215 |
| 設計內容 | 「Phase 1 僅允許『尚未轉入 T005』的記錄進行人工編輯」 |
| 建議行動 | 「在 Sheet Add-on 中加入『已轉入 T005』的編輯鎖定」 |
| 實作狀態 | **尚未實作**（僅為可行性設計文件） |

**結論**：設計文件建議「已轉入 T005」的 T002 記錄應被鎖定，但此機制尚未實作。目前 T002 處於 HOLD 狀態，無任何自動鎖定行為存在。

---

### 問題 4：若 T002 僅開放 remark / note，T005 是否受影響

| 項目 | 事實 |
|------|------|
| T002 備註欄位 | 存在，為 Human-Input 類型 |
| T005 與備註關係 | **無直接關係** |
| 證據分析 | 備註（remark）不在 T002 → T005 的同步欄位內 |
| 同步欄位列表 | 標準化名稱、標準化品牌、標準化型號（AI-Generated 類型） |
| 表頭同步機制 | T002 表頭透過 IMPORTRANGE 對齊 T005（STATE-ANCHOR-2025-12.md:67） |

**結論**：若 T002 僅開放備註 / note 欄位供編輯，T005 不會受影響。備註欄位為 T002 本地欄位，不參與 T002 → T005 資料轉入流程。

---

## 四、補充發現

### 4.1 T002 協作風險分類

| 風險等級 | 欄位數 | 欄位 | 來源 |
|----------|--------|------|------|
| 高風險 | 1 | 備註 | T002_COLLABORATION_FEASIBILITY_STUDY.md:86 |
| 中風險 | 5 | 人工確認人、標準化名稱、標準化品牌、標準化型號、確認日期 | T002_COLLABORATION_FEASIBILITY_STUDY.md:87 |
| 低風險 | 13 | 其餘欄位（System/Sync 自動管理） | T002_COLLABORATION_FEASIBILITY_STUDY.md:88 |

### 4.2 T005 寫入權限

| 項目 | 事實 | 來源 |
|------|------|------|
| 唯一寫入者 | D005 (FACT 資料中樞) | T005.md:49 |
| 禁止直接修改 | 其他模組不得直接操作 T005 | T005.md:50 |
| Schema 狀態 | FROZEN（凍結） | T005.md:29 |

### 4.3 目前治理階段

| 項目 | 狀態 | 來源 |
|------|------|------|
| ADR-0001 階段 | B (Governance Only) | ADR-0001-T005-T002-B.md:4 |
| T002 狀態 | HOLD | STATE-ANCHOR-2025-12.md:42 |
| T005 schema | FROZEN | T005.md:29, STATE-ANCHOR-2025-12.md:16 |

---

## 五、文件來源索引

| 代碼 | 完整路徑 |
|------|----------|
| T002_COLLABORATION_FEASIBILITY_STUDY.md | `HORUS-GOVERNANCE/T002/T002_COLLABORATION_FEASIBILITY_STUDY.md` |
| T005-GOVERNANCE-ALIGNMENT-AUDIT.md | `HORUS-GOVERNANCE/T005/T005-GOVERNANCE-ALIGNMENT-AUDIT.md` |
| STATE-ANCHOR-2025-12.md | `HORUS-GOVERNANCE/V005/ARCHIVE/STATE-ANCHOR-2025-12.md` |
| ADR-0001-T005-T002-B.md | `HORUS-GOVERNANCE/V005/ARCHITECTURE/ADR-0001-T005-T002-B.md` |
| T005.md | `HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md` |

---

*本文件為只讀掃描產出，不含建議、不下結論*
*掃描日期：2026-01-13*
*產出工具：Claude Code*
