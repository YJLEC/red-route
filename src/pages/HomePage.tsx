import { useState } from 'react'
import { DestinationSummary } from '../components/DestinationSummary'
import { HebeiMap } from '../components/HebeiMap'
import { destinations } from '../data/destinations'
import type { DestinationId } from '../types/tourism'

export function HomePage() {
  const [activeId, setActiveId] = useState<DestinationId>('hebei-museum')
  const activeDestination = destinations.find((item) => item.id === activeId) ?? destinations[0]

  return (
    <main>
      <div className="home-explorer page-width">
        <HebeiMap destinations={destinations} activeId={activeId} onSelect={setActiveId} />
        <aside className="home-summary"><DestinationSummary destination={activeDestination} /></aside>
      </div>
    </main>
  )
}
