<div align="center">

<h1>NGEN Hello Kexie Space</h1>

![GitHub Release](https://img.shields.io/github/v/release/FishCat233/ngen-hello-kexie-space) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/FishCat233/ngen-hello-kexie-space/total)

<h5>桂电三院科协新版本主页.</h5>

</div>

## 技术栈

Vue3 · TypeScript · Vite · Tailwind CSS · Pinia · vue-router · remark + remark-gfm · DOMPurify · lucide-vue-next

## 开发

```bash
git clone https://github.com/FishCat233/ngen-hello-kexie-space.git
pnpm install
pnpm run dev
```

## 内容修改指南

部门介绍、获奖信息等稳定内容仍在 `src/data/` 目录下。成员、项目和展廊内容由 PocketBase CMS 提供，生产环境直接在 `/_/` 管理后台修改，无需重新构建官网。

### 数据文件一览

| 文件                      | 对应页面区域 | 说明                                                                              |
| ------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `src/data/kexie.ts`       | Hero 区域    | 科协成立日期，修改 `KEXIE_FOUNDING_DATE` 即可更新计时器                           |
| `src/data/departments.ts` | 部门介绍区域 | 五个部门的名称、描述、图标类型、可选的部门主页链接                                |
| `src/data/members.ts`     | 成员展示区域 | CMS 不可用时的静态兜底数据，以及初始导入数据                                      |
| `src/data/projects.ts`    | 项目展示区域 | CMS 不可用时的静态兜底数据，以及初始导入数据                                      |
| `src/data/awards.ts`      | 获奖展示区域 | 竞赛名称、各级别获奖数量、获奖人员名单。`awardLevelColors` 控制奖牌颜色           |
| `src/data/gallery.ts`     | 展廊区域     | CMS 不可用时的静态兜底数据；`categories` 数组控制分类筛选项                       |
| `src/data/comments.ts`    | 留言区域     | 从 GitHub Issues API 拉取评论数据（`fetchComments`），`formatDate` 处理时间格式化 |

### 修改示例

**添加新成员** — 生产环境在 PocketBase 管理后台的 `members` 集合中创建记录。开发环境也可以编辑 `src/data/members.ts` 更新静态兜底数据：

```ts
{
  avatar: 'https://github.com/用户名.png',
  nickname: '你的昵称',
  grade: '2025级',
  direction: '前端开发',
  role: '25级多媒体部成员',
  themeColor: '#6b9de2',
  motto: '兴趣使然的 Programmer.',      // 可选
  links: [
    { title: 'Github', url: 'https://github.com/用户名' },
    { title: 'Blog', url: 'https://xxx.com' },  // 可选
  ],
}
```

**添加新项目** — 生产环境在 PocketBase 管理后台的 `projects` 集合中创建记录，并用 `kind` 区分 `featured`、`demo` 和 `competition`。

**添加展廊卡片** — 生产环境在 PocketBase 管理后台的 `gallery` 集合中创建记录。`type` 可选 `image`、`iframe`、`link`，图片可以使用 PocketBase 文件字段或原有 `/gallery/` 路径。

### 图片资源

- 展廊封面图片：放在 `public/gallery/`，通过 `/gallery/xxx.webp` 引用
- 其他静态资源同样放在 `public/` 目录下

### 学习方向文档

参见 [docs/direction-docs.md](./docs/direction-docs.md)。

## 贡献

参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署

### Docker Compose

Release 会自动构建官网镜像和 PocketBase 镜像。PocketBase 的 schema migration 已经打进镜像，服务器不需要 clone 仓库、安装 Node.js、构建项目或下载迁移文件。

服务器首次部署只需要 Compose 文件和持久化目录：

```bash
mkdir -p pocketbase/pb_data
curl -fsSL \
  https://github.com/FishCat233/ngen-hello-kexie-space/releases/latest/download/docker-compose.yaml \
  -o docker-compose.yaml

docker compose pull
docker compose up -d
```

PocketBase 每次启动前都会先执行未应用的 migration；如果 migration 失败，容器不会进入健康状态。首次部署时访问 `/_/` 创建管理员。只有在数据库为空、需要导入仓库内置初始内容时，才执行一次：

```bash
PB_URL=https://你的域名 \
PB_EMAIL=管理员邮箱 \
PB_PASSWORD='管理员密码' \
pnpm run cms:import
```

后续发布更新只需要重新执行：

```bash
docker compose pull
docker compose up -d
```

管理员密码、PocketBase 数据和初始内容不会写入镜像。完整的 PocketBase 配置说明参见 [pocketbase/README.md](./pocketbase/README.md)。

### Docker 离线镜像

可以从 [Release](https://github.com/FishCat233/ngen-hello-kexie-space/releases) 页面同时下载官网和 PocketBase 离线镜像，然后分别执行 `docker load`。服务器仍然只需要 Compose 文件和 `pocketbase/pb_data` 持久化目录。
