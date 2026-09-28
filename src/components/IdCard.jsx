import { useEffect, useRef } from "react";

const BARS = [
  2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1,
  3, 2,
];
const INFO = [
  ["Specialty", "React & UI"],
  ["Work", "Remote friendly"],
  ["Stack", "HTML · CSS · JS"],
  ["Status", "Available"],
];

// Photo of Numan used as the ID card avatar. Imported (not a long base64
// string, and not a plain path string) because it lives in src/assets —
// Vite/CRA only serve plain string paths for files placed in public/.
import numanPhoto from "../assets/numan.jpg";
const AVATAR_SRC = numanPhoto;

// Hanging ID card. Drag it sideways or click it and it swings like a real pendulum.
// Colors come from the site's theme variables, so it turns light/dark with the theme toggle.
export default function IdCard() {
  const swing = useRef(null);
  const s = useRef({
    a: 16,
    v: 0,
    drag: false,
    startX: 0,
    startA: 0,
    moved: 0,
    lastT: 0,
  });

  useEffect(() => {
    const st = s.current,
      el = swing.current;
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) st.a = 0;
    let raf,
      last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      if (!st.drag && (!reduce || st.live)) {
        // spring back to hanging straight down
        st.v += (-30 * st.a - 1.4 * st.v) * dt;
        st.a += st.v * dt;
        st.a = Math.max(-30, Math.min(30, st.a));
      }
      const sway = reduce ? 0 : Math.sin(now / 1400) * 0.8; // tiny idle sway
      el.style.transform = `rotate(${st.a + sway}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const down = (e) => {
    const st = s.current;
    st.drag = true;
    st.live = true;
    st.startX = e.clientX;
    st.startA = st.a;
    st.moved = 0;
    st.lastT = performance.now();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };
  const move = (e) => {
    const st = s.current;
    if (!st.drag) return;
    const dx = e.clientX - st.startX;
    st.moved = Math.max(st.moved, Math.abs(dx));
    const na = Math.max(-20, Math.min(20, st.startA - dx * 0.15));
    const now = performance.now();
    st.v = (na - st.a) / Math.max((now - st.lastT) / 1000, 0.008);
    st.lastT = now;
    st.a = na;
  };
  const up = () => {
    const st = s.current;
    if (!st.drag) return;
    st.drag = false;
    if (performance.now() - st.lastT > 80) st.v = 0;
    st.v = Math.max(-250, Math.min(250, st.v));
    if (st.moved < 12) st.v = innerWidth < 600 ? -105 : -140; // a click swings it left to right, then back
  };

  return (
    <div className="lanyard">
      <div
        className="swing"
        ref={swing}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div className="strap" />
        <div className="clip" />
        <div className="idcard" aria-label="Numan Anjum ID card">
          <div className="id-top">
            <img className="avatar" src={AVATAR_SRC} alt="Numan Anjum" />
          </div>
          <div className="id-body">
            <div className="id-name">Numan Anjum</div>
            <div className="role-pill">Frontend Developer</div>
            <div className="id-info">
              {INFO.map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <b>
                    {label === "Status" && <i className="live" />}
                    {value}
                  </b>
                </div>
              ))}
            </div>
            <div className="id-foot">
              <div className="barcode" aria-hidden="true">
                {BARS.map((w, i) => (
                  <span
                    key={i}
                    style={{
                      width: w + "px",
                      height: 14 + ((i * 7) % 12) + "px",
                    }}
                  />
                ))}
              </div>
              <div className="id-no">
                <span>NA-2026-FE</span>
                <span>REACT DEV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="hint">Drag or click the card</p>
    </div>
  );
}
