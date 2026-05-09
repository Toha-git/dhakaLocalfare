import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as AuthService from '../services/AuthService';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await AuthService.getCurrentUser();
          set({ user: userData, loading: false });
        } catch (err) {
          console.error('Error loading user:', err);
          set({ loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        set({ user: result.user, loading: false });
      } else {
        set({ error: result.error, loading: false });
      }
      return result;
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  register: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const result = await AuthService.register(email, password, displayName);
      set({ loading: false });
      return result;
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await AuthService.logout();
      set({ user: null, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const result = await AuthService.updateUserProfile(auth.currentUser.uid, updates);
      if (result.success) {
        set((state) => ({
          user: { ...state.user, ...updates },
          loading: false,
        }));
      }
      return result;
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },
}));
