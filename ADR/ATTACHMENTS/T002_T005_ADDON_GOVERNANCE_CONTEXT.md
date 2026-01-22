# T002 / T005 Add-on 治理脈絡

**文件類型**: Governance Clarification (治理澄清)
**掃描日期**: 2026-01-13
**掃描性質**: 只讀 (Read-Only)
**用途**: 供 ADR 直接引用

---

## 一、Add-on 現況摘要

### 1.1 T002 Add-on 存在事實

| 項目 | 事實 | 證據來源 |
|------|------|----------|
| GAS Script 存在 | **是** | MASTER-SCRIPT-INVENTORY-2026-01-04.md:30 |
| Script 名稱 | `T002-Material-Management` | MASTER-SCRIPT-INVENTORY-2026-01-04.md:30 |
| Script ID | `1GqBwFMpEpSrXCshb8xECZUcVTaQwH5ytaPf9qbE31rg2I64qycG0_N_z` | MASTER-SCRIPT-INVENTORY-2026-01-04.md:30 |
| 治理狀態 | **Active** | MASTER-SCRIPT-INVENTORY-2026-01-04.md:30 |
| 備註 | 「可能有 Trigger」 | MASTER-SCRIPT-INVENTORY-2026-01-04.md:30 |
| 舊版腳本存在 | **是** | `T002原料庫完整系統v...` (Dormant) |

### 1.2 T005 Add-on 存在事實

| 項目 | 事實 | 證據來源 |
|------|------|----------|
| GAS Scripts 存在 | **是，多個** | 見下表 |

#### T005 相關 GAS Scripts 清單

| Script 名稱 | 治理狀態 | 類型 | 來源 |
|-------------|----------|------|------|
| `T005商品庫結構更新...` (1) | Dormant | 結構更新工具 | MASTER-SCRIPT-INVENTORY:63 |
| `T005商品庫結構更新...` (2) | Dormant | 結構更新工具（重複版本） | MASTER-SCRIPT-INVENTORY:64 |
| `PDM-Calibrator` | Experimental | 校準器（操作 T005 資料） | MASTER-SCRIPT-INVENTORY:62 |
| `D005-Data-Hub` | Active | FACT 資料中樞（與 T005 互動） | MASTER-SCRIPT-INVENTORY:26 |

#### T005 相關 GAS 功能模組（治理文件記載）

| 功能 | 檔案 | 類型 | 來源 |
|------|------|------|------|
| 系統初始化 | Main.gs | 建表工具 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:61 |
| 配置管理 | Core.gs | 配置讀寫 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:62 |
| 日誌管理 | Core.gs | 操作記錄 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:63 |
| 備份管理 | Core.gs | 自動/手動備份 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:64 |
| UID 管理 | UID.gs | 生成、驗證、關聯 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:65 |
| T002 同步 | Sync.gs | 原料庫 → 商品庫 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:66 |
| Notion 同步 | Sync.gs | 商品庫 → Notion | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:67 |
| Web Dashboard | WebApp.gs | 資料品質儀表板 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:68 |
| 資料品質掃描 | DataQuality.gs | 欄位完整度檢查 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:69 |

### 1.3 Add-on 類型概括分類

| 類型 | T002 | T005 |
|------|------|------|
| 欄位輔助 | 無明確記載 | 有（UID.gs） |
| 檢查 / 驗證 | 無明確記載 | 有（DataQuality.gs） |
| 同步 | 無明確記載 | 有（Sync.gs） |
| 人工操作輔助 | 設計中（未實作） | 有（Core.gs 日誌） |
| 結構更新工具 | 有舊版（Dormant） | 有（2 個 Dormant 版本） |

---

## 二、Add-on 治理屬性判定

### 2.1 T002 Add-on 治理屬性

| 問題 | 回答 | 證據 |
|------|------|------|
| 是否直接寫入 Canonical 欄位 | **無法確認**（T002 本身非 Canonical） | T002 = 衍生層（STATE-ANCHOR-2025-12.md:63） |
| 是否只作用於 Human-Input / Derived 層 | **是**（T002 整體為 Derived 層） | T005 = Canonical，T002 = 衍生層 |
| 是否明確早於 ADR-0001 | **是** | ADR-0001 生效日 2026-01-01，Script 已存在 |
| 是否與 T002 多人協作設計無直接關聯 | **是** | 現有 Script 為物料管理系統，非多人協作 Add-on |

