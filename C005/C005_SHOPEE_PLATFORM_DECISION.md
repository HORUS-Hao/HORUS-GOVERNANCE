# C005 Shopee Platform Decision (FINAL)

## Decision
- Platforms are treated as independent:
  - SHOPEE_KATAI
  - SHOPEE_GUSENSE

## Rationale
- Operational responsibility is per store, not per marketplace
- Aligns with C005 Web, Listing Consumer, and Diff logic
- Avoids platform/mall double aggregation ambiguity

## Mail Policy
- Shopee TOTAL row is NOT displayed
- Each store is a first-class platform

## Status
LOCKED – Phase 2 canonical decision
