// components/class/Stream.tsx
import { useState } from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import EditOutlined from "@mui/icons-material/EditOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";
// import Sheet from "@mui/joy/Sheet";
// import { styled } from "@mui/joy/styles";
import { Link } from "react-router-dom";
import AnnouncementCreator from "./Announcement";
import { Menu, MenuItem, ListItemDecorator, Snackbar } from "@mui/joy";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClassDetails from "./ClassDetailCard";

const bannerUrl = "https://gstatic.com/classroom/themes/img_reachout.jpg";

// const Item = styled(Sheet)(({ theme }) => ({
//   ...theme.typography["body-sm"],
//   padding: theme.spacing(1),
//   textAlign: "left",
//   borderRadius: 6,
//   color: theme.vars.palette.text.secondary,
//   maxWidth: "100%",
// }));

interface StreamProps {
  classDetail: {
    id: number;
    name: string;
    owner?: string;
    classCode?: string;
    subject?: string;
  };
  onCustomize: () => void;
  isAuthorized: boolean; // true if user is Teacher or SubTeacher
}

export default function Stream({
  classDetail,
  onCustomize,
  isAuthorized,
}: StreamProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage(`${label} copied to clipboard`);
    setOpenSnackbar(true);
    setMenuAnchorEl(null);
  };

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2 },
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          borderRadius: "md",
          overflow: "hidden",
          mb: 3,
          boxShadow: "sm",
        }}
      >
        <Box
          sx={{
            background: `url(${bannerUrl}) center/cover no-repeat`,
            minHeight: 140,
            position: "relative",
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Button
            size="sm"
            variant="soft"
            startDecorator={<EditOutlined />}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 600,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "#fff" },
            }}
            onClick={onCustomize}
          >
            Customize
          </Button>
          <Typography
            level="h3"
            sx={{
              color: "#fff",
              fontWeight: 700,
              textShadow: "0 2px 6px rgba(0,0,0,0.4)",
              mb: 0.5,
            }}
          >
            {classDetail.name}
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              color: "#fff",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {classDetail.owner || "Teacher"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
            bgcolor: "background.body",
          }}
        >
          <Box>
            <Typography level="body-sm">
              <b>Class code:</b> {classDetail.classCode || "Turned off"}
            </Typography>
            <Typography level="body-sm" mt={0.5}>
              <b>Subject:</b> {classDetail.subject || "-"}
            </Typography>
          </Box>
          <IconButton variant="plain" color="neutral" aria-label="Class info">
            <InfoOutlined />
          </IconButton>
        </Box>
      </Card>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        {/* Sidebar */}
        <Box sx={{ flex: "0 0 220px", minWidth: 200 }}>
          {isAuthorized && (
            <Card variant="outlined" sx={{ mb: 2, px: 2, py: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography level="body-sm" fontWeight="md">
                  Class code
                </Typography>
                <Box>
                  <IconButton
                    size="sm"
                    variant="plain"
                    aria-label="More options"
                    onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                  >
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu
                    open={!!menuAnchorEl}
                    anchorEl={menuAnchorEl}
                    onClose={() => setMenuAnchorEl(null)}
                    placement="bottom-end"
                  >
                    <MenuItem
                      onClick={() =>
                        handleCopy(
                          `https://classroom.com/invite/${classDetail.classCode}`,
                          "Invite link"
                        )
                      }
                    >
                      <ListItemDecorator>
                        <LinkIcon />
                      </ListItemDecorator>
                      Copy class invite link
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        handleCopy(classDetail.classCode || "", "Class code")
                      }
                    >
                      <ListItemDecorator>
                        <ContentCopyIcon />
                      </ListItemDecorator>
                      Copy class code
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  level="title-md"
                  sx={{
                    color: "primary.600",
                    fontFamily: "monospace",
                    userSelect: "all",
                  }}
                >
                  {classDetail.classCode || "n4ryqzt7"}
                </Typography>
                <IconButton
                  size="sm"
                  variant="plain"
                  color="primary"
                  aria-label="Fullscreen"
                >
                  <FullscreenIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          )}

          <Card variant="outlined">
            <CardContent>
              <Typography level="title-sm" fontWeight="lg" sx={{ mb: 1 }}>
                Upcoming
              </Typography>
              <Typography level="body-sm" color="neutral">
                Woohoo, no work due soon!
              </Typography>
              <Button
                component={Link}
                to="/todo"
                variant="plain"
                size="sm"
                sx={{ mt: 1, fontWeight: 600 }}
              >
                View all
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {isAuthorized && (
            <Stack spacing={2}>
              <AnnouncementCreator
                classId={classDetail.id} // or however you get class id
                onPosted={() => {
                  // refresh announcements list or notify user
                  console.log("Announcement posted callback");
                }}
              />
            </Stack>
          )}

          <Stack spacing={1}>
            <ClassDetails classId={classDetail.id} />
            {/* Class Details */}
          </Stack>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        {snackbarMessage}
      </Snackbar>
    </Box>
  );
}
