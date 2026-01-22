# GOV-UAG — User Access Gate (Pattern)

> **Status**: Active (Phase 3 – SOFT-ENFORCEMENT)
> **Reference Implementation**: C020-UAG-QUERY (deployment @124)
> **Date**: 2026-01-16

---

## Phase

**Phase 3 – SOFT-ENFORCEMENT (Fail-Closed)**

All access decisions are enforced against the Canonical User Registry.
Users not in registry are denied by default.

---

## Purpose

Define a reusable, cross-module governance pattern to make consistent access decisions based on user context and policy.

---

## Scope

UAG is an **access decision layer only**. It must not modify business state machines or module workflows.

**Decision Types:**
- `ALLOW` — Full access granted
- `DENY` — Access blocked
- `READ_ONLY` — Limited access (view only)
- `REDIRECT` — Redirect to alternative path

---

## Contract (Inputs)

| Field | Required | Description |
|-------|----------|-------------|
| `user.email` | Yes | Google account email |
| `user.domain` | No | Email domain (derived) |
| `user.company_code` | Preferred | Company identifier |
| `user.company_name` | Fallback | Company name (if code unavailable) |
| `user.role` | No | `ADMIN` / `VIEWER` / etc. |
| `user.status` | No | `ACTIVE` / `DISABLED` / `PENDING` |

---

## Contract (Outputs)

| Field | Required | Description |
|-------|----------|-------------|
| `decision` | Yes | `ALLOW` / `DENY` / `READ_ONLY` / `REDIRECT` |
| `reason_code` | Yes | Machine-readable reason |
| `debug_context` | No | Non-sensitive debug info only |

**Prohibited in output:**
- Passwords, tokens, secrets
- Full user records
- Internal system paths

---

## Feature Flag

Pattern: `<MODULE>_USER_GOV_ENABLED`

| Module | Flag | Default |
|--------|------|---------|
| C020 | `C020_USER_GOV_ENABLED` | `"1"` (enabled) |

---

## Policy Source

Read-only policy from Canonical User Registry:
- **C020**: `C020_USER_ACCESS` sheet

Policy is **declarative** — no runtime mutation allowed.

---

## Access Decision Rules (Phase 3)

| Scenario | Decision | Reason Code |
|----------|----------|-------------|
| User NOT FOUND in Canonical Registry | `DENY` | `NOT_FOUND` |
| `status = DISABLED` | `DENY` | `DISABLED` |
| `status = ACTIVE` | `ALLOW` | `ACTIVE` |
| `status = PENDING` | `READ_ONLY` or `REDIRECT` | `PENDING` |
| Empty/undefined status | `DENY` | `INVALID_STATUS` |
| Policy read failure | `DENY` | `POLICY_ERROR` |

**Canonical Status Values:**
```
ACTIVE
DISABLED
PENDING
```
No other values permitted.

---

## Explicit Prohibitions

1. **No runtime auto-registration** — Users must be manually added to registry
2. **No runtime role/status mutation** — Gate is read-only
3. **No cross-company bypass** — Each company's policy is isolated
4. **No UI-layer governance logic** — All decisions must be centralized in Gate
5. **No bypass of mail gate / state machine controls**
6. **No fallback ALLOW for NOT FOUND** — Phase 3 enforcement

---

## Naming / Coding Convention

| Type | Pattern |
|------|---------|
| Pattern | `GOV-UAG` |
| Reference Implementation | `C020-UAG-QUERY` |

**Examples (Future Modules):**

| Module | Instance Name | Purpose |
|--------|---------------|---------|
| S005 | `S005-UAG-SUBMIT` | Submission gate |
| V005 | `V005-UAG-VIEW` | View permission gate |
| R020 | `R020-UAG-CRAWL` | Crawler access gate |
| T005 | `T005-UAG-EDIT` | Edit permission gate |

---

## Rollback Procedure

Set `<MODULE>_USER_GOV_ENABLED = "0"` to disable enforcement.
When disabled: NOT FOUND users will be allowed (Phase 2 behavior).

---

## Phase 3 Boundary

### Allowed

1. **Contract stabilization** — Shared input/output schema across modules
2. **Policy source abstraction** — Shared registry (still declarative + read-only)
3. **Fail mode formalization** — Explicit handling for missing/invalid policy

### Forbidden

1. Dynamic user creation or self-serve onboarding without explicit governance
2. Runtime role/status changes
3. Any path that bypasses mail gate / state machine
4. Governance logic embedded into UI/business modules

---

## Reference Implementation Status

**C020 v7.0.0** (deployment @124):
- Runtime gate controlled by flag `C020_USER_GOV_ENABLED="1"`
- When enabled: **Fail-Closed** enforcement active
- Gate code enforces Canonical User Registry

**Files:**
- `C020_UserAccess.js` — Backend governance module
- `C020_Index.html` — Frontend gate integration

---

## Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-16 | 2.0.0 | Upgrade to Phase 3 SOFT-ENFORCEMENT (Fail-Closed) |
| 2026-01-15 | 1.0.0 | Initial GOV-UAG pattern definition |

---

**END OF GOV-UAG/User-Access-Gate.md**
