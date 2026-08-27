import { ArrowUpRight, Check, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Destination } from '../types/tourism'

interface ComparisonTableProps {
  destinations: Destination[]
}

export function ComparisonTable({ destinations }: ComparisonTableProps) {
  return (
    <section className="comparison-section" id="compare" aria-labelledby="comparison-title">
      <div className="section-heading">
        <div><p className="section-kicker">按行程条件选择</p><h2 id="comparison-title">三地怎么选</h2></div>
        <p>差异不是高低评价，而是帮你找到更适合自己的参观方式。</p>
      </div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead><tr><th scope="col">目的地</th><th scope="col">建议用时</th><th scope="col">强度</th><th scope="col">主要环境</th><th scope="col">抵达便利</th><th scope="col">更适合</th><th scope="col"><span className="sr-only">查看详情</span></th></tr></thead>
          <tbody>
            {destinations.map((destination) => (
              <tr key={destination.id}>
                <th scope="row"><span>{destination.shortName}</span><small>{destination.theme}</small></th>
                <td>{destination.duration}</td><td><span className={`intensity intensity--${destination.intensity}`}>{destination.intensity}</span></td>
                <td>{destination.environment}</td>
                <td><span className="score" aria-label={`便利程度 ${destination.transitScore} 星（满分 5 星）`}>{[1,2,3,4,5].map((score) => score <= destination.transitScore ? <Check className="score__filled" key={score} aria-hidden="true" /> : <Minus className="score__empty" key={score} aria-hidden="true" />)}</span><small>{destination.transitLabel}</small></td>
                <td>{destination.bestFor}</td>
                <td><Link className="table-link" to={`/destination/${destination.id}`} aria-label={`查看${destination.name}详情`}><ArrowUpRight aria-hidden="true" /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
