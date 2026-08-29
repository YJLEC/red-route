import { Map, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { homeDestinations } from '../data/destinations'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand__mark"><Map aria-hidden="true" size={19} /></span>
          <span><strong>数忆红途</strong><small>河北红色旅游指南</small></span>
        </Link>
        <button
          className="icon-button menu-button"
          type="button"
          aria-label={open ? '关闭导航' : '打开导航'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav className={open ? 'site-nav is-open' : 'site-nav'} aria-label="主导航">
          <NavLink to="/" end onClick={() => setOpen(false)}>河北总览</NavLink>
          {homeDestinations.map((destination) => (
            <NavLink key={destination.id} to={`/destination/${destination.id}`} onClick={() => setOpen(false)}>
              {destination.shortName}
            </NavLink>
          ))}
          <NavLink to="/planner" onClick={() => setOpen(false)}>行程规划</NavLink>
        </nav>
      </div>
    </header>
  )
}
