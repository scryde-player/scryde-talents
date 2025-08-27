"use client";

import { TalentsWindow } from "@/components/talents/TalentsWindow/TalentsWindow";
import { TalentsProvider } from "@/contexts/TalentsContext";
import { RACES } from "@/lib/races";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

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

  return (
    <TalentsProvider>
      <TalentsWindow profession={profession} />
    </TalentsProvider>
  );
}
