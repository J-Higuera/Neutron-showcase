import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BadgeCheck,
  Box,
  ChevronLeft,
  ChevronRight,
  Leaf,
  LogIn,
  LogOut,
  PackageCheck,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sprout,
  Truck,
  UserRound,
  X,
} from 'lucide-react';
import './styles.css';

const assetModules = import.meta.glob('../assets/*', { eager: true, query: '?url', import: 'default' });
const asset = (name) => assetModules[`../assets/${name}`];
const img = {
  monstera: asset('potted-monstera-deliciosa-houseplant-on-greenhouse-bench-clear-species-focused-product-photography-natural-daylight-no-people.jpg'),
  snake: asset('snake-plant-sansevieria-in-grower-pot-upright-sword-leaves-clean-nursery-product-photo-bright-indoor-greenhouse-light.jpg'),
  maranta: asset('maranta-prayer-plant-close-up-patterned-leaves-small-pot.jpg'),
  spider: asset('spider-plant-chlorophytum-comosum-in-hanging-or-tabletop-pot-pet-friendly-houseplant-product-photo-soft-natural-light.jpg'),
  pothos: asset('pothos-trailing-vine-in-nursery-pot-on-shelf-leaves-cascading-ecommerce-plant-product-photography.jpg'),
  calathea: asset('calathea-houseplant-patterned-foliage-ceramic-pot-nursery-bench.jpg'),
  fiddle: asset('fiddle-leaf-fig-floor-plant-in-pot-living-room-corner-natural-daylight-premium-houseplant-ecommerce-photo.jpg'),
  fern: asset('boston-fern-full-textured-fronds-in-pot-greenhouse-nursery-product-photography.jpg'),
  succulent: asset('succulent-echeveria-rosette-small-terracotta-pot-direct-light.jpg'),
  lily: asset('peace-lily-with-white-bloom-in-pot-clean-indoor-plant-product-photography.jpg'),
  zz: asset('zz-zamioculcas-zamiifolia-lodd-engl-am-ak331827-1.jpg'),
  parlorPalm: asset('parlorPalm-starr-070906-9076-chamaedorea-elegans.jpg'),
  rubber: asset('rubber-ficus-elastica-9zz.jpg'),
  stringHearts: asset('stringHearts-starr-100411-4407-ceropegia-woodii-fruiting-hanging-habit-ulana-st-makawao-maui-249098.jpg'),
  birdNestFern: asset('birdNestFern-bird-s-nest-fern-asplenium-nidus-leaves-1.jpg'),
  jade: asset('jade-among-the-branches-of-a-potted-jade-plant.jpg'),
  hoya: asset('hoya-hoya-carnosa-1.jpg'),
  pilea: asset('pilea-pilea-peperomioides-chinese-money-plant.jpg'),
  orchid: asset('orchid-phalaenopsis-orchid-and-hydrangea.jpg'),
  aloe: asset('aloe-a-potted-aloe-vera-plant.jpg'),
  cachepot: asset('cachepot-bourg-la-reine-factory-french-cachepot-1962-374-2-cleveland-museum-of-art.jpg'),
  terracottaSaucer: asset('terracottaSaucer-flowerpot-1.jpg'),
  greenhouse: asset('greenhouse-benches-with-many-potted-houseplants-lush-modern-nursery-interior-wide-establishing-photograph.jpg'),
  packing: asset('hands-packing-live-houseplant-cardboard-shipping-box-paper-wrap-care-card.jpg'),
  tools: asset('plant-care-tools-on-workbench-watering-can-mister-pruning-shears-potting-soil-care-cards-tactile-nursery-flat-lay.jpg'),
  tag: asset('close-up-of-kraft-plant-care-tag-clipped-into-soil-botanical-label-and-pot-size-measurement-warm-greenhouse-light.jpg'),
};

