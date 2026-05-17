//frontend\src\screens\inicioScreen.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/screens/inicio.module.css";
import FloatingBubbles from "../components/FloatingBubbles";
import { useDyslexia } from "../hooks/useDyslexia";
import { useDaltonismo } from "../hooks/useDaltonismo";

const InicioScreen = () => {
  const navigate = useNavigate();
  const [dyslexia, toggleDyslexia] = useDyslexia();
  const [daltonismo, toggleDaltonismo] = useDaltonismo();
  const [ollamaStatus, setOllamaStatus] = useState("checking"); // 'checking' | 'connected' | 'offline'

  useEffect(() => {
    fetch("http://localhost:11434/api/tags", {
      signal: AbortSignal.timeout(3000),
    })
      .then((r) =>
        r.ok ? setOllamaStatus("connected") : setOllamaStatus("offline"),
      )
      .catch(() => setOllamaStatus("offline"));
  }, []);

  const statusDot = {
    checking: { color: "#b0bec5", label: "Verificando IA..." },
    connected: { color: "#66bb6a", label: "IA local activa" },
    offline: { color: "#ffa726", label: "IA no disponible" },
  }[ollamaStatus];

  return (
    <div className={styles.shell}>
      <main className={styles.page}>
        <FloatingBubbles count={4} />

        <div className={styles.content}>
          <div className={styles.logoBubble} aria-hidden="true">
            ✦
          </div>
          <h1 className={styles.title}>Lumi</h1>
          <p className={styles.subtitle}>
            ¡Bienvenido a Lumi, tu amigo de lectura!
          </p>

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              onClick={() => navigate("/niveles")}
            >
              Comenzar lectura
            </button>
            <button
              className={`${styles.dyslexiaButton} ${dyslexia ? styles.dyslexiaButtonActivo : ""}`}
              onClick={toggleDyslexia}
            >
              {dyslexia ? "✓ Modo dislexia activo" : "Modo dislexia"}
            </button>
            <button
              className={`${styles.dyslexiaButton} ${daltonismo !== "off" ? styles.daltonismoButtonActivo : ""}`}
              onClick={toggleDaltonismo}
            >
              {daltonismo === "off" && "Modo daltónico"}
              {daltonismo === "deuteranopia" && "✓ Modo daltónico activo"}
            </button>
          </div>
        </div>
        <div className={styles.ollamaBadge}>
          <span
            className={styles.ollamaDot}
            style={{ background: statusDot.color }}
          />
          <span>{statusDot.label}</span>
        </div>
      </main>
    </div>
  );
};

export default InicioScreen;
