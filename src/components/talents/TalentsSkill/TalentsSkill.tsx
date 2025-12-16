"use client";

import { TalentsSkillProps } from "@/types/talents";
import { SkillTooltip } from "../SkillTooltip";
import styles from "./TalentsSkill.module.css";
import { useState, useRef } from "react";

export const TalentsSkill = ({
  skill,
  currentLevel,
  onLeftClick,
  onRightClick,
}: TalentsSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const skillRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const hasLongPressRef = useRef<boolean>(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    hasLongPressRef.current = false;
    touchStartTimeRef.current = Date.now();
    
    longPressTimerRef.current = setTimeout(() => {
      hasLongPressRef.current = true;
      // Создаем синтетическое событие для совместимости с onRightClick
      const syntheticEvent = {
        preventDefault: () => e.preventDefault(),
      } as React.MouseEvent;
      onRightClick(syntheticEvent);
      e.preventDefault();
    }, 500); // 500ms для долгого нажатия
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Если было долгое нажатие, предотвращаем обычный клик
    if (hasLongPressRef.current) {
      e.preventDefault();
      hasLongPressRef.current = false;
      return;
    }

    // Обычный клик (короткое нажатие)
    const touchDuration = Date.now() - touchStartTimeRef.current;
    if (touchDuration < 500) {
      onLeftClick();
    }
  };

  const handleTouchCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    hasLongPressRef.current = false;
  };

  return (
    <div
      ref={skillRef}
      className={styles.skill}
      onClick={onLeftClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${styles.skillImage} ${
          currentLevel > 0 ? styles.skillImageActive : ""
        }`}
        style={{
          backgroundImage: `url(${skill.icon})`,
          backgroundPositionX: `${-3 - skill.index * 72}px`,
          backgroundPositionY: `${-3 - skill.tier * 80}px`,
        }}
      />
      <div className={styles.levelIndicator}>
        <span className={styles.levelText}>
          {currentLevel}/{skill.maxLevel}
        </span>
      </div>

      {isHovered && <SkillTooltip skill={skill} currentLevel={currentLevel} />}
    </div>
  );
};
