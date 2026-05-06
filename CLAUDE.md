# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 协作规则

1. **所有回复和对话使用中文**
2. **需求模糊时先提问**，不要假设意图
3. **写完代码后列出边缘情况**（如：节点无连接、容器宽度为0、重复初始化等）
4. **涉及超过3个文件时先拆解任务**，逐步确认再执行
5. **出现 bug 时先写复现步骤**，再动手修改
6. **被纠正后制定不再犯的计划**，明确说明下次如何处理同类问题

---

## 项目概述

**Nomadic Ecology — Foldscape Habitat**：一个静态单页演示网站，用于展示极地折叠建筑研究。无构建工具，直接用浏览器打开 `index.html` 即可运行。

## 文件结构

| 文件 | 职责 |
|---|---|
| `index.html` | 全部 HTML，9个 section（sec-0 ～ sec-8），含导航栏 |
| `css/style.css` | 全部样式 |
| `js/main.js` | 导航逻辑（`goTo`、`switchTab`、`switchScaleTab`）；图表懒初始化 |
| `js/charts.js` | Section 1 的 Chart.js 图表（`initSection1Charts`） |
| `js/section3.js` | Section 3 的折叠几何动画 |
| `js/sankey.js` | Section 5 的 D3 Sankey 图（`initSankey`） |
| `antarctic_research_population_dataset.js` | Section 1 图表的原始数据集 |
| `数据文件/空间对应单元.xlsx` | Section 5 Sankey 连接关系的数据来源 |

## 架构要点

### 页面导航
- `goTo(index)` 切换 section，通过 `.active` class 控制显示/隐藏
- 键盘左右箭头也可导航
- `switchTab(secIndex, tabKey)` 管理 section 内的标签页切换

### 懒初始化模式
图表在首次进入对应 section/tab 时才初始化，用 `chartsReady` 对象或 `container.dataset.init` 防止重复初始化：
- Section 1 图表：`goTo(1)` 时触发
- Sankey：`switchTab(5, 'flow')` 时触发，延迟 80ms

### D3 Sankey（js/sankey.js）
- 使用 d3@7 + d3-sankey@0.12.3（CDN）
- **三层结构**：功能空间（左，16节点）→ 关节组合（中，5节点）→ 关节类型（右，4节点）
- **关键路由逻辑**：单关节空间直接左→右连接，跳过中间层；多关节空间才经过中间节点
- 节点的 `layer` 属性仅用于标签定位，d3-sankey 自身通过拓扑计算深度
- 流量守恒：每个中间节点的入流总量 = 出流总量

### 外部依赖（CDN，无 npm）
- Chart.js 4.4.0
- D3 v7
- d3-sankey 0.12.3
- Google Fonts: Space Grotesk + Space Mono
