# R020 Data Contract v1.0

> **文件性質**：正式契約
> **版本**：v1.0
> **建立日期**：2026-01-03
> **生效日期**：2026-01-03
> **狀態**：EFFECTIVE
> **權威落點**：`G:\我的雲端硬碟\HORUS-GOVERNANCE\DATA_CONTRACTS\R020\R020_DATA_CONTRACT_v1.0.md`

---

## 裁決格式說明

| Decision 值 | 語義 |
|-------------|------|
| **KEEP** | 保留現行為，升格為正式規範 |
| **FORBID** | 禁止此行為，需修正程式碼 |
| **DEPRECATE** | 標記淘汰，設定移除時程 |
| **TBD** | 待 Architect 裁決（預設值） |

---

## 1. Authority & Scope（權威與範圍）

### R020-CONTRACT-001
| 項目 | 內容 |
|------|------|
| **條文** | R020 Data Contract 為 R020 Price-Comparator 模組的唯一資料契約權威 |
| **Source** | 隱性契約稿 §4.A：程式碼引用 `R020_DATA_CONTRACT.md` 但檔案不存在 |
| **Decision** | KEEP |
| **Notes** | 目前程式碼註解聲明 "This file is NOT the source of truth. The contract IS." 但 contract 不存在 |

### R020-CONTRACT-002
| 項目 | 內容 |
|------|------|
| **條文** | 本契約適用範圍：R020_CompareResult、R020_MyPrices、Price_Results 工作表，以及與 T005 的 JOIN 規則 |
| **Source** | 隱性契約稿 §1 模組概覽 - 工作表清單 |
| **Decision** | KEEP |
| **Notes** | T005 契約為獨立文件，本契約僅定義 JOIN 介面 |

### R020-CONTRACT-003
| 項目 | 內容 |
|------|------|
| **條文** | 程式碼內的註解、QUICK REFERENCE 區塊不具契約效力，僅供開發參考 |
| **Source** | 隱性契約稿 §4.A：`PriceComparer.js:1-35`, `gas_api.js:1-35` |
| **Decision** | KEEP |
| **Notes** | 明確權威鏈：Contract > Code > Sheet > CSV |

---

## 2. Canonical Concepts（標準概念定義）

### R020-CONTRACT-010
| 項目 | 內容 |
|------|------|
| **條文** | SKU 定義：在 R020 上下文中，SKU 指「商品型號」，非 UID |
| **Source** | 隱性契約稿 §3.A：SKU/Model/商品型號混用情況；`gas_api.js:2406` 註解 "SKU 對照用商品型號" |
| **Decision** | KEEP |
| **Notes** | 風險：不同位置 SKU 可能指 UID、型號、或正規化型號 |

### R020-CONTRACT-011
| 項目 | 內容 |
|------|------|
| **條文** | Platform 有效值：PCHOME, MOMO, YAHOO, SHOPEE（全大寫） |
| **Source** | 隱性契約稿 §1 工作表清單；`PriceComparer.js:146` 使用 `.toLowerCase()` 比對 |
| **Decision** | KEEP |
| **Notes** | YAHOO, SHOPEE 為 listingOnly 平台（無售價比對） |

### R020-CONTRACT-012
| 項目 | 內容 |
|------|------|
| **條文** | myPrice（我方售價）SSOT = R020_MyPrices（平台匯出即時資料） |
| **Source** | 隱性契約稿 §3.D；`gas_api.js:2057-2062` 明確聲明 |
| **Decision** | KEEP |
| **Notes** | C005 不作為 R020 即時比價來源 |

### R020-CONTRACT-013
| 項目 | 內容 |
|------|------|
| **條文** | platformCost（平台成本）SSOT = R020_MyPrices；costT005（商品成本）SSOT = T005 `含稅成本` 欄位 |
| **Source** | 隱性契約稿 §3.C；`gas_api.js:2070, 2173` |
| **Decision** | KEEP |
| **Notes** | 兩種成本語義不同，不得混用 |

