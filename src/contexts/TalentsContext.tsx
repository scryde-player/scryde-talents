"use client";

import {
  SKILLS_CONDITION_PER_TIER_PER_SKILLSET,
  SKILLS_LIMIT_PER_TIER_PER_SKILLSET,
  MAX_POINTS,
} from "@/lib/constants";
import { TalentSkill, TalentSkillset } from "@/types/talents";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";

interface TalentsContextType {
  skills: Record<string, number>;
  panels: Record<string, number>;
  availablePoints: number;
  incrementSkill: (
    skillId: string,
    panelId: string,
    maxLevel: number,
  ) => boolean;
  decrementSkill: (skillId: string, panelId: string) => boolean;
  totalPoints: number;
  reset: () => void;
  setSkillsets: (skillsets: TalentSkillset[]) => void;
}

const TalentsContext = createContext<TalentsContextType | undefined>(undefined);

interface TalentsProviderProps {
  children: ReactNode;
  initialSkills?: Record<string, number>;
  initialPanels?: Record<string, number>;
}

export const TalentsProvider: React.FC<TalentsProviderProps> = ({
  children,
  initialSkills = {},
  initialPanels = {},
}) => {
  const [skills, setSkills] = useState<Record<string, number>>(initialSkills);
  const [panels, setPanels] = useState<Record<string, number>>(initialPanels);
  const [skillsets, setSkillsets] = useState<TalentSkillset[]>([]);

  useEffect(() => {
    setSkills(initialSkills);
    // Пересчитываем использованные очки
    const initialUsedPoints = Object.values(initialSkills).reduce(
      (sum, level) => sum + level,
      0,
    );
    setAvailablePoints(MAX_POINTS - initialUsedPoints);
  }, [initialSkills]); // Добавлена закрывающая скобка

  const initialUsedPoints = useMemo(
    () => Object.values(initialSkills).reduce((sum, level) => sum + level, 0),
    [initialSkills],
  );

  const [availablePoints, setAvailablePoints] = useState(
    MAX_POINTS - initialUsedPoints,
  );
  const [totalPoints] = useState(MAX_POINTS);

  const skillsMap = useMemo(() => {
    const map = new Map<string, TalentSkill & { skillsetId: string }>();
    skillsets.forEach((set) => {
      set.skills.forEach((skill) => {
        map.set(skill.id, { ...skill, skillsetId: set.id });
      });
    });
    return map;
  }, [skillsets]);

  const countSkillsInTier = (skillsetId: string, tier: number) =>
    skillsets
      .find((set) => set.id === skillsetId)!
      .skills.filter((s) => s.tier === tier)
      .map((s) => skills[s.id] || 0)
      .reduce((sum, i) => i + sum, 0);

  const countSkillsInPreviousTiers = (skillsetId: string, tier: number) =>
    skillsets
      .find((set) => set.id === skillsetId)!
      .skills.filter((s) => s.tier < tier)
      .map((s) => skills[s.id] || 0)
      .reduce((sum, i) => i + sum, 0);

  const countSkillsInNextTiers = (skillsetId: string, tier: number) =>
    skillsets
      .find((set) => set.id === skillsetId)!
      .skills.filter((s) => s.tier > tier)
      .map((s) => skills[s.id] || 0)
      .reduce((sum, i) => i + sum, 0);

  const incrementSkill = (
    skillId: string,
    panelId: string,
    maxLevel: number,
  ): boolean => {
    const currentLevel = skills[skillId] || 0;

    // Проверяем условия для увеличения
    if (availablePoints <= 0 || currentLevel >= maxLevel) {
      return false;
    }

    const skill = skillsMap.get(skillId);
    if (skill === void 0) {
      return false;
    }

    // Найти количество скиллов того же уровня в той же ветке
    const currentTierCount = countSkillsInTier(skill.skillsetId, skill.tier);
    if (currentTierCount >= SKILLS_LIMIT_PER_TIER_PER_SKILLSET[skill.tier]) {
      return false;
    }

    // Найти количество скиллов более низкого уровня в той же ветке
    const prevTiersCount = countSkillsInPreviousTiers(
      skill.skillsetId,
      skill.tier,
    );
    if (prevTiersCount < SKILLS_CONDITION_PER_TIER_PER_SKILLSET[skill.tier]) {
      return false;
    }

    setSkills((prev) => ({ ...prev, [skillId]: currentLevel + 1 }));
    setPanels((prev) => ({ ...prev, [panelId]: (prev[panelId] || 0) + 1 }));
    setAvailablePoints((prev) => prev - 1);
    return true;
  };

  const decrementSkill = (skillId: string, panelId: string): boolean => {
    const currentLevel = skills[skillId] || 0;

    // Проверяем условия для уменьшения
    if (currentLevel <= 0) {
      return false;
    }

    // Найти скилл
    const skill = skillsMap.get(skillId);
    if (skill === void 0) {
      return false;
    }

    // Найти количество скиллов более высокого уровня в той же ветке
    const nextTiersCount = countSkillsInNextTiers(skill.skillsetId, skill.tier);
    if (nextTiersCount > 0) {
      return false;
    }

    setSkills((prev) => ({ ...prev, [skillId]: currentLevel - 1 }));
    setPanels((prev) => ({ ...prev, [panelId]: prev[panelId] - 1 }));
    setAvailablePoints((prev) => prev + 1);
    return true;
  };

  const reset = () => {
    setSkills({});
    setPanels({});
    setAvailablePoints(MAX_POINTS);
  };

  return (
    <TalentsContext.Provider
      value={{
        skills,
        availablePoints,
        incrementSkill,
        decrementSkill,
        totalPoints,
        panels,
        reset,
        setSkillsets,
      }}
    >
      {children}
    </TalentsContext.Provider>
  );
};

export const useTalents = (): TalentsContextType => {
  const context = useContext(TalentsContext);
  if (context === undefined) {
    throw new Error("useTalents must be used within a TalentsProvider");
  }
  return context;
};
