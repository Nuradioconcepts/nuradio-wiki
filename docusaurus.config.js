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
          href: '/',
        },
        items: [
          {
            type: 'html',
            position: 'left',
            value: '<a class="nav-brand" href="/nuradio-wiki/">nuradio <span class="nav-brand__yellow">atlas</span></a>',
          },
          {
            type: 'doc',
            docId: 'overview',
            label: 'Dashboard',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'project-overview',
            label: 'Project Overview',
            position: 'left',
          },
          {
            label: '5G NR',
            position: 'left',
            items: [
              { label: 'Overview', to: '/5g-nr' },
              { label: 'Procedures', to: '/5g-nr/procedures' },
              { label: 'UE', to: '/5g-nr/procedures/ue' },
              { label: 'NG-RAN', to: '/5g-nr/procedures/ng-ran' },
              { label: '5G Core', to: '/5g-nr/procedures/5g-core' },
              { label: '5G System', to: '/5g-nr/procedures/5g-system' },
            ],
          },
          {
            label: 'O-RAN',
            to: '/o-ran',
            position: 'left',
          },
          {
            label: 'Packet Analysis',
            position: 'left',
            items: [
              { label: 'Overview', to: '/packet-analysis' },
              { label: 'Basics', to: '/packet-analysis/basics' },
              { label: 'Considerations', to: '/packet-analysis/considerations' },
              { label: 'Tips and Tricks', to: '/packet-analysis/tips-and-tricks' },
              { label: 'Protocols', to: '/packet-analysis/protocols' },
              { label: 'Analysis', to: '/packet-analysis/analysis' },
              { label: 'Troubleshooting', to: '/packet-analysis/troubleshooting' },
            ],
          },
          {
            label: 'Resources',
            position: 'left',
            items: [
              { label: 'Overview', to: '/resources' },
              { label: 'Specifications', to: '/resources/specifications' },
              { label: 'Logs', to: '/resources/logs' },
            ],
          },
          {
            label: 'Tools',
            position: 'left',
            items: [
              { label: 'Overview', to: '/tools' },
              { label: '5G NR Channels', to: '/tools/5g-nr-channels' },
              { label: '5G NR Tools', to: '/tools/5g-nr-tools' },
              { label: 'Cable + Antenna Analyzer', to: '/tools/cable-antenna-analyzer' },
            ],
          },
          {
            label: 'Glossary',
            position: 'left',
            items: [
              { label: '5G NR', to: '/glossary/5g-nr' },
              { label: 'O-RAN', to: '/glossary/o-ran' },
              { label: 'Computer Systems', to: '/glossary/computer-systems' },
              { label: 'RF', to: '/glossary/rf' },
            ],
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
