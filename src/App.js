import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [resultImage, setResultImage] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      alert("Image not ready yet, please try again.");
      return;
    }

    const blob = await (await fetch(imageSrc)).blob();
    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");
    submitToServer(formData);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadAndAnalyze = () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    submitToServer(formData);
  };

  const submitToServer = async (formData) => {
    try {
      const response = await axios.post(
        "https://086e-34-148-249-105.ngrok-free.app/predict-emotion",
        formData
      );

      setResultImage(`data:image/jpeg;base64,${response.data.image}`);
      setEmotions(response.data.emotions);
    } catch (err) {
      console.error("Prediction failed", err);
      alert("Server error: Could not get prediction.");
    }
  };

  return (
<div
  className="min-h-screen flex flex-col items-center justify-center px-4"
  style={{ backgroundImage: 'linear-gradient(to bottom right,rgb(21, 43, 84), #243b55)' }}> 
                  <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Emotion Detection Submitted to{" "}
            <span className="text-orange-400 underline">Syed Haider Karar bukhari </span>
          </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Emotion Detection AI BY{" "}
          <span className="text-green-600 underline">SAMIULLAH</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Webcam Preview */}
          <div className="flex flex-col items-center">
            {webcamOn ? (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-lg shadow-md w-full max-w-sm"
                />
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={capture}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
                  >
                    Capture & Analyze
                  </button>
                  <button
                    onClick={() => setWebcamOn(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    Close Camera
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setWebcamOn(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
              >
                Open Camera
              </button>
            )}
          </div>

          {/* Upload Section */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />
            <button
              onClick={uploadAndAnalyze}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Upload & Analyze
            </button>
          </div>

          {/* Result */}
          {resultImage && (
            <div className="flex flex-col items-center mt-6 md:mt-0">
              <img
                src={resultImage}
                alt="Result"
                className="rounded-lg shadow-md max-w-sm"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
                Detected Emotions:
              </h3>
              <ul className="list-disc text-gray-600 text-sm pl-5">
                {emotions.map((emo, idx) => (
                  <li key={idx}>{emo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
