# C005 SHOPEE Merge Policy (Phase 1)

## 現況
- FACT 聚合層（Mail）合併 SHOPEE
- WEB 層（C005 Web）維持 KATAI / GUSENSE 拆分

## 原因
Phase 1 僅檢查資料存在與即時性，不進行賣場決策。

## 約束
- Mail 不呈現賣場拆分
- 決策與分析請以 C005 Web 為準

## Phase 2
FACT 與 Mail 必須拆分賣場。
