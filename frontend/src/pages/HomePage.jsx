import SavedListingsMap from '../components/home/SavedListingsMap'

function formatSavedAt(value) {
  if (!value) {
    return '저장 시각 확인 필요'
  }

  return new Date(value).toLocaleString('ko-KR')
}

function getListingTitle(item, index) {
  return item.analysisRequest?.listingInfo?.fields?.address
    || item.analysisRequest?.listingSummary?.address
    || `저장 매물 ${index + 1}`
}

function getListingPrice(item) {
  const fields = item.analysisRequest?.listingInfo?.fields || {}
  return [
    fields.deposit ? `보증금 ${fields.deposit}` : '',
    fields.monthlyRent ? `월세 ${fields.monthlyRent}` : '',
    fields.maintenanceFee ? `관리비 ${fields.maintenanceFee}` : '',
  ].filter(Boolean).join(' / ') || '가격 정보 확인 필요'
}

function hasMapLocation(item) {
  const location = item.analysis?.travelContext?.listingLocation
  return Number.isFinite(Number(location?.x)) && Number.isFinite(Number(location?.y))
}

function SavedListingItem({ index, item, onOpen }) {
  const decision = item.analysis?.decision || '판단 확인 필요'
  const score = typeof item.analysis?.overallScore === 'number' ? `${item.analysis.overallScore}점` : '점수 확인 필요'
  const title = getListingTitle(item, index)
  const isMappable = hasMapLocation(item)

  return (
    <button
      aria-label={`저장 매물 상세보기: ${title}`}
      className="saved-listing-card"
      type="button"
      onClick={() => onOpen(item.id)}
    >
      <div>
        <strong>{title}</strong>
        <p>{getListingPrice(item)}</p>
      </div>
      <dl>
        <div>
          <dt>점수</dt>
          <dd>{score}</dd>
        </div>
        <div>
          <dt>결과</dt>
          <dd>{decision}</dd>
        </div>
        <div>
          <dt>통학</dt>
          <dd>{item.selectedRouteMode || item.selectedRouteKey || '기본 경로'}</dd>
        </div>
      </dl>
      <span className={isMappable ? 'map-status available' : 'map-status unavailable'}>
        {isMappable ? '지도 표시 가능' : '지도 표시 불가'}
      </span>
      <small>{formatSavedAt(item.savedAt)}</small>
    </button>
  )
}

function HomePage({ onAddListing, onCompare, onEditUserInfo, onOpenSavedAnalysis, savedItems }) {
  const canCompare = savedItems.length >= 2

  return (
    <main className="user-info-page home-page">
      <section className="home-shell" aria-labelledby="home-title">
        <header className="home-header">
          <p className="brand-name">자취방 의사결정 도우미</p>
          <h1 id="home-title">저장한 매물을 모아봤어요</h1>
        </header>

        <SavedListingsMap savedItems={savedItems} />

        <section className="saved-listings-section" aria-labelledby="saved-listings-title">
          <h2 id="saved-listings-title">저장 매물</h2>
          {savedItems.length > 0 ? (
            <div className="saved-listing-list">
              {savedItems.map((item, index) => (
                <SavedListingItem index={index} item={item} key={item.id} onOpen={onOpenSavedAnalysis} />
              ))}
            </div>
          ) : (
            <div className="empty-saved-list">
              <h3>저장된 매물이 없습니다</h3>
              <p>매물 스크린샷을 분석한 뒤 저장하면 이곳에서 다시 확인할 수 있습니다.</p>
            </div>
          )}
        </section>

        <div className="home-action-row">
          <button className="secondary-button" type="button" onClick={onCompare} disabled={!canCompare}>
            매물 비교하기
          </button>
          <button className="primary-button" type="button" onClick={onAddListing}>
            매물 추가
          </button>
          <button className="secondary-button" type="button" onClick={onEditUserInfo}>
            사용자 정보 수정
          </button>
          {!canCompare && (
            <p className="home-action-hint">저장 매물이 2개 이상이면 비교할 수 있습니다.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePage
