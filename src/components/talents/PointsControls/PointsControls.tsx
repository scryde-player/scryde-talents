"use client";

import { MAX_POINTS } from "@/lib/constants";
import styles from "./PointsControls.module.css";

interface PointsControlsProps {
  totalPoints: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onOpenCalculator: () => void;
}

export const PointsControls = ({
  totalPoints,
  onIncrement,
  onDecrement,
  onOpenCalculator,
}: PointsControlsProps) => {
  return (
    <div className={styles.container}>
      {/* Кнопка + */}
      <button
        className={`${styles.button} ${styles.incrementButton}`}
        onClick={onIncrement}
        disabled={totalPoints >= MAX_POINTS}
        title="Добавить очко талантов"
        aria-label="Добавить очко талантов"
      >
        +
      </button>

      {/* Кнопка - */}
      <button
        className={`${styles.button} ${styles.decrementButton}`}
        onClick={onDecrement}
        disabled={totalPoints <= 1}
        title="Убрать очко талантов"
        aria-label="Убрать очко талантов"
      >
        −
      </button>

      {/* Кнопка калькулятора */}
      <button
        className={`${styles.button} ${styles.calculatorButton}`}
        onClick={onOpenCalculator}
        title="Открыть калькулятор"
        aria-label="Открыть калькулятор очков талантов"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="8" y2="10.01" />
          <line x1="12" y1="10" x2="12" y2="10.01" />
          <line x1="16" y1="10" x2="16" y2="10.01" />
          <line x1="8" y1="14" x2="8" y2="14.01" />
          <line x1="12" y1="14" x2="12" y2="14.01" />
          <line x1="16" y1="14" x2="16" y2="14.01" />
          <line x1="8" y1="18" x2="8" y2="18.01" />
          <line x1="12" y1="18" x2="16" y2="18" />
        </svg>
      </button>
    </div>
  );
};

