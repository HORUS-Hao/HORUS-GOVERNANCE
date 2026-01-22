# V005 Governance Index
唯一治理入口文件（Authoritative Entry Point）

## 1. 文件定位（Purpose）

本文件為 **V005 模組治理體系的唯一入口（Single Entry Point）**。

任何與 V005 相關的：
- 工程實作
- AI 行為
- 文件解讀
- 治理裁定

**必須依照本文件所定義的治理法階順序進行解讀與判斷。**

---

## 2. 治理法階總覽（Governance Hierarchy）

V005 治理體系採用「法階模型」，而非模組分類模型。

治理文件依效力由高至低排序如下：

---

### Tier 0 — Immutable Baseline（最高法階）
**目的：定義不可變的歷史事實**

- `BASELINE/`
  - `V005-v0.5.3-stable-DECISION.md`
  - `V005-v0.5.3-stable-IMMUTABLE-BASELINE.md`
  - `V005-BASELINE-POINTER.md`

> Tier 0 文件一經生效，**永久不可修改**。  
> 任何工程或治理行為不得回溯、覆寫或修正 Tier 0 所定義之行為事實。

---

### Tier 1 — Identity & Authority Governance
**目的：定義「誰能做什麼」**

- `G002-IDENTITY-ACCESS/`
  - `README.md`

> 本層僅定義 Company / User / Role 之治理語意。  
> 本層不得進入 V005 核心邏輯，  
> 不得執行任何工程實作，  
> 不得產生資料回寫行為。

---

### Tier 2 — Process & Human-in-the-loop Governance
**目的：定義「如何被核准」**

- `G001-HUMAN-APPROVAL/`
  - `README.md`

> 本層為外掛式人工核准治理模組。  
> 僅能讀取既有結果，不得回寫、  
> 不得干預 Tier 0 或 Tier 1 所定義之內容。

---

### Tier 3 — Observation & Audit（保留層級）
**目的：觀測、記錄、稽核**

- `OBSERVATIONS/`
- Audit / Log 類治理文件（如適用）

> Tier 3 不具治理裁定效力，  
> 僅供觀測、回溯與稽核使用。

---

## 3. 明確排除事項（Explicit Exclusions）

以下文件 **不屬於 V005 Governance Hierarchy**：

- `DATA_CONTRACTS/`
  - 屬資料結構與交換契約治理
- 通用 `AUTHORIZATION/`
  - 屬跨模組授權治理，非 V005 專屬
- 工程 Repo 內之 README、註解或程式碼說明

上述文件 **不得凌駕或覆蓋本索引所定義之治理法階順序**。

---

## 4. 解讀與裁定原則（Enforcement）

- 若不同治理文件之間出現衝突：
  → **依本文件所定義之法階高低裁定**
- 任何未列入本索引之文件：
  → 不具治理裁定效力
- AI 或工程人員若未依本索引行事：
  → 視為治理違規

---

## 5. 生效聲明（Effective Statement）

本文件自建立日起即生效，  
作為 **V005 治理體系之唯一入口與最高索引依據**。
