import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { restoreSession } from './store/authSlice'
import { useAppSelector, useAppDispatch } from './hooks/useAppDispatch'
import Login from './pages/Login'
import Start from './pages/Start'

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth)
  return user ? element : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute element={<Start />} />} />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App

