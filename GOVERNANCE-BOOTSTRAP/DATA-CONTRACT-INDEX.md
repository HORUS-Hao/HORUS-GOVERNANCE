# HORUS Data Contract Index
# 文件性質：AI / Agent 啟動導引（Governance Bootstrap）
# 版本：v1.0
# 建立日期：2026-01-06
# 狀態：EFFECTIVE

---

## 1. Purpose（文件目的）

本文件用於：
- 告知所有 AI / Agent 哪些模組已受 Data Contract 治理
- 定義 AI 在這些模組上的**行為邊界**
- 防止 AI 自行推論、補邏輯、或越權修改資料流

本文件為 **啟動導引（Bootstrap）**，非契約本體。

---

## 2. Contract-Governed Modules（已受治理模組）

以下模組已具備正式 Data Contract，AI 僅能「遵循」，不得自行延伸語義：

| Module | Contract Version | Role | Notes |
|------|------------------|------|-------|
| T005 | v1.0 | Product Master SSOT | 所有 FACT / DERIVED / Consumer 的語義上游 |
| D005 | v1.0 | FACT Writer (SKU Level) | 唯一 Listing_History 寫入權威 |
| C005 | v1.0 | READ-ONLY Consumer | Web App，比對工具，非權威 |

---

## 3. Absolute Rules for AI / Agent（絕對規則）

### R1. No Implicit Logic
- AI 不得對 FACT 層資料進行推導、補算、Normalize
- 不得將 null 合理化為 0 或空字串

### R2. No Cross-Role Violation
- Consumer（如 C005）不得寫入 FACT
- Writer（如 D005）不得解析、Mapping、推論輸入語義

### R3. Contract > Code > Explanation
- 若 Code 行為與 Data Contract 衝突，以 Contract 為準
- AI 不得「因為程式碼能跑」而合理化違規行為

---

## 4. AI Action Matrix（AI 行為矩陣）

| 行為類型 | 是否允許 | 說明 |
|--------|---------|------|
| 讀取 Data Contract | ✅ | 唯讀 |
| 解釋 Contract 條文 | ✅ | 不得改寫語義 |
| 修改 Contract | ❌ | 僅 Architect 可裁定 |
| 產生補充程式碼 | ⚠️ | 必須先對齊 Contract |
| 新增 FACT Writer | ❌ | 需 Architect 明確裁定 |

---

## 5. Expansion Policy（擴展政策）

未來新增 Data Contract 模組（如 T030）時：
1. 先建立對應 Data Contract
2. 再更新本 Index
3. AI 才可參與後續設計與實作

---

## 6. Authority

- Architect 為本文件與所有 Data Contract 的最終裁決者
- AI / Agent 僅為執行與輔助角色
