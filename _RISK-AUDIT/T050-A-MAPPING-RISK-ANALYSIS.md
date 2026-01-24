# T050-A Mapping Risk Analysis

> **Status**: Draft
> **Audit Date**: 2026-01-24
> **Auditor**: Claude Code (Architect Mode)
> **Scope**: 既有 Mapping / 對照表風險盤點

---

## 1. 審計目的

在建立 T050-A-Platform-Product-Mapping-PCHOME 之前，
盤點既有系統中可能與 T050-A 功能重疊或衝突的文件與資料結構。

---

## 2. 發現的既有文件

### 2.1 高風險項目

| 路徑 | 風險等級 | 問題描述 |
|------|---------|---------|
| `HORUS-GOVERNANCE/DATA_CONTRACTS/R020/R020_DATA_CONTRACT_v1.0.md` | **高** | 使用「商品型號」做 JOIN，違反前提約束 |

#### R020 風險詳述

**發現內容**：
- R020 定義中使用「商品型號」與 T005 JOIN
- 文件中記載 T005 JOIN 欄位包含：supplier, brand, 商品型號, 商品名稱, 商品大類

**違反約束**：
- 「商品型號（raw）不可視為唯一鍵」
- 商品型號不穩定，可能變更、重複、或格式不一致

**潛在後果**：
- JOIN 結果可能出現漏配或錯配
- 一型多頁情境無法正確處理
- 統計數據失真

**不立即修改的理由**：
- R020 為現行運作中的模組
- 直接修改可能影響現有報表與計算
- 需安排遷移計畫與相容期

**建議後續處理**：
1. 評估 R020 影響範圍
2. 規劃 R020 v2.0 改用 `t005_uid` 做 JOIN
3. 設定過渡期，雙欄位並存
4. 完成遷移後移除商品型號 JOIN

---

### 2.2 中風險項目

| 路徑 | 風險等級 | 問題描述 | 狀態 |
|------|---------|---------|------|
| `HORUS-GOVERNANCE/C005/ADR-003-C005-STRATEGY-MAPPING-SSOT.md` | ~~**中**~~ | ~~`product_id` 語意不明確~~ | **Resolved** |
| `HORUS-GOVERNANCE/PLATFORM/PLATFORM_STATUS_VIEW.md` | **中** | JOIN key 未明確定義 | Open |

#### C005 Strategy Mapping 風險詳述

> **Resolved on 2026-01-24** via ADR-003 v1.2

**原始發現內容**（保留歷史紀錄）：
- 使用 `product_id + platform_code` 作為複合主鍵
- `product_id` 在文件中未明確定義是 UID 或商品型號

**原始潛在問題**：
- 若 `product_id` = 商品型號，則與 T050-A 設計衝突
- 若 `product_id` = t005_uid，則需明確標註

---

**Resolution Note (2026-01-24)**：

| 項目 | 說明 |
|------|------|
| 解決方式 | ADR-003 v1.2 已明確裁定：`product_id` = `t005_uid` |
| 文件更新 | ADR-003 Section 2.4 新增 Clarification: product_id 語意說明 |
| 範例更新 | Appendix A 範例從 `SKU-001` 改為 `UID-20260101-001` 格式 |
| 程式碼一致性 | 與 Config.js `T005_CANONICAL_FIELDS.PRIMARY_KEY = 'UID'` 一致 |
| T050-A 一致性 | 與 T050-A-GOVERNANCE.md 的 `t005_uid` 定義一致 |
| 後續行動 | **Completed** - 無需進一步行動 |

**風險狀態**：
- 狀態：**Resolved / Closed**
- 影響：**None**
- 行動項目：**Completed**

---

~~**不立即修改的理由**~~：（已解決，以下為歷史紀錄）
- ~~C005 Phase 3 策略模組正在開發中~~
- ~~需確認現行實作使用哪種識別碼~~

~~**建議後續處理**~~：（已完成）
1. ~~釐清 `product_id` 的實際語意~~ ✅
2. ~~若為商品型號，規劃改用 `t005_uid`~~ ✅ 已確認為 UID
3. ~~更新 ADR 文件明確標註~~ ✅ ADR-003 v1.2
4. ~~與 T050-A 建立關聯規範~~ ✅ ADR-003 Related Documents 已新增

