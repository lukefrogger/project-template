import { create } from "zustand";

export type GlobalStoreProps = {
  id: string;
};

type GlobalStore_T = {
  userInfo: GlobalStoreProps | null;
  setUserInfo: (userInfo: GlobalStoreProps | null) => void;
};

export const useGlobalStore = create<GlobalStore_T>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
}));
