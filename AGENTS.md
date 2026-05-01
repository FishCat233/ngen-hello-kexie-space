# NGEN-HELLO-KEXIE-SPACE

计算机学院大学生科技协会新版本主页

## 页面设计

### 主页面

主页面由上下滚动交互构成，每一面占满屏幕高度

第一面
- 内容
  - 标题: 桂电三院科协
  - LOGO: 圆形 `public/logo.png`，居中显示
  - 树干: 从 LOGO 向下延伸的渐变线条，连接后续内容
  - 标语: 科技融入梦想，创新点缀人生
  - 按钮组
    - `QQ群图标` 加入我们
    - `终端图标` 练习编程
    - `服务器图标` 科协知识库
    - `#图标` 科协QQ频道
- 背景
  - 色调
    - 黑色: 04080C
    - 亮蓝: 82D4F2
    - 亮青: 6FD0CE
    - 白色: EBFBFF
    - 备注: 科协主题色是亮蓝和亮青，白色作为高光，黑色作为低光和背景
    - 可以通过上述颜色调和得到新颜色
  - Threejs 渲染
    - 亮蓝色和亮青色 ASCII 字符作为明暗构成的栋楼校园模型
    - 鼠标移动会旋转模型
  - 曳光弹效果
    - 深蓝和深青色粒子从底部向上发射
    - Threejs Sprite 粒子系统，加法混合发光
    - 象征冉冉升起的新星

## AGENT 约束

每次完成任务后
- 使用 prettier 格式化代码
- 使用 eslint 校验代码规范

更新 AGENT.md 需要遵循
- 避免使用滥用 md 标题和表格
- 积极使用列表书写文档

## 技术选型

- vite: 前端构建工具
- Vue3: 前端框架
- Tailwind CSS: 前端样式框架
- Pinia: 前端状态管理
- pnpm: 前端包管理
- TypeScript: 前端类型检查
- Eslint: 前端代码规范
- Prettier: 前端代码格式化
- Three.js: 前端3D渲染

## 组件清单

- AsciiBackground: Threejs ASCII 校园模型背景
- TracerBullet: Threejs 曳光弹粒子效果
- HeroSection: 第一面主内容
