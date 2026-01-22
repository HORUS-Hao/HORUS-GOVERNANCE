# STAMPS - 印章治理資產

**管理日期**：2026-01-09
**資產類型**：Governance Asset（治理資產）
**版本**：v0（Company Stamp Only）

---

## 重要聲明

> **此資料夾僅供治理與人工管理使用，程式碼不得依賴此資料夾路徑。**

---

## 系統存取規則（Runtime）

| 規則 | 說明 |
|------|------|
| **唯一正確方式** | 透過 `Stamp_Registry.stamp_file_id` 取得印章 |
| **API 呼叫** | `DriveApp.getFileById(stamp_file_id)` |
| **禁止行為** | 依資料夾路徑搜尋、依公司名稱推導路徑、依檔名判斷 |

---

## 檔案命名裁定（非常重要）

> **系統完全不認檔名，只認 `stamp_file_id`（Drive File ID）。**

| 項目 | 規則 |
|------|------|
| 檔名 | **無系統意義**，可任意命名 |
| 中文檔名 | ✅ 可以保留（例如 `荷魯斯國際有限公司 發票章.png`） |
| 重新命名 | ✅ 允許，不影響系統 |
| 移動位置 | ✅ 允許，不影響系統 |
| **唯一不能動的** | `stamp_file_id`（Drive File ID）|

---

## 資料夾結構

```
STAMPS/
├── 00-README/                  ← 治理文檔
│   └── README.md
├── 10-COMPANY/                 ← 公司章（v0 上線）
│   ├── HORUS/
│   │   ├── ACTIVE/             ← 使用中的印章
│   │   └── ARCHIVE/            ← 歷史歸檔
│   ├── DAPANDA/
│   │   ├── ACTIVE/
│   │   └── ARCHIVE/
│   ├── MAAI/
│   │   ├── ACTIVE/
│   │   └── ARCHIVE/
│   └── _TEMPLATE/              ← 新公司模板
└── 20-PERSONAL/                ← 個人章（v0 預留，未啟用）
    ├── INTERNAL/               ← Internal User 個人章
    │   ├── ACTIVE/
    │   └── ARCHIVE/
    └── DISABLED/               ← 已停用的章
```

---

## 欄位說明

| 欄位 | 狀態 | 說明 |
|------|------|------|
| `Stamp_Registry.stamp_file_id` | **Active** | 唯一有效的印章識別欄位 |
| `Company_Profile.stamp_file_id` | **Sync Source** | 同步來源（初始化用） |
| `seal_file_id` | **LEGACY** | 舊版欄位，不得使用 |

---

## 更換印章流程

1. 上傳新印章檔案至對應公司的 `ACTIVE/` 資料夾
2. 取得新檔案的 File ID
3. 更新 `Stamp_Registry` 表的 `stamp_file_id` 欄位
4. 將舊檔移至同公司的 `ARCHIVE/` 資料夾歸檔
5. （重要）移動檔案不影響系統運作，因為系統只認 `stamp_file_id`

---

## v0 限制說明

| 項目 | 狀態 |
|------|------|
| 公司章 | ✅ 支援 |
| 個人章 | ⏸ 程式碼就緒，未啟用 UI |
| External + 個人章 | ❌ Hard Gate 禁止 |

詳見：`FUTURE-AUTH/PERSONAL-STAMP-BLUEPRINT.md`

---

*此資料夾由治理團隊維護，變更需經 Architect 核准。*
