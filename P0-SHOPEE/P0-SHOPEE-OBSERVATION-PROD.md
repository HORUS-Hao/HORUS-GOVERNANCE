# P0-SHOPEE-Observation-Prod

> **Status**: PLANNING (Read-only Design Phase)
> **Created**: 2026-01-24
> **Author**: Claude (Engineer) / Architect
> **Branch**: plan/p0-shopee-observation-prod

---

## 1. 模組定位

| 屬性 | 值 |
|------|-----|
| 性質 | Stateful / FACT Producer |
| 層級 | P0 (Observation) |
| 目的 | 提供「正式、可治理、可封存」之 Shopee 上架觀測資料 |
| 取代 | P0-SHOPEE-Observation-Test（僅測試，各店 1 筆） |

### 1.1 與 Test 模組的差異

| 項目 | P0-SHOPEE-Observation-Test | P0-SHOPEE-Observation-Prod |
|------|---------------------------|---------------------------|
| 資料量 | 各店 1 筆（驗證用） | 全商品（依資料源） |
| 用途 | 驗證寫入流程 | 正式治理資料 |
| 可封存 | ❌ 否 | ✅ 是 |
| 可進 Mail | ⚠️ 會顯示但標註 Test | ✅ 正式數據 |

---

## 2. 與 Web UI 的關係

| 系統 | 角色 | 資料流向 |
|------|------|----------|
| **Web UI** | Preview Tool（Stateless） | 使用者上傳 → 即時比對 → 不寫 FACT |
| **本模組** | 唯一 Shopee FACT 來源 | 資料源 → P0 → D005 → C005 |

### 2.1 嚴格邊界

- ❌ Web UI **禁止**直接寫入本模組資料
- ❌ Web UI **禁止**讀取本模組作為 Preview 來源
- ✅ Web UI 可讀取 T005 作為比對基準（與本模組獨立）

---

## 3. 下游影響範圍

```
P0-SHOPEE-Observation-Prod
    │
    ▼
D005 Listing_History（SKU 層）
    │ - 每 SKU / 每 Store / 每 Platform
    │ - 保留歷史時間序列
    │
    ▼
C005 Listing_History（平台聚合層）
    │ - 平台彙總（SHOPEE_KATAI / SHOPEE_GUSENSE）
    │
    ▼
┌────────────────────────────────────┐
│ Mail / Governance / 封存 / Tag     │
└────────────────────────────────────┘
```

### 3.1 下游模組清單

| 模組 | 影響類型 | 說明 |
|------|----------|------|
| D005 Listing_History | 直接寫入 | SKU 層級觀測資料 |
| C005_FactWriter | 讀取聚合 | 從 D005 聚合至 C005 |
| C005_MailService | 間接影響 | Mail 顯示 Shopee 數據 |
| Finalization | 間接影響 | 封存時納入 Shopee FACT |

---

## 4. Data Flow (Production)

```
┌─────────────────────────────────────────────────────────┐
│ [Source] Shopee 官方資料來源                              │
│                                                         │
│   選項（待裁定）：                                        │
│   - Option A: Shopee API（若可取得）                     │
│   - Option B: 定期報表（CSV/XLSX from Seller Center）    │
│   - Option C: 合規爬蟲（需法務確認）                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ [P0-SHOPEE-Observation-Prod]                            │
│                                                         │
│   - 解析資料源                                           │
│   - 正規化 SKU Key                                       │
│   - 標註 store_code (KATAI / GUSENSE)                   │
│   - 寫入 D005                                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ [FACT Layer - SKU] D005 Listing_History                 │
│                                                         │
│   - 每 SKU / 每 Store / 每 Platform                     │
│   - 保留歷史時間序列                                     │
│   - 可追溯 raw_source_ref                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ [FACT Layer - Platform] C005 Listing_History            │
│                                                         │
│   - 平台彙總（SHOPEE_KATAI / SHOPEE_GUSENSE）            │
│   - 供 Mail / 治理 / 報表使用                            │
└─────────────────────────────────────────────────────────┘
```

---

## 5. P0 Observation Schema (Draft)

### 5.1 最小欄位集

| 欄位名稱 | 類型 | 必填 | 說明 |
|----------|------|------|------|
| observation_date | DATE | ✅ | 觀測日期（YYYY-MM-DD） |
| store_code | STRING | ✅ | 店鋪代碼（KATAI / GUSENSE） |
| platform | STRING | ✅ | 固定值 = "SHOPEE" |
| sku | STRING | ✅ | 商品 SKU（需與 T005 對齊） |
| product_name | STRING | ✅ | 商品名稱 |
| listing_status | ENUM | ✅ | 上架狀態（ON / OFF） |
| price | NUMBER | ⚠️ | 售價（待決定是否納入） |
| raw_source_ref | STRING | ✅ | 原始資料來源（file_id / api_batch_id） |
| collected_at | TIMESTAMP | ✅ | 資料採集時間 |

