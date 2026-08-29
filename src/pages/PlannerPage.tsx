import { AlertTriangle, ArrowRight, Bus, CalendarDays, Car, Check, Clock3, ExternalLink, Gauge, Hotel, Info, MapPin, RefreshCw, Route, Utensils } from 'lucide-react'
import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PlannerGeographyMap } from '../components/PlannerGeographyMap'
import { destinations } from '../data/destinations'
import { planningDataset, planningPlaces, travelBases } from '../data/planner'
import { createItinerary, formatMinute } from '../lib/itinerary'
import type { DestinationId } from '../types/tourism'
import type { ItineraryEvent, PlannerPace, RequestedDays, TravelBaseId } from '../types/planner'

const destinationIds = destinations.map((item) => item.id)
const today = new Date()
const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

function parsePlaces(value: string | null) {
  const values = value?.split(',').filter((id): id is DestinationId => destinationIds.includes(id as DestinationId)) ?? []
  return [...new Set(values)]
}

function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `${hours ? `${hours} 小时` : ''}${rest ? `${rest} 分` : ''}` || '0 分'
}

function eventIcon(event: ItineraryEvent) {
  if (event.type === 'transit') return <Route aria-hidden="true" />
  if (event.type === 'meal') return <Utensils aria-hidden="true" />
  if (event.type === 'stay') return <Hotel aria-hidden="true" />
  if (event.type === 'buffer') return <Clock3 aria-hidden="true" />
  return <MapPin aria-hidden="true" />
}

