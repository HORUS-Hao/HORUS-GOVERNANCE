# P0-YAHOO XLSX Ingestion Policy

## Status: IMPLEMENTED (v1.0.0)

## Input
- Yahoo 每次下載為 .xlsx（固定格式）
- 不要求人工轉 Google Sheet

## Method (Implemented)
- GAS 使用 Advanced Drive Service (v2) 將 XLSX 轉換為暫存 Google Sheet
- 讀取暫存 Sheet → 解析 → 寫入 D005
- 完成後刪除暫存檔（省空間）

## Implementation Details
- File: `P0-Yahoo-Observation-Test/Reader.js`
- Function: `readYahooListingSheet()`
- Drive API: v2 (`Drive.Files.insert` with `convert: true`)

## Prerequisites (Already Configured)
- Apps Script：啟用 Advanced Google Services → Drive API v2
- appsscript.json:
  ```json
  "enabledAdvancedServices": [{
    "userSymbol": "Drive",
    "serviceId": "drive",
    "version": "v2"
  }]
  ```

## Verification Evidence
- Date: 2026-01-23
- Test: `testReadOnly()` successfully read 1785 rows from `ProductQueryDetail_20260119131536.xlsx`
- Test: `testProduceObservation()` wrote to D005 (rowIndex: 70800)

## Cleanup Policy
- 暫存 Sheet 在讀取後立即刪除
- 原始 XLSX 保留在 Drive folder（供稽核）