### R020-CONTRACT-014
| 項目 | 內容 |
|------|------|
| **條文** | stock（庫存）語義：null = 未知，0 = 確定缺貨 |
| **Source** | 隱性契約稿 §2.B；`R020_Utils.js:195-225` R020_parseStock_() |
| **Decision** | KEEP |
| **Notes** | 嚴禁 null → 0 fallback |

---

## 3. Data Sources & Sheet Contracts（資料來源與工作表契約）

### R020-CONTRACT-020
| 項目 | 內容 |
|------|------|
| **條文** | R020_CompareResult 工作表為 R020 Fact 表，共 23 欄 |
| **Source** | 隱性契約稿 §2.A；`PriceComparer.js:501-506` 硬編碼表頭 |
| **Decision** | KEEP |
| **Notes** | CSV 匯出只有 20 欄，缺少 ResultStatus/ResultReason/ConfidenceScore |

### R020-CONTRACT-021
| 項目 | 內容 |
|------|------|
| **條文** | R020_CompareResult 表頭定義（23 欄）：平台, SKU, 平台ID, 商品名稱, 我方售價, 平台成本, 庫存, 出貨方式, 市場最低, 市場均價, 價差, 價差%, 競品數, 有競爭力, 狀態, 更新時間, 庫存同步時間, PM, StoreCode, ProductUrl, ResultStatus, ResultReason, ConfidenceScore |
| **Source** | `PriceComparer.js:501-506` |
| **Decision** | KEEP |
| **Notes** | 任何欄位異動需先更新本契約 |

### R020-CONTRACT-022
| 項目 | 內容 |
|------|------|
| **條文** | Price_Results 工作表必要欄位：Timestamp, UID, Model, Platform, ProductName, Price, Url |
| **Source** | 隱性契約稿 §2.A；`PriceComparer.js:128-136` headers.indexOf() |
| **Decision** | KEEP |
| **Notes** | 欄位不存在時 index = -1，該欄位值為 undefined |

### R020-CONTRACT-023
| 項目 | 內容 |
|------|------|
| **條文** | Price_Results 資料過濾規則：ProductName = "未找到" 或空值時跳過；Price 無效（null/NaN/≤0）時跳過 |
| **Source** | 隱性契約稿 §2.A；`PriceComparer.js:152-163` |
| **Decision** | KEEP |
| **Notes** | 使用 R020_parsePrice_() 解析 |

### R020-CONTRACT-024
| 項目 | 內容 |
|------|------|
| **條文** | T005 JOIN 使用欄位名稱定義於 T005_CANONICAL_FIELDS：供應商, 品牌, 商品型號, 商品名稱, 商品大類, 商品中類, 商品小類, 含稅成本 |
| **Source** | 隱性契約稿 §4.D；`gas_api.js:1982-1991` |
| **Decision** | KEEP |
| **Notes** | 標記 SCHEMA FROZEN - T005 Canonical Schema v1.0 (2025-12-31) |

---

## 4. Null/Zero Semantics（空值與零值語義）

### R020-CONTRACT-030
| 項目 | 內容 |
|------|------|
| **條文** | platformCost：null = 未知，0 = 確定為零。不得將 null fallback 為 0 |
| **Source** | 隱性契約稿 §2.B；`gas_api.js:2130-2133` |
| **Decision** | KEEP |
| **Notes** | 程式碼已正確實作 |

### R020-CONTRACT-031
| 項目 | 內容 |
|------|------|
| **條文** | stock：null = 未知，0 = 缺貨。不得將 null fallback 為 0 |
| **Source** | 隱性契約稿 §2.B；`gas_api.js:2135-2138` |
| **Decision** | KEEP |
| **Notes** | 程式碼已正確實作 |

