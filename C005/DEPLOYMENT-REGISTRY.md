# C005 Listing Checker - Deployment Registry

> **SSOT for C005 WebApp deployment tracking**
> Last Updated: 2026-01-17

## Active Deployment

| Field | Value |
|-------|-------|
| **WebApp URL** | https://script.google.com/macros/s/AKfycbziFY1wnb7ICJewmubHbfOjqY7zR6uUrvwA38UtWKnckAG76ppB8uVKRDu7XhHzd9rGrQ/exec |
| **Script ID** | `1cQRaC_d6Z0mYLv8f8H6XTybvBQ59e71JZMS9DneTgvcdE0SLmqboDdDd` |
| **Version** | v2.4.1 |
| **Runtime Fingerprint** | `C005-v2.4.1-20260122-pchome-direct-read` |
| **Deployed At** | 2026-01-22 |
| **Deployed By** | Claude Code |

## Local Source Path

```
G:\我的雲端硬碟\【Claude Code】\【HORUS-PDM-Claude-Code】\10-基礎服務層-BASE-SERVICES\C005-Listing-Checker\webapp\
```

## Key Files

| File | Purpose |
|------|---------|
| Code.js | Main entry point, API functions |
| Utils.js | T005 data reading, D001 integration |
| UI.html | Frontend interface |
| Config.js | Configuration constants |
| FactWriter.js | **[Phase 2 MVP]** 每日 FACT 寫入模組 |

## Version History

### v2.4.1 (2026-01-22) - PCHOME Direct Read Fix
- **FIX**: getPchomeScanResult() 改為直接從 Drive 資料夾讀取
- 原因：舊版使用 getComparisonHistoryList() 返回聚合數據，導致 PCHOME 與 MOMO 數據相同
- 資料來源：上架品項資料夾 + 草稿品項資料夾（雙檔案系統）
- 新增 PCHOME_FOLDER_CONFIG 常數
- 新增 readPchomeFolderSkus_() 私有函數
- 計算規則：listed = 上架資料夾 SKU，unlisted = 草稿中不在上架的 SKU

### v2.4.0 (2026-01-22) - Phase 2 MVP: FactWriter
- **NEW**: FactWriter.js - 每日平台 FACT 寫入模組
- 支援 MOMO + PChome 平台每日 FACT 自動寫入
- 依據 C005-FACT-STATUS-SPEC.md 實作四種狀態 (OK/NO_DATA/ERROR/DELAY)
- 寫入目標：Listing_History 工作表
- 去重機制：同日同平台只保留一筆
- 新增函數：runPchomeFactWriter(), testPchomeFactWriter(), manualPchomeFactWrite()
- 新增函數：testAllFactWriters() - 批次測試所有平台

### v2.3.0 (2026-01-17)
- **ROOT CAUSE FIX**: `buildT005Response()` function undefined error
- The broken version called `buildT005Response()` which was never defined
- Restored v323 Code.js which uses simple direct return objects
- Deployment method: Manual paste to GAS Editor (clasp sync issue)

### v2.2.7 (2026-01-17) - BROKEN
- Attempted Date object serialization fix
- **ISSUE**: Code.js contained calls to `buildT005Response()` which doesn't exist
- This caused `getT005DataPaged()` to return `null` to frontend

### v323 (Backup Reference)
- Last known working version
- Backup location: `webapp/temp_backup_20251226140524/v323/`
- Uses simple direct return objects, no factory functions

## Verification Commands

### Check Runtime Fingerprint (Browser Console)
```javascript
google.script.run
  .withSuccessHandler(r => console.log('FINGERPRINT:', r))
  .getRuntimeFingerprint()
```

Expected output:
```
FINGERPRINT: {fingerprint: "C005-v2.2.7-20260117-date-fix", timestamp: "..."}
```

### Test T005 Loading
```javascript
google.script.run
  .withSuccessHandler(r => console.log('T005:', r?.success, r?.totalRows))
  .withFailureHandler(e => console.error('FAIL:', e))
  .getT005DataPaged(1, 10)
```

## Deployment Checklist

- [ ] `clasp push` - Push code to GAS
- [ ] `clasp deploy -d "version description"` - Create deployment
- [ ] Verify fingerprint in browser console
- [ ] Test T005 loading
- [ ] Update this registry

## Troubleshooting

### Issue: `google.script.run` returns `null`

**Possible causes:**
1. **Undefined function call** - Code calls a function that doesn't exist (e.g., `buildT005Response()`)
2. Date object in return value (not serializable)
3. Circular reference in object
4. Function in return value
5. Return value too large (>50KB per call)

**Diagnosis steps:**
1. Run the function in GAS Editor - check if it throws an error
2. Check execution logs for ReferenceError
3. Compare with v323 backup: `diff Code.js temp_backup_20251226140524/v323/Code.js`

**Solution:**
- If undefined function: Restore from v323 backup
- Convert all Date objects to ISO strings: `date.toISOString()`
- Use `JSON.stringify()` test before returning
- Implement pagination for large data

### Issue: clasp push/pull has no output

**Possible causes:**
1. Google OAuth token expired
2. Script ID mismatch

**Solution:**
1. Run `clasp login` to re-authenticate
2. Verify `.clasp.json` has correct scriptId
3. Use GAS Editor directly for deployment
