# 设计系统 v2 — UI 全面重构

> 本文档是 UI 重构的**唯一权威设计规范**。
>
> 重构策略：风格由用户**逐维度**确定，不一次性定稿。确定一项 → 记录一项 → 落地一项。
> 旧版设计语言已归档至 [docs/design-legacy.md](./docs/design-legacy.md)，仅迁移期对照参考，全部落地后删除。

## 状态标记

- ⬜ 待定 — 尚未讨论
- 🟡 草案 — 已有方向，待用户确认
- ✅ 已定稿 — 规范冻结，作为落地依据
- 🚧 落地中 — 代码改造进行中
- ✔ 已落地 — 代码完成并通过质量门禁

## 重构决策看板

| # | 维度 | 状态 | 备注 |
|---|------|------|------|
| 0 | 设计理念 | 🟡 | 方向已定：纯黑底 + 科技蓝单色系 + 圆角玻璃语言；一句话待凝练 |
| 1 | 色彩系统 | 🟡 | 已落地：黑底科技蓝 token 体系（见 §1），待用户视觉验收 |
| 2 | 字体排印 | 🟡 | 已落地：字体族 + 11 档字号 + 行高/字重 token（见 §2），待视觉验收 |
| 3 | 形状与边框 | 🟡 | 已落地：圆角 token 体系（见 §3），全站卡片/按钮/标签已迁移，待视觉验收 |
| 4 | 阴影与深度 | 🟡 | 已部分落地：悬浮层（导航栏/下拉/移动菜单）用磨砂玻璃 + 阴影，见 §4 |
| 5 | 动效系统 | 🟡 | 局部落地：首屏卡堆翻转 + 词组滚动、滑切按钮、下拉展开；全局动效策略待定 |
| 6 | 签名元素 | 🟡 | 草案：`>` 路径符号 + `[ ]` 方括号（见 §6），待确认推广范围 |
| 7 | 组件规范 | ⬜ | 按钮、导航、卡片、标签、容器、灯箱等 |
| 8 | 页面级规格 | 🟡 | 局部定稿：首屏两行排版（见 §8.1），其余页面待定 |
| 9 | 响应式策略 | ⬜ | 断点、移动端适配原则 |

---

## 0. 设计理念 ⬜

一句话回答：这个网站应该给人什么感觉？

旧版参考：*排版驱动的极简设计，纯色块语言，系统字体。*

待定。

## 1. 色彩系统 🟡

用户指令（2026-09-20）：**页面整体改为黑色背景，主题色改为科技蓝**。以下 token 已在 `src/style.css` 落地，全站组件已迁移完毕。

### 1.1 色板

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-bg` | `#000000` | 页面背景：纯黑 |
| `--color-surface` | `#0a0e14` | 深色面板：导航栏、页脚、代码块、内容面板、弹窗 |
| `--color-card` | `#181d26` | 二级卡片：比背景浅一档的黑，表达层级（2026-09-20 用户指令，替代蓝色描边） |
| `--color-line` | `#1e293b` | 细线：分隔线、背景网格、表格边框、加载轨道 |
| `--color-primary` | `#3b82f6` | 科技蓝：色块、标题 `#` 前缀、名称、链接基色 |
| `--color-primary-bright` | `#60a5fa` | 亮科技蓝：hover 滑切填充、小号元信息（日期）、行内代码文字 |
| `--color-primary-dim` | `#0d1b2e` | 暗蓝面板：行内代码背景、blockquote 背景 |
| `--color-text` | `#e5e7eb` | 正文 |
| `--color-heading` | `#ffffff` | 标题 |
| `--color-white` | `#ffffff` | 深底/彩底上的文字 |
| `--color-on-primary` | `#04080c` | 蓝色填充上的文字 |

### 1.2 语义分配

- **背景层**：页面用 `--color-bg`；**二级卡片统一 `--color-card` 浅黑底表达层级，不再使用蓝色描边**（2026-09-20 用户指令）；面板型容器（导航/页脚/iframe 弹窗）用 `--color-surface`
- **强调层**：标题 `#` 前缀、人名/项目名、链接基色用 `--color-primary`；小号元信息与 Markdown 行内代码文字用 `--color-primary-bright`
- **交互态**：hover 统一为 `--color-primary-bright` 填充（滑切或整体变色），其上文字一律 `--color-on-primary`（近黑）；卡片内嵌小按钮 hover 时可反转为黑底白字
- **细节线**：分隔线、表格边框、面板内 divider 用 `--color-line`
- **明暗模式**：仅暗色，`color-scheme: dark`；代码高亮用 `github-dark.css`
- **例外保留色**（数据驱动，不纳入 token）：奖项等级金银铜（`awardLevelColors`）、展廊分类标签（金 `#fbbf24` / 粉 `#f472b6`）、GitHub 语言色点、成员自定义 `themeColor`、首屏部门专属色（`deptColors`：`#3b82f6/#a78bfa/#fb923c/#34d399/#f87171`，见 §8.1）

### 1.3 旧变量迁移对照（已全部完成，旧变量已删除）

