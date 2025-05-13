export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: string; // ISO string
}

export interface Class {
  id: string;
  name: string;
  section?: string;
  subject?: string;
  classCode?: string;
  room?: string;
  createdBy?: string;
  createdDate: string;
}

export type ParticipantRole = "Teacher" | "Student" | "SubTeacher";

export interface ClassParticipant {
  id: string;
  classId: string;
  userId?: string;
  role: ParticipantRole;
  isOwner: boolean;
  addedBy?: string;
  addedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  classId: string;
  createdAt: string;
}

export type ClassWorkType = "Assignment" | "Material";

export interface ClassWork {
  id: string;
  classId: string;
  topicId?: string;
  type: ClassWorkType;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classWorkId: string;
  title: string;
  instructions?: string;
  dueDate?: string;
  allowLateSubmission: boolean;
  ponts?: number; // typo? maybe meant to be 'points'
}

export interface AssignmentFile {
  id: string;
  assignmentId: string;
  studentId: string;
  filePath: string;
  uploadedAt: string;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  classWorkId: string;
  createdAt: string;
}

export type ReferenceType = "Assignment" | "Material";
export type FileType = "Drive" | "YouTube" | "Upload" | "Link";

export interface Attachment {
  id: string;
  referenceId: string;
  referenceType: ReferenceType;
  fileType: FileType;
  fileUrl?: string;
  filePath?: string;
  createdBy: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  classId: string;
  title: string;
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  classId?: string;
  message: string;
  createdAt: string;
}

export type NotificationType =
  | "Assignment"
  | "Announcement"
  | "Message"
  | "Grade";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  classWorkId: string;
  score: number;
  maxScore: number;
  gradedBy: string;
  createdAt: string;
}

export type TodoStatus = "Pending" | "Completed";

export interface Todo {
  id: string;
  userId: string;
  classWorkId: string;
  status: TodoStatus;
  dueDate?: string;
  isMissing: boolean;
}
