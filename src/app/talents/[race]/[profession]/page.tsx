"use client";

import { TalentsWindow } from "@/components/talents/TalentsWindow/TalentsWindow";
import { TalentsProvider } from "@/contexts/TalentsContext";
import { RACES } from "@/lib/races";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeBuild } from "@/utils/encoding";

export default function ProfessionPage() {
  const params = useParams();
  const raceId = params.race as string;
  const professionId = params.profession as string;

  // Находим расу по ID
  const race = RACES.find((r) => r.id === raceId);
  if (!race) {
    notFound();
  }

  // Находим профессию в рамках расы
  const profession = race.professions.find((p) => p.id === professionId);
  if (!profession) {
    notFound();
  }

  // Декодируем билд из хэша
  const [initialSkills, setInitialSkills] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#build=")) {
        const encodedString = decodeURIComponent(hash.substring(7));
        try {
          const { skills } = decodeBuild(encodedString);

          console.log("imported skills: " + JSON.stringify(skills));

          setInitialSkills(skills);
        } catch (error) {
          console.error("Ошибка при декодировании билда:", error);
        }
      }
    };

    // Обрабатываем начальный хэш
    handleHashChange();

    // Слушаем изменения хэша
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <TalentsProvider initialSkills={initialSkills}>
      <TalentsWindow profession={profession} />
    </TalentsProvider>
  );
}
