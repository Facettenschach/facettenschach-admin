import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Start from './pages/Start'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
