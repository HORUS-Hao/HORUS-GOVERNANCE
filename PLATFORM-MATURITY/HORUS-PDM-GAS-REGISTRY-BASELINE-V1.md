# HORUS-PDM Runtime & GAS Registry (Baseline v1)

> Status: READ-ONLY BASELINE
> Snapshot Date: 2026-01-25
> Architect: Claude Code
> Purpose: Dual-Root x Multi-GAS Governance Inventory

---

## Part 1: Root Structure Snapshot

### Logical Root
```
G:\我的雲端硬碟\【Claude Code】\【HORUS-PDM-Claude-Code】
```

### Top-Level Directories
| Directory | Type | Notes |
|-----------|------|-------|
| `00-系統管理中心-SYSTEM-MANAGEMENT/` | System | System management |
| `02-啟動器/` | Launcher | Startup scripts |
| `05-AI-SpecSystem/` | AI | AI specification system |
| `06-Scripts-工具/` | Tools | Utility scripts |
| `10-基礎服務層-BASE-SERVICES/` | **Canonical** | Primary GAS modules |
| `20-業務應用層-BUSINESS-APPLICATIONS/` | Business | Business apps |
| `20-消費層-CONSUMERS/` | Consumer | Consumer modules |
| `30-消費與決策層/` | Decision | Decision layer (Dormant) |
| `_archive/` | Archive | Legacy code |
| `_container_bound_canonical/` | Temp | Temp canonical |
| `_T002_CANONICAL_FINAL/` | Temp | T002 final |
| `_temp_analysis_project_b/` | Temp | Temp analysis |
| `_FACT_REGISTRY/` | Facts | Fact registry |
| `_GOVERNANCE/` | Governance | Local governance |
| `HORUS-GOVERNANCE/` | Governance | Main governance |
| `M001-ECPIM/` | Module | ECPIM module |

### Canonical Subtree: `10-基礎服務層-BASE-SERVICES/`
| Module | Has .clasp.json | Status |
|--------|----------------|--------|
| B001F-Price-Facts | Yes | Active |
| B003-Restock-Decision | Yes | Active |
| B101-Business-Intelligence | Yes | Active |
| C005-Eligibility | No | Active |
| C005-Listing-Checker | Yes (webapp/) | Active |
| C020-Wallmount-Checker | Yes | Active |
| D005-Data-Hub | Yes | Active |
| D005-Listing-Writer | Yes | Active |
| D-P0-QUALITY | Yes | Active |
| MB035-Restock-Decision-Mailer | Yes | Active |
| Observer-Mail-R020-C005 | Yes | Active |
| P0-Momo-Observation-Test | Yes | Observation |
| P0-PCHOME-Observation-Test | Yes | Semi-Prod |
| P0-SHOPEE-Observation-Test | Yes | Observation |
| P0-SHOPEE-Observation-Prod | Yes | Observation |
| P0-Yahoo-Observation-Test | Yes | Observation |
| P0-YAHOO-Observation-Prod | Yes | Observation |
| Q005-Quotation-Query | Yes | Active |
| R020-Price-Comparator | Yes (2 projects) | Active |
| R021-Anomaly-Routing-Engine | Yes | Active |
| S005-Submission-Entry | Yes | Active |
| T002-Material-Schema-Design | Yes | Active |
| T005-商品管理-Product-Mgmt | **No** | **NO LOCAL BINDING** |
| T030-Margin-Simulation-Center | Yes | Active |
| T050-A-Sheet-Initializer | Yes | Frozen |
| V005-Quotation-Viewer | Yes | Active |
| W010-Specs-Generator | Yes | Active |

---

## Part 2: GAS Binding Registry (All .clasp.json)

### Active GAS Projects (36 Unique scriptIds)

