/**
 * Скрипт для обработки сырых данных навыков и генерации JSON файла
 *
 * Использование: npx tsx scripts/process-skills-data.ts [дата_данных]
 * Пример: npx tsx scripts/process-skills-data.ts 04.09.2025
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// ТИПЫ ДАННЫХ
// ============================================================================

interface SkillData {
  abilityId: number;
  skillId: number;
  name: string;
  description: string;
  type?: "passive" | "active" | "toggle";
  iconId: string;
  maxLevel: number;
  requiredPoints: number;
  requiredAbilityId?: number;
  requiredAbilityName?: string;
  minLevel?: number; // Минимальный уровень персонажа для изучения навыка
  levelBonuses: string[];
  tier: number;
  index: number;
}

interface SkillsetData {
  id: string;
  name: string;
  skills: SkillData[];
}

interface TalentsDataFile {
  version: string;
  generatedAt: string;
  common: {
    berserk: SkillsetData;
    guardian: SkillsetData;
  };
  classes: {
    [classId: string]: SkillsetData;
  };
}

interface ParsedAbility {
  abilityId: number;
  skillId: number;
  name: string;
  maxLevel: number;
  iconId: string;
  requiredPoints: number;
  requiredAbilityId?: number;
  requiredAbilityName?: string;
  minLevel?: number; // Минимальный уровень персонажа
  descriptionsAddress: string;
}

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================

// Маппинг между именами XML файлов и id профессий
const XML_TO_PROFESSION_ID: Record<string, string> = {
  adventurer: "adventurer",
  arcana_lord: "arcana_lord",
  archmage: "archmage",
  cardinal: "cardinal",
  dominator: "dominator",
  doombringer: "doombringer",
  doomcryer: "doomcryer",
  dreadnought: "dreadnought",
  duelist: "duelist",
  elemental_master: "elemental_master",
  eva_saint: "eva_saint",
  eva_templar: "eva_templar",
  female_soulhound: "female_soul_hound",
  fortune_seeker: "fortune_seeker",
  ghost_hunter: "ghost_hunter",
  ghost_sentinel: "ghost_sentinel",
  grand_khavatari: "grand_khavatari",
  hell_knight: "hell_knight",
  hierophant: "hierophant",
  judicator: "judicator",
  maestro: "maestro",
  male_soulhound: "soul_hound",
  moonlight_sentinel: "moonlight_sentinel",
  mystic_muse: "mystic_muse",
  phantom_summoner: "spectral_master",
  phoenix_knight: "phoenix_knight",
  sagittarius: "sagittarius",
  shilien_templar: "shillien_templar",
  shillien_saint: "shillien_saint",
  soultaker: "soultaker",
  spectral_dancer: "spectral_dancer",
  storm_screamer: "storm_screamer",
  sword_muse: "sword_muse",
  titan: "titan",
  trickster: "trickster",
  windrider: "wind_rider",
};

// Названия профессий для отображения
const PROFESSION_NAMES: Record<string, string> = {
  adventurer: "Adventurer",
  arcana_lord: "Arcana Lord",
  archmage: "Archmage",
  cardinal: "Cardinal",
  dominator: "Dominator",
  doombringer: "Doombringer",
  doomcryer: "Doomcryer",
  dreadnought: "Dreadnought",
  duelist: "Duelist",
  elemental_master: "Elemental Master",
  eva_saint: "Eva's Saint",
  eva_templar: "Eva's Templar",
  female_soul_hound: "Female Soul Hound",
  fortune_seeker: "Fortune Seeker",
  ghost_hunter: "Ghost Hunter",
  ghost_sentinel: "Ghost Sentinel",
  grand_khavatari: "Grand Khavatari",
  hell_knight: "Hell Knight",
  hierophant: "Hierophant",
  judicator: "Judicator",
  maestro: "Maestro",
  soul_hound: "Soul Hound",
  moonlight_sentinel: "Moonlight Sentinel",
  mystic_muse: "Mystic Muse",
  spectral_master: "Spectral Master",
  phoenix_knight: "Phoenix Knight",
  sagittarius: "Sagittarius",
  shillien_templar: "Shillien Templar",
  shillien_saint: "Shillien Saint",
  soultaker: "Soultaker",
  spectral_dancer: "Spectral Dancer",
  storm_screamer: "Storm Screamer",
  sword_muse: "Sword Muse",
  titan: "Titan",
  trickster: "Trickster",
  wind_rider: "Wind Rider",
  berserk: "Berserk",
  guardian: "Guardian",
};

// ============================================================================
// ПАРСИНГ ФАЙЛОВ
// ============================================================================

/**
 * Парсит XML файл с навыками класса
 */
