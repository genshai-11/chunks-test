import React, { useState, useEffect } from 'react'
import { Learner, TestMode } from './types/common'
import { StandaloneRun, TestSection } from './types/test-catalog'
import { fetchLearners, getTestPackage, loadSavedRuns, saveRunRecord } from './lib/test-data-service'
import { Header } from './components/common/Header'
import { TestLauncher } from './components/dashboard/TestLauncher'
import { RedRoom } from './components/red-room/RedRoom'
import { GreenRoom } from './components/green-room/GreenRoom'
import { BlueRoom } from './components/blue-room/BlueRoom'
import { ScorecardView } from './components/analytics/ScorecardView'

export default function App() {
  const [learners, setLearners] = useState<Learner[]>([])
  const [activeLearner, setActiveLearner] = useState<Learner | null>(null)
  const [currentMode, setCurrentMode] = useState<TestMode | null>(null)
  const [activeSections, setActiveSections] = useState<TestSection[]>([])
  const [runs, setRuns] = useState<StandaloneRun[]>([])
  const [activeScorecardRun, setActiveScorecardRun] = useState<StandaloneRun | null>(null)

  // Initialize learners & runs
  useEffect(() => {
    fetchLearners().then((data) => {
      setLearners(data)
      if (data.length > 0 && !activeLearner) {
        setActiveLearner(data[0])
      }
    })
    setRuns(loadSavedRuns())
  }, [])

  const handleStartTest = (mode: TestMode) => {
    const pkg = getTestPackage(mode)
    setActiveSections(pkg.sections)
    setCurrentMode(mode)
    setActiveScorecardRun(null)
  }

  const handleCompleteRun = (run: StandaloneRun) => {
    saveRunRecord(run)
    setRuns((prev) => [run, ...prev])
    setCurrentMode(null)
    setActiveScorecardRun(run)
  }

  const handleExitTest = () => {
    setCurrentMode(null)
    setActiveScorecardRun(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        learners={learners}
        activeLearner={activeLearner}
        onSelectLearner={(l) => {
          setActiveLearner(l)
          handleExitTest()
        }}
        currentMode={currentMode}
        onExitTest={handleExitTest}
      />

      <main className="flex-1">
        {/* Case 1: In Active Test Room */}
        {currentMode === 'red' && activeLearner && (
          <RedRoom
            learner={activeLearner}
            sections={activeSections}
            onComplete={handleCompleteRun}
            onExit={handleExitTest}
          />
        )}

        {currentMode === 'green' && activeLearner && (
          <GreenRoom
            learner={activeLearner}
            sections={activeSections}
            onComplete={handleCompleteRun}
            onExit={handleExitTest}
          />
        )}

        {currentMode === 'blue' && activeLearner && (
          <BlueRoom
            learner={activeLearner}
            sections={activeSections}
            onComplete={handleCompleteRun}
            onExit={handleExitTest}
          />
        )}

        {/* Case 2: In Scorecard View */}
        {!currentMode && activeScorecardRun && activeLearner && (
          <ScorecardView
            learner={activeLearner}
            run={activeScorecardRun}
            onBackToLauncher={handleExitTest}
          />
        )}

        {/* Case 3: In Test Launcher Dashboard */}
        {!currentMode && !activeScorecardRun && activeLearner && (
          <TestLauncher
            activeLearner={activeLearner}
            onStartTest={handleStartTest}
            onViewReport={(run) => setActiveScorecardRun(run)}
            runs={runs}
          />
        )}
      </main>
    </div>
  )
}
