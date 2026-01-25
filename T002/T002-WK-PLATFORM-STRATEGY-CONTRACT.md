# T002-WK-PLATFORM-STRATEGY-CONTRACT

> **Status**: APPROVED
> **Date**: 2026-01-25
> **Architect**: Claude Code
> **Decision**: FINAL

---

## 1. Purpose (目的)

本文件定義 T002-WK-平台建檔名稱 工作表的治理契約，作為「平台是否上架」策略判斷的唯一擴充層。

---

## 2. WK 工作表定位

### 2.1 屬性定義

| 屬性 | 值 |
|------|-----|
| 工作表名稱 | `T002-WK-平台建檔名稱` |
| 類型 | **WK = Working（人工策略表）** |
| Canonical 狀態 | **Non-Canonical** |
| 同步納入 | **No**（不參與 T002 → T005 同步） |
| 資料來源 | **No**（不作為任何 Canonical 資料來源） |
| 用途 | 定義「商品要去哪些平台銷售」的策略層 |

### 2.2 與 Canonical 的關係

```
┌─────────────────────────────────────────────────────────────┐
│  T005-1.商品主表 (Canonical SSOT)                          │
│  └─ 商品狀態 → Lifecycle（總開關）                          │
│                                                             │
│  T002-1.商品主表 (Canonical)                                │
│  └─ 商品身分 / 規格 / 成本                                  │
│                                                             │
│  T002-WK-平台建檔名稱 (Non-Canonical, Strategy Layer)       │
│  └─ 平台策略（可擴充）                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 雙層判斷模型 (Two-Layer Decision Model)

### 3.1 Layer 1：總開關（不可繞過）

| 來源 | T005-1.商品主表 → 商品狀態 |
|------|---------------------------|
| 判斷依據 | T005_LISTING_ELIGIBILITY mapping |
| 權威性 | **唯一 Source of Truth** |

| 商品狀態 | Layer 1 結果 | 說明 |
|----------|-------------|------|
| 正常銷售 | ✅ 進入 Layer 2 | 允許上架判斷 |
| 庫存不足 | ✅ 進入 Layer 2 | 缺貨 ≠ 不可上架 |
| 新品開發 | ❌ 全平台禁止 | 尚未對外販售 |
| 停止銷售 | ❌ 全平台禁止 | 策略停售 |
| 停產 | ❌ 全平台禁止 | 生命週期結束 |

**Hard Rule**: 任何模組不得跳過 T005 商品狀態檢查。

### 3.2 Layer 2：平台策略（可擴充）

| 來源 | T002-WK-平台建檔名稱 |
|------|---------------------|
| 判斷規則 | 有建檔名稱 = Enable，無建檔名稱 = Disable |
| 擴充方式 | 新增欄位即可 |

**核心規則**：

```
「有建檔名稱 = 該平台 Enable」
「無建檔名稱 = 該平台 Disable」
```

### 3.3 Architect 裁定：Naming = Intent 模型（FINAL）

> **Decision Date**: 2026-01-25
> **Status**: FINAL (不可變更)

**T002-WK-平台建檔名稱 本身就是「是否要上架」的唯一顯性標示。**

```
WK.<平台>建檔名稱 ≠ 空白  → PlatformIntent = TRUE（允許上架）
WK.<平台>建檔名稱 = 空白  → PlatformIntent = FALSE（不上架）
```

**語意定義**：
- 「填名稱 = 我要賣」
- 「不填 = 我不要賣」

**這是刻意設計，不是暫時妥協。**

### 3.4 為什麼不加「是否上架」欄位

| 理由 | 說明 |
|------|------|
| 避免雙源衝突 | 若 `是否上架=TRUE` 但 `建檔名稱=空白`，系統無法裁定人類真實意圖 |
| 人類操作錯誤率 | 人會忘記勾、人會只勾不填、人會複製列導致狀態錯亂 |
| 治理原則 | Strategy 應該是「有實際行為的資料」，建檔名稱=已思考過，勾選=空泛意圖 |

**禁止事項**：
- ❌ 不新增「是否上架」布林欄位
- ❌ 不新增 enable / disable / on_off 類型欄位
- ❌ 不新增平台勾選欄 (checkbox)
- ❌ 不在 T002 主表新增任何平台欄位
- ❌ 不在 T005 增加平台欄位

---

## 4. 平台擴充流程

### 4.1 新增平台步驟

當需要新增平台（例：TikTok Shop）：

| 步驟 | 動作 | 影響範圍 |
|------|------|----------|
| 1 | 在 T002-WK-平台建檔名稱 新增一欄 | WK 工作表 |
| 2 | 欄位命名：`TikTok 建檔名稱` | WK 工作表 |
| 3 | 完成 | 無其他變更 |

### 4.2 不需要做的事

- ❌ 改 T002 主表
- ❌ 改 T005 Schema
- ❌ 改 UID / 同步結構
- ❌ 改任何 Canonical 文件
- ❌ 修改程式碼（Phase 2 才啟用）

### 4.3 下游模組行為（Phase 2）

```javascript
// 正確：動態掃描 WK Header
var platforms = getWKPlatformColumns(); // ['MOMO', 'PCHOME', 'YAHOO', ...]

