import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = authService.getUser();
    const token = authService.getToken();
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    authService.setAuthData(response);
    const userData = {
      username: response.username,
      fullName: response.fullName,
      role: response.role,
      userId: response.userId,
    };
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Return the response but do NOT log the user in automatically
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isStudent = () => user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isStudent, loading }}>
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