function parseAbilitiesXML(xmlContent: string): ParsedAbility[] {
  const abilities: ParsedAbility[] = [];

  // Регулярное выражение для парсинга ability
  const abilityRegex =
    /<ability\s+id="(\d+)"\s+max_level="(\d+)"\s+name="([^"]+)"\s+descriptions_address="([^"]+)">([\s\S]*?)<\/ability>/g;

  let match;
  while ((match = abilityRegex.exec(xmlContent)) !== null) {
    const [, abilityId, maxLevel, name, descriptionsAddress, innerContent] =
      match;

    // Извлекаем icon
    const iconMatch = innerContent.match(
      /<set\s+name="icon"\s+val="ScrydeIcon\.TalentIcon_(\d+)"\/>/,
    );
    const iconId = iconMatch ? iconMatch[1] : "";

    // Извлекаем required_category_points
    const pointsMatch = innerContent.match(
      /<set\s+name="required_category_points"\s+val="(\d+)"\/>/,
    );
    const requiredPoints = pointsMatch ? parseInt(pointsMatch[1], 10) : 0;

    // Извлекаем required_ability_id если есть
    const requiredAbilityMatch = innerContent.match(
      /<set\s+name="required_ability_id"\s+val="(\d+)"\/>/,
    );
    const requiredAbilityId = requiredAbilityMatch
      ? parseInt(requiredAbilityMatch[1], 10)
      : undefined;

    // Извлекаем required_ability_name если есть
    const requiredAbilityNameMatch = innerContent.match(
      /<set\s+name="required_ability_name"\s+val="([^"]+)"\/>/,
    );
    const requiredAbilityName = requiredAbilityNameMatch
      ? requiredAbilityNameMatch[1]
      : undefined;

    // Извлекаем skill id из первого уровня
    const skillIdMatch = innerContent.match(/<skill\s+id="(\d+)"/);
    const skillId = skillIdMatch ? parseInt(skillIdMatch[1], 10) : 0;

    // Извлекаем min_level из первого level (минимальный уровень персонажа)
    // Ищем все skill элементы в первом level и берём минимальный min_level
    const firstLevelMatch = innerContent.match(
      /<level\s+value="1">([\s\S]*?)<\/level>/,
    );
    let minLevel: number | undefined = undefined;
    if (firstLevelMatch) {
      const firstLevelContent = firstLevelMatch[1];
      const skillMatches = firstLevelContent.matchAll(
        /<skill\s+[^>]*min_level="(\d+)"[^>]*>/g,
      );
      const minLevels: number[] = [];
      for (const match of skillMatches) {
        minLevels.push(parseInt(match[1], 10));
      }
      if (minLevels.length > 0) {
        minLevel = Math.min(...minLevels);
      }
    }

    abilities.push({
      abilityId: parseInt(abilityId, 10),
      skillId,
      name,
      maxLevel: parseInt(maxLevel, 10),
      iconId,
      requiredPoints,
      requiredAbilityId,
      requiredAbilityName,
      minLevel,
      descriptionsAddress,
    });
  }

  return abilities;
}

/**
 * Парсит skills_brief.txt для получения кратких описаний
 */
function parseSkillsBrief(content: string): Map<number, string> {
  const descriptions = new Map<number, string>();

  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split("\t");
    if (parts.length >= 3) {
      const skillId = parseInt(parts[0], 10);
      const description = parts[2];
      if (!isNaN(skillId)) {
        descriptions.set(skillId, description);
      }
    }
  }

  return descriptions;
}

/**
 * Парсит skills_full.txt для получения бонусов по уровням
 */
function parseSkillsFull(content: string): Map<string, string[]> {
  const bonuses = new Map<string, string[]>();

  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith("abilities.description.skill."))
      continue;

    // Пропускаем .extra. записи
    if (trimmed.includes(".extra.")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.substring(0, eqIndex);
    const value = trimmed.substring(eqIndex + 1);

    // Разбиваем по \n для получения бонусов по уровням
    const levelBonuses = value.split("\\n").map((s) => s.trim());

    bonuses.set(key, levelBonuses);
  }

  return bonuses;
}

/**
 * Парсит manual_descriptions.txt для получения ручных описаний
 * Формат: skillId\tname\tdescription (табуляция, как в skills_brief.txt)
 */
function parseManualDescriptions(content: string): Map<
  number,
  { name?: string; description: string }
> {
  const manualData = new Map<number, { name?: string; description: string }>();

  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Разделяем по табуляции (формат: ID\tназвание\tописание)
    const parts = trimmed.split("\t").map((p) => p.trim()).filter((p) => p.length > 0);

    if (parts.length >= 2) {
      const skillId = parseInt(parts[0], 10);
      if (!isNaN(skillId)) {
        if (parts.length >= 3) {
          // Есть ID, название и описание
          const name = parts[1];
          const description = parts.slice(2).join("\t"); // На случай если в описании есть табуляции
          manualData.set(skillId, { name, description });
        } else {
          // Только ID и описание (без названия)
          const description = parts[1];
          manualData.set(skillId, { description });
        }
      }
    }
  }

  return manualData;
}

