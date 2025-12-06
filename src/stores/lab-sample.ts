import type {
  LabSampleSortType,
  LabSampleStatus,
  LabSampleType,
} from "@src/schemas/lab-sample";
import { create } from "zustand";

export type LabSampleFilterOptions = {
  type: LabSampleType | null;
  status: LabSampleStatus | null;
  sortType: LabSampleSortType;
};

interface LabSampleFilterStore {
  filterOptions: LabSampleFilterOptions;
  setFilterOptions: (options: Partial<LabSampleFilterOptions>) => void;
}

export const useLabSampleFilterStore = create<LabSampleFilterStore>((set) => ({
  filterOptions: {
    type: null,
    status: null,
    sortType: "LatestCollection",
  },
  setFilterOptions: (options) =>
    set((state) => ({
      filterOptions: { ...state.filterOptions, ...options },
    })),
}));

