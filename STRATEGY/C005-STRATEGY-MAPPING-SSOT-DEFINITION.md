# C005-STRATEGY-MAPPING-SSOT-DEFINITION

> **TYPE**: GOVERNANCE / SSOT DEFINITION
> **STATUS**: DRAFT - STRUCTURE COMPLETION
> **PHASE**: 5-STRUCTURE (Non-Activation)
> **DATE**: 2026-01-25
> **AUTHOR**: Claude Code (Architect)

---

「本文件為 Phase 5-STRUCTURE COMPLETION（治理與資料層完成），非 Phase 5-ACTIVATION（策略生效）。」

---

## Step 1: 現有欄位盤點與裁定

| Column | Field | 角色定位 | SSOT 必要性 | 修正需求 |
|--------|-------|----------|-------------|----------|
| A | product_id | **Identity** | REQUIRED | 需定義：必須對應 T005.UID，不得為空 |
| B | brand | **Identity** | OPTIONAL | 可保留為輔助識別，但不得作為 join key |
| C | platform_code | **Scope** | REQUIRED | 需定義 enum：MOMO / PCHOME / YAHOO / SHOPEE_KATAI / SHOPEE_GUSENSE |
| D | strategy_scope | **Governance** | REQUIRED | 需重新定義 enum（見 Step 4） |
| E | effective_start_date | **Lifecycle** | REQUIRED | 需定義：空值 = 立即生效 or 無效？ |
| F | effective_end_date | **Lifecycle** | OPTIONAL | 需定義：空值 = 永久有效 or 無效？ |
| G | input_by | **Audit** | REQUIRED | 必須為人工填寫，不得為腳本自動產生 |
| H | input_date | **Audit** | REQUIRED | 必須為人工填寫時間，不得為腳本執行時間 |
| I | status | **Governance** | REQUIRED | 需重新定義 enum（見 Step 4） |
| J | approved_by | **Governance** | REQUIRED | 未填 = 未核准 = 不生效 |
| K | approved_date | **Governance** | REQUIRED | 未填 = 未核准 = 不生效 |
| L | note | **Free-text** | OPTIONAL | 無強制約束，人工備註用 |

### 關鍵欄位語意裁定

#### strategy_scope（嚴格定義）

| 現有值 | 問題 | 建議 |
|--------|------|------|
| ALLOW | 語意模糊：是「應上架」還是「可上架」？ | 需重新定義 |
| DENY | 語意模糊：是「禁止」還是「暫緩」？ | 需重新定義 |
| OPTIONAL | 語意不明：誰決定？ | 應移除或重定義 |

#### status（嚴格定義）

| 現有值 | 問題 | 建議 |
|--------|------|------|
| DRAFT | 無問題 | 保留 |
| PENDING_APPROVAL | 流程未定義：誰核准？ | 需定義核准者角色 |
| APPROVED | 無問題 | 保留 |
| REJECTED | 無問題 | 保留 |
| DEPRECATED | 與 REVOKED 混淆 | 需釐清語意 |

#### effective_* 時間欄位

| 情境 | 現有行為 | 建議裁定 |
|------|----------|----------|
| start 為空 | 未定義 | 視為「立即生效」（from epoch） |
| end 為空 | 未定義 | 視為「永久有效」（no expiry） |
| start > end | 未定義 | 視為「無效記錄」，不得被引用 |
| 區間重疊 | 未定義 | 同 product_id + platform_code 不得重疊 |

---

## Step 2: 回答關鍵問題

### Q1：這張表「先前用腳本產生」是否有問題？

**直接回答：是的，有嚴重治理問題。**

#### 可以保留的欄位

| Field | 理由 |
|-------|------|
| product_id | 若對應 T005.UID 且資料正確 |
| brand | 輔助識別，無治理風險 |
| platform_code | 若值符合 enum 定義 |

#### 需要人為確認才有治理意義的欄位

| Field | 理由 |
|-------|------|
| strategy_scope | **腳本產生的 scope 不代表業務意圖**。例如：腳本自動填 ALLOW 不等於業務真的想讓它上架 |
| effective_start_date | 腳本填的日期是「腳本執行日」，不是「策略生效日」 |
| effective_end_date | 腳本通常填空，但這不代表「業務決定永久有效」 |
| status | 腳本填 APPROVED 是假核准 |

#### 不應再由腳本自動產生的欄位

| Field | 理由 |
|-------|------|
| input_by | 必須是真人姓名/帳號，不得是 "Script" 或 "System" |
| input_date | 必須是真人填寫時間 |
| approved_by | 必須是有核准權限的人 |
| approved_date | 必須是核准當下的時間 |
| strategy_scope | 必須是業務意圖，不是腳本推斷 |
| status | 必須反映真實審批狀態 |

**結論：現有腳本產生的資料，僅可作為「候選清單」或「初始草稿」，不得視為有效 SSOT 記錄。**

---

## Step 3: Strategy Mapping 的真實用途定義

### 3.1 它是什麼

- **跨平台策略意圖登錄表**：記錄「某商品在某平台的策略意圖」
- **決策前置登記冊**：在自動化執行前，人工登記策略方向
- **可審計的業務決策記錄**：誰在什麼時候決定了什麼

### 3.2 它不是什麼

| 它不是 | 為什麼 |
|--------|--------|
| 自動上架清單 | 登記意圖 ≠ 執行上架 |
| Eligibility 來源 | Eligibility 由 T005 Lifecycle 決定，不是 strategy_mapping |
| Listing FACT | FACT 是觀測結果，strategy_mapping 是意圖登記 |
| 責任歸屬依據 | 登記意圖 ≠ 承諾結果 |
| 即時生效的指令 | 需經核准流程才有效 |

