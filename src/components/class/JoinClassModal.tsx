// src/components/class/JoinClassModal.tsx
import React, { useState } from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Card,
  CardContent,
  Box,
} from "@mui/joy";

interface Props {
  open: boolean;
  onClose: () => void;
  onJoin: (classCode: string) => void;
}

export default function JoinClassModal({ open, onClose, onJoin }: Props) {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");

  const handleJoinClick = () => {
    const trimmed = classCode.trim();

    if (!/^[A-Za-z0-9]{5,8}$/.test(trimmed)) {
      setError("Class code must be 5–8 letters or numbers.");
      return;
    }

    setError("");
    onJoin(trimmed);
    setClassCode("");
    onClose();
  };

  const handleClose = () => {
    setClassCode("");
    setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        aria-labelledby="join-class-modal-title"
        aria-describedby="join-class-modal-description"
        sx={{
          width: 500,
          maxWidth: "100%",
          borderRadius: "md",
          p: 3,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          "@media (max-width: 900px)": {
            width: "100%",
            borderRadius: 0,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            top: "unset",
            transform: "none",
          },
        }}
      >
        <Typography
          id="join-class-modal-title"
          level="h3"
          mb={2}
          sx={{
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: "1.75rem",
            fontWeight: 700,
          }}
        >
          Join Class
        </Typography>

        <Box mb={3}>
          <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
            <CardContent>
              <Typography
                level="body-sm"
                textColor="text.tertiary"
                sx={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: "0.85rem",
                }}
              >
                You are currently signed in as:
              </Typography>
              <Typography
                level="body-md"
                mt={0.5}
                sx={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Waunna Zaw
              </Typography>
              <Typography
                level="body-sm"
                textColor="text.tertiary"
                sx={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: "0.85rem",
                }}
              >
                wannazaw334@gmail.com
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box mb={3}>
          <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
            <CardContent>
              <Typography
                level="body-md"
                fontWeight="lg"
                mb={1}
                sx={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                Class Code
              </Typography>
              <Typography
                level="body-sm"
                textColor="text.tertiary"
                mb={2}
                sx={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: "0.85rem",
                }}
              >
                Ask your teacher for the class code, then enter it here.
              </Typography>

              <FormControl error={!!error} required>
                <FormLabel
                  sx={{
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Class Code
                </FormLabel>
                <Input
                  autoFocus
                  placeholder="e.g., ABC123"
                  value={classCode}
                  onChange={(e) => {
                    setClassCode(e.target.value);
                    setError("");
                  }}
                  fullWidth
                  sx={{
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: "0.9rem",
                  }}
                />
                {error && (
                  <Typography
                    level="body-xs"
                    color="danger"
                    mt={0.5}
                    sx={{
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: "0.75rem",
                    }}
                  >
                    {error}
                  </Typography>
                )}
              </FormControl>
            </CardContent>
          </Card>
        </Box>

        <Box mb={3}>
          <Typography
            level="body-sm"
            fontWeight="lg"
            mb={1}
            sx={{
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            To join a class with a code:
          </Typography>
          <Box
            component="ul"
            sx={{
              pl: 3,
              m: 0,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "0.85rem",
              color: "text.tertiary",
              lineHeight: 1.4,
            }}
          >
            <li>Use an authorized account.</li>
            <li>
              Use a class code with 5–8 letters or numbers. No spaces or
              symbols.
            </li>
          </Box>
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button
            variant="outlined"
            color="neutral"
            onClick={handleClose}
            sx={{
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "0.9rem",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={handleJoinClick}
            disabled={!classCode.trim()}
            sx={{
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "0.9rem",
            }}
          >
            Join
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
