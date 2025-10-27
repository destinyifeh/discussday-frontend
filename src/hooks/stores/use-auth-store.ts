// stores/useAuthStore.ts
import {toast} from '@/components/ui/toast';
import {UserProps} from '@/types/user.types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type AuthState = {
  currentUser: UserProps | null;
  selectedUser: any;
  isLoading: boolean;
  setSelectedUser: (data: any) => void;
  setUser: (data: UserProps) => void;
  logout: () => void;
  sessionExpiredAction: () => void;
  isAuthenticated: boolean;
  hasHydrated: boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: false,
      isAuthenticated: false,
      hasHydrated: false,
      selectedUser: null,

      setUser: (data: UserProps) => {
        console.log(data, 'currentUser data');
        set({currentUser: data, isAuthenticated: true});
      },

      setSelectedUser: (data: any) => {
        console.log(data, 'selected user data');
        set({selectedUser: data});
      },

      logout: () => {
        // Clear user-related state
        set({
          currentUser: null,
          isAuthenticated: false,
          selectedUser: null,
        });

        // Also clear the persisted storage
        localStorage.removeItem('current_user');
      },
      sessionExpiredAction: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          selectedUser: null,
        });
        localStorage.removeItem('current_user');
        toast.info('Session expired. Please log in again');
      },
    }),
    {
      name: 'current_user', // key in localStorage
      //storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }), // persist only what’s necessary

      onRehydrateStorage: () => state => {
        if (state) {
          state.hasHydrated = true; // ← or set(() => ({ hasHydrated: true }))
        }
      },
    },
  ),
);
