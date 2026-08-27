import { ArrowRight, Clock3, MapPin, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Destination } from '../types/tourism'

interface DestinationSummaryProps {
  destination: Destination
}

export function DestinationSummary({ destination }: DestinationSummaryProps) {
  return (
    <article className="destination-summary" aria-live="polite">
      <div className="eyebrow"><MapPin aria-hidden="true" size={16} />{destination.city} · {destination.category}</div>
      <h2>{destination.name}</h2>
      <p className="summary-tagline">{destination.tagline}</p>
      <p>{destination.overview}</p>
      <dl className="quick-facts">
        <div><dt><Clock3 aria-hidden="true" />建议用时</dt><dd>{destination.duration}</dd></div>
        <div><dt><Route aria-hidden="true" />游览强度</dt><dd>{destination.intensity} · {destination.environment}</dd></div>
      </dl>
      <p className="best-for"><span>适合</span>{destination.bestFor}</p>
      <Link className="primary-action" to={`/destination/${destination.id}`}>
        查看路线与抵达方式<ArrowRight aria-hidden="true" size={18} />
      </Link>
    </article>
  )
}