### R020-CONTRACT-032
| 項目 | 內容 |
|------|------|
| **條文** | marketMin：null = 無市場資料。不得將 null fallback 為 0 |
| **Source** | 隱性契約稿 §2.B；`gas_api.js:2140-2143` |
| **Decision** | KEEP |
| **Notes** | 程式碼已正確實作 |

### R020-CONTRACT-033
| 項目 | 內容 |
|------|------|
| **條文** | competitorCount：使用 `|| 0` 處理。風險：0 可能是「無競品」或「未計算」 |
| **Source** | 隱性契約稿 §2.C；`PriceComparer.js:371` |
| **Decision** | DEPRECATE |
| **Notes** | 語義不可區分，待裁決是否需修正 |

### R020-CONTRACT-034
| 項目 | 內容 |
|------|------|
| **條文** | priceDiffPercent：使用 `parseFloat(...) || 0` 處理。風險：0 可能是「無價差」或「無資料」 |
| **Source** | 隱性契約稿 §2.C；`PriceComparer.js:393` |
| **Decision** | DEPRECATE |
| **Notes** | 語義不可區分，待裁決是否需修正 |

### R020-CONTRACT-035
| 項目 | 內容 |
|------|------|
| **條文** | T005 JOIN 欄位（supplier, brand 等）：欄位不存在時回傳空字串 '' |
| **Source** | 隱性契約稿 §2.C；`gas_api.js:2432-2438` |
| **Decision** | DEPRECATE |
| **Notes** | 空字串無法區分「欄位不存在」vs「欄位存在但值為空」 |

---

## 5. Join & Fallback Policy（JOIN 與 Fallback 政策）

### R020-CONTRACT-040
| 項目 | 內容 |
|------|------|
| **條文** | T005 JOIN 優先順序：精確匹配 SKU → 字串包含匹配（SKU ≥ 4 字元） |
| **Source** | 隱性契約稿 §2.A；`gas_api.js:2102-2118` |
| **Decision** | KEEP |
| **Notes** | 字串包含匹配為 fallback，可能產生誤匹配 |

### R020-CONTRACT-041
| 項目 | 內容 |
|------|------|
| **條文** | 市場價格匹配：精確匹配優先 → 字串包含（SKU ≥ 4 字元） |
| **Source** | 隱性契約稿 §1（QUICK REFERENCE）；`PriceComparer.js:235-249` |
| **Decision** | KEEP |
| **Notes** | 同 T005 規則 |

### R020-CONTRACT-042
| 項目 | 內容 |
|------|------|
| **條文** | R020_MatchDict（人工審核字典）優先於 T005 自動匹配 |
| **Source** | 隱性契約稿 §1 工作表清單；`R020_Competitor.js:788-823` |
| **Decision** | KEEP |
| **Notes** | 字典匹配來源標記為 'DICT'，T005 匹配來源標記為 'T005' |

### R020-CONTRACT-043
| 項目 | 內容 |
|------|------|
| **條文** | 禁止從 SKU/商品名稱推測品牌 |
| **Source** | `_GOVERNANCE/DECISION-2025-12-29-R020-v5-brand-std.md` §4 Prohibited Actions |
| **Decision** | KEEP |
| **Notes** | 明確禁止任何推斷行為 |

---

## 6. Fact vs View Boundary（Fact 與 View 邊界）

### R020-CONTRACT-050
| 項目 | 內容 |
|------|------|
| **條文** | R020_CompareResult 為 Fact 表，設計上不包含品牌欄位 |
| **Source** | `_GOVERNANCE/DECISION-2025-12-29-R020-v5-brand-std.md` §1 Context |
| **Decision** | KEEP |
| **Notes** | Web 顯示的品牌來自 View 層即時 JOIN T005 |

### R020-CONTRACT-051
| 項目 | 內容 |
|------|------|
| **條文** | View 層（Web、Mail）可即時 JOIN T005 顯示品牌，但不得寫回 Fact 表 |
| **Source** | `_GOVERNANCE/DECISION-2025-12-29-R020-v5-brand-std.md` §2.1 |
| **Decision** | KEEP |
| **Notes** | "(Brand Missing)" 是正確的治理訊號，不是 bug |

