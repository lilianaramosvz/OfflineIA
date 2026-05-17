//frontend\src\screens\Niveles\lecturaScreen.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import styles from "../../styles/screens/Niveles/lectura.module.css";

const allTexts = {
  basico: import.meta.glob("../../texts/basico/*.txt", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  intermedio: import.meta.glob("../../texts/intermedio/*.txt", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  avanzado: import.meta.glob("../../texts/avanzado/*.txt", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
};

const parseText = (raw) => {
  const lines = raw.split("\n");
  const title = lines[0].replace(/"/g, "").trim();
  const rest = lines.slice(1).join("\n").trim();
  const body = rest
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ");
  return { title, body };
};

function normalizeWord(w) {
  return w
    .toLowerCase()
    .replace(/[.,!?;:¿¡"'()\-]/g, "")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function compareTexts(original, spoken) {
  const origWords = original.split(/\s+/).filter(Boolean);
  const spokenNorm = spoken.split(/\s+/).filter(Boolean).map(normalizeWord);
  let spokenIdx = 0;

  return origWords.map((word) => {
    const origN = normalizeWord(word);
    for (
      let j = spokenIdx;
      j < Math.min(spokenIdx + 5, spokenNorm.length);
      j++
    ) {
      if (origN === spokenNorm[j] || levenshtein(origN, spokenNorm[j]) <= 1) {
        spokenIdx = j + 1;
        return { word, status: "correct" };
      }
    }
    return { word, status: "missed" };
  });
}

const LecturaScreen = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState("listo"); // 'listo' | 'escuchando'
  const [liveTranscript, setLiveTranscript] = useState("");
  const finalRef = useRef("");
  const recognizerRef = useRef(null);

  const escuchando = estado === "escuchando";

  const { title, body, palabras } = useMemo(() => {
    const files = allTexts[nivel] ?? allTexts.basico;
    const contents = Object.values(files);
    const raw = contents[Math.floor(Math.random() * contents.length)];
    const { title, body } = parseText(raw);
    return { title, body, palabras: body.split(/\s+/).filter(Boolean) };
  }, [nivel]);

  // Highlight words in sequence as the student reads (rough count from live transcript)
  const palabrasLeidas = useMemo(() => {
    if (!escuchando) return 0;
    return Math.min(
      liveTranscript.trim().split(/\s+/).filter(Boolean).length,
      palabras.length,
    );
  }, [escuchando, liveTranscript, palabras.length]);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(
        "Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.",
      );
      return;
    }
    finalRef.current = "";
    setLiveTranscript("");

    const rec = new SR();
    rec.lang = "es-MX";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let fin = "",
        inter = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + " ";
        else inter += e.results[i][0].transcript;
      }
      finalRef.current = fin;
      setLiveTranscript(fin + inter);
    };

    rec.onerror = (e) => {
      if (e.error !== "aborted") setEstado("listo");
    };

    recognizerRef.current = rec;
    rec.start();
    setEstado("escuchando");
  }, []);

  const stopRecording = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }
    const spoken = finalRef.current.trim() || liveTranscript;
    const results = compareTexts(body, spoken);
    const correctas = results.filter((r) => r.status === "correct").length;
    const total = results.length;
    const puntaje = total > 0 ? Math.round((correctas / total) * 100) : 0;
    const palabrasPracticar = results
      .filter((r) => r.status === "missed")
      .map((r) => r.word)
      .slice(0, 5);

    navigate("/resultado", {
      state: { puntaje, correctas, total, palabrasPracticar, nivel },
    });
  }, [body, liveTranscript, navigate, nivel]);

  function handleMic() {
    if (estado === "listo") startRecording();
    else if (estado === "escuchando") stopRecording();
  }

  useEffect(() => {
    return () => {
      if (recognizerRef.current) recognizerRef.current.abort();
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* Estado pill */}
      <div
        className={`${styles.estadoPill} ${escuchando ? styles.estadoPillActivo : ""}`}
      >
        <span
          className={`${styles.pulseDot} ${escuchando ? styles.pulseDotActivo : ""}`}
        />
        <span className={styles.estadoText}>
          {escuchando ? "Escuchando..." : "Listo para leer"}
        </span>
      </div>

      {/* Tarjeta de texto */}
      <div className={styles.textCard}>
        <h2 className={styles.textTitle}>{title}</h2>
        <p className={styles.textContent}>
          {palabras.map((palabra, i) => (
            <span
              key={i}
              className={`${styles.word} ${i < palabrasLeidas ? styles.wordCorrect : ""}`}
            >
              {palabra}{" "}
            </span>
          ))}
        </p>
      </div>

      {/* Transcripción live */}
      <div className={styles.transcriptBox}>
        <p className={styles.transcriptText}>
          {liveTranscript || (
            <span className={styles.transcriptPlaceholder}>
              Esperando tu voz...
            </span>
          )}
        </p>
      </div>

      <div className={styles.spacer} />

      {/* Botón micrófono */}
      <div className={styles.micArea}>
        <button
          className={`${styles.micBtn} ${escuchando ? styles.micBtnActivo : ""}`}
          onClick={handleMic}
        >
          {escuchando ? (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                fill="white"
                opacity="0.4"
              />
              <path
                d="M19 10v2a7 7 0 0 1-14 0v-2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
              <line
                x1="12"
                y1="19"
                x2="12"
                y2="23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
              <line
                x1="8"
                y1="23"
                x2="16"
                y2="23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
              <line
                x1="4"
                y1="4"
                x2="20"
                y2="20"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                fill="white"
              />
              <path
                d="M19 10v2a7 7 0 0 1-14 0v-2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="19"
                x2="12"
                y2="23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="23"
                x2="16"
                y2="23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
        <p className={styles.micHint}>
          {escuchando
            ? "Toca para terminar"
            : "Toca el micrófono y lee en voz alta"}
        </p>
      </div>
    </div>
  );
};

export default LecturaScreen;
