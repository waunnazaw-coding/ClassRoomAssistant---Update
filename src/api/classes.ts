import axiosInstance from "./axiosInstance";
import {
  ClassRequestDto,
  ClassResponseDto,
  ClassUpdateRequestDto,
  EnrollmentResponse,
  Class,
  GetClassDetailsResponse,
  TopicWithMaterialsAssignmentsDto,
  UserDto,
} from "../types/index";

export async function createClass(
  data: ClassRequestDto
): Promise<ClassResponseDto> {
  const response = await axiosInstance.post("/classes", data);
  return response.data;
}

// Define the ApiResponse interface matching backend structure
interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message: string;
}

// Your existing GetClassDetailsResponse interface/type should be defined elsewhere

export async function getClassDetails(
  classId: number
): Promise<GetClassDetailsResponse> {
  try {
    const response = await axiosInstance.get<
      ApiResponse<GetClassDetailsResponse>
    >(`/classes/${classId}/details`);

    const apiResponse = response.data;

    if (!apiResponse.success) {
      // Handle failure case, e.g., throw an error with the message from backend
      throw new Error(apiResponse.message);
    }

    if (!apiResponse.data) {
      throw new Error("No class details found.");
    }

    return apiResponse.data;
  } catch (error: any) {
    // Optionally, you can enhance error handling here
    throw new Error(error.message || "Failed to fetch class details.");
  }
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

  console.log(response.data);
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
): Promise<UserDto[]> {
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

// Invite a sub-teacher to the class
export async function addSubTeacherToClass(
  teacherUserId: number,
  classId: number,
  email: string
): Promise<{ message: string }> {
  const response = await axiosInstance.post(
    `/classes/${classId}/participants/subteachers`,
    { email },
    {
      params: {
        teacherUserId,
      },
    }
  );
  return response.data;
}

// Invite a student to the class
export async function addStudentToClass(
  teacherUserId: number,
  classId: number,
  email: string
): Promise<{ message: string }> {
  const response = await axiosInstance.post(
    `/classes/${classId}/participants/students`,
    { email },
    {
      params: {
        teacherUserId,
      },
    }
  );
  return response.data;
}
// Transfer class ownership (use PUT, not POST)
export async function transferClassOwnership(
  classId: number,
  currentOwnerId: number,
  newOwnerId: number
): Promise<{ message: string }> {
  const response = await axiosInstance.put(
    `/classes/${classId}/participants/transfer-ownership`,
    null,
    {
      params: {
        currentOwnerId,
        newOwnerId,
      },
    }
  );
  return response.data;
}

// Remove Sub Teacher from class
// Make sure this endpoint exists in your API controller
export async function removeSubTeacherFromClass(
  classId: number,
  subTeacherId: number
): Promise<void> {
  await axiosInstance.delete(
    `/classes/${classId}/participants/sub-teachers/${subTeacherId}`
  );
}

// Remove student from class
export async function removeStudentFromClass(
  classId: number,
  studentId: number
): Promise<void> {
  await axiosInstance.delete(
    `/classes/${classId}/participants/students/${studentId}`
  );
}
