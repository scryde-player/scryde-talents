"use client";

import { useState } from "react";
import { Race, Profession } from "@/lib/races";
import styles from "./ProfessionNav.module.css";

interface ProfessionNavProps {
  races: Race[];
  activeRace?: Race;
  activeProfession?: Profession;
  onRaceChange: (race: Race) => void;
  onProfessionChange: (profession: Profession) => void;
}

export function ProfessionNav({
  races,
  activeRace,
  activeProfession,
  onRaceChange,
  onProfessionChange,
}: ProfessionNavProps) {
  const [isRaceOpen, setIsRaceOpen] = useState(false);
  const [isProfessionOpen, setIsProfessionOpen] = useState(false);

  const handleRaceSelect = (race: Race) => {
    onRaceChange(race);
    setIsRaceOpen(false);
    setIsProfessionOpen(false); // Закрываем оба меню при выборе расы
  };

  const handleProfessionSelect = (profession: Profession) => {
    setIsProfessionOpen(false);
    if (profession !== activeProfession) {
      onProfessionChange(profession);
    }
  };

  return (
    <div className={styles.navContainer}>
      {/* Race Selector */}
      <div className={styles.selectWrapper}>
        <button
          className={styles.selectButton}
          onClick={() => setIsRaceOpen(!isRaceOpen)}
          aria-expanded={isRaceOpen}
        >
          {activeRace?.name || "Select Race"}
          <span className={styles.arrow}>▼</span>
        </button>

        {isRaceOpen && (
          <div className={styles.dropdown}>
            {races.map((race) => (
              <button
                key={race.id}
                className={styles.dropdownItem}
                onClick={() => handleRaceSelect(race)}
              >
                {race.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Profession Selector */}
      <div className={styles.selectWrapper}>
        <button
          className={styles.selectButton}
          onClick={() => activeRace && setIsProfessionOpen(!isProfessionOpen)}
          disabled={!activeRace}
          aria-expanded={isProfessionOpen}
        >
          {activeProfession?.name || "Select Profession"}
          <span className={styles.arrow}>▼</span>
        </button>

        {isProfessionOpen && activeRace && (
          <div className={styles.dropdown}>
            {activeRace.professions.map((profession) => (
              <button
                key={profession.id}
                className={styles.dropdownItem}
                onClick={() => handleProfessionSelect(profession)}
              >
                {profession.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
