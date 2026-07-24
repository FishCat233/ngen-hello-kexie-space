# 学习方向文档编写指南

每个学习方向（点击第三面卡片跳转的详情页）对应一篇 Markdown 文档，位于 `public/docs/introduction/`。

## 方向 ID ↔ 文件名映射

映射关系定义在 `src/views/DirectionView.vue` 的 `fileNames` 对象中：

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

> **注意**：方向 ID 由 `src/components/LearningDirectionsSection.vue` 中 `directions` 数组的 `id` 字段定义。新增或修改方向时需同步更新三处：
> ① `public/docs/introduction/` 下的 md 文档
> ② `DirectionView.vue` 中的 `fileNames` 和 `directionNames` 映射
> ③ `LearningDirectionsSection.vue` 中的 `directions` 数组

## Markdown 语法

文档使用标准 Markdown 格式，支持 [GFM](https://github.github.com/gfm/) 语法（表格、任务列表、删除线等），由 remark + remark-gfm 渲染。

### 图片

图片放在 `public/docs/introduction/image/` 目录下，md 中使用**站点根路径**引用：

```md
![描述](/docs/introduction/image/分类/文件名.png)
```

> 不要用 `./image/...` 相对路径。页面运行时 URL 是 `/direction/ui` 等形式，浏览器会把相对路径解析到错误位置。

### Bilibili 视频卡片

使用自定义语法嵌入 B 站视频播放器：

```md
::bilibili{BV1xx411c7mD}
```

渲染为 16:9 响应式嵌入式播放器卡片，底部有"在 Bilibili 中打开 →"链接指向原视频页面。实现位于 `src/utils/remark-bilibili.ts`，在 remark 解析前将语法替换为 HTML。

## 归档

`public/docs/introduction/old-docs/` 目录存放旧版方向文档，作为归档参考，不会被当前页面引用。
