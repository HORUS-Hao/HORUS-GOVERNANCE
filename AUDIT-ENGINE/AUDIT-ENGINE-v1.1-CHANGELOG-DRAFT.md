# HORUS-Governance-Audit-Engine v1.1 Changelog Draft

**Status**: DRAFT / PENDING ARCHITECT REVIEW
**Date**: 2026-01-22
**Input Source**: C005 Cross-Module Governance Validation (2026-01-22)
**Mode**: READ-ONLY / GOVERNANCE MODE

---

## A. CONFIRMED-AS-CANONICAL

以下 v1.0 設計已被 C005 實證驗證為「可跨模組通用」，納入 v1.1 Canonical 規格。

### A.1 Scope Resolver

| 規格項目 | C005 實證 |
|---------|----------|
| Canonical Root 單一性原則 | C005 在 BASE-SERVICES 中僅存在一個 Canonical Root `C005-Listing-Checker/` |
| Read-only 宣告 | C005 驗證期間未執行任何程式碼修改 |
| Governance Files Inventory 結構 | C005 成功識別 MODULE-REGISTRY、GOVERNANCE-INDEX、DATA CONTRACT 三類文件 |

### A.2 Blind Scanner

| 規格項目 | C005 實證 |
|---------|----------|
| Finding ID 格式 `{MODULE}-BA-{NNN}` | C005 使用 `C005-BA-001` 至 `C005-BA-025`，格式清晰可追溯 |
| 5 類掃描項目覆蓋度 | FILE_RESPONSIBILITY / WRITE_POINT / API_EXPOSURE / EXTERNAL_DEPENDENCY / HIGH_RISK_BEHAVIOR 完全覆蓋 C005 重要行為 |
| Evidence 格式（檔案:行號） | C005 所有發現均包含 `webapp/XXX.js:NNN` 格式證據 |
| 不引用治理原則 | C005 Blind Audit 未參照任何治理文件進行判斷 |

### A.3 Alignment Analyzer

| 規格項目 | C005 實證 |
|---------|----------|
| ALIGNED 類型 | C005-BA-002 成功標記為 ALIGNED（T005 Read 行為符合 MODULE-REGISTRY 宣告）|
| MISALIGNED 類型 | C005-BA-010、C005-BA-012 成功標記為 MISALIGNED（寫入行為違反「不得寫入 FACT」宣告）|
| GAP 類型 | C005-BA-001、C005-BA-017 等 6 項成功標記為 GAP（程式行為存在，無對應宣告）|
| 不下結論原則 | C005 Alignment Audit 未提出任何修復方案 |

### A.4 Pipeline 結構

| 規格項目 | C005 實證 |
|---------|----------|
| Scope Resolver → Blind Scanner → Alignment Analyzer 流程 | C005 依序完成 Phase 1 → Phase 2 → Phase 3 |
| 各節點 Input/Output 定義 | C005 各 Phase 輸出格式符合 v1.0 規格 |

---

## B. SPEC-GAPS-IDENTIFIED

以下為 v1.0 規格不足之處，需於 v1.1 補充。

### B.1 Excluded Paths 識別方式不完整

| 問題 | 發現來源 |
|------|---------|
| v1.0 僅定義目錄名稱標記（ARCHIVE / DEPRECATED） | Phase 4.2 |
| 實際存在檔案後綴模式（.backup / .bak） | Phase 4.2 |

**v1.1 規格補充方向**：
- 排除標記可為「目錄名稱標記」或「檔案後綴」
- Scope Resolver 階段需人工確認模組專屬排除模式

### B.2 Governance File 驗證不完整

| 問題 | 發現來源 |
|------|---------|
| v1.0 僅檢查檔案是否存在 | Phase 4.3 |
| 未檢查檔案內容有效性 | Phase 4.3 |
| 空檔案無法有效對照 | Phase 4.2 |

**v1.1 規格補充方向**：
- Scope Resolver 加入「內容有效性檢查」步驟
- 區分「檔案存在且內容有效」vs「檔案存在但內容缺失」

### B.3 對齊類型覆蓋不完整

| 問題 | 發現來源 |
|------|---------|
| v1.0 僅有 ALIGNED / MISALIGNED / GAP / ORPHAN | Phase 4.3 |
| 缺少「語義不明確」情況處理 | Phase 4.3 |

**v1.1 規格補充方向**：
- 新增對齊類型以處理「宣告存在但語義模糊」情況

### B.4 跨模組寫入識別不足

| 問題 | 發現來源 |
|------|---------|
| v1.0 HIGH_RISK_BEHAVIOR 未特別標記「跨模組寫入」 | Phase 4.3 |
| 程式碼位於 A 模組但寫入 B 模組資源的情況需特殊處理 | Phase 4.3 |

**v1.1 規格補充方向**：
- 新增風險類型以識別跨模組邊界寫入行為

---

## C. REQUIRED-NEW-CONCEPTS-v1.1

### C.1 UNCLEAR Alignment Type

**定義**：
程式行為存在，治理宣告存在，但宣告語義不明確，無法判定 ALIGNED 或 MISALIGNED。

**v1.0 無法處理的原因**：
- v1.0 對齊類型為二元分類（一致/不一致）加上缺口（GAP/ORPHAN）
- 當宣告本身存在歧義時，強制分類為 ALIGNED 或 MISALIGNED 會產生誤導
- 例：「不得寫入 FACT」宣告存在，但 History 是否為 FACT 未定義

