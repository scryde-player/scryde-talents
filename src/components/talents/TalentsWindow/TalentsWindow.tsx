import { TalentsWindowProps } from "@/types/talents";
import { TalentsPanel } from "../TalentsPanel";
import { 
  PanelVariant, 
  MAX_POINTS } from "@/lib/constants";
import { SKILLSETS } from "@/lib/skillsets";
import { useTalents } from "@/contexts/TalentsContext";
import styles from "./TalentsWindow.module.css";
import { ResetButton } from "../ResetButton/ResetButton";
import { ShareButton } from "../ShareButton/ShareButton";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { encodeBuild, decodeBuild, createBuildLink  } from "@/utils/encoding";

export const TalentsWindow = ({ profession }: TalentsWindowProps) => {
  const { availablePoints, reset, setSkillsets, skills } = useTalents();
  const params = useParams();
  const raceId = params.race as string;

  // Получаем скиллы для текущей профессии
  const professionSkills =
    SKILLSETS[profession.id as keyof typeof SKILLSETS] || SKILLSETS.Necromancer;

  useEffect(() => {
    setSkillsets([SKILLSETS.Berserk, SKILLSETS.Guardian, professionSkills]);
  }, [profession, setSkillsets, professionSkills]);

  const handleShare = async () => {
    try {
      // Шифруем текущее состояние
      const encodedString = encodeBuild(raceId, profession.id, skills);
      const buildLink = createBuildLink(raceId, profession.id, skills);

      // Копируем в буфер обмена
      await navigator.clipboard.writeText(buildLink);

      console.log('encoded: ' + JSON.stringify(encodedString));
      console.log('decoded:' + JSON.stringify(decodeBuild(encodedString)));
    } catch (error) {
      console.error("Ошибка при копировании:", error);
      alert("Не удалось скопировать строчку");
    }
  };

  return (
    <div className={styles.window}>
      {/* Заголовок профессии и счетчик очков */}
      <div className={styles.header}>
        <div className={styles.professionTitle}>
          <span className={styles.professionText}>{profession.name}</span>
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

      {/* Кнопки Сброс и Поделиться */}
      <div className={styles.buttonsContainer}>
        <div className={styles.resetButton}>
          <ResetButton
            onReset={reset}
            isAvailable={availablePoints !== MAX_POINTS}
          />
        </div>
        <div className={styles.shareButton}>
          <ShareButton
            onShare={handleShare}
            isAvailable={true}
          />
        </div>
      </div>
    </div>
  );
};

