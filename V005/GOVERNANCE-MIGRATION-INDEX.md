# Governance Migration Index — V005

- 模組：V005
- 類型：Governance Index
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active

## 一、來源說明（Legacy）

以下工程路徑為既有治理與盤點來源，
已裁定不再具治理主權：

- ...\_FACT_REGISTRY
- ...\_GOVERNANCE

## 二、目標法源（Authority）

V005 唯一治理法源位置如下：

- HORUS-GOVERNANCE\V005\

所有治理文件須以此路徑為唯一權威來源。

## 三、遷移分類對照

### A 類：核心治理文件
範圍：
- ADR/*
- RUL/*
- MODULE-REGISTRY/*

目標位置：
- HORUS-GOVERNANCE\V005\ARCHITECTURE\
- HORUS-GOVERNANCE\V005\RULES\
- HORUS-GOVERNANCE\V005\MODULE-REGISTRY\

### B 類：輔助治理文件
範圍：
- *INVENTORY*
- *REGISTRY*

目標位置：
- HORUS-GOVERNANCE\V005\INVENTORY\

### C 類：說明與歷史文件
範圍：
- README
- SNAPSHOT
- ASSESSMENT
- GAP / SUGGESTED FILES

目標位置：
- HORUS-GOVERNANCE\V005\ARCHIVE\

## 四、工程 Repo 使用規則

- 工程 Repo 僅允許存在 POINTER.md
- POINTER 僅可指向 HORUS-GOVERNANCE
- 不得在工程 Repo 中保留治理主檔
