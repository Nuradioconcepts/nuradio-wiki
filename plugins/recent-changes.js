// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');

function walkDocs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDocs(fullPath));
    } else if (/\.mdx?$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const title = (yaml.match(/^title:\s*['"]?(.+?)['"]?\s*$/m) || [])[1]?.trim();
  const slug  = (yaml.match(/^slug:\s*['"]?(.+?)['"]?\s*$/m)  || [])[1]?.trim();
  return { title, slug };
}

function filePathToRoute(filePath, docsDir) {
  let rel = path.relative(docsDir, filePath).replace(/\\/g, '/');
  rel = rel.replace(/\.mdx?$/, '');
  rel = rel.replace(/(^|\/)overview$/, '');
  return '/' + rel.replace(/^\//, '');
}

const SECTION_MAP = {
  '5g-nr':          '5G NR',
  'o-ran':          'O-RAN',
  'glossary':       'Glossary',
  'packet-analysis':'Packet Analysis',
  'resources':      'Resources',
  'computer-systems':'Computer Systems',
};

function routeToSection(route) {
  if (route === '/') return 'Dashboard';
  const top = route.split('/')[1];
  return SECTION_MAP[top] || top;
}

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function recentChangesPlugin(context) {
  return {
    name: 'recent-changes-plugin',

    async loadContent() {
      const docsDir = path.join(context.siteDir, 'docs');
      const files   = walkDocs(docsDir);

      const entries = files.map((filePath) => {
        const stat = fs.statSync(filePath);
        const { title, slug } = parseFrontmatter(filePath);
        const route   = slug || filePathToRoute(filePath, docsDir);
        const section = routeToSection(route);
        return {
          title:    title || path.basename(filePath, path.extname(filePath)),
          filepath: 'docs/' + path.relative(docsDir, filePath).replace(/\\/g, '/'),
          route,
          section,
          mtime:    stat.mtime.toISOString(),
        };
      });

      entries.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
      const recent = entries.slice(0, 15);

      const outDir  = path.join(context.siteDir, 'src', 'data');
      const outPath = path.join(outDir, 'recentChanges.json');
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(recent, null, 2));

      return recent;
    },
  };
};
