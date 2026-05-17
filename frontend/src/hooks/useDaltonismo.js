//frontend\src\hooks\useDaltonismo.js
import { useState, useEffect } from "react";

const KEY = "lumi-daltonismo";

export function useDaltonismo() {
  const [mode, setMode] = useState(() => localStorage.getItem(KEY) || "off");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("daltonismo-deuteranopia");
    if (mode !== "off") html.classList.add(`daltonismo-${mode}`);
    localStorage.setItem(KEY, mode);
  }, [mode]);

  const toggle = () =>
    setMode((v) => (v === "off" ? "deuteranopia" : "off"));

  return [mode, toggle];
}
