import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { AppStateProvider } from './state/AppState'
import { UnifiedHeader } from './components/UnifiedHeader'
import { TestHubPage } from './pages/TestHubPage'
import { BlueTestApp } from './components/blue-test/BlueTestApp'
import { TeacherTestsPage } from './pages/teacher/TeacherTestsPage'
import { TeacherTestSetupPage } from './pages/teacher/TeacherTestSetupPage'
import { TeacherTestRunPage } from './pages/teacher/TeacherTestRunPage'
import { TeacherTestAnalysisPage } from './pages/teacher/TeacherTestAnalysisPage'
import { TeacherLearnerTestResultsPage } from './pages/teacher/TeacherLearnerTestResultsPage'

function UnifiedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <UnifiedHeader />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            {/* Live Test Room - Focus Mode (full screen without header) */}
            <Route path="/teacher/test-runs/:runId" element={<TeacherTestRunPage />} />
            <Route path="/test-runs/:runId" element={<TeacherTestRunPage />} />

            {/* Blue Test Suite (has its own sidebar & controls) */}
            <Route
              path="/blue/*"
              element={
                <UnifiedLayout>
                  <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
                    <BlueTestApp />
                  </div>
                </UnifiedLayout>
              }
            />

            {/* Hub & Standard Pages */}
            <Route
              path="/"
              element={
                <UnifiedLayout>
                  <TestHubPage />
                </UnifiedLayout>
              }
            />

            {/* Red & Green 1-1 Tests Management */}
            <Route
              path="/teacher/tests"
              element={
                <UnifiedLayout>
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <TeacherTestsPage />
                  </div>
                </UnifiedLayout>
              }
            />

            <Route
              path="/teacher/tests/:assignmentId/sections/:sectionId/setup"
              element={
                <UnifiedLayout>
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <TeacherTestSetupPage />
                  </div>
                </UnifiedLayout>
              }
            />

            <Route
              path="/teacher/tests/analysis/:assignmentId"
              element={
                <UnifiedLayout>
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <TeacherTestAnalysisPage />
                  </div>
                </UnifiedLayout>
              }
            />

            <Route
              path="/teacher/learner/:learnerId/tests"
              element={
                <UnifiedLayout>
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <TeacherLearnerTestResultsPage />
                  </div>
                </UnifiedLayout>
              }
            />

            {/* Shorthand / Alternative aliases for intuitive routing */}
            <Route path="/tests" element={<Navigate to="/teacher/tests" replace />} />
            <Route path="/tests/analysis/:assignmentId" element={<Navigate to="/teacher/tests/analysis/:assignmentId" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </AuthProvider>
  )
}
