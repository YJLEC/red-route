import { ExternalLink, ShieldCheck } from 'lucide-react'
import type { Destination } from '../types/tourism'

interface SourceListProps {
  destination: Destination
}

export function SourceList({ destination }: SourceListProps) {
  return (
    <section className="source-section page-width" aria-labelledby="source-title">
      <div className="source-intro"><ShieldCheck aria-hidden="true" /><div><h2 id="source-title">信息来源与核验</h2><p>路线用于游览规划，开放、交通与现场管理信息可能变化。出发前请以官方最新发布为准。</p></div></div>
      <ul className="source-list">
        {destination.sources.map((source, index) => (
          <li key={`${source.title}-${index}`}><div><strong>{source.title}</strong><span>{source.publisher} · 核验于 {source.verifiedAt}</span></div><a href={source.url} target="_blank" rel="noreferrer" aria-label={`打开来源：${source.title}`}><ExternalLink aria-hidden="true" /></a></li>
        ))}
      </ul>
    </section>
  )
}
