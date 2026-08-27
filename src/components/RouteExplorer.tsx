import { Clock3, ExternalLink, Footprints, GitBranch, Info, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Destination, RouteSpot } from '../types/tourism'
import { makePlaceholderGallery } from '../data/gallery'
import { MediaCarousel } from './MediaCarousel'

interface RouteExplorerProps {
  destination: Destination
}

interface FootstepSegment {
  id: string
  from: RouteSpot
  to: RouteSpot
}

function RouteFootprint({ x, y, angle, side, delay }: { x: number; y: number; angle: number; side: 'left' | 'right'; delay: number }) {
  return (
    <g
      className={`route-footprint route-footprint--${side}`}
      style={{ animationDelay: `${delay}s` }}
      transform={`translate(${x} ${y}) rotate(${angle})`}
      aria-hidden="true"
    >
      <ellipse cx="0" cy="0.6" rx="0.72" ry="1.25" />
      <circle cx="0" cy="-1.05" r="0.48" />
      <circle cx="-0.46" cy="-0.84" r="0.23" />
      <circle cx="0.46" cy="-0.84" r="0.23" />
    </g>
  )
}

function RouteFootsteps({ segments, branch = false }: { segments: FootstepSegment[]; branch?: boolean }) {
  const footsteps = segments.flatMap((segment, segmentIndex) => {
    const dx = segment.to.x - segment.from.x
    const dy = segment.to.y - segment.from.y
    const length = Math.hypot(dx, dy)
    if (length === 0) return []

    const stepCount = Math.max(5, Math.round(length / 5))
    const normalX = -dy / length
    const normalY = dx / length
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90

    return Array.from({ length: stepCount }, (_, stepIndex) => {
      const progress = (stepIndex + 0.65) / (stepCount + 0.3)
      const side = (stepIndex + segmentIndex) % 2 === 0 ? 'left' : 'right'
      const offset = side === 'left' ? -1.25 : 1.25
      return {
        id: `${segment.id}-${stepIndex}`,
        x: segment.from.x + dx * progress + normalX * offset,
        y: segment.from.y + dy * progress + normalY * offset,
        angle,
        side,
        delay: (segmentIndex * stepCount + stepIndex) * 0.32,
      } as const
    })
  })

  return (
    <g className={branch ? 'route-footsteps route-footsteps--branch' : 'route-footsteps'}>
      {footsteps.map((footstep) => <RouteFootprint key={footstep.id} {...footstep} />)}
    </g>
  )
}

function buildPath(spots: RouteSpot[]) {
  return spots.map((spot, index) => `${index === 0 ? 'M' : 'L'}${spot.x} ${spot.y}`).join(' ')
}

