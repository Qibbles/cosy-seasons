// The storybook scene, one layout for every season: a feature tree on the
// left, an A-frame cabin on the right, mountains and pines behind, and three
// friends standing on the ground pile: a girl, a frog and Kuro the black cat.

import type { Season } from './scene'

const W = 1600
const H = 900
const r = (v: number) => Math.round(v * 10) / 10

type Look = {
  sky: [string, string, string, string] // dark top, dark bottom, light top, light bottom
  mtn: [string, string, string, string] // far dark, near dark, far light, near light
  caps: boolean
  pine: [string, string]
  pineSnow: boolean
  strip: string
  orbLight: string // the sun's color in light mode
}

const LOOKS: Record<Season, Look> = {
  winter: {
    sky: ['#0c1733', '#2a3f6e', '#5f78a8', '#b9c8e2'],
    mtn: ['#3a5080', '#2c3d66', '#97a9cc', '#7f93bd'],
    caps: true,
    pine: ['#1d3a45', '#2f5560'],
    pineSnow: true,
    strip: '#e8eff9',
    orbLight: '#f4efd8',
  },
  spring: {
    sky: ['#1f1d45', '#5a4a7a', '#f4c9d8', '#fdf0e4'],
    mtn: ['#4a4a78', '#3a4a62', '#cbd6ee', '#b4cfa8'],
    caps: true,
    pine: ['#23413a', '#4f8a5a'],
    pineSnow: false,
    strip: '#8fc46a',
    orbLight: '#fff6d8',
  },
  summer: {
    sky: ['#101d3a', '#3c4f7a', '#f7a960', '#fde2b0'],
    mtn: ['#3a4a6e', '#27384f', '#d7a8a0', '#9ab97a'],
    caps: false,
    pine: ['#1c3a2c', '#3f7a3e'],
    pineSnow: false,
    strip: '#5f9e47',
    orbLight: '#fff1c4',
  },
  autumn: {
    sky: ['#1c1530', '#5b3045', '#e9935f', '#f8d9a8'],
    mtn: ['#4a3150', '#352438', '#c98f78', '#b0775a'],
    caps: false,
    pine: ['#26302a', '#3d5a40'],
    pineSnow: false,
    strip: '#b5562a',
    orbLight: '#ffe6b8',
  },
}

export const storyCss = (season: Season): string => {
  const l = LOOKS[season]

  return `
.b-sky1{stop-color:${l.sky[0]}}.b-sky2{stop-color:${l.sky[1]}}
.b-mtn2{fill:${l.mtn[0]}}.b-mtn{fill:${l.mtn[1]}}.b-cap{fill:#d7e2f2}
.b-pine{fill:${l.pine[0]}}.b-snow{fill:#e8eff9}
.b-orb{fill:#f4efd8}
.b-win{fill:#ffc96b;animation:flicker 6s ease-in-out infinite}
.b-tw{animation:btw 5s ease-in-out infinite}
.b-wave{transform-box:fill-box;transform-origin:15% 90%;animation:bwave 3.5s ease-in-out infinite}
.b-tail{transform-box:fill-box;transform-origin:0% 100%;animation:btail 5s ease-in-out infinite}
.b-blink{transform-box:fill-box;transform-origin:center;animation:bblink 7s infinite}
.b-pom{transform-box:fill-box;transform-origin:50% 100%;animation:bbob 4s ease-in-out infinite}
.b-swing{transform-box:fill-box;transform-origin:50% 0%;animation:bswing 5s ease-in-out infinite}
@media (prefers-color-scheme: light){
.b-sky1{stop-color:${l.sky[2]}}.b-sky2{stop-color:${l.sky[3]}}
.b-mtn2{fill:${l.mtn[2]}}.b-mtn{fill:${l.mtn[3]}}.b-cap{fill:#f3f6fb}
.b-pine{fill:${l.pine[1]}}
.b-orb{fill:${l.orbLight}}
}
@keyframes btw{0%,100%{opacity:1}50%{opacity:0.45}}
@keyframes bwave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-22deg)}}
@keyframes btail{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-14deg)}}
@keyframes bblink{0%,95%,100%{transform:scaleY(1)}97.5%{transform:scaleY(0.1)}}
@keyframes bbob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes bswing{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
`
}

