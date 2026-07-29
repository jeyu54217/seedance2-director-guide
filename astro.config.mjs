// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://jeyu54217.github.io',
  base: '/seedance2-director-guide',
  integrations: [
    starlight({
      title: 'Seedance 2.0 Director Guide',
      description: 'AI 仿真人劇導演的進階技術知識手冊 — 理解擴散模型、DiT、Flow Matching 底層原理，精準操控 Seedance 2.0 工作流。',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '繁體中文',
          lang: 'zh-TW',
        },
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      customCss: ['./src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/jeyu54217/seedance2-director-guide' },
      ],
      sidebar: [
        {
          label: '一、基礎概念',
          items: [{ autogenerate: { directory: '01-basics' } }],
        },
        {
          label: '二、Seedance 深度',
          items: [{ autogenerate: { directory: '02-seedance' } }],
        },
        {
          label: '三、診斷與修復',
          items: [{ autogenerate: { directory: '03-diagnosis' } }],
        },
        {
          label: '四、實戰工作流',
          items: [{ autogenerate: { directory: '04-workflow' } }],
        },
      ],
    }),
  ],
});
