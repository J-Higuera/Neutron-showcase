// The glaze families are the studio's real surface language — every entry
// mirrors a fired cone-6 test tile on the wall, not a mood board.
export const GLAZES = [
  {
    id: 'rain-ash',
    name: 'Rain Ash Speckle',
    stamp: '02',
    cone: 'Cone 6 · oxidation',
    surface: 'Satin matte',
    line: 'Soft gray-green ash, iron freckles, quiet rims.',
    behavior:
      'Breaks pale over rims and texture, pools sage in the wells. Iron in the clay body freckles through - no two mugs speckle the same.',
    gradient: ['#e9eee4', '#839189', '#4c5c53'],
    ink: '#171311',
  },
  {
    id: 'iron-slip',
    name: 'Iron Slip Stripe',
    stamp: 'C6',
    cone: 'Cone 6 · oxidation',
    surface: 'Satin clear over slip',
    line: 'Brush marks left visible under a satin clear surface.',
    behavior:
      'Iron-rich slip is brushed while the piece still turns, then sealed under clear. The stripe keeps the speed of the hand that made it.',
    gradient: ['#d4a47c', '#8c5639', '#3a2118'],
    ink: '#fff8ed',
  },
  {
    id: 'moss-celadon',
    name: 'Moss Celadon',
    stamp: '27',
    cone: 'Cone 6 · oxidation',
    surface: 'Gloss',
    line: 'Pooled green edges over pale stoneware.',
    behavior:
      'Thin where the form is fast, deep moss where it slows. Carved lines fill first - we carve for this glaze on purpose.',
    gradient: ['#dfe9d9', '#7f9b78', '#4b614f'],
    ink: '#171311',
  },
  {
    id: 'ember-shino',
    name: 'Ember Shino',
    stamp: '19',
    cone: 'Cone 6 · reduction note',
    surface: 'Crawl / matte',
    line: 'Warm crawl, toasted edges, kiln variation.',
    behavior:
      'The kiln gets a vote. Carbon trap toasts the edges, thick spots crawl and curdle - limited runs only, and each firing is logged.',
    gradient: ['#f0c18c', '#d86b2a', '#512518'],
    ink: '#fff8ed',
  },
];

export const glazeById = (id) => GLAZES.find((g) => g.id === id);
