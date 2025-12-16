"use client";

import { useState, useMemo } from "react";
import { TalentPointsCalculatorProps, ServerType } from "@/types/talents";
import { LevelInput } from "@/components/ui/LevelInput";
import { MAX_POINTS } from "@/lib/constants";
import styles from "./TalentPointsCalculator.module.css";

/**
 * Рассчитывает очки талантов для основного класса на Лоу-рейт сервере
 * 1 очко каждые 2 уровня, начиная с 40 и заканчивая 84
 */
const calculateMainClassPointsLowRate = (level: number): number => {
  if (level < 40) return 0;
  const cappedLevel = Math.min(level, 84);
  // Уровни: 40, 42, 44, ..., 84
  return Math.floor((cappedLevel - 40) / 2) + 1;
};

/**
 * Рассчитывает очки талантов для саб-класса на Лоу-рейт сервере
 * 1 очко каждые 3 уровня, начиная с 40 и заканчивая 85
 */
const calculateSubClassPointsLowRate = (level: number): number => {
  if (level < 40) return 0;
  const cappedLevel = Math.min(level, 85);
  // Уровни: 40, 43, 46, ..., 85
  return Math.floor((cappedLevel - 40) / 3) + 1;
};

/**
 * Рассчитывает очки талантов для основного класса на Мид-рейт сервере
 * 1 очко каждые 2 уровня, начиная с 42 и заканчивая 84
 */
const calculateMainClassPointsMidRate = (level: number): number => {
  if (level < 42) return 0;
  const cappedLevel = Math.min(level, 84);
  // Уровни: 42, 44, 46, ..., 84
  return Math.floor((cappedLevel - 42) / 2) + 1;
};

/**
 * Рассчитывает очки талантов для саб-класса на Мид-рейт сервере
 * 1 очко каждые 4 уровня, начиная с 40 и заканчивая 84
 */
const calculateSubClassPointsMidRate = (level: number): number => {
  if (level < 40) return 0;
  const cappedLevel = Math.min(level, 84);
  // Уровни: 40, 44, 48, ..., 84
  return Math.floor((cappedLevel - 40) / 4) + 1;
};

export const TalentPointsCalculator = ({
  isOpen,
  onClose,
  onApply,
}: TalentPointsCalculatorProps) => {
  const [serverType, setServerType] = useState<ServerType>("low-rate");
  const [mainLevel, setMainLevel] = useState(85);
  const [sub1Level, setSub1Level] = useState(85);
  const [sub2Level, setSub2Level] = useState(85);
  const [sub3Level, setSub3Level] = useState(85);

  // Рассчитываем очки талантов
  const calculatedPoints = useMemo(() => {
    let mainPoints: number;
    let sub1Points: number;
    let sub2Points: number;
    let sub3Points: number;

    if (serverType === "low-rate") {
      mainPoints = calculateMainClassPointsLowRate(mainLevel);
      sub1Points = calculateSubClassPointsLowRate(sub1Level);
      sub2Points = calculateSubClassPointsLowRate(sub2Level);
      sub3Points = calculateSubClassPointsLowRate(sub3Level);
    } else {
      mainPoints = calculateMainClassPointsMidRate(mainLevel);
      sub1Points = calculateSubClassPointsMidRate(sub1Level);
      sub2Points = calculateSubClassPointsMidRate(sub2Level);
      sub3Points = calculateSubClassPointsMidRate(sub3Level);
    }

    const total = mainPoints + sub1Points + sub2Points + sub3Points;
    return {
      main: mainPoints,
      sub1: sub1Points,
      sub2: sub2Points,
      sub3: sub3Points,
      total: Math.min(total, MAX_POINTS),
      uncapped: total,
    };
  }, [serverType, mainLevel, sub1Level, sub2Level, sub3Level]);

  // Правила расчета для отображения
  const rulesText = useMemo(() => {
    if (serverType === "low-rate") {
      return (
        <div className={styles.rulesContent}>
          <p><strong>Лоу-рейт сервер:</strong></p>
          <p>• Основной класс: 1 очко каждые 2 уровня (с 40 по 84)</p>
          <p>• Саб-класс: 1 очко каждые 3 уровня (с 40 по 85)</p>
          <p>• Максимум: {MAX_POINTS} очков</p>
        </div>
      );
    } else {
      return (
        <div className={styles.rulesContent}>
          <p><strong>Мид-рейт сервер:</strong></p>
          <p>• Основной класс: 1 очко каждые 2 уровня (с 42 по 84)</p>
          <p>• Саб-класс: 1 очко каждые 4 уровня (с 40 по 84)</p>
          <p>• Максимум: {MAX_POINTS} очков</p>
        </div>
      );
    }
  }, [serverType]);

  const handleApply = () => {
    onApply(calculatedPoints.total);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия */}
        <button className={styles.closeButton} onClick={onClose} title="Закрыть">
          ×
        </button>

        <h2 className={styles.title}>Калькулятор очков талантов</h2>

        {/* Количество очков (ридонли) */}
        <div className={styles.pointsDisplay}>
          <span className={styles.pointsLabel}>Очков талантов:</span>
          <span className={styles.pointsValue}>
            {calculatedPoints.total}
            {calculatedPoints.uncapped > MAX_POINTS && (
              <span className={styles.cappedNote}> (из {calculatedPoints.uncapped})</span>
            )}
          </span>
        </div>

        {/* Выбор сервера */}
        <div className={styles.serverSelection}>
          <span className={styles.sectionLabel}>Сервер:</span>
          <div className={styles.serverButtons}>
            <button
              className={`${styles.serverButton} ${serverType === "low-rate" ? styles.serverButtonActive : ""}`}
              onClick={() => setServerType("low-rate")}
            >
              Лоу-рейт
            </button>
            <button
              className={`${styles.serverButton} ${serverType === "mid-rate" ? styles.serverButtonActive : ""}`}
              onClick={() => setServerType("mid-rate")}
            >
              Мид-рейт
            </button>
          </div>
        </div>

        {/* Уровень основного класса */}
        <div className={styles.levelSection}>
          <span className={styles.sectionLabel}>Основной класс:</span>
          <div className={styles.levelRow}>
            <LevelInput
              label="Уровень"
              value={mainLevel}
              onChange={setMainLevel}
            />
            <span className={styles.pointsInfo}>
              = {calculatedPoints.main} очков
            </span>
          </div>
        </div>

        {/* Уровни саб-классов */}
        <div className={styles.levelSection}>
          <span className={styles.sectionLabel}>Саб-классы:</span>
          <div className={styles.subClassesGrid}>
            <div className={styles.levelRow}>
              <LevelInput
                label="Саб-класс 1"
                value={sub1Level}
                onChange={setSub1Level}
              />
              <span className={styles.pointsInfo}>
                = {calculatedPoints.sub1} очков
              </span>
            </div>
            <div className={styles.levelRow}>
              <LevelInput
                label="Саб-класс 2"
                value={sub2Level}
                onChange={setSub2Level}
              />
              <span className={styles.pointsInfo}>
                = {calculatedPoints.sub2} очков
              </span>
            </div>
            <div className={styles.levelRow}>
              <LevelInput
                label="Саб-класс 3"
                value={sub3Level}
                onChange={setSub3Level}
              />
              <span className={styles.pointsInfo}>
                = {calculatedPoints.sub3} очков
              </span>
            </div>
          </div>
        </div>

        {/* Правила расчета */}
        <div className={styles.rulesSection}>
          {rulesText}
        </div>

        {/* Кнопка применить */}
        <button className={styles.applyButton} onClick={handleApply}>
          OK
        </button>
      </div>
    </div>
  );
};

