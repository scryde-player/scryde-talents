"use client";

import { ResetButonProps } from "@/types/talents";
import styles from "./ResetButton.module.css";

export const ResetButton = ({ onReset, isAvailable }: ResetButonProps) => {
  return (
    <button
      className={`${styles.button} ${isAvailable ? styles.buttonActive : ""}`}
      onClick={onReset}
      aria-label="Сброс"
    />
  );
};
