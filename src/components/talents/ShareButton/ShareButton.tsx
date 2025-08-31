"use client";

import { ShareButtonProps } from "@/types/talents";
import styles from "./ShareButton.module.css";
import { useState } from "react";

export const ShareButton = ({ onShare, isAvailable }: ShareButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    onShare();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <div onClick={handleClick} className={styles.container}>
        <button className={`${styles.button} ${
            isAvailable ? styles.buttonActive : ""
            }`} aria-label="Поделиться"
        />
        <div className={styles.buttonTextHolder}>
            <span className={styles.buttonText}>
                Поделиться
            </span>
        </div>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-50 whitespace-nowrap">
            Скопировано в буфер обмена
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
    </div>
  );
};