let productsSeedOrder = 0;
const products = [
  p('monstera-deliciosa','Monstera Deliciosa','Monstera deliciosa','foliage',58,14,'6-inch grower pot','ships 16-22 in. tall','floor/statement','medium/bright indirect','easy','moderate room humidity','keep away from pets / toxic',true,['air-cleaner','giftable'],img.monstera,'Split-leaf statement plant trained on a nursery stake.','Water when the top third dries; rotate toward the window weekly.','Leaves may ship with natural fenestration variance.'),
  p('snake-plant-laurentii','Snake Plant Laurentii','Dracaena trifasciata','foliage',38,21,'6-inch grower pot','ships 14-20 in. tall','medium','low/artificial','no-fuss','tolerates dry rooms','keep away from pets / toxic',true,['air-cleaner','winter-ship'],img.snake,'Architectural upright leaves for offices and low light rooms.','Let soil dry nearly through before watering.','Firm sword leaves travel well in soil-secure wrap.'),
  p('maranta-red-prayer','Red Prayer Plant','Maranta leuconeura','trailing',28,12,'4-inch grower pot','ships 8-12 in. wide','shelf/trailing','medium/bright indirect','moderate','likes steady humidity','pet-friendly',false,['giftable'],img.maranta,'Patterned leaves fold at night like a living care signal.','Keep lightly moist, never soggy; filtered light preserves color.','Tender leaves are paper-sleeved before boxing.'),
  p('spider-plant-ocean','Spider Plant Ocean','Chlorophytum comosum','trailing',24,18,'4-inch grower pot','ships 8-12 in. tall','shelf/trailing','medium/bright indirect','easy','average room humidity','pet-friendly',true,['giftable','air-cleaner'],img.spider,'Arching striped foliage that makes pups in bright rooms.','Water when top half dries; trims recover quickly.','Can ride tabletop or hanging planter after arrival.'),
  p('golden-pothos','Golden Pothos','Epipremnum aureum','trailing',22,30,'4-inch grower pot','ships 8-14 in. trailing','shelf/trailing','low/artificial','easy','forgiving humidity','keep away from pets / toxic',true,['air-cleaner'],img.pothos,'Fast trailing vine for shelves, rails, and bookcases.','Water when vines feel light and top half dries.','Trailing stems are coiled gently for transit.'),
  p('calathea-medallion','Calathea Medallion','Goeppertia veitchiana','foliage',42,8,'6-inch ceramic cachepot','ships 12-16 in. tall','medium','medium/bright indirect','humidity-sensitive','prefers 50%+ humidity','keep away from pets / toxic',false,['giftable'],img.calathea,'Painterly foliage for humid kitchens and bright bathrooms.','Use filtered water and keep soil evenly damp.','Ships in ceramic cachepot with extra padding.'),
  p('fiddle-leaf-fig','Fiddle Leaf Fig','Ficus lyrata','foliage',96,6,'10-inch grower pot','ships 34-44 in. tall','floor/statement','medium/bright indirect','moderate','steady room humidity','keep away from pets / toxic',false,['giftable'],img.fiddle,'Premium floor plant with broad leaves and strong vertical shape.','Bright indirect light, measured watering, and no cold drafts.','Oversize live-plant mailer includes trunk support.'),
  p('boston-fern','Boston Fern','Nephrolepis exaltata','fern',34,15,'6-inch hanging pot','ships 12-18 in. full','medium','medium/bright indirect','humidity-sensitive','mist or humid room','pet-friendly',false,['air-cleaner'],img.fern,'Full textured fronds for shower-bright rooms and shaded porches.','Keep evenly moist and give humidity.','Fronds are netted to avoid crushing.'),
  p('echeveria-terracotta','Echeveria Rosette','Echeveria elegans','succulent/cactus',16,26,'3-inch terracotta pot','ships 3-5 in. wide','tabletop','direct sun','no-fuss','dry air is fine','pet-friendly',true,['giftable','winter-ship'],img.succulent,'Compact rosette in porous terracotta for sunny sills.','Water deeply only after soil fully dries.','Terracotta is wrapped separately from foliage.'),
  p('peace-lily','Peace Lily','Spathiphyllum wallisii','blooming',36,11,'6-inch grower pot','ships 14-20 in. tall','medium','low/artificial','easy','likes a little humidity','keep away from pets / toxic',true,['air-cleaner','giftable'],img.lily,'Glossy foliage and white spathes for calmer corners.','Droops visibly when thirsty; keep out of direct sun.','Blooms may arrive open or in bud depending on bench timing.'),
  p('zz-plant','ZZ Plant','Zamioculcas zamiifolia','foliage',44,19,'6-inch grower pot','ships 12-18 in. tall','medium','low/artificial','no-fuss','dry rooms accepted','keep away from pets / toxic',true,['winter-ship'],img.zz,'Glossy low-light plant with rhizomes that store water.','Water sparingly and avoid standing moisture.','A reliable office bench staple.'),
  p('parlor-palm','Parlor Palm','Chamaedorea elegans','palm',48,10,'6-inch grower pot','ships 16-24 in. tall','medium','low/artificial','easy','average humidity','pet-friendly',true,['giftable'],img.parlorPalm,'Soft palm texture for bedrooms and shaded living rooms.','Even moisture with a short dry-down between waterings.','Leaflets are sleeved upright for transit.'),
  p('rubber-tree-burgundy','Burgundy Rubber Tree','Ficus elastica','foliage',62,9,'8-inch grower pot','ships 22-30 in. tall','floor/statement','medium/bright indirect','easy','average humidity','keep away from pets / toxic',true,['air-cleaner'],img.rubber,'Deep glossy leaves with strong modern silhouette.','Water when top half dries; wipe leaves monthly.','Ships with a stake if the stem is young.'),
  p('string-of-hearts','String of Hearts','Ceropegia woodii','trailing',30,13,'4-inch hanging pot','ships 10-18 in. trailing','shelf/trailing','medium/bright indirect','easy','dry rooms accepted','pet-friendly',false,['giftable'],img.stringHearts,'Fine trailing vines with heart-shaped leaves for bright shelves.','Let soil mostly dry; avoid heavy pots.','Vines are looped in tissue for shipping.'),
  p('bird-nest-fern','Bird Nest Fern','Asplenium nidus','fern',32,16,'4-inch grower pot','ships 8-12 in. tall','tabletop','medium/bright indirect','moderate','likes humidity','pet-friendly',true,['giftable'],img.birdNestFern,'Rippled fronds from a central rosette.','Water soil edge, not the crown.','Great bathroom plant when light is filtered.'),
  p('jade-plant','Jade Plant','Crassula ovata','succulent/cactus',24,17,'4-inch terracotta pot','ships 5-8 in. tall','tabletop','direct sun','no-fuss','dry air is fine','keep away from pets / toxic',true,['winter-ship'],img.jade,'Sturdy succulent with thick oval leaves.','Bright sun and infrequent water keep stems compact.','Travels well when soil is dry.'),
  p('hoya-carnosa','Hoya Carnosa','Hoya carnosa','trailing',36,7,'5-inch hanging pot','ships 10-16 in. trailing','shelf/trailing','medium/bright indirect','easy','average humidity','pet-friendly',true,['giftable'],img.hoya,'Wax plant with sturdy vines and sweet blooms when mature.','Let potting mix dry halfway; avoid overpotting.','Ships with vine loops pinned to paper.'),
  p('pilea-peperomioides','Chinese Money Plant','Pilea peperomioides','foliage',26,20,'4-inch grower pot','ships 6-10 in. tall','tabletop','medium/bright indirect','easy','average humidity','pet-friendly',true,['giftable'],img.pilea,'Round coin leaves on bouncy stems; easy to share pups.','Water when top half dries and rotate often.','Packed with a small nursery support ring.'),
  p('orchid-mini','Mini Phalaenopsis Orchid','Phalaenopsis hybrid','blooming',46,5,'3-inch orchid pot','ships 10-14 in. tall','tabletop','medium/bright indirect','moderate','likes humidity','pet-friendly',false,['giftable'],img.orchid,'Compact blooming orchid for desks and gifting.','Water bark mix weekly after checking root color.','Spike is clipped and bloom-safe packed.'),
  p('aloe-vera','Aloe Vera','Aloe barbadensis miller','succulent/cactus',20,24,'4-inch grower pot','ships 6-9 in. tall','tabletop','direct sun','no-fuss','dry air is fine','keep away from pets / toxic',true,['winter-ship'],img.aloe,'Sun-loving medicinal succulent with upright pups.','Dry fully between waterings.','Ships dry to protect roots.'),
  p('beginner-bright-bundle','Bright Window Starter Bundle','Monstera, Pilea, Echeveria','bundle',92,9,'three nursery pots','ships 3 plants','medium','medium/bright indirect','easy','mixed notes','mixed pet notes',true,['giftable'],img.greenhouse,'Three bright-room favorites with matched care cards.','Bundle covers tabletop, shelf, and statement sizes.','Packed as a divided live-plant crate.'),
  p('pet-safe-shelf-bundle','Pet-Safe Shelf Bundle','Maranta, Spider Plant, Hoya','bundle',76,10,'three 4-inch pots','ships 3 plants','shelf/trailing','medium/bright indirect','easy','average to humid','pet-friendly',true,['giftable'],img.greenhouse,'ASPCA-friendly shelf mix for homes with curious pets.','Water rhythms are close enough for one weekly check.','Each plant has a clipped tag and packing slip line.'),
  p('low-light-office-bundle','Low-Light Office Bundle','Snake Plant, ZZ Plant, Pothos','bundle',88,12,'three grower pots','ships 3 plants','medium','low/artificial','no-fuss','dry rooms accepted','keep away from pets / toxic',true,['air-cleaner'],img.greenhouse,'Resilient office bench bundle for artificial-light rooms.','Stagger watering by pot weight and leaf feel.','Ships with desk care checklist.'),
  p('kraft-care-card-set','Kraft Care Card Set','Printed nursery cards','accessory',12,40,'set of 12 cards','flat-packed','tabletop','medium/bright indirect','easy','not applicable','pet-friendly',true,['giftable'],img.tag,'Writable care tags with pot-size measurement marks.','Use to label water cadence, light, and last repot date.','Flat-packed with recycled kraft sleeve.'),
  p('ceramic-cachepot-mist','Mist Ceramic Cachepot','Glazed ceramic pot','accessory',28,22,'6-inch cachepot','ships boxed','tabletop','medium/bright indirect','easy','not applicable','pet-friendly',true,['giftable'],img.cachepot,'Pale mist cachepot sized for a 6-inch nursery liner.','No drainage hole; lift grower pot to water.','Foam-corner packed separate from plants.'),
  p('terracotta-saucer-kit','Terracotta Saucer Kit','Porous terracotta set','accessory',18,33,'4-inch pot + saucer','ships boxed','tabletop','direct sun','no-fuss','not applicable','pet-friendly',true,['winter-ship'],img.terracottaSaucer,'Breathable pot and saucer for succulents and starts.','Best with gritty mix and bright direct light.','Wrapped to prevent chipping.'),
  p('neem-mister-care-kit','Neem + Mister Care Kit','Care supply bundle','accessory',32,28,'mister, cloth, neem sample','ships boxed','tabletop','medium/bright indirect','easy','boosts humidity routine','pet-friendly',true,['giftable'],img.tools,'Tactile workbench kit for leaf cleaning and humidity routines.','Mist around humidity lovers, not fuzzy succulents.','Ships in a recyclable care mailer.'),
  p('winter-heat-pack','Winter Shipping Heat Pack','72-hour nursery warmer','accessory',8,70,'single heat pack','added to mailer','tabletop','low/artificial','no-fuss','not applicable','pet-friendly',true,['winter-ship'],img.packing,'Optional cold-route warmer for live plant shipments.','Recommended when destination nights fall below 40F.','Activated by the packing bench on ship day.'),
];

