import { describe, expect, it } from 'vitest'
import type { PlanningDataset, PlannerInput } from '../types/planner'
import { createItinerary, formatMinute } from './itinerary'

const dataset: PlanningDataset = {
  bases: [
    { id: 'shijiazhuang', label: '石家庄市区', stayReason: '城市交通集中', mealStrategy: '交通枢纽附近', coordinates: [114.5, 38.04], sourceLabel: '测试来源', sourceUrl: 'https://example.com' },
    { id: 'baoding', label: '保定市区', stayReason: '连接保定片区', mealStrategy: '市区用餐', coordinates: [115.46, 38.87], sourceLabel: '测试来源', sourceUrl: 'https://example.com' },
    { id: 'yixian', label: '易县城区', stayReason: '接近山地景区', mealStrategy: '县城用餐', coordinates: [115.5, 39.35], sourceLabel: '测试来源', sourceUrl: 'https://example.com' },
  ],
  places: [
    {
      id: 'hebei-museum', name: '河北博物院', intensity: 1, mealArea: '石家庄市区', mealNote: '使用城市餐饮配套',
      preferredStayBaseId: 'shijiazhuang', preparations: ['预约'],
      openingSource: { label: '测试来源', url: 'https://example.com' },
      comparison: { visitWindow: '上午', transport: '市区交通', booking: '预约', fit: '室内参观', limitation: '周一闭馆' },
      opening: { openWeekdays: [2, 3, 4, 5, 6, 0], openMinute: 8 * 60 + 30, closeMinute: 18 * 60, lastEntryMinute: 17 * 60 + 30 },
      visitMinutes: { relaxed: 150, standard: 120, compact: 90 },
    },
    {
      id: 'xibaipo', name: '西柏坡', intensity: 2, mealArea: '景区服务区', mealNote: '提前确认用餐开放',
      preferredStayBaseId: 'shijiazhuang', preparations: ['步行鞋'],
      openingSource: { label: '测试来源', url: 'https://example.com' },
      comparison: { visitWindow: '半天', transport: '旅游交通', booking: '预约', fit: '旧址参观', limitation: '周一闭馆' },
      opening: { openWeekdays: [2, 3, 4, 5, 6, 0], openMinute: 9 * 60, closeMinute: 17 * 60, lastEntryMinute: 16 * 60 },
      visitMinutes: { relaxed: 240, standard: 210, compact: 180 },
    },
  ],
  connections: [
    { from: 'shijiazhuang', to: 'hebei-museum', mode: 'car', durationMinutes: [20, 30], via: ['市区道路'], constraints: [], sourceLabel: '测试来源', sourceUrl: 'https://example.com', verifiedAt: '2026-08-29', bidirectional: true },
    { from: 'shijiazhuang', to: 'xibaipo', mode: 'car', durationMinutes: [90, 110], via: ['西柏坡高速'], constraints: [], sourceLabel: '测试来源', sourceUrl: 'https://example.com', verifiedAt: '2026-08-29', bidirectional: true },
    { from: 'hebei-museum', to: 'xibaipo', mode: 'car', durationMinutes: [95, 115], via: ['市区道路', '西柏坡高速'], constraints: [], sourceLabel: '测试来源', sourceUrl: 'https://example.com', verifiedAt: '2026-08-29', bidirectional: true },
  ],
}

const baseInput: PlannerInput = {
  selectedIds: ['hebei-museum', 'xibaipo'],
  startDate: '2026-09-01',
  startBaseId: 'shijiazhuang',
  mode: 'car',
  requestedDays: 'auto',
  pace: 'standard',
}