export const STORY_DEFS =
  '<linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="b-sky1"/><stop offset="1" class="b-sky2"/></linearGradient>' +
  '<radialGradient id="bglow"><stop offset="0" stop-color="#ffd98a" stop-opacity="0.9"/><stop offset="0.3" stop-color="#ffc35e" stop-opacity="0.35"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="bmoon"><stop offset="0" stop-color="#fff8e0" stop-opacity="0.35"/><stop offset="1" stop-color="#fff8e0" stop-opacity="0"/></radialGradient>'

const glowBulb = (x: number, y: number, size: number, color: string, delay: number): string =>
  `<g class="b-tw" style="animation-delay:-${r(delay)}s"><circle cx="${r(x)}" cy="${r(y)}" r="${r(size * 3.2)}" fill="url(#bglow)"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(size)}" fill="${color}"/></g>`

const pine = (x: number, base: number, s: number, snowy: boolean): string => {
  let d = ''
  let caps = ''

  for (let i = 0; i < 4; i++) {
    const y = base - 30 * s - i * 42 * s
    const w = (62 - i * 13) * s
    d += `M${r(x - w)},${r(y)}L${r(x)},${r(y - 66 * s)}L${r(x + w)},${r(y)}Z`
    caps += `M${r(x - w * 0.5)},${r(y - 33 * s)}L${r(x)},${r(y - 66 * s)}L${r(x + w * 0.5)},${r(y - 33 * s)}Q${r(x)},${r(y - 26 * s)} ${r(x - w * 0.5)},${r(y - 33 * s)}Z`
  }

  return `<path d="${d}" class="b-pine"/>${snowy ? `<path d="${caps}" class="b-snow"/>` : ''}`
}

const christmasTree = (x: number, base: number, rand: () => number): string => {
  const colors = ['#ffcf5e', '#ff6b6b', '#7fd6ff', '#ffe9a8', '#ff9f43']
  let out = `<rect x="${x - 14}" y="${base - 60}" width="28" height="60" fill="#4a2f20"/>`
  let tiers = ''
  let caps = ''

  for (let i = 0; i < 5; i++) {
    const y = base - 50 - i * 72
    const w = 150 - i * 26
    tiers += `M${x - w},${y}Q${x - w * 0.5},${y - 30} ${x},${y - 120}Q${x + w * 0.5},${y - 30} ${x + w},${y}Q${x},${y - 22} ${x - w},${y}Z`
    caps += `M${x - w * 0.55},${y - 58}Q${x - w * 0.25},${y - 80} ${x},${y - 120}Q${x + w * 0.25},${y - 80} ${x + w * 0.55},${y - 58}Q${x},${y - 66} ${x - w * 0.55},${y - 58}Z`
  }
  out += `<path d="${tiers}" fill="#1f5a45"/><path d="${caps}" class="b-snow" opacity="0.9"/>`

  for (let i = 0; i < 5; i++) {
    const y = base - 70 - i * 72
    const w = 135 - i * 26

    for (let k = 0; k <= 8; k++) {
      const u = k / 8
      out += glowBulb(x - w + u * 2 * w, y - 28 + Math.sin(u * Math.PI) * 18 - u * 22, 4, colors[(i + k) % colors.length]!, rand() * 6)
    }
  }
  for (let i = 0; i < 10; i++) {
    const t = rand()
    const w = 130 - t * 110
    out += `<circle cx="${r(x + (rand() - 0.5) * 2 * w * 0.8)}" cy="${r(base - 70 - t * 300)}" r="7" fill="${['#d0453b', '#e8b84a', '#4f8fd6'][i % 3]}"/>`
  }
  const sy = base - 50 - 4 * 72 - 132
  let star = ''

  for (let k = 0; k < 10; k++) {
    const a = (k * Math.PI) / 5 - Math.PI / 2
    const rr = k % 2 === 0 ? 26 : 11
    star += `${k === 0 ? 'M' : 'L'}${r(x + Math.cos(a) * rr)},${r(sy + Math.sin(a) * rr)}`
  }
  out += `<circle cx="${x}" cy="${sy}" r="70" fill="url(#bglow)" class="b-tw"/><path d="${star}Z" fill="#ffd34d"/>`
  out +=
    `<rect x="${x - 120}" y="${base - 44}" width="54" height="44" rx="4" fill="#d0453b"/><path d="M${x - 93},${base - 44}v44M${x - 120},${base - 22}h54" stroke="#ffd34d" stroke-width="6"/>` +
    `<rect x="${x + 70}" y="${base - 34}" width="44" height="34" rx="4" fill="#4f8fd6"/><path d="M${x + 92},${base - 34}v34M${x + 70},${base - 17}h44" stroke="#f3f6fb" stroke-width="5"/>`

  return out
}

