import axiosInstance from "./axiosInstance"; // your configured axios instance
import {
  AssignmentResponseDto,
  CreateAssignmentRequestDto,
} from "../types/index";

export async function createAssignment(
  classId: number,
  dto: CreateAssignmentRequestDto
): Promise<AssignmentResponseDto> {
  const response = await axiosInstance.post<AssignmentResponseDto>(
    `/classes/${classId}/assignments`,
    dto
  );
  return response.data;
}
