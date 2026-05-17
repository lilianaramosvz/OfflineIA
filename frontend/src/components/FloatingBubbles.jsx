//frontend\src\components\FloatingBubbles.jsx
import { useMemo } from "react";
import styles from "../styles/components/floatingBubbles.module.css";

const COLORS = [
  "var(--lumi-sky)",
  "var(--lumi-mint)",
  "var(--lumi-butter)",
  "var(--lumi-peach)",
  "var(--lumi-turquoise)",
];

// Una burbuja por esquina, siempre lejos del contenido central
const CORNERS = [
  { topRange: [3, 18],  leftRange: [2, 16]  }, // arriba-izquierda
  { topRange: [3, 18],  leftRange: [78, 91] }, // arriba-derecha
  { topRange: [76, 90], leftRange: [2, 16]  }, // abajo-izquierda
  { topRange: [76, 90], leftRange: [78, 91] }, // abajo-derecha
];

const rand = (min, max) => min + Math.random() * (max - min);

const FloatingBubbles = ({ count = 4 }) => {
  const bubbles = useMemo(() => {
    const clamped = Math.min(count, 4);
    const shuffled = [...CORNERS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, clamped).map((corner, i) => ({
      id: i,
      top: `${rand(...corner.topRange)}%`,
      left: `${rand(...corner.leftRange)}%`,
      size: `${rand(3.5, 6)}rem`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: rand(0.3, 0.5),
    }));
  }, [count]);

  return (
    <>
      {bubbles.map(({ id, top, left, size, color, opacity }) => (
        <div
          key={id}
          className={styles.bubble}
          style={{ top, left, width: size, height: size, background: color, opacity }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default FloatingBubbles;
