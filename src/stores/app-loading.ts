import { create } from "zustand";

interface AppLoadingStore {
  appLoadingState: boolean;
  setAppLoadingState: (s: boolean) => void;
}

export const useAppLoadingStore = create<AppLoadingStore>((set) => ({
  appLoadingState: false,
  setAppLoadingState: (s) => set({ appLoadingState: s }),
}));
