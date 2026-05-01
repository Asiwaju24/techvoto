import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider }  from './context/AuthContext'
import ToastContainer    from './components/ToastContainer'
import { useToast }      from './hooks/useToast'

import HomePage          from './pages/HomePage'
import AboutPage         from './pages/AboutPage'
import LoginPage         from './pages/LoginPage'
import SignupPage        from './pages/SignupPage'
import CoursesPage       from './pages/CoursesPage'
import PricingPage       from './pages/PricingPage'
import BlogPage          from './pages/BlogPage'
import ContactPage       from './pages/ContactPage'
import LMSPage           from './pages/LMSPage'

import {
  MentorshipPage,
  CertificationsPage,
  LabsPage,
  CommunityPage,
  CareersPage,
  EnterprisePage,
} from './pages/OtherPages'

import { PrivacyPage, TermsPage } from './pages/LegalPages'

function AppInner() {
  const { toasts } = useToast()
  return (
    <>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/signup"         element={<SignupPage />} />
        <Route path="/courses"        element={<CoursesPage />} />
        <Route path="/pricing"        element={<PricingPage />} />
        <Route path="/blog"           element={<BlogPage />} />
        <Route path="/contact"        element={<ContactPage />} />
        <Route path="/lms"            element={<LMSPage />} />
        <Route path="/mentorship"     element={<MentorshipPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/labs"           element={<LabsPage />} />
        <Route path="/community"      element={<CommunityPage />} />
        <Route path="/careers"        element={<CareersPage />} />
        <Route path="/enterprise"     element={<EnterprisePage />} />
        <Route path="/privacy"        element={<PrivacyPage />} />
        <Route path="/terms"          element={<TermsPage />} />
        <Route path="*"               element={<HomePage />} />
      </Routes>
      <ToastContainer toasts={toasts} />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  )
}
