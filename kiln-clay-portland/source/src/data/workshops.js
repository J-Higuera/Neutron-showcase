// Workshop catalog + a deterministic "next occurrences" generator so the
// schedule always shows real upcoming dates — the site never looks stale.
export const WORKSHOP_TYPES = [
  {
    id: 'wheel-night', title: 'First-Time Wheel Night', tag: 'Beginner · 2 hours',
    weekday: 2, hour: 18, price: 65, seats: 8,
    desc: 'Center, open, and pull a small cup or bowl with close coaching.',
    included: 'Clay, trimming, glazing, and firing included.',
  },
  {
    id: 'handbuilding', title: 'Handbuilding Table', tag: 'All levels · 2.5 hours',
    weekday: 4, hour: 18, price: 58, seats: 10,
    desc: 'Pinch, coil, slab, and texture trays, vases, planters, and sculptural objects.',
    included: 'Best for groups who want room to talk.',
  },
  {
    id: 'glaze-lab', title: 'Glaze Lab', tag: 'Curious makers · 90 min',
    weekday: 6, hour: 11, price: 40, seats: 6,
    desc: 'Read test tiles, choose surfaces, and learn why thickness, clay body, and heat matter.',
    included: 'Bring bisque or use studio forms.',
  },
  {
    id: 'throwing-series', title: 'Six-Week Throwing Series', tag: 'Returning · 6 weeks',
    weekday: 3, hour: 19, price: 320, seats: 6,
    desc: 'Repeatable cylinders, bowls, handles, lids, and glaze records across a full firing cycle.',
    included: 'For people ready to practice with continuity.',
  },
  {
    id: 'date-night', title: 'Group / Date Night', tag: 'Private · 2 hours',
    weekday: 5, hour: 19, price: 150, seats: 12,
    desc: 'A hosted table or wheel session for birthdays, teams, couples, and visiting family.',
    included: 'Pickup timeline confirmed before you leave.',
  },
];

// Next occurrence of each type's weekday, then the one after — merged and
// sorted so the list reads like a real studio calendar.
export function upcomingSessions(count = 6) {
  const now = new Date();
  const sessions = [];
  for (const type of WORKSHOP_TYPES) {
    for (let round = 0; round < 2; round++) {
      const d = new Date(now);
      const delta = (type.weekday - d.getDay() + 7) % 7 || 7;
      d.setDate(d.getDate() + delta + round * 7);
      d.setHours(type.hour, 0, 0, 0);
      sessions.push({ ...type, date: d, key: `${type.id}-${round}` });
    }
  }
  return sessions.sort((a, b) => a.date - b.date).slice(0, count);
}

export function formatSession(date) {
  const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

// Client-side .ics so a booking request lands on the visitor's calendar too.
export function makeIcs(session) {
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const end = new Date(session.date.getTime() + 2 * 60 * 60 * 1000);
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kiln and Clay//Workshops//EN',
    'BEGIN:VEVENT',
    `UID:${session.key}@kilnandclaypdx.studio`,
    `DTSTART:${stamp(session.date)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${session.title} - Kiln & Clay`,
    `DESCRIPTION:${session.desc}\\nRequested seat - the studio confirms by email.`,
    'LOCATION:Kiln & Clay Studio, Portland, OR',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
