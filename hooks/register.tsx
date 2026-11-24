import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { sceneSvg } from './scene'
import type { Season } from './scene'

const contextPercent = atom({ plugin: 'cosy-seasons', key: 'contextPercent' } as const, null)

const SEASONS: Season[] = ['winter', 'spring', 'summer', 'autumn']
const LOOK: ThemeSetArgs = { backdrop: { scene: 'cosy' } }

type Prefs = { season: Season | 'auto'; south: boolean }

const seasonFor = (month: number, south: boolean): Season => {
  // Meteorological seasons: Dec-Feb winter, Mar-May spring, and so on.
  const north: Season[] = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter']
  const s = north[month - 1]!

  return south ? SEASONS[(SEASONS.indexOf(s) + 2) % 4]! : s
}

const parsePrefs = (stored: unknown): Prefs => {
  const raw = stored as Partial<Prefs> | undefined
  const season = raw?.season

  return {
    season: season === 'auto' || (season !== undefined && SEASONS.includes(season)) ? season : 'auto',
    south: raw?.south === true,
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    try {
      const usage = await $.session.usage()
      const pct = usage.context.percent

      if (pct !== undefined) {
        await update($, contextPercent, () => Math.round(pct))
      }
    } catch {
      // No reading yet: the pile starts as a dusting.
    }
    await $.command.register({
      name: 'season',
      description: 'Cosy backdrop season: auto, winter, spring, summer, autumn, north or south',
    })
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(`Cosy seasons: ${set.reason}`)
    }

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    const pct = e.context.percent

    if (pct !== undefined) {
      const rounded = Math.round(pct)
      await update($, contextPercent, old => (old === rounded ? old : rounded))
    }

    return next(e)
  })

  on('command.run', { command: 'season' }, async ($, e) => {
    const word = e.args.trim().toLowerCase()
    const prefs = parsePrefs(await $.store.get('prefs'))

    if (word === 'north' || word === 'south') {
      prefs.south = word === 'south'
    } else if (word === 'auto' || SEASONS.includes(word as Season)) {
      prefs.season = word as Prefs['season']
    } else if (word === 'fall') {
      prefs.season = 'autumn'
    } else if (word !== '') {
      return { text: 'Use /season auto, winter, spring, summer, autumn, north or south.' }
    }
    await $.store.set('prefs', prefs)
    const hemisphere = prefs.south ? 'southern' : 'northern'

    return {
      text:
        prefs.season === 'auto'
          ? `Backdrop follows the calendar (${hemisphere} hemisphere).`
          : `Backdrop fixed to ${prefs.season}. Use /season auto to follow the calendar.`,
    }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    if (e.props.plugin !== 'cosy-seasons') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const prefs = parsePrefs(await $.store.get('prefs'))
    const month = new Date(await $.clock.now()).getMonth() + 1
    const season = prefs.season === 'auto' ? seasonFor(month, prefs.south) : prefs.season
    const percent = (await read($, contextPercent)) ?? 0

    return (
      <Svg
        source={sceneSvg({ season, percent, month })}
        alt={`A cosy ${season} cabin scene; the ground is ${percent}% filled, matching the context window`}
        isInteractive
      />
    )
  })
}
