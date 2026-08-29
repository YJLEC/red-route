import { geoMercator, geoPath } from 'd3-geo'
import { AlertCircle, ArrowUpRight, Clock3, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Destination, DestinationId } from '../types/tourism'
import { MediaCarousel } from './MediaCarousel'

interface GeometryObject {
  type: string
  coordinates?: unknown
  geometries?: GeometryObject[]
}

interface GeoFeature {
  type: 'Feature'
  properties?: { name?: string }
  geometry: GeometryObject
}

interface GeoCollection {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

function rewindGeometry(geometry: GeometryObject): GeometryObject {
  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates as number[][][]
    return { ...geometry, coordinates: rings.map((ring) => [...ring].reverse()) }
  }
  if (geometry.type === 'MultiPolygon') {
    const polygons = geometry.coordinates as number[][][][]
    return {
      ...geometry,
      coordinates: polygons.map((polygon) => polygon.map((ring) => [...ring].reverse())),
    }
  }
  return geometry
}

function normalizeGeoData(data: GeoCollection): GeoCollection {
  return {
    ...data,
    features: data.features.map((feature) => ({
      ...feature,
      geometry: rewindGeometry(feature.geometry),
    })),
  }
}

interface HebeiMapProps {
  destinations: Destination[]
  activeId: DestinationId
  onSelect: (id: DestinationId) => void
}

const width = 760
const height = 620

export function HebeiMap({ destinations, activeId, onSelect }: HebeiMapProps) {
  const [geoData, setGeoData] = useState<GeoCollection | null>(null)
  const [failed, setFailed] = useState(false)
  const [focusState, setFocusState] = useState<{ id: DestinationId; tick: number } | null>(null)

  useEffect(() => {
    let active = true
    fetch('/data/hebei.geojson')
      .then((response) => {
        if (!response.ok) throw new Error('地图数据加载失败')
        return response.json() as Promise<GeoCollection>
      })
      .then((data) => { if (active) setGeoData(normalizeGeoData(data)) })
      .catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [])

  const drawing = useMemo(() => {
    if (!geoData) return null
    const projection = geoMercator().fitExtent([[35, 30], [width - 35, height - 30]], geoData as never)
    const path = geoPath(projection)
    return {
      projection,
      paths: geoData.features.map((feature) => ({
        name: feature.properties?.name ?? '河北地市',
        d: path(feature as never) ?? '',
      })),
    }
  }, [geoData])

  const focusedDestination = focusState
    ? destinations.find((destination) => destination.id === focusState.id) ?? destinations[0]
    : null
  const focusedPoint = focusedDestination ? drawing?.projection(focusedDestination.coordinates) : null

  function selectDestination(id: DestinationId) {
    setFocusState((current) => ({ id, tick: (current?.tick ?? 0) + 1 }))
    onSelect(id)
  }

  return (
    <section className="map-shell" aria-label="河北目的地地图">
      <div className="map-heading">
        <div><p className="section-kicker">从位置开始规划</p><h1>河北红色旅游地图</h1></div>
        <span className="map-note">地市边界与目的地坐标数据 · 点击标记聚焦</span>
      </div>
      <div className={focusState ? 'map-stage is-focused' : 'map-stage'} onClick={() => setFocusState(null)}>
        {!drawing && !failed && <div className="map-status"><LoaderCircle className="spin" aria-hidden="true" />地图载入中</div>}
        {failed && <div className="map-status map-status--error"><AlertCircle aria-hidden="true" />地图暂时无法载入，请使用下方目的地列表。</div>}
        {drawing && (
          <div
            className={focusState ? 'map-focus-layer is-focused' : 'map-focus-layer'}
            style={{ transformOrigin: focusedPoint ? `${(focusedPoint[0] / width) * 100}% ${(focusedPoint[1] / height) * 100}%` : '50% 50%' }}
          >
            <svg className="hebei-map" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="河北省地级市轮廓和四个目的地的位置关系">
              <g className="prefecture-layer">
                {drawing.paths.map(({ name, d }) => <path key={name} className={focusedDestination && name.includes(focusedDestination.city.slice(0, 3)) ? 'is-related' : ''} d={d}><title>{name}</title></path>)}
              </g>
            </svg>
            {destinations.map((destination) => {
              const point = drawing.projection(destination.coordinates)
              if (!point) return null
              return (
                <button
                  key={destination.id}
                  type="button"
                  className={destination.id === activeId ? 'map-marker is-active' : 'map-marker'}
                  style={{ left: `${(point[0] / width) * 100}%`, top: `${(point[1] / height) * 100}%` }}
                  aria-pressed={destination.id === activeId}
                  onClick={(event) => { event.stopPropagation(); selectDestination(destination.id) }}
                >
                  <span className="map-marker__dot" aria-hidden="true" />
                  <span className="map-marker__label">{destination.shortName}<small>{destination.city}</small></span>
                </button>
              )
            })}
          </div>
        )}
        {drawing && focusedPoint && focusedDestination && focusState && (
          <article
            key={`${focusState.id}-${focusState.tick}`}
            className={(focusedPoint[0] / width) < 0.55 ? 'map-popup map-popup--right' : 'map-popup map-popup--left'}
            style={{ left: `${(focusedPoint[0] / width) * 100}%`, top: `${Math.min(72, Math.max(28, (focusedPoint[1] / height) * 100))}%` }}
            onClick={(event) => event.stopPropagation()}
          >
            <MediaCarousel items={focusedDestination.gallery} compact />
            <div className="map-popup__body">
              <span>{focusedDestination.city} · {focusedDestination.category}</span>
              <h2>{focusedDestination.shortName}</h2>
              <p>{focusedDestination.tagline}</p>
              <div><Clock3 aria-hidden="true" />{focusedDestination.duration} · 强度{focusedDestination.intensity}</div>
              <Link to={`/destination/${focusedDestination.id}`} aria-label={`查看${focusedDestination.name}导览`}><ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </article>
        )}
      </div>
      <div className="map-fallback" aria-label="选择目的地">
        {destinations.map((destination) => (
          <button key={destination.id} className={destination.id === activeId ? 'is-active' : ''} type="button" onClick={() => selectDestination(destination.id)}>
            <span>{destination.shortName}</span><small>{destination.duration} · 强度{destination.intensity}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
