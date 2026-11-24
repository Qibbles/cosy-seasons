// Builds the backdrop SVG: a cosy cabin scene for the season, with a ground
// pile (snow, leaves, petals or meadow) whose height follows context fill.

import { STORY_DEFS, mascots, storyCss, storyScene } from './storybook'

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export type SceneOptions = {
  season: Season
  /** Context window fill, 0 to 100. */
  percent: number
  /** 1 to 12, for holiday touches (December lights, October pumpkins). */
  month: number
}

const W = 1600
const H = 900
const PILE_MIN = 14
const PILE_MAX = 400

/** The y of the pile's top at a given fill. */
export const pileTop = (percent: number): number =>
  H - (PILE_MIN + (Math.min(100, Math.max(0, percent)) / 100) * (PILE_MAX - PILE_MIN))

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const n = (v: number) => Math.round(v * 10) / 10

type Palette = {
  pile: [string, string, string, string] // dark top, dark bottom, light top, light bottom
  foliage: string[]
}

const PALETTES: Record<Season, Palette> = {
  winter: {
    pile: ['#e4ecf8', '#9fb3d4', '#ffffff', '#cfdcee'],
    foliage: ['#1f4a3a', '#24553f', '#2c6148'],
  },
  spring: {
    pile: ['#f2b8cb', '#b9708f', '#fbd3e0', '#eda4bd'],
    foliage: ['#f6b7cc', '#f19cb9', '#fbd0dd'],
  },
  summer: {
    pile: ['#4c8a3d', '#24482a', '#79b356', '#4f8a3c'],
    foliage: ['#3f7f3a', '#4c8f40', '#5c9e48'],
  },
  autumn: {
    pile: ['#b5562a', '#6a2a17', '#d9732f', '#a8441f'],
    foliage: ['#d9622b', '#e8a53a', '#b8402a', '#f0c24b'],
  },
}

/** A smooth wavy top edge from x=-50 to x=W+50, closed down to the bottom. */
const wavyPath = (top: number, rand: () => number, amp: number): string => {
  const pts: [number, number][] = []

  for (let x = -100; x <= W + 100; x += 100) {
    pts.push([x, top + (rand() - 0.5) * amp * 2])
  }
  let d = `M${pts[0]![0]},${H + 10} L${pts[0]![0]},${n(pts[0]![1])}`

  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!
    const [x1, y1] = pts[i + 1]!
    const mx = (x0 + x1) / 2
    d += ` C${mx},${n(y0)} ${mx},${n(y1)} ${x1},${n(y1)}`
  }

  return `${d} L${pts[pts.length - 1]![0]},${H + 10} Z`
}

/** A field of falling things drawn twice, one height apart, so a loop of translateY is seamless. */
const fallingLayer = (
  season: Season,
  rand: () => number,
  count: number,
  scale: number,
  speed: number,
  colors: string[],
): string => {
  const items: string[] = []

  for (let i = 0; i < count; i++) {
    const x = rand() * W
    const y = rand() * H
    const sway = 1 + Math.floor(rand() * 3)
    const delay = n(rand() * 8)
    const color = colors[Math.floor(rand() * colors.length)]
    let shape: string

    if (season === 'winter') {
      shape = `<circle r="${n((1.4 + rand() * 2.4) * scale)}" fill="${color}"/>`
    } else if (season === 'summer') {
      continue
    } else {
      const r = n((5 + rand() * 4) * scale)
      shape =
        season === 'autumn'
          ? `<path d="M0,-${r} Q${n(r * 0.9)},0 0,${r} Q-${n(r * 0.9)},0 0,-${r} Z" fill="${color}" class="spin" style="animation-delay:-${delay}s"/>`
          : `<ellipse rx="${r}" ry="${n(r * 0.55)}" fill="${color}" class="spin" style="animation-delay:-${delay}s"/>`
    }
    const g = (dy: number) =>
      `<g transform="translate(${n(x)},${n(y + dy)})"><g class="sw${sway}" style="animation-delay:-${delay}s">${shape}</g></g>`
    items.push(g(0), g(-H))
  }

  return `<g class="fall" style="animation-duration:${speed}s">${items.join('')}</g>`
}