### 5.2 欄位備註

- `sku`: 需定義正規化規則，確保與 T005 主檔可 JOIN
- `price`: 若僅觀測上架狀態，此欄位可標為 optional
- `raw_source_ref`: 用於資料重播與問題追溯

---

## 6. Governance Rules

### 6.1 資料寫入規則

| 規則 | 說明 |
|------|------|
| ❌ 禁止人工手動寫入 | 所有資料必須經由 P0 模組自動產生 |
| ✅ 可重播原則 | raw_source_ref 必填，任何資料可追溯至原始來源 |
| ✅ 異動需 ADR | 任一欄位定義變更，需建立 ADR 記錄 |

### 6.2 Finalization 條件

| 條件 | 說明 |
|------|------|
| 穩定天數 | 未滿 N 天穩定資料，不得進 Finalization（N 待裁定） |
| 資料完整性 | 需通過 C005 完整性檢查 |
| 無 Test 標記 | 必須為 Prod 資料，非 Test 模組產出 |

### 6.3 與既有治理文件關係

| 文件 | 關係 |
|------|------|
| ADR-C005-SHOPEE-OBSERVATION-STATUS.md | 說明 Test 狀態，本模組啟用後需更新 |
| C005_PHASE2_READINESS.md | Eligibility 啟用時需納入 Shopee |
| C005_TOTAL_POPULATION_SNAPSHOT.md | 母數計算需納入 Shopee Prod 資料 |

---

## 7. Open Decisions (Required Before Build)

以下決策點必須在實作前由 Architect 裁定：

### 7.1 資料取得方式

| 選項 | 優點 | 缺點 | 決策 |
|------|------|------|------|
| Shopee API | 官方、即時 | 需申請、有 rate limit | ⏳ PENDING |
| Seller Center 報表 | 簡單、穩定 | 手動下載、延遲 | ⏳ PENDING |
| 合規爬蟲 | 自動化 | 法律風險、維護成本 | ⏳ PENDING |

### 7.2 執行頻率

| 選項 | 適用場景 | 決策 |
|------|----------|------|
| 每日一次 | 一般監控 | ⏳ PENDING |
| 每小時 | 即時性需求 | ⏳ PENDING |
| 事件觸發 | 特定條件才執行 | ⏳ PENDING |

### 7.3 SKU Key 正規化規則

| 問題 | 說明 | 決策 |
|------|------|------|
| Shopee SKU 格式 | Shopee 原生 SKU 格式為何？ | ⏳ 待調查 |
| T005 對齊方式 | 如何與 T005 主檔 JOIN？ | ⏳ PENDING |
| 多店同 SKU | KATAI/GUSENSE 是否有相同 SKU？ | ⏳ 待確認 |

### 7.4 Observation 與 Pricing 的邊界

| 問題 | 選項 | 決策 |
|------|------|------|
| 是否納入價格？ | A: 僅觀測上架狀態 | ⏳ PENDING |
|  | B: 同時記錄價格 | ⏳ PENDING |
| 價格變動追蹤 | 若納入，是否追蹤歷史價格？ | ⏳ PENDING |

### 7.5 Finalization 條件

| 問題 | 說明 | 決策 |
|------|------|------|
| 穩定天數 N | 多少天穩定資料才可封存？ | ⏳ PENDING |
| 最小資料量 | 是否需達到某筆數才算有效？ | ⏳ PENDING |

---

## 8. 與現行架構衝突檢查

### 8.1 已識別潛在衝突

| 項目 | 現況 | 衝突風險 | 處理建議 |
|------|------|----------|----------|
| D005 Listing_History | 已有 SHOPEE 資料（Test） | ⚠️ 低 | Prod 啟用後覆蓋 Test 資料 |
| C005 聚合邏輯 | 已支援 SHOPEE_KATAI/GUSENSE | ✅ 無衝突 | 直接沿用 |
| Mail Guardrail | 已加入 Test 說明 | ⚠️ 需更新 | Prod 啟用後移除 Test 說明 |

### 8.2 無衝突確認

| 項目 | 說明 |
|------|------|
| T005 主檔 | 獨立系統，無直接衝突 |
| Web UI | Stateless Preview，無交互 |
| 其他平台 P0 模組 | 獨立運作，無衝突 |

---

## 9. Changelog

| 日期 | 版本 | 變更 | 作者 |
|------|------|------|------|
| 2026-01-24 | 0.1.0 | 初始規劃文件（Read-only Design） | Claude |

---

## 10. Related Documents

- `ADR/ADR-C005-SHOPEE-OBSERVATION-STATUS.md` - Shopee Test 狀態說明
- `C005/C005_PHASE2_READINESS.md` - Phase 2 Eligibility 準備度
- `C005/C005_TOTAL_POPULATION_SNAPSHOT.md` - 母數定義
- `10-基礎服務層-BASE-SERVICES/P0-SHOPEE-Observation-Test/` - 現有 Test 模組