function p(id, name, scientific, category, price, stock, pot, height, size, light, water, humidity, pet, beginner, flags, image, summary, care, shipping) {
  return {
    id, name, scientific, category, price, stock, pot, height, size, light, water, humidity, pet, beginner,
    flags, image, gallery: [image, img.tag, category === 'accessory' ? img.tools : img.packing],
    summary, care, shipping, sale: stock < 8, newest: productsSeedOrder++,
    review: { count: 18 + (id.length * 7) % 120, snippet: ['Arrived upright with damp paper and a clear care tag.','The pot size and light notes matched my apartment perfectly.','Packing was careful and the plant bounced back overnight.'][id.length % 3] },
    guarantee: '30-day demo live-arrival guarantee with photo-based replacement review.',
  };
}

const seededOrders = [
  order('FR-2408-1042', '2026-07-18', 'Delivered', ['maranta-red-prayer', 'kraft-care-card-set'], ['Greenhouse packed', 'Weather hold released', 'Delivered at shaded porch'], 72.28),
  order('FR-2407-1189', '2026-07-02', 'Replacement approved', ['boston-fern'], ['Packed with humidity sleeve', 'Carrier heat delay', 'Replacement approved'], 45.16),
  order('FR-2406-0965', '2026-06-20', 'Greenhouse packed', ['low-light-office-bundle', 'winter-heat-pack'], ['Order received', 'Bench count verified', 'Heat pack included', 'Greenhouse packed'], 112.77),
];
function order(id, date, status, itemIds, events, total) {
  return {
    id, date, status, total, contact: { name: 'Fern Demo', email: 'fern@frondosa.demo' },
    shipping: { address: '18 Conservatory Lane', city: 'Portland', state: 'OR', zip: '97214', note: 'Leave by shaded side door.' },
    items: itemIds.map((productId) => ({ productId, qty: 1 })),
    events: events.map((label, i) => ({ label, time: `${date} ${9 + i}:20`, note: i === events.length - 1 ? status : 'Frondosa dispatch log updated.' })),
  };
}