const fireflies = (rand: () => number): string => {
  const out: string[] = []

  for (let i = 0; i < 34; i++) {
    const x = rand() * W
    const y = 300 + rand() * 520
    const d = n(rand() * 9)
    out.push(
      `<g transform="translate(${n(x)},${n(y)})"><g class="wander${1 + (i % 3)}" style="animation-delay:-${d}s"><circle r="9" class="glow" style="animation-delay:-${d}s"/><circle r="2.6" fill="#fff6b0"/></g></g>`,
    )
  }

  return out.join('')
}

/** Decorations scattered inside the pile, clipped to it. */
const pileTexture = (season: Season, top: number, rand: () => number, p: Palette): string => {
  const out: string[] = []
  const depth = H - top

  if (season === 'winter') {
    for (let i = 0; i < 40; i++) {
      const x = rand() * W
      const y = top + 6 + rand() * Math.min(60, depth)
      out.push(
        `<circle cx="${n(x)}" cy="${n(y)}" r="${n(1 + rand() * 1.6)}" fill="#ffffff" class="sparkle" style="animation-delay:-${n(rand() * 6)}s"/>`,
      )
    }
  } else if (season === 'summer') {
    for (let i = 0; i < 70; i++) {
      const x = rand() * W
      const y = top + 10 + rand() * Math.min(depth, 400)
      const c = ['#f7f3e8', '#f5d04a', '#e98bb4', '#a9c8f5'][i % 4]
      out.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(3 + rand() * 3)}" fill="${c}"/>`)
    }
  } else {
    const count = Math.min(260, 30 + Math.round(depth / 3))
    const colors = season === 'autumn' ? p.foliage : ['#fbe1ea', '#f7c3d4', '#ffffff', '#ee9fbb']

    for (let i = 0; i < count; i++) {
      const x = rand() * W
      const y = top + rand() * depth
      const r = n(6 + rand() * 6)
      const a = Math.round(rand() * 180)
      out.push(
        `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${r}" ry="${n(r * 0.5)}" fill="${colors[i % colors.length]}" transform="rotate(${a} ${n(x)} ${n(y)})"/>`,
      )
    }
  }

  return out.join('')
}

/** Grass blades along the meadow's top edge. */
const grassEdge = (top: number, rand: () => number): string => {
  const out: string[] = []

  for (let x = -20; x < W + 20; x += 9) {
    const h = 18 + rand() * 26
    const lean = (rand() - 0.5) * 14
    const y = top + 6 + (rand() - 0.5) * 10
    out.push(`<path d="M${n(x)},${n(y)} q${n(lean / 2)},-${n(h / 2)} ${n(lean)},-${n(h)}" />`)
  }

  return `<g class="grass" stroke="#5f9e47" stroke-width="3" fill="none" stroke-linecap="round">${out.join('')}</g>`
}

const QUARTERS = [25, 50, 75, 100].map(q => pileTop(q))
const GX = 1560

/** Winter: a red and white snow pole, one stripe a quarter of the context window. */
const snowPole = (): string => {
  let out = ''

  for (let q = 0; q < 4; q++) {
    const y0 = pileTop((q + 1) * 25)
    const y1 = pileTop(q * 25)
    out += `<rect x="${GX - 7}" y="${n(y0)}" width="14" height="${n(y1 - y0)}" fill="${q % 2 === 0 ? '#c8463c' : '#f2ece0'}"/>`
  }

  return out + `<circle cx="${GX}" cy="${n(pileTop(100) - 6)}" r="9" fill="#e8b84a"/>`
}

