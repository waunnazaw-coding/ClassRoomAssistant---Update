import axiosInstance from "./axiosInstance";
export interface AnnouncementCreateRequestDto {
  classId: number;
  message: string;
}

export interface AnnouncementResponseDto {
  id: number;
  classId: number;
  message: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

export const announcementApi = {
  create: async (data: AnnouncementCreateRequestDto) => {
    const response = await axiosInstance.post(
      `/classes/${data.classId}/announcements`,
      data
    );
    return response.data;
  },
};