/** A broad tree: a trunk with branches and a canopy of overlapping clusters. */
const canopyTree = (x: number, base: number, colors: string[], rand: () => number, extra = ''): string => {
  let out =
    `<path d="M${x - 26},${base} Q${x - 12},${base - 120} ${x - 16},${base - 230} L${x + 16},${base - 230} Q${x + 12},${base - 120} ${x + 26},${base} Z" fill="#5a3a28"/>` +
    `<path d="M${x - 8},${base - 180} Q${x - 70},${base - 220} ${x - 110},${base - 270} M${x + 8},${base - 200} Q${x + 70},${base - 240} ${x + 100},${base - 300}" stroke="#5a3a28" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    extra

  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand())
    const cx = x + Math.cos(a) * d * 160
    const cy = base - 330 + Math.sin(a) * d * 110
    out += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(40 + rand() * 30)}" fill="${colors[i % colors.length]}"/>`
  }
  // a few highlights
  for (let i = 0; i < 12; i++) {
    out += `<circle cx="${r(x - 60 + rand() * 140)}" cy="${r(base - 410 + rand() * 90)}" r="${r(8 + rand() * 10)}" fill="#ffffff" opacity="0.18"/>`
  }

  return out
}

const featureTree = (season: Season, x: number, base: number, rand: () => number): string => {
  if (season === 'winter') {
    return christmasTree(x, base, rand)
  }
  if (season === 'spring') {
    return canopyTree(x, base, ['#f6b7cc', '#f19cb9', '#fbd0dd', '#ee8fae'], rand)
  }
  if (season === 'summer') {
    // an oak with a rope swing on its left branch
    const swing =
      `<g class="b-swing"><path d="M${x - 120},${base - 268} V${base - 90} M${x - 70},${base - 238} V${base - 90}" stroke="#c9a46a" stroke-width="3"/>` +
      `<rect x="${x - 132}" y="${base - 92}" width="74" height="12" rx="3" fill="#8a5a3a"/></g>`

    return canopyTree(x, base, ['#3f7f3a', '#4c8f40', '#5c9e48', '#357035'], rand) + swing
  }

  return (
    canopyTree(x, base, ['#d9622b', '#e8a53a', '#b8402a', '#f0c24b'], rand) +
    `<ellipse cx="${x + 70}" cy="${base - 14}" rx="26" ry="19" fill="#e5822e"/><path d="M${x + 70},${base - 32} l3,-9" stroke="#4d6b2a" stroke-width="4"/>` +
    `<ellipse cx="${x + 112}" cy="${base - 10}" rx="17" ry="13" fill="#d4691f"/>`
  )
}