/** Spring: a bamboo garden cane, its joints at each quarter, a robin on top. */
const bambooCane = (): string => {
  const top = pileTop(100) - 10
  let out = `<rect x="${GX - 6}" y="${n(top)}" width="12" height="${n(H - top)}" rx="5" fill="#9fbf5a"/>` +
    `<rect x="${GX - 6}" y="${n(top)}" width="4" height="${n(H - top)}" fill="#c4dc84" opacity="0.7"/>`

  for (const y of QUARTERS) {
    out += `<rect x="${GX - 8}" y="${n(y - 3)}" width="16" height="6" rx="3" fill="#6f8f36"/>`
    out += `<path d="M${GX + 6},${n(y - 2)} q16,-10 26,-4 q-12,8 -26,4 Z" fill="#7fae46"/>`
  }

  return out +
    // robin
    `<ellipse cx="${GX + 2}" cy="${n(top - 16)}" rx="17" ry="13" fill="#6b5240"/>` +
    `<ellipse cx="${GX + 8}" cy="${n(top - 12)}" rx="9" ry="8" fill="#e0703e"/>` +
    `<circle cx="${GX + 14}" cy="${n(top - 26)}" r="9" fill="#6b5240"/>` +
    `<circle cx="${GX + 17}" cy="${n(top - 28)}" r="1.8" fill="#111"/>` +
    `<path d="M${GX + 22},${n(top - 27)} l8,2 l-8,2 Z" fill="#e8b84a"/>` +
    `<path d="M${GX - 13},${n(top - 18)} l-14,-6 l4,10 Z" fill="#5a4434"/>`
}

/** Summer: a sunflower, a pair of leaves at each quarter, the bloom at the top. */
const sunflower = (): string => {
  const top = pileTop(100) - 10
  let out = `<path d="M${GX},${H} C${GX - 6},${n((H + top) / 2)} ${GX + 6},${n((H + top) / 2)} ${GX},${n(top)}" stroke="#4f7d2e" stroke-width="9" fill="none"/>`

  QUARTERS.forEach((y, i) => {
    const s = i % 2 === 0 ? 1 : -1
    out += `<path d="M${GX},${n(y)} q${22 * s},-22 ${44 * s},-8 q${-20 * s},18 ${-44 * s},8 Z" fill="#5e9438"/>`
    out += `<path d="M${GX},${n(y)} q${-16 * s},-14 ${-30 * s},-4 q${14 * s},12 ${30 * s},4 Z" fill="#6aa242"/>`
  })
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * 360
    out += `<ellipse cx="${GX}" cy="${n(top - 34)}" rx="7" ry="20" fill="${k % 2 ? '#f5c330' : '#f0b21e'}" transform="rotate(${n(a)} ${GX} ${n(top - 16)})"/>`
  }

  return out + `<circle cx="${GX}" cy="${n(top - 16)}" r="15" fill="#5a3a1c"/><circle cx="${GX - 4}" cy="${n(top - 20)}" r="4" fill="#7a5230"/>`
}

/** Autumn: a weathered fence post, notched at each quarter, a pumpkin lantern on top. */
const fencePost = (): string => {
  const top = pileTop(100) - 4
  let out = `<path d="M${GX - 11},${H} V${n(top + 8)} L${GX},${n(top)} L${GX + 11},${n(top + 8)} V${H} Z" fill="#7a5a3f"/>` +
    `<path d="M${GX - 5},${H} V${n(top + 12)}" stroke="#5f442f" stroke-width="2"/>`

  for (const y of QUARTERS) {
    out += `<path d="M${GX - 11},${n(y)} h9 l-4,5 h-5 Z" fill="#3e2a1c"/><path d="M${GX + 11},${n(y)} h-9 l4,5 h5 Z" fill="#3e2a1c"/>`
  }
  out += `<path d="M${GX - 11},${n(QUARTERS[1]!)} h22" stroke="#c99a3e" stroke-width="3"/>`

  return out +
    `<circle cx="${GX}" cy="${n(top - 18)}" r="34" fill="#ffb347" opacity="0.18"/>` +
    `<ellipse cx="${GX}" cy="${n(top - 16)}" rx="22" ry="17" fill="#e5822e"/>` +
    `<path d="M${GX - 8},${n(top - 22)} l4,-5 l4,5 Z M${GX + 0},${n(top - 22)} l4,-5 l4,5 Z M${GX - 10},${n(top - 11)} q10,7 20,0 q-10,3 -20,0 Z" fill="#ffd37a" class="window"/>` +
    `<path d="M${GX},${n(top - 32)} l3,-9" stroke="#4d6b2a" stroke-width="4"/>`
}

