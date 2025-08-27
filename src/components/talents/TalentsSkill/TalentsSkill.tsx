"use client";

import { TalentsSkillProps } from "@/types/talents";
import styles from "./TalentsSkill.module.css";
import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";

const imageCache = new Map<
  string,
  { width: number; height: number; element: HTMLImageElement }
>();

export const TalentsSkill = ({
  skill,
  currentLevel,
  onLeftClick,
  onRightClick,
}: TalentsSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(e);
  };

  // Загружаем изображение
  useEffect(() => {
    if (skill.image) {
      // Проверяем кэш
      if (imageCache.has(skill.image)) {
        const cached = imageCache.get(skill.image)!;
        setLoadedImage(cached.element);
        return;
      }

      // Создаем и загружаем изображение
      const img = new Image();
      img.onload = () => {
        // Сохраняем в кэш
        imageCache.set(skill.image, {
          width: img.width,
          height: img.height,
          element: img,
        });
        setLoadedImage(img);
      };
      img.src = skill.image;
    }
  }, [skill.image]);

  // Позиционируем тултип
  useEffect(() => {
    if (isHovered && tooltipRef.current && skillRef.current && loadedImage) {
      const tooltip = tooltipRef.current;
      tooltip.style.width = `${loadedImage.width}px`;
      tooltip.style.height = `${loadedImage.height}px`;
    }
  }, [isHovered, loadedImage]);

  return (
    <div
      ref={skillRef}
      className={styles.skill}
      onClick={onLeftClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${styles.skillImage} ${
          currentLevel > 0 ? styles.skillImageActive : ""
        }`}
        style={{
          backgroundImage: `url(${skill.icon})`,
          backgroundPositionX: `${-3 - (skill.index % 4) * 72}px`,
          backgroundPositionY: `${-3 - skill.tier * 80}px`,
        }}
      />
      <div className={styles.levelIndicator}>
        <span className={styles.levelText}>
          {currentLevel}/{skill.maxLevel}
        </span>
      </div>

      {isHovered && loadedImage && (
        <div ref={tooltipRef} className={styles.tooltip}>
          {/* Вставляем уже загруженное изображение */}
          <NextImage
            width={loadedImage.width}
            height={loadedImage.height}
            src={loadedImage.src}
            alt="Skill description"
            className={styles.tooltipImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
};
