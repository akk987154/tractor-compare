import type { MetadataRoute } from "next";
import { tractors } from "@/data/tractors";

/**
 * 动态生成 sitemap.xml
 *
 * 包含：
 * 1. 首页
 * 2. 对比页（空状态）
 * 3. 每台拖拉机的"对比入口"页面（?left=xxx）
 * 4. 热门对比组合（?left=xxx&right=yyy）
 *
 * 热门对比组合是 SEO 的核心 — 这些页面会针对
 * "约翰迪尔 5075E 对比 久保田 M7060" 这类长尾关键词排名
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "https://tractorcompare.vercel.app";

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // 每台拖拉机的单侧入口页
  for (const tractor of tractors) {
    entries.push({
      url: `${baseUrl}/compare?left=${tractor.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // 热门对比组合 — 高优先级 SEO 页面
  const popularPairs = [
    ["jd-5075e", "mf-4708"],
    ["kubota-m7060", "case-farmall-75c"],
    ["jd-6110m", "nh-t5-100"],
    ["mf-6713s", "case-maxxum-125"],
    ["jd-6175m", "case-puma-185"],
    ["nh-t7-210", "mf-7720s"],
    ["jd-5100e", "kubota-m8540"],
    ["kubota-m100gx", "nh-t6-160"],
  ];

  for (const [left, right] of popularPairs) {
    if (tractors.some((t) => t.id === left) && tractors.some((t) => t.id === right)) {
      entries.push({
        url: `${baseUrl}/compare?left=${left}&right=${right}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  return entries;
}
