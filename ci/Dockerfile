# 构建阶段 - 使用 Node 22 LTS (最新长期支持版本)
FROM node:22-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

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