// 錯誤：硬編碼平台
var platforms = ['MOMO', 'PCHOME']; // ❌ 禁止
```

---

## 5. 模組責任切分

| 模組 | 職責 | 資料類型 |
|------|------|----------|
| **T005** | 定義「這商品還要不要賣」 | Lifecycle（生命週期） |
| **T002** | 定義「這商品是誰」 | Identity（身分、規格） |
| **T002-WK** | 定義「要去哪裡賣」 | Strategy（平台策略） |
| **C005** | 執行者（Phase 2 才讀 WK） | Execution |
| **R020** | 僅做市場觀察 | Observation |

---

## 6. 明確禁止事項 (Hard Constraints)

### 6.1 Schema 層

❌ **不可在 T002 主表新增 `[是否上 MOMO]` 類欄位**

❌ **不可在 T005 新增「平台上架狀態」**

❌ **不可讓「庫存不足」影響是否上架**（僅影響供貨）

❌ **不可在 T002-WK 新增「是否上架」布林欄位**

❌ **不可新增 checkbox / enable / on_off 類型欄位**

### 6.2 程式碼層

❌ **不可在 C005 / R020 各自硬編碼平台判斷**

❌ **不可繞過 T005 商品狀態檢查**

❌ **不可直接使用 WK 資料而不經過治理層映射**

### 6.3 程式端唯一允許語意

```javascript
// C005 EligibilityService.js - 唯一判斷邏輯
const enabled =
  lifecycle === '正常銷售' &&
  wkPlatformName && wkPlatformName.trim() !== '';
```

**沒有其他判斷分支。**

### 6.4 未來禁止改法

❌ **不要改成「一商品多列（platform_code, enable）」**
- 人類會看不懂
- Sheet 會爆炸
- PM 會填錯

❌ **不要做平台策略獨立 Canonical 表**

---

## 7. Phase 控制

| Phase | 狀態 | 說明 |
|-------|------|------|
| Phase 1 | **Current** | 治理文件完成，WK 結構定義，程式未啟用 |
| Phase 2 | Pending | C005 啟用 WK 讀取，實作動態平台掃描 |

---

## 8. WK 欄位結構（參考）

```
T002-WK-平台建檔名稱 (15 欄)
├─ A-I：系統欄位（受保護，公式參照 T002-1）
│   A: UID
│   B: 供應商
│   C: PM
│   D: 品牌
│   E: 商品型號
│   F: 商品名稱
│   G: 商品大類
│   H: 商品中類
│   I: 商品小類
│
├─ J-N：平台建檔名稱（人工填寫，可擴充）
│   J: MOMO 建檔名稱
│   K: PCHOME 建檔名稱
│   L: YAHOO 建檔名稱
│   M: SHOPEE 建檔名稱
│   N: COUPANG 建檔名稱
│   (可繼續新增...)
│
└─ O：備註（人工填寫）
```

---

## 9. Related Documents

| 文件 | 說明 |
|------|------|
| `ADR-T005-LISTING-ELIGIBILITY-SOURCE.md` | T005 商品狀態為 Eligibility 唯一來源 |
| `T005_Status_Enum.js` | T005_LISTING_ELIGIBILITY 實作 |
| `11-PlatformNamingSheet.js` | T002-WK 建立與同步腳本 |
| `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | T005 Canonical Schema |

---

## 10. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.1 | Architect 裁定 "Naming = Intent" 模型為 FINAL，新增禁止事項 |
| 2026-01-25 | 1.0 | Initial contract - 雙層判斷模型定錨 |

---

**END OF T002-WK-PLATFORM-STRATEGY-CONTRACT.md**
