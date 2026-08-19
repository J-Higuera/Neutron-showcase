import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const source = readFileSync(join(root, 'src/main.jsx'), 'utf8');
const originalIndex = readFileSync(join(root, 'dist/index.html'), 'utf8');
const scriptFile = originalIndex.match(/src="\.\/assets\/([^"]+\.js)"/)?.[1];
const cssFile = originalIndex.match(/href="\.\/assets\/([^"]+\.css)"/)?.[1];

if (!scriptFile || !cssFile) {
  throw new Error('Could not find Vite asset tags in dist/index.html');
}

const index = originalIndex.replace(
  /<script type="module" crossorigin src="\.\/assets\/[^"]+"><\/script>\s*<link rel="stylesheet" crossorigin href="\.\/assets\/[^"]+">/,
  `<script type="module">
      const routeBase = (() => {
        const marker = 'frondosa-nursery-shop';
        const parts = location.pathname.split('/').filter(Boolean);
        const markerIndex = parts.indexOf(marker);
        const routeParts = markerIndex >= 0 ? parts.slice(markerIndex + 1) : parts;
        if (markerIndex >= 0 && routeParts.length === 0 && !location.pathname.endsWith('/')) return './' + marker + '/';
        const depth = Math.max(0, routeParts.length - (location.pathname.endsWith('/') ? 0 : 1));
        return depth ? '../'.repeat(depth) : './';
      })();
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.crossOrigin = '';
      link.href = routeBase + 'assets/${cssFile}';
      document.head.appendChild(link);
      import(routeBase + 'assets/${scriptFile}');
    </script>`
);

writeFileSync(join(root, 'dist/index.html'), index);

const productIds = [...source.matchAll(/p\('([^']+)'/g)].map((match) => match[1]);
const orderIds = [...source.matchAll(/order\('([^']+)'/g)].map((match) => match[1]);
const supportRoutes = ['journal/story', 'journal/shipping', 'journal/returns', 'journal/privacy'];
const routes = [
  'cart',
  'checkout',
  'account',
  ...supportRoutes,
  ...productIds.map((id) => `plant/${id}`),
  ...orderIds.map((id) => `account/order/${id}`),
];

for (const route of routes) {
  const depth = route.split('/').length;
  const prefix = '../'.repeat(depth);
  const html = index.replaceAll('./assets/', `${prefix}assets/`);
  const file = join(root, 'dist', route, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
