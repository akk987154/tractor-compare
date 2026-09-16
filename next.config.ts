import type { NextConfig } from "next";

/**
 * 安全响应头。
 *
 * 本项目此前完全没有配置任何响应头：页面可被任意站点 iframe 嵌套（点击劫持）、
 * 可被 MIME 嗅探、没有 HSTS，且会通过 X-Powered-By 暴露框架版本。
 *
 * script-src 目前必须保留 'unsafe-inline'，因为 layout.tsx 里有一段
 * 阻塞渲染的内联主题初始化脚本（用于在首屏前同步 dark class，避免闪烁）。
 * 若将来要收紧到 nonce，需要同时把那段脚本迁到 next/script 或 middleware。
 * 注意 Next.js 的 App Router 会为 hydration 注入内联脚本，因此完全去掉
 * 'unsafe-inline' 需要配合 nonce 方案，不能只删这一项。
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // 移除 X-Powered-By: Next.js，减少版本信息暴露
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
