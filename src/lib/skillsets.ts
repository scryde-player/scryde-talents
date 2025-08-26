import { TalentSkillset } from "@/types/talents";
import { RACES } from "./races";

function getMaxLevel(index: number) {
  if (index <= 11) return 4;
  if (index <= 15) return 3;
  return 1;
}

const IMAGE_PREFIX = `/assets/images/skills`;

const commonSkillset = (name: string): TalentSkillset => ({
  id: name,
  skills: Array(24)
    .fill(0)
    .map((_, index) => {
      const tier = Math.floor(index / 4);
      const order = index % 4;
      return {
        id: `skill-${name}-${index}`,
        icon: `${IMAGE_PREFIX}/icons/${name}.png`,
        image: `${IMAGE_PREFIX}/full/${name}/${tier + 1}-${order + 1}.png`,
        tier: tier,
        maxLevel: getMaxLevel(index),
        index,
      };
    }),
});

export const SKILLSETS: { [key: string]: TalentSkillset } = {
  Berserk: commonSkillset("berserk"),
  Guardian: commonSkillset("guardian"),
};

RACES.flatMap((race) => race.professions).forEach((profession) => {
  SKILLSETS[profession.id] = commonSkillset(profession.id);
});
