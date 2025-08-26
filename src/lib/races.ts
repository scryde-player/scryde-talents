// Типы для профессий
export type ProfessionId =
  | "dreadnought"
  | "duelist"
  | "phoenix_knight"
  | "hell_knight"
  | "adventurer"
  | "sagittarius"
  | "archmage"
  | "soultaker"
  | "arcana_lord"
  | "cardinal"
  | "hierophant"
  | "eva_templar"
  | "sword_muse"
  | "wind_rider"
  | "moonlight_sentinel"
  | "mystic_muse"
  | "elemental_master"
  | "eva_saint"
  | "shillien_templar"
  | "spectral_dancer"
  | "ghost_hunter"
  | "ghost_sentinel"
  | "storm_screamer"
  | "spectral_master"
  | "shillien_saint"
  | "titan"
  | "grand_khavatari"
  | "dominator"
  | "doomcryer"
  | "fortune_seeker"
  | "maestro"
  | "doombringer"
  | "soul_hound"
  | "judicator"
  | "female_soul_hound"
  | "trickster";

export type ProfessionName =
  | "Dreadnought"
  | "Duelist"
  | "Phoenix Knight"
  | "Hell Knight"
  | "Adventurer"
  | "Sagittarius"
  | "Archmage"
  | "Soultaker"
  | "Arcana Lord"
  | "Cardinal"
  | "Hierophant"
  | "Eva's Templar"
  | "Sword Muse"
  | "Wind Rider"
  | "Moonlight Sentinel"
  | "Mystic Muse"
  | "Elemental Master"
  | "Eva's Saint"
  | "Shillien Templar"
  | "Spectral Dancer"
  | "Ghost Hunter"
  | "Ghost Sentinel"
  | "Storm Screamer"
  | "Spectral Master"
  | "Shillien Saint"
  | "Titan"
  | "Grand Khavatari"
  | "Dominator"
  | "Doomcryer"
  | "Fortune Seeker"
  | "Maestro"
  | "Doombringer"
  | "Soul Hound"
  | "Judicator"
  | "Female Soul Hound"
  | "Trickster";

export interface Profession {
  id: ProfessionId;
  name: ProfessionName;
}

// Типы для рас
export type RaceId =
  | "human_fighter"
  | "human_mystic"
  | "elven_fighter"
  | "elven_mystic"
  | "dark_fighter"
  | "dark_mystic"
  | "orc_fighter"
  | "orc_mystic"
  | "dwarven_fighter"
  | "kamael_male"
  | "kamael_female";

export type RaceName =
  | "Human Fighter"
  | "Human Mystic"
  | "Elven Fighter"
  | "Elven Mystic"
  | "Dark Fighter"
  | "Dark Mystic"
  | "Orc Fighter"
  | "Orc Mystic"
  | "Dwarven Fighter"
  | "Kamael Male"
  | "Kamael Female";

export interface Race {
  id: RaceId;
  name: RaceName;
  professions: Profession[];
}

export const RACES: Race[] = [
  {
    id: "human_fighter",
    name: "Human Fighter",
    professions: [
      { id: "dreadnought", name: "Dreadnought" },
      { id: "duelist", name: "Duelist" },
      { id: "phoenix_knight", name: "Phoenix Knight" },
      { id: "hell_knight", name: "Hell Knight" },
      { id: "adventurer", name: "Adventurer" },
      { id: "sagittarius", name: "Sagittarius" },
    ],
  },
  {
    id: "human_mystic",
    name: "Human Mystic",
    professions: [
      { id: "archmage", name: "Archmage" },
      { id: "soultaker", name: "Soultaker" },
      { id: "arcana_lord", name: "Arcana Lord" },
      { id: "cardinal", name: "Cardinal" },
      { id: "hierophant", name: "Hierophant" },
    ],
  },
  {
    id: "elven_fighter",
    name: "Elven Fighter",
    professions: [
      { id: "eva_templar", name: "Eva's Templar" },
      { id: "sword_muse", name: "Sword Muse" },
      { id: "wind_rider", name: "Wind Rider" },
      { id: "moonlight_sentinel", name: "Moonlight Sentinel" },
    ],
  },
  {
    id: "elven_mystic",
    name: "Elven Mystic",
    professions: [
      { id: "mystic_muse", name: "Mystic Muse" },
      { id: "elemental_master", name: "Elemental Master" },
      { id: "eva_saint", name: "Eva's Saint" },
    ],
  },
  {
    id: "dark_fighter",
    name: "Dark Fighter",
    professions: [
      { id: "shillien_templar", name: "Shillien Templar" },
      { id: "spectral_dancer", name: "Spectral Dancer" },
      { id: "ghost_hunter", name: "Ghost Hunter" },
      { id: "ghost_sentinel", name: "Ghost Sentinel" },
    ],
  },
  {
    id: "dark_mystic",
    name: "Dark Mystic",
    professions: [
      { id: "storm_screamer", name: "Storm Screamer" },
      { id: "spectral_master", name: "Spectral Master" },
      { id: "shillien_saint", name: "Shillien Saint" },
    ],
  },
  {
    id: "orc_fighter",
    name: "Orc Fighter",
    professions: [
      { id: "titan", name: "Titan" },
      { id: "grand_khavatari", name: "Grand Khavatari" },
    ],
  },
  {
    id: "orc_mystic",
    name: "Orc Mystic",
    professions: [
      { id: "dominator", name: "Dominator" },
      { id: "doomcryer", name: "Doomcryer" },
    ],
  },
  {
    id: "dwarven_fighter",
    name: "Dwarven Fighter",
    professions: [
      { id: "fortune_seeker", name: "Fortune Seeker" },
      { id: "maestro", name: "Maestro" },
    ],
  },
  {
    id: "kamael_male",
    name: "Kamael Male",
    professions: [
      { id: "doombringer", name: "Doombringer" },
      { id: "soul_hound", name: "Soul Hound" },
      { id: "judicator", name: "Judicator" },
    ],
  },
  {
    id: "kamael_female",
    name: "Kamael Female",
    professions: [
      { id: "female_soul_hound", name: "Female Soul Hound" },
      { id: "trickster", name: "Trickster" },
      { id: "judicator", name: "Judicator" },
    ],
  },
] as const;
