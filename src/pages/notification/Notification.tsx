import * as React from "react";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import { Stack, styled, Typography, CircularProgress } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import AnnouncementIcon from "@mui/icons-material/Campaign";
import MessageIcon from "@mui/icons-material/ChatBubbleOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FileCopyIcon from "@mui/icons-material/InsertDriveFile";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import { fetchUserNotifications, Notification } from "../../api/notification";
import { useAuth } from "../../contexts/AuthContext";

const Item = styled(Sheet)(({ theme }) => ({
  ...theme.typography["body-sm"],
  padding: theme.spacing(2),
  textAlign: "left",
  borderRadius: 8,
  color: theme.vars.palette.text.secondary,
  maxWidth: 500,
}));

const getNotificationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "announcement":
      return <AnnouncementIcon fontSize="small" />;
    case "message":
      return <MessageIcon fontSize="small" />;
    case "assignment":
      return <AssignmentIcon fontSize="small" />;
    case "material":
      return <FileCopyIcon fontSize="small" />;
    default:
      return <NotificationsIcon fontSize="small" />;
  }
};

export default function ToDo() {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.id) return;

    const loadNotifications = async () => {
      try {
        const data = await fetchUserNotifications(user.id);
        setNotifications(data);
      } catch {
        // Error already handled globally
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id]);

  const notRead = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  const renderList = (items: Notification[]) => (
    <Box sx={{ flexGrow: 1, overflow: "hidden", px: 2 }}>
      {items.length === 0 ? (
        <Typography sx={{ fontSize: "0.9rem", px: 1, py: 2 }}>
          No notifications
        </Typography>
      ) : (
        <Stack spacing={2}>
          {items.map((n) => (
            <Item key={n.id} variant="outlined">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  variant="soft"
                  color="primary"
                  sx={{ width: 36, height: 36 }}
                >
                  {getNotificationIcon(n.type)}
                </Avatar>
                <Typography fontSize="0.9rem" sx={{ wordBreak: "break-word" }}>
                  {n.details}
                </Typography>
              </Stack>
            </Item>
          ))}
        </Stack>
      )}
    </Box>
  );

  return (
    <Tabs aria-label="Notifications Tabs" defaultValue={0}>
      <TabList>
        <Tab>Not Read</Tab>
        <Tab>Read</Tab>
      </TabList>

      <Box sx={{ mt: 1 }}>
        <TabPanel value={0}>
          {loading ? <CircularProgress size="sm" /> : renderList(notRead)}
        </TabPanel>
        <TabPanel value={1}>
          {loading ? <CircularProgress size="sm" /> : renderList(read)}
        </TabPanel>
      </Box>
    </Tabs>
  );
}
