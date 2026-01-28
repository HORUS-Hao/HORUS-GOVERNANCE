# C005 Output Contract

> **Status**: FROZEN / GOVERNED
> **Version**: v1.0.0 (Baseline Stable)
> **Baseline**: C005 v3.2.1
> **Created**: 2026-01-26
> **Owner**: HORUS-PDM Architecture Team

---

## 1. DOCUMENT AUTHORITY

**This document is the Single Source of Truth (SSOT) for C005 output schema.**

- Any modification to output fields requires Major version bump
- Any addition of new fields requires Minor version bump
- This contract does NOT depend on S005, V005, or any downstream module
- This contract does NOT write back to T005

---

## 2. OUTPUT SCHEMA

### 2.1 Top-Level Response Structure

| Field | Type | Stability | Description |
|-------|------|-----------|-------------|
| `success` | boolean | IMMUTABLE | Execution status |
| `message` | string | IMMUTABLE | Status message |
| `data` | object | IMMUTABLE | Result container |
| `data.results` | array | IMMUTABLE | Product comparison results |
| `data.statistics` | object | IMMUTABLE | Aggregated statistics |
| `data.summary` | object | EXTENDABLE | Summary metrics |

### 2.2 Single Result Object (`data.results[]`)

#### 2.2.1 T005 Product Information (Source: T005)

| Field | Type | Stability | Description | Null Allowed |
|-------|------|-----------|-------------|--------------|
| `productId` | string | IMMUTABLE | Product identifier (T005.model or T005.uid) | NO |
| `uid` | string | IMMUTABLE | T005 unique identifier | YES |
| `supplier` | string | IMMUTABLE | Supplier name | YES |
| `brand` | string | IMMUTABLE | Brand name (normalized) | YES |
| `model` | string | IMMUTABLE | Product model (normalized) | YES |
| `name` | string | IMMUTABLE | Product name (normalized) | YES |
| `categoryMajor` | string | IMMUTABLE | Major category | YES |
| `categoryMiddle` | string | IMMUTABLE | Middle category | YES |
| `categorySmall` | string | IMMUTABLE | Small category | YES |
| `source` | string | IMMUTABLE | Data source ("T005" or "ERP") | NO |
| `status` | string | IMMUTABLE | T005 product status | YES |
| `barcode` | string | IMMUTABLE | International barcode (EAN/UPC) | YES |

**CRITICAL: `barcode` field**
- Type: `string` (NEVER number)
- Leading zeros MUST be preserved
- Export formats:
  - Google Sheet: `@STRING@` format
  - Excel: Single quote prefix (`'0123456789`)

#### 2.2.2 Platform Listing Status

| Field | Type | Stability | Description |
|-------|------|-----------|-------------|
| `platforms` | object | EXTENDABLE | Platform-specific listing data |
| `platforms.{platformId}` | object | EXTENDABLE | Per-platform data |
| `platforms.{platformId}.isListed` | boolean | IMMUTABLE | Is product listed on this platform |
| `platforms.{platformId}.status` | string | IMMUTABLE | Platform status (selling/offline/suspended) |
| `platforms.{platformId}.listingStatus` | string | IMMUTABLE | Listing status (listed/unlisted/draft) |
| `platforms.{platformId}.rawStatus` | string | IMMUTABLE | Original platform status text |
| `platforms.{platformId}.productName` | string | IMMUTABLE | Product name on platform |
| `platforms.{platformId}.fileTypes` | array | IMMUTABLE | File types (PChome: listed/draft) |
| `listingStatus` | object | EXTENDABLE | Summary by platform |
| `listingStatus.{platformId}` | string | IMMUTABLE | "listed" / "unlisted" / "draft" |
| `isListedAnywhere` | boolean | IMMUTABLE | Is product listed on any platform |

**Supported Platform IDs** (v3.2.1):
- `momo` - MOMO Shopping
- `pchome` - PChome 24h
- `yahoo` - Yahoo Shopping
- `shopee-gusense` - Shopee Gusense Seller
- `shopee-katai` - Shopee KATAI Seller

#### 2.2.3 ERP Inventory Data

| Field | Type | Stability | Description |
|-------|------|-----------|-------------|
| `erp` | object \| null | IMMUTABLE | ERP inventory data (null if not matched) |
| `erp.productId` | string | IMMUTABLE | ERP product ID |
| `erp.totalStock` | number | IMMUTABLE | Total stock across all warehouses |
| `erp.selectedWarehouseStock` | number | IMMUTABLE | Stock in selected warehouses |
| `erp.warehouses` | object | IMMUTABLE | Stock by warehouse name |
| `erp.hasStock` | boolean | IMMUTABLE | Has stock in selected warehouses |
| `hasStock` | boolean | IMMUTABLE | Copy of erp.hasStock |

