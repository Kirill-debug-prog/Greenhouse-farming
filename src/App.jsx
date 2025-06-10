import { use, useState } from 'react'
import './App.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Fotter'
import Agronomist_home from './pages/Agronomist_home'
import Technologist_home from './pages/Technologist_home'
import SpecificCulture from './pages/Specific_culture'
import Specific_crop_agronomist from './pages/Specific_crop_agronomist'
import { Routes, Route, Navigate, Router } from 'react-router-dom'
import ScrollToTop from './Components/ScrollToTop/ScrollToTop'
import PlanCalendar from './pages/Plan_calendar'
import Login from './pages/Login'
import '@fontsource/roboto'
import '@fontsource/inter'
import '@fontsource/poppins'
import { useEffect } from 'react'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')

    if (token && role) {
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  if (!isAuthenticated) {
    return <Login onLoginSuccess={(role) => {
      setIsAuthenticated(true)
      setUserRole(role)
    }} />
  }

  return (
    <>
    <ScrollToTop />
    <Header />
      {/* Навигация по ролям */}
      <Routes>
        <Route path="login" element={
          userRole === 'Главный агроном' ? <Navigate to="/agronom-home" /> :
          userRole === 'Технолог' ? <Navigate to="/technologist-home" /> :
          <Navigate to="/" />
        } />

        {/* Страницы агронома */}
        <Route path="/agronom-home" element={<Agronomist_home />} />
        <Route path="/culture/:id" element={<SpecificCulture />} />
        <Route path="/culture/:id/calendar" element={<PlanCalendar />} />

        {/* Страицы технолога */}
        <Route path="/technologist-home" element={<Technologist_home />} />
        <Route path="/culture-agronom/:id" element={<Specific_crop_agronomist />} />
      </Routes>
      <Footer />
    </>
  )
}


export default App