const cabin = (season: Season, x: number, base: number, rand: () => number): string => {
  const peak = base - 330
  const half = 150
  let out =
    `<path d="M${x - half},${base} L${x},${peak} L${x + half},${base} Z" fill="#7a4a30"/>` +
    `<path d="M${x - half + 26},${base} L${x},${peak + 46} L${x + half - 26},${base} Z" fill="#5c3826"/>` +
    `<path d="M${x - 70},${base} L${x},${peak + 120} L${x + 70},${base} Z" class="b-win"/>` +
    `<path d="M${x},${peak + 120}V${base}M${x - 52},${base - 52}H${x + 52}M${x - 34},${base - 106}H${x + 34}M${x - 35},${base}V${base - 52}M${x + 35},${base}V${base - 52}" stroke="#3d2618" stroke-width="5"/>` +
    `<circle cx="${x}" cy="${base - 120}" r="140" fill="url(#bglow)" opacity="0.35"/>`

  if (season === 'winter') {
    out += `<path d="M${x - half - 14},${base + 4} L${x},${peak - 14} L${x + half + 14},${base + 4} L${x + half - 4},${base + 4} L${x},${peak + 14} L${x - half + 4},${base + 4} Z" class="b-snow"/>`

    for (let i = 0; i < 9; i++) {
      const u = (i + 0.5) / 9

      if (Math.abs(u - 0.5) < 0.12) continue
      const ix = x - half + u * 2 * half
      const iy = base - (1 - Math.abs(u - 0.5) * 2) * (base - peak) + 6
      out += `<path d="M${r(ix - 4)},${r(iy)}l4,${r(12 + rand() * 16)}l4,-${r(12 + rand() * 4)}Z" fill="#dfeaf6"/>`
    }
  } else {
    out += `<path d="M${x - half - 12},${base + 2} L${x},${peak - 12} L${x + half + 12},${base + 2} L${x + half - 2},${base + 2} L${x},${peak + 10} L${x - half + 2},${base + 2} Z" fill="#9a5a3a"/>`
  }

  // Lights or lanterns along the roof.
  const bulbColors =
    season === 'winter' ? ['#ffcf5e', '#ff6b6b', '#7fd6ff'] : season === 'spring' ? ['#fff1c4', '#ffd6e4'] : ['#ffcf5e', '#ffe9a8']

  for (let i = 1; i < 14; i++) {
    const u = i / 14
    const lx = x - half - 8 + u * 2 * (half + 8)
    const ly = base - (1 - Math.abs(u - 0.5) * 2) * (base - peak + 10) + 14
    out += glowBulb(lx, ly, 3.5, bulbColors[i % bulbColors.length]!, rand() * 6)
  }

  // Seasonal touches by the door.
  if (season === 'winter') {
    out += `<circle cx="${x}" cy="${base - 150}" r="14" fill="none" stroke="#2f7a4a" stroke-width="7"/><circle cx="${x}" cy="${base - 138}" r="4" fill="#d0453b"/>`
  } else if (season === 'spring') {
    for (const side of [-1, 1]) {
      const bx = x + side * 110
      out += `<rect x="${bx - 28}" y="${base - 26}" width="56" height="22" rx="4" fill="#8a5a3a"/>`
      for (let k = 0; k < 5; k++) {
        out += `<circle cx="${bx - 22 + k * 11}" cy="${base - 32 - (k % 2) * 6}" r="7" fill="${['#f19cb9', '#ffd34d', '#f6f0ff', '#e98bb4', '#ffffff'][k]}"/>`
      }
    }
  } else if (season === 'summer') {
    out += `<path d="M${x + 100},${base} v-70" stroke="#3d2618" stroke-width="5"/><rect x="${x + 90}" y="${base - 92}" width="20" height="24" rx="4" fill="#ffd98a"/>` +
      `<circle cx="${x + 100}" cy="${base - 80}" r="46" fill="url(#bglow)" class="b-tw"/>`
  } else {
    out += `<circle cx="${x}" cy="${base - 150}" r="15" fill="none" stroke="#c9622b" stroke-width="8" stroke-dasharray="6 4"/>` +
      `<ellipse cx="${x - 100}" cy="${base - 14}" rx="24" ry="17" fill="#e5822e"/><path d="M${x - 108},${base - 20} l4,-5 l4,5 Z M${x - 96},${base - 20} l4,-5 l4,5 Z M${x - 110},${base - 10} q10,7 20,0 Z" fill="#ffd37a" class="b-win"/>`
  }

  return out
}

type Outfit = { coat: string; trim: string; scarf?: string; legs: string; shoes: string }

const OUTFITS: Record<Season, Outfit> = {
  winter: { coat: '#c8453b', trim: '#f3e6c8', scarf: '#f0c24b', legs: '#3b2a2a', shoes: '#5a3a26' },
  spring: { coat: '#8fc29a', trim: '#f6f0e4', legs: '#f6d6bd', shoes: '#e98bb4' },
  summer: { coat: '#f5c842', trim: '#ffffff', legs: '#f6d6bd', shoes: '#c98a5a' },
  autumn: { coat: '#d9952b', trim: '#f3e6c8', scarf: '#b8402a', legs: '#4a3a3a', shoes: '#5a3a26' },
}

