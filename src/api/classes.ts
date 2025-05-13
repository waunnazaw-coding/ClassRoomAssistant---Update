import axiosInstance from "./axiosInstance";
import {
  ClassRequestDto,
  ClassResponseDto,
  ClassUpdateRequestDto,
  EnrollmentResponse,
  Class,
  GetClassDetailsResponse,
  TopicWithMaterialsAssignmentsDto,
} from "../types/index";

export async function createClass(
  data: ClassRequestDto
): Promise<ClassResponseDto> {
  const response = await axiosInstance.post("/classes", data);
  return response.data;
}

export async function getClassDetails(
  classId: number
): Promise<GetClassDetailsResponse> {
  const response = await axiosInstance.get<GetClassDetailsResponse>(
    `/classes/${classId}/details`
  );
  return response.data;
}

export async function enrollInClass(
  classCode: string,
  studentId: number
): Promise<EnrollmentResponse> {
  const response = await axiosInstance.post(
    `/classes/code/${encodeURIComponent(classCode)}/enroll/${studentId}`
  );
  return response.data;
}

export async function getClassById(classId: number): Promise<Class[]> {
  const response = await axiosInstance.get(`/classes/${classId}`);
  return response.data;
}

// Get all classes for a user
export async function getClassesByUserId(
  userId: number
): Promise<ClassResponseDto[]> {
  const response = await axiosInstance.get(`/classes/user/${userId}`);
  return response.data;
}

// Update class details
export async function updateClass(
  id: number,
  data: ClassUpdateRequestDto
): Promise<ClassResponseDto> {
  const response = await axiosInstance.put(`/classes/${id}`, data);
  return response.data;
}

// Soft delete class (mark as deleted)
export async function deleteClass(id: number): Promise<void> {
  await axiosInstance.delete(`/classes/${id}`);
}

// Restore soft-deleted class
export async function restoreClass(id: number): Promise<void> {
  await axiosInstance.post(`/classes/${id}/restore`);
}

// Hard delete class (permanent removal)
export async function actualDeleteClass(id: number): Promise<void> {
  await axiosInstance.delete(`/classes/${id}/actual-delete`);
}

// Unenroll student from class
export async function unenrollFromClass(
  classId: number,
  studentId: number
): Promise<void> {
  await axiosInstance.delete(
    `/classes/${classId}/participants/students/${studentId}`
  );
}

// Get participants for a class
export async function getClassParticipants(
  classId: number
): Promise<{ userId: number; name: string; role: string }[]> {
  const response = await axiosInstance.get(`/classes/${classId}/participants`);
  return response.data;
}

// Get topics with materials and assignments for a class
export async function getTopicsWithMaterialsAndAssignments(
  classId: number
): Promise<TopicWithMaterialsAssignmentsDto[]> {
  const response = await axiosInstance.get(
    `/classes/${classId}/topics-with-materials-assignments`
  );
  return response.data;
}

// If your backend has a different endpoint for class works, e.g.:
export async function getClassWorks(
  classId: number
): Promise<TopicWithMaterialsAssignmentsDto[]> {
  const response = await axiosInstance.get(`/classes/${classId}/class-works`);
  return response.data;
}
