import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import LearnPage from './pages/LearnPage'
import SpellingPage from './pages/SpellingPage'
import AISentencePage from './pages/AISentencePage'
import AIChatPage from './pages/AIChatPage'
import AIHubPage from './pages/AIHubPage'
import AIWordAnalysisPage from './pages/AIWordAnalysisPage'
import AIReportPage from './pages/AIReportPage'
import AIQuizPage from './pages/AIQuizPage'
import AIPronunciationPage from './pages/AIPronunciationPage'
import AIEssayPage from './pages/AIEssayPage'

const authRoutes = ['/login', '/register', '/forgot-password'];

function AppContent() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      ) : (
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
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/spelling" element={<SpellingPage />} />
            <Route path="/ai/sentence" element={<AISentencePage />} />
            <Route path="/ai/chat" element={<AIChatPage />} />
            <Route path="/ai" element={<AIHubPage />} />
            <Route path="/ai/analysis" element={<AIWordAnalysisPage />} />
            <Route path="/ai/report" element={<AIReportPage />} />
            <Route path="/ai/quiz" element={<AIQuizPage />} />
            <Route path="/ai/pronunciation" element={<AIPronunciationPage />} />
            <Route path="/ai/essay" element={<AIEssayPage />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <Router>
        <AppContent />
      </Router>
    </GameProvider>
  )
}

export default App
