# Phase 5-C Readiness and Blast Radius

> **TYPE**: GOVERNANCE / READINESS GATE + RISK SIMULATION
> **STATUS**: PRE-ACTIVATION ANALYSIS
> **PHASE**: 5-C READINESS (Not Activated)
> **DATE**: 2026-01-25
> **AUTHOR**: Claude Code (Architect)

---

## 任務 A：Phase 5-C Readiness Gate

### A1：資料層硬門檻（SSOT）

#### 100% 不可為空的欄位

| Field | 理由 | 空值後果 |
|-------|------|----------|
| product_id | JOIN KEY，無此欄位無法識別商品 | 整筆記錄無效 |
| platform_code | SCOPE，無此欄位無法知道適用平台 | 整筆記錄無效 |
| strategy_scope | INTENT，無此欄位不知道策略意圖 | 整筆記錄無效 |
| status | LIFECYCLE，無此欄位不知道是否生效 | 整筆記錄無效 |
| input_by | AUDIT，無此欄位不知道誰負責 | 無法追責 |
| input_date | AUDIT，無此欄位不知道何時建立 | 無法審計 |

#### 錯一次就要 STOP 的欄位

| Field | 錯誤類型 | STOP 理由 |
|-------|----------|-----------|
| product_id | 不存在於 T005 | 策略指向不存在的商品，整張表信任崩潰 |
| platform_code | 不在 enum 內 | 策略指向不存在的平台，系統無法處理 |
| strategy_scope | 不在 enum 內 | 策略意圖無法被解讀 |
| status = APPROVED 但 approved_by 為空 | 假核准 | 信任機制崩潰 |
| effective_start > effective_end | 時間悖論 | 記錄永遠不會生效，但可能被誤讀 |

#### 最小合法組合

```
VALID RECORD =
  product_id ∈ T005.UID
  AND platform_code ∈ {MOMO, PCHOME, YAHOO, SHOPEE_KATAI, SHOPEE_GUSENSE}
  AND strategy_scope ∈ {OBSERVE, INTEND, HOLD, BLOCK}
  AND status ∈ {DRAFT, PENDING, APPROVED, REJECTED, EXPIRED, REVOKED}
  AND input_by IS NOT NULL
  AND input_date IS NOT NULL
  AND (status ≠ APPROVED OR (approved_by IS NOT NULL AND approved_date IS NOT NULL))
  AND (effective_start_date IS NULL OR effective_end_date IS NULL OR effective_start_date <= effective_end_date)
```

---

### A2：治理層硬門檻

#### 核准權限

| 角色 | 權限 | 限制 |
|------|------|------|
| 填寫者 | 建立 DRAFT、提交 PENDING | 不得自己核准自己的記錄 |
| 核准者 | PENDING → APPROVED / REJECTED | 必須非填寫者本人 |
| Architect | REVOKE 任何記錄 | 唯一可撤銷 APPROVED 記錄的角色 |

#### REVOKE 規則

| 規則 | 說明 |
|------|------|
| 誰可以 REVOKE | 僅 Architect 或原核准者 |
| REVOKE 後狀態 | status = REVOKED，保留原記錄不刪除 |
| REVOKE 是否可逆 | 不可逆，需建立新記錄 |
| REVOKE 後果 | 該記錄永久失效，不再被任何模組引用 |

#### 補填規則

| 問題 | 答案 |
|------|------|
| 是否允許補填 approved_by | **NO** - 事後補核准 = 假核准 |
| 是否允許修改 effective_date | **NO** - 時間不可篡改 |
| 是否允許修改 strategy_scope（已核准） | **NO** - 需 REVOKE 後重建 |

---

### A3：技術層硬門檻

#### Phase 5-C 禁止存取 strategy 的模組

| Module | 理由 |
|--------|------|
| C005_FactWriter.js | FACT 層不得被策略污染 |
| EligibilityService.js | Eligibility 由 T005 Lifecycle 決定 |
| Listing_History 任何寫入邏輯 | FACT 是觀測，不是策略執行 |
| C005_MailService.js（計算區塊） | Mail 的數字不得被策略影響 |

