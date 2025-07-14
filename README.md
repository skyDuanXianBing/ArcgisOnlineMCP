# ArcGIS Online MCP Server

[English](#english) | [中文](#中文)

---

## English

### Overview

ArcGIS Online MCP Server is a Model Context Protocol (MCP) server that provides seamless integration with ArcGIS Online services. This server enables AI assistants and applications to interact with ArcGIS Online FeatureLayers through a standardized interface, supporting comprehensive CRUD operations for spatial data.

### Features

- **Query Features**: Search and retrieve features from ArcGIS Online FeatureLayers with custom WHERE clauses
- **Feature Management**: Complete CRUD operations for spatial features
  - Add new features (Point, Line, Polygon)
  - Update existing feature attributes
  - Update feature geometries
  - Delete features
- **Geometry Support**: Full support for all major geometry types
  - Point geometries with latitude/longitude coordinates
  - Polyline geometries with coordinate arrays
  - Polygon geometries with automatic ring closure
- **Flexible Spatial Reference**: Support for different coordinate systems (default: WGS84/EPSG:4326)
- **MCP Protocol**: Built on the Model Context Protocol for seamless AI integration

### Prerequisites

- Node.js 18+ or Bun runtime
- ArcGIS Online account with API key
- Access to ArcGIS Online FeatureLayers

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ArcgisOnlineMCP
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Build the project:
```bash
npm run build
# or
bun run build
```

### Usage

There are multiple ways to use this MCP server:

#### Option 1: Install from NPM (Recommended)

Install globally:
```bash
npm install -g arcgisonline-mcp-server
```

Or run directly with npx:
```bash
npx arcgisonline-mcp-server
```

#### Option 2: Use via Smithery.ai (Cloud Hosting)

Visit [Smithery.ai](https://smithery.ai) and search for "ArcGIS Online MCP Server" to use it directly in the cloud without local installation.

#### Option 3: Local Development

1. Clone and build:
```bash
git clone <repository-url>
cd ArcgisOnlineMCP
npm install
npm run build
```

2. Run locally:
```bash
npm start
# or for Smithery-compatible mode
npm run start:smithery
```

#### Development Mode

For development with auto-rebuild:
```bash
npm run watch
# or
bun run watch
```

### Available Tools

#### 1. query
Query features from an ArcGIS Online FeatureLayer.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `where` (string, optional): SQL WHERE clause (default: "1=1")

#### 2. addPointFeature
Add a new point feature to a FeatureLayer.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `attributes` (object): Feature attributes
- `latitude` (number): Latitude coordinate
- `longitude` (number): Longitude coordinate
- `wkid` (number, optional): Spatial reference WKID (default: 4326)

#### 3. addLineFeature
Add a new line feature to a FeatureLayer.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `attributes` (object): Feature attributes
- `coordinates` (array): Array of coordinate objects with latitude/longitude
- `wkid` (number, optional): Spatial reference WKID (default: 4326)

#### 4. addPolygonFeature
Add a new polygon feature to a FeatureLayer.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `attributes` (object): Feature attributes
- `coordinates` (array): Array of coordinate objects with latitude/longitude
- `wkid` (number, optional): Spatial reference WKID (default: 4326)

#### 5. updateFeatureAttributes
Update only the attributes of an existing feature.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `objectId` (number): Object ID of the feature to update
- `attributes` (object): Updated feature attributes

#### 6. updatePointGeometry
Update only the geometry of an existing point feature.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `objectId` (number): Object ID of the feature to update
- `latitude` (number): New latitude coordinate
- `longitude` (number): New longitude coordinate
- `wkid` (number, optional): Spatial reference WKID (default: 4326)

#### 7. updateLineGeometry
Update only the geometry of an existing line feature.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `objectId` (number): Object ID of the feature to update
- `coordinates` (array): Array of coordinate objects with latitude/longitude
- `wkid` (number, optional): Spatial reference WKID (default: 4326)

#### 8. updatePolygonGeometry
Update only the geometry of an existing polygon feature.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `objectId` (number): Object ID of the feature to update
- `coordinates` (array): Array of coordinate objects with latitude/longitude
- `wkid` (number, optional): Spatial reference WKID (default: 4326)

#### 9. deleteFeature
Delete a feature from a FeatureLayer.

**Parameters:**
- `url` (string): FeatureLayer URL
- `apikey` (string): ArcGIS Online API key
- `objectId` (number): Object ID of the feature to delete

### Project Structure

```
ArcgisOnlineMCP/
├── src/
│   ├── index.ts          # Entry point and server initialization
│   └── server.ts         # MCP server implementation with tools
├── dist/                 # Compiled JavaScript output
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Deployment Guide

#### Deploy to NPM Registry

1. **Prepare for publishing:**
   ```bash
   npm run build
   ```

2. **Login to NPM:**
   ```bash
   npm login
   ```

3. **Publish the package:**
   ```bash
   npm publish
   ```

#### Deploy to Smithery.ai

1. **Push to GitHub:**
   - Ensure your code is in a GitHub repository
   - Include the `smithery.yaml` file in the root

2. **Connect to Smithery:**
   - Visit [Smithery.ai](https://smithery.ai)
   - Connect your GitHub account
   - Find your repository and claim the server

3. **Deploy:**
   - Navigate to the Deployments tab
   - Click "Deploy" to build and host your server

### Dependencies

- **@arcgis/core**: ArcGIS API for JavaScript
- **@modelcontextprotocol/sdk**: MCP SDK for server implementation
- **@chatmcp/sdk**: Additional MCP utilities
- **zod**: Schema validation library

### License

MIT License - see package.json for details.

### Author

Sky.DuAN

---

## 中文

### 概述

ArcGIS Online MCP Server 是一个基于模型上下文协议（MCP）的服务器，提供与 ArcGIS Online 服务的无缝集成。该服务器使 AI 助手和应用程序能够通过标准化接口与 ArcGIS Online 要素图层进行交互，支持空间数据的完整 CRUD 操作。

### 功能特性

- **要素查询**: 使用自定义 WHERE 子句搜索和检索 ArcGIS Online 要素图层中的要素
- **要素管理**: 空间要素的完整 CRUD 操作
  - 添加新要素（点、线、面）
  - 更新现有要素属性
  - 更新要素几何形状
  - 删除要素
- **几何支持**: 全面支持所有主要几何类型
  - 使用经纬度坐标的点几何
  - 使用坐标数组的折线几何
  - 具有自动环闭合的面几何
- **灵活的空间参考**: 支持不同的坐标系统（默认：WGS84/EPSG:4326）
- **MCP 协议**: 基于模型上下文协议构建，实现无缝 AI 集成

### 系统要求

- Node.js 18+ 或 Bun 运行时
- 具有 API 密钥的 ArcGIS Online 账户
- 访问 ArcGIS Online 要素图层的权限

### 安装

1. 克隆仓库：
```bash
git clone <repository-url>
cd ArcgisOnlineMCP
```

2. 安装依赖：
```bash
npm install
# 或
bun install
```

3. 构建项目：
```bash
npm run build
# 或
bun run build
```

### 使用方法

有多种方式使用此 MCP 服务器：

#### 方式1：从 NPM 安装（推荐）

全局安装：
```bash
npm install -g arcgisonline-mcp-server
```

或使用 npx 直接运行：
```bash
npx arcgisonline-mcp-server
```

#### 方式2：通过 Smithery.ai 使用（云端托管）

访问 [Smithery.ai](https://smithery.ai) 并搜索 "ArcGIS Online MCP Server" 即可在云端直接使用，无需本地安装。

#### 方式3：本地开发

1. 克隆并构建：
```bash
git clone <repository-url>
cd ArcgisOnlineMCP
npm install
npm run build
```

2. 本地运行：
```bash
npm start
# 或 Smithery 兼容模式
npm run start:smithery
```

#### 开发模式

用于自动重建的开发模式：
```bash
npm run watch
# 或
bun run watch
```

### 可用工具

#### 1. query
从 ArcGIS Online 要素图层查询要素。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `where` (字符串，可选): SQL WHERE 子句（默认："1=1"）

#### 2. addPointFeature
向要素图层添加新的点要素。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `attributes` (对象): 要素属性
- `latitude` (数字): 纬度坐标
- `longitude` (数字): 经度坐标
- `wkid` (数字，可选): 空间参考 WKID（默认：4326）

#### 3. addLineFeature
向要素图层添加新的线要素。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `attributes` (对象): 要素属性
- `coordinates` (数组): 包含经纬度的坐标对象数组
- `wkid` (数字，可选): 空间参考 WKID（默认：4326）

#### 4. addPolygonFeature
向要素图层添加新的面要素。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `attributes` (对象): 要素属性
- `coordinates` (数组): 包含经纬度的坐标对象数组
- `wkid` (数字，可选): 空间参考 WKID（默认：4326）

#### 5. updateFeatureAttributes
仅更新现有要素的属性。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `objectId` (数字): 要更新的要素的对象 ID
- `attributes` (对象): 更新的要素属性

#### 6. updatePointGeometry
仅更新现有点要素的几何形状。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `objectId` (数字): 要更新的要素的对象 ID
- `latitude` (数字): 新的纬度坐标
- `longitude` (数字): 新的经度坐标
- `wkid` (数字，可选): 空间参考 WKID（默认：4326）

#### 7. updateLineGeometry
仅更新现有线要素的几何形状。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `objectId` (数字): 要更新的要素的对象 ID
- `coordinates` (数组): 包含经纬度的坐标对象数组
- `wkid` (数字，可选): 空间参考 WKID（默认：4326）

#### 8. updatePolygonGeometry
仅更新现有面要素的几何形状。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `objectId` (数字): 要更新的要素的对象 ID
- `coordinates` (数组): 包含经纬度的坐标对象数组
- `wkid` (数字，可选): 空间参考 WKID（默认：4326）

#### 9. deleteFeature
从要素图层删除要素。

**参数：**
- `url` (字符串): 要素图层 URL
- `apikey` (字符串): ArcGIS Online API 密钥
- `objectId` (数字): 要删除的要素的对象 ID

### 项目结构

```
ArcgisOnlineMCP/
├── src/
│   ├── index.ts          # 入口点和服务器初始化
│   └── server.ts         # 带工具的 MCP 服务器实现
├── dist/                 # 编译后的 JavaScript 输出
├── package.json          # 项目配置和依赖
├── tsconfig.json         # TypeScript 配置
└── README.md            # 本文件
```

### 部署指南

#### 部署到 NPM Registry

1. **准备发布：**
   ```bash
   npm run build
   ```

2. **登录 NPM：**
   ```bash
   npm login
   ```

3. **发布包：**
   ```bash
   npm publish
   ```

#### 部署到 Smithery.ai

1. **推送到 GitHub：**
   - 确保您的代码在 GitHub 仓库中
   - 在根目录包含 `smithery.yaml` 文件

2. **连接到 Smithery：**
   - 访问 [Smithery.ai](https://smithery.ai)
   - 连接您的 GitHub 账户
   - 找到您的仓库并声明服务器

3. **部署：**
   - 导航到 Deployments 选项卡
   - 点击 "Deploy" 构建并托管您的服务器

### 依赖项

- **@arcgis/core**: ArcGIS API for JavaScript
- **@modelcontextprotocol/sdk**: 用于服务器实现的 MCP SDK
- **@chatmcp/sdk**: 额外的 MCP 工具
- **zod**: 模式验证库

### 许可证

MIT 许可证 - 详情请参见 package.json。

### 作者

Sky.DuAN