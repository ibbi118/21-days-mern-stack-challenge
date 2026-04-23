import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

const MODELS_URL = '/models';

const MOOD_META = {
  happy:     { emoji: '😊', label: "You're Feeling Happy",    color: '#f5c518' },
  sad:       { emoji: '😢', label: "You're in Your Feelings", color: '#4cc9f0' },
  angry:     { emoji: '😡', label: 'Feeling Intense',         color: '#e63946' },
  fearful:   { emoji: '😱', label: 'Feeling Tense',           color: '#7b2fff' },
  disgusted: { emoji: '😤', label: 'Feeling Selective',       color: '#fb923c' },
  surprised: { emoji: '😲', label: 'Full of Wonder',          color: '#22c55e' },
  neutral:   { emoji: '😐', label: 'Keeping It Cool',         color: '#9aa3b8' },
};

const EXPRESSION_TO_MOOD = {
  happy: 'happy', sad: 'sad', angry: 'angry',
  fearful: 'fearful', disgusted: 'disgusted',
  surprised: 'surprised', neutral: 'neutral',
};

export function useFaceDetector() {
  // ── Refs ──────────────────────────────────────────────────────────────────
  // videoRef and canvasRef are created HERE and passed down to CameraPreview
  // via props (not forwardRef) so they always point to real DOM elements.
  const videoRef         = useRef(null);
  const canvasRef        = useRef(null);
  const streamRef        = useRef(null);
  const detectionLoopRef = useRef(null);

  // ── State ─────────────────────────────────────────────────────────────────
  const [modelsLoaded,    setModelsLoaded]    = useState(false);
  const [loadingModels,   setLoadingModels]   = useState(false);
  const [modelsError,     setModelsError]     = useState(null);
  const [cameraActive,    setCameraActive]    = useState(false);
  const [isScanning,      setIsScanning]      = useState(false);
  const [facesDetected,   setFacesDetected]   = useState(0);
  const [detectedMood,    setDetectedMood]    = useState(null);
  const [permissionError, setPermissionError] = useState(null);

  // ── 1. Load models (called explicitly, not on mount) ──────────────────────
  const loadModels = useCallback(async () => {
    if (modelsLoaded) return true;
    setLoadingModels(true);
    setModelsError(null);
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL),
      ]);
      setModelsLoaded(true);
      setLoadingModels(false);
      return true;
    } catch (err) {
      console.error('[CineMood] Model load error:', err);
      setModelsError(
        'Face detection models not found in /public/models/. ' +
        'Run: npm run download-models'
      );
      setLoadingModels(false);
      return false;
    }
  }, [modelsLoaded]);

  // ── 2. Start camera ────────────────────────────────────────────────────────
  // IMPORTANT: videoRef.current must exist (video element rendered) before call.
  const startCamera = useCallback(async () => {
    setPermissionError(null);
    setCameraActive(false);

    // Safety check — video element must be in the DOM
    if (!videoRef.current) {
      console.error('[CineMood] videoRef is null — video element not mounted yet');
      setPermissionError('Internal error: video element not ready. Please try again.');
      return false;
    }

    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width:      { ideal: 640 },
          height:     { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;

      // Attach stream
      video.srcObject = stream;

      // Wait for metadata OR timeout after 5s
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Camera timeout')), 5000);

        // If already has enough data, resolve immediately
        if (video.readyState >= 2) {
          clearTimeout(timeout);
          resolve();
          return;
        }

        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve();
        };
        video.onerror = (e) => {
          clearTimeout(timeout);
          reject(new Error('Video element error'));
        };
      });

      // Ensure play() resolves
      try {
        await video.play();
      } catch (playErr) {
        // Some browsers auto-play without needing explicit play()
        console.warn('[CineMood] video.play() warning:', playErr.message);
      }

      setCameraActive(true);
      return true;

    } catch (err) {
      console.error('[CineMood] Camera error:', err);
      const msg =
        err.name === 'NotAllowedError'  ? 'Camera permission denied. Click the camera icon in your browser address bar to allow access.' :
        err.name === 'NotFoundError'    ? 'No camera found. Please connect a camera and try again.' :
        err.name === 'NotReadableError' ? 'Camera is in use by another app. Close other apps and try again.' :
        err.name === 'OverconstrainedError' ? 'Camera does not support the requested settings. Trying fallback…' :
        `Camera error: ${err.message}`;
      setPermissionError(msg);

      // Try fallback without constraints
      if (err.name === 'OverconstrainedError') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setPermissionError(null);
          setCameraActive(true);
          return true;
        } catch { /* fallback also failed */ }
      }
      return false;
    }
  }, []);

  // ── 3. Stop camera ─────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (detectionLoopRef.current) {
      clearInterval(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setFacesDetected(0);
  }, []);

  // ── 4. Live face preview loop (runs while camera is active) ───────────────
  useEffect(() => {
    if (!cameraActive || !modelsLoaded) return;

    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 });

    detectionLoopRef.current = setInterval(async () => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || video.readyState < 2 || video.paused) return;

      try {
        const detections = await faceapi.detectAllFaces(video, opts);
        setFacesDetected(detections.length);

        if (canvas) {
          // Match canvas size to video display size
          const { videoWidth, videoHeight } = video;
          if (canvas.width !== videoWidth)  canvas.width  = videoWidth;
          if (canvas.height !== videoHeight) canvas.height = videoHeight;

          const dims   = faceapi.matchDimensions(canvas, video, true);
          const resized = faceapi.resizeResults(detections, dims);
          const ctx    = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          resized.forEach(d => {
            const { x, y, width, height } = d.box;
            ctx.strokeStyle = 'rgba(245,197,24,0.7)';
            ctx.lineWidth   = 2;
            ctx.strokeRect(x, y, width, height);
          });
        }
      } catch { /* skip frame on error */ }
    }, 400);

    return () => {
      clearInterval(detectionLoopRef.current);
      detectionLoopRef.current = null;
    };
  }, [cameraActive, modelsLoaded]);

  // ── 5. Full mood scan ──────────────────────────────────────────────────────
  const scanMood = useCallback(async () => {
    const video = videoRef.current;
    if (!modelsLoaded || !cameraActive || !video) return;

    setIsScanning(true);
    setDetectedMood(null);

    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 });
    const SAMPLES     = 8;
    const INTERVAL_MS = 300;
    const accum       = {};

    try {
      for (let i = 0; i < SAMPLES; i++) {
        await new Promise(r => setTimeout(r, INTERVAL_MS));
        if (!video || video.paused || video.readyState < 2) continue;

        const result = await faceapi
          .detectSingleFace(video, opts)
          .withFaceLandmarks(true)
          .withFaceExpressions();

        if (result?.expressions) {
          const [topExpr, topScore] = Object.entries(result.expressions)
            .sort(([, a], [, b]) => b - a)[0];
          accum[topExpr] = (accum[topExpr] || 0) + topScore;
        }
      }

      if (Object.keys(accum).length === 0) {
        setDetectedMood({ mood: 'neutral', ...MOOD_META.neutral, confidence: 0, fallback: true });
      } else {
        const [dominantExpr] = Object.entries(accum).sort(([, a], [, b]) => b - a)[0];
        const mood       = EXPRESSION_TO_MOOD[dominantExpr] || 'neutral';
        const total      = Object.values(accum).reduce((a, b) => a + b, 0);
        const confidence = Math.min(100, Math.round((accum[dominantExpr] / total) * 100));
        setDetectedMood({ mood, ...MOOD_META[mood], confidence, rawExpression: dominantExpr, fallback: false });
      }
    } catch (err) {
      console.error('[CineMood] Scan error:', err);
      setDetectedMood({ mood: 'neutral', ...MOOD_META.neutral, confidence: 0, fallback: true });
    } finally {
      setIsScanning(false);
    }
  }, [modelsLoaded, cameraActive]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    // Refs — pass directly as props to CameraPreview
    videoRef,
    canvasRef,
    // State
    cameraActive,
    isScanning,
    facesDetected,
    detectedMood,
    permissionError,
    modelsError,
    loadingModels,
    modelsLoaded,
    // Actions
    loadModels,
    startCamera,
    stopCamera,
    scanMood,
    resetMood: () => setDetectedMood(null),
    MOOD_META,
  };
}
