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

## 数据修改指南

所有页面展示的文本、成员、项目等数据均集中在 `src/data/` 目录下，直接修改对应文件即可，无需改动组件代码。

### 数据文件一览

| 文件 | 对应页面区域 | 说明 |
|------|-------------|------|
| `src/data/kexie.ts` | Hero 区域 | 科协成立日期，修改 `KEXIE_FOUNDING_DATE` 即可更新计时器 |
| `src/data/departments.ts` | 部门介绍区域 | 五个部门的名称、描述、图标类型、可选的部门主页链接 |
| `src/data/members.ts` | 成员展示区域 | 成员头像、昵称、年级、方向、职务、格言、社交链接等。按数组顺序展示，通过 `getMembersByGrade()` 按年级分组 |
| `src/data/projects.ts` | 项目展示区域 | 三组数据：`projects`（往届项目）、`demoProjects`（Demo 作品）、`competitionProjects`（比赛作品），各自有不同的字段结构 |
| `src/data/awards.ts` | 获奖展示区域 | 竞赛名称、各级别获奖数量、获奖人员名单。`awardLevelColors` 控制奖牌颜色 |
| `src/data/gallery.ts` | 展廊区域 | 展廊项目的封面、标题、描述、分类、链接。`categories` 数组控制分类筛选项 |
| `src/data/comments.ts` | 留言区域 | 从 GitHub Issues API 拉取评论数据（`fetchComments`），`formatDate` 处理时间格式化 |

### 修改示例

**添加新成员** — 编辑 `src/data/members.ts`，在 `members` 数组里追加一个对象：

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

**添加新项目** — 编辑 `src/data/projects.ts`，根据项目类型选择添加到 `projects` / `demoProjects` / `competitionProjects` 数组。

**添加展廊卡片** — 编辑 `src/data/gallery.ts`，在 `galleryItems` 数组追加对象。`type` 可选 `'image'` / `'iframe'` / `'link'`，封面图片放在 `public/gallery/` 目录下，`src` 路径以 `/gallery/` 开头。

### 图片资源

- 展廊封面图片：放在 `public/gallery/`，通过 `/gallery/xxx.webp` 引用
- 其他静态资源同样放在 `public/` 目录下

### 学习方向文档

每个学习方向（点击第三面卡片跳转的详情页）对应一篇 Markdown 文档，位于 `public/docs/introduction/`。文件与方向的映射关系定义在 `src/views/DirectionView.vue` 的 `fileNames` 对象中：

| 方向 ID | 文件名 | 方向名称 |
|---------|--------|----------|
| `frontend` | `frontend.md` | 前端开发 |
| `backend` | `backend.md` | 后端开发 |
| `game` | `game.md` | 游戏开发 |
| `app` | `app.md` | APP开发 |
| `ui` | `ui.md` | UI设计 |
| `hardware` | `hardware.md` | 硬件开发 |
| `deep-learning` | `deep-learning.md` | 深度学习 |
| `video` | `video.md` | 视频剪辑 |
| `reverse` | `reverse.md` | 逆向工程 |
| `crypto` | `crypto.md` | 密码学 |
| `web-security` | `web-security.md` | Web安全 |
| `pwn` | `pwn.md` | PWN |
| `editing` | `editing.md` | 编辑 |

> **注意**：方向 ID 由 `src/components/LearningDirectionsSection.vue` 中 `directions` 数组的 `id` 字段定义。修改或新增方向时需同步更新三处：① `public/docs/introduction/` 下的 md 文档，② `DirectionView.vue` 中的 `fileNames` 和 `directionNames` 映射，③ `LearningDirectionsSection.vue` 中的 `directions` 数组。

文档使用 Markdown 格式，支持 GFM 语法（表格、任务列表等），图片可放在 `public/docs/introduction/image/` 目录下，在 md 中使用相对路径引用。

`public/docs/introduction/old-docs/` 目录存放旧版方向文档作为归档参考。

## 贡献

参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署

### Docker 离线镜像

可以通过两种方式获取镜像:
- 从 [Release](https://github.com/FishCat233/ngen-hello-kexie-space/releases) 页面下载离线镜像
- 下载项目源码，本地构建镜像.
