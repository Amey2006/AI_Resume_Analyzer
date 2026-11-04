import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Upload, Check, AlertCircle } from "lucide-react";

const BACKEND = "https://hire-help-backend-production.up.railway.app";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadZip({ sessionId, onReady }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const pollRef = useRef(null);

  useEffect(() => {
    onReady?.(status === "success");
  }, [status, onReady]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = (jobId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${BACKEND}/job-status/${jobId}`);
        const { status: jobStatus, error } = res.data;
        if (jobStatus === "completed") {
          clearInterval(pollRef.current);
          setStatus("success");
        } else if (jobStatus === "failed") {
          clearInterval(pollRef.current);
          setStatus("error");
          setErrorMessage(error || "Python processing failed.");
        }
      } catch (err) {
        clearInterval(pollRef.current);
        setStatus("error");
        setErrorMessage("Failed to fetch processing status.");
      }
    }, 3000);
  };

  const upload = async () => {
    if (!file || status === "uploading" || status === "processing") return;
    setStatus("uploading");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("zipFile", file);
    formData.append("sessionId", sessionId);

    try {
      const res = await axios.post(`${BACKEND}/upload`, formData);
      const { jobId } = res.data;
      setStatus("processing");
      startPolling(jobId);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.message || "Upload failed — try again"
      );
    }
  };

  const busy = status === "uploading" || status === "processing";

  return (
    <div className="card p-7 md:p-8 flex flex-col" data-testid="upload-zip-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="icon-tile"><Upload size={18} /></div>
        <div>
          <span className="step-num">STEP 01</span>
          <h3 className="hl-headline text-[20px] t-ink">Upload resumes</h3>
        </div>
      </div>
      <p className="text-[14px] t-soft">
        Put all candidate resumes (PDF or DOCX) in one folder, zip it, and upload it here.
        We'll read and index every resume.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="chip">.zip only</span>
        <span className="chip">max 100 MB</span>
      </div>

      <label
        className={`dropzone ${file ? "filled" : ""} mt-5 flex items-center gap-4 p-5 cursor-pointer relative`}
        data-testid="upload-zip-dropzone"
      >
        <input
          type="file"
          accept=".zip"
          disabled={busy}
          onChange={(e) => {
            const chosenFile = e.target.files[0];
            if (!chosenFile) return;

            const ONE_HUNDRED_MB = 100 * 1024 * 1024;
            if (chosenFile.size > ONE_HUNDRED_MB) {
              setFile(null);
              setStatus("error");
              setErrorMessage("ZIP file exceeds the 100MB size limit.");
              return;
            }

            if (pollRef.current) clearInterval(pollRef.current);

            // Use the safe variable reference instead of re-reading e.target.files
            setFile(chosenFile);
            setStatus("idle");
            setErrorMessage("");
          }}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          data-testid="upload-zip-input"
        />
        <div className="icon-tile soft" style={{ width: 40, height: 40 }}>
          <Upload size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-mono truncate t-ink">
            {file ? file.name : "Choose a .zip file"}
          </div>
          <div className="text-[12px] t-mute mt-0.5">
            {file ? formatSize(file.size) : "Click to browse or drag & drop"}
          </div>
        </div>
      </label>

      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <button
          className="btn-apple btn-primary-apple text-[14px] py-2.5 px-5"
          onClick={upload}
          disabled={!file || busy}
          data-testid="upload-zip-submit"
        >
          {status === "uploading" && "Uploading…"}
          {status === "processing" && "Processing…"}
          {!busy && "Upload resumes"}
        </button>

        {status === "uploading" && (
          <span className="text-[12px] font-mono t-mute inline-flex items-center gap-2">
            <span className="spinner" /> Uploading archive
          </span>
        )}
        {status === "processing" && (
          <span
            className="text-[12px] font-mono t-mute inline-flex items-center gap-2"
            data-testid="upload-zip-status-processing"
          >
            <span className="spinner" /> Reading & indexing resumes…
          </span>
        )}
        {status === "success" && (
          <span
            className="text-[12px] font-mono text-emerald-500 inline-flex items-center gap-1.5"
            data-testid="upload-zip-status-success"
          >
            <Check size={13} /> Resumes ready — go to step 2
          </span>
        )}
        {status === "error" && (
          <span className="text-[12px] font-mono text-red-500 inline-flex items-center gap-1.5">
            <AlertCircle size={13} />
            {errorMessage || "Upload failed — try again"}
          </span>
        )}
      </div>
    </div>
  );
}