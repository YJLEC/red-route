# 数忆红途

面向游客的河北红色旅游互动指南，首版覆盖河北博物院红色展厅、西柏坡革命旧址和狼牙山。产品边界见 `CONSTRAINTS.md`，实施与验收计划见 `PLAN.md`。

## 常用命令

```powershell
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

- `pnpm dev`：启动本地开发服务；
- `pnpm lint`：检查代码规范和常见错误；
- `pnpm typecheck`：检查 TypeScript 类型；
- `pnpm build`：生成 Cloudflare Pages 可托管的 `dist/` 静态文件；
- `pnpm preview`：在本地检查生产构建。

## 目录

- `src/`：网站代码和配置化页面数据；
- `public/`：无需编译的地图与公开静态资源；
- `sources/research/`：网页资料的本地摘录与研究笔记；
- `sources/reference.txt`：事实来源索引；
- `sources/images/IMAGE_LEDGER.csv`：图片来源、使用条件和用途台账；
- `docs/`：技术决策、研究结论、部署和维护说明；
- `OPEN_QUESTIONS.md`：Goal 期间暂不打断推进的待决事项。

## 部署基线

Cloudflare Pages 的构建命令为 `pnpm build`，输出目录为 `dist`。项目不需要后端服务。`public/_redirects` 已提供详情路径刷新规则，完整部署、内容更新与图片替换流程见 `docs/DEPLOYMENT.md`。
