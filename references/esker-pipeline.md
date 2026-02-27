# Esker Pipeline Reference

## CRITICAL: Do NOT Use HubSpot's dealstage Enumeration

HubSpot's `get_properties` for `dealstage` returns a flat list of 60+ stages across 10+ pipelines with **NO pipeline association**. Stages like "Discovery" appear multiple times with different IDs belonging to different pipelines. If you pick from that list, you will almost certainly select a stage from a dead or wrong pipeline, and **HubSpot will silently move the deal to that pipeline** without warning.

**ALWAYS use the hardcoded stage IDs below. These are the ONLY valid stages for Esker deals.**

---

## Pipeline: Esker

**Pipeline ID:** `753622169`

| Stage | Stage ID | Sort Order |
|-------|----------|------------|
| Interest Generation | `1096541707` | 1 |
| Discovery | `1096541708` | 2 |
| Needs Analysis | `1096541709` | 3 |
| Solution Overview | `1096541710` | 4 |
| Committed | `1096541711` | 5 |
| Closed Won | `1097521504` | 6 |
| Closed Lost | `1096541713` | 7 |

---

## How to Update a Deal Stage

When using `manage_crm_objects`, **ALWAYS set both `dealstage` AND `pipeline`**:

```json
{
  "objectType": "deals",
  "objectId": 12345,
  "properties": {
    "dealstage": "1096541709",
    "pipeline": "753622169"
  }
}
```

If you set `dealstage` without `pipeline`, HubSpot may reassign the deal to whichever pipeline first contains a stage with that ID. Always include both.

---

## Stage Movement Rules

1. **Forward progression is normal.** Interest Generation → Discovery → Needs Analysis → Solution Overview → Committed → Closed Won.
2. **Backward moves are valid but unusual.** If proposing a backward move (e.g., Solution Overview → Discovery), flag it to the user and explain why.
3. **Closing a deal is significant.** Always confirm with the user before setting Closed Won or Closed Lost.
4. **Stage mapping from call context:**
   - First meeting / introductory call → Interest Generation or Discovery
   - Discovery call with pain identification → Discovery or Needs Analysis
   - Demo or solution walkthrough → Solution Overview
   - Verbal commitment or PoV agreement → Committed
   - Signed contract → Closed Won
   - Prospect explicitly passes → Closed Lost