**T002 Add-on 治理分類**: **Legacy Add-on**（治理前存在）

### 2.2 T005 Add-on 治理屬性

#### T005商品庫結構更新腳本

| 問題 | 回答 | 證據 |
|------|------|------|
| 是否直接寫入 Canonical 欄位 | **是**（結構更新） | 用途：T005 結構更新 |
| 是否只作用於 Human-Input / Derived 層 | **否** | 作用於 T005 Canonical Schema |
| 是否明確早於 ADR-0001 | **是** | Script 狀態為 Dormant，已長期存在 |
| 是否與 T002 多人協作設計無直接關聯 | **是** | 無關 T002 多人協作 |

**分類**: **Legacy Add-on**（治理前存在）

#### PDM-Calibrator

| 問題 | 回答 | 證據 |
|------|------|------|
| 是否直接寫入 Canonical 欄位 | **是** | 備註：「操作 T005 資料」 |
| 是否只作用於 Human-Input / Derived 層 | **否** | 作用於 T005 Canonical Schema |
| 是否明確早於 ADR-0001 | **是** | 2026-01-04 盤點時已存在 |
| 是否與 T002 多人協作設計無直接關聯 | **是** | 無關 T002 多人協作 |

**分類**: **Legacy Add-on**（治理前存在）+ **Potentially conflicting**（可寫入 Canonical）

#### D005-Data-Hub

| 問題 | 回答 | 證據 |
|------|------|------|
| 是否直接寫入 Canonical 欄位 | **是** | D005 = T005 唯一寫入者（T005.md:49） |
| 是否只作用於 Human-Input / Derived 層 | **否** | 作用於 FACT 層 |
| 是否明確早於 ADR-0001 | **是** | 核心生產系統，長期存在 |
| 是否與 T002 多人協作設計無直接關聯 | **是** | 無關 T002 多人協作 |

**分類**: **Governance-aware Add-on**（已納入治理，為 T005 唯一寫入者）

#### Core.gs / Sync.gs / UID.gs / DataQuality.gs 等

| 問題 | 回答 | 證據 |
|------|------|------|
| 是否直接寫入 Canonical 欄位 | **部分是** | Sync.gs 涉及 T002 → T005 資料流 |
| 是否只作用於 Human-Input / Derived 層 | **否** | 多數作用於 T005 Canonical |
| 是否明確早於 ADR-0001 | **是** | T005 v3.4 已上線 |
| 是否與 T002 多人協作設計無直接關聯 | **是** | 為 T005 自身管理工具，非 T002 多人協作 |

**分類**: **Legacy Add-on**（治理前存在）

---

## 三、Add-on 與 ADR-0001 時間關係

### 3.1 時間線事實

| 時間點 | 事件 | 來源 |
|--------|------|------|
| 2025 年及更早 | T005 GAS Scripts（Main.gs, Core.gs 等）已存在 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md:14-20 |
| 2025 年及更早 | T002-Material-Management Script 已存在 | MASTER-SCRIPT-INVENTORY（治理狀態 Active） |
| 2025-12-31 | STATE-ANCHOR-2025-12 建立，T002 標記為 HOLD | STATE-ANCHOR-2025-12.md:185-186 |
| **2026-01-01** | **ADR-0001-T005-T002-B.md 生效** | ADR-0001:5 |
| 2026-01-04 | MASTER-SCRIPT-INVENTORY 建立，盤點 28 個 Script | MASTER-SCRIPT-INVENTORY:155 |

### 3.2 時間關係結論

| 項目 | 事實 |
|------|------|
| T002 現有 Add-on 與 ADR-0001 | **Add-on 早於 ADR-0001 存在** |
| T005 現有 Add-on 與 ADR-0001 | **Add-on 早於 ADR-0001 存在** |
| ADR-0001 是否禁止現有 Add-on | **否**（ADR-0001 禁止「新實作」，非禁止「現有運作」） |
| 現有 Add-on 是否違反 ADR-0001 | **否**（為治理前的 Legacy 狀態） |

