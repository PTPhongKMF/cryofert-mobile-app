import { create } from "zustand";

interface GenericDialogData {
  title?: string;
  content?: string;
}

interface AlertDialogStore {
  data: GenericDialogData | null;
  isOpen: boolean;
  openAlertDialog: (data: GenericDialogData) => void;
  closeAlertDialog: () => void;
}

export const useAlertDialogStore = create<AlertDialogStore>((set) => ({
  data: null,
  isOpen: false,
  openAlertDialog: (data) => set({ data, isOpen: true }),
  closeAlertDialog: () => set({ isOpen: false, data: null }),
}));

interface SuccessDialogData extends GenericDialogData {
  closeFn?: () => void;
}

interface SuccessDialogStore {
  data: SuccessDialogData | null;
  isOpen: boolean;
  openSuccessDialog: (data: GenericDialogData) => void;
  closeSuccessDialog: () => void;
}

export const useSuccessDialogStore = create<SuccessDialogStore>((set) => ({
  data: null,
  isOpen: false,
  openSuccessDialog: (data) => set({ data, isOpen: true }),
  closeSuccessDialog: () => set({ isOpen: false, data: null }),
}));
