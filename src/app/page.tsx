"use client";

import { TalentsWindow } from "@/components/talents/TalentsWindow/TalentsWindow";
import { TalentsProvider } from "@/contexts/TalentsContext";
import { RACES } from "@/lib/races";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <TalentsProvider>
        <TalentsWindow
          profession={
            RACES.flatMap((r) => r.professions).find(
              (p) => p.id === "dreadnought"
            )!
          }
        />
      </TalentsProvider>
    </main>
  );
}
