//frontend\src\App.jsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import InicioScreen from "./screens/inicioScreen";
import NivelScreen from "./screens/Niveles/nivelScreen";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<InicioScreen />} />
        <Route path="/niveles" element={<NivelScreen />} />
        {/* rutas pendientes — las implementa el equipo */}
        {/* <Route path="/basico" element={<BasicoScreen />} /> */}
        {/* <Route path="/intermedio" element={<IntermedioScreen />} /> */}
        {/* <Route path="/avanzado" element={<AvanzadoScreen />} /> */}
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
