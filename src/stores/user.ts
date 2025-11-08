import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Preferences } from "@capacitor/preferences";
import type { StateStorage } from "zustand/middleware";

interface LocalUser {
  id: string;
  userName: string;
  roleId: string;
  roleName: string;
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
  setLocalUser: (newUser: LocalUser | null) => void;
}

export const useLocalUserStore = create<UserStore>()(
  persist(
    (set) => ({
      localUser: null,
      setLocalUser: (newUser) => set({ localUser: newUser }),
    }),
    {
      name: "local-user",
      partialize: (state) => ({ localUser: state.localUser }),
      storage: createJSONStorage(() => capPrefStorage),
    }
  )
);