const filtersInitial = { q: '', light: [], size: [], pet: [], water: [], category: [], price: 140, beginner: false, sort: 'recommended' };
const demoUser = { name: 'Fern Demo', email: 'fern@frondosa.demo', password: 'greenhouse', preferences: ['Bright indirect light', 'Pet-safe shelf plants', 'Weekly watering check', 'Winter shipping hold alerts'] };

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function money(n) { return `$${n.toFixed(2)}`; }
const sitePrefix = () => window.location.pathname.match(/^.*?\/frondosa-nursery-shop(?=\/|$)/)?.[0] ?? '';
function path() {
  const raw = window.location.pathname.replace(/^.*?\/frondosa-nursery-shop(?=\/|$)/, '') || '/';
  return raw !== '/' ? raw.replace(/\/+$/, '') : raw;
}
function route(to) { history.pushState(null, '', `${sitePrefix()}${to}`); window.dispatchEvent(new Event('popstate')); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }

function App() {
  const [routePath, setRoutePath] = useState(path());
  const [cart, setCart] = useLocalStorage('frondosa.cart', []);
  const [orders, setOrders] = useLocalStorage('frondosa.orders', seededOrders);
  const [loggedIn, setLoggedIn] = useLocalStorage('frondosa.login', false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filters, setFilters] = useState(filtersInitial);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const onPop = () => setRoutePath(path());
    addEventListener('popstate', onPop);
    const t = setTimeout(() => setLoaded(true), 420);
    return () => { removeEventListener('popstate', onPop); clearTimeout(t); };
  }, []);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setCartOpen(false);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, []);

  const cartLines = cart.map((line) => ({ ...line, product: products.find((x) => x.id === line.productId) })).filter((x) => x.product);
  const totals = getTotals(cartLines);
  const addToCart = (productId, qty = 1) => {
    setCart((items) => {
      const found = items.find((x) => x.productId === productId);
      return found ? items.map((x) => x.productId === productId ? { ...x, qty: Math.min(x.qty + qty, 12) } : x) : [...items, { productId, qty }];
    });
    const name = products.find((x) => x.id === productId)?.name || 'Plant';
    setNotice(`${name} tag dropped into your care crate.`);
  };
  const updateQty = (productId, qty) => setCart((items) => qty <= 0 ? items.filter((x) => x.productId !== productId) : items.map((x) => x.productId === productId ? { ...x, qty } : x));
  const clearCart = () => setCart([]);

  let page = <Catalog loaded={loaded} filters={filters} setFilters={setFilters} addToCart={addToCart} cartLines={cartLines} totals={totals} />;
  if (routePath.startsWith('/plant/')) page = <ProductDetail id={routePath.split('/').pop()} addToCart={addToCart} />;
  if (routePath === '/cart') page = <CartPage cartLines={cartLines} totals={totals} updateQty={updateQty} clearCart={clearCart} />;
  if (routePath === '/checkout') page = <Checkout cartLines={cartLines} totals={totals} clearCart={clearCart} orders={orders} setOrders={setOrders} setLoggedIn={setLoggedIn} />;
  if (routePath.startsWith('/account/order/')) page = <OrderDetail id={routePath.split('/').pop()} orders={orders} />;
  if (routePath === '/account') page = <Account loggedIn={loggedIn} setLoggedIn={setLoggedIn} orders={orders} />;
  if (routePath.startsWith('/journal/')) page = <SupportPage id={routePath.split('/').pop()} />;

  return (
    <>
      <Header cartCount={cartLines.reduce((s, x) => s + x.qty, 0)} openCart={() => route('/cart')} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <main>{page}</main>
      <SiteFooter />
      <CartDrawer open={cartOpen} close={() => setCartOpen(false)} cartLines={cartLines} totals={totals} updateQty={updateQty} clearCart={clearCart} notice={notice} />
      <MobileCart cartLines={cartLines} totals={totals} openCart={() => route('/cart')} />
    </>
  );
}

function Header({ cartCount, openCart, loggedIn, setLoggedIn }) {
  return <header className="site-header">
    <button className="brand" onClick={() => route('/')} aria-label="Frondosa catalog"><span>Frondosa</span><small>nursery dispatch</small></button>
    <nav aria-label="Primary">
      <button onClick={() => route('/')}><Leaf size={17} /> Catalog</button>
      <button onClick={() => route('/journal/shipping')}><Truck size={17} /> Shipping</button>
      <button onClick={() => route('/account')}><UserRound size={17} /> Account</button>
      {loggedIn ? <button onClick={() => setLoggedIn(false)}><LogOut size={17} /> Logout</button> : <button onClick={() => { setLoggedIn(true); route('/account'); }}><LogIn size={17} /> Demo Login</button>}
      <button className="cart-pill" onClick={openCart} aria-label={`Open cart page, ${cartCount} items`}><ShoppingCart size={18} /> {cartCount}</button>
    </nav>
  </header>;
}

function Catalog({ loaded, filters, setFilters, addToCart, cartLines, totals }) {
  const [drawer, setDrawer] = useState(false);
  const filtered = useMemo(() => filterProducts(filters), [filters]);
  return <section className="catalog-shell">
    <div className="mobile-tools">
      <label className="searchbar"><Search size={17} /><input value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="Search pothos, Maranta, pet-safe..." /></label>
      <button onClick={() => setDrawer(true)}><SlidersHorizontal size={18} /> Filters</button>
    </div>
    <FilterRail filters={filters} setFilters={setFilters} drawer={drawer} setDrawer={setDrawer} />
    <section className="bench" aria-live="polite">
      <div className="bench-head">
        <div>
          <p className="eyebrow">live bench inventory</p>
          <h1>Match a plant to your windowsill, routine, and household.</h1>
        </div>
        <label className="sort">Sort
          <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="recommended">Recommended</option><option value="price-low">Price low</option><option value="price-high">Price high</option><option value="easy">Easiest care</option><option value="pet">Pet-safe first</option><option value="newest">Newest bench stock</option>
          </select>
        </label>
      </div>
      <ActiveChips filters={filters} setFilters={setFilters} />
      {!loaded ? <SkeletonGrid /> : filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}</div> : <EmptyFilters setFilters={setFilters} />}
    </section>
    <CareCrate cartLines={cartLines} totals={totals} />
  </section>;
}