| # | Module Path | scriptId | WRITE | MAIL | TRIGGER | Risk |
|---|-------------|----------|-------|------|---------|------|
| 1 | B001F-Price-Facts | `1oKpwGF_3fSOjfpC-2vasifsLczM6_PMwBn0L0fSltKx6iRVuMVe4KxXF` | Y | N | N | R1 |
| 2 | B003-Restock-Decision | `1n6osjW2aMXw2NVoezOxWVy047sWErgJ6G3i2kJO7Z0n0FYTrgaIR7WAN` | Y | N | N | R1 |
| 3 | B101-Business-Intelligence | `1mhkRkte9_VIn2oqLc5SjC_V8tIk1jczOGCdhrCzv46pdGhmE88jtXbtI` | N | N | N | R0 |
| 4 | C005-Listing-Checker/webapp | `1cQRaC_d6Z0mYLv8f8H6XTybvBQ59e71JZMS9DneTgvcdE0SLmqboDdDd` | Y | N | Y | R2 |
| 5 | C020-Wallmount-Checker | `1y6SRnKco2Wjpf-m1Uie4g4L4ehCyURR6Bq9wHkoIvLRW5fpvi21nTu3H` | N | N | N | R0 |
| 6 | D005-Data-Hub | `1U8-gVDcfIfkH_MGH-IEmvyRuq0nlnwW-LVLeIVa1H5Qr0UkrjFaFunhd` | N | N | N | R0 |
| 7 | D005-Listing-Writer | `1qLF7JM9B9xJ8MMjxO0wHWdxE43Lw6Tuv8tTq2jXEKDIp2WiiJDdv4FgO` | Y | N | N | R1 |
| 8 | D-P0-QUALITY | `18JNirB_2RMdPb6KmSDGEabiFTiqfJ6HmHtxSqjG7Tyu9fuffGhnhhkAz` | N | N | N | R0 |
| 9 | MB035-Restock-Decision-Mailer | `1gFT9FzKs17vZrz9W_gSSiD6yRapqEQQFxJSEFOuS5GJsZbBRKk4YDVqX` | Y | Y | N | R2 |
| 10 | Observer-Mail-R020-C005 | `1LZxoY-N7CAbgn0bZovoZar6iaL4lP1OtbKNDgLL1EXYPG9ssU_dWfeqw` | Y | Y | Y | R2 |
| 11 | P0-Momo-Observation-Test | `1jibvPdIof4sfqMy6hd8LHjq2G3a-gDD5XSjIsKWh5n4bzMP_jbty7oKm` | N | N | N | R0 |
| 12 | P0-PCHOME-Observation-Test | `1k66FtuvYmZE1Hgpg9OEoAj4bK41kDx01Ec2o0zwetzzitRYbeO5b3ZVr` | N | N | Y | R1 |
| 13 | P0-SHOPEE-Observation-Test | `1kEfIMgDOzSUECKa2M97KJVyN0v92oE2bEWBbWzq7o_mkFRO4l0Fs2t2e` | N | N | N | R0 |
| 14 | P0-SHOPEE-Observation-Prod | `1bc7jQqUzlIUOZ_dP5XD-30e6gs6YrSOfxqfVpMcq_eWx2PC1Llvg7pHI` | Y | N | N | R1 |
| 15 | P0-Yahoo-Observation-Test | `1mk7wcQfJH3uGXgRx6_44qBKNaNctCnmOWVFWSRYReqBsCsCkKEkKB7di` | N | N | N | R0 |
| 16 | P0-YAHOO-Observation-Prod | `12LR0Z3Fczf-NF7-18fb2-st_omGuN8NLVf5y5L7Tc-tWaScpR8oJfUgB` | Y | N | N | R1 |
| 17 | Q005-Quotation-Query | `1xnzdGqVKwBpb0dtzX9p6t0eBnXmuhBkKkDIU7oPYenqsDLPreYtCoRbg` | N | N | N | R0 |
| 18 | R020-Price-Comparator | `1W51AwGFSDNjgzMhKhfR8DlAjWtp1xdD_b83Byg_SsdExO_-F_gKSFXhv` | Y | N | N | R1 |
| 19 | R020/_clasp-observer-mail | `1LZxoY-N7CAbgn0bZovoZar6iaL4lP1OtbKNDgLL1EXYPG9ssU_dWfeqw` | Y | Y | Y | R2 |
| 20 | R021-Anomaly-Routing-Engine | `1DwYJoNeMyau_OcdsI4577BdGfAHufhVIyzmeY2762QTm8WAiF7eIHCZj` | Y | N | N | R1 |
| 21 | S005-Submission-Entry | `1a37aHmNuRpiLOF1tz1Dg1qvsxeQ20WKq92pnkxbf34LxhURvFucjCvB8` | N | N | N | R0 |
| 22 | T002-Material-Schema-Design | `1EbUzqBXBMGSPWEhAiENDHrhI2C9RYo-FAxRAljamELJDpyMTj-TVLD7D` | N | N | N | R0 |
| 23 | T030-Margin-Simulation-Center | `1BWAbjmObajrATGWuqkLfPwoMzuZ3kgue7QDKYFFe4clhQe4m-g8JsiCu` | Y | N | N | R1 |
| 24 | T050-A-Sheet-Initializer | `12Jfhsr2k6R25LDc6v1Oo0ei1LwlxCpNFw4lXkjSRuUNtHCtDK6iqcO_P` | N | N | N | R0 |
| 25 | V005-Quotation-Viewer | `1ae1VO3krR2yEyywsPN2A8apWMd6NNGo6B9PQmo_ZbZbQCi6Rt-D38hQ1` | N | N | N | R0 |
| 26 | W010-Specs-Generator | `1ytgSQ1y52H6H2zC0FqtRr4HBghDjzvi-xhweVUXdfc26khJzaLEf7vIP` | N | N | N | R0 |

