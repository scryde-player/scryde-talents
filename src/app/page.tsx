"use client";

import { TalentsWindow } from "@/components/talents/TalentsWindow/TalentsWindow";
import { TalentsProvider } from "@/contexts/TalentsContext";
import { Profession } from "@/lib/constants";

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
        <TalentsWindow profession={Profession.Warlord} />
      </TalentsProvider>
    </main>
  );
}
