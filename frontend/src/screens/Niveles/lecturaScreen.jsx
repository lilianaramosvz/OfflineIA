import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import styles from "../../styles/screens/Niveles/lectura.module.css";

// ── Textos por nivel ──────────────────────────────────────────────────────
const allTexts = {
  basico: import.meta.glob("../../texts/basico/*.txt", { query: "?raw", import: "default", eager: true }),
  intermedio: import.meta.glob("../../texts/intermedio/*.txt", { query: "?raw", import: "default", eager: true }),
  avanzado: import.meta.glob("../../texts/avanzado/*.txt", { query: "?raw", import: "default", eager: true }),
};

const LEVEL_LABELS = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const parseText = (raw) => {
  const lines = raw.split("\n");
  const title = lines[0].replace(/"/g, "").trim();
  const rest = lines.slice(1).join("\n").trim();
  const body = rest.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).join(" ");
  return { title, body };
};

// ── Simulación de lectura ─────────────────────────────────────────────────
function useSimulacion(escuchando, total) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!escuchando) { setIdx(0); return; }
    const interval = setInterval(() => {
      setIdx(prev => (prev < total ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [escuchando, total]);

  return idx;
}

// ── Componente ────────────────────────────────────────────────────────────
const LecturaScreen = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState("listo");
  const escuchando = estado === "escuchando";

  // Texto aleatorio del nivel
  const { title, palabras } = useMemo(() => {
    const files = allTexts[nivel] ?? allTexts.basico;
    const contents = Object.values(files);
    const raw = contents[Math.floor(Math.random() * contents.length)];
    const { title, body } = parseText(raw);
    return { title, palabras: body.split(" ").filter(Boolean) };
  }, [nivel]);

  const palabrasLeidas = useSimulacion(escuchando, palabras.length);
  const transcripcion = palabras.slice(0, palabrasLeidas).join(" ");

  // Auto-navegar al terminar
  useEffect(() => {
    if (palabrasLeidas >= palabras.length && palabras.length > 0) {
      navigate("/resultado", {
        state: {
          puntaje: 92,
          correctas: Math.round(palabras.length * 0.92),
          total: palabras.length,
          palabrasPracticar: [],
        },
      });
    }
  }, [palabrasLeidas, palabras.length]);

  function handleMic() {
    if (estado === "listo") {
      setEstado("escuchando");
    } else if (estado === "escuchando") {
      navigate("/resultado", {
        state: {
          puntaje: 92,
          correctas: Math.round(palabrasLeidas * 0.92),
          total: palabras.length,
          palabrasPracticar: [],
        },
      });
    }
  }

  return (
    <div className={styles.container}>

      {/* Estado pill */}
      <div className={`${styles.estadoPill} ${escuchando ? styles.estadoPillActivo : ""}`}>
        <span className={`${styles.pulseDot} ${escuchando ? styles.pulseDotActivo : ""}`} />
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
          {transcripcion || <span className={styles.transcriptPlaceholder}>Esperando tu voz...</span>}
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
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white" opacity="0.4"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
              <line x1="8"  y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
              <line x1="4"  y1="4"  x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8"  y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <p className={styles.micHint}>
          {escuchando ? "Toca para terminar" : "Toca el micrófono y lee en voz alta"}
        </p>
      </div>

    </div>
  );
};

export default LecturaScreen;
