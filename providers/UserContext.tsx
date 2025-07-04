import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserRepository } from "../hooks/useUserRepository/useUserRepository";

interface UserContextType {
  user: any | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getUser } = useUserRepository();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
      setLoading(false);
    };
    fetchUser();
  }, [getUser]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};