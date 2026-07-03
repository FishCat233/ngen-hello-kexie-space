# 弃用毛玻璃，转向排版驱动极简设计

全局设计语言从玻璃拟态（`backdrop-filter: blur()` + 半透明 `rgba`）全面翻新为纯色块 + Markdown 语法前缀 + 系统字体排版驱动极简。

**理由：** 毛玻璃在当前纯色暗底（Three.js 背景已移除）上失去了"透光模糊"的存在基础，仅在美学上产生模板化效果。新方向以科协 LOGO 主题色（`#82D4F2` 蓝 / `#6FD0CE` 青 / `#EBFBFF` 白 / `#04080C` 深底）为核心，用 `# 标题` Markdown 语法作为签名元素，直角纯色块替代所有半透明容器，零页面装饰动效。

**考虑过的替代方案：**
- 保留毛玻璃并重新设计背景层使其有意义 — 被否决，仍无法解决辨识度问题
- 引入第三方字体增强排版个性 — 被否决，字体加载成本不符合预期

**影响范围：** AppNavbar, AppFooter, HeroSection, DepartmentsSection, LearningDirectionsSection, RecruitmentSection, BackButton, AwardsView, CommentsView, DirectionView, ProjectsView, GalleryView, 全局样式文件。涉及 15+ 文件，全量替换 `backdrop-filter` / `rgba` 透明度为纯色。
