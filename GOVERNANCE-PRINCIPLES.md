# HORUS Governance Principles

## 1. Authority
HORUS-GOVERNANCE/ is the single source of truth for:
- Data Contracts
- Scheduler Governance
- Fact vs View boundaries
- View Policies (presentation layer rules)
- Canonical rules and prohibitions

## 2. Module Repositories
Any _GOVERNANCE, _FACT_REGISTRY, or similar folders
inside module repositories are working copies only
and hold no decision authority.

## 3. AI & Agent Rule
All AI agents (Claude, Cursor, etc.) must defer to
HORUS-GOVERNANCE when resolving rules, contracts, or boundaries.
Conversation context or AI memory must not override files.

## 4. Governance Categories

| Category | Location | Scope |
|----------|----------|-------|
| Data Contracts | DATA_CONTRACTS/ | Fact schema, field semantics |
| Scheduler Governance | DATA_CONTRACTS/{module}/ | Trigger timing, dependencies |
| View Policies | VIEW_POLICIES/ | Presentation layer only |

**Important**: View Policy changes do NOT require Data Contract review.
View Policies govern display/sorting/formatting without altering Fact semantics.