**不屬於單一模組特例的原因**：
- 任何模組的治理宣告皆可能存在語義模糊
- 語義模糊是治理文件品質問題，非程式碼問題
- 多模組對照時必然遭遇此情況

**v1.1 規格定義**：

| 屬性 | 值 |
|------|-----|
| 類型符號 | `UNCLEAR` |
| 顯示符號 | 🔸 |
| 判定條件 | 宣告存在 AND 語義無法明確對應程式行為 |
| 後續處理 | 標記為「待裁定：宣告語義釐清」|

---

### C.2 CROSS_MODULE_WRITE Risk Type

**定義**：
程式碼位於模組 A，但執行寫入操作至模組 B 的資源（Sheet / File / API）。

**v1.0 無法處理的原因**：
- v1.0 HIGH_RISK_BEHAVIOR 僅識別「寫入行為」本身
- 未區分「模組內寫入」與「跨模組寫入」
- 跨模組寫入涉及 Ownership 邊界問題，風險層級不同

**不屬於單一模組特例的原因**：
- HORUS 系統為多模組架構，模組間資料流動為常態
- 任何模組皆可能存在跨模組依賴
- 跨模組寫入需要雙邊治理宣告，非單一模組可決定

**v1.1 規格定義**：

| 屬性 | 值 |
|------|-----|
| 類型名稱 | `CROSS_MODULE_WRITE` |
| 歸類 | HIGH_RISK_BEHAVIOR 子類型 |
| 識別條件 | 程式碼路徑屬於模組 A AND 寫入目標屬於模組 B |
| 必要資訊 | source_module, target_module, write_function, target_resource |
| 後續處理 | 標記為「待裁定：跨模組寫入權責」|

---

### C.3 STRUCTURE_ONLY Governance File State

**定義**：
Governance File 檔案存在，但內容為空或結構不完整，無法作為對照依據。

**v1.0 無法處理的原因**：
- v1.0 Scope Resolver 僅執行檔案存在性檢查
- 空檔案會被列入 Governance Files Inventory
- Alignment Audit 階段無法使用空檔案進行對照

**不屬於單一模組特例的原因**：
- 任何模組的 Governance File 皆可能處於「已建立但未填寫」狀態
- 新模組導入期間此情況為常態
- 需區分「治理缺口」（無檔案）與「治理未完成」（空檔案）

**v1.1 規格定義**：

| 屬性 | 值 |
|------|-----|
| 狀態名稱 | `STRUCTURE_ONLY` |
| 判定條件 | 檔案存在 AND (內容為空 OR 內容少於 10 行 OR 缺少必要區段) |
| 顯示方式 | Governance Files Inventory 中標記 `[STRUCTURE_ONLY]` |
| 對照處理 | 該檔案不參與 Alignment Audit 對照 |
| 後續處理 | 產出「治理文件待補充」清單 |

---

## D. EXPLICITLY-OUT-OF-SCOPE

以下項目於 C005 驗證中出現，但明確不納入 v1.1 核心規格。

### D.1 模組專屬備份檔案後綴

| 項目 | 說明 |
|------|------|
| `.backup` / `.bak` 檔案後綴 | 屬於 C005 專屬備份命名慣例 |
| 不納入原因 | 各模組可自訂排除模式，Scope Resolver 階段人工確認即可 |

### D.2 D001 Data Hub 降級機制

| 項目 | 說明 |
|------|------|
| D001Service fallback 邏輯 | C005 專屬的 Data Hub 整合架構 |
| 不納入原因 | 屬於特定整合模式，非通用治理規格 |

> **Naming Note (2026-01-22)**:
> D001 為 Historical naming，已由 D005 取代。
> 詳見 `NAMING/D-MODULE-NAMING-RESOLUTION.md`

### D.3 RPC Serialization 淨身機制

| 項目 | 說明 |
|------|------|
| `JSON.parse(JSON.stringify())` 處理 | GAS RPC 回傳值序列化技術 |
| 不納入原因 | 屬於 GAS 技術實作細節，非治理框架關注點 |

### D.4 平台配置結構

| 項目 | 說明 |
|------|------|
| MOMO / PChome / Yahoo / Shopee 配置 | C005 專屬業務邏輯 |
| 不納入原因 | 屬於業務邏輯，非治理框架關注點 |

---

## FREEZE DECLARATION

### 聲明事項

1. **C005 角色限定**
   - C005 於本次驗證中僅作為「Governance Audit Engine v1.0 跨模組通用性驗證樣本」
   - C005 不因本次驗證而承擔任何程式碼變更義務

2. **無程式變更觸發**
   - 本文件為 Governance 規格文件
   - 本文件不觸發任何 C005 / T005 / BASE-SERVICES 程式碼修改
   - 本文件不觸發任何治理重寫

3. **規格變更範圍**
   - 本文件僅定義 HORUS-Governance-Audit-Engine v1.1 規格升級方向
   - 規格變更需 Architect 審閱後方可生效
   - 規格生效後，各模組依自身時程採用

4. **文件狀態**
   - 本文件為 DRAFT 狀態
   - 需 Architect 明確核准方可轉為 EFFECTIVE
   - 核准前不得引用本文件作為裁定依據

---

**END OF AUDIT-ENGINE-v1.1-CHANGELOG-DRAFT.md**
