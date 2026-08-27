import { ArrowUp, CornerUpLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function SiteFooter() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer className="site-footer"><div className="page-width"><div><strong>数忆红途</strong><p>面向游客的河北红色旅游探索与出行指南</p></div>{isHome ? (
      <button type="button" className="footer-action" onClick={scrollToTop}><ArrowUp aria-hidden="true" />回到顶部</button>
    ) : (
      <Link className="footer-action" to="/"><CornerUpLeft aria-hidden="true" />返回河北总览</Link>
    )}<small>地图依据官方导览和公开地理资料重绘，不替代现场开放标识或实时导航。</small></div></footer>
  )
}
