import { Auth } from "@/lib/types";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: Auth | null;
  setUser: (user: Auth) => void;
  clearUser: () => void;
}

const userStoreSlice: StateCreator<UserState> = (set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
  },
  clearUser: () => {
    set({ user: null });
  },
});

const persistedUserStore = persist<UserState>(userStoreSlice, {
  name: "user",
});

export const useUserStore = create(persistedUserStore);
