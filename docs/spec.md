# 页面设计规格

## 设计语言

排版驱动极简设计。纯色块、直角、系统字体。详见 [DESIGN.md](../DESIGN.md)。

- 全实色，禁止透明度、`backdrop-filter`、阴影
- `# 标题` Markdown 语法前缀作为签名元素
- 内容容器：`1px` 直角边框，透明底
- 按钮：直角实色填充，hover 色块滑切
- 零页面装饰动效，仅保留交互反馈
- 面与面之间大纵向留白，无分隔线

## 全局数据

- QQ 群: `https://api.kexie.space/recruitment-qq-group`
- QQ 频道: `https://pd.qq.com/s/5pxzsijx0`
- OJ(练习编程): `https://oj.kexie.space`
- 知识库: `https://ccn80b5bgw86.feishu.cn/wiki/CKD8wrIVyi1E9VkdUVGclVFxnlb`

## 色调

全实色，不使用透明度。详见 [DESIGN.md](../DESIGN.md)。

| Token | 色值 |
|-------|------|
| 蓝 | `#5CB8D9` |
| 青 | `#4DB8B6` |
| 黑 | `#04080C` |
| 白 | `#FFFFFF` |
| 灰 | `#EEEEEE` |
| 正文 | `#333333` |

## 导航栏 (`AppNavbar.vue`)

- 位置: 随页面滚动（非 fixed）
- 样式: 深底纯色块 `#04080C`，无边线
- 布局: 左侧 Logo + 科协名称 | 中间导航链接 | 右侧 CTA 按钮 + 汉堡菜单
- 响应式: 桌面完整显示，移动端汉堡菜单收起

导航菜单结构:

- 首页: 部门介绍 / 学习方向 / 加入我们
- 部门: 多媒体部(网站开发、UI设计、视频剪辑、小程序开发、编辑) / 软件部(深度学习、APP开发、游戏开发) / 硬件部(硬件开发) / 安全部(逆向工程、Web安全、Pwn)
- 学习: 练习编程 / 知识库
- 招新: QQ群 / QQ频道
- 更多: 近年获奖情况 / 项目活动 / 项目展廊 / 畅心所言

## 主页面 - 五面滚动结构

### 第一面: 主视觉

- 标题: `# 桂电三院科协`
- LOGO: 圆形 `public/logo.png`(支持 webp 降级) 居中
- 标语: 科技融入梦想，创新点缀人生
- 按钮组: QQ群(加入我们) / 终端(练习编程) / 服务器(知识库) / #(QQ频道)
- 背景: 纯色暗底 `#04080C`

### 第二面: 部门介绍

- 标题: `# 部门介绍`
- 包含五个内容组: 多媒体部、软件部、硬件部、组织部、安全部
- 每个内容组含标题和介绍文字
- 容器: `1px` 直角边框，透明底

### 第三面: 学习方向

- 标题: `# 学习方向`
- 图标+标题组合展示各方向: 前端开发(Web地球)、后端开发(Java)、游戏开发(手柄)、APP开发(手机)、UI设计(尺子三角器)、硬件开发(芯片)、深度学习(Python)、视频剪辑(导演Cut板)、逆向工程(dbgx64)、密码学(锁与钥匙)、Web安全(bug)、PWN(ghost)、编辑(书与笔)
- 容器: `1px` 直角边框，透明底

### 第四面: 加入我们

- 标题: `# 加入我们`
- 左侧: 招新时间线(报名阶段 → 入门学习 → 招新宣讲 → 笔试面试 → 绘蓝杯)
- 右侧: 科协介绍文字
- 容器: `1px` 直角边框，透明底

### 第五面: 近年参赛获奖

- 标题: 近年参赛获奖
- 备注: 2022、2021、2020 年国家级、省部级获奖的一部分

## 方向页面

通过 remark + remark-gfm 渲染 Markdown 介绍各学习方向。

