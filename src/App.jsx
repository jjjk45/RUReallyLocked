import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import GoalSelect from './pages/GoalSelect'
import CollateralSelect from './pages/CollateralSelect'
import Matching from './pages/Matching'
import Dashboard from './pages/Dashboard'
import CollateralOwed from './pages/CollateralOwed'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/goal" element={<GoalSelect />} />
        <Route path="/collateral" element={<CollateralSelect />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collateral-owed" element={<CollateralOwed />} />
      </Routes>
    </BrowserRouter>
  )
}
