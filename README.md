# 🚜 TractorCompare — 拖拉机规格对比工具

**TractorCompare** 是一个免费在线工具，支持并排对比 John Deere、Kubota、Massey Ferguson、Case IH、New Holland 等主流品牌拖拉机的关键规格参数，包括雷达图可视化。

---

## 中文

### 功能

- 🔍 18 款真实拖拉机数据，覆盖 5 大品牌
- 📊 并排参数对比 + 雷达图可视化
- 🎨 绿色/大地色系主题 + 深色模式
- 📱 全响应式设计
- 🇨🇳 中文界面

### 快速开始

```bash
npm install
npm run dev        # 开发模式 http://localhost:3000
npm run build      # 生产构建
npm start          # 生产运行
```

### 项目结构

```
src/
├── app/           # Next.js App Router 页面
│   ├── page.tsx       # 首页 — 品牌筛选 + 搜索 + 热门对比
│   ├── compare/       # 对比页 — 双选器 + 雷达图 + 参数表
│   └── layout.tsx     # 根布局 — Header + 深色模式
├── components/    # 可复用组件
├── data/          # 拖拉机数据库 (18 款型号)
└── lib/           # 工具函数
```

### 技术栈

Next.js 16 · TypeScript · Tailwind CSS 4 · Recharts

---

## English

### Features

- 🔍 18 real tractor models across 5 major brands
- 📊 Side-by-side spec comparison with radar charts
- 🎨 Green/earth tone theme with dark mode toggle
- 📱 Fully responsive
- 🇺🇸 English-friendly codebase (Chinese UI)

### Quick Start

```bash
npm install
npm run dev        # Development at http://localhost:3000
npm run build      # Production build
npm start          # Production server
```

### Supported Brands

| Brand | Models |
|-------|--------|
| John Deere | 3038E, 5075E, 5100E, 6110M, 6175M |
| Kubota | L3560, M7060, M8540, M100GX |
| Massey Ferguson | 4708, 6713S, 7720S |
| Case IH | Farmall 75C, Maxxum 125, Puma 185 |
| New Holland | T5.100, T6.160, T7.210 |

### Tech Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Recharts

### Deploy

```bash
# Vercel (recommended)
vercel

# Any static host — output is fully static
```
