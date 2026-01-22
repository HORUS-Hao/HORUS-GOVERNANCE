# HORUS System Data Layers

## Overview
This document defines the canonical data layer architecture for the HORUS system.

## Layer Hierarchy

```
┌─────────────────────────────────────────┐
│           HORUS-GOVERNANCE              │  ← Policy & Contracts
├─────────────────────────────────────────┤
│           HORUS-FACTS (SSOT)            │  ← Canonical Data
├─────────────────────────────────────────┤
│           HORUS-DERIVED                 │  ← Read-only Derivations
└─────────────────────────────────────────┘
```

## Layer Definitions

### HORUS-GOVERNANCE
- **Role**: Policy documents, ADRs, contracts
- **Write Policy**: Human-authored only
- **Physical Location**: `G:\我的雲端硬碟\HORUS-GOVERNANCE\`
- **Examples**:
  - ADR documents
  - RPC contracts
  - Branch governance rules

### HORUS-FACTS (Single Source of Truth)
- **Role**: Canonical business data
- **Write Policy**: Controlled by designated modules only
- **Physical Location**: Google Sheets (T005, T030, etc.)
- **Modules**:
  | Module | Responsibility |
  |--------|----------------|
  | T005 | Product Master Data |
  | T030 | Margin Simulation Data |
  | E001 | Elife API Data |

### HORUS-DERIVED
- **Role**: Read-only views and comparisons
- **Write Policy**: Read from FACTS, write to internal sheets only
- **Physical Location**: Module-specific sheets
- **Modules**:
  | Module | Source | Output |
  |--------|--------|--------|
  | C005 | T005 | Comparison Results |
  | R020 | T005, External | Price Comparisons |

## Data Flow Rules

### Rule 1: FACTS → DERIVED (One-way)
```
T005 (FACTS) ──read──▶ C005 (DERIVED)
                         │
                         └──write──▶ C005 Internal Sheets
```

### Rule 2: DERIVED Never Writes to FACTS
```
C005 (DERIVED) ──✗──▶ T005 (FACTS)  // FORBIDDEN
```

### Rule 3: Cross-Module Communication via RPC
```
WebApp ──RPC──▶ C005.getT005Data()
                    │
                    └──returns──▶ JSON-serialized payload
```

## Physical Mapping

| Logical Layer | Physical Location | Access Pattern |
|---------------|-------------------|----------------|
| GOVERNANCE | Google Drive folder | Human read/write |
| FACTS | Google Sheets | Module-specific write |
| DERIVED | Google Sheets | Read-only from FACTS |

## Module Registry

| Module ID | Layer | Description |
|-----------|-------|-------------|
| T005 | FACTS | Product Management |
| T030 | FACTS | Margin Simulation |
| C005 | DERIVED | Listing Checker |
| R020 | DERIVED | Price Comparator |
| E001 | FACTS | Elife API |

## Governance Enforcement

- All schema changes require ADR
- RPC contracts documented in module GOVERNANCE files
- Post-push verification required for FACTS modules
