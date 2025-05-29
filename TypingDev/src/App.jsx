import { useState, useEffect, useRef } from "react";
import "./index.css";
import "./App.css";
import "./Main.css";

import SNIPS from "./snippets.js";

// Utility: pick random element
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Typing test duration (in seconds)
const D = 60;

export default function App() {
  // React state variables
  const [lang, setLang] = useState("javascript"); // selected language
  const [text, setText] = useState(pick(SNIPS[lang])); // code to type
  const [chars, setChars] = useState([]); // user-typed characters
  const [idx, setIdx] = useState(0); // current character index
  const [started, setStarted] = useState(false); // whether typing started
  const [time, setTime] = useState(D); // remaining time
  const [done, setDone] = useState(false); // whether test is over
  const [err, setErr] = useState(0); // error count
  const inp = useRef(null); // reference to the hidden textarea

  // Load a fresh local snippet
  function handleReload() {
    resetState(pick(SNIPS[lang]));
  }

  // Helper: reset everything
  function resetState(code) {
    setText(code);
    setChars([]);
    setIdx(0);
    setTime(D);
    setStarted(false);
    setDone(false);
    setErr(0);
    inp.current?.focus();
  }

  // When language changes → new snippet
  useEffect(() => {
    handleReload();
  }, [lang]);

  // Countdown timer logic
  useEffect(() => {
    let t;
    if (started && !done) {
      t = setInterval(() => {
        setTime((s) => {
          if (s <= 1) {
            setDone(true);
            clearInterval(t);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [started, done]);

  // Focus hidden textarea on start
  useEffect(() => {
    inp.current?.focus();
  }, [started]);

  // Key handler
  function key(e) {
    if (done) return;
    if (!started) setStarted(true);

    // Handle Tab → insert four spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const spaces = "    ";
      setChars((c) => [...c, ...spaces.split("")]);
      setIdx((i) => i + spaces.length);
      return;
    }

    // Handle Enter → newline
    let v = e.key;
    if (v === "Enter") {
      e.preventDefault();
      v = "\n";
    }

    if (v.length !== 1) return;

    setChars((c) => [...c, v]);

    if (v === text[idx]) setIdx((i) => i + 1);
    else setErr((e) => e + 1);

    if (idx + 1 === text.length) setDone(true);
  }

  // WPM & accuracy
  const wpm = Math.round(idx / 5 / ((D - time) / 60) || 0);
  const acc = idx === 0 ? 100 : Math.max(0, Math.round(((idx - err) / idx) * 100));

  // UI
  return (
    <div className="app">
      <header className="header">
        <h1>TypingDev</h1>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          {Object.keys(SNIPS).map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </header>

      {!done ? (
        <div className="main" onClick={() => inp.current?.focus()}>
          <pre className="text">
            {[...text].map((c, i) => (
              <span
                key={i}
                className={
                  i === idx
                    ? "active"
                    : i < idx
                    ? chars[i] === c
                      ? "correct"
                      : "incorrect"
                    : ""
                }
              >
                {c}
              </span>
            ))}
          </pre>
          <div className="stats">
            <span>{wpm} wpm</span>
            <span>{acc}%</span>
            <span>{time}s</span>
          </div>
          <textarea
            ref={inp}
            className="hiddenInput"
            onKeyDown={key}
            rows={1}
          />
        </div>
      ) : (
        <div className="main done">
          <div className="stats final">
            <div className="stat">
              <span className="value">{wpm}</span>
              <span className="label">wpm</span>
            </div>
            <div className="stat">
              <span className="value">{acc}</span>
              <span className="label">acc</span>
            </div>
            <div className="stat">
              <span className="value">{time}</span>
              <span className="label">s</span>
            </div>
          </div>
          <button className="reloadBtn" onClick={handleReload}>
            <svg width="25" height="25" viewBox="0 0 24 24">
              <path d="M12 5v3l4-4-4-4v3C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10h-2
                      c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
            </svg>
          </button>
        </div>
      )}

      {/* GitHub fetch logic kept for future use
      // import SNIPS from remote gists instead
      */}
    </div>
  );
}