#### 未來可存取的模組（Phase 6+）

| Module | Phase | 用途 |
|--------|-------|------|
| C005_MailService.js（說明區塊） | 6 | 顯示策略意圖（文字） |
| StrategyQueryService.js（未建立） | 5-C | 查詢策略狀態（唯讀） |
| StrategyReportGenerator.js（未建立） | 6 | 產生策略報表 |

#### Phase 5-C 不該碰的檔案清單

```
❌ DO NOT TOUCH IN PHASE 5-C:

10-基礎服務層-BASE-SERVICES/
├── C005-Listing-Checker/
│   └── webapp/
│       ├── EligibilityService.js      ← FORBIDDEN
│       ├── ComparisonEngine.js        ← FORBIDDEN
│       └── ListingChecker.js          ← FORBIDDEN
├── R020-Price-Comparator/
│   └── _clasp-observer-mail/
│       ├── C005_FactWriter.js         ← FORBIDDEN
│       ├── C005_SyncJob.js            ← FORBIDDEN
│       └── C005_MailService.js        ← FORBIDDEN (計算區塊)
└── D005-Platform-Listing/             ← ENTIRE FOLDER FORBIDDEN
```

---

## 任務 B：錯誤策略事故模擬

### 模擬 1：錯誤核准

```yaml
Record:
  product_id: "SKU-12345"
  platform_code: "MOMO"
  strategy_scope: "INTEND"
  status: "APPROVED"
  input_by: "小明"
  approved_by: "小明"        # ← 錯誤：自己核准自己
  approved_date: "2026-01-25"
```

#### 會誤導誰

| 對象 | 誤導內容 |
|------|----------|
| 業務主管 | 以為有人審核過，實際是自己批自己 |
| 系統 | 以為這是合法的 APPROVED 記錄 |
| 稽核 | 無法確認核准者是否有權限 |

#### 會傷到哪一層

| 層級 | 傷害 |
|------|------|
| 人 | 業務誤信策略已被確認 |
| 系統 | 若啟用，會執行未經審核的意圖 |
| 信任 | **核准機制本身失去意義** |

#### 為什麼 Phase 5-C 現在不能直接開

現有資料由腳本產生，全部都是「自己批自己」的假核准。若直接開啟 Phase 5-C，系統會「相信」這些假核准，導致：
- 業務以為策略已確認，但實際沒人看過
- 出事時無法追責（「系統說可以的」）

---

### 模擬 2：時間錯亂

```yaml
Record:
  product_id: "SKU-67890"
  platform_code: "PCHOME"
  strategy_scope: "BLOCK"
  status: "APPROVED"
  effective_start_date: "2026-03-01"
  effective_end_date: "2026-01-01"  # ← 錯誤：結束早於開始
  approved_by: "主管A"
```

#### 會誤導誰

| 對象 | 誤導內容 |
|------|----------|
| 查詢者 | 看到 BLOCK 但不知道「何時生效」 |
| 報表 | 可能把這筆當成「曾經生效」 |
| Mail | 若引用此記錄，會顯示矛盾的時間區間 |

#### 會傷到哪一層

| 層級 | 傷害 |
|------|------|
| 人 | 無法理解這筆記錄是什麼意思 |
| 系統 | 若無防呆，可能在任何日期都判斷為「不生效」或「永遠生效」 |
| 信任 | **時間語意失去可靠性** |

#### 為什麼 Phase 5-C 現在不能直接開

沒有時間驗證邏輯。若直接開啟：
- 時間錯亂的記錄會被當成「正常資料」處理
- 歷史報表回溯時會出現不可解釋的結果
- 一旦污染 Mail，收件人會質疑整個系統的可信度

---

### 模擬 3：衝突策略