const girlHat = (season: Season): string => {
  if (season === 'winter') {
    return (
      '<path d="M-42,-158 Q-40,-198 0,-200 Q40,-198 42,-158 Q0,-168 -42,-158 Z" fill="#f3e6c8"/>' +
      '<path d="M-43,-160 Q0,-172 43,-160 L43,-150 Q0,-162 -43,-150 Z" fill="#e2d2b2"/>' +
      '<circle cx="0" cy="-204" r="12" fill="#f3e6c8" class="b-pom"/>'
    )
  }
  if (season === 'spring') {
    // a flower clip
    return '<g transform="translate(-30,-166)"><circle cx="0" cy="-7" r="6" fill="#f19cb9"/><circle cx="7" cy="0" r="6" fill="#f19cb9"/><circle cx="0" cy="7" r="6" fill="#f19cb9"/><circle cx="-7" cy="0" r="6" fill="#f19cb9"/><circle r="4" fill="#ffd34d"/></g>'
  }
  if (season === 'summer') {
    return (
      '<ellipse cx="0" cy="-166" rx="70" ry="14" fill="#e8c77a"/>' +
      '<path d="M-38,-168 Q-36,-204 0,-206 Q36,-204 38,-168 Z" fill="#e8c77a"/>' +
      '<path d="M-38,-174 Q0,-182 38,-174 L38,-166 Q0,-174 -38,-166 Z" fill="#d0453b"/>'
    )
  }

  // a knitted beret
  return '<path d="M-46,-162 Q-40,-200 4,-198 Q50,-196 46,-160 Q0,-172 -46,-162 Z" fill="#7a3a2a"/><path d="M2,-198 l2,-10" stroke="#7a3a2a" stroke-width="5" stroke-linecap="round"/>'
}

/** The girl, dressed for the season, waving. */
export const girl = (season: Season, x: number, y: number): string => {
  const o = OUTFITS[season]
  const shortCoat = season === 'spring' || season === 'summer'

  return (
    `<g transform="translate(${r(x)},${r(y)})">` +
    '<ellipse cx="0" cy="0" rx="46" ry="8" fill="#000" opacity="0.15"/>' +
    `<rect x="-18" y="-34" width="12" height="30" rx="5" fill="${o.legs}"/><rect x="6" y="-34" width="12" height="30" rx="5" fill="${o.legs}"/>` +
    `<ellipse cx="-12" cy="-4" rx="11" ry="6" fill="${o.shoes}"/><ellipse cx="12" cy="-4" rx="11" ry="6" fill="${o.shoes}"/>` +
    `<path d="M-40,-30 Q-34,-104 0,-108 Q34,-104 40,-30 Q0,-20 -40,-30 Z" fill="${o.coat}"/>` +
    (shortCoat
      ? `<path d="M-38,-34 Q0,-24 38,-34" stroke="${o.trim}" stroke-width="5" fill="none" stroke-dasharray="6 5"/>`
      : `<path d="M0,-104 V-30" stroke="#000" stroke-opacity="0.15" stroke-width="3"/><circle cx="-6" cy="-80" r="3" fill="${o.trim}"/><circle cx="-6" cy="-60" r="3" fill="${o.trim}"/>` +
        `<path d="M-38,-36 Q0,-26 38,-36" stroke="${o.trim}" stroke-width="6" fill="none"/>`) +
    `<path d="M-28,-92 Q-44,-70 -40,-56" stroke="${o.coat}" stroke-width="15" fill="none" stroke-linecap="round"/>` +
    `<circle cx="-40" cy="-52" r="10" fill="${shortCoat ? '#f6d6bd' : o.trim}"/>` +
    '<path d="M-44,-150 Q-48,-96 -30,-92 L30,-92 Q48,-96 44,-150 Z" fill="#3b2618"/>' +
    '<ellipse cx="0" cy="-140" rx="40" ry="38" fill="#f6d6bd"/>' +
    '<path d="M-41,-146 Q-30,-176 0,-174 Q30,-176 41,-146 Q20,-160 0,-158 Q-20,-160 -41,-146 Z" fill="#3b2618"/>' +
    '<ellipse cx="-14" cy="-136" rx="4.5" ry="6" fill="#2b1b12" class="b-blink"/><ellipse cx="14" cy="-136" rx="4.5" ry="6" fill="#2b1b12" class="b-blink"/>' +
    '<ellipse cx="-24" cy="-122" rx="8" ry="4.5" fill="#f29a9a" opacity="0.75"/><ellipse cx="24" cy="-122" rx="8" ry="4.5" fill="#f29a9a" opacity="0.75"/>' +
    '<path d="M-6,-120 q6,5 12,0" stroke="#8a4a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
    (o.scarf
      ? `<path d="M-30,-106 Q0,-94 30,-106 L30,-94 Q0,-82 -30,-94 Z" fill="${o.scarf}"/><path d="M14,-96 l4,34 l12,-2 l-6,-34 Z" fill="${o.scarf}"/>`
      : '') +
    girlHat(season) +
    `<g class="b-wave"><path d="M30,-96 Q58,-104 64,-132" stroke="${o.coat}" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="65" cy="-137" r="10" fill="${shortCoat ? '#f6d6bd' : o.trim}"/></g>` +
    '</g>'
  )
}

