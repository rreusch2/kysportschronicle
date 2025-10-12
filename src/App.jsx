import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ArticleEditor from './pages/ArticleEditor'
import AdminInbox from './pages/AdminInbox'
import ProtectedRoute from './components/ProtectedRoute'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/article/:slug" element={<PageTransition><ArticlePage /></PageTransition>} />
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route 
          path="/admin/dashboard" 
          element={
            <PageTransition>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
        <Route 
          path="/admin/article/:id" 
          element={
            <PageTransition>
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
        <Route 
          path="/admin/inbox" 
          element={
            <PageTransition>
              <ProtectedRoute>
                <AdminInbox />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
