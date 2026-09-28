import { useState, useRef } from "react";
import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";

/* Four icons stacked on top of each other. Only the one matching the current
   status gets the "active" class, so CSS can crossfade between them smoothly. */
function IconStack({ status }) {
  const on = (s) => `cv-icon-state${status === s ? " active" : ""}`;
  return (
    <span className="cv-icon-stack" aria-hidden="true">
      {/* idle: download arrow */}
      <svg className={on("idle")} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3v12m0 0-4-4m4 4 4-4M4 19h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* loading: spinner */}
      <svg className={`${on("loading")} spin`} viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="42 100"
        />
      </svg>
      {/* success: checkmark that draws itself */}
      <svg className={on("success")} viewBox="0 0 24 24" fill="none">
        <path
          className="check-path"
          pathLength="1"
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* error: warning triangle */}
      <svg className={on("error")} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4m0 4h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const LABELS = {
  idle: "Download CV",
  loading: "Downloading…",
  success: "Downloaded!",
  error: "Try again",
};

export default function CV({
  cvPath = "/assets/Numan-Anjum-Cv.pdf",
  fileName = "My-CV.pdf",
}) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [progress, setProgress] = useState(0); // 0-100
  const [indeterminate, setIndeterminate] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const resetTimer = useRef(null);

  function scheduleReset(delay) {
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setStatus("idle");
      setProgress(0);
      setErrorMsg("");
    }, delay);
  }

  async function handleDownload(e) {
    e.preventDefault();
    if (status === "loading") return;

    clearTimeout(resetTimer.current);
    setStatus("loading");
    setProgress(0);
    setIndeterminate(false);
    setErrorMsg("");

    try {
      const res = await fetch(cvPath);
      if (!res.ok) throw new Error(`HTTP_${res.status}`);

      // Real progress if the server tells us the size; otherwise a sweeping bar.
      const total = Number(res.headers.get("Content-Length")) || 0;
      const reader =
        res.body && res.body.getReader ? res.body.getReader() : null;
      if (!total || !reader) setIndeterminate(true);

      let blob;
      if (reader) {
        const chunks = [];
        let loaded = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          if (total)
            setProgress(Math.min(99, Math.round((loaded / total) * 100)));
        }
        blob = new Blob(chunks, { type: "application/pdf" });
      } else {
        blob = await res.blob();
      }
      setProgress(100);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // tiny pause so the bar visibly reaches 100% before switching to the tick
      setTimeout(() => {
        setStatus("success");
        scheduleReset(2400);
      }, 250);
    } catch (err) {
      // fetch() rejects with a TypeError on network failure (offline, DNS, CORS)
      if (err instanceof TypeError) {
        setErrorMsg(
          "Network error — check your internet connection and try again.",
        );
      } else if (err.message === "HTTP_404") {
        setErrorMsg("CV file not found on the server (404).");
      } else {
        setErrorMsg("Couldn't download the CV right now. Please try again.");
      }
      setStatus("error");
      scheduleReset(4500);
    }
  }

  return (
    <section id="cv">
      <div className="wrap">
        <SectionHead
          title="My CV"
          text="Want the full picture? Grab a copy of my CV for a complete rundown of my skills, experience and qualifications."
        />
        <Reveal cls="cv-card">
          <div className="cv-icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M14 3v5h5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9 13h6M9 17h6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="cv-text">
            <h3>My Resume</h3>
            <p>
              PDF file · Everything about my work, skills and experience in one
              place.
            </p>
            {status === "error" && (
              <p className="cv-error" role="alert">
                {errorMsg}
              </p>
            )}
          </div>

          <a
            className={`btn primary cv-btn${status !== "idle" ? ` is-${status}` : ""}`}
            href={cvPath}
            download={fileName}
            onClick={handleDownload}
            aria-live="polite"
          >
            {status === "loading" && (
              <span
                className={`cv-progress${indeterminate ? " is-indeterminate" : ""}`}
                style={indeterminate ? undefined : { width: `${progress}%` }}
              />
            )}
            <IconStack status={status} />
            <span className="cv-btn-label">{LABELS[status]}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
