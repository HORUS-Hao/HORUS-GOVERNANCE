# Deployment Registry (部署註冊表)

**建立日期**: 2026-01-07
**建立人**: Claude Code
**核准人**: Architect
**最後更新**: 2026-01-12

---

## 版本引用聲明

> **重要**：本文件僅記錄 Deployment ID 歷史，不宣稱系統版本。
>
> S005/V005 系統版本定義請參閱：
> `HORUS-GOVERNANCE/RELEASES/S005_V005/v2.3_FREEZE/S005_V005_RELEASE_v2.3_FREEZE.md`
>
> 若本文件與權威文件衝突，以權威文件為準。

---

## Web App URLs

### S005 - Submission Entry (報價單提報)

| Version | Deployment ID | Exec Identity | Status | Date | Notes |
|---------|--------------|---------------|--------|------|-------|
| 【待填入】 | `【待填入 Deployment ID】` | **User** | **ACTIVE** | 2026-01-12 | External Account Login Fix (v2.3 FREEZE, no code change) |
| @62 | `AKfycbwXoLE5Gd9CMN2bHPFXi1uz2cIS26d5KV8Kv6hJfz2KKNuVjOcI8JEZkO6zZoZILLg` | Owner | Superseded | 2026-01-07 | Fix Mail URL to V005 @75 |
| @61 | `AKfycbwk2Sw8RgQeSEoLXUYXQyeeV_b_FCwjmXjfGdcHuW2FxA41WoCuyHlXLlNLB0fxesE5` | Owner | Superseded | 2026-01-07 | V005 @75 URL final |
| @57 | `AKfycbxD-JOWZ8eeVIVj3UdvPMJcAZy-s4br3nfguUq4FT9CW8Rvlo53SXfrFq_bo-RdV4Fb` | Owner | Superseded | - | V005 @71 URL |

**Production URL (Public):**
```
https://script.google.com/macros/s/【待填入 Deployment ID】/exec
```

> **Execution Identity = User**：外部帳號可正常登入
>
> 相關裁定：`DECISIONS/DECISION-S005-DEPLOYMENT-EXECUTION-IDENTITY-v2.3.md`

---

### V005 - Quotation Viewer (報價單檢視)

| Version | Deployment ID | Status | Date | Notes |
|---------|--------------|--------|------|-------|
| @75 | `AKfycbwDW2p-sPeNs_0bGewcojnyoJH2wmPMEm9FjHqin15Mt-dw7J7z-BRj4y5bT0zR1aCP` | **ACTIVE** | 2026-01-07 | Final REJECT closure |
| @72 | `AKfycbyldDZM0erpZ0xIBwO3vOCp9YRacXdcxuabmSyuk92O9pcAr0z9ArrXk3Jm-Q4quxCl` | Superseded | 2026-01-07 | REJECT mail + readonly |
| @65 | `AKfycbyJBj6JmTVe_07WMMtE86PLbpfvuE6j-dUl9RySqWHSmkWgquaCHim9Tg1GmnV7urMC` | Superseded | - | Approve/Reject handlers |

**Production URL (HORUS Domain):**
```
https://script.google.com/a/macros/horus.tw/s/AKfycbwDW2p-sPeNs_0bGewcojnyoJH2wmPMEm9FjHqin15Mt-dw7J7z-BRj4y5bT0zR1aCP/exec
```

**Review Mode:**
```
https://script.google.com/a/macros/horus.tw/s/AKfycbwDW2p-sPeNs_0bGewcojnyoJH2wmPMEm9FjHqin15Mt-dw7J7z-BRj4y5bT0zR1aCP/exec?action=review&id={REF_ID}
```

---

### C005 - Listing Checker (上架檢查器)

| Version | Deployment ID | Status | Date | Notes |
|---------|--------------|--------|------|-------|
| (待補) | (待補) | ACTIVE | - | - |

---

### Observer-Mail-R020-C005 (每日郵件服務)

| Version | Deployment ID | Status | Date | Notes |
|---------|--------------|--------|------|-------|
| N/A | Script-based (no Web App) | ACTIVE | - | Daily Trigger |

**Script ID:** `1LZxoY-N7CAbgn0bZovoZar6iaL4lP1OtbKNDgLL1EXYPG9ssU_dWfeqw`

---

## URL Format Reference

### Public URL Format
```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

### HORUS Domain URL Format
```
https://script.google.com/a/macros/horus.tw/s/{DEPLOYMENT_ID}/exec
```

---

## Change Log

| Date | Module | Version | Change | By |
|------|--------|---------|--------|-----|
| 2026-01-12 | S005 | 【待填入】 | Execution Identity → User (External Login Fix) | Claude Code |
| 2026-01-07 | S005 | @62 | Fix Mail URL to V005 @75 | Claude Code |
| 2026-01-07 | V005 | @75 | Final REJECT closure with self-ref URL | Claude Code |
| 2026-01-07 | S005 | @61 | V005 @75 URL final | Claude Code |
| 2026-01-07 | V005 | @72 | REJECT mail + readonly display | Claude Code |

---

## Governance Rules

1. **唯一來源**: 此文件為部署 URL 的唯一權威來源
2. **更新義務**: 每次部署後必須更新此文件
3. **版本保留**: Superseded 版本保留記錄，不刪除
4. **URL 參照**: 所有程式碼中的 URL 參照必須與此文件一致

---

*此文件為部署註冊表，修改需同步更新相關程式碼*
