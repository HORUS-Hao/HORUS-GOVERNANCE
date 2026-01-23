# C005 Listing Eligibility Implementation (Phase 2)

## Status: SPECIFICATION ONLY (Not Implemented)

## Purpose
Define how "decision-grade" and "strategy-grade" rates are computed.

## Phase 1 (Current - Observation Only)
- Raw observation rate = listed / total_observed
- No eligibility filtering
- All products in D005 are counted

## Phase 2 (Decision-Grade) - TO BE IMPLEMENTED

### Inputs
- T005 fields:
  - status (啟用/停用)
  - owner_company
  - brand
- ERP fields:
  - 可售數量 (stock_qty)
  - 供貨狀態 (supply_status)
- Platform observation:
  - is_listed (from D005)

### Eligibility Rules (Draft)
```
eligible = (
  T005.status = '啟用' AND
  ERP.stock_qty > 0 AND
  ERP.supply_status = '正常'
)
```

### Outputs
- eligible_total: 符合上架資格的商品總數
- eligible_listed: 符合資格且已上架的商品數
- decision_grade_rate = eligible_listed / eligible_total

## Phase 3 (Strategy-Grade) - TO BE IMPLEMENTED

### Additional Inputs
- Strategy Mapping SSOT (C005-Strategy-Mapping-SSOT)
  - strategy_scope (ALLOW/DENY/OPTIONAL)
  - effective_start_date / effective_end_date

### Strategy Universe Rules
```
strategy_universe = eligible AND (
  strategy_scope = 'ALLOW' OR
  strategy_scope = 'OPTIONAL'
)
```

### Outputs
- strategy_universe_count: 策略母集合商品數
- strategy_listed: 策略母集合中已上架數
- strategy_grade_rate = strategy_listed / strategy_universe_count

## Implementation Notes
- Phase 2/3 only compute rates; do not modify D005
- Historical FACT not backfilled
- Rates displayed in Mail only when data available (otherwise '-')

## Dependencies
- T005 Canonical (READ-ONLY)
- ERP data source (READ-ONLY)
- C005-Strategy-Mapping-SSOT (READ-ONLY, Phase 3)

## Governance
- This spec requires Architect approval before implementation
- No inference, no guessing, no backfill
