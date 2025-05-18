

export interface AssignmentCreateRequest {
  classId: number;
  createNewTopic: boolean;
  newTopicTitle?: string | null;
  selectedTopicId?: number | null;
  assignmentTitle: string;
  instructions?: string | null;
  points: number;
  dueDate?: string | null;
  allowLateSubmission?: boolean;
  studentIds?: number[] | null;
  attachments?: {
    fileType: string;
    fileUrl?: string | null;
    filePath?: string | null;
  }[];
  createdByUserId: number;
}

export interface AssignmentCreateResponse {
  assignmentId: number;
  classWorkId: number;
  topicId?: number | null;
}

import axiosInstance from "./axiosInstance";

export async function createAssignment(
  // classId: number,
  data: AssignmentCreateRequest
): Promise<AssignmentCreateResponse> {
  const response = await axiosInstance.post<AssignmentCreateResponse>(
    `/assignments/create`,
    data
  );
  return response.data;
}
