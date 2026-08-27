import { BusFront, CarFront, ExternalLink, Footprints, MapPin, TrainFront } from 'lucide-react'
import { useState } from 'react'
import type { Destination, TravelMode } from '../types/tourism'

interface TransportMapProps {
  destination: Destination
}

const modeLabel: Record<TravelMode, string> = {
  walk: '步行',
  metro: '地铁',
  bus: '旅游公交',
  car: '自驾',
}

const modeIcon = {
  walk: Footprints,
  metro: TrainFront,
  bus: BusFront,
  car: CarFront,
}

export function TransportMap({ destination }: TransportMapProps) {
  const map = destination.travelMap
  const [activeNodeId, setActiveNodeId] = useState(map.nodes.find((node) => node.primary)?.id ?? map.nodes[0].id)
  const activeNode = map.nodes.find((node) => node.id === activeNodeId) ?? map.nodes[0]

  return (
    <section className="transport-map-section" aria-labelledby={`transport-map-${destination.id}`}>
      <div className="transport-map-heading">
        <div><p className="section-kicker">真实交通关系</p><h2 id={`transport-map-${destination.id}`}>{map.title}</h2><p>{map.scope}</p></div>
        <div className="transport-mode-legend">
          {[...new Set(map.lines.map((line) => line.mode))].map((mode) => {
            const Icon = modeIcon[mode]
            return <span key={mode}><Icon aria-hidden="true" />{modeLabel[mode]}</span>
          })}
        </div>
      </div>
      <div className="transport-map-canvas">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`${map.title}路线底图`} role="img">
          <g className="transport-roads">
            <path d="M-5 88C18 79 27 68 42 59S70 38 105 19" />
            <path d="M4 20C26 27 40 39 49 55S73 78 103 84" />
            <path d="M28 -5C29 22 38 39 56 49S80 59 91 105" />
          </g>
          {map.lines.map((line) => {
            const Icon = modeIcon[line.mode]
            return (
              <g key={line.id} className={`transport-line transport-line--${line.mode}`}>
                <path d={line.path} />
                <g className="moving-transport">
                  <animateMotion path={line.path} dur={line.mode === 'walk' ? '9s' : '7s'} repeatCount="indefinite" />
                  <g className="transport-glyph">
                    <circle r="3.2" />
                    <Icon x="-1.8" y="-1.8" width="3.6" height="3.6" aria-hidden="true" />
                  </g>
                </g>
              </g>
            )
          })}
        </svg>
        {map.nodes.map((node, index) => (
          <button
            key={node.id}
            type="button"
            className={node.id === activeNode.id ? 'transport-node is-active' : 'transport-node'}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => setActiveNodeId(node.id)}
            aria-pressed={node.id === activeNode.id}
          >
            <span>{index + 1}</span><small>{node.label}</small>
          </button>
        ))}
        <div className="transport-node-card" aria-live="polite">
          <MapPin aria-hidden="true" /><span><strong>{activeNode.label}</strong><small>{activeNode.detail}</small></span>
        </div>
      </div>
      <div className="transport-map-foot">
        <p>{map.sourceNote} <a href={map.sourceUrl} target="_blank" rel="noreferrer">{map.sourceLabel}<ExternalLink aria-hidden="true" /></a></p>
        {map.lines.find((line) => line.caution)?.caution && <strong>{map.lines.find((line) => line.caution)?.caution}</strong>}
      </div>
    </section>
  )
}
