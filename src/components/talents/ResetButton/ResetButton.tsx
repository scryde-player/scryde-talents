"use client";

import { ResetButonProps } from "@/types/talents";
import styles from "./ResetButton.module.css";

export const ResetButton = ({ onReset }: ResetButonProps) => {
  return (
    <button className={styles.button} onClick={onReset} aria-label="Сброс" />
  );
};
