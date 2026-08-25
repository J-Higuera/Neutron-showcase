import { chromium } from 'playwright-core';

const base = process.env.FRONDOSA_URL || 'http://127.0.0.1:4327';
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true });
const results = [];
const pass = (name, detail = '') => results.push({ name, ok: true, detail });
const fail = (name, detail = '') => results.push({ name, ok: false, detail });
const expect = async (name, fn) => {
  try { const detail = await fn(); pass(name, detail); } catch (err) { fail(name, err.message); }
};

async function newPage(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('console', msg => { if (msg.type() === 'error') console.log('console error:', msg.text()); });
  return page;
}

await expect('catalog primary image provenance and botanical mapping', async () => {
  const page = await newPage(1440, 1000);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const cards = await page.locator('.product-card').evaluateAll((nodes) => nodes.map((card) => {
    const title = card.querySelector('h2')?.textContent?.trim() ?? '';
    const img = card.querySelector('.photo-button img');
    return { title, alt: img?.getAttribute('alt') ?? '', src: img?.getAttribute('src') ?? '' };
  }));
  await page.close();
  if (cards.length !== 28) throw new Error(`expected 28 catalog cards, saw ${cards.length}`);
  const unique = new Set(cards.map((card) => card.src));
  if (unique.size < 26) throw new Error(`catalog primary images still over-reused: ${unique.size}/28 unique`);
  const byTitle = new Map(cards.map((card) => [card.title, card.src]));
  const required = {
    'ZZ Plant': 'zz-zamioculcas',
    'Parlor Palm': 'parlorPalm-',
    'Burgundy Rubber Tree': 'rubber-ficus-elastica',
    'String of Hearts': 'stringHearts-',
    'Bird Nest Fern': 'birdNestFern-',
    'Jade Plant': 'jade-',
    'Hoya Carnosa': 'hoya-hoya-carnosa',
    'Chinese Money Plant': 'pilea-',
    'Mini Phalaenopsis Orchid': 'orchid-',
    'Aloe Vera': 'aloe-',
    'Mist Ceramic Cachepot': 'cachepot-',
    'Terracotta Saucer Kit': 'terracottaSaucer-',
  };
  for (const [title, token] of Object.entries(required)) {
    const src = byTitle.get(title) ?? '';
    if (!src.includes(token)) throw new Error(`${title} image is not mapped to ${token}: ${src}`);
  }
  const allowedShared = cards.filter((card) => card.src.includes('greenhouse-benches')).map((card) => card.title).sort();
  for (const [src, count] of [...cards.reduce((map, card) => map.set(card.src, (map.get(card.src) ?? 0) + 1), new Map())]) {
    if (count > 1 && !src.includes('greenhouse-benches')) throw new Error(`non-bundle image reused ${count}x: ${src}`);
  }
  if (!allowedShared.every((title) => title.includes('Bundle'))) throw new Error(`greenhouse group shot reused outside bundles: ${allowedShared.join(', ')}`);
  return `${cards.length} cards, ${unique.size} unique primary images, greenhouse reuse limited to ${allowedShared.length} bundles`;
});

await expect('desktop catalog/filter/search', async () => {
  const page = await newPage(1920, 1080);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.getByPlaceholder('Search species, care, category').first().fill('plant');
  await page.getByLabel('pet-friendly').first().check();
  await page.locator('select').selectOption('pet');
  await page.waitForTimeout(150);
  const count = await page.locator('.product-card').count();
  const overflow = await page.evaluate(() => document.body.scrollWidth - innerWidth);
  await page.screenshot({ path: '.review/frondosa-wide-after.png', fullPage: true });
  await page.close();
  if (count < 4) throw new Error(`too few filtered products: ${count}`);
  if (overflow > 1) throw new Error(`horizontal overflow ${overflow}`);
  return `${count} filtered cards, overflow ${overflow}`;
});

await expect('product detail is full routed page', async () => {
  const page = await newPage(1920, 1080);
  await page.goto(base + '/plant/monstera-deliciosa', { waitUntil: 'networkidle' });
  const h1 = await page.locator('h1').first().textContent();
  const hero = await page.locator('.showcase-gallery .gallery-main').boundingBox();
  const hasFooter = await page.locator('.site-footer').count();
  await page.screenshot({ path: '.review/frondosa-product-after.png', fullPage: true });
  await page.close();
  if (!h1?.includes('Monstera')) throw new Error(`wrong h1 ${h1}`);
  if (!hero || hero.width < 900 || hero.height < 550) throw new Error(`product gallery not showcase-sized ${JSON.stringify(hero)}`);
  if (!hasFooter) throw new Error('footer missing');
  return `${h1}, gallery ${Math.round(hero.width)}x${Math.round(hero.height)}`;
});

await expect('cart full page + checkout confirmation + order persistence', async () => {
  const page = await newPage(1440, 1000);
  await page.goto(base + '/plant/monstera-deliciosa', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Add to care crate' }).click();
  await page.getByRole('button', { name: 'Review full cart page' }).click();
  await page.waitForURL('**/cart');
  if (!(await page.locator('.cart-full-grid').count())) throw new Error('full cart grid missing');
  await page.getByRole('button', { name: 'Checkout demo order' }).first().click();
  await page.waitForURL('**/checkout');
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await page.waitForTimeout(100);
  if (!(await page.getByText('Please fix').count())) throw new Error('validation did not appear');
  await page.locator('input').nth(0).fill('Fern Buyer');
  await page.locator('input').nth(1).fill('fern@example.com');
  await page.locator('input').nth(2).fill('12 Greenhouse Way');
  await page.locator('input').nth(3).fill('Portland');
  await page.locator('input').nth(4).fill('OR');
  await page.locator('input').nth(5).fill('97214');
  await page.locator('input[type=checkbox]').check();
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await page.waitForTimeout(200);
  const h1 = await page.locator('h1').first().textContent();
  const orders = await page.evaluate(() => JSON.parse(localStorage.getItem('frondosa.orders') || '[]').length);
  const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('frondosa.cart') || '[]').length);
  await page.getByRole('button', { name: 'Account history' }).click();
  const accountHasNew = await page.locator('.orders-log .order-row').count();
  await page.reload({ waitUntil: 'networkidle' });
  const persistedOrders = await page.evaluate(() => JSON.parse(localStorage.getItem('frondosa.orders') || '[]').length);
  await page.close();
  if (!h1?.includes('dispatch log')) throw new Error(`no confirmation h1: ${h1}`);
  if (orders < 4 || persistedOrders < 4 || accountHasNew < 4) throw new Error(`order persistence failed orders=${orders} persisted=${persistedOrders} rows=${accountHasNew}`);
  if (cart !== 0) throw new Error(`cart not cleared: ${cart}`);
  return `${orders} orders persisted, cart cleared`;
});

await expect('mobile layout no overflow and mobile tools present', async () => {
  const page = await newPage(390, 844);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.body.scrollWidth - innerWidth);
  const tools = await page.locator('.mobile-tools').boundingBox();
  await page.screenshot({ path: '.review/frondosa-mobile-after.png', fullPage: true });
  await page.close();
  if (overflow > 1) throw new Error(`mobile overflow ${overflow}`);
  if (!tools || tools.height < 20) throw new Error('mobile tools not visible');
  return `overflow ${overflow}`;
});

await browser.close();
const bad = results.filter(r => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
if (bad.length) process.exit(1);