const gauge = (season: Season): string =>
  `<g>${season === 'winter' ? snowPole() : season === 'spring' ? bambooCane() : season === 'summer' ? sunflower() : fencePost()}</g>`

export const sceneSvg = ({ season, percent }: SceneOptions): string => {
  const p = PALETTES[season]
  const rand = rng(season.length * 7919 + 13)
  const top = pileTop(percent)
  const pilePath = wavyPath(top, rng(42), season === 'summer' ? 6 : 14)
  const surfacePath = wavyPath(top - 4, rng(42), season === 'summer' ? 6 : 14)

  const falling =
    season === 'summer'
      ? fireflies(rand)
      : season === 'winter'
        ? fallingLayer(season, rand, 45, 0.7, 34, ['#ffffff']) + fallingLayer(season, rand, 35, 1.2, 22, ['#ffffff'])
        : fallingLayer(season, rand, 18, 0.9, 30, season === 'autumn' ? p.foliage : ['#f9c6d6', '#fde3ec', '#f3a8c1']) +
          fallingLayer(season, rand, 12, 1.3, 20, season === 'autumn' ? p.foliage : ['#f9c6d6', '#fde3ec', '#f3a8c1'])

  const texture = pileTexture(season, top, rand, p)
  const edge = season === 'summer' ? grassEdge(top, rand) : ''

  const css = `
.pl1{stop-color:${p.pile[0]}}.pl2{stop-color:${p.pile[1]}}
.window{fill:#ffc768;animation:flicker 5s ease-in-out infinite}
.stars circle{fill:#ffffff;opacity:0.8;animation:twinkle 6s ease-in-out infinite}
.surface{fill:${season === 'winter' ? '#ffffff' : p.pile[2]};opacity:${season === 'winter' ? 0.55 : 0.9}}
.fall{animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}
.sw1{animation:sway 7s ease-in-out infinite}
.sw2{animation:sway 9s ease-in-out infinite reverse}
.sw3{animation:sway 11s ease-in-out infinite}
.spin{transform-box:fill-box;transform-origin:center;animation:spin 6s linear infinite}
.grass{animation:grass 6s ease-in-out infinite}
.sparkle{opacity:0.5;animation:twinkle 5s ease-in-out infinite}
.glow{fill:#fff3a0;opacity:0.35;animation:glow 4s ease-in-out infinite}
.wander1{animation:w1 13s ease-in-out infinite}
.wander2{animation:w2 17s ease-in-out infinite}
.wander3{animation:w3 15s ease-in-out infinite}
@media (prefers-color-scheme: light){
.pl1{stop-color:${p.pile[2]}}.pl2{stop-color:${p.pile[3]}}
.stars{display:none}
}
@keyframes fall{from{transform:translateY(0)}to{transform:translateY(${H}px)}}
@keyframes sway{0%,100%{transform:translateX(-14px)}50%{transform:translateX(14px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes twinkle{0%,100%{opacity:0.85}50%{opacity:0.3}}
@keyframes flicker{0%,100%{opacity:1}40%{opacity:0.88}70%{opacity:0.95}}
@keyframes grass{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}
@keyframes glow{0%,100%{opacity:0.1}50%{opacity:0.5}}
@keyframes w1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
@keyframes w2{0%,100%{transform:translate(0,0)}50%{transform:translate(-35px,-45px)}}
@keyframes w3{0%,100%{transform:translate(0,0)}50%{transform:translate(25px,35px)}}
`

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<style>${css}${storyCss(season)}</style>` +
    '<defs>' +
    '<linearGradient id="pile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="pl1"/><stop offset="1" class="pl2"/></linearGradient>' +
    STORY_DEFS +
    `<clipPath id="pileclip"><path d="${pilePath}"/></clipPath>` +
    '</defs>' +
    storyScene(season, rand) +
    falling +
    '<!-- the pile that rises with context -->' +
    `<path d="${surfacePath}" class="surface"/>` +
    `<path d="${pilePath}" fill="url(#pile)"/>` +
    `<g clip-path="url(#pileclip)">${texture}</g>` +
    edge +
    mascots(season, Math.min(858, top + 12)) +
    gauge(season) +
    '</svg>'
  )
}
