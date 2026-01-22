# R021 A2 Block Sorting Policy

| Field | Value |
|-------|-------|
| Policy ID | VIEW-R021-A2-001 |
| Module | R021 (Observer Mail) |
| Block | A2 - Cross-Platform Price Comparison |
| Effective Date | 2026-01-03 |
| Status | ACTIVE |

---

## Policy Type

**View Policy** - This document governs presentation layer behavior only.

This is NOT a Data Contract change. The underlying Fact data remains unchanged.

---

## Sorting Rule

### Primary Sort
- **Field**: Price Difference (absolute value)
- **Direction**: Descending (largest difference first)
- **Formula**: `Math.abs(momoPrice - pchomePrice)`

### Secondary Sort (Tie-breaker)
- **Field**: Brand
- **Direction**: Ascending (A-Z)
- **Comparison**: Case-insensitive string comparison

### Tertiary Sort (Tie-breaker)
- **Field**: Model
- **Direction**: Ascending (A-Z)
- **Comparison**: Case-insensitive string comparison

---

## Rationale

1. **Business Priority**: Items with larger price gaps require more urgent attention
2. **Actionability**: Sorting by price difference highlights arbitrage opportunities
3. **Consistency**: Brand/Model secondary sort provides stable ordering when price differences are equal

---

## Implementation Reference

File: `R021_MarketIntel_Email.gs`
Version: v6.3.0+

```javascript
// Sort by price difference (descending), then brand → model
var sortedItems = crossPlatformIndex.slice().sort(function(a, b) {
  var diffA = Math.abs((a.momoPrice || 0) - (a.pchomePrice || 0));
  var diffB = Math.abs((b.momoPrice || 0) - (b.pchomePrice || 0));
  if (diffA !== diffB) return diffB - diffA;  // Larger difference first
  var brandA = String(a.brand || '').toUpperCase();
  var brandB = String(b.brand || '').toUpperCase();
  if (brandA !== brandB) return brandA.localeCompare(brandB);
  var modelA = String(a.model || '').toUpperCase();
  var modelB = String(b.model || '').toUpperCase();
  return modelA.localeCompare(modelB);
});
```

---

## Governance Notes

- View Policy changes do NOT require Data Contract review
- View Policy changes do NOT affect downstream data consumers
- View Policy is presentation-layer only; Fact semantics are preserved
