import { create } from "zustand";

interface AppLoadingStore {
  loaders: Set<string>;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  reset: () => void;
}

export const useAppLoadingStore = create<AppLoadingStore>((set) => ({
  loaders: new Set<string>(),

  startLoading: (key) =>
    set((s) => {
      const next = new Set(s.loaders);
      next.add(key);
      return { loaders: next };
    }),

  stopLoading: (key) =>
    set((s) => {
      const next = new Set(s.loaders);
      next.delete(key);
      return { loaders: next };
    }),

  reset: () => set({ loaders: new Set<string>() }),
}));