```yaml
Record A:
  product_id: "SKU-11111"
  platform_code: "YAHOO"
  strategy_scope: "INTEND"       # ← 想上架
  status: "APPROVED"
  effective_start_date: "2026-01-01"
  effective_end_date: null

Record B:
  product_id: "SKU-11111"
  platform_code: "YAHOO"
  strategy_scope: "BLOCK"        # ← 禁止上架
  status: "APPROVED"
  effective_start_date: "2026-01-15"
  effective_end_date: null
```

#### 會誤導誰

| 對象 | 誤導內容 |
|------|----------|
| 系統 | 不知道該聽誰的 |
| 業務 | A 說上，B 說不上，執行者無所適從 |
| 稽核 | 出事時不知道該怪誰 |

#### 會傷到哪一層

| 層級 | 傷害 |
|------|------|
| 人 | 業務內部衝突、互相指責 |
| 系統 | 若無優先權規則，結果不可預測 |
| 信任 | **策略表本身失去權威性** |

#### 為什麼 Phase 5-C 現在不能直接開

衝突解決規則未定義：
- 後建立的 > 先建立的？
- 更嚴格的 > 更寬鬆的？
- 誰有權 override？

沒有答案，就不能開。

---

## 任務 C：Phase 5-C → 6 → 7 責任轉移圖

### 責任轉移表

| Phase | Strategy 是否被信任 | 誰開始背責任 | 失誤後果 | 不可逆點 |
|-------|---------------------|--------------|----------|----------|
| 5-B | ❌ 不信任 | 無 | 無 | 無 |
| 5-C | ⚠️ 半信任（可查詢） | 業務 + Architect | 信任損傷 | 一旦有人「參考」策略做決定 |
| 6 | ✅ 被用於說明 | 業務 + 系統 | 誤導決策 | 一旦 Mail 寫出「策略建議」 |
| 7 | 🔥 被用於計算 | 公司 | 金錢損失 | 一旦策略影響實際上架行為 |

### 每階段不可逆點（一句話）

| Phase | 不可逆點 |
|-------|----------|
| 5-B → 5-C | 「有人開始相信這張表」 |
| 5-C → 6 | 「有人根據 Mail 內容做了決定」 |
| 6 → 7 | 「系統根據策略自動執行了動作」 |

### 責任邊界圖（文字版）

```
Phase 5-B: Strategy = 草稿紙
           │
           │ ← 沒人相信，沒人負責
           │
           ▼
Phase 5-C: Strategy = 參考資料
           │
           │ ← 有人開始看，業務開始背
           │    「我看了策略表，它說 INTEND」
           │
           ▼
Phase 6:   Strategy = 官方說明
           │
           │ ← 寫進 Mail，系統開始背
           │    「報表說這個商品策略是 BLOCK」
           │
           ▼
Phase 7:   Strategy = 執行指令
           │
           │ ← 影響計算，公司開始背
           │    「系統自動把商品下架了」
           │
           ▼
        💀 不可逆：金錢損失 / 客訴 / 法務問題
```

---

## 總結：為什麼 Phase 5-C 現在不能開

| 缺口 | 狀態 | 必須先做 |
|------|------|----------|
| 資料品質 | 腳本產生，假核准 | 人工確認或標記 DRAFT |
| 時間驗證 | 無 | 加入 start <= end 驗證 |
| 衝突解決 | 無 | 定義優先權規則 |
| 核准機制 | 自己批自己 | 強制 input_by ≠ approved_by |
| 追責機制 | 無 | 定義「誰可以怪誰」 |

**現在開 Phase 5-C = 把一張沒人敢信的表，變成「官方參考資料」。**

---

## Self-Check

```
Self-Check:
- Phase 5-C NOT activated: YES
- No runtime read introduced: YES
- No data modified: YES
- Architect can safely delay activation: YES
- System trust boundaries clearly documented: YES
```

---

**END OF PHASE5C-READINESS-AND-BLAST-RADIUS.md**