function FilterRail({ filters, setFilters, drawer, setDrawer }) {
  const groups = [
    ['light','Light',['low/artificial','medium/bright indirect','direct sun']],
    ['size','Indoor size',['tabletop','shelf/trailing','medium','floor/statement']],
    ['pet','Pet safety',['pet-friendly','keep away from pets / toxic']],
    ['water','Watering',['no-fuss','easy','moderate','humidity-sensitive']],
    ['category','Type',['foliage','trailing','fern','palm','succulent/cactus','blooming','bundle','accessory']],
  ];
  const panel = <aside className="filter-rail">
    <div className="rail-title"><Leaf size={19} /><div><strong>Care match tags</strong><small>Clip filters together</small></div><button className="mobile-close" aria-label="Close filters" onClick={() => setDrawer(false)}><X size={18} /></button></div>
    <label className="searchbar desktop-search"><Search size={17} /><input value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="Search species, care, category" /></label>
    {groups.map(([key, title, values]) => <fieldset key={key} className="tag-stack"><legend>{title}</legend>{values.map((value) => <label key={value} className="check-tag"><input type="checkbox" checked={filters[key].includes(value)} onChange={() => toggleFilter(filters, setFilters, key, value)} /><span>{value}</span></label>)}</fieldset>)}
    <fieldset className="tag-stack"><legend>Price up to {money(filters.price)}</legend><input className="range" type="range" min="10" max="140" aria-label="Maximum price" value={filters.price} onChange={(e) => setFilters({ ...filters, price: Number(e.target.value) })} /></fieldset>
    <label className="check-tag toggle"><input type="checkbox" checked={filters.beginner} onChange={(e) => setFilters({ ...filters, beginner: e.target.checked })} /><span>beginner-friendly only</span></label>
    <button className="clear" onClick={() => setFilters(filtersInitial)}>Clear all tags</button>
  </aside>;
  return <>{panel}<div className={`filter-sheet ${drawer ? 'open' : ''}`}>{panel}</div>{drawer && <button className="scrim" aria-label="Close filters" onClick={() => setDrawer(false)} />}</>;
}

function toggleFilter(filters, setFilters, key, value) {
  const list = filters[key].includes(value) ? filters[key].filter((x) => x !== value) : [...filters[key], value];
  setFilters({ ...filters, [key]: list });
}

function ActiveChips({ filters, setFilters }) {
  const chips = [...filters.light, ...filters.size, ...filters.pet, ...filters.water, ...filters.category, filters.beginner ? 'beginner-friendly' : null, filters.price < 140 ? `under ${money(filters.price)}` : null].filter(Boolean);
  return <div className="chips">{chips.map((chip) => <span key={chip}>{chip}</span>)}{chips.length > 0 && <button onClick={() => setFilters(filtersInitial)}>clear all</button>}</div>;
}

function filterProducts(f) {
  const q = f.q.trim().toLowerCase();
  let list = products.filter((p) =>
    (!q || [p.name, p.scientific, p.category, p.summary, p.care, p.light, p.water, p.pet].join(' ').toLowerCase().includes(q)) &&
    (!f.light.length || f.light.includes(p.light)) && (!f.size.length || f.size.includes(p.size)) &&
    (!f.pet.length || f.pet.includes(p.pet)) && (!f.water.length || f.water.includes(p.water)) &&
    (!f.category.length || f.category.includes(p.category)) && p.price <= f.price && (!f.beginner || p.beginner));
  const rank = { 'no-fuss': 0, easy: 1, moderate: 2, 'humidity-sensitive': 3 };
  if (f.sort === 'price-low') list.sort((a,b) => a.price - b.price);
  if (f.sort === 'price-high') list.sort((a,b) => b.price - a.price);
  if (f.sort === 'easy') list.sort((a,b) => rank[a.water] - rank[b.water]);
  if (f.sort === 'pet') list.sort((a,b) => (b.pet === 'pet-friendly') - (a.pet === 'pet-friendly'));
  if (f.sort === 'newest') list.sort((a,b) => b.newest - a.newest);
  return list;
}

function ProductCard({ product, addToCart }) {
  return <article className="product-card">
    <button className="photo-button" onClick={() => route(`/plant/${product.id}`)} aria-label={`View care card for ${product.name}`}><img src={product.image} alt={`${product.name} product photo`} loading="lazy" decoding="async" /></button>
    <div className="card-copy">
      <div className="card-title"><h2>{product.name}</h2><em>{product.scientific}</em></div>
      <p>{product.summary}</p>
      <div className="badges"><span>{product.light}</span><span>{product.water === 'no-fuss' ? 'water rarely' : product.water === 'humidity-sensitive' ? 'humidity lover' : `water: ${product.water}`}</span><span className={product.pet === 'pet-friendly' ? 'safe' : 'warn'}>{product.pet === 'pet-friendly' ? 'ASPCA-friendly species' : 'keep from pets'}</span></div>
      <dl className="specs"><div><dt>Pot</dt><dd>{product.pot}</dd></div><div><dt>Arrival</dt><dd>{product.height}</dd></div></dl>
      <div className="buy-row"><div><strong>{money(product.price)}</strong><small>{product.stock} left on bench</small></div><button onClick={() => addToCart(product.id)}>Quick add</button></div>
    </div>
  </article>;
}

