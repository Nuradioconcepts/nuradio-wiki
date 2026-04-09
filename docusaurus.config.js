// @ts-check

import terminalTheme from './src/theme/prism-terminal.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NuRadio Wiki',
  tagline: 'A living knowledge base for systems, concepts, and runbooks.',
  favicon: 'img/Icon_Gradient.png',

  future: {
    v4: true,
  },

  url: 'https://your-domain.example.com',
  baseUrl: '/',

  organizationName: 'ryandecker',
  projectName: 'nuradio-wiki',

  onBrokenLinks: 'warn',

  plugins: [require('./plugins/recent-changes.js')],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: undefined,
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/Poster.png',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'NuRadio Wiki',
        logo: {
          alt: 'NuRadio Wiki Logo',
          src: 'img/Icon_Gradient.png',
          width: 64,
          height: 32,
        },
        items: [
          {
            to: '/',
            label: 'Dashboard',
            position: 'left',
          },
          {
            to: '/5g-nr',
            label: '5G NR',
            position: 'left',
          },
          {
            to: '/o-ran',
            label: 'O-RAN',
            position: 'left',
          },
          {
            to: '/glossary/computer-systems',
            label: 'Computer Systems',
            position: 'left',
          },
          {
            to: '/packet-analysis',
            label: 'Packet Analysis',
            position: 'left',
          },
          {
            to: '/resources',
            label: 'Resources',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Start Here',
            items: [
              { label: 'Overview', to: '/' },
              { label: '5G NR', to: '/5g-nr' },
            ],
          },
          {
            title: 'Core Sections',
            items: [
              { label: '5G NR', to: '/5g-nr' },
              { label: 'O-RAN', to: '/o-ran' },
              { label: 'Packet Analysis', to: '/packet-analysis' },
              { label: 'Resources', to: '/resources' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NuRadio Wiki.`,
      },
      prism: {
        theme: terminalTheme,
        darkTheme: terminalTheme,
        additionalLanguages: ['bash', 'yaml', 'json'],
      },
      docs: {
        sidebar: {
          hideable: false,
          autoCollapseCategories: true,
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
    }),
};

export default config;