// ============================================================================
// СОЗДАНИЕ SKILLSET
// ============================================================================

/**
 * Создаёт SkillsetData из распарсенных данных
 */
function createSkillset(
  id: string,
  abilities: ParsedAbility[],
  briefDescriptions: Map<number, string>,
  levelBonuses: Map<string, string[]>,
  manualDescriptions?: Map<number, { name?: string; description: string }>,
): SkillsetData {
  // Сортируем по abilityId для правильного порядка
  const sortedAbilities = [...abilities].sort(
    (a, b) => a.abilityId - b.abilityId,
  );

  const skills: SkillData[] = sortedAbilities.map((ability, index) => {
    // Сначала берём описание из обычного файла
    let description = briefDescriptions.get(ability.skillId) || "";
    let name = ability.name;

    // Применяем ручные описания с приоритетом
    if (manualDescriptions) {
      const manualData = manualDescriptions.get(ability.skillId);
      if (manualData) {
        // Перезаписываем описание
        description = manualData.description;
        // Перезаписываем название если есть
        if (manualData.name) {
          name = manualData.name;
        }
      }
    }

    const bonuses = levelBonuses.get(ability.descriptionsAddress) || [];

    // Вычисляем tier и index в tier
    const tier = Math.floor(index / 4);
    const indexInTier = index % 4;

    return {
      abilityId: ability.abilityId,
      skillId: ability.skillId,
      name,
      description,
      type: undefined, // Пока не заполняем
      iconId: ability.iconId,
      maxLevel: ability.maxLevel,
      requiredPoints: ability.requiredPoints,
      requiredAbilityId: ability.requiredAbilityId,
      requiredAbilityName: ability.requiredAbilityName,
      minLevel: ability.minLevel,
      levelBonuses: bonuses,
      tier,
      index: indexInTier,
    };
  });

  return {
    id,
    name: PROFESSION_NAMES[id] || id,
    skills,
  };
}

// ============================================================================
// КОПИРОВАНИЕ ИКОНОК
// ============================================================================

/**
 * Копирует иконки из папки сырых данных в public
 */
function copyIcons(
  sourceDir: string,
  destDir: string,
  usedIconIds: Set<string>,
): void {
  // Создаём директорию назначения если не существует
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Читаем все файлы в source директории
  const files = fs.readdirSync(sourceDir);

  let copiedCount = 0;
  for (const file of files) {
    // Проверяем что это PNG файл иконки
    const match = file.match(/^TalentIcon_(\d+)\.png$/);
    if (!match) continue;

    const iconId = match[1];

    // Копируем только используемые иконки
    if (usedIconIds.has(iconId)) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);

      fs.copyFileSync(sourcePath, destPath);
      copiedCount++;
    }
  }

  console.log(`  Скопировано ${copiedCount} иконок в ${destDir}`);
}

// ============================================================================
// ОСНОВНАЯ ЛОГИКА
// ============================================================================

