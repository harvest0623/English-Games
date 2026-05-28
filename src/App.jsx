import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import BattlePage from './pages/BattlePage'
import CardsPage from './pages/CardsPage'
import ProfilePage from './pages/ProfilePage'
import ShopPage from './pages/ShopPage'
import WordBookPage from './pages/WordBookPage'
import StatsPage from './pages/StatsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import SkillsPage from './pages/SkillsPage'
import PetsPage from './pages/PetsPage'
import EquipmentPage from './pages/EquipmentPage'
import CategoriesPage from './pages/CategoriesPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

function App() {
  return (
    <GameProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/battle" element={<BattlePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/wordbook" element={<WordBookPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </Layout>
      </Router>
    </GameProvider>
  )
}

export default App
