<div align="center">

<h1>NGEN Hello Kexie Space</h1>

![GitHub Release](https://img.shields.io/github/v/release/FishCat233/ngen-hello-kexie-space) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/FishCat233/ngen-hello-kexie-space/total)

<h5>桂电三院科协新版本主页.</h5>

</div>

## 开发

复制项目仓库.

```bash
git clone https://github.com/FishCat233/ngen-hello-kexie-space.git
```

安装 pnpm 依赖.

```bash
pnpm install
```

启动项目.

```bash
pnpm run dev
```

### 项目结构

技术栈
- vite: 前端构建工具
- Vue3: 前端框架
- Tailwind CSS: 前端样式框架
- Pinia: 前端状态管理
- pnpm: 前端包管理
- TypeScript: 前端类型检查
- Eslint: 前端代码规范
- Prettier: 前端代码格式化
- Three.js: 前端3D渲染
- remark: 前端Markdown渲染
- remark-gfm: 支持GFM Markdown扩展语法
- lucide-vue-next: 图标库
- release-please: Github Action 自动发版

文件结构
- `src/`: 前端项目源码
- `public/`: 静态资源目录
- `ci/`: 部署配置目录
  - `Caddyfile`: 部署配置文件
  - `Dockerfile`: 镜像构建文件
  - `docker-compose.yml`: docker compose 模板
- `.github/`: GitHub Actions


### 项目规范

版本号遵循 [SemVer](https://semver.org/) 规范.

提交遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 规范.

## 部署

### Docker 离线镜像

可以通过两种方式获取镜像:
- 从 [Release](https://github.com/FishCat233/ngen-hello-kexie-space/releases) 页面下载离线镜像
- 下载项目源码，本地构建镜像.
