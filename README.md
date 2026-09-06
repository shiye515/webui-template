# webui-template

一个基于 Vite + Hono 的 Web UI CLI 模板，用于替代 Electron。前端采用独立的 Vite React 工程，后端使用标准的 Hono 框架；开发环境中前端通过 Vite 代理指向后端 API，生产环境中全局安装后的 CLI 由 Hono 统一提供静态资源服务。

## 架构

- `apps/web`: Vite + React + Tailwind + shadcn 风格组件
- `apps/server`: Hono 后端 API 与静态资源服务
- `scripts/build-cli.mjs`: 打包产物并生成适合全局安装的 CLI

## 模板初始化方式

复制这个模板到新项目后，运行 `pnpm rename <your-cli-name>` 来替换 CLI 名称，并同步更新本地/全局数据目录名称。

```bash
# 1. 复制本模板
cp -R webui-template <your-project>
cd <your-project>

# 2. 安装依赖
pnpm install

# 3. 重命名 CLI 和数据目录
# 将模板默认的 myapp 替换为 myapp
pnpm rename myapp
```

`rename` 会执行这些动作：

- 把项目中的 `myapp` 替换为你提供的命令名（例如 `myapp`）
- 更新 `package.json` 的 `cliName`
- 在项目根目录创建 `.myapp` 数据目录，并写入 `.gitignore`
- 生成新的全局命令名与对应的全局数据目录 `~/.myapp`

## 开发

```bash
pnpm install
pnpm dev
```

- 前端: http://localhost:8871
- 后端: http://localhost:8872/api/health

## 生产构建 / 全局安装

```bash
pnpm build
pnpm global
# 等价于：pnpm install -g ./dist
```

现在可以使用新命令：

```bash
myapp serve
myapp service start
myapp service stop
```

卸载全局命令：

```bash
pnpm unglobal
# 等价于：pnpm uninstall -g myapp
```

访问地址：
- http://localhost:8073
