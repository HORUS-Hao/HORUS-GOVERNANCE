# Governance Legacy Cleanup Decision — V005

- 模組：V005
- 類型：Governance Decision
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active

## 一、裁定背景
經 Runtime 使用盤點確認，下列工程路徑內之檔案：
- 不被任何 .js / .gs 程式碼讀取
- 不構成任何 runtime 相依
- 性質為純治理、說明或盤點用途文件

盤點路徑如下：
- _FACT_REGISTRY
- _GOVERNANCE

## 二、正式裁定

1. _FACT_REGISTRY 與 _GOVERNANCE
   - 裁定為「治理文件（非 runtime）」
   - 不得再被任何工程程式或模組視為資料來源

2. 上述路徑內之治理內容
   - 不具治理主權
   - 治理主權一律以 HORUS-GOVERNANCE 為準

3. 後續治理文件必須集中於：
   - HORUS-GOVERNANCE\V005\

## 三、治理遷移原則

- A 類：核心治理文件
  （ADR / RUL / MODULE-REGISTRY）
  → 必須完整遷移為正式治理法源

- B 類：輔助治理文件
  （Inventory / Registry）
  → 遷移並明確標示為輔助性文件

- C 類：說明與快照文件
  （README / Snapshot / Assessment）
  → 遷移或封存，不具法源效力

## 四、明確禁止事項

- 禁止任何工程程式讀取原 _FACT_REGISTRY 或 _GOVERNANCE
- 禁止在工程 Repo 中新增治理主檔
- 禁止產生多重治理主權來源

## 五、生效聲明
本文件為 V005 治理清算之唯一裁定依據。
自生效日起，所有治理、工程與 AI 行為須遵循本裁定。
