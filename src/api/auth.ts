import axiosInstance from "./axiosInstance";
import { RegisterRequest, LoginRequest, AuthResponseDto } from "../types/auth";

// Register
export async function registerUser(data: RegisterRequest) {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
}

// Login
export async function loginUser(data: LoginRequest): Promise<AuthResponseDto> {
  const response = await axiosInstance.post<AuthResponseDto>(
    "/auth/login",
    data
  );
  return response.data;
}
