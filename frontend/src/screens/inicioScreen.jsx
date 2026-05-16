//frontend\src\screens\inicioScreen.jsx
import { useNavigate } from "react-router-dom";
import styles from "../styles/screens/inicio.module.css";

const InicioScreen = () => {
  const navigate = useNavigate();

  const handleStartReading = () => {
    navigate("/niveles");
  };

  return (
    <div className={styles.shell}>
      <main className={styles.page}>
        <div className={styles.decorTopLeft} />
        <div className={styles.decorTopRight} />
        <div className={styles.decorBottomLeft} />
        <div className={styles.decorBottomRight} />

        <div className={styles.content}>
          <div className={styles.logoBubble} aria-hidden="true">
            ✦
          </div>

          <h1 className={styles.title}>Lumi</h1>
          <p className={styles.subtitle}>
            ¡Bienvenido a Lumi, tu amigo de lectura!
          </p>

          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={handleStartReading}>
              Comenzar lectura
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default InicioScreen;
