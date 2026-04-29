module.exports = {
  wikiSidebar: [
    'overview',
    'project-overview',
    {
      type: 'category',
      label: '5G NR',
      link: {
        type: 'doc',
        id: '5g-nr/overview',
      },
      items: [
        {
          type: 'category',
          label: 'Procedures',
          link: {
            type: 'doc',
            id: '5g-nr/procedures/overview',
          },
          items: [
            '5g-nr/procedures/ue',
            '5g-nr/procedures/ng-ran',
            '5g-nr/procedures/5g-core',
            '5g-nr/procedures/5g-system',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'O-RAN',
      link: {
        type: 'doc',
        id: 'o-ran/overview',
      },
      items: [],
    },
    {
      type: 'category',
      label: 'Packet Analysis',
      link: {
        type: 'doc',
        id: 'packet-analysis/overview',
      },
      items: [
        'packet-analysis/basics',
        'packet-analysis/considerations',
        'packet-analysis/tips-and-tricks',
        'packet-analysis/protocols',
        'packet-analysis/analysis',
        'packet-analysis/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      link: {
        type: 'doc',
        id: 'resources/overview',
      },
      items: [
        'resources/specifications',
        'resources/logs',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      link: {
        type: 'doc',
        id: 'tools/overview',
      },
      items: [
        'tools/5g-nr-channels',
        'tools/5g-nr-tools',
        'tools/cable-antenna-analyzer',
      ],
    },
    {
      type: 'category',
      label: 'Glossary',
      items: [
        'glossary/5g-nr',
        'glossary/o-ran',
        'glossary/computer-systems',
      ],
    },
  ],
};
