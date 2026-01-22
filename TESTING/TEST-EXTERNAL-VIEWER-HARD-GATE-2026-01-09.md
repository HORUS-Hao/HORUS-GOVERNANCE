# Testing Record: External VIEWER Hard Gate

**Test Date**: 2026-01-09
**Scope**: S005 / V005 Phase 4
**Status**: PASS

---

## 1. 測試帳號

| 類型 | Email | 用途 |
|------|-------|------|
| External | haochenchang@gmail.com | 驗證 External 限制 |
| Internal | hao.chang@horus.tw | 驗證 Internal 正常流程 |

---

## 2. External 測試結果（haochenchang@gmail.com）

| 測試項目 | 預期結果 | 實際結果 | 狀態 |
|----------|----------|----------|------|
| S005 建立報價單 | 成功 | 成功 | PASS |
| V005 審核工具列可見性 | 不可見 | 不可見 | PASS |
| V005 強制呼叫審核 API | 403 EXTERNAL_FORBIDDEN | 403 | PASS |

### 說明

- **S005 建立報價單**：Phase 4-B OTP + allowedCompanies 驗證通過
- **V005 審核工具列**：Phase 4-C IS_INTERNAL = false，工具列隱藏
- **V005 審核 API**：Phase 4-A Server Gate 阻擋，返回 EXTERNAL_FORBIDDEN

---

## 3. Internal 測試結果（hao.chang@horus.tw）

| 測試項目 | 預期結果 | 實際結果 | 狀態 |
|----------|----------|----------|------|
| S005 建立報價單 | 成功 | 成功 | PASS |
| V005 審核工具列可見性 | 可見 | 可見 | PASS |
| V005 核准/駁回 | 正常運作 | 正常運作 | PASS |

### 說明

- **S005 建立報價單**：原邏輯 checkPermission 不變
- **V005 審核工具列**：IS_INTERNAL = true，工具列可見
- **V005 核准/駁回**：流程不變，正常運作

---

## 4. 測試案例 ID

- `HRS-20260109-5161`（用於 Internal 審核流程驗證）

---

## 5. 部署版本

| 模組 | 版本 | Deployment ID |
|------|------|---------------|
| S005 | @97 | `AKfycbzUTNutekgaLpPo3vU0TaCARX6wnvNpLZNKEb8_AfL_BEtwPifwnt6e7rac3i-3075M` |
| V005 | @83 | `AKfycbzRYOPoIWMZJLDYS0fyI1ikpSVm5SvqktkPOgg7EVvjT0leiYSs_Xh5st7TMLRKdTw` |

---

## 6. Git Branch

```
feature/s005-v1.5-identity-patch
```

---

## 7. 測試總結

| 項目 | 結果 |
|------|------|
| External Hard Gate | PASS |
| Internal 流程不變 | PASS |
| 整體測試狀態 | PASS |

---

## 8. 相關文件

| 文件 | 路徑 |
|------|------|
| 決策文件 | `HORUS-GOVERNANCE/DECISIONS/DECISION-V005-EXTERNAL-VIEWER-HARD-GATE.md` |
| 工程變更紀錄 | `HORUS-GOVERNANCE/S005/CHANGELOG-PHASE4-EXTERNAL-VIEWER-HARD-GATE.md` |

---

*本紀錄由 Claude Code 整理，2026-01-09*
