# NGEN-HELLO-KEXIE-SPACE

桂电三院科协新版本主页。Vue3 + Tailwind CSS 单页应用，部署在 Github Pages。排版驱动极简设计，纯色块语言。

## 技术选型

- Vue3 + TypeScript + Vite
- Tailwind CSS
- Pinia (状态管理)
- pnpm

- remark + remark-gfm (Markdown 渲染)
- lucide-vue-next (图标)
- ESLint + Prettier

## 工作哲学

### 前置分解

面对任何任务，先分解再执行。将全局问题拆解为自包含的子任务。判断标准：如果你不确定 AI 能否大概率独立完成该子任务，就继续拆。

### 子任务描述

子任务描述像一份 GitHub Issue：自包含、边界清晰、上下文最小化。

- 每个子任务有明确的输入和输出格式
- 不引入与当前任务无关的文件或历史信息
- 子任务之间通过约定的接口通信——下游不需要知道上游的内部执行过程

### 跨 Session 执行

不期望在单个 Session 内完成超长任务链。

新 Session 启动流程:
1. 读取本文件确定角色、约束、工作流
2. 读取 [CONTEXT.md](./CONTEXT.md) 对齐术语
3. 读取 [docs/spec.md](./docs/spec.md) 定位当前子任务
4. 只加载当前子任务所需的局部上下文

### 验收与纠偏

- 测试独立于实现——AI 单独编写测试，向 TDD 靠拢
- 当 AI 输出不合格时，不修补生成结果——回到分解层重新确认理解是否正确、粒度是否足够细

## 质量门禁

每次完成代码修改后:

```bash
pnpm run format
pnpm run lint
```

## 参考文档

- [CONTEXT.md](./CONTEXT.md) — 领域术语表，写代码和讨论时必须对齐
- [DESIGN.md](./DESIGN.md) — 设计系统与视觉规范
- [docs/spec.md](./docs/spec.md) — 完整页面设计规格

## 组件清单

- `AppNavbar.vue` — 深底纯色块导航栏，随页面滚动
- `AppFooter.vue` — 深底纯色块页脚
- `HeroSection` — 第一面主视觉
- `DepartmentsSection` — 第二面部门介绍
- `LearningDirectionsSection` — 第三面学习方向
- `RecruitmentSection` — 第四面招新时间线
- `GalleryView` — 项目展廊(分类筛选、灯箱、iframe 预览)

## CI/CD

- release-please: 自动发版，版本号从 0.0.0 递增，发版触发 Docker 打包
- main commit hook: 自动构建部署 Github Pages
- Docker 镜像: `ngen-hello-kexie-space:${version}`，使用 Caddy 代理静态文件
