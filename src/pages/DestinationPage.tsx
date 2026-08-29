import { ArrowLeft, Clock3, Gauge, MapPin, Navigation, Route, Users } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { MediaCarousel } from '../components/MediaCarousel'
import { OpeningHoursPanel } from '../components/OpeningHoursPanel'
import { RouteExplorer } from '../components/RouteExplorer'
import { SourceList } from '../components/SourceList'
import { TravelInformation } from '../components/TravelInformation'
import { getDestination } from '../data/destinations'

export function DestinationPage() {
  const { destinationId } = useParams()
  const destination = getDestination(destinationId)
  if (!destination) return <Navigate to="/" replace />

  return (
    <main>
      <section className="destination-intro page-width">
        <Link className="back-link" to="/"><ArrowLeft aria-hidden="true" />返回河北总览</Link>
        <div className="destination-intro__grid">
          <div className="destination-intro__copy">
            <p className="eyebrow"><MapPin aria-hidden="true" />{destination.city} · {destination.category}</p>
            <h1>{destination.name}</h1><p className="destination-lead">{destination.tagline}</p><p>{destination.overview}</p>
            <dl className="intro-facts">
              <div><dt><Clock3 aria-hidden="true" />建议用时</dt><dd>{destination.duration}</dd></div>
              <div><dt><Gauge aria-hidden="true" />游览强度</dt><dd>{destination.intensity}</dd></div>
              <div><dt><Navigation aria-hidden="true" />主要抵达</dt><dd>{destination.transitLabel}</dd></div>
              <div><dt><Users aria-hidden="true" />适合人群</dt><dd>{destination.bestFor}</dd></div>
            </dl>
            <Link className="planner-entry" to={`/planner?places=${destination.id}`}>
              <Route aria-hidden="true" />加入四地对比与串联行程
            </Link>
          </div>
          <MediaCarousel items={destination.gallery} />
        </div>
      </section>
      <OpeningHoursPanel destinationName={destination.name} opening={destination.opening} />
      <RouteExplorer key={destination.id} destination={destination} />
      <TravelInformation destination={destination} />
      <SourceList destination={destination} />
    </main>
  )
}
