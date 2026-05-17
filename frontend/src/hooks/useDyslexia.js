//frontend\src\hooks\useDyslexia.js
import { useState, useEffect } from "react";

const KEY = "lumi-dyslexia";

export function useDyslexia() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(KEY) === "true");

  useEffect(() => {
    document.body.classList.toggle("dyslexia", enabled);
    localStorage.setItem(KEY, String(enabled));
  }, [enabled]);

  const toggle = () => setEnabled((v) => !v);

  return [enabled, toggle];
}
