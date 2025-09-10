// src/app/talents/[race]/[profession]/layout.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ProfessionNav } from "@/components/ui/ProfessionNav/ProfessionNav";
import { RACES } from "@/lib/races";
import { Race, Profession } from "@/lib/races";
import { useState, useEffect } from "react";

export default function TalentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const router = useRouter();
  const raceId = params.race as string;
  const professionId = params.profession as string;

  // Находим активные расу и профессию из URL
  const activeRace = RACES.find((r) => r.id === raceId);
  const activeProfession = activeRace?.professions.find(
    (p) => p.id === professionId,
  );

  // Локальное состояние для выбранной расы (только для UI)
  const [selectedRace, setSelectedRace] = useState<Race | undefined>(
    activeRace,
  );
  const [selectedProfession, setSelectedProfession] = useState<
    Profession | undefined
  >(activeProfession);

  // Синхронизируем локальное состояние с URL при изменении параметров
  useEffect(() => {
    setSelectedRace(activeRace);
    setSelectedProfession(activeProfession);
  }, [raceId, professionId, activeRace, activeProfession]);

  const handleRaceChange = (race: Race) => {
    // Только меняем локальное состояние, без навигации
    setSelectedRace(race);
    setSelectedProfession(undefined); // Сбрасываем выбор профессии при смене расы
  };

  const handleProfessionChange = (profession: Profession) => {
    // Навигация только при выборе профессии
    if (selectedRace) {
      router.push(`/talents/${selectedRace.id}/${profession.id}`);
    }
  };

  return (
    <>
      <div className="p-8">
        <ProfessionNav
          races={RACES}
          activeRace={selectedRace}
          activeProfession={selectedProfession}
          onRaceChange={handleRaceChange}
          onProfessionChange={handleProfessionChange}
        />
      </div>
      {children}
    </>
  );
}
