const ScanScreen = ({ imagePreview }) => {
  return (
    <div className="scan-screen" id="scanScreen">
      <p className="scan-title">◉ ANALYZING WASTE SAMPLE</p>

      <div className="scanner">
        {imagePreview && (
          <img src={imagePreview} alt="Scanning" />
        )}
        <div className="scanner-overlay" />
        <div className="scanning-line" />
        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />
      </div>

      <div className="processing">
        Running AI Classification
        <span className="processing-dots"> ···</span>
      </div>
    </div>
  );
};

export default ScanScreen;