const frogWear = (season: Season): string => {
  if (season === 'winter' || season === 'autumn') {
    const c = season === 'winter' ? '#d0453b' : '#e07b2a'

    return (
      `<path d="M-44,-74 Q0,-56 44,-74 L45,-60 Q0,-42 -45,-60 Z" fill="${c}"/><path d="M-30,-62 l-8,34 l14,2 l6,-34 Z" fill="${c}"/>` +
      '<path d="M-30,-48 l-8,0 M-28,-40 l-8,0" stroke="#f3e6c8" stroke-width="3"/>'
    )
  }
  if (season === 'spring') {
    let crown = ''

    for (let k = 0; k < 7; k++) {
      const a = Math.PI + (k / 6) * Math.PI
      crown += `<circle cx="${r(Math.cos(a) * 44)}" cy="${r(-120 + Math.sin(a) * 20)}" r="7" fill="${['#f19cb9', '#ffd34d', '#ffffff'][k % 3]}"/>`
    }

    return crown
  }

  // a little straw hat
  return '<ellipse cx="0" cy="-146" rx="40" ry="8" fill="#e8c77a"/><path d="M-22,-148 Q-20,-170 0,-170 Q20,-170 22,-148 Z" fill="#e8c77a"/><path d="M-22,-152 H22" stroke="#4f8fd6" stroke-width="5"/>'
}

/** The frog: green, a yellow belly, big eyes, dressed for the season, waving. */
export const frog = (season: Season, x: number, y: number): string =>
  `<g transform="translate(${r(x)},${r(y)})">` +
  '<ellipse cx="0" cy="0" rx="52" ry="8" fill="#000" opacity="0.15"/>' +
  '<ellipse cx="-26" cy="-6" rx="20" ry="8" fill="#68ad3c"/><ellipse cx="26" cy="-6" rx="20" ry="8" fill="#68ad3c"/>' +
  '<ellipse cx="0" cy="-44" rx="44" ry="40" fill="#79c24a"/>' +
  '<ellipse cx="0" cy="-36" rx="30" ry="28" fill="#f1e68a"/>' +
  '<ellipse cx="0" cy="-98" rx="50" ry="36" fill="#79c24a"/>' +
  '<circle cx="-26" cy="-126" r="20" fill="#79c24a"/><circle cx="26" cy="-126" r="20" fill="#79c24a"/>' +
  '<circle cx="-26" cy="-128" r="14" fill="#fff"/><circle cx="26" cy="-128" r="14" fill="#fff"/>' +
  '<g class="b-blink"><circle cx="-23" cy="-126" r="7.5" fill="#1d1d1d"/><circle cx="23" cy="-126" r="7.5" fill="#1d1d1d"/></g>' +
  '<circle cx="-20" cy="-130" r="2.5" fill="#fff"/><circle cx="26" cy="-130" r="2.5" fill="#fff"/>' +
  '<path d="M-20,-92 q20,16 40,0" stroke="#2f5d1e" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<ellipse cx="-36" cy="-94" rx="8" ry="4.5" fill="#f29a9a" opacity="0.8"/><ellipse cx="36" cy="-94" rx="8" ry="4.5" fill="#f29a9a" opacity="0.8"/>' +
  frogWear(season) +
  '<path d="M-40,-50 Q-52,-34 -40,-22" stroke="#79c24a" stroke-width="13" fill="none" stroke-linecap="round"/>' +
  '<g class="b-wave" style="animation-delay:-1.7s"><path d="M38,-56 Q60,-70 60,-96" stroke="#79c24a" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="60" cy="-100" r="8" fill="#79c24a"/></g>' +
  '</g>'

