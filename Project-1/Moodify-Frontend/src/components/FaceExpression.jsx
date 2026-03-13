import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  /** -----------------------------
   * Initialize FaceLandmarker and Webcam
   * -----------------------------
   */
  const initialize = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });

      // Start webcam
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = streamRef.current;

      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.error("Video play error:", err);
        }
      };
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };

  /** -----------------------------
   * Detect expression on button click
   * -----------------------------
   */
  const handleClick = async () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

    if (results.faceBlendshapes?.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;

      const getScore = (name) =>
        blendshapes.find((b) => b.categoryName === name)?.score || 0;

      const smileLeft = getScore("mouthSmileLeft");
      const smileRight = getScore("mouthSmileRight");
      const jawOpen = getScore("jawOpen");
      const browUp = getScore("browInnerUp");
      const frownLeft = getScore("mouthFrownLeft");
      const frownRight = getScore("mouthFrownRight");

      // DEBUG: Check all scores
      console.log({
        smileLeft,
        smileRight,
        jawOpen,
        browUp,
        frownLeft,
        frownRight,
      });

      // Thresholds (tune if needed)
      const smileThreshold = 0.5;
      const jawThreshold = 0.2;
      const browThreshold = 0.2;
      const frownThreshold = 0.3;

      let currentExpression = "Neutral";

        if (smileLeft > 0.5 && smileRight > 0.5) {
            currentExpression = "happy";
        } else if (jawOpen > 0.002 && browUp > 0.002) {
            currentExpression = "surprised";
        } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
            currentExpression = "sad";
        }

      setExpression(currentExpression);
    } else {
      setExpression("No face detected");
    }
  };

  /** -----------------------------
   * Initialize on component mount
   * -----------------------------
   */
  useEffect(() => {
    initialize();

    return () => {
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{ width: "400px", borderRadius: "12px" }}
        playsInline
        muted
        autoPlay
      />
      <h2>Expression: {expression}</h2>
      <button onClick={handleClick}>Detect Expression</button>
    </div>
  );
}