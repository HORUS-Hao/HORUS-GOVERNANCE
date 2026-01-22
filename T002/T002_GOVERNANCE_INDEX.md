# T002 治理文件索引

**文件類型**: Governance Index
**狀態**: Active
**適用範圍**: T002 原料清洗系統
**生效日期**: 2026-01-13
**上位文件**: ADR-T002-COLLABORATION-PHASE1.md

---

## 一、治理地位聲明

### 1.1 本資料夾定位

| 聲明 | 說明 |
|------|------|
| 所屬層級 | **Governance Layer** |
| 治理一致性 | 與 ADR-T002-COLLABORATION-PHASE1 一致 |
| 實作授權 | **不包含任何實作授權** |

### 1.2 文件權威性

| 聲明 | 說明 |
|------|------|
| 唯一治理參考 | 本索引所列四份文件為 T002 Phase 1 的唯一治理參考 |
| 實作需另立 ADR | 未來任何實作、Add-on、流程設計，必須另立 ADR |
| 非工程依據 | 文件本身不得作為工程直接依據 |

### 1.3 使用限制

| 限制 | 說明 |
|------|------|
| 禁止直接實作 | 不得依據本索引文件直接進行程式開發 |
| 禁止擴展解釋 | 不得將文件內容擴展為實作規格 |
| 禁止繞過 ADR | 任何實作需求必須先經 ADR 審批 |

---

## 二、Phase 1 治理文件清單

### 2.1 核心治理文件

| # | 文件名稱 | 用途說明 |
|---|----------|----------|
| 1 | `T002_DATA_COMPLETENESS_STANDARD.md` | 定義商品資料 P0/P1/P2 分級與完整性判斷標準 |
| 2 | `T002_DATA_STATUS_MODEL.md` | 定義商品狀態的邏輯意義與轉換規則 |
| 3 | `T002_DATA_GAP_REMEDIATION_POLICY.md` | 定義缺漏資料的責任歸屬與通知規則 |
| 4 | `T002_T005_DATA_BOUNDARY_FINAL.md` | 最終收斂 T002/T005 邊界定義 |

### 2.2 支援文件

| # | 文件名稱 | 用途說明 |
|---|----------|----------|
| 5 | `T002_COLLABORATION_FEASIBILITY_STUDY.md` | 多人協作可行性分析（設計層，非實作） |
| 6 | `T002-GOVERNANCE-ALIGNMENT-AUDIT.md` | 治理對齊盤點 |
| 7 | `T002-IMPLEMENTATION-STATUS.md` | 實作狀態聲明 |
| 8 | `T002-IMPLEMENTATION-LOCATION-NOTE.md` | 實作位置註記 |

---

## 三、文件間關係

### 3.1 依賴關係

```
ADR-T002-COLLABORATION-PHASE1.md（上位 ADR）
    │
    ├── T002_DATA_COMPLETENESS_STANDARD.md
    │       └── 定義 P0/P1/P2 分級
    │
    ├── T002_DATA_STATUS_MODEL.md
    │       └── 引用完整性標準判定狀態
    │
    ├── T002_DATA_GAP_REMEDIATION_POLICY.md
    │       └── 引用狀態模型（WAITING_* 狀態）
    │
    └── T002_T005_DATA_BOUNDARY_FINAL.md
            └── 引用所有文件，進行邊界收斂
```

### 3.2 引用順序

| 順序 | 閱讀建議 |
|------|----------|
| 1 | 先讀 ADR-T002-COLLABORATION-PHASE1.md（治理決策） |
| 2 | 再讀 T002_DATA_COMPLETENESS_STANDARD.md（欄位分級） |
| 3 | 再讀 T002_DATA_STATUS_MODEL.md（狀態定義） |
| 4 | 再讀 T002_DATA_GAP_REMEDIATION_POLICY.md（回補政策） |
| 5 | 最後讀 T002_T005_DATA_BOUNDARY_FINAL.md（邊界收斂） |

---

## 四、變更管理

### 4.1 變更規則

| 規則 | 說明 |
|------|------|
| 禁止隨意修改 | 本索引所列文件為封存狀態 |
| 變更需 ADR | 任何內容變更需先建立 ADR 並經 Architect 批准 |
| 版本控制 | 變更後需更新版本號與變更紀錄 |

### 4.2 本索引維護

| 項目 | 說明 |
|------|------|
| 新增文件 | 需更新本索引 |
| 刪除文件 | 禁止，僅可標記為 Deprecated |
| 索引變更 | 需 Architect 批准 |

---

## 五、Related Documents

| 文件 | 位置 | 說明 |
|------|------|------|
| ADR-T002-COLLABORATION-PHASE1.md | `ADR/` | 上位治理決策 |
| ADR-0001-T005-T002-B.md | `V005/ARCHITECTURE/` | T005 × T002 治理決策（B 階段） |
| T002_T005_RELATION_EVIDENCE.md | `ADR/ATTACHMENTS/` | 關係證據 |
| T002_T005_ADDON_GOVERNANCE_CONTEXT.md | `ADR/ATTACHMENTS/` | Add-on 治理脈絡 |

---

## 六、Constraints

| 項目 | 說明 |
|------|------|
| 本索引不授權實作 | 僅為文件導覽 |
| 本索引不擴展 Phase 1 | Phase 2 需另立 ADR |
| 本索引不取代 ADR | ADR 為上位權威 |

---

*本索引為 T002 Phase 1 治理文件導覽*
*建立日期：2026-01-13*