function CareCrate({ cartLines, totals }) {
  return <aside className="care-crate">
    <img src={img.packing} alt="Hands packing a live plant order" />
    <div className="slip">
      <p className="eyebrow">care crate</p>
      <h2>{cartLines.length ? `${cartLines.length} bench tag${cartLines.length > 1 ? 's' : ''} clipped` : 'Start a live-plant crate'}</h2>
      {cartLines.slice(0,3).map((line) => <p key={line.productId}><span>{line.qty}x</span> {line.product.name}</p>)}
      <div className="crate-total"><span>Estimated total</span><strong>{money(totals.total)}</strong></div>
      <button onClick={() => route('/cart')}>Open packing slip</button>
    </div>
    <div className="support-card"><BadgeCheck size={18} /><span>Winter holds, heat packs, and 30-day demo guarantee are shown before checkout.</span></div>
  </aside>;
}

function ProductDetail({ id, addToCart }) {
  const product = products.find((x) => x.id === id);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) return <NotFound />;
  const related = products.filter((x) => x.id !== product.id && (x.category === product.category || x.light === product.light || x.pet === product.pet)).slice(0, 4);
  return <section className="detail-shell full-product">
    <button className="back" onClick={() => route('/')}><ChevronLeft size={17} /> Greenhouse catalog</button>
    <div className="product-hero">
      <div className="gallery showcase-gallery">
        <img className="gallery-main" src={product.gallery[active]} alt={`${product.name} gallery view ${active + 1}`} />
        <div>{product.gallery.map((src, i) => <button className={active === i ? 'active' : ''} key={`${src}-${i}`} aria-label={`Show ${product.name} photo ${i + 1}`} onClick={() => setActive(i)}><img src={src} alt="" /></button>)}</div>
      </div>
      <article className="care-card purchase-card">
        <p className="eyebrow">species bench card / {product.category}</p>
        <h1>{product.name}</h1><em>{product.scientific}</em>
        <p className="lead">{product.summary} {product.review.snippet}</p>
        <div className="price-stock"><strong>{money(product.price)}</strong><span>{product.stock} left on today’s bench</span></div>
        <div className="badges detail-badges"><span>{product.light}</span><span>{product.water}</span><span>{product.pot}</span><span>{product.height}</span><span>{product.size}</span><span className={product.pet === 'pet-friendly' ? 'safe' : 'warn'}>{product.pet}</span></div>
        <div className="qty-row"><span>Quantity</span><button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}><ChevronLeft size={16} /></button><strong>{qty}</strong><button aria-label="Increase quantity" onClick={() => setQty(Math.min(product.stock, qty + 1))}><ChevronRight size={16} /></button></div>
        <button className="primary big-buy" onClick={() => { addToCart(product.id, qty); setAdded(true); }}>Add to care crate</button>
        {added && <p className="confirm" role="status">Added {qty} {product.name} bench tag to your crate. Continue browsing or open the full cart page.</p>}
        <button className="linkish wide-link" onClick={() => route('/cart')}>Review full cart page</button>
      </article>
    </div>
    <div className="detail-grid expanded">
      <section className="notes">
        <h2>Care notes from the grow bench</h2>
        <dl><div><dt>Light</dt><dd>{product.light}. Keep leaves out of harsh drafts and rotate the pot for even growth.</dd></div><div><dt>Watering</dt><dd>{product.care}</dd></div><div><dt>Humidity</dt><dd>{product.humidity}</dd></div><div><dt>Pet safety</dt><dd>{product.pet === 'pet-friendly' ? 'Labeled pet-friendly for this demo; pet-safe does not mean edible.' : 'Keep away from pets and check with a vet or poison-control source if chewed.'}</dd></div><div><dt>Beginner note</dt><dd>{product.beginner ? 'A forgiving pick for a first bench order.' : 'Best for plant keepers who like checking conditions.'}</dd></div></dl>
      </section>
      <section className="box-panel">
        <h2>What arrives in the box</h2>
        <ul><li>{product.pot}</li><li>Species care card clipped to kraft tag</li><li>Packing slip with water cadence and order ID</li><li>Soil-secure wrap, recycled paper sleeve, and upright support where needed</li></ul>
        <p><Truck size={17} /> {product.shipping}</p><p><PackageCheck size={17} /> {product.guarantee}</p>
      </section>
      <section className="box-panel provenance-panel">
        <h2>Nursery measurements</h2>
        <p><Leaf size={17} /> Pot: {product.pot}. Arrival: {product.height}. Mature indoor fit: {product.size}.</p>
        <p><BadgeCheck size={17} /> Review signal: {product.review.count} demo keepers, “{product.review.snippet}”</p>
      </section>
    </div>
    <section className="related"><h2>Related bench alternatives</h2><div className="related-grid">{related.map((x) => <ProductCard key={x.id} product={x} addToCart={addToCart} />)}</div></section>
  </section>;
}

function CartDrawer({ open, close, cartLines, totals, updateQty, clearCart, notice }) {
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => { if (open) { setLoading(true); setTimeout(() => { setLoading(false); ref.current?.focus(); }, 280); } }, [open]);
  return <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
    <div className="drawer-head"><h2 tabIndex="-1" ref={ref}>Care crate</h2><button onClick={close} aria-label="Close cart"><X size={20} /></button></div>
    {notice && <p className="confirm">{notice}</p>}
    {loading ? <CartSkeleton /> : error ? <div className="empty"><h3>Bench count changed</h3><p>Refresh the estimate before checking out.</p><button onClick={() => setError(false)}>Retry estimate</button></div> : <CartContents cartLines={cartLines} totals={totals} updateQty={updateQty} clearCart={clearCart} compact />}
    {!!cartLines.length && <button className="linkish" onClick={() => setError(true)}>Simulate stock estimate error</button>}
  </aside>;
}

