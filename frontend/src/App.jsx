//frontend\src\App.jsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import InicioScreen from "./screens/inicioScreen";
import NivelScreen from "./screens/Niveles/nivelScreen";
import LecturaScreen from "./screens/Niveles/lecturaScreen";
import BasicoScreen from "./screens/Niveles/basicoScreen";
import ResultadoScreen from "./screens/Niveles/resultadoScreen";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<InicioScreen />} />
        <Route path="/niveles" element={<NivelScreen />} />
        <Route path="/lectura/:nivel" element={<LecturaScreen />} />
        <Route path="/basico" element={<BasicoScreen />} />
        <Route path="/resultado" element={<ResultadoScreen />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
