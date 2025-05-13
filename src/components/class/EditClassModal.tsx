// src/components/class/EditClassModal.tsx
import React, { useState, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";

interface ClassDetails {
  name: string;
  section?: string;
  subject?: string;
  room?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdate: (classDetails: ClassDetails) => Promise<void> | void;
  initialData: ClassDetails;
}

export default function EditClassModal({
  open,
  onClose,
  onUpdate,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<ClassDetails>(initialData);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setLoading(false);
  }, [initialData, open]);

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Class Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Class Name must be at least 3 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof ClassDetails) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (field === "name" && errors.name) {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onUpdate({
        name: formData.name.trim(),
        section: formData.section?.trim() || undefined,
        subject: formData.subject?.trim() || undefined,
        room: formData.room?.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Update class failed:", error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        aria-labelledby="edit-class-modal-title"
        aria-describedby="edit-class-modal-description"
        sx={{
          width: 480,
          maxWidth: "100%",
          borderRadius: "md",
          p: 4,
          bgcolor: "background.body",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          "@media (max-width: 600px)": {
            width: "100%",
            borderRadius: 0,
            p: 3,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            top: "unset",
            transform: "none",
          },
          boxShadow: "lg",
        }}
      >
        <Typography
          id="edit-class-modal-title"
          level="h4"
          mb={2}
          fontWeight="lg"
          sx={{ fontSize: "1.5rem" }}
        >
          Edit Class
        </Typography>
        <Typography
          id="edit-class-modal-description"
          textColor="text.tertiary"
          mb={4}
          sx={{ fontSize: "0.9rem" }}
        >
          Update class details below.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          aria-describedby="form-errors"
        >
          <Stack spacing={2}>
            <FormControl required error={!!errors.name}>
              <FormLabel
                htmlFor="class-name-textarea"
                sx={{ fontWeight: 600, fontSize: "0.9rem" }}
              >
                Class Name
              </FormLabel>
              <Textarea
                id="class-name-textarea"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Enter class name"
                minRows={1}
                maxRows={3}
                required
                autoFocus
                sx={{ resize: "vertical" }}
              />
              {errors.name && (
                <Typography
                  id="class-name-error"
                  level="body-xs"
                  color="danger"
                  mt={0.5}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {errors.name}
                </Typography>
              )}
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="section-textarea"
                sx={{ fontWeight: 600, fontSize: "0.9rem" }}
              >
                Section
              </FormLabel>
              <Textarea
                id="section-textarea"
                value={formData.section}
                onChange={handleChange("section")}
                placeholder="Enter section (optional)"
                minRows={1}
                maxRows={3}
                sx={{ resize: "vertical" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="subject-textarea"
                sx={{ fontWeight: 600, fontSize: "0.9rem" }}
              >
                Subject
              </FormLabel>
              <Textarea
                id="subject-textarea"
                value={formData.subject}
                onChange={handleChange("subject")}
                placeholder="Enter subject (optional)"
                minRows={1}
                maxRows={3}
                sx={{ resize: "vertical" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="room-textarea"
                sx={{ fontWeight: 600, fontSize: "0.9rem" }}
              >
                Room
              </FormLabel>
              <Textarea
                id="room-textarea"
                value={formData.room}
                onChange={handleChange("room")}
                placeholder="Enter room (optional)"
                minRows={1}
                maxRows={3}
                sx={{ resize: "vertical" }}
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={handleClose}
              disabled={loading}
              sx={{ fontSize: "0.9rem", px: 3, py: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              type="submit"
              disabled={loading || !formData.name.trim()}
              aria-busy={loading}
              sx={{ fontSize: "0.9rem", px: 4, py: 1 }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
