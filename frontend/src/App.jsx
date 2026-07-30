import { useState } from 'react'
import AnalysisPage from './pages/AnalysisPage'
import HomePage from './pages/HomePage'
import ListingUploadPage from './pages/ListingUploadPage'
import UserInfoPage from './pages/UserInfoPage'
import { findSavedAnalysis, loadSavedAnalyses, saveAnalysisResult } from './utils/savedAnalysisStorage'
import './App.css'

function App() {
  const [savedItems, setSavedItems] = useState(() => loadSavedAnalyses())
  const [currentPage, setCurrentPage] = useState(() => (savedItems.length ? 'home' : 'user-info'))
  const [analysisRequest, setAnalysisRequest] = useState(null)
  const [selectedSavedId, setSelectedSavedId] = useState('')

  function goToAnalysis(nextAnalysisRequest) {
    setAnalysisRequest(nextAnalysisRequest)
    setCurrentPage('analysis')
  }

  function goToUpload() {
    setCurrentPage('upload')
  }

  function goToHome() {
    setSavedItems(loadSavedAnalyses())
    setCurrentPage('home')
  }

  function goToUserInfo() {
    setCurrentPage('user-info')
  }

  function saveCurrentAnalysis(savePayload) {
    const savedItem = saveAnalysisResult(savePayload)
    setSavedItems(loadSavedAnalyses())
    setSelectedSavedId(savedItem.id)
    setCurrentPage('home')
  }

  function openSavedAnalysis(id) {
    setSelectedSavedId(id)
    setCurrentPage('saved-detail')
  }

  function handleCompare() {
    window.alert('매물 비교 기능은 준비 중입니다.')
  }

  if (currentPage === 'home') {
    return (
      <HomePage
        onAddListing={goToUpload}
        onCompare={handleCompare}
        onEditUserInfo={goToUserInfo}
        onOpenSavedAnalysis={openSavedAnalysis}
        savedItems={savedItems}
      />
    )
  }

  if (currentPage === 'saved-detail') {
    const savedItem = savedItems.find((item) => item.id === selectedSavedId) || findSavedAnalysis(selectedSavedId)
    if (!savedItem) {
      return (
        <HomePage
          onAddListing={goToUpload}
          onCompare={handleCompare}
          onEditUserInfo={goToUserInfo}
          onOpenSavedAnalysis={openSavedAnalysis}
          savedItems={savedItems}
        />
      )
    }

    return (
      <AnalysisPage
        analysisRequest={savedItem.analysisRequest}
        initialAnalysis={savedItem.analysis}
        initialSelectedRouteMode={savedItem.selectedRouteMode}
        initialSelectedRouteKey={savedItem.selectedRouteKey}
        isSavedDetail
        onBackToHome={goToHome}
        onBackToUpload={goToUpload}
      />
    )
  }

  if (currentPage === 'analysis') {
    return (
      <AnalysisPage
        analysisRequest={analysisRequest}
        onBackToUpload={goToUpload}
        onSaveAnalysis={saveCurrentAnalysis}
      />
    )
  }

  if (currentPage === 'upload') {
    return <ListingUploadPage onAnalyze={goToAnalysis} onBack={() => setCurrentPage('user-info')} />
  }

  return <UserInfoPage onComplete={() => setCurrentPage('upload')} />
}

export default App
