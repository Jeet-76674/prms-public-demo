import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem('user_email') || null);
  const [profileCompleted, setProfileCompleted] = useState(
    sessionStorage.getItem('profile_completed') === 'true'
  );

  const login = async (email, password, selectedRole, silent = false) => {
    try {
      const data = await authService.login(email, password, selectedRole.toUpperCase());
      
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);
      sessionStorage.setItem('user_email', email);
      
      const isCompleted = sessionStorage.getItem(`${selectedRole}_profile_completed`) === 'true' || data.profileCompleted;
      sessionStorage.setItem('profile_completed', isCompleted ? 'true' : 'false');

      setToken(data.token);
      setRole(data.role);
      setUserEmail(email);
      setProfileCompleted(isCompleted);

      if (!silent) {
        toast.success(`Welcome back! Logged in as ${selectedRole.toLowerCase()}.`, { id: 'auth-success-toast' });
      }
      return { success: true, profileCompleted: isCompleted };
    } catch (error) {
      if (!silent) {
        toast.error(error.response?.data?.message || 'Authentication failed. Please check your credentials.', { id: 'auth-error-toast' });
      }
      return { success: false, error };
    }
  };

  const signup = async (signupData, selectedRole) => {
    try {
      const fullData = { ...signupData, role: selectedRole.toUpperCase() };
      await authService.signup(fullData);
      
      // Auto-login silently to generate and store token without duplicate toast
      await login(signupData.email, signupData.password, selectedRole, true);
      return { success: true, email: signupData.email };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.', { id: 'auth-signup-error' });
      return { success: false, error };
    }
  };


  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('profile_completed');
    
    setToken(null);
    setRole(null);
    setUserEmail(null);
    setProfileCompleted(false);
    
    toast.success('Logged out successfully.');
  };

  const setProfileCompletedState = (completed) => {
    sessionStorage.setItem('profile_completed', completed ? 'true' : 'false');
    sessionStorage.setItem(`${role}_profile_completed`, completed ? 'true' : 'false');
    setProfileCompleted(completed);
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const currentUser = () => {
    return { email: userEmail, role };
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userEmail,
        profileCompleted,
        login,
        signup,
        logout,
        setProfileCompletedState,
        isAuthenticated,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
