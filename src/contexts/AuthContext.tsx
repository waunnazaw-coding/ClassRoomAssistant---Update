import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { authService, type UserResponseDto } from "../api/auth";

interface User {
  id: string;
  username: string;
  email: string;
  profile?: string; // added profile from UserResponseDto
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Map UserResponseDto to User
  const mapUser = (userDto: UserResponseDto): User => ({
    id: String(userDto.id),
    username: userDto.name,
    email: userDto.email,
    profile: userDto.profile,
  });

  // Fetch user info after token is available
  const fetchUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const mappedUser = mapUser(currentUser);
        setUser(mappedUser);
        localStorage.setItem("userData", JSON.stringify(mappedUser));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("Failed to fetch user info", e);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        if (authService.isAuthenticated()) {
          const userData = localStorage.getItem("userData");
          if (userData && userData !== "undefined") {
            try {
              setUser(JSON.parse(userData));
              setIsAuthenticated(true);
            } catch {
              localStorage.removeItem("userData");
              await fetchUser();
            }
          } else {
            await fetchUser();
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Authentication check failed", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const authResponse = await authService.register({
        username,
        email,
        password,
      });
      localStorage.setItem("authToken", authResponse.accessToken);
      // Fetch and set user info after registration
      await fetchUser();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const authResponse = await authService.login({
        email,
        password,
        rememberMe,
      });
      localStorage.setItem("authToken", authResponse.accessToken);

      await fetchUser();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err: any) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
