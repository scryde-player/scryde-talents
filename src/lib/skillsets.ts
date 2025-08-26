import { TalentSkillset } from "@/types/talents";

function getMaxLevel(index: number) {
  if (index <= 11) return 4;
  if (index <= 15) return 3;
  return 1;
}

const commonSkillset = (name: string): TalentSkillset => ({
  id: name,
  skills: Array(24)
    .fill(0)
    .map((_, index) => {
      const tier = Math.floor(index / 4);
      const order = index % 4;
      return {
        id: `skill-${name}-${index}`,
        icon: `/assets/images/icons/common/${name}/${tier + 1}-${order + 1}.png`,
        image: `/assets/images/icons/common/${name}/1-1.png`,
        tier: tier,
        maxLevel: getMaxLevel(index),
      };
    }),
});

const mockSkillset = (id: string): TalentSkillset => ({
  id,
  skills: Array(24)
    .fill(0)
    .map((_, index) => ({
      id: `skill-${id}-${index}`,
      icon: "/assets/images/icons/skill-1-1.png",
      image: "/assets/images/talents/skill-default.jpg",
      tier: Math.floor(index / 4),
      maxLevel: getMaxLevel(index),
    })),
});

export const SKILLSETS: { [key: string]: TalentSkillset } = {
  Berserk: commonSkillset("berserk"),
  Guardian: mockSkillset("Guardian"),
  Necromancer: mockSkillset("Necromancer"),
};
