import type { DestinationId } from './tourism'

export type PlannerMode = 'car' | 'public-transit'
export type PlannerPace = 'relaxed' | 'standard' | 'compact'
export type RequestedDays = 'auto' | 1 | 2 | 3
export type TravelBaseId = 'shijiazhuang' | 'baoding' | 'yixian'
export type ConnectionNodeId = DestinationId | TravelBaseId

export interface PlanningOpening {
  openWeekdays: number[]
  openMinute: number
  closeMinute: number
  lastEntryMinute: number
}

export interface PlanningPlace {
  id: DestinationId
  name: string
  opening: PlanningOpening
  visitMinutes: Record<PlannerPace, number>
  intensity: 1 | 2 | 3
  mealArea: string
  mealNote: string
  preferredStayBaseId: TravelBaseId
  preparations: string[]
  openingSource: {
    label: string
    url: string
  }
  comparison: {
    visitWindow: string
    transport: string
    booking: string
    fit: string
    limitation: string
  }
}

export interface PlanningConnection {
  from: ConnectionNodeId
  to: ConnectionNodeId
  mode: PlannerMode
  durationMinutes: [number, number]
  distanceKm?: [number, number]
  via: string[]
  constraints: string[]
  sourceLabel: string
  sourceUrl: string
  verifiedAt: string
  bidirectional?: boolean
  serviceWeekdays?: number[]
}

export interface TravelBase {
  id: TravelBaseId
  label: string
  stayReason: string
  mealStrategy: string
  coordinates: [number, number]
  sourceLabel: string
  sourceUrl: string
}

export interface PlanningDataset {
  places: PlanningPlace[]
  connections: PlanningConnection[]
  bases: TravelBase[]
}

export interface PlannerInput {
  selectedIds: DestinationId[]
  startDate: string
  startBaseId: TravelBaseId
  mode: PlannerMode
  requestedDays: RequestedDays
  pace: PlannerPace
}

export type ItineraryEventType = 'transit' | 'visit' | 'meal' | 'buffer' | 'stay'

export interface ItineraryEvent {
  id: string
  type: ItineraryEventType
  startMinute: number
  endMinute: number
  title: string
  detail: string
  placeId?: DestinationId
  sourceLabel?: string
  sourceUrl?: string
}

export interface ItineraryDay {
  dayNumber: number
  date: string
  startBaseId: TravelBaseId
  overnightBaseId?: TravelBaseId
  placeIds: DestinationId[]
  events: ItineraryEvent[]
  visitMinutes: number
  transitMinutes: number
  bufferMinutes: number
  totalMinutes: number
  preparations: string[]
}

export interface ItineraryOption {
  id: string
  label: string
  days: ItineraryDay[]
  placeOrder: DestinationId[]
  visitMinutes: number
  transitMinutes: number
  bufferMinutes: number
  totalMinutes: number
  warnings: string[]
  score: number
}

export interface PlannerResult {
  status: 'ready' | 'needs-change'
  primary?: ItineraryOption
  alternative?: ItineraryOption
  issues: string[]
}