| 旧 token | 新去向 |
|----------|--------|
| `--color-gray` | 页面 → `--color-bg`；面板/卡片底 → `--color-surface` 或黑底+边框 |
| `--color-cyan` | 边框 → `--color-primary`；hover 填充 → `--color-primary-bright`；细分隔线 → `--color-line` |
| `--color-blue` | 文字强调 → `--color-primary`；小号元信息 → `--color-primary-bright` |
| `--color-black` | → `--color-bg` / `rgba(0,0,0,…)` |
| `--color-light-cyan` | → `--color-primary-dim` |
| `--color-white`（蓝/青底上） | → `--color-on-primary`（黑底上保留 `--color-white`） |

## 2. 字体排印 🟡

已落地（2026-09-20，全站排版优化）：token 定义于 `src/style.css`，17 个组件/视图已迁移完毕；组件内散落的硬编码字号与各自维护的移动端字号覆盖已全部清除。

### 2.1 字体族

| Token | 栈 | 用途 |
|-------|-----|------|
| `--font-sans` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif` | 全站 UI 与正文：系统栈 + 中文字体显式声明，不引入第三方字体 |
| `--font-mono` | `ui-monospace, 'Cascadia Code', 'SF Mono', Consolas, 'Courier New', monospace` | 行内代码、代码块、页脚版本号/成立时长 |

### 2.2 字号层级（11 档，桌面 / ≤1024px）

| Token | 桌面 | 移动 | 用途 |
|-------|------|------|------|
| `--text-display` | 56px | 40px | Hero 主标题 |
| `--text-h1` | 42px | 32px | 首页章节大标题（部门 / 学习方向 / 招新） |
| `--text-h2` | 36px | 28px | 子页面主标题 |
| `--text-h3` | 28px | 24px | 区块/卡片分组标题 |
| `--text-h4` | 24px | 20px | 小节标题（时间线标题、Markdown h2、部门名） |
| `--text-h5` | 20px | 18px | 条目/组标题（时间线项、灯箱标题、Markdown h3） |
| `--text-body-lg` | 18px | 16px | 引导正文（Hero 标语、卡片主名称） |
| `--text-body` | 16px | 16px | 正文（Markdown 正文、页面副标题、评论正文） |
| `--text-ui` | 14px | 13px | 紧凑文字：导航、按钮、卡片内描述 |
| `--text-sm` | 13px | 13px | 辅助描述、元信息、二级菜单 |
| `--text-xs` | 12px | 11px | 标签、页脚、时间戳、徽章 |

移动端字号由 token 在 `@media (max-width: 1024px)` 统一覆盖，**组件不再单独写字号断点覆盖**（旧版每个组件各写一套 `@media` 覆盖的写法已废除）。

### 2.3 行高

| Token | 值 | 用途 |
|-------|-----|------|
| `--leading-tight` | 1.2 | 大标题 |
| `--leading-snug` | 1.4 | 小标题、多行截断的名称 |
| `--leading-normal` | 1.6 | 正文 |
| `--leading-relaxed` | 1.8 | 长文阅读（Markdown、介绍段落） |

### 2.4 字重策略

- 页面级标题（display / h1 / h2）：**700**
- 区块与条目标题（h3 / h4 / h5）：**600**
- 按钮、导航、强调 UI 文字：**500–600**
- 正文与辅助文字：**400**

### 2.5 其他规则

- 根字号 18px（≤1024px 时 16px）、行高 1.6；未显式声明字号的文本继承此基准
- 中文标题不使用负字距（旧版 h1/h2 的 -1.68px / -0.24px 已删除）；Hero 标语保留 +2px 字距以拉开节奏
- 等宽场景一律 `--font-mono`；全站仅暗色模式，无字体加载（纯系统栈，零网络请求）

## 3. 形状与边框 🟡

用户指令（2026-09-20）：**整个项目的直角卡片/按钮等都改成圆角**。以下 token 已在 `src/style.css` 落地，全站已迁移。

### 3.1 圆角 token

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | `8px` | 标签、徽章、行内代码、图标框（timeline/award icon）、页脚条目 |
| `--radius-md` | `12px` | 提示框（cms-notice/empty）、代码块、Bilibili 卡片、灯箱图片、64px 图标框 |
| `--radius-lg` | `16px` | 卡片（项目/获奖/留言/成员/展廊/学习方向/部门复合卡）、内容面板、弹窗 |
| `--radius-pill` | `999px` | 全部按钮（CTA/滑切链接/筛选/返回/重试）、导航栏药丸形态 |

### 3.2 附加规则

- **头像一律圆形**（`border-radius: 50%`）：成员墙 64px、项目作者 40/44px、竞赛作者 36px，与导航栏 logo 一致
- **语言色点、加载 spinner 圆形化**
- **边框**：维持 2px `--color-primary` 描边语言不变，仅叠圆角
- **表格暂不圆角**（圆角表格需重构边框模型，留待后续决定）
- 部门复合卡（左色块 + 右描边）：圆角加在容器 `.department-card` 上并 `overflow: hidden` 裁剪子区

## 4. 阴影与深度 🟡

已落地（2026-09-20，随导航栏玻璃化）：

- **磨砂玻璃**（backdrop-blur + 半透明底 + 描边）用于**悬浮层**：导航栏、桌面下拉菜单、移动端菜单面板。配方：`rgba(10,14,20,0.66~0.88)` + `blur(20px) saturate(150%)` + 1px `rgba(59,130,246,0.35)` 描边；下拉/移动菜单附 `0 12px 32px rgba(0,0,0,0.45)` 阴影，**导航栏本体无阴影**（2026-09-20 按用户要求移除）
- **首屏 CTA 按钮**（`HeroSection.vue`）同为磨砂玻璃，透出底层 HeroBand 色带：`rgba(10,14,20,0.45)` + `blur(16px) saturate(150%)`，无阴影；描边仍为 2px `--color-primary`；hover 滑切填充改为**主题蓝 `--color-primary`**（2026-09-21 用户指令，原亮蓝 `--color-primary-bright` 废弃，此为滑切家族中首屏专属例外）
- **常规内容卡片不加阴影**，层级仍靠边框 + hover 填充表达
- 灯箱/iframe 弹窗遮罩：`rgba(0,0,0,0.95)`，内容面板维持 surface + 边框（无玻璃）

### 4.1 导航栏两态规格（`AppNavbar.vue`）

| 属性 | 初始态（页面顶部） | 滚动态（scrollY > 24px） |
|------|------------------|------------------------|
| 定位 | 吸附顶部 `top: 0` | 脱离顶部 `top: 16px` |
| 宽度 | 100% 通栏 | `min(calc(100% - 32px), 1080px)` 居中 |
| 形态 | 长方形（radius 0） | 药丸（`--radius-pill`） |
| 内边距 | 16px 24px | 10px 四边等大（右侧按钮边距 = 上下边距） |
| 背景 | 玻璃 `rgba(10,14,20,0.72)` | 玻璃 `rgba(10,14,20,0.66)` |
| 边框 | 仅底边 `--color-line` | 四边 `rgba(59,130,246,0.35)` |
| 过渡 | width/top/padding/radius/border/background 0.4s ease | — |

- 状态源：`useNavbarScroll()` 仅返回 `isScrolled`（阈值 24px）。上滑自动隐藏行为已按用户要求取消（2026-09-20），导航栏常驻
- Logo 区（图片 + 文字）：无 hover 效果、图片无描边、无内边距（内容紧贴药丸内边距）（2026-09-20 按用户要求移除）
- **内容与边框动画同步**：`.navbar-container` 必须 `width: 100%` 跟随导航栏本体插值；禁止 `max-width` 居中——否则内容在宽度动画过半后才开始移动，与边框不同步（2026-09-20 修复）
- 移动端菜单改为**悬浮玻璃面板**（absolute 定位于导航栏下方 12px，圆角 lg），不再贴边；窄屏右侧的**汉堡菜单按钮无描边**（2026-09-21 用户指令：40px 透明底白图标、去主题蓝描边，hover 主题蓝填充不变）
- 桌面下拉菜单规格（2026-09-20 定稿）：
  - 定位 `top: calc(100% + 16px)`，完全落在导航栏底部边框区之下，不与导航栏重叠
  - 用 `.dropdown-menu::before` 造一段 16px 的**不可见 hover 桥**覆盖「导航项 → 菜单」空隙，避免鼠标移经空隙时触发 `mouseleave` 导致菜单提前消失
  - **关键坑（2026-09-20）**：`backdrop-filter` 必须长在导航栏的兄弟层 `.navbar-glass` 上，而不是 `.navbar` 本身——祖先带 backdrop-filter 会形成 backdrop root，导致后代（下拉/移动菜单）的模糊只能采样已处理内容、失去玻璃感。玻璃层独立后，下拉/移动菜单的模糊才真正作用于页面。背景透明度取 `0.72` 与导航栏同档

### 4.2 滑切按钮箭头交互（2026-09-20 定稿）

全站滑切式按钮（`::before` 色块滑切家族）统一 hover 箭头效果——**箭头与文字作为整体居中**：

- `::after` 生成 `→`，作为**流内 flex 项**（`order: -1` 置于最左），不用绝对定位
- 静止态：`width: 0` + `margin-left: -8px`（抵消容器 gap 占位），布局与无箭头时逐像素一致
- hover 态：`width: 0 → 1em`、`margin-left: -8px → 0` 双过渡（同为 0.3s ease，合成单一缓动曲线）；自适应宽度的按钮随之增宽 22px，箭头从左侧展开，箭头+文字始终整体居中
- 容器必须 `gap: 8px`（单子元素按钮也补齐）+ `justify-content: center`
- 固定宽度按钮（`hero-button` 140px）内容盒需容纳 +22px：水平内边距改为 12px
- 应用范围：`navbar-cta`（水平内边距 32px，按用户要求加宽）、`navbar-mobile-cta`、`hero-button`、`direction-link`、`department-link`（OrganizeView + DepartmentsSection）、`member-link-btn`、`github-link-button`

### 4.3 按钮文字颜色规则（2026-09-20 定稿）

- **所有按钮文字一律白色**（`--color-white`），静止与 hover 均不变黑。覆盖：导航 CTA（桌面/移动）、滑切按钮、返回按钮、重试按钮、展廊筛选、灯箱控制、iframe 访问按钮、`.btn-solid`。**导航 CTA 滑切块深蓝 `#2563eb`（2026-09-20 用户指令：比底色深）**
- hover 层次仅靠背景表达：填充 `--color-primary` → `--color-primary-bright`（或 `::before` 滑切；导航 CTA 例外用 `#2563eb` 深蓝）
- 卡片 hover 已改为「变深」语言（见 §8 二级卡片层级规则），不再整体反色

