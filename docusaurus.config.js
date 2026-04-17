// @ts-check

import terminalTheme from './src/theme/prism-terminal.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'nuradio atlas',
  tagline: 'A living knowledge base for systems, concepts, and runbooks.',
  favicon: 'img/atlas-glow.png',

  future: {
    v4: true,
  },

  url: 'https://nuradioconcepts.github.io',
  baseUrl: '/nuradio-wiki/',

  organizationName: 'Nuradioconcepts',
  projectName: 'nuradio-wiki',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  plugins: [
    require('./plugins/recent-changes.js'),
    require('./plugins/site-health.js'),
  ],

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
        title: '',
        logo: {
          alt: 'nuradio atlas Logo',
          src: 'img/atlas-glow.png',
        },
        items: [
          {
            type: 'html',
            position: 'left',
            value: '<span class="nav-brand">nuradio <span class="nav-brand__yellow">atlas</span></span>',
          },
          {
            type: 'doc',
            docId: 'overview',
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
        copyright: `Copyright © ${new Date().getFullYear()} nuradio atlas.`,
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
