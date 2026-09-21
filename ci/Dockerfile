# 构建阶段 - 使用 Node 22 LTS (最新长期支持版本)
#
# 用 Debian(glibc) 而非 alpine(musl)：package.json 里的 packageManager 会触发
# pnpm 版本切换，而 @pnpm/exe 没有 linux-x64-musl 的原生二进制（ERR_PNPM_PNPM_ENGINE_NO_NATIVE_BINARY）。
FROM node:22-slim AS builder

# 安装 pnpm（固定版本，与 package.json 的 packageManager 保持一致）
RUN npm install -g pnpm@10.2.1

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm run build

# 运行阶段 - 使用 Caddy 2.8 (最新稳定版本)
FROM caddy:2.8-alpine

# 复制构建产物
COPY --from=builder /app/dist /srv

# 复制 Caddyfile
COPY ci/Caddyfile /etc/caddy/Caddyfile

# 暴露 80 端口
EXPOSE 80
