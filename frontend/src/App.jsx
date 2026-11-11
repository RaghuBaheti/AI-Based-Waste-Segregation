import { useState, useRef } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Steps from './components/Steps';
import UploadScreen from './components/UploadScreen';
import ScanScreen from './components/ScanScreen';
import ResultScreen from './components/ResultScreen';

// Set your Flask backend URL here (or via VITE_API_URL env var)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// SCREEN STATES
const SCREEN = {
  UPLOAD: 1,
  SCAN: 2,
  RESULT: 3,
};

function App() {
  const [screen, setScreen] = useState(SCREEN.UPLOAD);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { type, confidence, imageUrl }
  const previewUrlRef = useRef(null);

  const handleFileSelected = (file, err) => {
    if (err) {
      setError(err);
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
    // Revoke old preview
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setImagePreview(url);
  };

  const handleScan = async () => {
    if (!selectedFile) return;
    setScreen(SCREEN.SCAN);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Server error. Please try again.');
      }

      setResult({
        type: data.result,
        confidence: data.confidence,
        imageUrl: data.image_url
          ? `${API_URL}${data.image_url}`
          : imagePreview,
      });
      setScreen(SCREEN.RESULT);
    } catch (err) {
      setError(err.message || 'Failed to reach the AI server. Is the backend running?');
      setScreen(SCREEN.UPLOAD);
    }
  };

  const handleReset = () => {
    setScreen(SCREEN.UPLOAD);
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Navbar />
      <HeroSection />

      <main className="container">
        <div className="main-card">
          <Steps currentStep={screen} />

          {screen === SCREEN.UPLOAD && (
            <UploadScreen
              onFileSelected={handleFileSelected}
              onScan={handleScan}
              selectedFile={selectedFile}
              error={error}
            />
          )}

          {screen === SCREEN.SCAN && (
            <ScanScreen imagePreview={imagePreview} />
          )}

          {screen === SCREEN.RESULT && result && (
            <ResultScreen
              result={result.type}
              confidence={result.confidence}
              imageUrl={result.imageUrl}
              onReset={handleReset}
              onScanAgain={handleReset}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        EcoVision AI · Built with <span>♥</span> for a greener planet
      </footer>
    </>
  );
}

export default App;
