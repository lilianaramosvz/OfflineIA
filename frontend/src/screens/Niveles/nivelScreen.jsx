import { useNavigate } from "react-router-dom";

const NivelScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="lumi-shell">
      <main className="lumi-page">
        <h1 className="lumi-title">Niveles</h1>
        <p className="lumi-text">Selecciona uno de los niveles para continuar.</p>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          <button type="button" onClick={() => navigate("/basico")}>
            Básico
          </button>
          <button type="button" onClick={() => navigate("/intermedio")}>
            Intermedio
          </button>
          <button type="button" onClick={() => navigate("/avanzado")}>
            Avanzado
          </button>
        </div>
      </main>
    </div>
  );
};
export default NivelScreen;
