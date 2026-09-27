import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";

export default function CV({
  cvPath = "/assets/Numan-Anjum-Cv.pdf",
  fileName = "My-CV.pdf",
}) {
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
          </div>
          <a className="btn primary cv-btn" href={cvPath} download={fileName}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3v12m0 0-4-4m4 4 4-4M4 19h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download CV
          </a>
        </Reveal>
      </div>
    </section>
  );
}
