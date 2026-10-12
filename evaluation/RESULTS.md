# NeuraShield SG evaluation results

Dataset: 100 conversations (50 legitimate, 25 scam, 25 grooming), 44 in Singlish, 56 in plain English.

**Overall three-class accuracy: 87/100 (87.0%)**

## Per class

| Class | Precision | Recall | F1 | TP | FP | FN |
|---|---|---|---|---|---|---|
| legit | 79.4% | 100.0% | 88.5% | 50 | 13 | 0 |
| scam | 100.0% | 48.0% | 64.9% | 12 | 0 | 13 |
| grooming | 100.0% | 100.0% | 100.0% | 25 | 0 | 0 |

## Confusion matrix (rows actual, columns predicted)

| | legit | scam | grooming |
|---|---|---|---|
| legit | 50 | 0 | 0 |
| scam | 13 | 12 | 0 |
| grooming | 0 | 0 | 25 |

## Harmful vs safe, against a keyword blocklist

| Metric | Keyword blocklist | NeuraShield SG |
|---|---|---|
| Accuracy | 68.0% | 87.0% |
| Precision | 95.0% | 100.0% |
| Recall | 38.0% | 74.0% |
| False positives (of 50 legit) | 1 | 0 |

## Register

- Singlish: 44 conversations, 86.4%
- Plain English: 56 conversations, 87.5%

## Held-out check (not in the dataset)

- PASS `legit-brand-money`: expected legit, got legit (risk 0)
- PASS `scam-reworded`: expected scam, got scam (risk 75)
- PASS `grooming-soft`: expected grooming, got grooming (risk 78)
- PASS `legit-singlish`: expected legit, got legit (risk 0)

## Misclassified

- `scam02`: scam predicted as legit (risk 27; signals: Suspicious link)
- `scam04`: scam predicted as legit (risk 0; signals: none)
- `scam06`: scam predicted as legit (risk 15; signals: Authority)
- `scam07`: scam predicted as legit (risk 23; signals: Untraceable payment)
- `scam10`: scam predicted as legit (risk 18; signals: Suspicious link)
- `scam12`: scam predicted as legit (risk 19; signals: Secrecy)
- `scam13`: scam predicted as legit (risk 27; signals: Suspicious link, Singlish reassurance or push, Singlish register)
- `scam14`: scam predicted as legit (risk 33; signals: Account threat, Fear)
- `scam17`: scam predicted as legit (risk 0; signals: none)
- `scam20`: scam predicted as legit (risk 24; signals: Fake giveaway script, Singlish register)
- `scam21`: scam predicted as legit (risk 32; signals: Financial request, False reassurance)
- `scam23`: scam predicted as legit (risk 33; signals: Urgency, False reassurance, Singlish register)
- `scam25`: scam predicted as legit (risk 0; signals: none)
