import { BusFront, CarFront, Check, CircleAlert, ExternalLink, RefreshCw, Shuffle } from 'lucide-react'
import type { ArrivalMode, Destination } from '../types/tourism'
import { TransportMap } from './TransportMap'

interface TravelInformationProps {
  destination: Destination
}

const modeIcon: Record<ArrivalMode, typeof BusFront> = {
  公共交通: BusFront,
  自驾: CarFront,
  换乘提示: Shuffle,
}

export function TravelInformation({ destination }: TravelInformationProps) {
  return (
    <div className="travel-band">
      <div className="page-width"><TransportMap destination={destination} /></div>
      <div className="page-width travel-grid">
        <section aria-labelledby="arrival-title">
          <div className="section-heading section-heading--compact"><div><p className="section-kicker">从哪里来</p><h2 id="arrival-title">抵达方式</h2></div></div>
          <div className="arrival-list">
            {destination.arrivals.map((arrival, index) => {
              const Icon = modeIcon[arrival.mode]
              return (
                <article className="arrival-item" key={`${arrival.mode}-${index}`}>
                  <span className="arrival-icon"><Icon aria-hidden="true" /></span>
                  <div>
                    <span className="arrival-mode">{arrival.mode}</span><h3>{arrival.title}</h3><p>{arrival.detail}</p>
                    {arrival.caution && <p className="caution"><CircleAlert aria-hidden="true" />{arrival.caution}</p>}
                    <a className="arrival-source" href={arrival.sourceUrl} target="_blank" rel="noreferrer">
                      <span><ExternalLink aria-hidden="true" />查看原始网页</span>
                      <small>{arrival.sourceLabel} · 核验于 {arrival.verifiedAt}</small>
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
          <a className="secondary-action" href={destination.navigationUrl} target="_blank" rel="noreferrer">在高德地图中搜索<ExternalLink aria-hidden="true" /></a>
        </section>
        <section className="preparation" aria-labelledby="preparation-title">
          <div className="section-heading section-heading--compact"><div><p className="section-kicker">出发前检查</p><h2 id="preparation-title">准备事项</h2></div></div>
          <ul>{destination.preparations.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
          <div className="advisory"><RefreshCw aria-hidden="true" /><div><strong>易变化信息提示</strong><p>{destination.advisory}</p><small>本站资料核验于 {destination.verifiedAt}</small></div></div>
        </section>
      </div>
    </div>
  )
}
