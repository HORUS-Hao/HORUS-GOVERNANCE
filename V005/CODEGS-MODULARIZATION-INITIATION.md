# Code.gs Modularization Initiation — V005

- 模組：V005
- 類型：Refactor Initiation（模組化重構啟動）
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active

## 一、啟動目的
本文件用於正式啟動 V005 Code.gs 之模組化重構作業，
以降低單一檔案風險，並提升治理、維護與 AI 協作安全性。

## 二、現況裁定
- 目前 Code.gs 約 4,000～5,000 行
- 已超出可治理與可安全維護之範圍
- 不再允許持續膨脹

## 三、強制原則（即日起生效）

1. 新增功能
   - 必須建立於獨立模組檔案
   - 不得直接寫入 Code.gs

2. Code.gs 定位
   - 僅作為入口（Bootstrap）
   - 不得包含業務邏輯

3. 模組化要求
   - 每一模組需獨立檔案
   - 必須標示版本、日期與關聯治理文件

## 四、初始模組分類（裁定）

- core/
  - bootstrap
  - config
  - guards

- domain/
  - quote
  - approval
  - stamp（只讀）

- services/
  - pdf
  - mail
  - export

- infra/
  - sheets
  - drive
  - cache

## 五、實施順序

1. 新功能全面模組化（立即）
2. 穩定功能逐步抽離
3. Code.gs 縮減為殼層

## 六、限制事項
- 本文件不授權一次性大規模重寫
- 模組拆分需逐步進行
- 每次拆分需有版本與紀錄

## 七、生效聲明
本文件建立後，
V005 Code.gs 模組化重構作業正式啟動。
