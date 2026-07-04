# 贡献指南

## 提交规范

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 规范。

版本号遵循 [SemVer](https://semver.org/)，由 [release-please](https://github.com/googleapis/release-please) 自动管理。

## 代码风格

项目使用 Prettier 格式化 + ESLint 检查。提交 PR 前运行质量门禁：

```bash
pnpm run format
pnpm run lint
```

CI 会在 push 时自动执行 lint 和 build，不通过则无法合并。

## PR 流程

1. Fork 仓库，从 `main` 创建 feature 分支
2. 开发和自测，通过质量门禁
3. 提交 PR 到 `main` 分支
4. CI 通过后即可合并

## 参考文档

- [CONTEXT.md](./CONTEXT.md) — 领域术语表
- [DESIGN.md](./DESIGN.md) — 设计系统与视觉规范
- [docs/spec.md](./docs/spec.md) — 页面设计规格
