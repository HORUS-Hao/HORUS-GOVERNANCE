# SYS-000｜HORUS Governance Constitution

## 1. 文件性質（不可取代）
本文件為 HORUS 系統之最高治理文件（System Constitution）。

- 本文件一經建立，即視為 HORUS 系統正式進入「治理狀態」
- 本文件優先於任何 ADR、模組文件、程式碼註解與 AI 建議
- 未來任何爭議、重構、裁定，皆需回溯本文件作為最高依據

本文件僅能由系統擁有者（Architect）建立與裁定。

---

## 2. 系統角色定義（不可混用）

- **Architect（系統擁有者）**
  - 最終裁定權
  - 治理文件建立者
  - 模組啟停、Phase Seal 決策者

- **Engineer / Operator（赤兔馬 / Claude Code / Cursor 等）**
  - 僅能依治理文件與明確指令執行
  - 無權建立或修改治理憲法級文件
  - 無權倒填歷史裁定

- **AI 系統（GPT / Claude / Gemini 等）**
  - 屬於輔助角色
  - 不具任何裁定權
  - 不得假設治理已存在

---

## 3. 三層資料治理架構（永久有效）

HORUS 系統自本文件起，正式採用以下三層結構：

### 3.1 FACT（事實層）
- 唯一真實來源
- Append-only，不可覆寫
- 不承擔決策、不承擔推論

### 3.2 DERIVED（衍生層）
- 分析、觀測、快取、歷史封存
- 可刪、可重算
- 不得作為決策依據

### 3.3 GOVERNANCE（治理層）
- 規則、裁定、Phase Seal、ADR
- 定義「什麼可以動、什麼不能動」
- 不直接承載業務資料

---

## 4. Git 與實體資料邊界裁定

- **GOVERNANCE**
  - 必須進 Git
  - 版本即治理歷史

- **FACT / DERIVED**
  - 可存在於實體路徑（Google Drive / 本機）
  - 不強制進 Git
  - Git 僅保存 Schema、規則與說明文件

---

## 5. 歷史狀態聲明（誠實原則）

在本文件建立之前：

- HORUS 系統處於「探索 / 演進期」
- 存在程式碼、模組與資料，但未形成正式治理
- 不倒填、不假裝早已治理完成

自本文件建立時間起：

- 所有 Phase Seal、Baseline、Operational 宣告皆需文件佐證
- 所有「完成」皆必須可回溯

---

## 6. 生效聲明（裁定）

本文件自 **建立並 commit 至 HORUS-GOVERNANCE Repo 起** 即刻生效。

自此刻起：
- C005、T005、T050 等模組之治理狀態，需逐一補齊文件
- 未標示治理狀態之模組，一律視為「未封存 / 可調整」

---

## Architect Declaration

I acknowledge and declare that this document establishes the governance baseline
for the HORUS system.

Signed by Architect.