export function RouteExplorer({ destination }: RouteExplorerProps) {
  const [activeSpotId, setActiveSpotId] = useState(destination.spots[0].id)
  const [feedbackTick, setFeedbackTick] = useState(0)
  const activeSpot = destination.spots.find((spot) => spot.id === activeSpotId) ?? destination.spots[0]
  const mainSpots = destination.spots.filter((spot) => !spot.branch)
  const mainPath = buildPath(mainSpots)
  const mainSegments = useMemo(() => mainSpots.slice(1).map((spot, index) => ({
    id: `${mainSpots[index].id}-${spot.id}`,
    from: mainSpots[index],
    to: spot,
  })), [mainSpots])
  const branchPaths = useMemo(() => destination.spots.filter((spot) => spot.branch).map((spot) => {
    const index = destination.spots.indexOf(spot)
    const previous = [...destination.spots.slice(0, index)].reverse().find((item) => !item.branch) ?? mainSpots[0]
    return {
      id: spot.id,
      path: `M${previous.x} ${previous.y} L${spot.x} ${spot.y}`,
      segment: { id: `${previous.id}-${spot.id}`, from: previous, to: spot },
    }
  }), [destination.spots, mainSpots])
  const activeIndex = destination.spots.findIndex((spot) => spot.id === activeSpot.id)

  function selectSpot(id: string) {
    setActiveSpotId(id)
    setFeedbackTick((value) => value + 1)
  }

  return (
    <section className="route-section page-width" aria-labelledby="route-title">
      <div className="section-heading section-heading--route">
        <div><p className="section-kicker">到达后这样游览</p><h2 id="route-title">{destination.routeTitle}</h2></div>
        <p>{destination.routeNote}</p>
      </div>
      <div className="route-progress" aria-label={`当前查看第 ${activeSpot.order} 站，共 ${destination.spots.length} 站`}>
        <span style={{ width: `${((activeIndex + 1) / destination.spots.length) * 100}%` }} />
        <small>{String(activeIndex + 1).padStart(2, '0')} / {String(destination.spots.length).padStart(2, '0')}</small>
      </div>
      <div className="route-layout">
        <div className={`route-map route-map--${destination.mapStyle}`}>
          <div className="route-map__legend"><span><i className="legend-main" />步行主路线</span><span><i className="legend-branch" />选走支线</span><span><Footprints aria-hidden="true" />足迹表示徒步</span></div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`${destination.name}导览底图`} role="img">
            {destination.mapStyle === 'floor' && (
              <g className="floor-plan">
                <path d="M7 12H93V87H7Z"/><path d="M30 12V59M55 12V59M78 12V59M7 59H93"/>
                <path className="map-corridor" d="M10 73H86M16 73V60M86 73V82" />
                <text x="15" y="22">第一单元</text><text x="37" y="22">第二单元</text><text x="61" y="22">第三单元</text><text x="79" y="68">第四单元</text>
              </g>
            )}
            {destination.mapStyle === 'campus' && (
              <g className="campus-plan">
                <path className="map-water" d="M65 2Q83 7 99 2V25Q83 18 65 25Z"/><text x="77" y="13">岗南水库方向</text>
                <path className="map-access-road" d="M2 84C17 76 27 69 38 62S59 54 70 42S85 28 98 24" />
                <rect x="7" y="15" width="24" height="22"/><rect x="36" y="40" width="20" height="23"/><rect x="60" y="15" width="29" height="23"/><rect x="66" y="49" width="25" height="29"/>
                <text x="10" y="20">纪念馆区域</text><text x="61" y="20">旧址院落</text>
              </g>
            )}
            {destination.mapStyle === 'mountain' && (
              <g className="mountain-lines">
                <path d="M1 92Q22 74 39 81T67 53T99 26"/><path d="M0 78Q21 59 40 65T69 38T100 14"/><path d="M3 99Q25 83 44 90T75 65T100 40"/>
                <path className="map-ridge" d="M11 92C25 81 34 73 45 62S62 42 73 18" />
                <text x="5" y="97">山脚</text><text x="45" y="58">山脊步道</text><text x="72" y="13">峰顶区域</text>
              </g>
            )}
            <path className="route-line" d={mainPath} />
            {branchPaths.map((branch) => <path key={branch.id} className="route-branch-line" d={branch.path} />)}
            <RouteFootsteps segments={mainSegments} />
            {branchPaths.map((branch) => <RouteFootsteps key={branch.id} segments={[branch.segment]} branch />)}
          </svg>
          {destination.mapFeatures.map((feature) => (
            <span key={feature.id} className={`map-feature map-feature--${feature.type}`} style={{ left: `${feature.x}%`, top: `${feature.y}%` }}>
              <Info aria-hidden="true" /><small>{feature.label}</small>
            </span>
          ))}
          {destination.spots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className={spot.id === activeSpot.id ? 'route-point is-active' : 'route-point'}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-pressed={spot.id === activeSpot.id}
              onClick={() => selectSpot(spot.id)}
            >
              <span>{spot.order}</span><small>{spot.name}</small>
            </button>
          ))}
          <span className="route-map__disclaimer">
            依据官方导览资料重绘 · 开放区域以景区标识为准
            <a href={destination.guideMapSource.url} target="_blank" rel="noreferrer">
              查看官方原始资料<ExternalLink aria-hidden="true" />
            </a>
          </span>
        </div>
        <div className="spot-panel" aria-live="polite" key={`${activeSpot.id}-${feedbackTick}`}>
          <MediaCarousel items={activeSpot.gallery ?? makePlaceholderGallery(activeSpot.id, activeSpot.name)} compact />
          <div className="spot-panel__body">
            <div className="spot-panel__number">第 {activeSpot.order} 站 {activeSpot.branch && <span><GitBranch aria-hidden="true" />选走支线</span>}</div>
            <h3>{activeSpot.name}</h3>
            <p className="spot-summary">{activeSpot.summary}</p>
            <p>{activeSpot.detail}</p>
            <dl className="spot-meta">
              <div><dt><Footprints aria-hidden="true" />怎么过去</dt><dd>{activeSpot.transfer}</dd></div>
              <div><dt><Clock3 aria-hidden="true" />停留建议</dt><dd>{activeSpot.duration}</dd></div>
            </dl>
          </div>
        </div>
      </div>
      <ol className="route-steps" aria-label="游览路线步骤">
        {destination.spots.map((spot) => (
          <li key={spot.id} className={spot.id === activeSpot.id ? 'is-active' : ''}>
            <button type="button" onClick={() => selectSpot(spot.id)}>
              <span>{spot.order}</span><span><strong>{spot.name}</strong><small>{spot.duration}</small></span><MapPin aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
