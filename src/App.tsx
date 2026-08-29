import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { getDestination } from './data/destinations'
import { DestinationPage } from './pages/DestinationPage'
import { HomePage } from './pages/HomePage'
import { PlannerPage } from './pages/PlannerPage'

function PageTitle() {
  const location = useLocation()
  useEffect(() => {
    const id = location.pathname.split('/').filter(Boolean).at(-1)
    const destination = getDestination(id)
    document.title = location.pathname === '/planner'
      ? '四地对比与行程规划 | 数忆红途'
      : destination
      ? `${destination.name}游览指南 | 数忆红途`
      : '数忆红途 | 河北红色旅游指南'
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTitle />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/destination/:destinationId" element={<DestinationPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  )
}