export function PlannerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const resultRef = useRef<HTMLDivElement>(null)
  const selectedIds = parsePlaces(searchParams.get('places'))
  const startDate = searchParams.get('date') ?? defaultDate
  const mode = searchParams.get('mode') === 'public-transit' ? 'public-transit' : 'car'
  const daysValue = searchParams.get('days')
  const requestedDays: RequestedDays = daysValue === '1' || daysValue === '2' || daysValue === '3' ? Number(daysValue) as 1 | 2 | 3 : 'auto'
  const paceValue = searchParams.get('pace')
  const pace: PlannerPace = paceValue === 'relaxed' || paceValue === 'compact' ? paceValue : 'standard'
  const baseValue = searchParams.get('start')
  const startBaseId: TravelBaseId = baseValue === 'baoding' || baseValue === 'yixian' ? baseValue : 'shijiazhuang'

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  function togglePlace(id: DestinationId) {
    const next = selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]
    const params = new URLSearchParams(searchParams)
    if (next.length) params.set('places', next.join(',')); else params.delete('places')
    setSearchParams(params, { replace: true })
  }

  const result = selectedIds.length >= 2 ? createItinerary({ selectedIds, startDate, mode, requestedDays, pace, startBaseId }, planningDataset) : null
  const selectedPlaces = selectedIds.map((id) => planningPlaces.find((place) => place.id === id)).filter(Boolean)
  const primary = result?.primary

  return (
    <main className="planner-page">
      <section className="planner-top"><div className="page-width">
        <div className="planner-title"><div><span>四地联动工具</span><h1>景点对比与行程规划</h1><p>同时查看关键信息，并把通勤、开放时间、午餐、准备和住宿落点安排到同一条可核验路线中。</p></div><strong>{selectedIds.length}<small>/4 已选</small></strong></div>
        <fieldset className="place-picker"><legend>选择要比较的地点</legend>{destinations.map((destination) => {
          const checked = selectedIds.includes(destination.id)
          return <label key={destination.id} className={checked ? 'is-selected' : ''}><input type="checkbox" checked={checked} onChange={() => togglePlace(destination.id)} /><span className="place-picker__check">{checked && <Check aria-hidden="true" />}</span><span><strong>{destination.shortName}</strong><small>{destination.city}</small></span></label>
        })}</fieldset>
      </div></section>

      <section className="compare-section"><div className="page-width">
        <div className="section-kicker"><span>横向对比</span><h2>{selectedIds.length ? `已选 ${selectedIds.length} 地简要比较` : '先选择一个或多个地点'}</h2></div>
        {!selectedIds.length ? <div className="planner-empty"><Info aria-hidden="true" /><p>勾选地点后，开放、用时、交通、预约和限制会同时出现。</p></div> : (
          <div className={`compare-grid count-${selectedIds.length}`}>{selectedPlaces.map((place) => {
            if (!place) return null
            const destination = destinations.find((item) => item.id === place.id)!
            return <article key={place.id} className="compare-place"><div className="compare-place__head"><span>{selectedIds.indexOf(place.id) + 1}</span><div><h3>{place.name}</h3><p>{destination.category}</p></div></div>
              <dl><div><dt>开放</dt><dd>{destination.opening.regularDays} · {destination.opening.periods[0].openTime}-{destination.opening.periods[0].closeTime}</dd></div><div><dt>用时 / 强度</dt><dd>{place.comparison.visitWindow}</dd></div><div><dt>交通</dt><dd>{place.comparison.transport}</dd></div><div><dt>预约</dt><dd>{place.comparison.booking}</dd></div><div><dt>适合</dt><dd>{place.comparison.fit}</dd></div><div><dt>关键限制</dt><dd>{place.comparison.limitation}</dd></div></dl>
              <div className="compare-place__links"><Link to={`/destination/${place.id}`}>查看完整指南<ArrowRight aria-hidden="true" /></Link><a href={place.openingSource.url} target="_blank" rel="noreferrer">核验开放时间<ExternalLink aria-hidden="true" /></a></div>
            </article>
          })}</div>
        )}
      </div></section>

      <section className="planner-workspace"><div className="page-width">
        <div className="section-kicker"><span>串联路线</span><h2>设置行程条件</h2></div>
        <div className="planner-tool">
          <div className="planner-controls">
            <label><span><CalendarDays aria-hidden="true" />出发日期</span><input type="date" value={startDate} onChange={(event) => updateParam('date', event.target.value)} /></label>
            <div className="control-group"><span>交通偏好</span><div className="segmented"><button className={mode === 'car' ? 'is-active' : ''} type="button" onClick={() => updateParam('mode', 'car')}><Car aria-hidden="true" />自驾</button><button className={mode === 'public-transit' ? 'is-active' : ''} type="button" onClick={() => updateParam('mode', 'public-transit')}><Bus aria-hidden="true" />公共交通</button></div></div>
            <label><span><Clock3 aria-hidden="true" />可用天数</span><select value={requestedDays} onChange={(event) => updateParam('days', event.target.value)}><option value="auto">自动安排</option><option value="1">1 天</option><option value="2">2 天</option><option value="3">3 天</option></select></label>
            <label><span><Gauge aria-hidden="true" />行程节奏</span><select value={pace} onChange={(event) => updateParam('pace', event.target.value)}><option value="relaxed">轻松</option><option value="standard">标准</option><option value="compact">紧凑</option></select></label>
            <label><span><MapPin aria-hidden="true" />首日出发区域</span><select value={startBaseId} onChange={(event) => updateParam('start', event.target.value)}>{travelBases.map((base) => <option key={base.id} value={base.id}>{base.label}</option>)}</select></label>
            <button className="generate-button" type="button" disabled={selectedIds.length < 2} onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><RefreshCw aria-hidden="true" />生成 / 更新行程</button>
            <p className="planner-boundary">静态建议，不读取实时路况、班次、商家营业或酒店库存。</p>
          </div>
          <PlannerGeographyMap selectedIds={selectedIds} order={primary?.placeOrder ?? selectedIds} />
        </div>

        <div ref={resultRef} className="planner-result" aria-live="polite">
          {selectedIds.length < 2 ? <div className="planner-notice"><Info aria-hidden="true" /><div><h3>再选 {2 - selectedIds.length} 个地点即可生成串联路线</h3><p>单个地点仍可在上方查看摘要和进入完整指南。</p></div></div> : result?.status === 'needs-change' ? <div className="planner-notice is-warning"><AlertTriangle aria-hidden="true" /><div><h3>当前条件无法生成可靠行程</h3>{result.issues.map((issue) => <p key={issue}>{issue}</p>)}<p>可尝试增加天数、调整日期或改用自驾；系统不会用未经核验的班次补齐空白。</p></div></div> : primary ? <>
            <div className="result-summary"><div><span>推荐方案</span><h2>{primary.days.length} 天 · {mode === 'car' ? '自驾' : '公共交通'}</h2><p>{primary.placeOrder.map((id) => planningPlaces.find((place) => place.id === id)?.name).join(' → ')}</p></div><dl><div><dt>参观</dt><dd>{durationLabel(primary.visitMinutes)}</dd></div><div><dt>通勤</dt><dd>{durationLabel(primary.transitMinutes)}</dd></div><div><dt>缓冲</dt><dd>{durationLabel(primary.bufferMinutes)}</dd></div><div><dt>总计</dt><dd>{durationLabel(primary.totalMinutes)}</dd></div></dl></div>
            <div className="itinerary-days">{primary.days.map((day) => <article className="itinerary-day" key={day.dayNumber}><header><div><span>DAY {day.dayNumber}</span><h3>第 {day.dayNumber} 天 · {day.date}</h3></div><p>参观 {durationLabel(day.visitMinutes)} · 通勤 {durationLabel(day.transitMinutes)} · 缓冲 {durationLabel(day.bufferMinutes)}</p></header>
              <div className="timeline">{day.events.map((event) => <div className={`timeline-event type-${event.type}`} key={event.id}><div className="timeline-event__time">{formatMinute(event.startMinute)}{event.endMinute !== event.startMinute && <small>{formatMinute(event.endMinute)}</small>}</div><span className="timeline-event__icon">{eventIcon(event)}</span><div className="timeline-event__body"><h4>{event.title}</h4><p>{event.detail}</p>{event.sourceUrl && <a href={event.sourceUrl} target="_blank" rel="noreferrer">查看本段原始依据<ExternalLink aria-hidden="true" /></a>}</div></div>)}</div>
              <div className="day-prep"><strong>当天准备</strong><ul>{day.preparations.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </article>)}</div>
            <div className="planner-warnings"><AlertTriangle aria-hidden="true" /><div><strong>出发前必须再次核验</strong>{primary.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div></div>
          </> : null}
        </div>
      </div></section>
    </main>
  )
}
