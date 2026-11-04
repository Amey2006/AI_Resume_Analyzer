import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Check, AlertCircle } from "lucide-react";

const BACKEND = "https://hire-help-backend-production.up.railway.app";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadJD({ sessionId, setCandidates, locked = false }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [progress, setProgress] = useState(0); // Custom fake progress tracker %

  // Fake matching progress simulation hook
  useEffect(() => {
    let interval;
    if (status === "uploading") {
      setProgress(10); // Start at 10% instantly
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 92) {
            clearInterval(interval);
            return 92; // Hold right before 100% until API responds successfully
          }
          // Incrementally slow down as it gets closer to completion
          const increment = oldProgress > 60 ? 3 : 8;
          return oldProgress + increment;
        });
      }, 250);
    } else if (status === "success") {
      setProgress(100); // Complete the visual bar
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [status]);

  const upload = async () => {
    if (!file || status === "uploading") return;
    setStatus("uploading");
    const formData = new FormData();
    formData.append("document", file);
    formData.append("sessionId", sessionId);
    try {
      const res = await axios.post(`${BACKEND}/upload-jd`, formData);
      const cleanCandidates = (res.data.candidates || []).map((item) => {
        // Raw score is converted directly into a percentage value out of 100
        const rawScore = item.score || 0;
        const percentageScore = rawScore <= 1 ? rawScore * 100 : rawScore;

        return {
          file_name: item.file_name,
          score: Math.round(percentageScore), // Converts decimal points (e.g., 0.94) into 94
          resume_url: item.resume_url,
        };
      });
      setCandidates(cleanCandidates);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className={`card p-7 md:p-8 flex flex-col transition-opacity ${locked ? "opacity-60" : ""}`} data-testid="upload-jd-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="icon-tile cool"><FileText size={18} /></div>
        <div>
          <span className="step-num">STEP 02</span>
          <h3 className="hl-headline text-[20px] t-ink">Add the job description</h3>
        </div>
      </div>
      <p className="text-[14px] t-soft">
        Upload the JD for the role. AI removes buzzwords, keeps the real requirements, and
        scores every resume against it.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="chip">.pdf or .docx</span>
        <span className="chip">max 10 MB</span>
      </div>

      <label
        className={`dropzone ${file ? "filled" : ""} mt-5 flex items-center gap-4 p-5 cursor-pointer relative`}
        data-testid="upload-jd-dropzone"
      >
        <input
          type="file"
          accept=".pdf,.docx"
          disabled={locked || status === "uploading"}
          onChange={(e) => {
            const chosenFile = e.target.files[0];
            if (!chosenFile) return;

            const TEN_MB = 10 * 1024 * 1024;
            if (chosenFile.size > TEN_MB) {
              setFile(null);
              setStatus("error"); // Triggers the red error text below
              return;
            }

            setFile(chosenFile);
            setStatus("idle");
          }}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          data-testid="upload-jd-input"
        />
        <div className="icon-tile soft" style={{ width: 40, height: 40 }}>
          <FileText size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-mono truncate t-ink">
            {file ? file.name : "Choose a .pdf or .docx file"}
          </div>
          <div className="text-[12px] t-mute mt-0.5">
            {file ? formatSize(file.size) : "Click to browse or drag & drop"}
          </div>
        </div>
      </label>

      {/* Progress Bar Display Container */}
      {status === "uploading" && (
        <div className="mt-5 space-y-2 fade-in">
          <div className="flex items-center justify-between text-[12px] font-mono t-mute">
            <span className="inline-flex items-center gap-2">
              <span className="spinner" /> Scoring resumes...
            </span>
            <span>{progress}%</span>
          </div>
          <div className="meter-track w-full" style={{ height: 6 }}>
            <div
              className="meter-fill" style={{ width: `${progress}%`, transitionDuration: "300ms" }}
            />
          </div>
        </div>
      )}


      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <button
          className="btn-apple btn-primary-apple text-[14px] py-2.5 px-5"
          onClick={upload}
          disabled={locked || !file || status === "uploading"}
          data-testid="upload-jd-submit"
        >
          {status === "uploading" ? "Matching…" : "Rank candidates"}
        </button>

        {locked && status !== "success" && (
          <span className="text-[12px] t-mute">Finish step 1 first</span>
        )}
        {status === "success" && (
          <span
            className="text-[12px] font-mono text-emerald-500 inline-flex items-center gap-1.5"
            data-testid="upload-jd-status-success"
          >
            <Check size={13} /> Ranking ready — see results below
          </span>
        )}
        {status === "error" && (
          <span
            className="text-[12px] font-mono text-red-500 inline-flex items-center gap-1.5"
            data-testid="upload-jd-status-error"
          >
            <AlertCircle size={13} /> {!file ? "File exceeds 10MB limit" : "Upload failed — try again"}
          </span>
        )}
      </div>
    </div>
  );
}