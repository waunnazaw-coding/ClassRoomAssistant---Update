import React, { JSX, useEffect, useState } from "react";
import { Stack, Typography, Avatar, Card, CardContent } from "@mui/joy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import CampaignIcon from "@mui/icons-material/Campaign"; // better icon for announcement
import { getClassDetails } from "../../api/classes";
import { ClassDetailDto, GetClassDetailsResponse } from "../../types";

const iconMap: Record<string, JSX.Element> = {
  Announcement: <CampaignIcon />,
  Assignment: <AssignmentIcon />,
  Material: <DescriptionIcon />,
};

export default function ClassDetails({ classId }: { classId: number }) {
  const [details, setDetails] = useState<ClassDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data: GetClassDetailsResponse = await getClassDetails(classId);
        setDetails(data.details);
      } catch {
        setError("Failed to load class details.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [classId]);

  if (loading) return <Typography>Loading class details...</Typography>;
  if (error) return <Typography color="danger">{error}</Typography>;
  if (details.length === 0)
    return <Typography>No activities found.</Typography>;

  return (
    <Stack spacing={2}>
      {details.map((item) => (
        <Card key={`${item.entityType}-${item.entityId}`} variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar variant="solid" color="primary">
                {iconMap[item.entityType] || <CampaignIcon />}
              </Avatar>
              <Stack spacing={0.5}>
                <Typography level="body-md">{item.content}</Typography>
                {item.messageContent && (
                  <Typography
                    level="body-sm"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    {item.messageContent}
                  </Typography>
                )}
                <Typography level="body-xs" color="neutral">
                  {new Date(item.activityDate).toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
