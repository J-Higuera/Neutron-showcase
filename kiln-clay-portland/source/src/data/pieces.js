// The shelf ledger: every piece the studio currently stands behind.
// status: 'available' | 'kiln' (in the firing queue) | 'sold'
export const PIECES = [
  {
    id: 'burnside-mug', name: 'Burnside Mug', form: 'mug', glaze: 'rain-ash',
    dims: '9 oz · 8.5 cm tall', foot: 'Trimmed foot ring, signed',
    price: 38, status: 'available',
    note: 'Everyday wheel-thrown mug, pulled handle, rim breaks pale.',
  },
  {
    id: 'rainlight-bowl', name: 'Rainlight Bowl', form: 'bowl', glaze: 'rain-ash',
    dims: '18 cm across', foot: 'Soft foot, unglazed band',
    price: 52, status: 'available',
    note: 'Breakfast-depth bowl. Speckle gathers in the well like wet pavement.',
  },
  {
    id: 'lovejoy-vase', name: 'Lovejoy Vase', form: 'vase', glaze: 'moss-celadon',
    dims: '21 cm tall', foot: 'Carved shoulder lines',
    price: 96, status: 'available',
    note: 'Narrow-neck bud vase, carved for the celadon to pool.',
  },
  {
    id: 'steel-bridge-pitcher', name: 'Steel Bridge Pitcher', form: 'pitcher', glaze: 'iron-slip',
    dims: '1.1 L · 19 cm tall', foot: 'Pulled spout, thumb rest',
    price: 118, status: 'kiln',
    note: 'Table pitcher. The slip stripe runs the full pour line.',
  },
  {
    id: 'cone-notes-planter', name: 'Cone Notes Planter', form: 'planter', glaze: 'iron-slip',
    dims: '14 cm · drainage hole', foot: 'Saucer included',
    price: 64, status: 'available',
    note: 'Straight-walled planter, stripe brushed on the turn.',
  },
  {
    id: 'ember-supper-plate', name: 'Ember Supper Plate', form: 'plate', glaze: 'ember-shino',
    dims: '26 cm dinner', foot: 'Stacked-firing shadow on the back',
    price: 58, status: 'kiln',
    note: 'Dinner plate from the last reduction-note firing. Edges toasted.',
  },
  {
    id: 'tabor-mug', name: 'Tabor Mug', form: 'mug', glaze: 'moss-celadon',
    dims: '11 oz · 9 cm tall', foot: 'Carved facets',
    price: 42, status: 'available',
    note: 'Faceted mug - the celadon fills every cut a shade deeper.',
  },
  {
    id: 'reduction-jar', name: 'Reduction Jar', form: 'vase', glaze: 'ember-shino',
    dims: '16 cm tall · lidded', foot: 'Logged firing 19',
    price: 132, status: 'sold',
    note: 'Lidded jar, carbon-trap toast on the north face. One of one.',
  },
  {
    id: 'willamette-serving-bowl', name: 'Willamette Serving Bowl', form: 'bowl', glaze: 'iron-slip',
    dims: '28 cm across', foot: 'Double stripe interior',
    price: 110, status: 'available',
    note: 'Family-size serving bowl. Stripes cross at the well.',
  },
  {
    id: 'drizzle-cup-pair', name: 'Drizzle Cup Pair', form: 'mug', glaze: 'ember-shino',
    dims: '2 × 6 oz · no handle', foot: 'Sold as a pair',
    price: 56, status: 'available',
    note: 'Small kurinuki-inspired cups. Crawl texture where thumbs land.',
  },
  {
    id: 'saint-johns-vase', name: 'St. Johns Vase', form: 'vase', glaze: 'rain-ash',
    dims: '27 cm tall', foot: 'Wide shoulder, narrow foot',
    price: 145, status: 'available',
    note: 'Statement vase - ash speckle runs heavier on the weather side.',
  },
  {
    id: 'glaze-lab-plate', name: 'Glaze Lab Plate', form: 'plate', glaze: 'moss-celadon',
    dims: '21 cm salad', foot: 'Test-tile ring on the back',
    price: 44, status: 'sold',
    note: 'Salad plate from the glaze-lab series, carved rim line.',
  },
];

export const FORMS = ['mug', 'bowl', 'vase', 'pitcher', 'planter', 'plate'];

export const STATUS_LABEL = {
  available: 'Available',
  kiln: 'In the kiln queue',
  sold: 'Sold',
};
