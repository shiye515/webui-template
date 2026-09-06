# webui-template

一个面向 startup 与产品迭代的轻量 Web UI CLI 模板，专为替代 Electron 而设计。它用 Vite 打造前端体验，用 Hono 提供高性能后端与静态资源服务，保持前后端解耦，同时让最终产品从一个简单的命令行入口直接运行在浏览器里。

相比传统桌面应用，这个模板更适合跨平台分发：开发效率高、安装体验简单、资源占用低，更容易在真实用户场景中快速试错。你可以在同一套代码基础上持续迭代产品，不需要为桌面端打包、签名、更新分发链路耗费大量时间。

它非常适合团队在 MVP 阶段快速验证需求、做功能实验、收集反馈，并且能够在不牺牲体验的前提下快速上线。对于需要低成本启动、快速迭代与广泛分发的产品来说，这是一种更敏捷、更适合创业团队的交付方式。

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
