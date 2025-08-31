"use client";

import { ShareButtonProps } from "@/types/talents";
import styles from "./ShareButton.module.css";

export const ShareButton = ({ onShare, isAvailable }: ShareButtonProps) => {
  return (
    <div onClick={onShare} >
        <button className={`${styles.button} ${
            isAvailable ? styles.buttonActive : ""
            }`} aria-label="Поделиться" 
        />
        <div className={styles.buttonTextHolder}>
            <span className={styles.buttonText}>
                Поделиться
            </span>
        </div>
    </div>
  );
};
