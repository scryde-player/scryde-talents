"use client";

import { ShareButtonProps } from "@/types/talents";
import styles from "./ShareButton.module.css";

export const ShareButton = ({ onShare, isAvailable }: ShareButtonProps) => {
  return (
    <button className={`${styles.button} ${
      isAvailable ? styles.buttonActive : ""
    }`} onClick={onShare} aria-label="Поделиться" />
  );
};
