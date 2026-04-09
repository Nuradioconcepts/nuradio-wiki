// @ts-check
'use strict';

const fs   = require('fs');
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

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml  = match[1];
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

// Extract internal links from MDX content.
// Counts raw occurrences (not unique) so the total reflects how much
// cross-referencing is happening across the site.
function extractInternalLinks(content) {
  const links = [];

  // [[term]] and [[term|label]] glossary links embedded in JSX string props
  for (const m of content.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) {
    links.push('[[' + m[1].trim() + ']]');
  }

  // Markdown links: [text](/path) or [text](/path#anchor)
  for (const m of content.matchAll(/\[[^\]]*\]\((\/[^)"'\s]*)\)/g)) {
    links.push(m[1].split('#')[0]);
  }

  // JSX  to="/path"  or  to='/path'
  for (const m of content.matchAll(/\bto=["'](\/[^"'#]+)/g)) {
    links.push(m[1]);
  }

  // JSX  href="/path"  (internal only)
  for (const m of content.matchAll(/\bhref=["'](\/[^"'#]+)/g)) {
    links.push(m[1]);
  }

  return links.filter(Boolean);
}

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function siteHealthPlugin(context) {
  return {
    name: 'site-health-plugin',

    async loadContent() {
      const docsDir = path.join(context.siteDir, 'docs');
      const files   = walkDocs(docsDir);

      // Build page index
      const pages = files.map((filePath) => {
        const content        = fs.readFileSync(filePath, 'utf8');
        const { title, slug } = parseFrontmatter(content);
        const route          = slug || filePathToRoute(filePath, docsDir);
        return {
          route,
          title:    title || path.basename(filePath, path.extname(filePath)),
          filepath: 'docs/' + path.relative(docsDir, filePath).replace(/\\/g, '/'),
          links:    extractInternalLinks(content),
        };
      });

      // Count total link occurrences across all pages
      const totalLinks = pages.reduce((sum, p) => sum + p.links.length, 0);

      // Build incoming-link map:  route → count of pages that link to it
      const knownRoutes = new Set(pages.map((p) => p.route));
      const incomingCount = new Map(pages.map((p) => [p.route, 0]));

      for (const page of pages) {
        const seen = new Set(); // dedupe per source page
        for (const link of page.links) {
          // Normalise trailing slash
          const normalised = link.replace(/\/$/, '') || '/';
          if (knownRoutes.has(normalised) && !seen.has(normalised)) {
            seen.add(normalised);
            incomingCount.set(normalised, (incomingCount.get(normalised) ?? 0) + 1);
          }
        }
      }

      // Orphans: known pages with zero incoming links, excluding the root
      const orphanPages = pages
        .filter((p) => p.route !== '/' && (incomingCount.get(p.route) ?? 0) === 0)
        .map(({ title, route, filepath }) => ({ title, route, filepath }));

      const result = {
        totalPages:  pages.length,
        totalLinks,
        orphanPages,
        generatedAt: new Date().toISOString(),
      };

      const outDir  = path.join(context.siteDir, 'src', 'data');
      const outPath = path.join(outDir, 'siteHealth.json');
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2));

      return result;
    },
  };
};
