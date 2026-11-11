const WASTE_INFO = {
  recyclable: {
    emoji: '♻️',
    bin: 'Blue Recycling Bin',
    color: 'recyclable',
    tip: 'Clean and dry this item before placing it in recycling.',
    impact: 'Recycling saves up to 95% of energy vs. raw production.',
  },
  organic: {
    emoji: '🌱',
    bin: 'Green Compost Bin',
    color: 'organic',
    tip: 'Perfect for composting! Place in the organic green bin.',
    impact: 'Composting reduces methane emissions from landfills.',
  },
  hazardous: {
    emoji: '⚠️',
    bin: 'Hazardous Waste Facility',
    color: 'hazardous',
    tip: 'Handle carefully and dispose at a hazardous waste facility.',
    impact: 'Proper disposal prevents toxic soil & water contamination.',
  },
  general: {
    emoji: '🗑️',
    bin: 'General Waste Bin',
    color: 'general',
    tip: 'Place this item in the standard general waste bin.',
    impact: 'Even general waste can be minimised — consider reducing use.',
  },
};

const ResultScreen = ({ result, confidence, imageUrl, onReset, onScanAgain }) => {
  const info = WASTE_INFO[result?.toLowerCase()] || WASTE_INFO.general;
  const pct = Math.round(confidence);

  return (
    <div className="result-screen" id="resultScreen">
      <div className="result-card">
        <p className="result-heading">✦ CLASSIFICATION COMPLETE</p>

        {imageUrl && (
          <img
            className="result-image"
            src={imageUrl}
            alt="Classified waste"
          />
        )}

        <h2 className="result-type">{info.emoji} {result}</h2>

        {/* Confidence bar */}
        <div>
          <div className="confidence-label">
            <span>Confidence Score</span>
            <span className="confidence-value">{pct}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Info grid */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-label">
              <span className="icon">🗂️</span> CATEGORY
            </div>
            <span className={`type-badge ${info.color}`}>
              {result?.toUpperCase()}
            </span>
          </div>

          <div className="info-card">
            <div className="info-card-label">
              <span className="icon">📍</span> WHERE TO DISPOSE
            </div>
            <p>{info.bin}</p>
          </div>

          <div className="info-card" style={{ gridColumn: '1 / -1' }}>
            <div className="info-card-label">
              <span className="icon">💡</span> DISPOSAL TIP
            </div>
            <p>{info.tip}</p>
          </div>

          <div className="info-card" style={{ gridColumn: '1 / -1' }}>
            <div className="info-card-label">
              <span className="icon">🌍</span> ECO IMPACT
            </div>
            <p>{info.impact}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-btns">
          <button className="btn-secondary" onClick={onReset} id="resetBtn">
            ← Back
          </button>
          <button className="btn-primary" onClick={onScanAgain} id="scanAgainBtn">
            🔍 Scan Another Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