/** Kuro: a small black cat sitting up, yellow eyes, a red collar and bell. */
export const kuro = (season: Season, x: number, y: number): string =>
  `<g transform="translate(${r(x)},${r(y)})">` +
  '<ellipse cx="0" cy="0" rx="36" ry="6" fill="#000" opacity="0.15"/>' +
  '<path d="M20,-6 Q58,-8 52,-46" stroke="#17141a" stroke-width="10" fill="none" stroke-linecap="round" class="b-tail"/>' +
  '<path d="M-26,-2 Q-30,-56 0,-60 Q30,-56 26,-2 Z" fill="#17141a"/>' +
  '<ellipse cx="-12" cy="-3" rx="9" ry="5" fill="#17141a"/><ellipse cx="12" cy="-3" rx="9" ry="5" fill="#17141a"/>' +
  '<ellipse cx="0" cy="-80" rx="30" ry="26" fill="#17141a"/>' +
  '<path d="M-28,-88 l-2,-30 l22,16 Z M28,-88 l2,-30 l-22,16 Z" fill="#17141a"/>' +
  '<path d="M-24,-94 l-1,-16 l11,9 Z M24,-94 l1,-16 l-11,9 Z" fill="#c2768d"/>' +
  '<g class="b-blink"><ellipse cx="-11" cy="-82" rx="7" ry="8" fill="#f2c84b"/><ellipse cx="11" cy="-82" rx="7" ry="8" fill="#f2c84b"/>' +
  '<ellipse cx="-11" cy="-82" rx="2.4" ry="6" fill="#17141a"/><ellipse cx="11" cy="-82" rx="2.4" ry="6" fill="#17141a"/></g>' +
  '<path d="M-3,-70 l3,3 l3,-3 Z" fill="#c2768d"/>' +
  '<path d="M-14,-68 l-16,-2 M-14,-65 l-15,3 M14,-68 l16,-2 M14,-65 l15,3" stroke="#6a6470" stroke-width="1.5"/>' +
  '<path d="M-20,-58 Q0,-50 20,-58" stroke="#d0453b" stroke-width="5" fill="none"/><circle cx="0" cy="-52" r="5" fill="#f0c24b"/>' +
  (season === 'spring' ? '<ellipse cx="16" cy="-104" rx="7" ry="4" fill="#f6b7cc" transform="rotate(-20 16 -104)"/>' : '') +
  (season === 'autumn' ? '<path d="M-20,-106 q8,-10 16,0 q-8,6 -16,0 Z" fill="#e07b2a" transform="rotate(-25 -12 -106)"/>' : '') +
  '</g>'

export const storyScene = (season: Season, rand: () => number): string => {
  const l = LOOKS[season]
  let stars = ''

  for (let i = 0; i < 80; i++) {
    stars += `<circle cx="${r(rand() * W)}" cy="${r(rand() * 430)}" r="${r(0.6 + rand() * 1.5)}" style="animation-delay:-${r(rand() * 7)}s"/>`
  }
  let farPines = ''

  for (let x = 20; x < W; x += 46 + rand() * 50) {
    farPines += pine(x, 790 + rand() * 20, 0.5 + rand() * 0.35, l.pineSnow)
  }

  return (
    `<rect width="${W}" height="${H}" fill="url(#bsky)"/>` +
    `<g class="stars">${stars}</g>` +
    '<circle cx="1330" cy="150" r="140" fill="url(#bmoon)"/><circle cx="1330" cy="150" r="46" class="b-orb"/>' +
    '<path d="M0,640 L170,470 L300,560 L470,400 L640,560 L800,430 L960,580 L1130,420 L1290,560 L1440,470 L1600,580 V900 H0 Z" class="b-mtn2"/>' +
    (l.caps
      ? '<path d="M170,470 L135,505 L165,500 L190,515 L215,490 Z M470,400 L425,445 L460,438 L490,455 L525,440 Z M800,430 L760,470 L795,463 L825,478 L850,465 Z M1130,420 L1085,465 L1120,458 L1150,472 L1180,455 Z M1440,470 L1405,505 L1440,500 L1470,512 Z" class="b-cap"/>'
      : '') +
    '<path d="M0,740 L220,600 L380,690 L560,580 L760,700 L940,610 L1120,710 L1300,620 L1600,730 V900 H0 Z" class="b-mtn"/>' +
    farPines +
    `<path d="M0,830 Q400,790 800,820 T1600,810 V900 H0 Z" fill="${l.strip}"/>` +
    featureTree(season, 200, 850, rand) +
    cabin(season, 1390, 850, rand)
  )
}

export const mascots = (season: Season, standY: number): string =>
  girl(season, 330, standY) + kuro(season, 415, standY + 2) + frog(season, 1210, standY)
