import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { getDestination } from './data/destinations'
import { DestinationPage } from './pages/DestinationPage'
import { HomePage } from './pages/HomePage'

function PageTitle() {
  const location = useLocation()
  useEffect(() => {
    const id = location.pathname.split('/').filter(Boolean).at(-1)
    const destination = getDestination(id)
    document.title = destination
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
        <Route path="*" element={<HomePage />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  )
}
