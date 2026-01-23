# ADR-C005: SHOPEE Observation Status

> **狀態**：TEST-ONLY（非 Production）
> **建立日期**：2026-01-23
> **最後更新**：2026-01-23
> **作者**：Claude (Engineer) / GPT (Architect)

---

## 1. 背景

在 C005 Mail 報表中發現 SHOPEE_KATAI 和 SHOPEE_GUSENSE 各只有 1 筆資料，經追查確認這是 **預期行為**，而非系統異常。

### 資料流追蹤結果

```
P0-SHOPEE-Observation-Test
    ↓ testProduceObservation() - 只寫 1 筆測試資料
D005-Listing-Writer (writeObservation)
    ↓
D005 Listing_History (SKU 層級)
    ↓
C005_FactWriter / C005_SyncJob (聚合)
    ↓
C005 Listing_History (平台聚合)
    ↓
Mail 報表
```

---

## 2. 現有 SHOPEE 相關模組

| 模組名稱 | 性質 | 狀態 | 說明 |
|----------|------|------|------|
| P0-SHOPEE-Observation-Test | **Test** | ✅ 運作中 | 僅寫入 1 筆 KATAI + 1 筆 GUSENSE 測試資料 |
| SHOPEE Production Observation Job | **Production** | ❌ 不存在 | 尚未建立完整批次處理 |

---

## 3. P0-SHOPEE-Observation-Test 設計邊界

### 3.1 為何只寫 1 筆

```javascript
// Main.js - testProduceObservation()
// 設計目的：驗證 D005 Observation 寫入流程
// 完成即停，不跑整批、不做 chunk
```

- **測試模組**：驗證寫入機制是否正常
- **最小驗證**：1 筆即可確認流程通暢
- **非批次設計**：無 pagination、無 chunking 邏輯

### 3.2 為何不能被誤用為正式 Job

| 限制 | 說明 |
|------|------|
| 無完整資料源遍歷 | 不會掃描整個 SHOPEE 資料夾 |
| 無錯誤重試機制 | 測試用，失敗即停 |
| 無 Trigger 綁定 | 手動執行，非排程 |
| 命名明確標示 | `P0-*-Test` 表明測試性質 |

---

## 4. SHOPEE 資料來源（待確認）

| 帳號 | Google Drive 資料夾 ID | 商品數量 |
|------|------------------------|----------|
| KATAI | `1X2F375SXtRWG58oyVfPuQkH1AF7Ehs9Y` | ❓ 待盤點 |
| GUSENSE | `1EzEQOP2hQXoERgEy5pNyKZnV8-ymfCby` | ❓ 待盤點 |

---

## 5. 決策

### 5.1 當前決策

**維持 Test-Only 狀態，暫不建立 Production Job**

### 5.2 理由

1. SHOPEE 帳號剛完成拆分（KATAI / GUSENSE）
2. 資料源完整性尚未確認
3. 優先級低於其他進行中任務

### 5.3 未來條件

當滿足以下條件時，可考慮建立 Production Job：

- [ ] 確認 KATAI / GUSENSE 資料夾商品數量
- [ ] 確認資料格式與既有平台一致
- [ ] Architect 核准開發資源投入

---

## 6. 後果與影響

### 6.1 預期行為（非異常）

| 觀察現象 | 說明 |
|----------|------|
| D005 Listing_History SHOPEE 各 1 筆 | ✅ 正常，來自測試模組 |
| C005 Mail 報表 SHOPEE 各 1 筆 | ✅ 正常，反映 D005 實際資料 |
| SHOPEE 覆蓋率顯示 100% | ✅ 正常，1/1 = 100% |

### 6.2 注意事項

- ⚠️ 不要將 SHOPEE 資料量與其他平台（MOMO/PCHOME/YAHOO）比較
- ⚠️ 不要誤判為「資料遺失」或「聚合異常」
- ⚠️ 未來若要啟用 Production，需建立新模組而非修改測試模組

---

## 7. 相關文件

- C005 Phase 2 Readiness
- D005 Listing_History Schema
- P0-SHOPEE-Observation-Test/Main.js

---

## 8. 變更歷史

| 日期 | 變更 | 作者 |
|------|------|------|
| 2026-01-23 | 初始建立 | Claude/GPT |
