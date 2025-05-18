import api from "./axiosInstance";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  // Add any other fields required by your API
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string; // or Date, depending on your API
}

export type UserResponseDto = {
  id: number;
  name: string;
  email: string;
  profile: string;
};

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      console.log("Login response data:", response.data); // Log before returning
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // rethrow to handle it upstream if needed
    }
  },

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  },

  async getCurrentUser(): Promise<UserResponseDto | null> {
    try {
      const response = await api.get<UserResponseDto>("/auth/get-me");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  },
};
