import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import CVDownload from "./components/CV.jsx";

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
    } catch (e) {}
    return matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }, [theme]);

  return (
    <>
      <Header theme={theme} setTheme={setTheme} />
      <main id="top">
        <Hero />
        <Marquee />
        <CVDownload
          cvPath="/assets/Numan-Anjum-Cv.pdf"
          fileName="Numan-Anjum-CV.pdf"
        />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer>
        <div className="wrap">© 2026 Numan Anjum. Built with React.</div>
      </footer>
    </>
  );
}
