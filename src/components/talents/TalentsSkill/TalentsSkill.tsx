"use client";

import { TalentsSkillProps } from "@/types/talents";
import styles from "./TalentsSkill.module.css";

export const TalentsSkill = ({
  skill,
  currentLevel,
  onLeftClick,
  onRightClick,
}: TalentsSkillProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(e);
  };

  return (
    <div
      className={styles.skill}
      onClick={onLeftClick}
      onContextMenu={handleContextMenu}
    >
      <div
        className={`${styles.skillImage} ${
          currentLevel > 0 ? styles.skillImageActive : ""
        }`}
        style={{ 
          backgroundImage: `url(${skill.icon})`,
          backgroundPosition: '0 0', // Левый верхний угол
          backgroundSize: 'auto', // Исходный размер изображения
          width: '40px',
          height: '40px',
          backgroundRepeat: 'no-repeat' 
        }}
      />
      <div className={styles.levelIndicator}>
        <span className={styles.levelText}>
          {currentLevel}/{skill.maxLevel}
        </span>
      </div>
    </div>
  );
};
