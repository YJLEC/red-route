import { describe, expect, it } from 'vitest'
import { createItinerary } from '../lib/itinerary'
import type { PlannerInput } from '../types/planner'
import type { DestinationId } from '../types/tourism'
import { planningDataset } from './planner'

const ids: DestinationId[] = ['hebei-museum', 'xibaipo', 'langya-mountain', 'ranzhuang-tunnel']

function combinations<T>(items: T[], size: number): T[][] {
  if (size === 0) return [[]]
  return items.flatMap((item, index) => combinations(items.slice(index + 1), size - 1).map((rest) => [item, ...rest]))
}

const input: Omit<PlannerInput, 'selectedIds'> = {
  startDate: '2026-09-01',
  startBaseId: 'shijiazhuang',
  mode: 'car',
  requestedDays: 'auto',
  pace: 'standard',
}

describe('production planning dataset', () => {
  for (const size of [2, 3, 4]) {
    for (const selectedIds of combinations(ids, size)) {
      it(`builds a sourced car itinerary for ${selectedIds.join(' + ')}`, () => {
        const result = createItinerary({ ...input, selectedIds }, planningDataset)
        expect(result.status).toBe('ready')
        expect(result.primary?.placeOrder.slice().sort()).toEqual(selectedIds.slice().sort())
        for (const day of result.primary?.days ?? []) {
          expect(day.events.some((event) => event.type === 'transit' && event.sourceUrl)).toBe(true)
          expect(day.events.some((event) => event.type === 'meal')).toBe(true)
          expect(day.events.some((event) => /住宿|返程/.test(event.title))).toBe(true)
          expect(day.events.filter((event) => event.type === 'meal')).toHaveLength(1)
        }
      })
    }
  }

  it('does not compress all four places into one or two days', () => {
    for (const requestedDays of [1, 2] as const) {
      const result = createItinerary({ ...input, selectedIds: ids, requestedDays }, planningDataset)
      expect(result.status).toBe('needs-change')
    }
    const automatic = createItinerary({ ...input, selectedIds: ids }, planningDataset)
    expect(automatic.status).toBe('ready')
    expect(automatic.primary?.days.length).toBe(3)
  })

  it('rejects a normal Monday closure instead of silently moving the visit', () => {
    const result = createItinerary({ ...input, selectedIds: ['hebei-museum', 'ranzhuang-tunnel'], startDate: '2026-09-07', requestedDays: 1 }, planningDataset)
    expect(result.status).toBe('needs-change')
    expect(result.issues.some((issue) => issue.includes('闭馆'))).toBe(true)
  })

  it('only auto-plans the one public-transit pair with a supported chain', () => {
    const supported = createItinerary({ ...input, selectedIds: ['hebei-museum', 'xibaipo'], mode: 'public-transit' }, planningDataset)
    expect(supported.status).toBe('ready')
    expect(supported.primary?.days.length).toBe(2)
    const unsupported = createItinerary({ ...input, selectedIds: ['ranzhuang-tunnel', 'langya-mountain'], mode: 'public-transit' }, planningDataset)
    expect(unsupported.status).toBe('needs-change')
    expect(unsupported.issues.some((issue) => issue.includes('缺少'))).toBe(true)
  })
})