### Archived / Temp Projects

| # | Module Path | scriptId | Status |
|---|-------------|----------|--------|
| A1 | _archive/T005_Legacy | `1OQCD4h9eLHW-KNmI1RT3zs7oqZmFOrqDVPn7p5onxgM6tJsLd-fSriAu` | ARCHIVED |
| A2 | PDM-Calibrator-Phase1-2.6-Archive | `178wI2om1sZW8EOrb1Lc_E-12tXoj6Njg_KaU_-nrWcC-qi4th5oKsCMq` | ARCHIVED |
| A3 | T005-Phase0-Planning-Archive | (empty) | ARCHIVED |
| A4 | R000/E001-Elife-API-V4-ARCHIVED | `1SOvydKM252y_SitpE4tGdHbLeSaf2Vrm510AExM5rwdJsh72pD2IeIqs` | ARCHIVED |
| T1 | _container_bound_canonical | `1c7X1cFyHBNaBCu7Cq38H7uauaLWxhNBFw3trT_I5lk1oiHZUc7EqjHl7` | TEMP |
| T2 | _T002_CANONICAL_FINAL | `1EbUzqBXBMGSPWEhAiENDHrhI2C9RYo-FAxRAljamELJDpyMTj-TVLD7D` | TEMP |
| T3 | _temp_analysis_project_b | `1oDHRI2phUT1xm2obnGtKPijIbhl6rJsrfaS3wtxD3lnmz2yT8KkN2T2j` | TEMP |

### Duplicate scriptId Detection

| scriptId | Local Paths | Notes |
|----------|-------------|-------|
| `1LZxoY-N7CAbgn0bZovoZar6iaL4lP1OtbKNDgLL1EXYPG9ssU_dWfeqw` | Observer-Mail-R020-C005, R020/_clasp-observer-mail | Same project, 2 local paths |
| `1DwYJoNeMyau_OcdsI4577BdGfAHufhVIyzmeY2762QTm8WAiF7eIHCZj` | R021-Anomaly-Routing-Engine, R021/gas | Same project, 2 local paths |
| `1BWAbjmObajrATGWuqkLfPwoMzuZ3kgue7QDKYFFe4clhQe4m-g8JsiCu` | T030-Margin-Simulation-Center, T030/temp_pull | Same project, 2 local paths |
| `1EbUzqBXBMGSPWEhAiENDHrhI2C9RYo-FAxRAljamELJDpyMTj-TVLD7D` | T002-Material-Schema-Design, _T002_CANONICAL_FINAL | Same project, canonical + temp |
| `1LpklKc_v--lwr2jx7MejE53NJOQ4khADDKCz_wZJXQwFUubMZ1KwzQp0` | AGY-LABS, FACT-LABS, UI-LABS | Same project, 3 LABS folders |

---

## Part 3: Sheet ↔ GAS Impact Matrix

### T005 Spreadsheet (商品管理)
**Sheet ID:** `1MHeqKjpt7Iq1mV7OvLMYIqjr2UVIMgK1DJqFU3a8jSk`

| GAS Module | Access Type | Sheets Accessed | Risk |
|------------|-------------|-----------------|------|
| C005-Listing-Checker/webapp | READ | T005 全表 | R0 |
| R020-Price-Comparator | WRITE | T005:CompareResult | R1 |
| R020/_clasp-observer-mail | WRITE | T005:C005_* | R2 |
| T030-Margin-Simulation-Center | READ | T005:商品資料 | R0 |

