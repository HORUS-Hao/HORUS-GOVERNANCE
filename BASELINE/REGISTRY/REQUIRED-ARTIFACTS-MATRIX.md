# Required Artifacts Matrix

## 矩陣說明

定義各類型模組對各 Artifact 的要求等級。

## 矩陣

| Artifact | T (Transform) | C (Checker) | R (Report) | P (Producer) |
|----------|---------------|-------------|------------|--------------|
| README | MUST | MUST | MUST | MUST |
| GOVERNANCE | MUST | MUST | SHOULD | MUST |
| DATA-FLOW | MUST | SHOULD | MUST | MUST |
| DECISIONS | SHOULD | MUST | OPTIONAL | SHOULD |
| EXCEPTIONS | OPTIONAL | SHOULD | OPTIONAL | SHOULD |
| CHANGELOG | SHOULD | OPTIONAL | SHOULD | OPTIONAL |

## 等級定義

- **MUST** — 必要，缺少即判定為不完整
- **SHOULD** — 建議，缺少會降低評分
- **OPTIONAL** — 選擇性，不影響完整性判定
