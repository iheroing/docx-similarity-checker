# Chrome Web Store 审核问题修复指南

## 问题描述

Chrome Web Store 审核反馈指出扩展程序使用了过于宽泛的主机权限，需要进行以下修改以通过审核。

## 已修复的问题

### 1. 权限配置优化

**问题**: 使用了 `"*://*/*"` 宽泛的主机权限和不必要的 `scripting` 权限

**解决方案**: 
- 移除 `host_permissions` 中的 `"*://*/*"`
- 将 `scripting` 权限替换为 `activeTab` 权限
- 保留必要的 `sidePanel`、`storage`、`downloads` 权限

**修改后的权限配置**:
```json
{
  "permissions": [
    "sidePanel",
    "storage",
    "activeTab",
    "downloads"
  ]
}
```

### 2. 隐私政策完善

**已完成的隐私政策相关修改**:
- 创建了 `privacy.html` 页面
- 在 `manifest.json` 中添加了隐私政策链接
- 在插件界面添加了隐私政策链接和弹窗功能
- 创建了用于 GitHub Pages 部署的 `privacy-policy.md`

## 修改的文件清单

### 核心修改
1. **manifest.json** - 优化权限配置
   - 移除宽泛的主机权限
   - 使用 activeTab 替代 scripting 权限

### 之前已完成的隐私政策修改
2. **privacy.html** - 隐私政策页面
3. **sidepanel.html** - 添加页脚和隐私政策链接
4. **css/styles.css** - 页脚样式
5. **js/sidepanel.js** - 隐私政策弹窗功能
6. **privacy-policy.md** - GitHub Pages 隐私政策

## 功能验证

### 权限变更影响分析
- ✅ **activeTab 权限**: 允许扩展程序在用户明确操作时访问当前标签页
- ✅ **sidePanel 权限**: 支持侧边栏功能
- ✅ **storage 权限**: 支持本地数据存储
- ✅ **downloads 权限**: 支持文件下载功能
- ✅ **移除 scripting 权限**: 代码中未使用 chrome.scripting API，移除安全
- ✅ **移除宽泛主机权限**: 插件主要处理本地文件，不需要访问所有网站

### 核心功能保持不变
- ✅ 文档上传和解析功能
- ✅ 查重算法和相似度计算
- ✅ 结果展示和导出功能
- ✅ 侧边栏界面和用户交互
- ✅ 本地数据处理和隐私保护

## 部署步骤

### 1. GitHub Pages 隐私政策部署

1. 将 `privacy-policy.md` 推送到 GitHub 仓库
2. 在 GitHub 仓库设置中启用 GitHub Pages
3. 确保隐私政策可通过以下链接访问：
   `https://liyi-docchecker.github.io/privacy-policy/`

### 2. 重新打包扩展程序

```bash
# 创建发布包
zip -r "文档查重助手Pro-v2.1.zip" . -x "*.git*" "node_modules/*" "*.DS_Store" "tools/*" "*.md" "package.json"
```

### 3. Chrome Web Store 重新提交

1. 登录 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole/)
2. 选择现有的扩展程序
3. 上传新的 zip 包
4. 更新版本号为 2.1
5. 在描述中强调隐私保护特性：
   - 完全本地处理
   - 零数据上传
   - 无远程存储
   - 使用最小权限原则

## 审核要点说明

### 权限使用说明
- **activeTab**: 仅在用户明确操作时访问当前标签页，符合最小权限原则
- **sidePanel**: 提供侧边栏用户界面
- **storage**: 存储用户设置和临时数据（本地存储）
- **downloads**: 支持查重报告下载功能

### 隐私保护承诺
- 所有文档处理完全在本地进行
- 不收集、存储或传输用户文档内容
- 不使用网络连接处理用户数据
- 符合 GDPR 和其他隐私法规要求

## 注意事项

1. **权限最小化**: 现在使用的权限是功能运行的最小必要权限
2. **隐私优先**: 所有数据处理都在用户设备本地完成
3. **审核友好**: 移除了可能引起审核关注的宽泛权限
4. **功能完整**: 核心查重功能完全不受影响

## 预期结果

通过这些修改，扩展程序应该能够顺利通过 Chrome Web Store 的审核，因为：
- 使用了最小必要权限
- 提供了完整的隐私政策
- 符合 Chrome Web Store 的安全和隐私要求
- 功能明确且不涉及敏感操作