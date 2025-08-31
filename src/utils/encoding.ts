import { RACES } from "@/lib/races";
import { SKILLSETS } from "@/lib/skillsets";

export const encodeBuild = (
  raceId: string, 
  professionId: string, 
  skills: Record<string, number>
): string => {
  const raceIndex = RACES.findIndex(race => race.id === raceId);
  const race = RACES[raceIndex];

  const professionIndex = race
    ? race.professions.findIndex(p => p.id === professionId)
    : 0;

  const raceProfessionCode = `${raceIndex.toString().padStart(2, '0')}${professionIndex}`;

  let skillsCode = '';

  const panels = [SKILLSETS.Berserk, SKILLSETS.Guardian, SKILLSETS[professionId]];

  panels.forEach((panel, panelIndex) => {
    panel.skills.forEach((skill, skillIndex) => {
      const level = skills[skill.id] || 0;
    if (level > 0) {
        const globalSkillNumber = panelIndex * 24 + skillIndex;
        skillsCode += `${globalSkillNumber.toString().padStart(2, '0')}${level}`;
    }
  });
  });

  const fullCode = `${raceProfessionCode}${skillsCode}`;
  return btoa(fullCode);
};

export const decodeBuild = (encodedString: string): {
  raceId: string;
  professionId: string;
  skills: Record<string, number>;
} => {
  const decodedString = atob(encodedString);

  const raceIndex = parseInt(decodedString.substring(0, 2));
  const professionIndex = parseInt(decodedString.substring(2, 3));

  const race = RACES[raceIndex];
  const profession = race?.professions[professionIndex];

  const skills: Record<string, number> = {};
  const skillsPart = decodedString.substring(3);

  for (let i = 0; i < skillsPart.length; i += 3) {
    const skillNumber = parseInt(skillsPart.substring(i, i + 2));
    const level = parseInt(skillsPart.substring(i + 2, i + 3));

    const panelIndex = Math.floor(skillNumber / 24);
    const localSkillIndex = skillNumber % 24;

    let skillId = '';
    if (panelIndex === 0) {
      skillId = SKILLSETS.Berserk.skills[localSkillIndex]?.id;
    } else if (panelIndex === 1) {
      skillId = SKILLSETS.Guardian.skills[localSkillIndex]?.id;
    } else if (panelIndex === 2 && profession) {
      skillId = SKILLSETS[profession.id]?.skills[localSkillIndex]?.id;
  }

    if (skillId) {
      skills[skillId] = level;
    }
  }

  return {
    raceId: race?.id || '',
    professionId: profession?.id || '',
    skills
  };
};

export const createBuildLink = (
  raceId: string,
  professionId: string,
  skills: Record<string, number>,
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin : ''
): string => {
  const encoded = encodeBuild(raceId, professionId, skills);
  return `${baseUrl}/talents/${raceId}/${professionId}#build=${encodeURIComponent(encoded)}`;
};