#### 2.2.4 Anomaly Detection

| Field | Type | Stability | Description |
|-------|------|-----------|-------------|
| `anomalies` | array | EXTENDABLE | Detected anomalies |
| `anomalies[].type` | string | IMMUTABLE | Anomaly type code |
| `anomalies[].severity` | string | IMMUTABLE | "high" / "medium" |
| `anomalies[].message` | string | IMMUTABLE | Human-readable message |
| `anomalies[].details` | object | EXTENDABLE | Additional details |
| `hasAnomaly` | boolean | IMMUTABLE | Has any anomaly |
| `anomalyLevel` | string | IMMUTABLE | "high" / "medium" / "none" |

**Defined Anomaly Types** (v3.2.1):
| Type | Severity | Condition |
|------|----------|-----------|
| `has_stock_not_listed` | high | Has stock but not listed anywhere |
| `stock_not_in_target_warehouse` | medium | Stock not in MAAI/Temp warehouse |
| `listed_no_stock` | high | Listed but no stock |
| `inconsistent_listing` | medium | Partial platform listing |

#### 2.2.5 Observation Signals (v2.2.0+)

| Field | Type | Stability | Description |
|-------|------|-----------|-------------|
| `signals` | object | EXTENDABLE | Observation signal container |
| `signals.platformFact` | object | EXTENDABLE | Platform observation facts |
| `signals.discrepancy` | object | EXTENDABLE | Discrepancy indicators |
| `signals.discrepancyType` | object | EXTENDABLE | Discrepancy type by platform |

### 2.3 Statistics Object (`data.statistics`)

| Field | Type | Stability | Description |
|-------|------|-----------|-------------|
| `total` | number | IMMUTABLE | Total products analyzed |
| `listedCount` | number | IMMUTABLE | Products listed on any platform |
| `unlistedCount` | number | IMMUTABLE | Products not listed anywhere |
| `draftCount` | number | IMMUTABLE | Products in draft status |
| `hasStockCount` | number | IMMUTABLE | Products with stock |
| `noStockCount` | number | IMMUTABLE | Products without stock |
| `anomaliesCount` | number | IMMUTABLE | Products with anomalies |
| `highAnomalyCount` | number | IMMUTABLE | Products with high-severity anomalies |
| `byPlatform` | object | EXTENDABLE | Statistics by platform |
| `byPlatform.{platformId}.listed` | number | IMMUTABLE | Listed count for platform |
| `byPlatform.{platformId}.unlisted` | number | IMMUTABLE | Unlisted count for platform |
| `byPlatform.{platformId}.draft` | number | IMMUTABLE | Draft count for platform |

### 2.4 Summary Object (`data.summary`)

| Field | Type | Stability | Description |
|-------|------|-----------|-------------|
| `totalProducts` | number | IMMUTABLE | Total products analyzed |
| `listedCount` | number | IMMUTABLE | Products listed on any platform |
| `unlistedCount` | number | IMMUTABLE | Products not listed anywhere |
| `anomaliesCount` | number | IMMUTABLE | Products with anomalies |
| `phase2` | object | EXTENDABLE | Phase 2 metrics (v2.1.0+) |
| `phase2.baseUniverseCount` | number | IMMUTABLE | Base universe product count |
| `phase2.byPlatform` | object | EXTENDABLE | Phase 2 metrics by platform |
| `phase2.byPlatform.{platformId}.platformRecordsCount` | number | IMMUTABLE | Platform records count |
| `phase2.byPlatform.{platformId}.matchedCount` | number | IMMUTABLE | Matched records count |
| `phase2.byPlatform.{platformId}.baseUniverseCount` | number | IMMUTABLE | Base universe count |
| `phase2.byPlatform.{platformId}.decisionListingRate` | number | IMMUTABLE | Decision listing rate (0-1) |
| `observationSignals` | object \| null | EXTENDABLE | Observation signal summary (v2.2.0+) |

---

## 3. EXTERNAL CANONICAL COLUMNS

For external export (Excel/Sheet), C005 outputs 25 fixed columns in order:

