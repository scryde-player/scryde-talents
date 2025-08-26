import { Profession } from "@/lib/races";

export interface TalentSkill {
  id: string;
  icon: string;
  image: string;
  maxLevel: number;
  tier: number;
  index: number;
}

export interface TalentSkillset {
  id: string;
  skills: TalentSkill[];
}

export interface TalentsPanelProps {
  skillset: TalentSkillset;
  backgroundVariant: "berserk" | "guardian" | "master";
}

export interface TalentsWindowProps {
  profession: Profession;
}

export interface TalentsSkillProps {
  skill: TalentSkill;
  currentLevel: number;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export interface ResetButonProps {
  onReset: () => void;
  isAvailable: boolean;
}
