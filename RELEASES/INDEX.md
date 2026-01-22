# HORUS Releases Index

**說明**：此目錄為唯一封版文件入口
**最後更新**: 2026-01-12

---

## S005 / V005

### v2.3 FREEZE（權威）

| 文件 | 路徑 | 狀態 |
|------|------|------|
| **封版規格** | `S005_V005/v2.3_FREEZE/S005_V005_RELEASE_v2.3_FREEZE.md` | **權威** |
| 管理者操作手冊 | `S005_V005/v2.3_FREEZE/HANDOFF/S005_V005_ADMIN_HANDOFF_v2.3.md` | 交付素材 |
| 操作手冊 Word | `S005_V005/v2.3_FREEZE/HANDOFF/S005_V005_HANDOFF_v2.3_操作手冊.docx` | 交付素材 |
| 簡報 | `S005_V005/v2.3_FREEZE/HANDOFF/S005_V005_HANDOFF_v2.3_簡報.pptx` | 交付素材 |

---

## 版本定義規則

### v2.3 的意義

| 項目 | 說明 |
|------|------|
| **是** | 系統狀態 / 功能 / 治理封版 |
| **不是** | Code.gs semantic version |
| **不是** | Deployment ID |

**允許 code base 為 v2.1.x**，只要功能行為符合 v2.3 FREEZE 規格即可。

---

## 衝突解決規則

**若 GOVERNANCE 文件與 Code / Deployment 衝突，以 RELEASE 權威文件為準。**

| 情境 | 解決方式 |
|------|----------|
| 其他文件版本與 RELEASE 不符 | 以 RELEASE 為準 |
| Code.gs 版本不是 v2.3 | 允許，不構成衝突 |
| Deployment ID 變更 | RELEASE 文件僅供參考 |

---

## 文件規範

1. 所有封版文件必須放置於此目錄
2. 文件命名格式：`MODULE/vX.X_TYPE/...`
3. **權威文件**為唯一規格來源，不得有衝突版本
4. 交付用文件為輔助說明，以權威文件為準
5. 其他 GOVERNANCE 文件應引用權威文件，不各自宣稱版本

---

*建立日期：2026-01-11*
*更新日期：2026-01-12（版本引用規則補充）*