function main(): void {
  // Получаем дату данных из аргументов
  const dataDate = process.argv[2] || "04.09.2025";

  console.log(`\n🔄 Обработка данных навыков (версия: ${dataDate})\n`);

  // Пути к директориям
  const rootDir = process.cwd();
  const rawDataDir = path.join(rootDir, "data", "raw", dataDate);
  const processedDir = path.join(rootDir, "data", "processed");
  const skillsByClassDir = path.join(rawDataDir, "skills_by_class");
  const iconsSourceDir = path.join(rawDataDir, "icons");
  const iconsDestDir = path.join(
    rootDir,
    "public",
    "assets",
    "images",
    "skills_icons",
  );

  // Проверяем существование директории с сырыми данными
  if (!fs.existsSync(rawDataDir)) {
    console.error(`❌ Директория с сырыми данными не найдена: ${rawDataDir}`);
    process.exit(1);
  }

  // Создаём директорию для обработанных данных
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
  }

  // Парсим файлы с описаниями
  console.log("📖 Парсинг файлов описаний...");
  const briefContent = fs.readFileSync(
    path.join(rawDataDir, "skills_brief.txt"),
    "utf-8",
  );
  const fullContent = fs.readFileSync(
    path.join(rawDataDir, "skills_full.txt"),
    "utf-8",
  );

  const briefDescriptions = parseSkillsBrief(briefContent);
  const levelBonuses = parseSkillsFull(fullContent);

  console.log(`  Кратких описаний: ${briefDescriptions.size}`);
  console.log(`  Записей с бонусами: ${levelBonuses.size}`);

  // Парсим ручные описания (если файл существует)
  const manualDescriptionsPath = path.join(rootDir, "data", "raw", "manual_descriptions.txt");
  let manualDescriptions: Map<
    number,
    { name?: string; description: string }
  > | undefined = undefined;

  if (fs.existsSync(manualDescriptionsPath)) {
    console.log("\n📝 Парсинг ручных описаний...");
    const manualContent = fs.readFileSync(manualDescriptionsPath, "utf-8");
    manualDescriptions = parseManualDescriptions(manualContent);
    console.log(`  Ручных описаний: ${manualDescriptions.size}`);
  } else {
    console.log("\n📝 Файл manual_descriptions.txt не найден, пропускаем");
  }

  // Собираем все используемые иконки
  const usedIconIds = new Set<string>();

  // Парсим base_abilities.xml для общих веток
  console.log("\n📖 Парсинг общих веток (Berserk, Guardian)...");
  const baseAbilitiesPath = path.join(skillsByClassDir, "base_abilities.xml");
  const baseAbilitiesContent = fs.readFileSync(baseAbilitiesPath, "utf-8");
  const allBaseAbilities = parseAbilitiesXML(baseAbilitiesContent);

  // Разделяем на Berserk (1-24) и Guardian (25-48)
  const berserkAbilities = allBaseAbilities.filter(
    (a) => a.abilityId >= 1 && a.abilityId <= 24,
  );
  const guardianAbilities = allBaseAbilities
    .filter((a) => a.abilityId >= 25 && a.abilityId <= 48)
    .map((a) => ({
      ...a,
      abilityId: a.abilityId - 24, // Нормализуем id для Guardian (25→1, 26→2, etc.)
    }));

  // Собираем иконки из общих веток
  berserkAbilities.forEach((a) => usedIconIds.add(a.iconId));
  guardianAbilities.forEach((a) => usedIconIds.add(a.iconId));

  console.log(`  Berserk: ${berserkAbilities.length} навыков`);
  console.log(`  Guardian: ${guardianAbilities.length} навыков`);

  // Парсим файлы классов
  console.log("\n📖 Парсинг навыков классов...");
  const classSkillsets: Record<string, SkillsetData> = {};

  const xmlFiles = fs
    .readdirSync(skillsByClassDir)
    .filter(
      (f) =>
        f.endsWith(".xml") &&
        f !== "base_abilities.xml" &&
        !f.startsWith("Untitled"),
    );

  for (const xmlFile of xmlFiles) {
    const xmlName = xmlFile.replace(".xml", "");
    const professionId = XML_TO_PROFESSION_ID[xmlName];

    if (!professionId) {
      console.warn(`  ⚠️ Неизвестный XML файл: ${xmlFile}`);
      continue;
    }

    const xmlPath = path.join(skillsByClassDir, xmlFile);
    const xmlContent = fs.readFileSync(xmlPath, "utf-8");
    const abilities = parseAbilitiesXML(xmlContent);

    // Нормализуем abilityId (начинаем с 1)
    const minId = Math.min(...abilities.map((a) => a.abilityId));
    const normalizedAbilities = abilities.map((a) => ({
      ...a,
      abilityId: a.abilityId - minId + 1,
    }));

    // Собираем иконки
    normalizedAbilities.forEach((a) => usedIconIds.add(a.iconId));

    const skillset = createSkillset(
      professionId,
      normalizedAbilities,
      briefDescriptions,
      levelBonuses,
      manualDescriptions,
    );

    classSkillsets[professionId] = skillset;
    console.log(`  ✓ ${professionId}: ${skillset.skills.length} навыков`);
  }

  // Создаём итоговый объект данных
  const outputData: TalentsDataFile = {
    version: dataDate,
    generatedAt: new Date().toISOString(),
    common: {
      berserk: createSkillset(
        "berserk",
        berserkAbilities,
        briefDescriptions,
        levelBonuses,
        manualDescriptions,
      ),
      guardian: createSkillset(
        "guardian",
        guardianAbilities,
        briefDescriptions,
        levelBonuses,
        manualDescriptions,
      ),
    },
    classes: classSkillsets,
  };

  // Сохраняем JSON
  const outputPath = path.join(processedDir, `talents_${dataDate}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), "utf-8");
  console.log(`\n✅ Данные сохранены: ${outputPath}`);

  // Копируем иконки
  console.log("\n📁 Копирование иконок...");
  copyIcons(iconsSourceDir, iconsDestDir, usedIconIds);

  console.log("\n🎉 Обработка завершена!\n");
}

main();