function CartPage({ cartLines, totals, updateQty, clearCart }) {
  return <section className="cart-page">
    <div className="page-hero"><p className="eyebrow">cart / live plant crate</p><h1>Review the full packing slip before the greenhouse boxes it.</h1><p>Quantities, bench stock, weather-aware shipping, tax estimate, and demo-payment language stay visible before checkout.</p></div>
    <div className="cart-full-grid"><CartContents cartLines={cartLines} totals={totals} updateQty={updateQty} clearCart={clearCart} /><aside className="box-panel"><h2>Shipping bench notes</h2><p><Truck size={17} /> Orders dispatch early week so live plants do not sit in a carrier depot over the weekend.</p><p><PackageCheck size={17} /> Winter holds, heat packs, and photo-based replacement review are simulated here.</p><button onClick={() => route('/journal/returns')}>Read returns policy</button></aside></div>
  </section>;
}

function CartContents({ cartLines, totals, updateQty, clearCart, compact }) {
  if (!cartLines.length) return <div className="empty"><Sprout size={42} /><h2>Your care crate is empty.</h2><p>Clip a bench tag from the greenhouse catalog to start a live plant order.</p><button onClick={() => route('/')}>Back to catalog</button></div>;
  return <div className="cart-content">
    {cartLines.map(({ product, qty }) => <div className="cart-line" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.pot} / {product.height}</small><div className="qty-row small"><button aria-label={`Decrease ${product.name}`} onClick={() => updateQty(product.id, qty - 1)}>-</button><span>{qty}</span><button aria-label={`Increase ${product.name}`} onClick={() => updateQty(product.id, qty + 1)}>+</button><button onClick={() => updateQty(product.id, 0)}>Remove</button></div></div><b>{money(product.price * qty)}</b></div>)}
    <Totals totals={totals} />
    <div className="cart-actions"><button onClick={clearCart}>Empty crate</button><button className="primary" onClick={() => route('/checkout')}>Checkout demo order</button></div>
    {!compact && <p className="fine">Live plants ship early week when local weather allows. Demo checkout collects no real payment.</p>}
  </div>;
}

function Checkout({ cartLines, totals, clearCart, orders, setOrders, setLoggedIn }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', state: '', zip: '', note: '', payment: false });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    ['name','address','city','state','zip'].forEach((k) => { if (!form[k].trim()) next[k] = 'Required for the packing slip.'; });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.payment) next.payment = 'Choose demo payment to continue.';
    setErrors(next);
    if (Object.keys(next).length) { requestAnimationFrame(() => document.querySelector('.error-summary')?.focus()); return; }
    const id = `FR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8000)}`;
    const newOrder = { id, date: new Date().toISOString().slice(0,10), status: 'Greenhouse packed', total: totals.total, contact: { name: form.name, email: form.email }, shipping: form, items: cartLines.map((x) => ({ productId: x.product.id, qty: x.qty })), events: ['Order received','Bench count verified','Care card printed','Greenhouse packed'].map((label, i) => ({ label, time: new Date(Date.now() + i * 60000).toLocaleString(), note: 'Demo dispatch event.' })) };
    setOrders([newOrder, ...orders]); clearCart(); setLoggedIn(true); setDone(newOrder);
  };
  if (!cartLines.length && !done) return <section className="page-slip"><div className="empty"><h1>Checkout needs a plant crate.</h1><button onClick={() => route('/')}>Browse catalog</button></div></section>;
  if (done) return <Confirmation order={done} />;
  return <section className="checkout-page">
    <div className="page-hero"><p className="eyebrow">checkout / no real payment</p><h1>Shipping and care handoff</h1><p>This is a full-page simulated checkout: back-navigable, validated, and explicit that no real payment is collected.</p></div>
    <div className="checkout-grid">
    <form className="checkout-form" onSubmit={submit} noValidate>
      <p className="demo-pay">Demo checkout — no real payment is collected or processed.</p>
      {Object.keys(errors).length > 0 && <div className="error-summary" tabIndex="-1">Please fix the highlighted packing-slip fields.</div>}
      {['name','email','address','city','state','zip'].map((k) => <label key={k}>{k === 'zip' ? 'ZIP / postal' : k[0].toUpperCase() + k.slice(1)}<input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} autoComplete={{ name: 'name', email: 'email', address: 'shipping street-address', city: 'shipping address-level2', state: 'shipping address-level1', zip: 'shipping postal-code' }[k]} />{errors[k] && <small className="field-error">{errors[k]}</small>}</label>)}
      <label>Delivery note <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
      <label className="payment-choice"><input type="checkbox" checked={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.checked })} /> Use demo payment</label>{errors.payment && <small className="field-error">{errors.payment}</small>}
      <button className="primary">Place demo order</button>
    </form>
    <aside className="checkout-summary"><h2>Order summary</h2><CartContents cartLines={cartLines} totals={totals} updateQty={() => {}} clearCart={() => {}} compact /><p><Box size={17} /> Includes live-plant wrap, printed care tags, and weather-aware dispatch language.</p><p><BadgeCheck size={17} /> After confirmation, this order is written to local demo history and appears in Account.</p></aside>
    </div>
  </section>;
}

function Confirmation({ order }) {
  return <section className="confirmation"><PackageCheck size={46} /><p className="eyebrow">greenhouse packed</p><h1>Order {order.id} is in the dispatch log.</h1><p>Unbox within 24 hours, remove soil wrap, and let leaves rest in bright indirect light before watering unless the care card says otherwise.</p><Timeline events={order.events} /><div><button onClick={() => route(`/account/order/${order.id}`)}>View order detail</button><button onClick={() => route('/account')}>Account history</button></div></section>;
}

