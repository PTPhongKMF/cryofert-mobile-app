import type { AppointmentResponse } from "@src/schemas/appointment";
import { create } from "zustand";

interface FilterOption {
  type: AppointmentResponse["type"] | null;
  status: AppointmentResponse["status"] | null;
  sortType: "Lastest" | "Upcomming";
}

interface AppointmentHistoryFilterStore {
  filterOptions: FilterOption;
  setFilterOptions: (options: Partial<FilterOption>) => void;
}

export const useAppointmentHistoryFilterStore =
  create<AppointmentHistoryFilterStore>((set) => ({
    filterOptions: {
      type: null,
      status: null,
      sortType: "Lastest",
    },
    setFilterOptions: (options) =>
      set((state) => ({
        filterOptions: { ...state.filterOptions, ...options },
      })),
  }));
