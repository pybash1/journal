// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkGithubAlerts from "remark-github-alerts";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://journal.pybash.xyz",
  integrations: [mdx({ 
    gfm: true,
    remarkPlugins: [remarkGithubAlerts]
  }), sitemap(), react()],
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
    shikiConfig: {
      theme: "vitesse-dark",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
