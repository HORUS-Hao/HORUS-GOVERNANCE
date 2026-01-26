# ADR-T005-GOVERNANCE-GAPS-2026-01-22

## Status
PROPOSED

## Source
- Origin: `T005/AUDIT/T005-GOVERNANCE-ALIGNMENT-AUDIT-2026-01-22.md` (in stash)
- Audit Date: 2026-01-22
- Audit Type: Blind Audit vs HORUS-GOVERNANCE 治理宣告

## Summary

T005 治理對齊審計揭露 7 項不一致、11 項治理缺口。
本文件列出缺口標題清單，待 Architect 審閱後決定處置優先序。

## 11 項治理缺口（標題清單）

1. **GAP-01**: D005 唯一寫入宣告 vs T005 GAS 實際寫入衝突
2. **GAP-02**: Schema 欄位數衝突（Canonical 24 欄 vs Main.gs 28 欄）
3. **GAP-03**: T005 欄位命名不一致（中文 vs 英文混用）
4. **GAP-04**: 缺乏欄位層級的寫入權限定義
5. **GAP-05**: T005 與 D005 邊界模糊
6. **GAP-06**: 缺乏 T005 變更審計機制
7. **GAP-07**: T005 狀態欄位語意未正式定義
8. **GAP-08**: 缺乏 T005 資料品質驗證規則
9. **GAP-09**: T005 與 C005 耦合關係未文件化
10. **GAP-10**: 缺乏 T005 歷史版本追溯機制
11. **GAP-11**: T005 治理文件分散於多處

## Decision Required

- [ ] 審閱完整審計報告（需從 stash 取出）
- [ ] 決定各缺口處置優先序
- [ ] 指派負責模組或 Phase

## Decision Owner

**Architect (豪哥)**

## Related Documents
- T005-GOVERNANCE-INDEX.md
- GOV-003-T005-ELIGIBILITY-GATE.md
- ADR-GOV-STASH-DECISION-2026-01-26.md
