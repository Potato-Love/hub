import { useEffect, useState } from 'react'
import KakaoRouteMap from './KakaoRouteMap'

function TextSection({ title, children }) {
  if (!children) {
    return null
  }

  return (
    <section className="analysis-card">
      <h3>{title}</h3>
      <p>{children}</p>
    </section>
  )
}

function ListSection({ items, title }) {
  if (!items?.length) {
    return null
  }

  return (
    <section className="analysis-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

function DetailGroup({ items, title }) {
  const visibleItems = items.filter((item) => item.content)
  if (!visibleItems.length) {
    return null
  }

  return (
    <section className="analysis-card analysis-detail-group">
      <h3>{title}</h3>
      <div className="analysis-detail-list">
        {visibleItems.map((item) => (
          <div key={item.title}>
            <h4>{item.title}</h4>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function TravelContextSection({ travelContext }) {
  const [selectedMode, setSelectedMode] = useState('')
  const firstMode = travelContext?.routes?.[0]?.mode || ''
  const selectedRoute = travelContext?.routes?.find((route) => route.mode === selectedMode)
    || travelContext?.routes?.[0]

  useEffect(() => {
    setSelectedMode(firstMode)
  }, [firstMode])

  if (!travelContext) {
    return null
  }

  if (travelContext.status === 'unavailable') {
    return (
      <section className="analysis-card">
        <h3>지도 기반 통학 계산</h3>
        <p>{travelContext.reason}</p>
      </section>
    )
  }

  return (
    <section className="analysis-card analysis-detail-group">
      <h3>지도 기반 통학 계산</h3>
      <div className="route-mode-tabs" role="tablist" aria-label="통학 방법 선택">
        {travelContext.routes?.map((route) => (
          <button
            aria-selected={selectedRoute?.mode === route.mode}
            className={selectedRoute?.mode === route.mode ? 'route-mode-tab selected' : 'route-mode-tab'}
            key={route.mode}
            onClick={() => setSelectedMode(route.mode)}
            role="tab"
            type="button"
          >
            {route.mode}
          </button>
        ))}
      </div>
      <KakaoRouteMap route={selectedRoute} travelContext={travelContext} />
      {selectedRoute && (
        <div className="route-summary-card">
          <div>
            <span>소요 시간</span>
            <strong>약 {selectedRoute.durationMinutes}분</strong>
          </div>
          <div>
            <span>거리</span>
            <strong>{selectedRoute.distanceKm}km</strong>
          </div>
          <div>
            <span>편도 비용</span>
            <strong>
              {typeof selectedRoute.fareWon === 'number'
                ? `${selectedRoute.fareWon.toLocaleString()}원`
                : '확인 필요'}
            </strong>
          </div>
          <div>
            <span>환승</span>
            <strong>{selectedRoute.transfers ? `${selectedRoute.transfers}회` : '없음'}</strong>
          </div>
        </div>
      )}
      <div className="analysis-detail-list">
        {selectedRoute?.mode === '대중교통' && selectedRoute.steps?.length > 0 && (
          <div>
            <h4>대중교통 상세 경로</h4>
            <ol className="route-step-list">
              {selectedRoute.steps.map((step) => (
                <li key={step.id}>
                  <strong>{step.guidance || step.vehicles.join(', ') || step.type || '이동'}</strong>
                  <span>
                    약 {step.durationMinutes}분 · {step.distanceKm}km
                    {step.vehicles.length > 0 ? ` · ${step.vehicles.join(', ')}` : ''}
                  </span>
                  {step.stops.length > 0 && (
                    <small>
                      {step.stops.slice(0, 4).join(' → ')}
                      {step.stops.length > 4 ? ` 외 ${step.stops.length - 4}곳` : ''}
                    </small>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
        {selectedRoute?.mode === '대중교통' && travelContext.commuteCostEstimate && (
          <div>
            <h4>월 통학비 추정</h4>
            <p>
              약 {travelContext.commuteCostEstimate.monthlyEstimateWon.toLocaleString()}원 · {travelContext.commuteCostEstimate.basis}
            </p>
          </div>
        )}
      </div>
      {travelContext.warnings?.length > 0 && (
        <ul className="warning-list">
          {travelContext.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

function AnalysisResultPanel({ analysis, requestWarnings = [] }) {
  if (!analysis) {
    return null
  }

  return (
    <section className="analysis-result-panel" aria-labelledby="analysis-result-title">
      <div className="analysis-summary">
        <div>
          <p className="analysis-label">AI 분석 결과</p>
          <h2 id="analysis-result-title">{analysis.decision}</h2>
        </div>
        <strong>{analysis.overallScore}점</strong>
      </div>

      {requestWarnings.length > 0 && (
        <section className="analysis-card">
          <h3>정보 부족 안내</h3>
          <ul className="warning-list">
            {requestWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      )}

      <TextSection title="종합 의견">{analysis.summary}</TextSection>
      <TravelContextSection travelContext={analysis.travelContext} />
      <DetailGroup
        title="비용 판단"
        items={[
          { title: '가격 적정성', content: analysis.priceAnalysis || analysis.costAnalysis },
          { title: '관리비', content: analysis.maintenanceFeeAnalysis },
          { title: '교통비', content: analysis.transportationCostAnalysis },
        ]}
      />
      <DetailGroup
        title="생활과 이동"
        items={[
          { title: '통학', content: analysis.commuteAnalysis },
          { title: '생활 편의성', content: analysis.convenienceAnalysis },
          { title: '매물 신뢰도', content: analysis.reliabilityAnalysis },
        ]}
      />
      <ListSection title="용어 설명" items={analysis.termExplanations} />
      <ListSection title="주의할 점" items={analysis.risks} />
      <ListSection title="계약 전 체크리스트" items={analysis.checklist} />
      <ListSection title="추가 확인 질문" items={analysis.nextQuestions} />
    </section>
  )
}

export default AnalysisResultPanel