### R020-CONTRACT-052
| 項目 | 內容 |
|------|------|
| **條文** | R020_DailyView 為唯讀 View，不得重新計算任何數值 |
| **Source** | `R020_DailyView.js:9-16` 註解明確禁止 |
| **Decision** | KEEP |
| **Notes** | 禁止呼叫 R020_calcResultStatus_() 或任何 Core 函數 |

### R020-CONTRACT-053
| 項目 | 內容 |
|------|------|
| **條文** | ResultStatus 僅可由 Fact 層計算，View 層只能讀取與顯示 |
| **Source** | `_GOVERNANCE/CONTRACT-2025-12-29-View-Status-Spec.md` §3 |
| **Decision** | KEEP |
| **Notes** | View 不可 derive、infer、或 escalate status |

---

## 7. Normalization Policy（正規化政策）

### R020-CONTRACT-060
| 項目 | 內容 |
|------|------|
| **條文** | 目前存在至少 4 種正規化函數定義 |
| **Source** | 隱性契約稿 §3.B |
| **Decision** | KEEP |
| **Notes** | 規則略有不同，可能導致匹配不一致 |

### R020-CONTRACT-061
| 項目 | 內容 |
|------|------|
| **條文** | R020_normalizeModel_()：大寫 + 移除 [-_\s\/\.] |
| **Source** | `PriceComparer.js:70-76` |
| **Decision** | KEEP |
| **Notes** | 基礎正規化 |

### R020-CONTRACT-062
| 項目 | 內容 |
|------|------|
| **條文** | R020_normalizeModelLoose_()：基礎 + 移除後綴 -1P,-B,-W,-BK,-WH,-BKM,-WHM |
| **Source** | `PriceComparer.js:83-94` |
| **Decision** | KEEP |
| **Notes** | 寬鬆匹配用 |

### R020-CONTRACT-063
| 項目 | 內容 |
|------|------|
| **條文** | R020_normalizeForMatch_()：基礎 + 移除品牌前綴 NB-,SP-,AVA-,ITW- |
| **Source** | `R020_Competitor.js:651-666` |
| **Decision** | KEEP |
| **Notes** | 競品匹配專用 |

### R020-CONTRACT-064
| 項目 | 內容 |
|------|------|
| **條文** | 正規化函數分散風險：不同場景使用不同規則，可能導致同一 SKU 匹配結果不一致 |
| **Source** | 隱性契約稿 §5 事實總結 |
| **Decision** | KEEP |
| **Notes** | 需裁決是否統一、或明確劃分適用場景 |

---

## 8. Forbidden Behaviors（禁止行為）

### R020-CONTRACT-070
| 項目 | 內容 |
|------|------|
| **條文** | 禁止自動產生 R020_DATA_CONTRACT.md |
| **Source** | 隱性契約稿說帖 §5 禁止事項 |
| **Decision** | KEEP |
| **Notes** | Contract 必須由 Architect 核准 |

### R020-CONTRACT-071
| 項目 | 內容 |
|------|------|
| **條文** | 禁止自動產生任何 Schema YAML |
| **Source** | 隱性契約稿說帖 §5 禁止事項 |
| **Decision** | KEEP |
| **Notes** | YAML 必須在 Contract 定稿後才補 |

### R020-CONTRACT-072
| 項目 | 內容 |
|------|------|
| **條文** | 禁止將 NULL 合理化為 0 |
| **Source** | 隱性契約稿說帖 §5 禁止事項 |
| **Decision** | KEEP |
| **Notes** | NULL = UNKNOWN，不得擅自變成 0 |