## 5. 动效系统 ⬜

待定。需确定：装饰动效（滚动入场、路由过渡）是否引入；交互反馈形式；时长与缓动曲线。

已落地的局部动效：

- **首屏部门卡堆**（`HeroSection.vue`，2026-09-20，参考 [React Bits Stack](https://reactbits.dev/components/stack)）：5 张卡片常驻 DOM，位置由堆内序号驱动（rotate/scale/z-index/blur），切换时顶卡沉底、整叠联动上移——0.6s `cubic-bezier(0.3, 1.2, 0.4, 1)`（近似 spring 260/20）；**分层景深（二次修订）**：`blur` 按深度递增 `0.03/0.1/0.16/0.22em`（下侧近层卡收小保证边缘清晰）+ `brightness` 逐层压暗 `0.8/0.6/0.45/0.32`（em 随标题字号缩放）
- **首屏词组滚动**：垂直滚动切换（旧词上滚出、新词下滚入），0.45s ease，无翻转
- 全站已有：滑切按钮 hover（见 §4.2）、下拉菜单 grid-rows 展开

## 6. 签名元素 🟡

草案（2026-09-20，随首屏改版引入）：**`>` 路径符号 + `[ ]` 方括号**——首屏第一行「在 > [ 科协 ] 部门」中的 `>`（lucide ChevronRight SVG、primary 色）与独立于「科协」两侧的方括号（primary 色），接替旧版 `# ` Markdown 语法前缀的识别性角色。待确认是否推广到子页面标题。

**章节标题标记（2026-09-20 定稿）**：首页各面大标题的 `#` 前缀改为用户上传的**阶梯形 SVG**（`SectionMark.vue`，32×48 viewBox、三枚 16px 方块阶梯上升）——`currentColor` 继承 `--color-primary`，高度 `0.85em` 与标题文字视觉高度一致，flex 居中对齐。子页面标题仍用 `#` 前缀，待后续统一。

## 7. 组件规范 ⬜

待定。覆盖组件见下方「UI 覆盖清单」。每个组件确定：变体、状态、尺寸、内边距。

## 8. 页面级规格 ⬜

待定。逐页面规格，顺序建议：主页面 → 高频子页面 → 长尾子页面。

已定稿局部：

### 8.1 首屏（`HeroSection.vue`，2026-09-20 改版）

按用户排版参考图重构为**两行标题结构**（原「# 桂电三院科协」大标题 + 标语已移除）：

- **两行字号等大**：`clamp(15px, calc(5.3vw - 6px), 64px)`（vw 缩放保证任意屏宽单行不溢出、不换行）；字重 900 + `-webkit-text-stroke: 0.016em` 描边加粗；间距全部 em 化随字号缩放
- **第一行（归属路径）**：`在 > [ 科协 ] 部门卡堆`
  - `>` 为 lucide `ChevronRight` SVG（0.55em，主题色）；`[` `]` `科协` 为独立元素、全部主题色，括号 `translateY(-0.02em)` 上提补偿（全角括号墨迹偏下，2026-09-21 修订）
  - 部门卡堆（参考 [React Bits Stack](https://reactbits.dev/components/stack)）：5 张部门卡常驻同一 grid 单元，位置由堆内序号驱动——`rotate` 有机角度 + `scale(1-pos×0.05)`、`transform-origin: 90% 90%`、z-index 随深度递减、前卡 `translateY(0.06em)` 下移补偿（2026-09-21 修订）；**卡宽贴合当前顶卡**（2026-09-21 修订：非顶卡 `position: absolute` 锚定 cell 左上角、不参与列宽计算，容器 `position: relative`——药丸与左侧文字间距恒定，切换时行宽随顶卡字数变化）；**分层景深**：`blur` 按深度递增 `0.03/0.1/0.16/0.22em`（下侧近层收小）、`brightness` 逐层压暗 `0.8/0.6/0.45/0.32`；切换时顶卡沉底、整叠联动（0.7s，`cubic-bezier(0.34, 1.4, 0.5, 1)` 过冲曲线），周期 3.5s
- **第二行（主标语）**：`一起 词组1 词组2 词组3 [贴纸位]`
  - 每部门对应 3 个词组（`deptWords` 映射，HeroSection 内维护）；「一起」白色，词组用当前部门专属色（`--dept-color` CSS 变量注入）
  - 词组滚动切换：每个词组独立滚动窗口（overflow hidden 槽），旧词上滚出、新词下滚入（0.45s），切换后行宽即时更新、整行 flex 居中自动重排
  - **行重排 FLIP 位移动画**（2026-09-21）：切换导致两行行宽变化、flex 居中重排时文字瞬移——FLIP 承接：切换前记录行首元素位置，重排后对整行施加反向 `translateX`，再过渡回 0；药丸行 0.7s 过冲曲线（随卡堆）、词组行 0.45s ease（随词组滚动）
  - 右侧贴纸图片预留位：1.1em 虚线框（`rgba(59,130,246,0.35)`），≤640px 隐藏；待替换为 `<img>`
- 部门专属色（`deptColors` 药丸底色 + 第二行词组文字）：多媒体 `#22d3ee` / 软件 `#a78bfa` / 硬件 `#fb923c` / 组织 `#34d399` / 安全 `#f87171`；药丸内文字用各自更深同色系（`deptTextColors`）：`#164e63/#4c1d95/#7c2d12/#065f46/#7f1d1d`
- 药丸形态：外框高度 `1.08em`（略高于周围 900 字重 + 描边文字的墨迹高度，2026-09-20 修订）、宽度随各自部门名字数（3 字/4 字不等宽，2026-09-21）、`border-radius: var(--radius-pill)`、内文字 `0.78em` 居中 + `translateY(-0.03em)` 光学居中补偿（中文基线偏下）；多媒体部（4 字最宽）**按堆内层次左移修正**（2026-09-21 用户指令，替代原仅顶卡 -0.3em 方案）：顶卡不修正（自定卡堆宽度）；沉底后相对较窄顶卡右溢——倒数第四位 -0.1em / 倒数第三位 -0.3em / 倒数第二位 -0.15em / 末位 -0.5em（pos1/3 已有内建 x 偏移故补少量，末位补最多）
- 两行整体居中对齐（`hero-heading` column + center），HeroBand 背景与底部四按钮（毛玻璃）不变
- **第三行（副标题 slogan，2026-09-21）**：「把灵感写成代码，把热爱做成作品」——白色、`--text-h4`、500 字重；与主标题间距 20px、与按钮区间距 72px（≤1024px 56px，2026-09-21 二次调整：原 8px/48px，标题-slogan-按钮三段拉开）
- 垂直位置：`hero-content` `translateY(-6vh)` 略偏上（2026-09-21 由 -12vh 下移，加大标题/副标题/按钮距顶部留白；首屏仍 100vh 定高，不影响下方区块）

## 9. 响应式策略 ⬜

待定。需确定：断点集合、移动端导航形态、布局降级原则。

---

## UI 覆盖清单（重构范围）

重构完成的标准：以下每一项都打上 ✔。

### 全局框架

| 项 | 文件 | 状态 |
|----|------|------|
| 全局样式与 CSS 变量 | `src/style.css` | ✔ |
| 导航栏 | `src/components/AppNavbar.vue` | ✔ |
| 页脚 | `src/components/AppFooter.vue` | ✔ |
| 返回按钮 | `src/components/BackButton.vue` | ✔ |

### 主页面（三面滚动，`src/App.vue`）

| 项 | 文件 | 状态 |
|----|------|------|
| 第一面 · 主视觉 | `src/components/HeroSection.vue` | ✔ |
| 背景色带组件 | `src/components/ColorBends.vue`（three.js WebGL） | ✔ |

**Hero 背景规格（2026-09-20 定稿）**：
- ColorBends（移植自 vue-bits / react-bits 公开源码）铺满首屏，色带直达浏览器顶部
- 参数：单色 `#3b82f6`（= `--color-primary`）、speed 0.5、bandWidth 6、intensity 1.2、noise 0、rotation 90
- 底部过渡：`.hero-bends` 加 `mask-image: linear-gradient(to bottom, black 60%, transparent 100%)`，色带在首屏下部 40% 渐隐，与下一屏纯黑背景无缝衔接
- **版本坑（重要）**：vue-bits / react-bits **首页**用的是未公开的 v2 组件（API 为单数 `color` + `fadeTop` + `bandWidth` 取 0~1 小值），其 shader 从未发布到仓库；公开版 API 是 `colors: string[]`、无 `fadeTop`、`bandWidth` 默认 6。两版公式不同，**把 v2 参数喂给公开版公式会渲染成均匀淡雾**而非光带。如需首页同款柔和光晕效果，需自研 shader，不能靠参数复刻
| 第二面 · 关于科协（三段介绍文案） | `src/components/AboutSection.vue` | ✔ |
| 第三面 · 学习方向 | `src/components/LearningDirectionsSection.vue` | ✔ |
| 第四面 · 加入我们（横向招新时间线） | `src/components/RecruitmentSection.vue` | ✔ |

**首页各面通用规格（2026-09-20 定稿）**：
- 大标题**左对齐**：`SectionMark` 阶梯 SVG 前缀（见 §6）+ `--text-h1`，容器 `align-items: flex-start`
- 关于科协面：左侧三段介绍文案（原「加入我们」右侧文案迁移至此，正文 `--text-body-lg`、`--leading-relaxed`、两端对齐）+ 右侧**实拍轮播**（2026-09-21 由单图升级，同日改左右滑动并抽取为共用组件 `SlidingCarousel.vue`）：3 张图——`kexie-workshop.jpg` 科协活动室 / `kexie-lab.jpg` 科协机房 / `kexie-office.jpg` 科协办公室；620px 宽、16:9 横版、高度随文字列拉伸对齐（`object-fit: cover`）；**左右滑动切换**（0.6s `cubic-bezier(0.4,0,0.2,1)`，车道持久定位——见 §8 共用组件 `SlidingCarousel`），自动轮播 4.5s（前进方向）、hover 暂停、手动切换重置节奏；**左右控件**：毛玻璃圆形按钮（36px，`rgba(10,14,20,0.5)` + `blur(16px) saturate(150%)`，hover 加深至 0.75，ChevronLeft/Right 白色）；右下角可点指示点（8px，激活主题亮蓝）；**底部黑色渐变**（`linear-gradient(to top, rgba(0,0,0,0.65), transparent)`）+ 地点文字（白字 `--text-ui`，随幻灯片一起滑动；2026-09-21 用户指令移除 MapPin 图标）；≤1024px 上下堆叠（图上文下，16:9 全宽）
- 学习方向面**编辑部索引列表**（2026-09-20 重设计）：按部门分组——组头 = 部门名（`--text-h5` 白）+ 方向数（灰）+ 延伸细线（`--color-line`）；每方向一行 = 等宽序号（灰）+ **方向专属图标**（22px 主题蓝，与详情页同一套映射）+ 方向名（`--text-h3`）+ 右侧箭头；行 hover 浮现 `--color-card` 底、名字变 `--color-primary-bright`、箭头滑入。**安全部主页按钮**位于组头名称右侧（1px 主题蓝描边药丸 + ExternalLink，hover 蓝底白字），不混入方向行。≤640px 隐藏序号（保留图标）、名字降 `--text-h5`
- 招新时间线**横向排版**（2026-09-21 修订）：整条时间线由 `--color-card` 圆角卡片（`--radius-lg`，padding 44px 48px）包裹；节点横排（图标 + 标题 + 描述竖直居中），阶段图标框为 44px 圆角方形**透明底** + 2px 主题蓝描边 + 主题蓝图标（2026-09-21 曾试白底后按用户指令改回透明；≤640px 40px），阶段间衔接为**内联 SVG 箭头**（线身 + 折线箭头头部，主题蓝 `currentColor`，`vector-effect: non-scaling-stroke` 保证各尺寸下笔画恒 2px，箭头中心对齐 44px 图标中心；桌面 48px、≤1024px 36px）；≤640px 退化为纵向，箭头 `rotate(90deg)` 指向下一阶段（28px）；每阶段标题下方带**时间小徽章**（2026-09-21 新增，占位数据待招新日程确定后替换）：`--text-xs` 亮蓝字 + `color-mix 13%` 主题蓝淡底药丸，`margin-top: -4px` 紧贴标题

**页脚规格（2026-09-20 重设计，四次修订）**：无描边，**底色全页脚统一 `--color-surface`**（2026-09-21 用户指令：取消版权条 `#06090f` 更深一档的分区分色）。主区容器 padding `64px 24px 40px`（≤1024px `48px 16px 32px`；2026-09-21 用户指令收紧底距，原四边等大 64px，收窄主区与版权条间空隙）。左侧品牌区（logo 48px 圆形 + 名称 `--text-h5` 白 + 标语灰）与右侧两栏**顶部对齐**，并整体上提 4px 视觉补偿（2026-09-21 用户指令：右侧标题文字行高在字形上方留半行距，纯盒子顶对齐时品牌区视觉偏低，需相对右侧再靠上一点）；右侧两栏（联系我们 / 站点信息，间距 96px）。子项带 lucide 图标（14px 主题蓝）+ 灰字（`#9ca3af`），**栏标题与子项图标的左缘对齐**（2026-09-21 用户指令，原 `padding-left: 22px` 与子项文字对齐的方式废弃）；无 hover 效果。底部居中**计时器**（`BlurNumber.vue`，2026-09-20 三次修订，替代 FlipDigit 翻卡）：「科协已砥砺前行（至少）」+ 数字整体切换（如「16」不拆位）——无底色无圆角，`--font-mono` `--text-h5` 加粗主题蓝、`line-height: 1`；切换动画为**高斯模糊**（`filter: blur(6px)` + 淡入淡出 0.3s，`Transition out-in`）+ 单位灰字，下方版权行；**版权行与计时器同为 `#9ca3af` 灰阶、间距收紧（12px），视觉连为整体**（2026-09-21 用户指令）。页脚整体为一个裁切/层叠板块（2026-09-21 用户指令：光晕原挂版权条会在区块交界处被裁断）：`footer` 本体 `position: relative + overflow: hidden + isolation: isolate`，主区与版权条两个子区块共享同一上下文。版权条底部中心**椭圆放射蓝色光晕**（2026-09-21 新增，同日两次放大提速）：`radial-gradient`（核心 `rgba(59,130,246,0.24)` → 38% `0.1` → 68% 透明），宽 `min(2000px, 100vw)` × 640px、锚定 footer 最底边（`bottom: -300px` 裁出上半圆顶），挂在 footer 直下、跨主区与版权条连续发光，置于内容之下（`z-index: -1`），**呼吸动画** 5s（opacity 0.5↔1 + scale 1↔1.05）。≤1024px 上下堆叠、≤640px 两栏再纵排

**方向详情页（2026-09-20）**：标题左侧为**方向专属图标框**（40px 2px 主题蓝描边圆角方形 + lucide 图标，13 方向各有映射：前端 Globe / 后端 Coffee / 游戏 Gamepad2 / APP Smartphone / UI Palette / 硬件 Cpu / 深度学习 Brain / 视频剪辑 Clapperboard / 逆向 Binary / 密码学 Lock / Web安全 Shield / PWN Terminal / 编辑 FileText），替代 `#` 前缀。**MD 标题层级颜色随层级递浅**（2026-09-21 用户指令，修正 h2/h3 反向）：h2 主题蓝 `--color-primary` + 下边线、h3 亮蓝 `--color-primary-bright`、h1 隐藏。**文档插图限高**（2026-09-21 用户指令）：`max-height: 420px` 等比缩放不裁切，加 `--radius-sm` 圆角，防止长截图撑爆版面。**Bilibili 视频卡片无描边**（2026-09-21 用户指令）：仅 `--color-surface` 底 + 圆角，移除主题蓝描边。**加载体验**（2026-09-21）：加载态为文档骨架屏（标题 + 段落 + 插图占位，同全站流光样式）；MD 插图与全站列表头像一律 `loading="lazy" decoding="async"`；highlight.js 使用 `lib/common` 子集按需打包

### 子页面（7 个路由）

| 项 | 文件 | 状态 |
|----|------|------|
| 方向页面（Markdown 渲染体系） | `src/views/DirectionView.vue` | ✔ |
| 项目活动 | `src/views/ProjectsView.vue` | ✔ |
| 近年获奖 | `src/views/AwardsView.vue` | ✔ |
| 畅心所言 | `src/views/CommentsView.vue` | ✔ |
| 项目展廊 | `src/views/GalleryView.vue` | ✔ |
| 组织架构 | `src/views/OrganizeView.vue` | ✔ |
| 成员墙 | `src/views/MembersView.vue` | ✔ |

### 业务组件

| 项 | 文件 | 状态 |
|----|------|------|
| 项目卡片 | `src/components/ProjectCard.vue` | ✔ |
| 竞赛项目卡片 | `src/components/CompetitionProjectCard.vue` | ✔ |
| Markdown 正文样式（`.markdown-body`，含表格/code/blockquote） | `src/views/DirectionView.vue` 内 | ✔ |

**组织架构页规格（2026-09-20 定稿）**：
- 竖版部门卡（`min(460px, 88vw)` × min-height 480px）：上部 200px 灰色图片预留位（`#d4d4d4`，待放图），下部内容区——部门名 h2 白色、两段正文 body-lg `#b0b0b0`、可选链接 pill
- 全宽横向卡片流：轨道撑满视口宽（不在 1200px 容器内），多卡同时可见，卡间距 48px；`padding-left: max(20px, calc((100vw - 1200px)/2 + 20px))` 让首卡与容器内标题左对齐，`scroll-padding-left` 同值保证吸附点对齐
- 操作控件在卡片区域之外：左右箭头（毛玻璃圆钮）位于标题行右侧；圆点指示器在轨道下方；键盘 ←→ 导航
- 无选中态：所有卡片等透明度展示，不区分激活卡
- **主席团**（2026-09-21 新增）：`# 主席团` 标题 + 灰字「24级」注记；数据 `src/data/presidium.ts`（13 人：主席孙培正；财务/赛事/技术副主席刘宁宇、邓远翔、谭炜；各部门部长与副部长）；主席**居中强调独卡**（头像 84px、名字 h3），其余 12 人 6 列网格卡（头像 56px、名字 h5、职务灰 `--text-ui`）；头像照片缺省时为**姓氏色块**——主席团主题蓝 `#3b82f6/#172554`、各部门用首屏药丸同套色板，`avatar` 字段填 URL 后自动切照片；卡底 `--color-card`、hover 变深 `#10141b`；≤1024px 4 列 / ≤768px 3 列 / ≤480px 2 列
- **部门风貌**（2026-09-21 新增）：`# 部门风貌` 标题 + **全宽（edge-to-edge）轮播**（`SlidingCarousel`，高度 `clamp(320px, 46vh, 560px)`，移动端 `clamp(240px, 38vh, 420px)`）；每部门一张幻灯片，合照未提供时显示**部门色占位态**（radial 渐变底 + 部门色大字 +「照片待补充」），提供合照后在 `showcaseSlides` 填入 `src` 即切实图模式（底部渐变 + 部门名标注）
- **共用组件 `SlidingCarousel.vue`**（2026-09-21 抽取，同日修订定位算法）：左右滑动轮播——**车道持久定位**（每张幻灯片持有整数 lane，`transform = (lane - 当前张 lane) × 100%`；换向前先把进入侧幻灯片的 lane 对齐到与当前张相邻——换位前后均在屏外、瞬移不可见（该幻灯片单帧 `transition: none`，`nextTick` + 读取 `offsetWidth` 提交瞬移帧后恢复过渡），再切换 current。修复旧「最短路径归一化」在环绕切换（如 3→1、1→2）时远端幻灯片横穿整个视口的 bug）、毛玻璃左右控件、右下圆点、hover 暂停 + 手动切换重置节奏、自动 4.5s；props：`slides`（`src?/label/color?`）、`interval`；无 `src` 渲染占位态。现用于：首页关于科协（620px 圆角、地点文字标注）、组织架构部门风貌（全宽）

**获奖页规格（2026-09-20 重设计）**：2 列卡片（≤1024px 单列），编辑排版风格——无奖杯图标、无边框徽章：
- 标题用 `SectionMark` 前缀（同首页签名元素）
- 卡片左侧内缩 3px 色条 = 该赛事**最高等级颜色**（`levelRank`：国一 > 国二 > 国三 > 省一 > 省二 > 省三）
- 等级徽章扁平化：`国二 ×1` 彩字 + `color-mix 13%` 同色淡底，无描边
- 成员去标签化：`获奖成员 N 人` 微标签（#6b7280）+ 顿号连接的灰字名单（`#9ca3af`）
- hover 变深 `#10141b`（全局卡片规则）

**展廊页徽标（2026-09-21 修订）**：图片右上角「外部链接 / 可预览」徽标由主题蓝实底（`--color-primary` + `--color-on-primary` 深字）改为**深色毛玻璃**——`rgba(10,14,20,0.55)` + `backdrop-filter: blur(16px) saturate(150%)`（同首屏按钮质感）+ 白字 600，保证任意明暗图片上的可读性；卡片 hover 图片缩放与遮罩不变

**二级卡片层级规则（2026-09-20 用户指令，二次修订）**：全站二级卡片统一 `--color-card`(#181d26) 浅黑底表达层级，**不用蓝色描边**；**hover 一律「变深」**（`#10141b`），文字与内部元素层级不变，禁止浅蓝色块滑切/填充 hover。已迁移：ProjectCard、CompetitionProjectCard、member/comment/award 卡、gallery 卡（图片缩放与遮罩保留）、cms-notice/empty 提示框、DirectionView markdown 容器、iframe 弹窗（surface + 1px line 细描边）。按钮/标签/头像/图标框的蓝色描边保留（非卡片）；**小号药丸按钮保留亮蓝滑切填充**（成员链接、github-link、direction-link 等）。**导航栏 CTA 滑切块为深蓝 `#2563eb`**（比底色深，2026-09-20 用户指令）；学习方向行为列表行（非卡片），hover 浮现 `--color-card` 底

> 2026-09-20 色彩迁移完成：全站已无旧变量（`--color-cyan` 等），format + lint 通过。
> 2026-09-20 圆角迁移完成：全站卡片/按钮/标签/头像按 §3 token 圆角化，导航栏落地 §4.1 两态玻璃药丸规格，format + lint 通过。上表 ✔ 指**暗色科技蓝换色 + 圆角化落地**；字体排印、动效等其他维度重构时逐项重开。

### 待处置项（重构中一并决定去留）

- `src/components/DepartmentsSection.vue` — 无任何页面引用（死代码），部门介绍实际由组织架构页承载；本轮已同步换色以保持一致，去留待定
- `src/components/HelloWorld.vue`、`src/assets/vue.svg`、`src/assets/vite.svg` — 脚手架残留

---

## 工作流

每一轮重构的节奏：

1. 用户提出某一维度的风格方向（可附参考图 / 参考站点）
2. 我输出该维度的规范草案（含 token 定义与示例），写入本文档，状态 🟡
3. 用户确认或修正 → ✅
4. 落地代码：先全局 tokens（`src/style.css`），再组件，再页面
5. 跑质量门禁 `pnpm run format && pnpm run lint`，更新覆盖清单状态 ✔

### 硬约束（重构全程有效）

- 类名语义化，禁止使用 Figma 图层名（如 `Frame7`）
- 文字垂直居中必须显式处理（flex 居中或等效 line-height），不依赖默认行为
- 除非用户明确要求，不主动跑 build 验证
- 禁止批量删除文件；删除死代码时逐个文件操作并先行告知

## 与其他文档的关系

- [CONTEXT.md](./CONTEXT.md) — 领域术语表，重构中命名（类名、组件名）须与其对齐
- [docs/spec.md](./docs/spec.md) — 页面功能与数据规格；其**视觉部分**在重构期以本文档为准，功能与数据规格继续有效
- [docs/design-legacy.md](./docs/design-legacy.md) — 旧版设计语言归档
