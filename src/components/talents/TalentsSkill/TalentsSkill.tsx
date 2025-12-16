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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(e);
  };

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
