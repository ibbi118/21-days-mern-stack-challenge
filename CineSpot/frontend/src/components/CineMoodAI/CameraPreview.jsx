import './CameraPreview.scss';

/**
 * CameraPreview
 *
 * Receives videoRef and canvasRef as plain props from the parent (CineMood page).
 * Both refs originate in useFaceDetector() and are attached to DOM elements here.
 *
 * ⚠️  Do NOT use forwardRef — we pass two refs so forwardRef won't work cleanly.
 */
export default function CameraPreview({
  videoRef,
  canvasRef,
  isActive,
  isScanning,
  permissionError,
  facesDetected,
}) {
  return (
    <div
      className={[
        'cam-preview',
        isActive   ? 'cam-preview--active'   : '',
        isScanning ? 'cam-preview--scanning' : '',
      ].join(' ').trim()}
    >
      {/* ── Permission / error overlay ───────────────────────────── */}
      {permissionError && (
        <div className="cam-preview__error">
          <div className="cam-preview__error-icon">🚫</div>
          <h4>Camera Access Required</h4>
          <p>{permissionError}</p>
          <small>Allow camera access in your browser settings, then click "Start Mood Scan" again.</small>
        </div>
      )}

      {/* ── Idle / waiting overlay (shown until stream starts) ───── */}
      {!isActive && !permissionError && (
        <div className="cam-preview__idle">
          <div className="cam-preview__idle-icon">
            <div className="camera-ring" />
            <span>📷</span>
          </div>
          <p>Starting camera…</p>
        </div>
      )}

      {/* ── Live video feed ──────────────────────────────────────── */}
      {/* The video element is ALWAYS in the DOM so videoRef attaches immediately */}
      <video
        ref={videoRef}
        className="cam-preview__video"
        autoPlay
        muted
        playsInline
      />

      {/* ── Face-detection canvas overlay ────────────────────────── */}
      <canvas ref={canvasRef} className="cam-preview__canvas" />

      {/* ── Scanning animation overlay ───────────────────────────── */}
      {isScanning && (
        <div className="cam-preview__scan-overlay">
          <div className="scan-corner scan-corner--tl" />
          <div className="scan-corner scan-corner--tr" />
          <div className="scan-corner scan-corner--bl" />
          <div className="scan-corner scan-corner--br" />
          <div className="scan-line" />
          <div className="scan-label">
            <span className="scan-dot" />
            Analyzing Expression…
          </div>
        </div>
      )}

      {/* ── Status badges (only when active and not scanning) ─────── */}
      {isActive && !isScanning && facesDetected > 0 && (
        <div className="cam-preview__face-badge">
          <span className="face-dot" /> Face Detected
        </div>
      )}

      {isActive && !isScanning && facesDetected === 0 && (
        <div className="cam-preview__no-face">
          Position your face in frame
        </div>
      )}
    </div>
  );
}
