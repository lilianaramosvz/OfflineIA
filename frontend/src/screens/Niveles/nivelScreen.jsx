//frontend\src\screens\Niveles\nivelScreen.jsx
import { useNavigate } from "react-router-dom";
import { Sprout, Leaf, Bell, ArrowLeft } from "lucide-react";
import styles from "../../styles/screens/Niveles/nivel.module.css";
import FloatingBubbles from "../../components/FloatingBubbles";

const LEVELS = [
  {
    key: "basico",
    label: "Básico",
    description: "Palabras simples y frases cortas",
    Icon: Sprout,
    bubbleClass: styles.bubbleMint,
    route: "/lectura/basico",
  },
  {
    key: "intermedio",
    label: "Intermedio",
    description: "Textos más largos con palabras nuevas",
    Icon: Leaf,
    bubbleClass: styles.bubbleSky,
    route: "/lectura/intermedio",
  },
  {
    key: "avanzado",
    label: "Avanzado",
    description: "Historias completas y vocabulario amplio",
    Icon: Bell,
    bubbleClass: styles.bubbleButter,
    route: "/lectura/avanzado",
  },
];

const NivelScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.shell}>
      <main className={styles.page}>
        <FloatingBubbles count={4} />

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/inicio")}
        >
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <h1 className={styles.title}>Elige tu nivel</h1>
        <p className={styles.subtitle}>¿Qué quieres leer hoy?</p>

        <div className={styles.grid}>
          {LEVELS.map(({ key, label, description, Icon, bubbleClass, route }) => (
            <button
              key={key}
              type="button"
              className={styles.card}
              onClick={() => navigate(route)}
            >
              <span className={`${styles.bubble} ${bubbleClass}`}>
                <Icon size={32} strokeWidth={2} color="#fff" aria-hidden="true" />
              </span>
              <strong className={styles.cardTitle}>{label}</strong>
              <p className={styles.cardDescription}>{description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NivelScreen;
