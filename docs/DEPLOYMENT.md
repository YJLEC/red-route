# 部署与维护

## Cloudflare Pages 部署

本项目是纯静态 React 网站，不需要后端、数据库或运行时环境变量。

Cloudflare Pages 项目设置：

- Framework preset：`Vite`
- Build command：`pnpm build`
- Build output directory：`dist`
- Root directory：仓库根目录
- Node.js：建议 20 或更高版本

`public/_redirects` 会被复制到构建产物，用于把 `/destination/...` 等直接访问请求交给单页应用处理。部署后必须分别直接打开并刷新：

- `/`
- `/destination/hebei-museum`
- `/destination/xibaipo`
- `/destination/langya-mountain`

`public/_headers` 会为 Pages 增加基础安全响应头，并对带内容哈希的构建资源使用长期缓存。不要在 Cloudflare Pages 环境变量中配置本项目不需要的密钥。

自定义域名在 Cloudflare Pages 的 Custom domains 中绑定，不需要改代码。网站不请求定位，也不保存游客数据。

## 发布前检查

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

在桌面和手机尺寸检查首页四地地图、四个详情页、路线点位联动、菜单、外部来源链接和高德搜索入口。构建产物中应存在 `dist/_redirects` 和 `dist/data/hebei.geojson`。

公开仓库还应在推送前检查：

- `git status --ignored` 中的 `.env*`、`.dev.vars*`、`.wrangler/` 和本地 `sources/summary/` 没有被跟踪；
- Git 提交作者信息不包含个人邮箱；
- `dist/`、`node_modules/` 和本地预览日志没有进入仓库；
- 通过 `git grep` 检查常见 token、私钥、邮箱、手机号和本机绝对路径特征。

## 内容更新

目的地事实、路线点位、真实交通节点、地图设施、图片组、准备事项、来源与核验日期统一维护在 `src/data/destinations.ts`。页面组件不应直接写入某个目的地的事实内容。

更新易变化信息时：

1. 先在景区官网、场馆官网或交通运营方页面核验；
2. 更新对应内容、来源 URL 和 `verifiedAt`；
3. 同步更新 `sources/reference.txt` 中的研究记录；
4. 重新完成构建和页面检查。

抵达方式的来源不是只在页面末尾集中展示。每条 `arrivals` 数据都必须同时维护 `sourceLabel`、指向具体内容页的 `sourceUrl` 和 `verifiedAt`；交通关系图的 `travelMap` 也必须维护 `sourceLabel` 与 `sourceUrl`。不得用机构网站首页替代可以直接核验该条信息的内容页。

## 图片替换

当前发布版的轮播全部使用项目自有多图占位状态。替换网络图片前，必须先在 `sources/images/IMAGE_LEDGER.csv` 记录原始页面、直接资源地址、发布者、作者、使用条件、取得日期、用途和本地文件名。只有状态明确为可发布的图片才能进入 `public/` 或打包资源目录。将图片写入对应 `GalleryItem.src` 后，自动播放、前后切换、暂停和加载失败降级均无需改组件。

未发现公开复用许可、只用于研究或仍需授权的图片不得复制到发布目录。图片加载失败时仍应保留可理解的占位状态和替代文本。

## 地图与路线边界

- 河北地图数据位于 `public/data/hebei.geojson`，使用真实地市边界和目的地坐标，但不提供道路导航精度；
- 三地内部导览和抵达交通图依据官方导览、交通资料和公开地理关系重绘，现场仍以景区开放标识和实时导航为准；
- 每张内部导览图都在图内提供 `guideMapSource` 原始资料入口，用户可以直接打开官方导览页或地图地点页交叉核验；
- `travelMap` 中的运动图标表达交通方式和路线关系，不代表车辆实时位置；只有来源确认存在的交通方式才能加入；
- 高德链接仅打开公开搜索页，不使用 API key，不请求浏览器定位；
- 公交班次、票价、开放时间等不能在没有再次核验时作为实时承诺。
