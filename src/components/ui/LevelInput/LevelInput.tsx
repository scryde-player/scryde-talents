"use client";

import { LevelInputProps } from "@/types/talents";
import { declension } from "@/utils/declension";
import styles from "./LevelInput.module.css";

export const LevelInput = ({
  label,
  value,
  onChange,
  min = 1,
  max = 85,
  points,
}: LevelInputProps & { points?: number }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Разрешаем пустое значение при вводе
    if (rawValue === "") {
      onChange(min);
      return;
    }

    const numValue = parseInt(rawValue, 10);

    if (isNaN(numValue)) {
      return;
    }

    // Применяем ограничения
    if (numValue < min) {
      onChange(min);
    } else if (numValue > max) {
      onChange(max);
    } else {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // При потере фокуса убедимся, что значение валидное
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
      />
      {points !== undefined && (
        <span className={styles.pointsInfo}>
          {points} {declension(points, ["очко", "очка", "очков"])}
        </span>
      )}
    </div>
  );
};

