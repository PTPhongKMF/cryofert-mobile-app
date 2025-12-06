import type { CryoContractStatus } from "@src/schemas/cryo-contract";
import { create } from "zustand";

export type CryoContractFilterOptions = {
  status?: CryoContractStatus;
  fromDate?: string;
  toDate?: string;
};

interface CryoContractFilterStore {
  filterOptions: CryoContractFilterOptions;
  setFilterOptions: (options: Partial<CryoContractFilterOptions>) => void;
}

export const useCryoContractFilterStore = create<CryoContractFilterStore>(
  (set) => ({
    filterOptions: {},
    setFilterOptions: (options) =>
      set((state) => ({
        filterOptions: { ...state.filterOptions, ...options },
      })),
  })
);

