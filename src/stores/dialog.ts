import { create } from "zustand";

interface GenericDialogData {
  title?: string;
  content?: string;
}

interface AlertDialogData extends GenericDialogData {
  closeFn?: () => void;
}

interface AlertDialogStore {
  data: AlertDialogData | null;
  isOpen: boolean;
  openAlertDialog: (data: AlertDialogData) => void;
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
  openSuccessDialog: (data: SuccessDialogData) => void;
  closeSuccessDialog: () => void;
}

export const useSuccessDialogStore = create<SuccessDialogStore>((set) => ({
  data: null,
  isOpen: false,
  openSuccessDialog: (data) => set({ data, isOpen: true }),
  closeSuccessDialog: () => set({ isOpen: false, data: null }),
}));

interface OtpDialogStore {
  email: string;
  isOpen: boolean;
  openOtpDialog: (e: string) => void;
  closeOtpDialog: () => void;
}

export const useOtpDialogStore = create<OtpDialogStore>((set) => ({
  email: "",
  isOpen: false,
  openOtpDialog: (e) => set({ email: e, isOpen: true }),
  closeOtpDialog: () => set({ email: "", isOpen: false }),
}));
