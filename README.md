# 🚜 TractorCompare — 拖拉机规格对比工具

<!--
  这个项目前前后后打磨了很久——从最初只有 JD 和 Kubota 两张表，到现在覆盖五大品牌、
  雷达图可视化、深色模式、胜出算法……中间有好几次推倒重来。数据模型那层反复改过，
  因为同时在做 TractorVIN（序列号解码那边也需要一致的品牌/型号字段），两边对齐花了不少功夫。
  TractorWatch 的价格区间也交叉校验过这边的 MSRP 数据。
-->

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-000000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-3.8-22b5bf)](https://recharts.org)

**TractorCompare** 是 [TractorTools](https://github.com/seb/tractor-tools) 生态的规格数据库与对比引擎。它也是整个工具集里最早启动的项目——其他工具的机型数据、品牌枚举、参数命名规范都从这里"长"出去的。目前收录了 17 台拖拉机、5 个品牌、4 个级别分类，支持并排对比 + 雷达图 + 智能胜出判定。

---

## 🗺️ 项目生态

| 项目 | 定位 | 与本项目的关系 |
|------|------|---------------|
| [FarmCalc](../farm-calc) | 成本/ROI 计算 | 读取本项目的价格区间作为购买价输入 |
| [TractorLog](../tractor-log) | 维护日志 PWA | 维护周期参考数据来自本项目的发动机/液压参数 |
| [TractorVIN](../tractor-vin) | 序列号解码 | 品牌枚举、型号命名、系列分类保持一致 |
| [TractorWatch](../tractor-watch) | 二手价格追踪 | 二手挂牌价 vs MSRP 参考价交叉校验 |

---

## 中文

### 功能

- 🔍 **17 款真实拖拉机** — John Deere、Kubota、Massey Ferguson、Case IH、New Holland 五大品牌，从小型到重型全覆盖
- 📊 **并排对比 + 雷达图** — 5 项核心指标（马力、PTO马力、重量、液压流量、提升力）归一化雷达图，一眼看出谁在哪项占优
- 🏆 **智能胜出判定** — 不是简单比大小——按实用场景加权（农机干活看 PTO + 提升力，运输看马力 + 速度），自动标出谁更适合做什么
- 🎨 **深色模式** — 绿色/大地色系主题，localStorage 记忆偏好
- 📱 **响应式** — 手机上也能对比（雷达图在小屏自动缩小）
- 🇨🇳 中文界面

### 快速开始

```bash
npm install
npm run dev        # 开发模式 http://localhost:3000
npm run build      # 生产构建
npm start          # 生产运行
```

### 数据模型

每台拖拉机 20+ 个字段——这个 schema 是跟 [TractorVIN](../tractor-vin) 的解码输出对齐过的，两边用同样的字段名，方便以后打通：

```
Tractor {
  id, brand, model, series, category,
  horsepower, ptoHorsepower, engineDisplacement, cylinders,
  fuelCapacity, weight, wheelbase,
  hydraulicFlow, liftCapacity,
  transmission, maxSpeed, tireSize,
  priceMin, priceMax, yearIntroduced,
  countryOfOrigin
}
```

分类体系是按实际使用场景分的（不是按品牌分），跟 [FarmCalc](../farm-calc) 那边的折旧参数选择逻辑一致——重型农机推荐双倍余额递减法，小型机推荐直线法。

### 胜出算法说明

雷达图只比 5 项，但胜出判定会看全部 20 项。加权逻辑：
- **农田作业**（犁地/播种/旋耕）：PTO马力 3x + 提升力 2x + 液压流量 2x
- **运输**（拉挂车/转场）：马力 2x + 最高速度 2x + 重量 1x
- **综合作业**：等权平均

这个加权方案迭代了好几次——最初是简单的"谁绿条多谁赢"，后来参考了 [FarmCalc](../farm-calc) 那边更细致的成本拆分逻辑，把"干活效率"和"运营成本"拆开了。

### 项目结构

```
src/
├── app/                # Next.js App Router
│   ├── page.tsx            # 首页 — 品牌筛选 + 搜索 + 热门对比对
│   ├── compare/page.tsx    # 对比页 — 双选器 + 统计卡片 + 雷达图 + 参数表 + 胜出总结
│   └── layout.tsx          # 根布局 — 导航栏 + 深色模式切换
├── components/         # 可复用组件 (BrandFilter, CompareSelect, RadarChart, SpecTable, TractorCard, Header)
├── data/tractors.ts    # 拖拉机数据库 (17 款型号)
└── lib/                # 工具函数
```

### 支持的品牌与型号

| 品牌 | 型号 | 级别 |
|------|------|------|
| **John Deere** | 3038E, 5075E, 5100E, 6110M, 6175M | 紧凑型 · 通用型 · 行作物 · 重型 |
| **Kubota** | L3560, M7060, M8540, M100GX | 紧凑型 · 通用型 · 重型 |
| **Massey Ferguson** | 4708, 6713S, 7720S | 通用型 · 行作物 · 重型 |
| **Case IH** | Farmall 75C, Maxxum 125, Puma 185 | 通用型 · 行作物 · 重型 |
| **New Holland** | T5.100, T6.160, T7.210 | 通用型 · 行作物 · 重型 |

数据交叉验证来源：各品牌官网 + [TractorWatch](../tractor-watch) 二手挂牌数据（价格区间校准）+ [TractorVIN](../tractor-vin) 品牌解码表（型号命名一致性检查）。

### 技术栈

Next.js 16 (App Router) · TypeScript 5.7 · Tailwind CSS 4 · Recharts 3.8

选 Next.js 而不是纯 Svelte（像 FarmCalc 那样）的原因：SEO 很重要——这个工具的主要流量来自搜索引擎（"约翰迪尔 5075E 对比 久保田 M7060"），需要 SSR 和好的 meta 标签。其他工具偏工具型单页，这个偏内容型，选型不一样。

### 部署

```bash
# Vercel（推荐 — 零配置 Next.js 部署）
vercel

# 任意静态主机
npm run build
# 上传 .next/ 或 output/ 到服务器
```

---

## English

### Features

- 🔍 **17 real tractor models** across 5 major brands — compact to heavy-duty
- 📊 **Side-by-side comparison + radar chart** — 5 normalized metrics on radar, full 20-field spec table
- 🏆 **Smart winner algorithm** — Weighted by use case (fieldwork vs transport vs general), not just "more green = win"
- 🎨 **Dark mode** — Green/earth palette, persisted to localStorage
- 📱 **Fully responsive**
- 🇺🇸 English-friendly codebase (Chinese UI)

### Quick Start

```bash
npm install
npm run dev        # Development at http://localhost:3000
npm run build      # Production build
npm start          # Production server
```

### Tech Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Recharts

---

## 📋 迭代记录

<details>
<summary>点击展开</summary>

### v0.4 — 胜出算法 + 深色模式 (当前)
- 智能胜出判定（场景加权，不再简单数绿条）
- 深色模式 + localStorage 持久化
- 对比页增加"差异统计卡片"（HP 差、重量差等一目了然）
- 移动端雷达图尺寸自适应

### v0.3 — 雷达图 + 数据扩展
- 5 指标雷达成像（之前只有参数表）
- 新增 Case IH 和 New Holland 品牌
- 从 12 款扩展到 17 款拖拉机
- Recharts 从 v2 升到 v3（雷达图 API 全变了，基本重写）

### v0.2 — 对比引擎
- 并排参数对比表（高亮更优值）
- 品牌筛选 + 搜索功能
- 热门对比推荐
- 数据模型重构——字段名跟 TractorVIN 对齐

### v0.1 — 初始版本
- 基础拖拉机列表（仅 John Deere + Kubota，8 款）
- 简单的规格展示卡片
- Next.js 15 脚手架

</details>

## 🗓️ 路线图

- [ ] 与 [TractorVIN](../tractor-vin) 打通——输入序列号直接跳到对比页
- [ ] 历史价格曲线（集成 [TractorWatch](../tractor-watch) API）
- [ ] [FarmCalc](../farm-calc) 一键跳转——带入选定机型的购买价格
- [ ] 更多品牌（Fendt、Claas、McCormick）
- [ ] 用户提交新机型数据
- [ ] i18n 英文 / 西班牙语界面