| # | Key | Label | Group | Type | Visibility |
|---|-----|-------|-------|------|------------|
| 1 | `supplier` | 供應商 | T005 | string | ALL |
| 2 | `pm` | PM | T005 | string | ALL |
| 3 | `brand` | 品牌 | T005 | string | ALL |
| 4 | `model` | 商品型號 | T005 | string | ALL |
| 5 | `erpProductId` | ERP(產品編號) | ERP | string | ALL |
| 6 | `name` | 商品名稱 | T005 | string | ALL |
| 7 | `realCostNoTax` | 真實未稅成本 | Cost | number | OWNER/ADMIN |
| 8 | `costNoTax` | 未稅成本 | Cost | number | OWNER/ADMIN |
| 9 | `costWithTax` | 含稅成本 | Cost | number | OWNER/ADMIN |
| 10 | `marketPrice` | 市價 | Price | number | OWNER/ADMIN |
| 11 | `barcode` | 國際條碼 | T005 | string | OWNER/ADMIN |
| 12 | `platform-momo` | MOMO | Platform | string | ALL |
| 13 | `platform-pchome` | PChome | Platform | string | ALL |
| 14 | `platform-yahoo` | Yahoo | Platform | string | ALL |
| 15 | `platform-shopee-gusense` | Shopee Gusense | Platform | string | ALL |
| 16 | `platform-shopee-katai` | Shopee KATAI | Platform | string | ALL |
| 17 | `stock` | ERP(庫存) | ERP | string | ALL |
| 18 | `t005Status` | 商品狀態 | T005 | string | ALL |
| 19 | `hasAnomaly` | 異常 | Analysis | string | ALL |
| 20 | `anomalyText` | 異常說明 | Analysis | string | ALL |
| 21 | `categoryMajor` | 商品大類 | T005 | string | ALL |
| 22 | `categoryMiddle` | 商品中類 | T005 | string | ALL |
| 23 | `categorySmall` | 商品小類 | T005 | string | ALL |
| 24 | `ownerCompany` | 商品歸屬公司 | Company | string | ALL |
| 25 | `salesCompanies` | 可銷售公司 | Company | string | ALL |

**Visibility Levels**:
- `OWNER`: Business owner
- `ADMIN`: System administrator
- `INTERNAL`: Internal staff
- `VIEWER`: External viewer (cost/price/barcode hidden)

---

## 4. DATA TYPE CONSTRAINTS

### 4.1 String Fields
- All string fields are trimmed
- Empty strings are allowed (not converted to null)
- `barcode`: Leading zeros preserved, type is always string

### 4.2 Number Fields
- `totalStock`, `selectedWarehouseStock`: Integer (>= 0)
- `decisionListingRate`: Float (0.0 - 1.0)
- Cost/Price fields: Number (may have decimals)

### 4.3 Boolean Fields
- `success`, `isListed`, `hasStock`, `hasAnomaly`, `isListedAnywhere`: strict boolean

### 4.4 Null Handling
- `erp`: null when no ERP match found
- `observationSignals`: null when ObservationSignal module not loaded
- Other fields: empty string preferred over null for string types

---

## 5. STABILITY DEFINITIONS

### IMMUTABLE
- Field name, type, and semantic meaning CANNOT be changed
- Any change requires Major version bump (e.g., v1.x.x -> v2.0.0)
- Downstream consumers may hard-code these field names

### EXTENDABLE
- New sub-fields MAY be added
- Existing sub-fields follow IMMUTABLE rules
- Adding new sub-fields requires Minor version bump (e.g., v1.0.x -> v1.1.0)
- Downstream consumers MUST handle unknown sub-fields gracefully

---

## 6. COMPLIANCE DECLARATION

This contract declares the following boundaries:

1. **No S005/V005 Dependency**: C005 output is independent and does not reference S005 (Quote Submission) or V005 (Quote Viewer) data structures.

2. **No T005 Write-Back**: C005 is read-only with respect to T005. Any data written by C005 goes to C005-specific storage (e.g., Listing History sheet).

3. **Platform Agnostic**: Output schema supports all platforms uniformly. Platform-specific logic is encapsulated within `platforms.{platformId}` namespace.

4. **Barcode Integrity**: `barcode` field is always string type, preserving leading zeros. This is enforced at:
   - T005 read (Utils.js line 259)
   - Export formatting (ExternalCanonical.js formatBarcodeForExport)
   - Sheet output (`@STRING@` format)
   - Excel output (single quote prefix)

---

## 7. VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-01-26 | Initial baseline (C005 v3.2.1) |

---

## 8. GOVERNANCE SEAL

```
FROZEN: 2026-01-26
BASELINE: C005 v3.2.1
AUTHORITY: HORUS-GOVERNANCE/C005/C005_OUTPUT_CONTRACT.md
MODIFICATION: Requires Architect approval + version bump
```
