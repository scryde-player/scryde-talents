import {
  TalentSkillset,
  TalentSkill,
  TalentsDataFile,
  SkillData,
} from "@/types/talents";
import { RACES } from "./races";
import talentsData from "../../data/processed/talents_13.01.2026.json";

const IMAGE_PREFIX = `/assets/images/skills`;

/**
 * Преобразует SkillData из JSON в TalentSkill для UI
 */
function convertToTalentSkill(
  skillData: SkillData,
  skillsetId: string,
  index: number,
): TalentSkill {
  return {
    ...skillData,
    id: `skill-${skillsetId}-${index}`,
    icon: `${IMAGE_PREFIX}/icons/${skillsetId}.png`,
    // Оставляем image для обратной совместимости (deprecated)
    image: `${IMAGE_PREFIX}/full/${skillsetId}/${skillData.tier + 1}-${skillData.index + 1}.png`,
  };
}

/**
 * Создаёт TalentSkillset из данных JSON
 */
function createSkillsetFromData(
  skillsetId: string,
  data: TalentsDataFile["common"]["berserk"],
): TalentSkillset {
  return {
    id: skillsetId,
    skills: data.skills.map((skill, index) =>
      convertToTalentSkill(skill, skillsetId, index),
    ),
  };
}

/**
 * Создаёт пустой skillset (фоллбэк если данные отсутствуют)
 */
function createEmptySkillset(skillsetId: string): TalentSkillset {
  return {
    id: skillsetId,
    skills: Array(24)
      .fill(0)
      .map((_, index) => {
        const tier = Math.floor(index / 4);
        const indexInTier = index % 4;
        const maxLevel = index <= 11 ? 4 : index <= 15 ? 3 : 1;

        return {
          abilityId: index + 1,
          skillId: 0,
          name: `Skill ${index + 1}`,
          description: "",
          iconId: "",
          maxLevel,
          requiredPoints: tier * 8,
          levelBonuses: [],
          tier,
          index: indexInTier,
          id: `skill-${skillsetId}-${index}`,
          icon: `${IMAGE_PREFIX}/icons/${skillsetId}.png`,
          image: `${IMAGE_PREFIX}/full/${skillsetId}/${tier + 1}-${indexInTier + 1}.png`,
        };
      }),
  };
}

// Типизируем импортированные данные
const data = talentsData as TalentsDataFile;

// Создаём SKILLSETS из JSON данных
export const SKILLSETS: { [key: string]: TalentSkillset } = {};

// Добавляем общие ветки
SKILLSETS["Berserk"] = createSkillsetFromData("berserk", data.common.berserk);
SKILLSETS["Guardian"] = createSkillsetFromData(
  "guardian",
  data.common.guardian,
);

// Добавляем ветки для каждой профессии
RACES.flatMap((race) => race.professions).forEach((profession) => {
  const classData = data.classes[profession.id];

  if (classData) {
    SKILLSETS[profession.id] = createSkillsetFromData(profession.id, classData);
  } else {
    // Фоллбэк для классов без данных
    console.warn(`Нет данных для класса: ${profession.id}`);
    SKILLSETS[profession.id] = createEmptySkillset(profession.id);
  }
});

// Экспортируем версию данных для отображения
export const TALENTS_DATA_VERSION = data.version;
export const TALENTS_DATA_GENERATED_AT = data.generatedAt;
