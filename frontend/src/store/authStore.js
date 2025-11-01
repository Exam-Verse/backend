import { create } from 'zustand';

export const useAuthStore = create((set) => {
  // Load initial state from localStorage
  const savedAuth = localStorage.getItem('examverse-auth');
  const initialState = savedAuth ? JSON.parse(savedAuth) : { user: null, token: null };
  
  return {
    user: initialState.user,
    token: initialState.token,
    
    setUser: (user, token) => {
      set({ user, token });
      localStorage.setItem('examverse-auth', JSON.stringify({ user, token }));
    },
    
    logout: () => {
      set({ user: null, token: null });
      localStorage.removeItem('examverse-auth');
    },
    
    updateUser: (userData) => {
      set((state) => {
        const updatedUser = { ...state.user, ...userData };
        localStorage.setItem('examverse-auth', JSON.stringify({ 
          user: updatedUser, 
          token: state.token 
        }));
        return { user: updatedUser };
      });
    },
  };
});
