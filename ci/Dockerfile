# 构建阶段
FROM node:20-slim AS builder

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

# 运行阶段
FROM caddy:2-alpine

# 复制构建产物
COPY --from=builder /app/dist /srv

# 复制 Caddyfile
COPY ci/Caddyfile /etc/caddy/Caddyfile

# 暴露 80 端口
EXPOSE 80
