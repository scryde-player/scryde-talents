import { Profession } from "@/lib/races";

// ============================================================================
// ТИПЫ ДАННЫХ ИЗ JSON
// ============================================================================

/**
 * Данные о навыке из обработанного JSON файла
 */
export interface SkillData {
  /** ID способности в ветке (1-24) */
  abilityId: number;
  /** ID скилла в игре (93XXX) */
  skillId: number;
  /** Название навыка (английское) */
  name: string;
  /** Краткое описание (русское) */
  description: string;
  /** Тип умения (пока не заполняется) */
  type?: "passive" | "active" | "toggle";
  /** ID иконки для построения пути */
  iconId: string;
  /** Максимальный уровень (1-4) */
  maxLevel: number;
  /** Требуемые очки в ветке для изучения */
  requiredPoints: number;
  /** ID другой способности, от которой зависит эта */
  requiredAbilityId?: number;
  /** Название требуемой способности (для отображения) */
  requiredAbilityName?: string;
  /** Минимальный уровень персонажа для изучения навыка */
  minLevel?: number;
  /** Описания бонусов для каждого уровня */
  levelBonuses: string[];
  /** Номер tier (0-5) */
  tier: number;
  /** Позиция внутри tier (0-3) */
  index: number;
}

/**
 * Данные о ветке талантов из JSON
 */
export interface SkillsetData {
  /** ID ветки (berserk, guardian, adventurer и т.д.) */
  id: string;
  /** Название ветки для отображения */
  name: string;
  /** Массив навыков (24 штуки) */
  skills: SkillData[];
}

/**
 * Структура JSON файла с данными талантов
 */
export interface TalentsDataFile {
  /** Дата актуальности данных (формат: DD.MM.YYYY) */
  version: string;
  /** Дата и время генерации файла */
  generatedAt: string;
  /** Общие ветки для всех классов */
  common: {
    berserk: SkillsetData;
    guardian: SkillsetData;
  };
  /** Уникальные ветки для каждого класса */
  classes: {
    [classId: string]: SkillsetData;
  };
}

// ============================================================================
// ТИПЫ ДЛЯ КОМПОНЕНТОВ (обновленные)
// ============================================================================

/**
 * Навык для отображения в UI (расширение SkillData)
 */
export interface TalentSkill extends SkillData {
  /** Уникальный ID для React key */
  id: string;
  /** Путь к спрайту с иконками */
  icon: string;
  /** @deprecated Путь к изображению описания (заменяется на компонент) */
  image?: string;
}

/**
 * Skillset для отображения в UI
 */
export interface TalentSkillset {
  id: string;
  skills: TalentSkill[];
}

/**
 * Props для компонента TalentsPanel
 */
export interface TalentsPanelProps {
  skillset: TalentSkillset;
  backgroundVariant: "berserk" | "guardian" | "master";
}

/**
 * Props для компонента TalentsWindow
 */
export interface TalentsWindowProps {
  profession: Profession;
}

/**
 * Props для компонента TalentsSkill
 */
export interface TalentsSkillProps {
  skill: TalentSkill;
  currentLevel: number;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  /** Текущее количество очков в ветке для проверки требований */
  currentPointsInBranch?: number;
  /** Изучен ли требуемый навык (для проверки зависимости) */
  isRequiredAbilityLearned?: boolean;
}

/**
 * Props для компонента ResetButton
 */
export interface ResetButonProps {
  onReset: () => void;
  isAvailable: boolean;
}

/**
 * Props для компонента ShareButton
 */
export interface ShareButtonProps {
  onShare: () => void;
  isAvailable: boolean;
}

/**
 * Props для компонента SkillTooltip
 */
export interface SkillTooltipProps {
  skill: TalentSkill;
  currentLevel: number;
  /** Текущее количество очков в ветке для проверки требований */
  currentPointsInBranch?: number;
  /** Изучен ли требуемый навык (для проверки зависимости) */
  isRequiredAbilityLearned?: boolean;
}

/**
 * Props для компонента LevelInput
 */
export interface LevelInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/**
 * Тип сервера для калькулятора
 */
export type ServerType = "low-rate" | "mid-rate";

/**
 * Props для компонента TalentPointsCalculator
 */
export interface TalentPointsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (points: number) => void;
}

/**
 * Props для кнопки управления очками
 */
export interface PointsControlButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  title?: string;
}
