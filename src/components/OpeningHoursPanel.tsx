import { CalendarDays, Clock3, ExternalLink, ShieldAlert, TicketCheck } from 'lucide-react'
import type { OpeningSchedule } from '../types/tourism'

interface OpeningHoursPanelProps {
  destinationName: string
  opening: OpeningSchedule
}

export function OpeningHoursPanel({ destinationName, opening }: OpeningHoursPanelProps) {
  const usuallyOpenToday = opening.openWeekdays.includes(new Date().getDay())

  return (
    <section className="opening-section page-width" aria-labelledby="opening-title">
      <div className="opening-heading">
        <div>
          <p className="section-kicker">先确认能不能进</p>
          <h2 id="opening-title">开放与闭馆时间</h2>
        </div>
        <span className={opening.status === 'conflicting' ? 'opening-status is-warning' : usuallyOpenToday ? 'opening-status is-open' : 'opening-status is-closed'}>
          <CalendarDays aria-hidden="true" />
          {opening.status === 'conflicting' ? '官方时段存在冲突' : `按常规周规则，今日${usuallyOpenToday ? '开放' : '闭馆'}`}
        </span>
      </div>
      <div className="opening-grid">
        <div>
          <span><CalendarDays aria-hidden="true" />开放日期</span>
          <strong>{opening.regularDays}</strong>
          <small>{opening.closedDays.length ? `常规闭馆：${opening.closedDays.join('、')}` : '无固定闭馆日信息'}</small>
        </div>
        <div className="opening-periods">
          <span><Clock3 aria-hidden="true" />日常时段</span>
          {opening.periods.map((period) => (
            <p key={period.label}>
              <small>{period.label}</small>
              <strong>{period.openTime}–{period.closeTime}</strong>
              <em>{period.lastEntryTime ? `${period.lastEntryTime} 停止入场` : '停止入场时间需另行核验'}</em>
            </p>
          ))}
        </div>
        <div>
          <span><TicketCheck aria-hidden="true" />预约与证件</span>
          <strong>{opening.reservation ?? '以现场与官方公告为准'}</strong>
          <small>携带预约所用有效证件</small>
        </div>
      </div>
      <div className="opening-advisory">
        <ShieldAlert aria-hidden="true" />
        <p><strong>{destinationName}出发前核验</strong>{opening.exceptions}</p>
        <div className="opening-sources">
          {opening.sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.label}<ExternalLink aria-hidden="true" />
            </a>
          ))}
        </div>
        <small>信息核验于 {opening.verifiedAt}</small>
      </div>
    </section>
  )
}
