import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { destinations } from '../data/destinations'
import type { DestinationId } from '../types/tourism'

interface PlannerGeographyMapProps {
  selectedIds: DestinationId[]
  order: DestinationId[]
}

interface OsrmRouteResponse {
  routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>
}

function markerElement(name: string, number: number, selected: boolean) {
  const wrapper = document.createElement('span')
  wrapper.className = selected ? 'leaflet-place-marker is-selected' : 'leaflet-place-marker'
  const badge = document.createElement('b')
  badge.textContent = number > 0 ? String(number) : '•'
  const label = document.createElement('small')
  label.textContent = name
  wrapper.append(badge, label)
  return wrapper
}

function popupElement(id: DestinationId, name: string, city: string) {
  const wrapper = document.createElement('div')
  wrapper.className = 'leaflet-place-popup'
  const title = document.createElement('strong')
  title.textContent = name
  const location = document.createElement('span')
  location.textContent = city
  const link = document.createElement('a')
  link.href = `/destination/${id}`
  link.textContent = '查看完整指南'
  wrapper.append(title, location, link)
  return wrapper
}

export function PlannerGeographyMap({ selectedIds, order }: PlannerGeographyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tileState, setTileState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [roadState, setRoadState] = useState<'loading' | 'ready' | 'fallback'>('loading')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const controller = new AbortController()
    const map = L.map(container, { zoomControl: true, minZoom: 6, maxZoom: 15 }).setView([38.72, 114.86], 8)
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors, Tiles style by HOT',
      maxZoom: 19,
      crossOrigin: true,
    })
    let tileFailures = 0
    let hasLoadedTile = false
    tiles.on('tileload', () => {
      hasLoadedTile = true
      setTileState('ready')
    })
    tiles.on('tileerror', () => {
      tileFailures += 1
      if (tileFailures >= 4 && !hasLoadedTile) setTileState('error')
    })
    tiles.addTo(map)

    const selected = new Set(selectedIds)
    const markerBounds: L.LatLngExpression[] = []
    destinations.forEach((destination) => {
      const [lon, lat] = destination.coordinates
      const number = order.indexOf(destination.id) + 1
      const isSelected = selected.has(destination.id)
      const icon = L.divIcon({
        className: 'leaflet-place-icon',
        html: markerElement(destination.shortName, number, isSelected),
        iconSize: [140, 34],
        iconAnchor: [17, 17],
      })
      L.marker([lat, lon], { icon, keyboard: true, title: destination.name, riseOnHover: true })
        .bindPopup(popupElement(destination.id, destination.name, destination.city), { closeButton: true })
        .addTo(map)
      if (isSelected) markerBounds.push([lat, lon])
    })
    if (markerBounds.length > 1) map.fitBounds(L.latLngBounds(markerBounds), { padding: [45, 45], maxZoom: 9 })

    const routeLayer = L.layerGroup().addTo(map)
    const orderedPlaces = order.map((id) => destinations.find((item) => item.id === id)).filter(Boolean)
    async function drawRoadRoutes() {
      if (orderedPlaces.length < 2) {
        setRoadState('ready')
        return
      }
      try {
        const segments = await Promise.all(orderedPlaces.slice(1).map(async (destination, index) => {
          const before = orderedPlaces[index]
          if (!before || !destination) return []
          const url = `https://router.project-osrm.org/route/v1/driving/${before.coordinates.join(',')};${destination.coordinates.join(',')}?overview=full&geometries=geojson`
          const response = await fetch(url, { signal: controller.signal })
          if (!response.ok) throw new Error('道路轨迹加载失败')
          const data = await response.json() as OsrmRouteResponse
          return data.routes?.[0]?.geometry?.coordinates ?? []
        }))
        segments.forEach((coordinates) => {
          L.polyline(coordinates.map(([lon, lat]) => [lat, lon] as L.LatLngTuple), { color: '#a8242b', weight: 4, opacity: 0.82 }).addTo(routeLayer)
        })
        setRoadState('ready')
      } catch {
        if (controller.signal.aborted) return
        const fallbackPoints = orderedPlaces.map((destination) => [destination!.coordinates[1], destination!.coordinates[0]] as L.LatLngTuple)
        L.polyline(fallbackPoints, { color: '#a8242b', weight: 3, opacity: 0.68, dashArray: '8 8' }).addTo(routeLayer)
        setRoadState('fallback')
      }
    }
    void drawRoadRoutes()

    return () => {
      controller.abort()
      map.remove()
    }
  }, [order, selectedIds])

  return (
    <div className="planner-map" aria-label="四地真实地理与道路关系图">
      <div ref={containerRef} className="planner-map__leaflet" data-tile-state={tileState} />
      {tileState === 'loading' && <div className="planner-map__status">真实地图载入中…</div>}
      {tileState === 'error' && <div className="planner-map__status is-error">地图瓦片暂时无法载入，请检查网络后重试。</div>}
      <div className="planner-map__legend">
        <span>{roadState === 'ready' ? '红线沿真实道路关系显示' : roadState === 'fallback' ? '道路服务暂不可用，虚线仅表示访问顺序' : '正在计算道路关系…'}</span>
        <a href="https://www.openstreetmap.org/#map=8/38.72/114.86" target="_blank" rel="noreferrer">在 OpenStreetMap 查看</a>
      </div>
    </div>
  )
}
