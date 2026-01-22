# T002 / T005 關係證據清單

**文件類型**: Governance Evidence (治理證據)
**掃描日期**: 2026-01-13
**用途**: 供 ADR 直接引用

---

## 一、依賴關係證據

### 1.1 T005 → T002 依賴（不存在）

| 檢查項目 | 結果 | 證據來源 |
|----------|------|----------|
| T005 是否持有 T002_ID | 否 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md（無 T002_ID 欄位） |
| T005 是否 IMPORTRANGE T002 | 否 | 無相關設計文件 |
| T005 schema 是否參照 T002 | 否 | T005.md:29（schema FROZEN，無 T002 參照） |

### 1.2 T002 → T005 依賴（存在）

| 檢查項目 | 結果 | 證據來源 |
|----------|------|----------|
| T002 是否持有 T005_UID | 是 | T002_COLLABORATION_FEASIBILITY_STUDY.md:27 |
| T002 表頭是否 IMPORTRANGE T005 | 是 | STATE-ANCHOR-2025-12.md:67 |
| T002 定位 | T005 的影子層 / 清洗層 | STATE-ANCHOR-2025-12.md:62-63 |

---

## 二、多人編輯假設證據

### 2.1 設計文件中的多人編輯假設

| 證據 | 內容摘要 | 來源位置 |
|------|----------|----------|
| 備註欄位可編輯者 | 「多人」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:70 |
| Change Log 設計 | 追蹤「多人協作衝突檢測」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:97 |
| 編輯者 Email 欄位 | `editor_email` 存於 Change Log | T002_COLLABORATION_FEASIBILITY_STUDY.md:111 |
| 試行使用者 | 「1-2 位內部測試者」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:175 |
| 衝突警示設計 | 「偵測同一欄位近期被他人修改」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:139 |

### 2.2 ADR 對多人編輯的限制

| 限制 | 狀態 | 來源位置 |
|------|------|----------|
| T002 HOLD 狀態 | ACTIVE | ADR-0001-T005-T002-B.md:4 |
| 禁止實作 | 「任何實作可能違反治理規則」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:203 |
| 需 ADR 變更 | 「須取得 Architect 明確批准」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:205-206 |

---

## 三、轉入鎖定機制證據

### 3.1 設計意圖

| 項目 | 內容 | 來源位置 |
|------|------|----------|
| 鎖定範圍 | 「尚未轉入 T005」的記錄才可編輯 | T002_COLLABORATION_FEASIBILITY_STUDY.md:214 |
| 鎖定實作建議 | 「Sheet Add-on 加入編輯鎖定」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:215 |
| 鎖定目的 | 「防止 T005 同步干擾」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:212-213 |

### 3.2 實作狀態

| 項目 | 狀態 | 證據 |
|------|------|------|
| Sheet Add-on 存在 | 否 | T002 HOLD 狀態，無實作 |
| 自動鎖定機制 | 否 | 無相關程式碼 |
| 轉入狀態欄位 | 存在（設計層） | T002_COLLABORATION_FEASIBILITY_STUDY.md:28 |

---

## 四、備註欄位影響證據

### 4.1 備註欄位特性

| 項目 | 事實 | 來源位置 |
|------|------|----------|
| 欄位責任分類 | Human-Input | T002_COLLABORATION_FEASIBILITY_STUDY.md:70 |
| 協作風險等級 | 高（紅色） | T002_COLLABORATION_FEASIBILITY_STUDY.md:86 |
| 風險原因 | 「自由文字，易覆寫衝突」 | T002_COLLABORATION_FEASIBILITY_STUDY.md:70 |

### 4.2 備註與 T005 關係

| 檢查項目 | 結果 | 證據 |
|----------|------|------|
| 備註是否為 Sync-Derived | 否 | T002_COLLABORATION_FEASIBILITY_STUDY.md:70（Human-Input） |
| 備註是否參與 T005 轉入 | 否 | 同步欄位僅含標準化名稱/品牌/型號 |
| T005 是否有對應備註欄位 | 無直接對應 | T005-GOVERNANCE-ALIGNMENT-AUDIT.md（無備註欄位） |

---

## 五、關鍵引用區塊

### 5.1 T002 定位聲明

```
來源：STATE-ANCHOR-2025-12.md:60-63

| Item | Definition |
|------|------------|
| T002 | **非獨立模組** |
| 角色 | T005 的影子層 / 清洗層 |
| 關係 | T005 = Canonical（事實主表），T002 = 衍生層 |
```

### 5.2 IMPORTRANGE 設計聲明

```
來源：STATE-ANCHOR-2025-12.md:67

T002 表頭維持 **IMPORTRANGE 對齊 T005**，此為刻意治理設計。
```

### 5.3 T002 HOLD 狀態聲明

```
來源：STATE-ANCHOR-2025-12.md:42-44

| Item | Status |
|------|--------|
| Decision | **HOLD** |
| Legacy References | ~98 occurrences (6 files) |
| Action Allowed | None |
```

### 5.4 T005 唯一寫入者聲明

```
來源：T005.md:49-50

2. **唯一寫入者**: 僅 D005 可寫入 T005
3. **禁止直接修改**: 其他模組不得直接操作 T005
```

---

## 六、證據完整性聲明

| 項目 | 狀態 |
|------|------|
| 掃描範圍 | HORUS-GOVERNANCE 目錄 |
| 掃描類型 | 只讀 |
| 程式碼修改 | 無 |
| 結論產出 | 無（僅事實與關係） |
| 可引用性 | 可直接供 ADR 引用 |

---

*本文件為治理證據清單，供 ADR 決策參考*
*掃描日期：2026-01-13*
*產出工具：Claude Code*
