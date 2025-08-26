import { TalentsPanelProps } from "@/types/talents";
import { TalentsSkill } from "../TalentsSkill";
import { useTalents } from "@/contexts/TalentsContext";
import styles from "./TalentsPanel.module.css";
import { declension } from "@/utils/declension";

export const TalentsPanel = ({
  skillset,
  backgroundVariant,
}: TalentsPanelProps) => {
  const { skills, panels, incrementSkill, decrementSkill } = useTalents();

  const handleSkillLeftClick = (skillId: string, maxLevel: number) => {
    return () => {
      incrementSkill(skillId, skillset.id, maxLevel);
    };
  };

  const handleSkillRightClick = (skillId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      decrementSkill(skillId, skillset.id);
    };
  };

  return (
    <div
      className={styles.panel}
      style={{
        backgroundImage: `url(/assets/images/background-panel-${backgroundVariant}.png)`,
      }}
    >
      <div className={`${styles.skillsCounter} points-text`}>
        {panels[skillset.id] || 0}{" "}
        {declension(panels[skillset.id] || 0, ["очко", "очка", "очков"])}
      </div>
      <div className={styles.skillsGrid}>
        {skillset.skills.map((skill, index) => (
          <div key={skill.id || index} className={styles.skillSlot}>
            <TalentsSkill
              skill={skill}
              currentLevel={skills[skill.id] || 0}
              onLeftClick={handleSkillLeftClick(skill.id, skill.maxLevel)}
              onRightClick={handleSkillRightClick(skill.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
