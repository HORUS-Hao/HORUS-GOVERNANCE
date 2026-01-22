# Governance Physical Migration Execution — V005

- 模組：V005
- 類型：Migration Execution（實體搬移裁定）
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active

## 一、目的
本文件授權並規範 V005 既有工程治理檔案之一次性實體搬移行為，
以完成治理主權集中至 HORUS-GOVERNANCE。

## 二、前置條件
以下文件已存在且生效：
- GOVERNANCE-LEGACY-CLEANUP-DECISION.md
- GOVERNANCE-MIGRATION-INDEX.md
- GOVERNANCE-PHYSICAL-MIGRATION-PLAN.md
- _GOVERNANCE/POINTER.md（工程 Repo）

## 三、授權搬移來源（Legacy）
- ...\_FACT_REGISTRY\
- ...\_GOVERNANCE\

## 四、目標治理法源
- HORUS-GOVERNANCE\V005\

## 五、實體搬移規則

### A 類：核心治理文件（必須搬移）
來源：
- ADR/*
- RUL/*
- MODULE-REGISTRY/*

目標：
- HORUS-GOVERNANCE\V005\ARCHITECTURE\
- HORUS-GOVERNANCE\V005\RULES\
- HORUS-GOVERNANCE\V005\MODULE-REGISTRY\

### B 類：輔助治理文件（搬移並標示）
來源：
- *INVENTORY*
- *REGISTRY*

目標：
- HORUS-GOVERNANCE\V005\INVENTORY\

### C 類：說明與歷史文件（搬移或封存）
來源：
- README
- SNAPSHOT
- ASSESSMENT
- GAP / SUGGESTED FILES

目標：
- HORUS-GOVERNANCE\V005\ARCHIVE\

## 六、搬移後處置

1. 原 _FACT_REGISTRY 與 _GOVERNANCE
   - 僅保留 POINTER.md（如需）
   - 其餘治理檔案不得留存

2. 工程 Repo 禁止再存放治理主檔

## 七、回滾原則
- 若搬移中斷，可依原檔案結構回滾
- 未經 Architect 新裁定，不得再次搬移

## 八、生效聲明
本文件為 V005 治理實體搬移之唯一執行裁定。
自生效日起授權一次性實體搬移行為。
