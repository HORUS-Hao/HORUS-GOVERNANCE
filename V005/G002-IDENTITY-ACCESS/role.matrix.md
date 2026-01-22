# Role Matrix — V005

## 0. 文件定位
- 本文件属于 Tier 1（Identity & Authority Governance）
- 适用于 V005 模组
- 为裁定文件（Normative），非说明文件
- 工程与 AI 行为必须遵守

## 1. 角色定义（固定集合，不得扩充）
- OWNER
- OPERATOR
- VIEWER

## 2. 行为定义（固定集合，不得新增）
- VIEW
- CREATE
- EDIT_DRAFT
- SUBMIT
- APPROVE
- STAMP_SELECT
- STAMP_APPLY
- EXPORT

## 3. Scope 定义
- OWN_COMPANY
- ALL_COMPANIES（默认禁止）

## 4. Role × Action × Scope 矩阵

### OWNER

| Action        | Scope       | Allowed |
|---------------|-------------|---------|
| VIEW          | OWN_COMPANY | YES     |
| CREATE        | OWN_COMPANY | YES     |
| EDIT_DRAFT    | OWN_COMPANY | YES     |
| SUBMIT        | OWN_COMPANY | YES     |
| APPROVE       | OWN_COMPANY | YES     |
| STAMP_SELECT  | OWN_COMPANY | YES     |
| STAMP_APPLY   | OWN_COMPANY | YES     |
| EXPORT        | OWN_COMPANY | YES     |

### OPERATOR

| Action        | Scope       | Allowed |
|---------------|-------------|---------|
| VIEW          | OWN_COMPANY | YES     |
| CREATE        | OWN_COMPANY | YES     |
| EDIT_DRAFT    | OWN_COMPANY | YES     |
| SUBMIT        | OWN_COMPANY | YES     |
| APPROVE       | OWN_COMPANY | NO      |
| STAMP_SELECT  | OWN_COMPANY | YES     |
| STAMP_APPLY   | OWN_COMPANY | NO      |
| EXPORT        | OWN_COMPANY | YES     |

### VIEWER

| Action        | Scope       | Allowed |
|---------------|-------------|---------|
| VIEW          | OWN_COMPANY | YES     |
| CREATE        | OWN_COMPANY | NO      |
| EDIT_DRAFT    | OWN_COMPANY | NO      |
| SUBMIT        | OWN_COMPANY | NO      |
| APPROVE       | OWN_COMPANY | NO      |
| STAMP_SELECT  | OWN_COMPANY | NO      |
| STAMP_APPLY   | OWN_COMPANY | NO      |
| EXPORT        | OWN_COMPANY | NO      |

## 5. 明确禁止事项（Explicit Prohibitions）
- 所有角色：Scope = ALL_COMPANIES → 禁止
- OPERATOR / VIEWER：APPROVE → 禁止
- VIEWER：除 VIEW 外全部禁止

## 6. 生效声明
本文件自建立起即为 V005 角色与权限裁定依据。
任何工程实现、人工核准或 AI 行为不得违背。
