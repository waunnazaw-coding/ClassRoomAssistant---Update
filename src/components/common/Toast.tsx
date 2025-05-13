import * as React from "react";
import Snackbar, { SnackbarProps } from "@mui/joy/Snackbar";

interface ToastProps {
  open: boolean;
  message: React.ReactNode;
  color?: SnackbarProps["color"];
  variant?: SnackbarProps["variant"];
  onClose: () => void;
  autoHideDuration?: number;
}

export default function Toast({
  open,
  message,
  color = "success",
  variant = "outlined",
  onClose,
  autoHideDuration = 4000,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      variant={variant}
      color={color}
      size="lg"
      autoHideDuration={autoHideDuration}
      onClose={(event, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
      sx={{ minWidth: 240 }}
    >
      {message}
    </Snackbar>
  );
}
