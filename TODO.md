# TODO — 内容设计重构

> 上下文: 简化导航栏、减少主页内容、新增组织架构页面。
> 参见 [CONTEXT.md](./CONTEXT.md) 术语表、[DESIGN.md](./DESIGN.md) 设计规范。

---

## TODO-01: 简化导航栏

**文件**: `src/components/AppNavbar.vue`

**输入**:
- 当前 5 项 navMenu（首页/部门/学习/招新/更多），含二级/三级嵌套

**输出**:
- navMenu 缩减为 2 项：
  - `首页` — `href="#home"`，无 children
  - `更多 ▾` — children: 组织架构(`/organization`)、获奖情况(`/awards`)、项目活动(`/projects`)、项目展廊(`/gallery`)、畅心所言(`/comments`)
- CTA 按钮"加入我们"保留不变
- 删除不再使用的 `NavSubChild` 类型（三级子菜单类型）
- 移动端菜单同步简化

**验收**:
- 桌面端导航栏仅显示 `首页 | 更多 ▾ | [加入我们]`
- "更多"下拉显示 5 项，点击正确跳转
- 移动端汉堡菜单同步显示简化后的结构

---

## TODO-02: 新增组织架构页面 + 提取部门数据

**文件**:
- 新建 `src/data/departments.ts` — 部门数据（从 `DepartmentsSection.vue` 提取）
- 新建 `src/views/OrganizeView.vue` — 组织架构页面

**数据提取** (`src/data/departments.ts`):
- 从 `DepartmentsSection.vue` 复制 `Department` 接口和 `departments` 数组
- 导出为模块

```
export interface Department {
  id: string
  name: string
  description: string[]
  iconType: 'monitor' | 'server' | 'hardware' | 'organize' | 'security'
  website?: { url: string; label: string }
}

export const departments: Department[] = [ ... ]
```

**页面** (`src/views/OrganizeView.vue`):
- 页面标题: `# 组织架构`
- 使用 `BackButton` 返回
- 灰底 `#EEEEEE`，整体居中
- 复用 `DepartmentsSection.vue` 中的卡片模板（左实心色块 + 右镂空边框），渲染 5 个部门
- 安全部保留"安全部主页"链接按钮
- 部门色块交替规则不变（蓝/青交替: 多媒体蓝、软件青、硬件蓝、组织青、安全蓝）

**验收**:
- 访问 `/organization` 可看到完整页面
- 5 个部门卡片渲染正确，色块颜色交替
- 响应式: 桌面横排、移动端竖排

---

## TODO-03: 注册组织架构路由

**文件**: `src/router/index.ts`

**输入**: 现有路由数组（direction/projects/awards/comments/gallery）

**输出**: 新增路由:

```ts
{
  path: '/organization',
  name: 'Organization',
  component: () => import('../views/OrganizeView.vue'),
}
```

**验收**: 手动访问 `/#/organization` 正确加载组织架构页面

---

## TODO-04: 学习方向按部门分组展示

**文件**: `src/components/LearningDirectionsSection.vue`

**输入**: 当前 13 个方向平铺为 4 列网格

**输出**:
- 每张方向卡片新增 `department` 字段，按以下映射分组:

| 部门 | 方向 |
|------|------|
| 多媒体部 | 前端开发、后端开发、UI设计、视频剪辑、编辑 |
| 软件部 | 深度学习、APP开发、游戏开发 |
| 硬件部 | 硬件开发 |
| 安全部 | 逆向工程、密码学、Web安全、PWN |

- 每个部门分组有小组标题（如"多媒体部"），使用 `<h3>` + 正文色，`font-size: 20px`
- 方向卡片仍保留 hover 色块滑切交互、点击跳转方向页面
- 分组之间用 `margin-top: 40px` 分隔
- 页面整体标题 `# 学习方向` 不变

**验收**:
- 方向按 4 组排列，每组有部门名称标题
- 多媒体部 5 张、软件部 3 张、硬件部 1 张、安全部 4 张
- hover 交互正常
- 响应式网格正常

---

## TODO-05: 主页面移除部门介绍面

**文件**: `src/App.vue`

**输入**: 当前 App.vue 中 `<main>` 内渲染 4 个 section: HeroSection、DepartmentsSection、LearningDirectionsSection、RecruitmentSection

**输出**:
- 删除 `DepartmentsSection` 的 import
- 删除模板中对应的 `<section id="departments"><DepartmentsSection /></section>`
- 其余 3 个 section 不变
- `DepartmentsSection.vue` 文件保留不动（其模板被 TODO-02 复用，后续可清理）

**验收**:
- 主页只有 3 个面: Hero → 学习方向 → 加入我们
- 滚动正常，无报错

---

## TODO-06: 修复加入我们面文案

**文件**: `src/components/RecruitmentSection.vue`

**输入**: introParagraphs 数组第 1 段写"四个部门"

**输出**: 改为"五个部门"，补全部门列表 — 即：

> 科协设有软件部、硬件部、多媒体部、组织部、安全部共五个部门

**验收**: 主页滚动到加入我们面，文字显示"五个部门"

---

## TODO-07: 质量门禁

```bash
pnpm run format
pnpm run lint
```

确保零错误、零警告。

---

## 依赖关系

```
TODO-02 ──→ TODO-03（路由需要页面文件存在）
TODO-02 ──→ TODO-05（App.vue 不再引用部门面，但不依赖 TODO-02 运行——独立任务）
其余任务互不依赖，可并行执行。
```

## 执行顺序建议

1. TODO-01 + TODO-02 + TODO-04 + TODO-06 并行
2. TODO-03（依赖 TODO-02 的文件）
3. TODO-05（任意时序，不影响构建）
4. TODO-07 最后
