import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Preferences } from "@capacitor/preferences";
import type { StateStorage } from "zustand/middleware";

interface LocalUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleName: string;
  gender: boolean | null;
}

const capPrefStorage: StateStorage = {
  getItem: async (key: string) => {
    const { value } = await Preferences.get({ key });
    return value ?? null;
  },
  setItem: async (key: string, value: string) => {
    await Preferences.set({ key, value });
  },
  removeItem: async (key: string) => {
    await Preferences.remove({ key });
  },
};

interface UserStore {
  localUser: LocalUser | null;
  hasHydrated: boolean;
  setLocalUser: (newUser: LocalUser | null) => void;
  clearLocalUser: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useLocalUserStore = create<UserStore>()(
  persist(
    (set) => ({
      localUser: null,
      hasHydrated: false,
      setLocalUser: (newUser) => set({ localUser: newUser }),
      clearLocalUser: () => set({ localUser: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "local-user",
      partialize: (state) => ({ localUser: state.localUser }),
      storage: createJSONStorage(() => capPrefStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
