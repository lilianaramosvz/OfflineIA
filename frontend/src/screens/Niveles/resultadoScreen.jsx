//frontend\src\screens\Niveles\resultadoScreen.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/screens/Niveles/resultado.module.css";

async function pedirFeedbackOllama({
  puntaje,
  correctas,
  total,
  palabrasPracticar,
}) {
  const missed =
    palabrasPracticar.length > 0
      ? `Las palabras que le costaron trabajo fueron: ${palabrasPracticar.join(", ")}.`
      : "Leyó todas las palabras correctamente.";

  const prompt =
    `Eres Lumi, un tutor amigable para niños de primaria en México. ` +
    `Un niño acaba de terminar una sesión de lectura en voz alta. ` +
    `Obtuvo ${puntaje}% de exactitud: leyó correctamente ${correctas} de ${total} palabras. ` +
    `${missed} ` +
    `Escribe un mensaje corto (máximo 2 oraciones) de retroalimentación positiva y alentadora, ` +
    `usando un lenguaje sencillo y amigable para niños. No uses asteriscos ni listas.`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3.2", prompt, stream: false }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) throw new Error("Ollama error");
  const data = await res.json();
  return data.response?.trim() ?? "";
}

export default function ResultadoScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const puntaje = state?.puntaje ?? 0;
  const correctas = state?.correctas ?? 0;
  const total = state?.total ?? 0;
  const palabrasPracticar = state?.palabrasPracticar ?? [];
  const nivel = state?.nivel ?? "basico";

  const [ollamaMsg, setOllamaMsg] = useState(null);
  const [ollamaLoading, setOllamaLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    pedirFeedbackOllama({ puntaje, correctas, total, palabrasPracticar })
      .then((msg) => {
        if (!cancelled) setOllamaMsg(msg);
      })
      .catch(() => {
        /* Ollama no disponible — no mostrar nada */
      })
      .finally(() => {
        if (!cancelled) setOllamaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function getMensaje(p) {
    if (p >= 90)
      return {
        titulo: "¡Increíble trabajo!",
        subtitulo: "Eres una estrella de la lectura",
      };
    if (p >= 70)
      return {
        titulo: "¡Muy bien hecho!",
        subtitulo: "Sigue practicando y lo lograrás",
      };
    if (p >= 50)
      return {
        titulo: "¡Buen intento!",
        subtitulo: "La práctica hace al maestro",
      };
    return {
      titulo: "¡Ánimo, tú puedes!",
      subtitulo: "Inténtalo de nuevo, vas a mejorar",
    };
  }

  function getEstrellas(p) {
    if (p >= 90) return 3;
    if (p >= 70) return 2;
    return 1;
  }

  const { titulo, subtitulo } = getMensaje(puntaje);
  const estrellas = getEstrellas(puntaje);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Ícono superior */}
        <div className={styles.iconCircle}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z"
              fill="#2d3748"
              opacity="0.85"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className={styles.titulo}>{titulo}</h1>
        <p className={styles.subtitulo}>{subtitulo}</p>

        {/* Puntaje */}
        <div className={styles.puntajeBox}>
          <span className={styles.puntajeNum}>{puntaje}%</span>
          <span className={styles.puntajeLabel}>
            {correctas} de {total} palabras
          </span>
        </div>

        {/* Estrellas */}
        <div className={styles.estrellasRow}>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`${styles.estrella} ${i <= estrellas ? styles.estrellaActiva : styles.estrellaVacia}`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Palabras para practicar */}
        {palabrasPracticar.length > 0 && (
          <div className={styles.practicarBox}>
            <p className={styles.practicarLabel}>Palabras para practicar:</p>
            <div className={styles.practicarTags}>
              {palabrasPracticar.map((p, i) => (
                <span key={i} className={styles.tag}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Feedback de IA (Ollama) */}
        {ollamaLoading && (
          <div className={styles.ollamaCard}>
            <p className={styles.ollamaLabel}>Lumi dice...</p>
            <p className={styles.ollamaPensando}>pensando...</p>
          </div>
        )}
        {!ollamaLoading && ollamaMsg && (
          <div className={styles.ollamaCard}>
            <p className={styles.ollamaLabel}>Lumi dice:</p>
            <p className={styles.ollamaMsg}>{ollamaMsg}</p>
          </div>
        )}

        {/* Botones */}
        <div className={styles.botonesRow}>
          <button
            className={styles.btnReintentar}
            onClick={() => navigate(`/lectura/${nivel}`)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M1 4v6h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.51 15a9 9 0 1 0 .49-4.95"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Intentar otra vez
          </button>
          <button
            className={styles.btnVolver}
            onClick={() => navigate("/niveles")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="9 22 9 12 15 12 15 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
