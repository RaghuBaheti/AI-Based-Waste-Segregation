import { useRef, useState } from 'react';

const UploadScreen = ({ onFileSelected, onScan, selectedFile, error }) => {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowed.includes(file.type)) {
      onFileSelected(null, 'Please upload a valid image file (JPG, PNG, GIF, BMP, WEBP).');
      return;
    }
    setPreview(URL.createObjectURL(file));
    onFileSelected(file, null);
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div id="uploadScreen">
      <div
        className={`upload-box${dragging ? ' dragging' : ''}`}
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="upload-icon">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
            />
          ) : '📸'}
        </div>

        <h2>{selectedFile ? 'Image Ready' : 'Drop Your Image Here'}</h2>
        <p>
          {selectedFile
            ? 'Looking good! Click "Analyze Waste" to classify it.'
            : 'Drag & drop or click to browse — JPG, PNG, WEBP supported'}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
          id="fileInput"
        />

        <button
          className="choose-btn"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
        >
          {selectedFile ? '🔄 Change Image' : '📂 Choose Image'}
        </button>

        <p className="file-name">
          {selectedFile ? `✓ ${selectedFile.name}` : ''}
        </p>
      </div>

      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        className="scan-btn"
        onClick={onScan}
        disabled={!selectedFile}
        id="analyzBtn"
      >
        🔍 Analyze Waste
      </button>
    </div>
  );
};

export default UploadScreen;
