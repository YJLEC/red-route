import type { DestinationId } from '../types/tourism'
import type {
  ConnectionNodeId,
  ItineraryDay,
  ItineraryEvent,
  ItineraryOption,
  PlannerInput,
  PlannerPace,
  PlannerResult,
  PlanningConnection,
  PlanningDataset,
  PlanningPlace,
  TravelBaseId,
} from '../types/planner'

const DAY_START: Record<PlannerPace, number> = { relaxed: 8 * 60 + 30, standard: 8 * 60, compact: 7 * 60 + 30 }
const DAY_END: Record<PlannerPace, number> = { relaxed: 18 * 60, standard: 19 * 60, compact: 20 * 60 }
const LUNCH_START = 11 * 60 + 30
const LUNCH_TARGET = 12 * 60 + 15
const LUNCH_END = 14 * 60
const LUNCH_DURATION = 45

interface CandidateBuild {
  option?: ItineraryOption
  issues: string[]
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const normalized = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return normalized === value ? date : null
}

function addDays(value: string, offset: number) {
  const date = parseDate(value)
  if (!date) return value
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function weekday(value: string) {
  return parseDate(value)?.getDay() ?? -1
}

function midpoint(range: [number, number]) {
  return Math.ceil((range[0] + range[1]) / 2)
}

function permutations<T>(items: T[]): T[][] {
  if (items.length < 2) return [items]
  return items.flatMap((item, index) => permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest]))
}

function compositions(total: number, parts: number): number[][] {
  if (parts === 1) return total >= 1 ? [[total]] : []
  const result: number[][] = []
  for (let first = 1; first <= total - parts + 1; first += 1) {
    for (const rest of compositions(total - first, parts - 1)) result.push([first, ...rest])
  }
  return result
}

function splitOrder(order: DestinationId[], sizes: number[]) {
  let cursor = 0
  return sizes.map((size) => {
    const segment = order.slice(cursor, cursor + size)
    cursor += size
    return segment
  })
}

function findConnection(connections: PlanningConnection[], from: ConnectionNodeId, to: ConnectionNodeId, mode: PlannerInput['mode'], date: string) {
  const day = weekday(date)
  return connections.find((connection) => connection.mode === mode
    && (!connection.serviceWeekdays || connection.serviceWeekdays.includes(day))
    && ((connection.from === from && connection.to === to)
      || (connection.bidirectional === true && connection.from === to && connection.to === from)))
}

function unique(values: string[]) {
  return [...new Set(values)]
}

function eventId(dayNumber: number, events: ItineraryEvent[]) {
  return `day-${dayNumber}-event-${events.length + 1}`
}

function addEvent(events: ItineraryEvent[], event: Omit<ItineraryEvent, 'id'>, dayNumber: number) {
  events.push({ ...event, id: eventId(dayNumber, events) })
}

function addLunch(events: ItineraryEvent[], dayNumber: number, startMinute: number, place: PlanningPlace) {
  addEvent(events, {
    type: 'meal',
    startMinute,
    endMinute: startMinute + LUNCH_DURATION,
    title: `午餐 · ${place.mealArea}`,
    detail: place.mealNote,
    placeId: place.id,
  }, dayNumber)
  return startMinute + LUNCH_DURATION
}

