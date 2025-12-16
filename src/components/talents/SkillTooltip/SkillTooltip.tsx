"use client";

import { SkillTooltipProps } from "@/types/talents";
import styles from "./SkillTooltip.module.css";

const ICONS_PATH = "/assets/images/skills_icons";

/**
 * Компонент тултипа для отображения информации о навыке
 */
export const SkillTooltip = ({ skill, currentLevel }: SkillTooltipProps) => {
  const iconSrc = `${ICONS_PATH}/TalentIcon_${skill.iconId}.png`;

  /**
   * Определяет CSS класс для элемента уровня
   */
  const getLevelClass = (levelIndex: number): string => {
    const level = levelIndex + 1;

    if (level < currentLevel) {
      return styles.learned; // Уже изучен
    }
    if (level === currentLevel) {
      return styles.current; // Текущий уровень
    }
    if (level === currentLevel + 1 && currentLevel < skill.maxLevel) {
      return styles.available; // Следующий доступный уровень
    }
    return styles.locked; // Заблокирован
  };

  return (
    <div className={styles.tooltip}>
      <div className={styles.container}>
        {/* Заголовок */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconSrc} alt={skill.name} className={styles.icon} />
          </div>
          <div className={styles.titleBlock}>
            <h3 className={styles.name}>{skill.name}</h3>
            {skill.type && <p className={styles.type}>{skill.type}</p>}
          </div>
        </div>

        {/* Краткое описание */}
        {skill.description && (
          <div className={styles.description}>{skill.description}</div>
        )}

        {/* Бонусы по уровням */}
        {skill.levelBonuses.length > 0 && (
          <div className={styles.levels}>
            <p className={styles.levelsTitle}>Уровни</p>
            <div className={styles.levelsList}>
              {skill.levelBonuses.map((bonus, index) => (
                <div
                  key={index}
                  className={`${styles.levelItem} ${getLevelClass(index)}`}
                >
                  <span className={styles.levelNumber}>{index + 1}</span>
                  <span className={styles.levelBonus}>{bonus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Требования (если есть) */}
        {skill.requiredPoints > 0 && (
          <div className={styles.requirements}>
            <div className={styles.requirement}>
              <span className={styles.requirementNotMet}>
                Требуется {skill.requiredPoints} очков в ветке
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