### R020-CONTRACT-073
| 項目 | 內容 |
|------|------|
| **條文** | 禁止把工程 workaround 寫成正式規範 |
| **Source** | 隱性契約稿說帖 §5 禁止事項 |
| **Decision** | KEEP |
| **Notes** | Decision 必須經 Architect 裁決 |

### R020-CONTRACT-074
| 項目 | 內容 |
|------|------|
| **條文** | 禁止在 Mail/View 層 JOIN T005 補品牌後寫入 Fact |
| **Source** | `_GOVERNANCE/DECISION-2025-12-29-R020-v5-brand-std.md` §4 |
| **Decision** | KEEP |
| **Notes** | 已有治理決策 |

### R020-CONTRACT-075
| 項目 | 內容 |
|------|------|
| **條文** | 禁止在 R020_writeCompareResult_() 進行 Hotfix 補品牌 |
| **Source** | `_GOVERNANCE/DECISION-2025-12-29-R020-v5-brand-std.md` §4 |
| **Decision** | KEEP |
| **Notes** | 已有治理決策 |

---

## 9. Compliance & Audit Hooks（合規與稽核）

### R020-CONTRACT-080
| 項目 | 內容 |
|------|------|
| **條文** | R020_ContractGuard.gs 為 Debug 用驗證工具，非強制執行 |
| **Source** | 隱性契約稿 §5 事實總結；`PriceComparer.js:32` |
| **Decision** | KEEP |
| **Notes** | 目前僅用於測試，無 CI/CD 整合 |

### R020-CONTRACT-081
| 項目 | 內容 |
|------|------|
| **條文** | _FACT_REGISTRY/R020_AI_ACTION_BOUNDARY_v0.1.yaml 被引用但不存在 |
| **Source** | 隱性契約稿 §4.B；`HORUS-DERIVED/R020/_DERIVED_METADATA.txt` |
| **Decision** | FORBID |
| **Notes** | 需裁決是否建立、或移除引用 |

### R020-CONTRACT-082
| 項目 | 內容 |
|------|------|
| **條文** | _FACT_REGISTRY/SCHEMA_R020_REGISTRY_v0.1.yaml 被引用但不存在 |
| **Source** | 隱性契約稿 §4.B；`HORUS-DERIVED/R020/_DERIVED_METADATA.txt` |
| **Decision** | FORBID |
| **Notes** | 需裁決是否建立、或移除引用 |

### R020-CONTRACT-083
| 項目 | 內容 |
|------|------|
| **條文** | R020-Price-Comparator/_FACT_REGISTRY/ 目錄已刪除（2026-01-03） |
| **Source** | 隱性契約稿附錄；Architect 裁決（2026-01-03） |
| **Decision** | KEEP |
| **Notes** | 模組內不再保留 _FACT_REGISTRY/；唯一權威位於 HORUS-GOVERNANCE/ |

---

## 10. Changelog

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0 | 2026-01-03 | 正式生效：全體 KEEP 原則；033/034/035 DEPRECATE；081/082 FORBID |
| v1.0 | 2026-01-03 | R020-CONTRACT-083: Clarified factual status (module-level `_FACT_REGISTRY/` removed); Notes updated per Architect ruling; Decision remains KEEP (no semantic change) |
| v1.0-SKELETON | 2026-01-03 | 建立骨架，所有 Decision 預設 TBD（除明確禁止項） |

---

## 附錄：外部路徑對照

| 路徑類型 | 路徑 | 狀態 |
|---------|------|------|
| 權威落點 | `G:\我的雲端硬碟\HORUS-GOVERNANCE\DATA_CONTRACTS\R020\R020_DATA_CONTRACT_v1.0.md` | EFFECTIVE |
| FACT Registry | `G:\我的雲端硬碟\HORUS-FACTS\_FACT_REGISTRY\R020\` | 待 Contract 定稿後建立 |
| DERIVED | `G:\我的雲端硬碟\HORUS-DERIVED\R020\` | 已存在（只讀） |

---

**文件結束**

