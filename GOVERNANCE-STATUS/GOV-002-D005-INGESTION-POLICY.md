# GOV-002｜D005 Platform Ingestion Policy

## Authority
- SSOT: SYS-000-HORUS-GOVERNANCE-CONSTITUTION.md
- Principle: No fake facts. No silent assumptions.

## Purpose
Define how platform listing data becomes FACT-ready and eligible for C005 computation.

## Platforms
- MOMO / PCHOME: FACT_READY (already ingested to Listing_History)
- YAHOO: NOT_INGESTED → target to become FACT_READY after ingestion pipeline + validation
- SHOPEE: OBSERVATION → remains non-computing until schema+mapping+truth source are verified

## Non-Negotiables
- Only truthful inputs (platform backend export / verified lists / trusted sources)
- Append-only facts (no overwrite)
- Clear provenance fields: source, ingest_run_id, fact_date, platform_code

## Stages
1) RAW_CAPTURE (raw export or raw API payload)
2) NORMALIZE (schema mapping, deterministic transform)
3) VALIDATE (schema validation + required fields)
4) FACT_READY (eligible to write Listing_History FACT)
5) COMPUTE_ELIGIBLE (optional gate checks; must be disclosed if disabled)

## Governance Disclosure
If a platform is NOT_INGESTED / OBSERVATION, it must:
- Appear in UI as "status only"
- Not participate in numeric calculation