function buildDay(
  dayNumber: number,
  date: string,
  placeIds: DestinationId[],
  startBaseId: TravelBaseId,
  overnightBaseId: TravelBaseId | undefined,
  input: PlannerInput,
  dataset: PlanningDataset,
): { day?: ItineraryDay; issues: string[] } {
  const placeMap = new Map(dataset.places.map((place) => [place.id, place]))
  const events: ItineraryEvent[] = []
  const issues: string[] = []
  const preparations: string[] = []
  let currentNode: ConnectionNodeId = startBaseId
  let currentMinute = DAY_START[input.pace]
  let lunchTaken = false
  let visitMinutes = 0
  let transitMinutes = 0
  let bufferMinutes = 0

  for (const placeId of placeIds) {
    const place = placeMap.get(placeId)
    if (!place) {
      issues.push(`缺少目的地 ${placeId} 的规划数据。`)
      continue
    }
    if (!place.opening.openWeekdays.includes(weekday(date))) {
      issues.push(`${place.name}在 ${date} 按常规规则闭馆。`)
      continue
    }

    const connection = findConnection(dataset.connections, currentNode, place.id, input.mode, date)
    if (!connection) {
      issues.push(`${input.mode === 'car' ? '自驾' : '公共交通'}缺少“${currentNode}—${place.name}”的可靠交通关系。`)
      continue
    }
    const transit = midpoint(connection.durationMinutes)
    addEvent(events, {
      type: 'transit',
      startMinute: currentMinute,
      endMinute: currentMinute + transit,
      title: `前往${place.name}`,
      detail: `${connection.via.join(' · ')}；预计 ${connection.durationMinutes[0]}-${connection.durationMinutes[1]} 分钟。${connection.constraints.join('；')}`,
      placeId: place.id,
      sourceLabel: connection.sourceLabel,
      sourceUrl: connection.sourceUrl,
    }, dayNumber)
    currentMinute += transit
    transitMinutes += transit

    if (!lunchTaken && currentMinute >= LUNCH_START && currentMinute <= LUNCH_END) {
      currentMinute = addLunch(events, dayNumber, currentMinute, place)
      lunchTaken = true
    }

    if (currentMinute < place.opening.openMinute) {
      const wait = place.opening.openMinute - currentMinute
      addEvent(events, {
        type: 'buffer',
        startMinute: currentMinute,
        endMinute: place.opening.openMinute,
        title: '开放前缓冲',
        detail: '用于停车、步行至入口、安检或等待开放。',
        placeId: place.id,
      }, dayNumber)
      currentMinute = place.opening.openMinute
      bufferMinutes += wait
    }

    const plannedVisit = place.visitMinutes[input.pace]
    if (!lunchTaken && currentMinute < LUNCH_TARGET && currentMinute + plannedVisit > LUNCH_TARGET) {
      const lunchAt = Math.max(currentMinute, LUNCH_START)
      if (lunchAt > currentMinute) {
        addEvent(events, {
          type: 'buffer', startMinute: currentMinute, endMinute: lunchAt,
          title: '午餐前机动时间', detail: '可用于入口核验、补给、休息或适量提前参观。', placeId: place.id,
        }, dayNumber)
        bufferMinutes += lunchAt - currentMinute
      }
      currentMinute = addLunch(events, dayNumber, lunchAt, place)
      lunchTaken = true
    }
    if (currentMinute > place.opening.lastEntryMinute) {
      issues.push(`预计抵达${place.name}时已晚于停止入场时间。`)
      continue
    }
    if (currentMinute + plannedVisit > place.opening.closeMinute) {
      issues.push(`${place.name}在闭馆前没有足够的合理参观时间。`)
      continue
    }

    addEvent(events, {
      type: 'visit',
      startMinute: currentMinute,
      endMinute: currentMinute + plannedVisit,
      title: `参观${place.name}`,
      detail: `按${input.pace === 'relaxed' ? '轻松' : input.pace === 'compact' ? '紧凑' : '标准'}节奏预留 ${plannedVisit} 分钟。`,
      placeId: place.id,
      sourceLabel: place.openingSource.label,
      sourceUrl: place.openingSource.url,
    }, dayNumber)
    currentMinute += plannedVisit
    visitMinutes += plannedVisit
    preparations.push(...place.preparations)
    currentNode = place.id
  }

  const lastPlace = placeMap.get(placeIds.at(-1) ?? placeIds[0])
  if (!lunchTaken && lastPlace) {
    const lunchAt = currentMinute > LUNCH_END ? currentMinute : Math.max(currentMinute, LUNCH_START)
    if (lunchAt <= DAY_END[input.pace]) {
      if (lunchAt > currentMinute) {
        addEvent(events, {
          type: 'buffer', startMinute: currentMinute, endMinute: lunchAt,
          title: '机动时间', detail: '可用于补充参观、休息或前往用餐区域。', placeId: lastPlace.id,
        }, dayNumber)
        bufferMinutes += lunchAt - currentMinute
      }
      currentMinute = addLunch(events, dayNumber, lunchAt, lastPlace)
    }
  }

  if (overnightBaseId && currentNode !== overnightBaseId) {
    const connection = findConnection(dataset.connections, currentNode, overnightBaseId, input.mode, date)
    if (!connection) {
      issues.push(`缺少“${currentNode}—${overnightBaseId}”的可靠住宿转场关系。`)
    } else {
      const transit = midpoint(connection.durationMinutes)
      addEvent(events, {
        type: 'transit', startMinute: currentMinute, endMinute: currentMinute + transit,
        title: '前往住宿落点',
        detail: `${connection.via.join(' · ')}；预计 ${connection.durationMinutes[0]}-${connection.durationMinutes[1]} 分钟。`,
        sourceLabel: connection.sourceLabel, sourceUrl: connection.sourceUrl,
      }, dayNumber)
      currentMinute += transit
      transitMinutes += transit
      const base = dataset.bases.find((item) => item.id === overnightBaseId)
      addEvent(events, {
        type: 'stay', startMinute: currentMinute, endMinute: currentMinute,
        title: `住宿 · ${base?.label ?? overnightBaseId}`,
        detail: base?.stayReason ?? '为下一日行程减少重复通勤。',
      }, dayNumber)
    }
  } else if (!overnightBaseId && lastPlace) {
    const finalBaseId = lastPlace.preferredStayBaseId
    const connection = findConnection(dataset.connections, currentNode, finalBaseId, input.mode, date)
    if (!connection) {
      issues.push(`缺少“${currentNode}—${finalBaseId}”的可靠末日返程关系。`)
    } else {
      const transit = midpoint(connection.durationMinutes)
      const base = dataset.bases.find((item) => item.id === finalBaseId)
      addEvent(events, {
        type: 'transit', startMinute: currentMinute, endMinute: currentMinute + transit,
        title: `返程至${base?.label ?? finalBaseId}`,
        detail: `${connection.via.join(' · ')}；预计 ${connection.durationMinutes[0]}-${connection.durationMinutes[1]} 分钟。${connection.constraints.join('；')}`,
        sourceLabel: connection.sourceLabel, sourceUrl: connection.sourceUrl,
      }, dayNumber)
      currentMinute += transit
      transitMinutes += transit
      addEvent(events, {
        type: 'stay', startMinute: currentMinute, endMinute: currentMinute,
        title: `住宿 / 返程落点 · ${base?.label ?? finalBaseId}`,
        detail: `${base?.stayReason ?? '作为当日结束落点。'}具体住宿、返程班次与库存需自行核验。`,
        sourceLabel: base?.sourceLabel, sourceUrl: base?.sourceUrl,
      }, dayNumber)
    }
  }

  if (currentMinute > DAY_END[input.pace]) issues.push(`第 ${dayNumber} 天预计结束过晚，超出当前节奏的每日时长。`)
  if (issues.length) return { issues }

  return {
    issues: [],
    day: {
      dayNumber,
      date,
      startBaseId,
      overnightBaseId,
      placeIds,
      events,
      visitMinutes,
      transitMinutes,
      bufferMinutes,
      totalMinutes: currentMinute - DAY_START[input.pace],
      preparations: unique(preparations),
    },
  }
}

