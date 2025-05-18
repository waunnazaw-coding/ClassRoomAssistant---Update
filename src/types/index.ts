export interface ClassDetailDto {
  entityId: number;
  entityType: string;
  content: string;
  activityDate: string;
  messageId?: number | null;
  senderId?: number | null;
  receiverId?: number | null;
  messageContent?: string | null;
  messageCreatedAt?: string | null;
}

export interface GetClassDetailsResponse {
  details: ClassDetailDto[];
}

export interface ClassRequestDto {
  userId: number;
  name: string;
  section?: string;
  subject?: string;
  room?: string;
}

export interface ClassUpdateRequestDto {
  name: string;
  section?: string;
  subject?: string;
  room?: string;
}

export interface ClassResponseDto {
  id: number;
  name: string;
  section: string;
  classCode: string;
  subject: string;
  role: string;
  isDeleted: boolean;
  room: string;
  createdBy?: number;
  createdDate?: string;
}

export interface Class {
  id: number;
  name: string;
  section: string;
  classCode: string;
  subject: string;
  room: string;
  createdBy?: number;
  createdDate?: string;
}

export interface EnrollmentResponse {
  message: string;
}

export interface MaterialDto {
  id: number;
  title: string;
  description?: string | null;
  createdAt?: string | null;
}

export interface AssignmentDto {
  id: number;
  title: string;
  points?: number | null;
  createdAt?: string | null;
}

export interface TopicWithMaterialsAssignmentsDto {
  topicId: number;
  topicName: string;
  materials: MaterialDto[];
  assignments: AssignmentDto[];
}

export interface CreateAssignmentRequestDto {
  classId: number;
  topicId?: number | null;
  title: string;
  instructions?: string | null;
  points?: number | null;
  dueDate?: string | null;
}

export interface AssignmentResponseDto {
  id: number;
  title: string;
  instructions?: string | null;
  points?: number | null;
  dueDate?: string | null;
}

export interface CreateTopicDto {
  title: string;
  userId: number;
}

export interface TopicDto {
  id: number;
  title: string;
  userId: number;
  createdAt?: string; // ISO string format
}

export interface AttachmentDto {
  fileType: string;
  fileUrl?: string | null;
  filePath?: string | null;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture?: string | null;
}