function Account({ loggedIn, setLoggedIn, orders }) {
  if (!loggedIn) return <section className="account-login"><h1>Demo account</h1><p>No auth server is connected. Use the demo login to view saved care preferences and dispatch logs.</p><code>fern@frondosa.demo / greenhouse</code><button className="primary" onClick={() => setLoggedIn(true)}>One-click demo login</button></section>;
  return <section className="account-grid"><div className="profile-card"><p className="eyebrow">customer bench profile</p><h1>{demoUser.name}</h1><p>{demoUser.email}</p><button onClick={() => setLoggedIn(false)}>Logout</button><h2>Saved care preferences</h2>{demoUser.preferences.map((x) => <span className="pref" key={x}>{x}</span>)}</div><div className="orders-log"><h2>Greenhouse dispatch logs</h2>{orders.map((o) => <button key={o.id} className="order-row" onClick={() => route(`/account/order/${o.id}`)}><span><strong>{o.id}</strong><small>{o.date}</small></span><span>{o.status}</span><b>{money(o.total)}</b></button>)}</div></section>;
}

function OrderDetail({ id, orders }) {
  const order = orders.find((x) => x.id === id);
  if (!order) return <NotFound />;
  return <section className="order-detail"><button className="back" onClick={() => route('/account')}><ChevronLeft size={17} /> Account</button><h1>Dispatch log {order.id}</h1><p>{order.status} for {order.contact?.email}</p><div className="order-layout"><div>{order.items.map((line) => { const product = products.find((x) => x.id === line.productId); return <div className="cart-line" key={line.productId}><img src={product?.image} alt="" /><div><strong>{product?.name}</strong><small>{line.qty} x {product?.pot}</small></div></div>; })}<Totals totals={{ subtotal: order.total * .82, shipping: 12, tax: order.total * .08, total: order.total }} /></div><div><h2>Tracking-style timeline</h2><Timeline events={order.events} /><p className="fine">Support reviews live-arrival photos for 30 days. Care reminders remain attached to this demo order.</p></div></div></section>;
}

function Timeline({ events }) { return <ol className="timeline">{events.map((e) => <li key={e.label}><strong>{e.label}</strong><small>{e.time}</small><p>{e.note}</p></li>)}</ol>; }
function Totals({ totals }) { return <dl className="totals"><div><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div><div><dt>Shipping</dt><dd>{money(totals.shipping)}</dd></div><div><dt>Estimated tax</dt><dd>{money(totals.tax)}</dd></div><div><dt>Total</dt><dd>{money(totals.total)}</dd></div><progress value={Math.min(totals.subtotal, 125)} max="125" /><small>{totals.subtotal >= 125 ? 'Free shipping threshold reached.' : `${money(125 - totals.subtotal)} until free shipping.`}</small></dl>; }
function getTotals(lines) { const subtotal = lines.reduce((s, x) => s + x.product.price * x.qty, 0); const shipping = subtotal === 0 || subtotal >= 125 ? 0 : 12; const tax = subtotal * 0.0825; return { subtotal, shipping, tax, total: subtotal + shipping + tax }; }
function SkeletonGrid() { return <div className="product-grid">{Array.from({ length: 9 }).map((_, i) => <div className="skeleton" key={i} />)}</div>; }
function CartSkeleton() { return <div><div className="skeleton line" /><div className="skeleton line" /><div className="skeleton line" /></div>; }
function EmptyFilters({ setFilters }) { return <div className="empty"><Leaf size={44} /><h2>No plants match this windowsill yet.</h2><p>Try loosening light, price, or pet-safety tags so the bench can widen again.</p><button onClick={() => setFilters(filtersInitial)}>Loosen all filters</button></div>; }
function NotFound() { return <section className="empty page-slip"><h1>That care card is not on this bench.</h1><button onClick={() => route('/')}>Return to catalog</button></section>; }
function MobileCart({ cartLines, totals, openCart }) { if (!cartLines.length) return null; return <button className="mobile-cart" onClick={openCart}><ShoppingCart size={18} /> {cartLines.reduce((s,x)=>s+x.qty,0)} items <strong>{money(totals.total)}</strong></button>; }

const supportCopy = {
  shipping: ['Shipping live plants', 'Frondosa demo orders show weather-aware dispatch, heat-pack hints, upright wrap, soil-secure paper, and unpack-within-24-hours care language. Real checkout is not connected.'],
  returns: ['Returns + live-arrival guarantee', 'This showcase simulates a 30-day live-arrival review: customers would submit arrival photos, damage notes, and care-card ID before a replacement decision. No real claim is processed.'],
  privacy: ['Privacy in this demo', 'Demo account, cart, and order history stay in this browser localStorage only. There is no auth server, no analytics sale, and no real payment collection.'],
  story: ['About Frondosa', 'Frondosa is a fictional online nursery built to demonstrate the full surrounding surface of a modern plant shop: catalog depth, care expertise, routed product pages, cart, checkout, account history, and policy furniture.'],
};
function SupportPage({ id }) {
  const [title, copy] = supportCopy[id] || supportCopy.story;
  return <section className="support-page"><p className="eyebrow">greenhouse desk</p><h1>{title}</h1><p>{copy}</p><div className="support-grid"><button onClick={() => route('/')}>Browse catalog</button><button onClick={() => route('/cart')}>Open cart</button><button onClick={() => route('/account')}>Account history</button></div></section>;
}
function SiteFooter() {
  return <footer className="site-footer">
    <div><strong>Frondosa</strong><span>Fictional online nursery demo — no real orders, payments, or plant shipments.</span></div>
    <nav aria-label="Footer"><button onClick={() => route('/journal/story')}>About</button><button onClick={() => route('/journal/shipping')}>Shipping</button><button onClick={() => route('/journal/returns')}>Returns</button><button onClick={() => route('/journal/privacy')}>Privacy</button></nav>
    <p>© 2026 Frondosa Demo Nursery. Built for the Neutron external showcase with web-sourced plant photography.</p>
  </footer>;
}

createRoot(document.getElementById('root')).render(<App />);