describe('createItinerary', () => {
  it('requires at least two places', () => {
    const result = createItinerary({ ...baseInput, selectedIds: ['hebei-museum'] }, dataset)
    expect(result.status).toBe('needs-change')
  })

  it('builds a deterministic route with visits, transit and lunch', () => {
    const first = createItinerary(baseInput, dataset)
    const second = createItinerary(baseInput, dataset)
    expect(first.status).toBe('ready')
    expect(first.primary?.id).toBe(second.primary?.id)
    expect(first.primary?.days.flatMap((day) => day.events).some((event) => event.type === 'meal')).toBe(true)
    expect(first.primary?.placeOrder).toHaveLength(2)
  })

  it('reports regular closure conflicts', () => {
    const result = createItinerary({ ...baseInput, startDate: '2026-08-31', requestedDays: 1 }, dataset)
    expect(result.status).toBe('needs-change')
    expect(result.issues.some((issue) => issue.includes('闭馆'))).toBe(true)
  })

  it('does not invent missing public transit', () => {
    const result = createItinerary({ ...baseInput, mode: 'public-transit' }, dataset)
    expect(result.status).toBe('needs-change')
    expect(result.issues.some((issue) => issue.includes('缺少'))).toBe(true)
  })

  it('does not assume a sourced public-transit edge also works in reverse', () => {
    const directionalDataset: PlanningDataset = {
      ...dataset,
      connections: [
        {
          from: 'shijiazhuang', to: 'xibaipo', mode: 'public-transit', durationMinutes: [20, 20],
          via: ['测试上行线路'], constraints: [], sourceLabel: '测试来源', sourceUrl: 'https://example.com', verifiedAt: '2026-08-29',
        },
        {
          from: 'hebei-museum', to: 'xibaipo', mode: 'public-transit', durationMinutes: [20, 20],
          via: ['仅记录博物院至西柏坡方向'], constraints: [], sourceLabel: '测试来源', sourceUrl: 'https://example.com', verifiedAt: '2026-08-29',
        },
      ],
    }
    const result = createItinerary({ ...baseInput, mode: 'public-transit', requestedDays: 1, pace: 'compact' }, directionalDataset)
    expect(result.status).toBe('needs-change')
  })

  it('does not generate a public-transit plan outside the edge service days', () => {
    const weekendOnlyDataset: PlanningDataset = {
      ...dataset,
      connections: dataset.connections.map((connection) => ({
        ...connection,
        mode: 'public-transit' as const,
        constraints: ['仅周六、周日运行'], serviceWeekdays: [0, 6],
      })),
    }
    const result = createItinerary({ ...baseInput, mode: 'public-transit', requestedDays: 1, pace: 'compact' }, weekendOnlyDataset)
    expect(result.status).toBe('needs-change')
  })

  it('rejects calendar dates that JavaScript would otherwise normalize', () => {
    const result = createItinerary({ ...baseInput, startDate: '2026-02-30' }, dataset)
    expect(result.status).toBe('needs-change')
    expect(result.issues.some((issue) => issue.includes('有效'))).toBe(true)
  })

  it('keeps every generated day explicit about its final return or stay', () => {
    const result = createItinerary(baseInput, dataset)
    expect(result.status).toBe('ready')
    for (const day of result.primary?.days ?? []) {
      expect(day.events.some((event) => /住宿|返程/.test(event.title))).toBe(true)
    }
  })

  it('keeps overnight arrival and next-day departure at the same base', () => {
    const result = createItinerary({ ...baseInput, requestedDays: 2 }, dataset)
    expect(result.status).toBe('ready')
    const days = result.primary?.days ?? []
    expect(days).toHaveLength(2)
    expect(days[0].overnightBaseId).toBe(days[1].startBaseId)
    expect(days[0].events.some((event) => event.title === '前往住宿落点')).toBe(true)
    expect(days[0].events.some((event) => event.type === 'stay')).toBe(true)
  })

  it('does not silently omit lunch after a long morning transfer', () => {
    const longTransferDataset: PlanningDataset = {
      ...dataset,
      places: dataset.places.map((place) => ({
        ...place,
        opening: { ...place.opening, closeMinute: 20 * 60, lastEntryMinute: 19 * 60 },
        visitMinutes: { ...place.visitMinutes, compact: 30 },
      })),
      connections: [
        ...dataset.connections.map((connection) => (
          connection.from === 'shijiazhuang'
            ? { ...connection, durationMinutes: [400, 400] as [number, number], bidirectional: false }
            : { ...connection, durationMinutes: [10, 10] as [number, number] }
        )),
        { from: 'hebei-museum', to: 'shijiazhuang', mode: 'car', durationMinutes: [10, 10], via: ['返程'], constraints: [], sourceLabel: '测试来源', sourceUrl: 'https://example.com', verifiedAt: '2026-08-29' },
        { from: 'xibaipo', to: 'shijiazhuang', mode: 'car', durationMinutes: [10, 10], via: ['返程'], constraints: [], sourceLabel: '测试来源', sourceUrl: 'https://example.com', verifiedAt: '2026-08-29' },
      ],
    }
    const result = createItinerary({
      ...baseInput,
      requestedDays: 1,
      pace: 'compact',
    }, longTransferDataset)
    expect(result.status).toBe('ready')
    for (const day of result.primary?.days ?? []) {
      expect(day.events.some((event) => event.type === 'meal')).toBe(true)
    }
  })

  it('accounts for every gap in the displayed daily timeline', () => {
    const longVisitDataset: PlanningDataset = {
      ...dataset,
      places: dataset.places.map((place) => ({
        ...place,
        opening: { ...place.opening, openMinute: 9 * 60, closeMinute: 19 * 60, lastEntryMinute: 18 * 60 },
        visitMinutes: { relaxed: 240, standard: 240, compact: 240 },
      })),
      connections: dataset.connections.map((connection) => (
        connection.from === 'shijiazhuang'
          ? { ...connection, durationMinutes: [30, 30] }
          : connection
      )),
    }
    const result = createItinerary({
      ...baseInput,
      requestedDays: 2,
    }, longVisitDataset)
    expect(result.status).toBe('ready')
    for (const day of result.primary?.days ?? []) {
      const events = day.events.filter((event) => event.type !== 'stay')
      for (let index = 1; index < events.length; index += 1) {
        expect(events[index].startMinute).toBe(events[index - 1].endMinute)
      }
    }
  })
})

describe('formatMinute', () => {
  it('formats a minute count as time', () => {
    expect(formatMinute(8 * 60 + 5)).toBe('08:05')
  })
})
