# C005 MAIL & Platform Completion Roadmap

> **Version**: v2026-01.1
> **Created**: 2026-01-22
> **Status**: ACTIVE
> **Authority**: HORUS-GOVERNANCE

---

## 1. Phase 1（已完成）

### 1.1 MAIL Phase 1 Disclosure

| 項目 | 狀態 | 證據 |
|------|------|------|
| T005-LISTING-ELIGIBILITY-RULES.md | ✅ Done | `HORUS-GOVERNANCE/T005/` |
| GOVERNANCE-INDEX 更新 | ✅ Done | section 6.5 |
| MAIL 治理揭露文字 | ✅ Done | commit `9753b61` |

### 1.2 驗收標準

- [x] MAIL 出現「治理揭露」區塊
- [x] 揭露文字說明母數定義與限制
- [x] 無數學邏輯變更

---

## 2. Phase 1.5（立即要做：定義釐清，不改邏輯）

### 2.1 totalProducts 定義證明

| 項目 | 狀態 | 說明 |
|------|------|------|
| MOMO totalProducts 來源追蹤 | ✅ Done | `C005_MailService.js:1066` → Listing_History D欄 |
| PCHOME totalProducts 來源追蹤 | ✅ Done | 同上 |
| 差異原因確認 | ✅ Done | Case A：各平台 universe 本來就不同 |

**驗收**：本文件「交付物 A」段落

### 2.2 平台差異分解指標

| 指標 | 現狀 | 需求 |
|------|------|------|
| platform_records_count | ❌ 缺口 | Phase 2 補強 |
| matched_to_baseProducts_count | ❌ 缺口 | Phase 2 補強 |
| unmatched_platform_records_count | ❌ 缺口 | Phase 2 補強 |
| baseProducts_not_found_on_platform_count | ❌ 缺口 | Phase 2 補強 |

**驗收**：本文件「交付物 B」段落

### 2.3 MAIL 補充揭露（文字）

| 項目 | 狀態 | 說明 |
|------|------|------|
| 「各平台 totalProducts 定義」揭露 | ⏳ TODO | 需在 MAIL 加入一句說明 |

**建議文字**：
```
各平台總商品數為該平台 Observer 可觀測的 universe，不同平台數字可能不同。
```

**驗收**：MAIL 內容出現此句或等效說明

### 2.4 MAIL 收件人治理

| 項目 | 現狀 | 建議 |
|------|------|------|
| 收件人 | hao.chang@horus.tw | 維持或擴充需 ADR |
| 收件人清單位置 | `Config.js:MAIL_RECIPIENTS` | 已治理化 |

---

## 3. Phase 2（需 ADR 核准）

### 3.1 Listing-Eligible Universe 計算

| 項目 | 說明 | 前置條件 |
|------|------|----------|
| T005 status enum 定義 | 定義商品狀態允許值 | Schema ADR |
| 狀態 → 上架資格對照表 | 哪些狀態算「應上架」 | enum 定義完成 |
| C005 eligibility filter | 修改 buildBaseProducts() | 對照表核准 |
| FACT schema 擴充 | 加入 eligibility 相關欄位 | ADR |

**驗收**：
- [ ] ADR 核准
- [ ] 新 FACT 欄位定義
- [ ] C005 ComparisonEngine 實作 filter
- [ ] MAIL 顯示「eligibility-adjusted 上架率」

### 3.2 歷史 FACT 解讀策略

| 選項 | 說明 | 建議 |
|------|------|------|
| A. 版本標註 | 歷史資料標註「母數版本」 | 推薦 |
| B. 回填重算 | 用新規則重算歷史 | 高成本 |

**驗收**：ADR 決定 + 實作

### 3.3 Coverage/Gap 指標補強

| 指標 | 說明 | 驗收 |
|------|------|------|
| platform_records_count | 平台原始筆數 | FACT 新增欄位 |
| matched_count | 成功對應筆數 | FACT 新增欄位 |
| unmatched_count | 無法對應筆數 | FACT 新增欄位 |
| coverage_rate | 對應率 | FACT 新增欄位 |

---

## 4. Phase 3（補平台）

### 4.1 平台覆蓋狀態

| 平台 | Observer | FactWriter | MAIL 顯示 | 整體狀態 |
|------|----------|------------|-----------|----------|
| MOMO | ✅ P0-Momo-Observation-Test | ⚠️ PLATFORM_FOLDER_CONFIG 未配置 | ✅ 可顯示 | 部分完成 |
| PCHOME | ✅ P0-PCHOME-Observation-Test | ⚠️ PLATFORM_FOLDER_CONFIG 未配置 | ✅ 可顯示 | 部分完成 |
| YAHOO | ✅ P0-Yahoo-Observation-Test | ⚠️ 未配置 | ⚠️ 待確認 | 待補強 |
| SHOPEE | ⚠️ P0-SHOPEE-Observation-Test | ⚠️ 未配置 | ⚠️ 待確認 | 待補強 |

### 4.2 每平台完成條件

對於每個平台，需完成：

- [ ] Observer 正常運行，產出 `source_status.json`
- [ ] PLATFORM_FOLDER_CONFIG 配置 folderId
- [ ] FactWriter 可讀取 statistics
- [ ] Listing_History 有該平台 FACT
- [ ] MAIL 正確顯示該平台數據
- [ ] Staleness 偵測正常

### 4.3 待確認平台清單

| 平台 | 來源 | 狀態 |
|------|------|------|
| RAKUTEN | C005_PLATFORM_MAPPING | 已定義但無 Observer |
| MOMOSHOP | C005_PLATFORM_MAPPING | 已定義但無 Observer |

---

## 5. 驗收總覽

### Phase 1.5 驗收清單

- [ ] 本文件完成並 commit
- [ ] MAIL 加入「各平台 totalProducts 定義」揭露
- [ ] 豪哥確認定義理解正確

### Phase 2 驗收清單

- [ ] ADR 核准（eligibility 計算）
- [ ] 新 FACT schema 生效
- [ ] C005 filter 實作上線
- [ ] 歷史資料策略決定

### Phase 3 驗收清單

- [ ] 所有目標平台 Observer 上線
- [ ] 所有平台 FACT 可寫入
- [ ] MAIL 顯示所有平台

---

## 6. 相關文件

| 文件 | 說明 |
|------|------|
| `T005-LISTING-ELIGIBILITY-RULES.md` | 上架資格規則定義 |
| `C005-GOVERNANCE.md` | C005 模組治理規範 |
| `Config.js` | PLATFORM_FOLDER_CONFIG / C005_PLATFORM_MAPPING |
| `C005_FactWriter.js` | FACT 寫入邏輯 |
| `C005_MailService.js` | MAIL 讀取與生成邏輯 |

---

## 7. 變更歷程

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-22 | v2026-01.1 | 初版：定義 Phase 1.5/2/3 roadmap | Claude Code |

---

**END OF C005-MAIL-AND-PLATFORM-COMPLETION-ROADMAP.md**
