import { create } from "zustand";

interface ModalState {
  isOpenAddTable: boolean;
  isOpenAddRoom: boolean;
  isOpenEditTable: boolean;
  isOpenRoomModal: boolean;
  openAddTable: () => void;
  closeAddTable: () => void;
  openAddRoom: () => void;
  closeAddRoom: () => void;
  openEditTable: () => void;
  closeEditTable: () => void;
  openRoomModal: () => void;
  closeRoomModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpenAddTable: false,
  isOpenAddRoom: false,
  isOpenEditTable: false,
  isOpenRoomModal: false,
  openAddTable: () => set({ isOpenAddTable: true }),
  closeAddTable: () => set({ isOpenAddTable: false }),
  openAddRoom: () => set({ isOpenAddRoom: true }),
  closeAddRoom: () => set({ isOpenAddRoom: false }),
  openEditTable: () => set({ isOpenEditTable: true }),
  closeEditTable: () => set({ isOpenEditTable: false }),
  openRoomModal: () => set({ isOpenRoomModal: true }),
  closeRoomModal: () => set({ isOpenRoomModal: false }),
}));
