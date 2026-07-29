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

function AnalysisResultPanel({ analysis }) {
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

      <TextSection title="종합 의견">{analysis.summary}</TextSection>
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