### User-Provided GAS (Cloud Only)
**scriptId:** `1owbtfG9sC5AJBtMwRe57b5Yc-984rx5HUNDSGMMdb_DUJs5O-0xOhFMU`
**Status:** NO LOCAL BINDING
**Risk:** R2 (WRITE + TRIGGER) - Unmanaged

---

## Part 4: Risk Classification Summary

### Risk Level Definitions

| Risk | Definition | Impact |
|------|------------|--------|
| **R0** | READ-ONLY | No data modification risk |
| **R1** | WRITE (Sheet) | Can modify Sheet data |
| **R2** | WRITE + MAIL/TRIGGER | Can modify data AND send notifications or auto-execute |

### Risk Distribution

| Risk Level | Count | Modules |
|------------|-------|---------|
| **R0** | 13 | B101, C020, D005-Hub, D-P0-QUALITY, P0-Momo-Test, P0-SHOPEE-Test, P0-Yahoo-Test, Q005, S005, T002, T050, V005, W010 |
| **R1** | 9 | B001F, B003, D005-Writer, P0-PCHOME-Test, P0-SHOPEE-Prod, P0-YAHOO-Prod, R020, R021, T030 |
| **R2** | 4 | C005-Listing-Checker, MB035-Mailer, Observer-Mail-R020-C005, R020/_clasp-observer-mail |

### Unmanaged GAS (No Local Binding)

| scriptId | Known Location | Risk | Notes |
|----------|----------------|------|-------|
| `1owbtfG9sC5AJBtMwRe57b5Yc-984rx5HUNDSGMMdb_DUJs5O-0xOhFMU` | Cloud (T005) | R2 | User-provided, no .clasp.json |
| T005-商品管理-Product-Mgmt | Local folder | - | Has scripts but NO .clasp.json |

---

## Part 5: Governance Verification

### Modules with WRITE Capability (R1+R2)

| Module | WRITE Target | Governance Doc | Verified |
|--------|--------------|----------------|----------|
| B001F-Price-Facts | B001F Sheet | - | - |
| B003-Restock-Decision | B003 Sheet | - | - |
| C005-Listing-Checker | C005 History | C005-*.md | Yes |
| D005-Listing-Writer | D005 Sheet | D005-*.md | Yes |
| MB035-Restock-Decision-Mailer | Log Sheet | - | - |
| Observer-Mail-R020-C005 | C005/R021 Sheets | Observer-*.md | Yes |
| P0-PCHOME-Observation-Test | D005 | P0-PCHOME/README | Yes |
| P0-SHOPEE-Observation-Prod | D005 | P0-SHOPEE/README | Yes |
| P0-YAHOO-Observation-Prod | D005 | P0-YAHOO/README | Yes |
| R020-Price-Comparator | R020 Sheet | R020-*.md | Yes |
| R021-Anomaly-Routing-Engine | R021 Sheet | R021-*.md | Yes |
| T030-Margin-Simulation-Center | T030 Sheet | T030-*.md | Yes |

### Modules with TRIGGER Capability

| Module | Trigger Type | Frequency | Governance Doc |
|--------|--------------|-----------|----------------|
| C005-Listing-Checker | Time-driven | Daily | C005-PHASE-*.md |
| Observer-Mail-R020-C005 | Time-driven | Daily 09:00 | Observer-*.md |
| P0-PCHOME-Observation-Test | Time-driven | Chunked | P0-PCHOME/README |
| R020/_clasp-observer-mail | Time-driven | Daily | TriggerSetup.js |

---

## Summary

| Category | Count |
|----------|-------|
| Total .clasp.json files | 44 |
| Unique GAS Projects | 36 |
| Active Projects | 26 |
| Archived Projects | 4 |
| Temp Projects | 3 |
| R0 (READ) | 13 |
| R1 (WRITE) | 9 |
| R2 (WRITE+MAIL/TRIGGER) | 4 |
| Unmanaged (no local binding) | 2 |

---

## Architect Notes

1. **T005-商品管理-Product-Mgmt** has complete gas-scripts/ but NO .clasp.json binding
2. User-provided GAS `1owbtfG9sC5AJBtMwRe57b5Yc-984rx5HUNDSGMMdb_DUJs5O-0xOhFMU` exists in cloud only
3. Multiple GAS projects share the same scriptId (intentional dual-path setup)
4. R2 projects require Architect approval for any modifications

---

> This registry is READ-ONLY BASELINE. Any updates require governance review.
> Generated: 2026-01-25 by Claude Code

