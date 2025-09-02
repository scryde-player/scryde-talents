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
  code: number
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
      { id: "dreadnought", name: "Dreadnought", code: 89 },
      { id: "duelist", name: "Duelist", code: 88 },
      { id: "phoenix_knight", name: "Phoenix Knight", code: 90 },
      { id: "hell_knight", name: "Hell Knight", code: 91 },
      { id: "adventurer", name: "Adventurer", code: 93 },
      { id: "sagittarius", name: "Sagittarius", code: 92 },
    ],
  },
  {
    id: "human_mystic",
    name: "Human Mystic",
    professions: [
      { id: "archmage", name: "Archmage", code: 94 },
      { id: "soultaker", name: "Soultaker", code: 95 },
      { id: "arcana_lord", name: "Arcana Lord", code: 96 },
      { id: "cardinal", name: "Cardinal", code: 97 },
      { id: "hierophant", name: "Hierophant", code: 98 },
    ],
  },
  {
    id: "elven_fighter",
    name: "Elven Fighter",
    professions: [
      { id: "eva_templar", name: "Eva's Templar", code: 99 },
      { id: "sword_muse", name: "Sword Muse", code: 100 },
      { id: "wind_rider", name: "Wind Rider", code: 101 },
      { id: "moonlight_sentinel", name: "Moonlight Sentinel", code: 102 },
    ],
  },
  {
    id: "elven_mystic",
    name: "Elven Mystic",
    professions: [
      { id: "mystic_muse", name: "Mystic Muse", code: 103 },
      { id: "elemental_master", name: "Elemental Master", code: 104 },
      { id: "eva_saint", name: "Eva's Saint", code: 105 },
    ],
  },
  {
    id: "dark_fighter",
    name: "Dark Fighter",
    professions: [
      { id: "shillien_templar", name: "Shillien Templar", code: 106 },
      { id: "spectral_dancer", name: "Spectral Dancer", code: 107 },
      { id: "ghost_hunter", name: "Ghost Hunter", code: 108 },
      { id: "ghost_sentinel", name: "Ghost Sentinel", code: 109 },
    ],
  },
  {
    id: "dark_mystic",
    name: "Dark Mystic",
    professions: [
      { id: "storm_screamer", name: "Storm Screamer", code: 110 },
      { id: "spectral_master", name: "Spectral Master", code: 111 },
      { id: "shillien_saint", name: "Shillien Saint", code: 112 },
    ],
  },
  {
    id: "orc_fighter",
    name: "Orc Fighter",
    professions: [
      { id: "titan", name: "Titan", code: 113 },
      { id: "grand_khavatari", name: "Grand Khavatari", code: 114 },
    ],
  },
  {
    id: "orc_mystic",
    name: "Orc Mystic",
    professions: [
      { id: "dominator", name: "Dominator", code: 115 },
      { id: "doomcryer", name: "Doomcryer", code: 116 },
    ],
  },
  {
    id: "dwarven_fighter",
    name: "Dwarven Fighter",
    professions: [
      { id: "fortune_seeker", name: "Fortune Seeker", code: 117 },
      { id: "maestro", name: "Maestro", code: 118 },
    ],
  },
  {
    id: "kamael_male",
    name: "Kamael Male",
    professions: [
      { id: "doombringer", name: "Doombringer", code: 131 },
      { id: "soul_hound", name: "Soul Hound", code: 132 },
      { id: "judicator", name: "Judicator", code: 136 },
    ],
  },
  {
    id: "kamael_female",
    name: "Kamael Female",
    professions: [
      { id: "female_soul_hound", name: "Female Soul Hound", code: 133 },
      { id: "trickster", name: "Trickster", code: 134 },
      { id: "judicator", name: "Judicator", code: 136 },
    ],
  },
] as const;
