# figma-iconify-bot

自动化从 Figma 导出图标并生成 Iconify JSON npm 包。

## 功能简介

- 使用 [figma-export](https://github.com/marcomontalbano/figma-export) 从 Figma 文件导出 SVG 图标
- 使用 [@iconify/tools](https://iconify.design/docs/libraries/tools/) 处理 SVG 并生成 Iconify JSON 格式
- 自动递增 npm 包版本号，便于持续集成和发布

## 目录结构

```
figma-iconify-bot/
  build-iconify.js         # 构建脚本，处理 SVG 并生成 JSON 包
  figma.config.js          # Figma 导出配置
  json/                    # 生成的 npm 包目录
    icons.json             # Iconify JSON 图标数据
    package.json           # 生成的 npm 包元数据
    ...
  output/                  # Figma 导出的原始 SVG 文件（需先运行 fetch）
  package.json             # 本项目依赖与脚本
```

## 前置条件

- Node.js 16+
- Figma access token（需有 Figma 文件读取权限）

### 通过 Figma 插件触发工作流

你可以使用 [Continuous Design - Run CI from Figma](https://www.figma.com/community/plugin/977948326423807703/continuous-design-run-ci-from-figma) 插件，在 Figma 内直接触发本项目的自动化流程（如导出、构建、发布等），实现设计到代码的持续集成。

## 安装依赖

```bash
pnpm install
# 或 npm install
```

## 使用方法

### 1. 设置 Figma 文件 ID、Figma access token

可通过命令行参数或环境变量传递 fileId：

- **环境变量**
  ```bash
  $env:FILE_ID=YOUR_FIGMA_FILE_ID
  $env:FIGMA_TOKEN=YOUR_FIGMA_ACCESS_TOKEN
  ```

> `figma.config.js` 会自动读取 `process.env.FILE_ID` 作为 fileId。

### 2. 导出 Figma 图标

```bash
npm run fetch
```

- 该命令会根据 `figma.config.js` 配置，导出 Figma 文件中的 SVG 到 `output/` 目录。
- 需要设置好 Figma access token（可通过环境变量 `FIGMA_TOKEN` 传递）。

### 3. 构建 Iconify JSON 包

```bash
npm run build
```

- 处理 `output/icons` 下的 SVG，生成 `json/` 目录下的 npm 包。
- 自动递增 `json/package.json` 的 patch 版本号。

### 4. 发布 npm 包

```bash
npm run release
```

- 进入 `json/` 目录，发布生成的 npm 包到 npm registry。

## 输出说明

- `json/icons.json`：Iconify JSON 格式的图标数据
- `json/package.json`：自动生成，包含 name、version、exports 等字段
- 其他辅助文件：`index.js`、`index.mjs`、`index.d.ts` 等

## 自定义

- 可修改 `figma.config.js` 以适配不同 Figma 文件、页面、节点等
- 可在 `build-iconify.js` 中自定义 SVG 处理逻辑

## 依赖

- [@figma-export/cli](https://github.com/marcomontalbano/figma-export)
- [@iconify/tools](https://iconify.design/docs/libraries/tools/)

## License

MIT
