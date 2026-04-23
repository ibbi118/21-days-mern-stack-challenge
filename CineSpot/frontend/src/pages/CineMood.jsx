import { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { fetchMoodMovies, clearMoodMovies } from '../features/movies/movieSlice';
import { useFaceDetector } from '../components/CineMoodAI/FaceDetector';
import CameraPreview from '../components/CineMoodAI/CameraPreview';
import MoodResult from '../components/CineMoodAI/MoodResult';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/Loader/Loader';
import { HiSparkles } from 'react-icons/hi2';
import { FiAlertCircle, FiCamera, FiZap } from 'react-icons/fi';
import './CineMood.scss';

const MOOD_GENRES = {
  happy:     [35, 10749, 16, 10751],
  sad:       [18, 10749, 36],
  angry:     [28, 12, 53, 27],
  fearful:   [27, 53, 9648],
  disgusted: [35, 16, 10751],
  surprised: [12, 14, 878, 28],
  neutral:   [878, 9648, 80, 37],
};

// steps: 'idle' | 'camera' | 'scanning' | 'result'
export default function CineMood() {
  const dispatch = useDispatch();
  const { moodMovies, moodLoading } = useSelector(s => s.movies);

  const [step,       setStep]       = useState('idle');
  const [fetchError, setFetchError] = useState(null);

  const pageRef   = useRef(null);
  const resultRef = useRef(null);
  // This ref marks whether the camera section is mounted and ready
  const cameraReadyRef = useRef(false);

  const {
    videoRef, canvasRef,
    cameraActive, isScanning, facesDetected,
    detectedMood, permissionError, modelsError, loadingModels, modelsLoaded,
    loadModels, startCamera, stopCamera, scanMood, resetMood,
  } = useFaceDetector();

  // ── Page entrance animation ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cinemood__hero-content > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }
      );
    }, pageRef.current);
    return () => ctx.revert();
  }, []);

  // ── When step changes to 'camera', start camera after DOM paints ──────
  // We use a small timeout to guarantee the <video> element is in the DOM
  // before calling startCamera(), which needs videoRef.current to be set.
  useEffect(() => {
    if (step !== 'camera') return;

    cameraReadyRef.current = false;

    // requestAnimationFrame + setTimeout gives the browser two full frames
    // to paint the video element and attach the ref before we call getUserMedia
    const raf = requestAnimationFrame(() => {
      const timer = setTimeout(async () => {
        if (step !== 'camera') return; // guard against fast state changes

        // Load models first if not already loaded
        if (!modelsLoaded) {
          const ok = await loadModels();
          if (!ok) return; // modelsError will be set
        }

        // Now the video element is definitely in the DOM
        await startCamera();
        cameraReadyRef.current = true;
      }, 80); // 80ms is enough for one render cycle

      return () => clearTimeout(timer);
    });

    return () => cancelAnimationFrame(raf);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── When mood detected → move to result step ──────────────────────────
  useEffect(() => {
    if (!detectedMood) return;
    setStep('result');
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, [detectedMood]);

  // ── Fetch movies after mood detected ──────────────────────────────────
  const handleFetchMovies = useCallback(async (mood) => {
    setFetchError(null);
    const genres = MOOD_GENRES[mood] || MOOD_GENRES.neutral;
    try {
      await dispatch(fetchMoodMovies(genres)).unwrap();
      setTimeout(() => {
        gsap.fromTo('.cinemood__movies .movie-card',
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.45, ease: 'back.out(1.2)' }
        );
      }, 100);
    } catch {
      setFetchError('Could not load movie recommendations. Check your TMDB API key.');
    }
  }, [dispatch]);

  // ── Button handlers ────────────────────────────────────────────────────
  const handleStartCamera = () => {
    dispatch(clearMoodMovies());
    resetMood();
    setFetchError(null);
    setStep('camera'); // triggers the useEffect above
  };

  const handleScan = async () => {
    if (!cameraActive) return;
    setStep('scanning');
    await scanMood(); // sets detectedMood → triggers useEffect → step = 'result'
  };

  const handleReset = () => {
    resetMood();
    dispatch(clearMoodMovies());
    setFetchError(null);
    setStep('camera');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFullReset = () => {
    stopCamera();
    resetMood();
    dispatch(clearMoodMovies());
    setFetchError(null);
    setStep('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCameraStep = step === 'camera' || step === 'scanning';

  return (
    <div className="cinemood page-wrapper" ref={pageRef}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="cinemood__hero">
        <div className="cinemood__hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="cinemood__hero-content container">

          <div className="cinemood__badge">
            <HiSparkles /> CineMood AI <span className="badge-new">NEW</span>
          </div>

          <h1 className="cinemood__title">
            Find Movies That<br /><em>Match Your Mood</em>
          </h1>

          <p className="cinemood__sub">
            Our AI reads your real facial expression and handpicks the perfect films —
            no guessing, no manual selection.
          </p>

          {/* How it works — idle only */}
          {step === 'idle' && (
            <div className="cinemood__how">
              {[
                { icon: <FiCamera />, text: 'Camera opens' },
                { icon: '🤖',        text: 'AI scans your face' },
                { icon: '🎬',        text: 'Movies match your mood' },
              ].map((s, i) => (
                <div key={i} className="how-step">
                  <div className="how-step__icon">{s.icon}</div>
                  <div className="how-step__label">{s.text}</div>
                  {i < 2 && <div className="how-step__arrow">→</div>}
                </div>
              ))}
            </div>
          )}

          {/* Models load error */}
          {modelsError && (
            <div className="cinemood__models-error">
              <FiAlertCircle />
              <div>
                <strong>Face Detection Models Not Found</strong>
                <p>{modelsError}</p>
                <details>
                  <summary>How to fix</summary>
                  <p>Run from the <code>frontend/</code> folder:</p>
                  <pre>npm run download-models</pre>
                  <p>Or manually download from:<br />
                    <a href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights" target="_blank" rel="noreferrer">
                      github.com/justadudewhohacks/face-api.js → weights/
                    </a>
                  </p>
                </details>
              </div>
            </div>
          )}

          {/* ── Idle: Start button ───────────────────────────────── */}
          {step === 'idle' && !modelsError && (
            <button
              className="cinemood__start-btn"
              onClick={handleStartCamera}
              disabled={loadingModels}
            >
              {loadingModels
                ? <><span className="btn-spinner" /> Loading AI Models…</>
                : <><FiCamera /> Start Mood Scan</>
              }
            </button>
          )}

          {/* ── Camera / Scanning ────────────────────────────────── */}
          {isCameraStep && !modelsError && (
            <div className="cinemood__camera-section">

              {/* CameraPreview receives videoRef + canvasRef as plain props */}
              <CameraPreview
                videoRef={videoRef}
                canvasRef={canvasRef}
                isActive={cameraActive}
                isScanning={step === 'scanning'}
                permissionError={permissionError}
                facesDetected={facesDetected}
              />

              {permissionError ? (
                <div className="cinemood__perm-error">
                  <FiAlertCircle /> {permissionError}
                </div>
              ) : (
                <div className="cinemood__camera-actions">
                  <button
                    className="cinemood__scan-btn"
                    onClick={handleScan}
                    disabled={!cameraActive || step === 'scanning'}
                  >
                    {step === 'scanning'
                      ? <><span className="btn-spinner" /> Analyzing…</>
                      : <><FiZap /> Scan My Mood 🎥</>
                    }
                  </button>
                  <button className="cinemood__cancel-btn" onClick={handleFullReset}>
                    Cancel
                  </button>
                </div>
              )}

              {cameraActive && step === 'camera' && (
                <p className="cinemood__tip">
                  💡 Look directly at the camera, then click Scan My Mood
                </p>
              )}

              {!cameraActive && !permissionError && (
                <p className="cinemood__tip" style={{ color: 'var(--accent-gold)' }}>
                  ⏳ Starting camera…
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Result + Movie Grid ───────────────────────────────────────── */}
      {step === 'result' && detectedMood && (
        <div className="cinemood__results container" ref={resultRef}>

          <MoodResult
            detectedMood={detectedMood}
            onReset={handleReset}
            onFetchMovies={handleFetchMovies}
          />

          {fetchError && (
            <div className="cinemood__fetch-error">
              <FiAlertCircle /> {fetchError}
            </div>
          )}

          {(moodLoading || moodMovies.length > 0) && (
            <div className="cinemood__movies-section">
              <h2 className="section-title" style={{ marginBottom: 28 }}>
                Handpicked For <span>Your Vibe</span> 🎬
              </h2>
              {moodLoading
                ? <SkeletonGrid count={12} />
                : (
                  <div className="cinemood__movies">
                    {moodMovies.map(movie => (
                      <MovieCard key={movie.id} item={movie} mediaType="movie" />
                    ))}
                  </div>
                )
              }
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48, paddingBottom: 80 }}>
            <button className="cinemood__start-btn" onClick={handleFullReset}>
              <FiCamera /> Scan Again
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