#### Platform Status View 風險詳述

**發現內容**：
- 定義 `momo_status`, `pchome_status`, `yahoo_status`, `shopee_status` 欄位
- Status enum 包含 SHOULD_LIST, LISTED, CONFLICT 等
- 但未明確說明與 T005 或平台的 JOIN key

**不立即修改的理由**：
- 此為 View 定義，非實際資料表
- 需先確認消費此 View 的模組

**建議後續處理**：
1. 補充 JOIN key 定義（應為 `t005_uid`）
2. 評估是否與 T050-A 整合

---

### 2.3 低風險項目

| 路徑 | 風險等級 | 說明 |
|------|---------|------|
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/schemas/field-mapping.json` | **低** | 欄位層級映射，與 T050-A 不衝突 |
| `BASE-SERVICES/HORUS-GOVERNANCE/T005/T005_SALES_COMPANY_Field-Mapping.md` | **低** | 內部欄位對照，非平台映射 |
| `BASE-SERVICES/C005-Listing-Checker/webapp/Config.js` | **低** | 程式配置檔，非資料表定義 |
| `HORUS-GOVERNANCE/ECOM-EXCEL欄位整合裁定表.md` | **低** | Excel 欄位整合，非平台映射 |

---

## 3. 風險矩陣總覽

| 風險等級 | 數量 | 處理優先級 | 備註 |
|---------|------|-----------|------|
| 高 | 1 | 需優先處理 | R020 商品型號 JOIN |
| 中 | 1 | 需釐清後處理 | Platform Status View |
| 中 (Resolved) | 1 | - | C005 product_id 語意 ✅ |
| 低 | 4 | 暫不處理 | - |

---

## 4. 建議/禁止/風險 行動清單

| 類型 | 項目 | 說明 |
|-----|------|------|
| **建議** | T050-A 作為平台映射唯一 SSOT | 統一入口，避免散落 |
| **建議** | 使用 `t005_uid` 作為 HORUS 內部 key | 穩定、唯一 |
| **建議** | 保留 `product_model_raw` 僅供佐證 | 人工校驗用，不參與 JOIN |
| **禁止** | 以商品型號作為 JOIN key | 非唯一、不穩定 |
| **禁止** | 模組內部維護平行 mapping | 資料分歧風險 |
| **禁止** | 未經審核直接修改既有模組 | 需遷移計畫 |
| **風險** | 既有 R020 使用型號 JOIN | 需安排遷移 |
| ~~**風險**~~ | ~~Strategy Mapping product_id 語意不明~~ | ✅ Resolved (ADR-003 v1.2) |

---

## 5. 後續處理建議時程

| 階段 | 項目 | 建議時程 | 狀態 |
|------|------|---------|------|
| 1 | T050-A Draft 審核通過 | 優先 | Pending |
| 2 | ~~釐清 C005 Strategy Mapping product_id 語意~~ | ~~T050-A 通過後~~ | ✅ Completed (2026-01-24) |
| 3 | 規劃 R020 遷移至 t005_uid JOIN | 評估影響後 | Pending |
| 4 | Platform Status View 補充 JOIN key | 視需求 | Pending |

---

## 6. 審計聲明

本次風險分析僅為盤點性質：
- **不立即修改** 任何既有檔案
- **不建議刪除** 任何既有檔案
- 所有處理建議需經正式審核後執行

---

## 7. 版本紀錄

| 版本 | 日期 | 變更說明 |
|-----|------|---------|
| v0.1 | 2026-01-24 | 初版 Draft |
| v0.2 | 2026-01-24 | Mark C005 product_id ambiguity as resolved (ADR-003 v1.2) |

---

## 8. 相關文件

- [T050-A-Platform-Product-Mapping-PCHOME.md](../T050/T050-A-Platform-Product-Mapping-PCHOME.md) - 資料表定義
- [T050-A-GOVERNANCE.md](../T050/T050-A-GOVERNANCE.md) - 治理規範
- [ADR-003-C005-STRATEGY-MAPPING-SSOT.md](../C005/ADR-003-C005-STRATEGY-MAPPING-SSOT.md) - C005 Strategy Mapping SSOT (v1.2)
