import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/vitepress_docs/",
  srcDir: "docs",

  lang: 'zh-CN',
  title: "二狗摸鱼",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "首页", link: "/" }],

    sidebar: [
      // {
      //   text: "Examples",
      //   items: [],
      // },
      { text: "前端面试题", link: "/interview-questions" },
      { text: "最佳实践", link: "/code-practice/practical-experience" },
      { text: "代码片段", link: "/code-practice/code-snippets" },
    ],

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],

    search: {
      provider: "local",
    },
  },
});
