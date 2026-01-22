# Governance Physical Migration Plan — V005

- 模組：V005
- 類型：Migration Plan（實體遷移清單）
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active

## 一、目的
本文件用於列示既有工程治理檔案之實體遷移清單。
本階段僅列清單，不執行搬移。

## 二、來源（Legacy 路徑）
- ...\_FACT_REGISTRY\
- ...\_GOVERNANCE\

## 三、目標（治理法源）
- HORUS-GOVERNANCE\V005\

## 四、遷移分類清單

### A 類：核心治理文件（必須遷移）
- ADR/*
- RUL/*
- MODULE-REGISTRY/*

目標路徑：
- HORUS-GOVERNANCE\V005\ARCHITECTURE\
- HORUS-GOVERNANCE\V005\RULES\
- HORUS-GOVERNANCE\V005\MODULE-REGISTRY\

### B 類：輔助治理文件（遷移並標註）
- *INVENTORY*
- *REGISTRY*

目標路徑：
- HORUS-GOVERNANCE\V005\INVENTORY\

### C 類：說明與歷史文件（遷移或封存）
- README
- SNAPSHOT
- ASSESSMENT
- GAP / SUGGESTED FILES

目標路徑：
- HORUS-GOVERNANCE\V005\ARCHIVE\

## 五、限制
- 本文件不授權任何實體搬移
- 實體搬移需另行裁定並下達指令

## 六、生效聲明
本清單自生效日起作為 V005 治理實體遷移之唯一參考依據。
