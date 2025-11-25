import { create } from "zustand";

export type ButtonType = {
  text?: string;
  color?: "primary" | "success" | "warning" | "danger" | "medium";
  closeFn?: () => void;
};

interface BaseGenericDialogOptions {
  svgIcon?: string;
  svgIconColor?: "primary" | "success" | "warning" | "danger";
  backdropDismiss?: boolean;
  buttons?: ButtonType | ButtonType[];
}

type GenericDialogOptions = (
  | { title: string; content?: string }
  | { title?: string; content: string }
) &
  BaseGenericDialogOptions;

interface GenericDialogStore {
  data: GenericDialogOptions | null;
  isOpen: boolean;
  openGenericDialog: (data: GenericDialogOptions) => void;
  closeGenericDialog: () => void;
}

export const useGenericDialogStore = create<GenericDialogStore>((set) => ({
  data: null,
  isOpen: false,
  openGenericDialog: (data) => set({ data, isOpen: true }),
  closeGenericDialog: () => {
    set({ isOpen: false });
  },
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
