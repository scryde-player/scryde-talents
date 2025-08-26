import { TalentsWindowProps } from "@/types/talents";
import { TalentsPanel } from "../TalentsPanel";
import { PanelVariant } from "@/lib/constants";
import { SKILLSETS } from "@/lib/skillsets";
import { useTalents } from "@/contexts/TalentsContext";
import styles from "./TalentsWindow.module.css";
import { ResetButton } from "../ResetButton/ResetButton";
import { useEffect } from "react";

export const TalentsWindow = ({ profession }: TalentsWindowProps) => {
  const { availablePoints, reset, setSkillsets } = useTalents();

  // Получаем скиллы для текущей профессии
  const professionSkills =
    SKILLSETS[profession as keyof typeof SKILLSETS] || SKILLSETS.Necromancer;

  useEffect(() => {
    setSkillsets([SKILLSETS.Berserk, SKILLSETS.Guardian, professionSkills]);
  }, [profession, setSkillsets, professionSkills]);

  return (
    <div className={styles.window}>
      {/* Заголовок профессии и счетчик очков */}
      <div className={styles.header}>
        <div className={styles.professionTitle}>
          <span className={styles.professionText}>{profession}</span>
        </div>
        <div className={styles.pointsCounter}>
          <span className="points-text">{availablePoints}</span>
        </div>
      </div>

      {/* Три панели талантов */}
      <div className={`${styles.panelContainer} ${styles.panel1}`}>
        <TalentsPanel
          skillset={SKILLSETS.Berserk}
          backgroundVariant={PanelVariant.Berserk}
        />
      </div>

      <div className={`${styles.panelContainer} ${styles.panel2}`}>
        <TalentsPanel
          skillset={SKILLSETS.Guardian}
          backgroundVariant={PanelVariant.Guardian}
        />
      </div>

      <div className={`${styles.panelContainer} ${styles.panel3}`}>
        <TalentsPanel
          skillset={professionSkills}
          backgroundVariant={PanelVariant.Master}
        />
      </div>

      {/* Кнопка Сброс */}
      <div className={styles.resetButton}>
        <ResetButton onReset={reset} />
      </div>
    </div>
  );
};
