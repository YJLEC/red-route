export type DestinationId = 'hebei-museum' | 'xibaipo' | 'langya-mountain'

export type MapStyle = 'floor' | 'campus' | 'mountain'

export type ArrivalMode = '公共交通' | '自驾' | '换乘提示'

export type TravelMode = 'walk' | 'metro' | 'bus' | 'car'

export interface GalleryItem {
  id: string
  label: string
  caption: string
  alt: string
  src?: string
  credit?: string
}

export interface MapFeature {
  id: string
  label: string
  type: 'entrance' | 'service' | 'parking' | 'station' | 'landmark' | 'water' | 'summit'
  x: number
  y: number
}

export interface TravelMapNode {
  id: string
  label: string
  detail: string
  x: number
  y: number
  primary?: boolean
}

export interface TravelMapLine {
  id: string
  label: string
  path: string
  mode: TravelMode
  caution?: string
}

export interface TravelMap {
  title: string
  scope: string
  sourceNote: string
  sourceLabel: string
  sourceUrl: string
  nodes: TravelMapNode[]
  lines: TravelMapLine[]
}

export interface RouteSpot {
  id: string
  order: number
  name: string
  summary: string
  detail: string
  transfer: string
  duration: string
  mode?: TravelMode
  x: number
  y: number
  branch?: boolean
  gallery?: GalleryItem[]
}

export interface ArrivalOption {
  mode: ArrivalMode
  title: string
  detail: string
  caution?: string
  sourceLabel: string
  sourceUrl: string
  verifiedAt: string
}

export interface SourceRecord {
  title: string
  publisher: string
  url: string
  verifiedAt: string
}

export interface Destination {
  id: DestinationId
  name: string
  shortName: string
  city: string
  category: string
  theme: string
  tagline: string
  overview: string
  coordinates: [number, number]
  duration: string
  intensity: string
  environment: string
  transitLabel: string
  transitScore: number
  bestFor: string
  mapStyle: MapStyle
  routeTitle: string
  routeNote: string
  guideMapSource: {
    label: string
    url: string
  }
  mapFeatures: MapFeature[]
  travelMap: TravelMap
  gallery: GalleryItem[]
  spots: RouteSpot[]
  arrivals: ArrivalOption[]
  preparations: string[]
  advisory: string
  officialUrl: string
  navigationUrl: string
  sources: SourceRecord[]
  verifiedAt: string
}
