# 部署和环境配置指南

## GitHub Environments 和 Secrets 设置

### 1. 创建 GitHub Environment

1. 转到你的 GitHub 仓库 -> Settings -> Environments
2. 点击 "New environment"
3. 输入环境名称: `production`
4. 点击 "Configure environment"
5. (可选) 设置保护规则，比如需要审核才能部署

### 2. 在 Environment 中设置 Secrets

在创建的 `production` 环境中，添加以下 environment secrets：

- `AWS_ACCESS_KEY_ID`: 你的 AWS Access Key ID
- `AWS_SECRET_ACCESS_KEY`: 你的 AWS Secret Access Key  
- `AWS_DEFAULT_REGION`: AWS 区域 (例如: us-east-1)

### 3. (可选) 创建 Staging 环境

如果需要测试环境，可以创建 `staging` 环境并设置相同的 secrets (使用不同的 AWS 凭据)

## 本地开发设置

1. 复制 `env.example` 文件为 `.env`：
   ```bash
   cp env.example .env
   ```

2. 编辑 `.env` 文件，填入你的实际 AWS 凭据：
   ```
   AWS_ACCESS_KEY_ID=你的实际access_key
   AWS_SECRET_ACCESS_KEY=你的实际secret_key
   AWS_DEFAULT_REGION=us-east-1
   PORT=8000
   NODE_ENV=production
   VITE_API_URL=/api
   VITE_WS_URL=wss://xpectrum-ai.com/api/ws/audio
   ```

3. 启动应用：
   ```bash
   # 使用新的 Docker Compose 命令
   docker compose up -d
   
   # 或者如果你的系统还使用旧版本
   docker-compose up -d
   ```

## Docker Compose 版本说明

⚠️ **重要提醒**: 我们的 GitHub Actions 使用新的 `docker compose` 命令（无连字符）。

- **新版本** (推荐): `docker compose`
- **旧版本**: `docker-compose`

如果你在本地使用旧版本的 docker-compose，请确保：
1. 本地测试时使用 `docker-compose`
2. GitHub Actions 使用 `docker compose`（已配置）

## 部署流程

### 自动部署
当代码推送到 `main` 分支时，GitHub Actions 会：
1. 自动从 Environment Secrets 读取环境变量
2. 验证 Docker 安装
3. 构建和启动服务
4. 运行健康检查
5. 清理资源

### 手动部署
你也可以在 GitHub Actions 页面手动触发部署，并选择目标环境（production 或 staging）。

## 故障排除

### Docker Compose 命令问题
如果遇到 "docker-compose: command not found" 错误：
- 确保使用 `docker compose`（新版本）而不是 `docker-compose`
- 检查 Docker 版本：`docker --version`
- 检查 Compose 版本：`docker compose version`

### AWS 权限问题
如果遇到 AWS 权限问题，请检查：
1. AWS 凭据是否正确设置在 GitHub Environment Secrets 中
2. AWS IAM 用户是否有足够的权限
3. AWS 区域设置是否正确

### 健康检查失败
如果健康检查失败：
1. 检查容器日志：`docker compose logs`
2. 确认端口映射正确（8000 for backend, 8084 for frontend）
3. 检查防火墙设置

## 安全最佳实践

- ✅ 使用 GitHub Environment Secrets 而不是 Repository Secrets
- ✅ `.env` 文件已被添加到 `.gitignore`
- ✅ 永远不要在代码中硬编码敏感信息
- ✅ 定期轮换 AWS 凭据
- ✅ 为生产环境设置审核流程
- ✅ 使用不同的 AWS 凭据区分环境