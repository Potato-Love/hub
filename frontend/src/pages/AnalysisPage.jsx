import { useEffect, useRef } from 'react'
import AnalysisResultPanel from '../components/listing-upload/AnalysisResultPanel'
import { useListingAnalysis } from '../hooks/useListingAnalysis'

function AnalysisPage({ analysisRequest, onBackToUpload }) {
  const hasStarted = useRef(false)
  const {
    analysis,
    error,
    isAnalyzing,
    runAnalysis,
  } = useListingAnalysis()

  useEffect(() => {
    if (hasStarted.current || !analysisRequest) {
      return
    }

    hasStarted.current = true
    runAnalysis(analysisRequest)
  }, [analysisRequest, runAnalysis])

  if (!analysisRequest) {
    return (
      <main className="user-info-page">
        <section className="user-info-shell" aria-labelledby="page-title">
          <header className="app-header">
            <p className="brand-name">자취방 의사결정 도우미</p>
            <h1 id="page-title">AI 분석 결과</h1>
            <p className="page-description">
              분석할 매물 정보가 없어 요청을 시작하지 못했습니다.
            </p>
          </header>

          <section className="form-card">
            <div className="analysis-error-panel" role="alert">
              <h3>분석 요청 정보가 없습니다</h3>
              <p>매물 스크린샷 업로드 화면에서 매물 정보를 확인한 뒤 다시 분석해주세요.</p>
              <div className="button-row align-end">
                <button className="primary-button" type="button" onClick={onBackToUpload}>
                  매물 정보로 돌아가기
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
    )
  }

  return (
    <main className="user-info-page">
      <section className="user-info-shell" aria-labelledby="page-title">
        <header className="app-header">
          <p className="brand-name">자취방 의사결정 도우미</p>
          <h1 id="page-title">AI 분석 결과</h1>
          <p className="page-description">
            OCR 원문과 매물 정보를 사용자 조건과 함께 분석해 의사결정에 필요한 항목을 정리합니다.
          </p>
        </header>

        <section className="form-card" aria-labelledby="analysis-page-title">
          <div className="step-heading">
            <h2 id="analysis-page-title">{isAnalyzing ? 'AI가 매물을 분석하고 있습니다' : '분석 결과를 확인해주세요'}</h2>
            <p>
              {isAnalyzing
                ? '비용, 지도 기반 통학 시간, 매물 신뢰도, 계약 전 체크리스트를 구조화하고 있습니다.'
                : '결과는 참고용이며 계약 전에는 실제 매물과 계약 조건을 직접 확인해야 합니다.'}
            </p>
          </div>

          <section className="analysis-card analysis-request-summary" aria-labelledby="analysis-basis-title">
            <h3 id="analysis-basis-title">분석 기준</h3>
            <dl className="summary-list compact-summary-list">
              <div>
                <dt>학교/조건</dt>
                <dd>
                  {analysisRequest.userSummary.school} · {analysisRequest.userSummary.contractType} · {analysisRequest.userSummary.budget}
                </dd>
              </div>
              <div>
                <dt>통학 기준</dt>
                <dd>
                  {analysisRequest.userSummary.commuteDaysPerWeek} · {analysisRequest.userSummary.maxTravelTime}
                </dd>
              </div>
              <div>
                <dt>매물</dt>
                <dd>
                  {analysisRequest.listingSummary.address} · {analysisRequest.listingSummary.price}
                </dd>
              </div>
            </dl>
            {analysisRequest.warnings?.length > 0 && (
              <ul className="warning-list">
                {analysisRequest.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
          </section>

          {isAnalyzing && (
            <div className="analysis-loading-panel" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true" />
              <div>
                <h3>분석 중</h3>
                <p>잠시만 기다려주세요. OCR 텍스트와 입력한 조건을 함께 검토하고 있습니다.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="analysis-error-panel" role="alert">
              <h3>분석을 완료하지 못했습니다</h3>
              <p>{error}</p>
              <div className="button-row align-end">
                <button className="secondary-button" type="button" onClick={onBackToUpload}>
                  매물 정보로 돌아가기
                </button>
                <button className="primary-button" type="button" onClick={() => runAnalysis(analysisRequest)}>
                  다시 분석하기
                </button>
              </div>
            </div>
          )}

          <AnalysisResultPanel analysis={analysis} requestWarnings={analysisRequest.warnings} />

          {analysis && (
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={onBackToUpload}>
                매물 정보로 돌아가기
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default AnalysisPage
