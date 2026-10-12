# NeuraShield SG stress test

## Set A (diagnostic)

Headline accuracy (excluding ambiguous): 56/56 (100.0%)

| Group | Correct | Accuracy |
|---|---|---|
| legit-hard | 18/18 | 100.0% |
| scam | 16/16 | 100.0% |
| grooming | 10/10 | 100.0% |
| format | 12/12 | 100.0% |

False alarms on legitimate chats: 0/24
Harmful chats flagged at all: 32/32 (0 flagged under the wrong type)

Ambiguous by design (reported, not scored):
- `A-L04` Forwarded police advisory: expected legit, got scam (risk 64)
- `A-L05` Parent: secrecy + home alone: expected legit, got grooming (risk 78)
- `A-L21` Friend quoting a scam as a joke: expected legit, got legit (risk 31)

Misses: none

Slowest single analysis: 33.1 ms

## Set B (held out, never used for tuning)

Headline accuracy (excluding ambiguous): 33/38 (86.8%)

| Group | Correct | Accuracy |
|---|---|---|
| legit-hard | 16/16 | 100.0% |
| scam | 7/12 | 58.3% |
| grooming | 10/10 | 100.0% |

False alarms on legitimate chats: 0/16
Harmful chats flagged at all: 17/22 (0 flagged under the wrong type)

Misses:
- `B-S02` expected scam, got legit. risk 0 LOW; signals: none
- `B-S05` expected scam, got legit. risk 21 LOW; signals: Financial request
- `B-S07` expected scam, got legit. risk 33 LOW; signals: Gift or money lure, Authority
- `B-S08` expected scam, got legit. risk 0 LOW; signals: none
- `B-S11` expected scam, got legit. risk 33 LOW; signals: Financial request, PayNow or local transfer request

Slowest single analysis: 0.5 ms