### 3.3 未來啟用時程

| Phase | 狀態 | 說明 |
|-------|------|------|
| Phase 5-A | DONE | Read-only Join（REF 欄位顯示） |
| Phase 5-B | DONE | Presentation Layer（Mail/UI 顯示） |
| Phase 5-STRUCTURE | CURRENT | 本次：SSOT 結構與治理定義 |
| Phase 5-C | FUTURE | 策略意圖可被查詢（但不影響計算） |
| Phase 6 | FUTURE | 策略意圖可影響 Mail 說明文字 |
| Phase 7 | FUTURE | 策略意圖可影響 Eligibility 計算 |

#### 啟用 Phase 5-C 的硬條件

1. 所有記錄必須有「真人」input_by
2. 所有 APPROVED 記錄必須有 approved_by + approved_date
3. strategy_scope enum 必須重新定義
4. 現有腳本產生的資料必須經人工確認或標記為 DRAFT

#### 啟用 Phase 7 的硬條件

1. Phase 5-C 所有條件
2. Architect 明確發出「Phase 7 啟動指令」
3. strategy_mapping 與 T005 Lifecycle 的優先權規則必須定義
4. 衝突解決機制必須定義

---

## Step 4: 治理缺口補齊

### 4.1 建議的 enum

#### strategy_scope（重新定義）

| Value | 語意 | 說明 |
|-------|------|------|
| OBSERVE | 觀測中 | 尚未決定，僅觀察此商品在此平台的狀態 |
| INTEND | 意圖上架 | 業務意圖是讓此商品在此平台上架 |
| HOLD | 暫緩 | 暫時不處理，但不是永久禁止 |
| BLOCK | 禁止 | 明確禁止此商品在此平台上架 |

**注意**：
- INTEND ≠ 上架指令，僅表達意圖
- BLOCK 需有 note 說明原因
- OBSERVE 為預設值（未決定）

#### status（重新定義）

| Value | 語意 | 說明 |
|-------|------|------|
| DRAFT | 草稿 | 尚未提交審核 |
| PENDING | 待核准 | 已提交，等待核准者審核 |
| APPROVED | 已核准 | 核准者確認，記錄生效 |
| REJECTED | 已拒絕 | 核准者拒絕，記錄不生效 |
| EXPIRED | 已過期 | effective_end_date 已過 |
| REVOKED | 已撤銷 | 人工撤銷，記錄不再有效 |

**生效條件**：
- 僅 `status = APPROVED` 且在 effective 區間內的記錄才視為有效

### 4.2 批准流程最小模型

```
┌─────────────┐
│   填寫者    │  input_by = 填寫者姓名/帳號
│  (Anyone)   │  input_date = 填寫時間
└─────┬───────┘
      │ 提交
      ▼
┌─────────────┐
│  status =   │
│   DRAFT     │
└─────┬───────┘
      │ 送審
      ▼
┌─────────────┐
│  status =   │
│   PENDING   │
└─────┬───────┘
      │ 核准者審核
      ▼
┌─────────────────────────────────┐
│  核准者 (Approver)              │
│  - approved_by = 核准者         │
│  - approved_date = 核准時間     │
└─────┬───────────────────────────┘
      │
      ├──── 核准 ────▶ status = APPROVED
      │
      └──── 拒絕 ────▶ status = REJECTED
```

#### 角色定義

| 角色 | 權限 | 條件 |
|------|------|------|
| 填寫者 | 新增 DRAFT 記錄 | 任何人 |
| 核准者 | 將 PENDING 改為 APPROVED/REJECTED | 需有核准權限（由業務定義） |

#### 未核准會怎樣

- `status ≠ APPROVED` 的記錄：**不生效**
- 不會被 Phase 5-C 以後的任何模組引用
- 僅作為「待處理」記錄存在

### 4.3 時間邏輯裁定

| 情境 | 裁定 |
|------|------|
| effective_start_date 為空 | 視為「立即生效」（等同 1970-01-01） |
| effective_end_date 為空 | 視為「永久有效」（等同 9999-12-31） |
| start > end | 無效記錄，不得被引用 |
| 同 product_id + platform_code 區間重疊 | **不允許**。新記錄必須先 REVOKE 舊記錄 |

#### 時間判斷邏輯

```
isEffective(record, date) =
  record.status === 'APPROVED' &&
  record.effective_start_date <= date &&
  (record.effective_end_date === null || record.effective_end_date >= date)
```

---

## Step 5: 現有資料處理建議

### 腳本產生資料的處理方式

| 選項 | 動作 | 風險 |
|------|------|------|
| A | 全部標記為 DRAFT，等人工確認 | 低風險，但需人工作業 |
| B | 全部刪除，重新由人工建立 | 無風險，但工作量大 |
| C | 保留但標記 `input_by = "MIGRATION"` | 中風險，可能被誤用 |

**建議：選項 A**

將現有資料：
1. `status` 改為 `DRAFT`
2. `input_by` 改為 `MIGRATION-2026-01-25`
3. `approved_by` 清空
4. `approved_date` 清空

這樣記錄仍存在，但不會被視為「已核准的有效記錄」。

---

## Self-Check

```
Self-Check:
- Strategy mapping still NOT ACTIVE: YES
- No runtime behavior changed: YES
- Safe to pause project here: YES
- Ready for future Phase 5-C activation: YES
- No if/switch/decision logic added: YES
- No Eligibility/Listing_History affected: YES
```

---

**END OF C005-STRATEGY-MAPPING-SSOT-DEFINITION.md**
