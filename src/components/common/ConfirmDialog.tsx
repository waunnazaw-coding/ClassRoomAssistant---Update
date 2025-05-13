
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog
        variant="outlined"
        sx={{ maxWidth: 400, p: 3, borderRadius: 2 }}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <Typography id="confirm-dialog-title" level="h4" fontWeight="lg" mb={2}>
          {title}
        </Typography>
        <Typography id="confirm-dialog-description" mb={3}>
          {description}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="plain" color="neutral" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="solid" color="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
