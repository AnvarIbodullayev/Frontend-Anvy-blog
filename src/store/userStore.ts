import { create } from "zustand";

interface UserState {
  userId: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
  avatar: string | null;
  setUser: (user: { userId: string; username: string; email: string; role: string, avatar: string }) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: null,
  email: null,
  role: null,
  avatar: null,
  setUser: (user) => set({ ...user }),
  clearUser: () => set({ userId: null, username: null, email: null, role: null, avatar: null }),
}));

export default useUserStore;
