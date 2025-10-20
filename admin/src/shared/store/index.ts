import { create } from "zustand";

interface ModalState {
  successText: string;
  errorText: string;

  isOpenAddTable: boolean;
  isOpenAddRoom: boolean;
  isOpenCancelReservation: boolean;
  isOpenBookingModal: boolean;
  isOpenHistory: boolean;
  isOpenEdit: boolean;
  isSuccess: boolean;
  isError: boolean;
  isDelete: boolean;
  isDeleteError: boolean;

  isOpenUser: boolean;
  isEmpty: boolean;
  isEditRestaurant: boolean;

  openAddTable: () => void;
  closeAddTable: () => void;
  openAddRoom: () => void;
  closeAddRoom: () => void;
  closeCancelReservation: () => void;
  openCancelReservation: () => void;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  openHistory: () => void;
  closeHistory: () => void;
  openEdit: () => void;
  closeEdit: () => void;
  openSuccess: () => void;
  closeSuccess: () => void;
  openError: () => void;
  closeError: () => void;
  openDelete: () => void;
  closeDelete: () => void;
  openDeleteError: () => void;
  closeDeleteError: () => void;

  openUser: () => void;
  closeUser: () => void;

  setSuccessText: (text: string) => void;
  resetSuccessText: () => void;
  setErrorText: (text: string) => void;
  resetErrorText: () => void;

  resetEmpty: () => void;
  setEmpty: () => void;
  openEditRestaurant: () => void;
  closeEditRestaurant: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpenAddTable: false,
  isOpenAddRoom: false,
  isOpenCancelReservation: false,
  isOpenBookingModal: false,
  isOpenEditTable: false,
  isOpenHistory: false,
  isOpenEdit: false,
  isSuccess: false,
  isError: false,
  isDelete: false,
  isDeleteError: false,
  isOpenUser: false,
  isEmpty: false,
  isEditRestaurant: false,

  openAddTable: () => set({ isOpenAddTable: true }),
  closeAddTable: () => set({ isOpenAddTable: false }),
  openAddRoom: () => set({ isOpenAddRoom: true }),
  closeAddRoom: () => set({ isOpenAddRoom: false }),
  closeCancelReservation: () => set({ isOpenCancelReservation: false }),
  openCancelReservation: () => set({ isOpenCancelReservation: true }),
  openBookingModal: () => set({ isOpenBookingModal: true }),
  closeBookingModal: () => set({ isOpenBookingModal: false }),
  openHistory: () => set({ isOpenHistory: true }),
  closeHistory: () => set({ isOpenHistory: false }),
  openEdit: () => set({ isOpenEdit: true }),
  closeEdit: () => set({ isOpenEdit: false }),
  openSuccess: () => set({ isSuccess: true }),
  closeSuccess: () => set({ isSuccess: false }),
  openError: () => set({ isError: true }),
  closeError: () => set({ isError: false }),
  openDelete: () => set({ isDelete: true }),
  closeDelete: () => set({ isDelete: false }),
  openDeleteError: () => set({ isDeleteError: true }),
  closeDeleteError: () => set({ isDeleteError: false }),
  resetEmpty: () => set({ isEmpty: false }),
  setEmpty: () => set({ isEmpty: true }),

  openUser: () => set({ isOpenUser: true }),
  closeUser: () => set({ isOpenUser: false }),

  successText: "",
  errorText: "",
  setSuccessText: (text) => set({ successText: text }),
  resetSuccessText: () => set({ successText: "" }),
  setErrorText: (text) => set({ errorText: text }),
  resetErrorText: () => set({ errorText: "" }),
  openEditRestaurant: () => set({ isEditRestaurant: true }),
  closeEditRestaurant: () => set({ isEditRestaurant: false }),
}));
