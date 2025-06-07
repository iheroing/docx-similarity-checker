# 文档查重助手 Pro

<div align="center">

![Logo](icons/icon128.png)

**智能文档查重助手，快速检测重复内容，提升工作效率**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-repo)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange.svg)](https://chrome.google.com/webstore)

[功能特点](#功能特点) • [安装指南](#安装指南) • [使用教程](#使用教程) • [技术支持](#技术支持)

</div>

## 📖 项目简介

文档查重助手 Pro 是一款专为教育工作者设计的 Chrome 浏览器扩展，主要用于检测试题文档中的重复内容。通过先进的文本相似度算法，帮助教师快速识别重复试题，提高试卷质量和工作效率。

### 🎯 适用场景

- **教育机构**：试卷编制、题库管理
- **培训机构**：课程内容查重、教材编写
- **个人教师**：作业批改、试题整理
- **学术研究**：文献查重、内容分析

## ✨ 功能特点

### 🔍 智能查重引擎
- **高精度算法**：基于先进的文本相似度算法，准确识别重复内容
- **语义理解**：不仅检测字面重复，还能识别语义相似的内容
- **多层次分析**：支持句子级、段落级、文档级多维度查重

### 📄 多格式支持
- **Word 文档**：完美支持 .docx 格式
- **PDF 文档**：智能解析 PDF 文本内容
- **混合查重**：支持 Word 和 PDF 文档混合批量处理
- **格式保持**：保持原文档格式和结构

### 📊 详细分析报告
- **可视化结果**：直观的相似度百分比显示
- **分级标记**：红色（高度重复）、黄色（中度重复）、绿色（低度重复）
- **详细对比**：显示具体重复内容和位置
- **Excel 导出**：支持将查重结果导出为 Excel 文件

### 🎛️ 灵活配置
- **自定义阈值**：可调整相似度阈值（建议 70-80%）
- **批量处理**：支持最多 10 个文档同时查重
- **实时预览**：查重过程实时显示进度

### 🎨 现代化界面
- **简洁设计**：清爽的用户界面，操作简单直观
- **响应式布局**：适配不同屏幕尺寸
- **毛玻璃效果**：现代化的视觉设计
- **流畅动画**：优雅的交互体验

## 🚀 安装指南

### 方法一：开发者模式安装（推荐）

1. **下载源码**
   ```bash
   git clone https://github.com/your-repo/docx-similarity-checker.git
   cd docx-similarity-checker
   ```

2. **打开 Chrome 扩展管理**
   - 在地址栏输入：`chrome://extensions/`
   - 或通过菜单：更多工具 → 扩展程序

3. **启用开发者模式**
   - 点击右上角的"开发者模式"开关

4. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹
   - 确认安装

### 方法二：CRX 文件安装

1. **下载安装包**
   - 下载 `文档查重助手 Pro.crx` 文件

2. **安装扩展**
   - 打开 `chrome://extensions/`
   - 将 .crx 文件拖放到浏览器窗口
   - 点击"添加扩展程序"

> ⚠️ **注意**：由于 Chrome 安全策略，建议使用方法一进行安装。

## 📚 使用教程

### 快速开始

1. **启动插件**
   - 点击浏览器工具栏中的插件图标
   - 侧边栏将自动打开

2. **选择查重模式**
   - **单文档查重**：检查单个文档内部的重复内容
   - **多文档查重**：检查多个文档之间的重复内容

3. **上传文档**
   - 点击"选择文档"按钮
   - 选择需要查重的文档（支持 .docx 和 .pdf）
   - 可同时选择多个文档

4. **配置参数**
   - 调整相似度阈值（建议 70-80%）
   - 确认查重设置

5. **开始查重**
   - 点击"开始查重"按钮
   - 等待处理完成

6. **查看结果**
   - 查看详细的查重报告
   - 导出 Excel 文件（可选）

### 高级功能

#### 相似度阈值设置

| 阈值范围 | 建议用途 | 说明 |
|---------|---------|------|
| 90-100% | 精确查重 | 检测几乎完全相同的内容 |
| 70-89% | 标准查重 | 平衡准确性和覆盖面 |
| 50-69% | 宽松查重 | 检测更多潜在重复内容 |
| < 50% | 不推荐 | 可能产生大量误报 |

#### 文档格式要求

**支持的题号格式：**
- 数字格式：`1.` `1、` `1）` `1.`
- 中文格式：`一、` `二、` `三、`
- 字母格式：`A.` `A、` `A）`

**文档要求：**
- 文档不能加密或受密码保护
- 建议文档大小不超过 50MB
- PDF 文档建议为文字版本（非扫描版）

## 📋 查重结果说明

### 相似度等级

- 🔴 **高度重复（≥90%）**：内容几乎完全相同，建议修改
- 🟡 **中度重复（70-89%）**：存在明显相似性，需要注意
- 🟢 **低度重复（<70%）**：相似度较低，可以接受

### 报告内容

- **总体统计**：重复题目数量、重复率统计
- **详细对比**：具体重复内容和位置标注
- **相似度分析**：每对重复内容的相似度百分比
- **建议操作**：针对不同重复等级的处理建议

## 🛠️ 技术架构

### 核心技术

- **前端框架**：原生 JavaScript + HTML5 + CSS3
- **文档解析**：Mammoth.js (Word) + PDF.js (PDF)
- **相似度算法**：余弦相似度 + 编辑距离
- **数据存储**：Chrome Storage API
- **文件处理**：JSZip + XLSX.js

### 项目结构

```
文档查重助手 Pro/
├── manifest.json          # 扩展配置文件
├── sidepanel.html         # 主界面
├── background.js          # 后台脚本
├── css/
│   └── styles.css         # 样式文件
├── js/
│   ├── sidepanel.js       # 主逻辑
│   ├── document-parser.js # 文档解析
│   ├── text-similarity.js # 相似度算法
│   └── report-generator.js # 报告生成
├── lib/                   # 第三方库
├── icons/                 # 图标资源
└── tools/                 # 开发工具
```

## 🔒 隐私与安全

### 数据安全承诺

- ✅ **本地处理**：所有文档处理均在本地完成
- ✅ **零上传**：不会上传任何文档内容到服务器
- ✅ **无存储**：不会永久保存任何文档数据
- ✅ **权限最小化**：仅申请必要的浏览器权限

### 权限说明

| 权限 | 用途 | 说明 |
|------|------|------|
| sidePanel | 侧边栏显示 | 用于显示查重界面 |
| storage | 本地存储 | 保存用户设置和临时数据 |
| downloads | 文件下载 | 导出查重结果 |
| scripting | 脚本执行 | 文档处理和分析 |

## 🆘 常见问题

### 安装问题

**Q: 安装时提示"无法加载扩展程序"？**
A: 请确保已启用开发者模式，并选择正确的项目根目录。

**Q: 扩展安装后无法使用？**
A: 请检查 Chrome 版本是否支持 Manifest V3（Chrome 88+）。

### 使用问题

**Q: 上传文档后没有反应？**
A: 请检查文档格式是否正确，确保文档未加密且大小合理。

**Q: 查重结果不准确？**
A: 可以尝试调整相似度阈值，或检查文档中是否包含大量格式化内容。

**Q: 处理大文档时很慢？**
A: 这是正常现象，大文档需要更多处理时间，请耐心等待。

### 性能优化

**Q: 如何提高查重速度？**
A: 
- 移除文档中的图片和表格
- 删除重复的说明文字
- 分批处理大量文档

## 🔄 更新日志

### v2.0.0 (2025-06-6)

#### 🎉 重要更新
- ✨ 支持单文档和多文档查重
- ✨ 支持 Word (.docx) 和 PDF (.pdf) 格式
- ✨ 智能相似度检测算法
- ✨ 可视化查重结果展示
- ✨ Excel 报告导出功能
- ✨ 自定义相似度阈值
- ✨ 现代化用户界面设计
- ✨ 响应式布局支持

#### 🛠️ 技术特性
- 🔧 基于 Manifest V3 开发
- 🔧 本地文档处理，保护隐私
- 🔧 高性能文本相似度算法
- 🔧 支持批量文档处理

## 🤝 技术支持

### 联系方式

- 📧 **邮箱支持**：[your-email@example.com](mailto:your-email@example.com)
- 🐛 **问题反馈**：[GitHub Issues](https://github.com/your-repo/issues)
- 📱 **社交媒体**：
  - 🎵 抖音：[李老师聊医学](https://v.douyin.com/KWLNwyhxiSQ/)
  - 📖 小红书：[医考李老师](https://www.xiaohongshu.com/user/profile/61d313ec000000001000e0df)

### 获取帮助

1. **查看文档**：首先查阅本 README 和常见问题
2. **搜索问题**：在 GitHub Issues 中搜索类似问题
3. **提交反馈**：详细描述问题并提供相关信息
4. **社区交流**：关注社交媒体获取最新动态

## 🤝 贡献指南

我们欢迎社区贡献！如果您想为项目做出贡献，请遵循以下步骤：

### 开发环境设置

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-repo/docx-similarity-checker.git
   cd docx-similarity-checker
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **开发调试**
   - 在 Chrome 中加载扩展
   - 修改代码后重新加载扩展

### 提交贡献

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 JavaScript Standard Style
- 添加适当的注释和文档
- 确保代码通过所有测试

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。

```
MIT License

Copyright (c) 2024 李弋

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHERS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 致谢

感谢以下开源项目和贡献者：

- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) - Word 文档解析
- [PDF.js](https://github.com/mozilla/pdf.js) - PDF 文档解析
- [JSZip](https://github.com/Stuk/jszip) - ZIP 文件处理
- [XLSX.js](https://github.com/SheetJS/sheetjs) - Excel 文件生成

特别感谢所有测试用户和反馈者，您的建议让这个项目变得更好！

---

<div align="center">

**如果这个项目对您有帮助，请给我们一个 ⭐️**

[⬆️ 回到顶部](#文档查重助手-pro)