数据文件:
- 前端开发: `public/docs/frontend.md`
- 后端开发: `public/docs/backend.md`
- UI设计: `public/docs/ui.md`
- 视频剪辑: `public/docs/media-editing.md`
- 编辑: `public/docs/editing.md`
- APP开发: `public/docs/app.md`
- 游戏开发: `public/docs/game.md`
- 嵌入式开发: `public/docs/hardware.md`
- 深度学习: `public/docs/deep-learning.md`
- 逆向工程: `public/docs/reverse.md`
- 密码学: `public/docs/crypt.md`
- Web安全: `public/docs/web-security.md`
- PWN: `public/docs/pwn.md`

## 近年获奖情况页面

数据与渲染分离。获奖等级颜色标准：

| 级别 | 颜色 |
|------|------|
| 国一 | `#C4A435` 古金 |
| 国二 | `#8899AA` 钢青 |
| 国三 | `#B87333` 铜红 |
| 省一 | `#5E9EC9` 中蓝 |
| 省二 | `#4A8B9E` 蓝绿 |
| 省三 | `#3D7A8C` 深蓝绿 |

数据结构:

```json
{
  "awards": [
    {
      "name": "比赛名称",
      "award": { "国一": 1, "国二": 2, "省三": 6 },
      "people": ["Alice", "Bob", "Charlie"]
    }
  ]
}
```

## 项目活动页面

数据与渲染分离。页面按三个 section 从上到下排列：科协优秀项目、竞赛展示项目、学习演示项目。

### 优秀项目 & 演示项目

共用 `Project` 数据结构：

```json
{
  "author": "wilinz",
  "authorAvatar": "https://github.com/wilinz.png",
  "name": "GUET 校园圈",
  "url": "https://www.guethub.net/",
  "language": "Dart(Flutter)",
  "languageColor": "#00B4AB",
  "description": "可以查看课表等教务信息，支持安卓和IOS"
}
```

模板: 作者头像 / 项目名称(可点击) / 简介 / 语言标签(带颜色圆点)

### 竞赛展示项目

使用 `CompetitionProject` 数据结构：

```json
{
  "authors": ["张三", "李四"],
  "authorAvatars": ["https://github.com/zhangsan.png", "https://github.com/lisi.png"],
  "teamName": "可选团队名",
  "name": "项目名称",
  "description": "项目描述",
  "competition": "比赛名称",
  "year": 2024,
  "url": "https://github.com/..."
}
```

模板: 头像堆叠(最多4个) / 团队名或人名列表 / 项目名称 / 简介 / 比赛标签(比赛名 · 年份)

## 畅心所言页面

基于 Github Issue 实现评论。数据源: `https://github.com/sanyuankexie/hello.kexie.space/issues/6`。注意防注入。

模板: CTA 按钮（实心按钮滑切动效）以无边框卡片格形式置于评论区网格首位 / 评论者头像 / 时间 / 内容(Markdown)

## 项目展廊页面 (`GalleryView.vue`)

数据文件: `src/data/gallery.ts`

类型定义:
- `GalleryItem.type`: `image` | `iframe` | `link`
- `GalleryItem.category`: `image` | `project` | `blog` | `other`

功能:
- 分类筛选标签(全部/图片/项目/博客/其他)
- 网格展示(桌面3列/平板2列/手机1列)，卡片悬浮效果
- 图片类型: 灯箱查看(方向键切换、ESC关闭、计数显示)
- iframe 类型: 弹窗预览(95%屏幕、ESC关闭、访问网站按钮)
- 链接类型: 直接跳转

## 页脚 (`AppFooter.vue`)

- 样式: 深底纯色块 `#04080C`，无边线，对称于导航栏
- 联系我们: Github / QQ群 / QQ频道 / 微信公众号 / Bilibili
- 站点信息: 版本号(`package.json`) / 仓库链接 / 当前时间