function buildCandidate(order: DestinationId[], sizes: number[], input: PlannerInput, dataset: PlanningDataset): CandidateBuild {
  const groups = splitOrder(order, sizes)
  const placeMap = new Map(dataset.places.map((place) => [place.id, place]))
  const days: ItineraryDay[] = []
  const issues: string[] = []

  groups.forEach((placeIds, index) => {
    const nextFirst = groups[index + 1]?.[0]
    const overnightBaseId = nextFirst ? placeMap.get(nextFirst)?.preferredStayBaseId : undefined
    const startBaseId = index === 0
      ? input.startBaseId
      : placeMap.get(placeIds[0])?.preferredStayBaseId ?? input.startBaseId
    const result = buildDay(index + 1, addDays(input.startDate, index), placeIds, startBaseId, overnightBaseId, input, dataset)
    issues.push(...result.issues)
    if (result.day) days.push(result.day)
  })
  if (issues.length || days.length !== groups.length) return { issues: unique(issues) }

  const visitMinutes = days.reduce((sum, day) => sum + day.visitMinutes, 0)
  const transitMinutes = days.reduce((sum, day) => sum + day.transitMinutes, 0)
  const bufferMinutes = days.reduce((sum, day) => sum + day.bufferMinutes, 0)
  const intensityTransitions = order.slice(1).reduce((sum, id, index) => {
    const before = placeMap.get(order[index])?.intensity ?? 1
    const current = placeMap.get(id)?.intensity ?? 1
    return sum + Math.max(0, current - before) * 20
  }, 0)

  return {
    issues: [],
    option: {
      id: `${order.join('-')}-${sizes.join('-')}`,
      label: `${days.length} 天 · ${input.mode === 'car' ? '自驾' : '公共交通'}`,
      days,
      placeOrder: order,
      visitMinutes,
      transitMinutes,
      bufferMinutes,
      totalMinutes: days.reduce((sum, day) => sum + day.totalMinutes, 0),
      warnings: ['节假日、临时闭馆、实时路况和班次仍须通过每段原始来源核验。'],
      score: transitMinutes + bufferMinutes + days.length * 500 + intensityTransitions,
    },
  }
}

export function createItinerary(input: PlannerInput, dataset: PlanningDataset): PlannerResult {
  const selectedIds = unique(input.selectedIds) as DestinationId[]
  if (selectedIds.length < 2) return { status: 'needs-change', issues: ['至少选择两个目的地才能生成串联路线。'] }
  if (selectedIds.length > 4) return { status: 'needs-change', issues: ['串联路线最多支持四个目的地。'] }
  if (!parseDate(input.startDate)) return { status: 'needs-change', issues: ['请选择有效的出发日期。'] }
  const known = new Set(dataset.places.map((place) => place.id))
  const unknown = selectedIds.filter((id) => !known.has(id))
  if (unknown.length) return { status: 'needs-change', issues: [`缺少目的地规划数据：${unknown.join('、')}。`] }

  const dayChoices = input.requestedDays === 'auto'
    ? Array.from({ length: Math.min(3, selectedIds.length) }, (_, index) => index + 1)
    : [input.requestedDays]
  const options: ItineraryOption[] = []
  const issues: string[] = []

  for (const order of permutations(selectedIds)) {
    for (const dayCount of dayChoices) {
      if (dayCount > selectedIds.length) continue
      for (const sizes of compositions(selectedIds.length, dayCount)) {
        const candidate = buildCandidate(order, sizes, input, dataset)
        if (candidate.option) options.push(candidate.option)
        issues.push(...candidate.issues)
      }
    }
  }

  options.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id))
  const primary = options[0]
  if (!primary) return { status: 'needs-change', issues: unique(issues).slice(0, 8) }
  const alternative = options.find((option) => option.placeOrder.join('|') !== primary.placeOrder.join('|'))
  return { status: 'ready', primary, alternative, issues: [] }
}

export function formatMinute(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
