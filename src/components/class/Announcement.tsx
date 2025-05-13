import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import YouTube from "@mui/icons-material/YouTube";
import CloudUpload from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import Snackbar from "@mui/joy/Snackbar";

import { announcementApi } from "../../api/announcement";

interface AnnouncementCreatorProps {
  classId: number;
  onPosted?: () => void;
}

export default function AnnouncementCreator({
  classId,
  onPosted,
}: AnnouncementCreatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">(
    "success"
  );

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await announcementApi.create({
        classId,
        message: text.trim(),
      });
      setSnackbarMessage("Announcement posted successfully");
      setSnackbarColor("success");
      setSnackbarOpen(true);
      setText("");
      setExpanded(false);
      onPosted?.();
    } catch (error: any) {
      console.error("Failed to post announcement:", error);

      // Friendly error message based on error type
      let message = "Failed to post announcement. Please try again.";
      if (error.response?.status === 401) {
        message = "Unauthorized. Please login again.";
      } else if (error.message) {
        message = error.message;
      }

      setSnackbarMessage(message);
      setSnackbarColor("danger");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: "lg",
          p: 2,
          maxWidth: 800,
          mx: "auto",
          mt: 2,
          width: "100%",
        }}
      >
        {!expanded ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setExpanded(true)}
          >
            <Avatar
              src="https://pplx-res.cloudinary.com/image/private/user_uploads/14118900/b5d7fc82-7422-4f4f-8022-6b1af8a2d822/Screenshot-2025-05-11-215428.jpg"
              sx={{ mr: 2 }}
            />
            <Typography level="body-sm" color="neutral">
              Announce something to your class
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 1 }}>
            <Textarea
              minRows={2}
              placeholder="Announce something to your class"
              variant="soft"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                borderBottom: "2px solid",
                borderColor: "neutral.outlinedBorder",
                minHeight: "120px",
                borderRadius: 0,
                "&:hover": {
                  borderColor: "neutral.outlinedHoverBorder",
                },
                "&::before": {
                  border: "1px solid var(--Textarea-focusedHighlight)",
                  transform: "scaleX(0)",
                  left: 0,
                  right: 0,
                  bottom: "-2px",
                  top: "unset",
                  transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
                  borderRadius: 0,
                },
                "&:focus-within::before": {
                  transform: "scaleX(1)",
                },
              }}
              disabled={loading}
            />

            <Divider sx={{ my: 1.5 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton size="lg" variant="plain" disabled>
                  <YouTube />
                </IconButton>
                <IconButton size="lg" variant="plain" disabled>
                  <CloudUpload />
                </IconButton>
                <IconButton size="lg" variant="plain" disabled>
                  <LinkIcon />
                </IconButton>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => {
                    setExpanded(false);
                    setText("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  disabled={!text.trim() || loading}
                  onClick={handlePost}
                >
                  {loading ? "Posting..." : "Post"}
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        color={snackbarColor}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}