---

## 四、是否影響 T002 Phase 1 裁定

### 4.1 核心問題

> 「現存 T005 Add-on 的存在，是否構成 T002 多人協作 Phase 1 必須立刻實作 Add-on 的理由？」

### 4.2 回答

**否**

### 4.3 事實依據

| 依據 | 說明 |
|------|------|
| T005 Add-on 為 Legacy | T005 現有 Add-on 早於 ADR-0001 存在，屬於既存狀態 |
| T002 多人協作 Add-on 為新實作 | T002_COLLABORATION_FEASIBILITY_STUDY.md 提出的 Sheet Add-on 尚未存在 |
| ADR-0001 禁止新實作 | ADR-0001:37-44 明確禁止「改欄位、加欄位、同步表頭、介入實際資料流程」 |
| T005 Add-on 與 T002 多人協作無直接關聯 | T005 Add-on 用途為 T005 自身管理，非服務 T002 多人協作 |
| T002 HOLD 狀態 | STATE-ANCHOR-2025-12.md:42 明確標記 T002 為 HOLD |
| Phase 1 試行需 ADR 變更 | T002_COLLABORATION_FEASIBILITY_STUDY.md:240-241 明確指出須先取得 ADR 批准 |

### 4.4 補充說明

| 項目 | 事實 |
|------|------|
| 「T005 有 Add-on，所以 T002 也要有」 | **非有效論證**（不同用途、不同治理階段） |
| 「技術成熟，應立即實作」 | **與治理裁定無關**（技術可行性已確認，但需治理批准） |
| 「T005 Add-on 可作為 T002 Add-on 範本」 | **可能**，但不構成「必須立刻實作」的理由 |

---

## 五、Add-on 治理分類總結

### 5.1 T002 Add-on

| Script | 分類 |
|--------|------|
| T002-Material-Management | Legacy Add-on（治理前存在） |
| T002原料庫完整系統v... | Legacy Add-on（Dormant） |

### 5.2 T005 Add-on

| Script / 模組 | 分類 |
|---------------|------|
| D005-Data-Hub | **Governance-aware Add-on**（唯一寫入者，已納入治理） |
| T005商品庫結構更新... | Legacy Add-on（Dormant） |
| PDM-Calibrator | Legacy + **Potentially conflicting**（Experimental，可寫入 Canonical） |
| Core.gs / Sync.gs / UID.gs 等 | Legacy Add-on（T005 自身管理工具） |

### 5.3 潛在衝突標記（僅標示，不處理）

| Script | 風險 | 備註 |
|--------|------|------|
| PDM-Calibrator | 可寫入 T005 Canonical | 狀態為 Experimental |
| T005商品庫結構更新... | 可修改 T005 結構 | 狀態為 Dormant |

---

## 六、文件來源索引

| 代碼 | 完整路徑 |
|------|----------|
| MASTER-SCRIPT-INVENTORY | `HORUS-GOVERNANCE/V005/INVENTORY/MASTER-SCRIPT-INVENTORY-2026-01-04.md` |
| T005-GOVERNANCE-ALIGNMENT-AUDIT.md | `HORUS-GOVERNANCE/T005/T005-GOVERNANCE-ALIGNMENT-AUDIT.md` |
| ADR-0001-T005-T002-B.md | `HORUS-GOVERNANCE/V005/ARCHITECTURE/ADR-0001-T005-T002-B.md` |
| STATE-ANCHOR-2025-12.md | `HORUS-GOVERNANCE/V005/ARCHIVE/STATE-ANCHOR-2025-12.md` |
| T002_COLLABORATION_FEASIBILITY_STUDY.md | `HORUS-GOVERNANCE/T002/T002_COLLABORATION_FEASIBILITY_STUDY.md` |
| T005.md | `HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md` |

---

*本文件為治理澄清掃描產出，不含建議、不下結論*
*掃描日期：2026-01-13*
*產出工具：Claude Code*
