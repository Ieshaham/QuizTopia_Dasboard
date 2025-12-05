// src/focus/FocusTracker.jsx
import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./focusControl"; // ensures the global functions are loaded

const FocusTracker = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    let intervalId = null;
    let isMounted = true;

    async function setupCameraAndModels() {
      try {
        console.log("📦 Loading FaceAPI models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");

        console.log("📷 Requesting webcam...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        if (!isMounted) return;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        console.log("✅ Camera + models ready. Starting detection loop...");

        intervalId = setInterval(async () => {
          // Only track when a game has turned it on
          
          if (!videoRef.current) return;

          const video = videoRef.current;

          const detection = await faceapi
            .detectSingleFace(
              video,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceExpressions();

          if (!detection) {
            // No face → optionally push low score or skip
            console.log("🙈 No face detected");
            return;
          }

          const expr = detection.expressions || {};

          // Simple "focus score" example:
          // You can adjust weights as you want.
          const neutral = expr.neutral || 0;
          const happy = expr.happy || 0;
          const surprised = expr.surprised || 0;
          const sad = expr.sad || 0;
          const angry = expr.angry || 0;

          // Very simple formula: reward neutral/happy, penalize angry/sad
          let raw =
            (neutral + happy + surprised * 0.5) -
            (sad * 0.7 + angry * 0.7);

          // raw can be negative → shift to [0,1]
          raw = Math.max(0, Math.min(1, (raw + 1) / 2));

          const focusScore = Math.round(raw * 100);

          console.log("🧠 Focus sample:", focusScore);

          // Store sample in global history
          window._addFocusSample(focusScore);
        }, 500); // every 500ms
      } catch (err) {
        console.error("❌ Error in FocusTracker:", err);
      }
    }

    setupCameraAndModels();

    return () => {
      isMounted = false;

      if (intervalId) {
        clearInterval(intervalId);
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // The video can be hidden; it's just for capturing frames
  return (
    <video
      ref={videoRef}
      style={{ display: "none" }}
      playsInline
      muted
    />
  );
};

export default FocusTracker;
