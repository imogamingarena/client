import { System } from "@/types/interface";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SysytemStore {
  allSystems: System[] | null;
  updateSystems: (updatedSystem: System[]) => void;
}

export const useStore = create<SysytemStore>()(
  persist(
    (set, get) => ({
      allSystems: null,
      updateSystems: (updatedSystem: System[]) => ({
        allSystems: updatedSystem,
      }),
    }),
    {
      name: "systemStorage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
