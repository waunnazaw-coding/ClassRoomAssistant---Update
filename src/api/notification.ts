import axiosInstance from "./axiosInstance";

export interface Notification {
  id: number;
  type: string;
  referenceId: number;
  isRead: boolean;
  createdAt: string | null;
  announcementMessage?: string;
  messageContent?: string;
  assignmentTitle?: string;
  materialTitle?: string;
  details?: string;
}

export const fetchUserNotifications = async (
  userId: number
): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/notifications`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
};
