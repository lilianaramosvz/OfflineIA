//frontend\src\screens\Niveles\lecturaScreen.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import styles from "../../styles/screens/Niveles/lectura.module.css";
import FloatingBubbles from "../../components/FloatingBubbles";

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
  const paragraphs = rest.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return { title, paragraphs };
};

const LecturaScreen = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();

  const { title, paragraphs } = useMemo(() => {
    const files = allTexts[nivel] ?? allTexts.basico;
    const contents = Object.values(files);
    const raw = contents[Math.floor(Math.random() * contents.length)];
    return parseText(raw);
  }, [nivel]);

  return (
    <div className={styles.shell}>
      <main className={styles.page}>
        <FloatingBubbles count={4} />

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/niveles")}
        >
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <article className={styles.card}>
          <span className={`${styles.badge} ${styles[`badge_${nivel}`]}`}>
            {LEVEL_LABELS[nivel] ?? "Básico"}
          </span>
          <h1 className={styles.title}>{title}</h1>
          {paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>{p}</p>
          ))}
        </article>
      </main>
    </div>
  );
};

export default LecturaScreen;
