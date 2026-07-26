import { create } from 'zustand';
import { INITIAL_USERS } from '../data/mockData';

export const useAuthStore = create((set, get) => ({
  user: INITIAL_USERS[0], // Default logged in as Super Admin
  isAuthenticated: true,

  login: (email, password) => {
    const foundUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      set({ user: foundUser, isAuthenticated: true });
      return { success: true };
    }
    // Fallback demo login if matching role keyword
    if (email.includes('admin') || password) {
      const demoUser = INITIAL_USERS[0];
      set({ user: demoUser, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, error: 'Email atau password salah' };
  },

  switchDemoUser: (userId) => {
    const foundUser = INITIAL_USERS.find(u => u.id === userId);
    if (foundUser) {
      set({ user: foundUser, isAuthenticated: true });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  isSuperAdmin: () => {
    const { user } = get();
    return user && user.role === 'Super Admin';
  },

  getAssignedWarehouse: () => {
    const { user } = get();
    return user ? user.assignedWarehouse : null;
  }
}));
