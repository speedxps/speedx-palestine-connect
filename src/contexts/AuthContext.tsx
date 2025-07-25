import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: 'admin' | 'subscriber';
  name: string;
  phone?: string;
  location?: string;
  package?: string;
  speed?: string;
  startDate?: string;
  endDate?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test data
const users = {
  admin: {
    username: 'admin',
    password: '123',
    role: 'admin' as const,
    name: 'مدير النظام'
  },
  noor: {
    username: 'noor',
    password: '123',
    role: 'subscriber' as const,
    name: 'نور محمد',
    phone: '0599123456',
    location: 'رام الله',
    package: 'باقة المتميز',
    speed: '60 ميجا',
    startDate: '2024-01-15',
    endDate: '2024-08-15'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('speedx_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const userCredentials = users[username as keyof typeof users];
    
    if (userCredentials && userCredentials.password === password) {
      const userData: User = {
        username: userCredentials.username,
        role: userCredentials.role,
        name: userCredentials.name,
        ...(userCredentials.role === 'subscriber' && {
          phone: userCredentials.phone,
          location: userCredentials.location,
          package: userCredentials.package,
          speed: userCredentials.speed,
          startDate: userCredentials.startDate,
          endDate: userCredentials.endDate
        })
      };
      
      setUser(userData);
      localStorage.setItem('speedx_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('speedx_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};