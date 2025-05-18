import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Link,
  Checkbox,
  Menu,
  MenuItem,
  Dropdown,
  MenuButton,
  Modal,
  ModalDialog,
  ModalClose,
  Button,
  Input,
} from "@mui/joy";
import {
  PersonAdd,
  MoreVert,
  ArrowDropDown,
  SortByAlpha,
} from "@mui/icons-material";
import {
  addSubTeacherToClass,
  addStudentToClass,
  removeStudentFromClass,
  removeSubTeacherFromClass,
  transferClassOwnership,
} from "../../api/classes";
import ConfirmDialog from "../common/ConfirmDialog";
import Toast from "../common/Toast"; // Import Toast
import { Alert } from "@mui/material";

const EmptyStudentsIllustration = () => (
  <Box textAlign="center" mb={2}>
    <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
      <ellipse cx="60" cy="50" rx="40" ry="8" fill="#F5F5F5" />
      <rect x="40" y="30" width="40" height="16" rx="4" fill="#E0E0E0" />
      <ellipse cx="60" cy="38" rx="8" ry="6" fill="#BDBDBD" />
      <path
        d="M65 35 Q60 30 55 35"
        stroke="#BDBDBD"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="60" cy="36" r="2" fill="#757575" />
    </svg>
  </Box>
);

interface Participant {
  id: number;
  userId: number;
  userName?: string;
  role: string;
  avatarUrl?: string;
}

interface PeopleProps {
  participants: Participant[];
  currentUserId: number;
  classId: number;
}

export default function People({
  participants,
  currentUserId,
  classId,
}: PeopleProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"teacher" | "student" | null>(
    null
  );
  const [inviteInput, setInviteInput] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<
    (string | number)[]
  >([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(
    () => () => {}
  );

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "success" | "danger" | "warning" | "neutral"
  >("success");

  // Helper to show toast
  const showToast = (message: string, color: typeof toastColor = "success") => {
    setToastMessage(message);
    setToastColor(color);
    setToastOpen(true);
  };

  const teachers = participants.filter((p) =>
    ["Teacher", "SubTeacher"].includes(p.role)
  );
  const students = participants.filter((p) => p.role === "Student");

  const allSelected =
    students.length > 0 && selectedStudentIds.length === students.length;

  const handleInvite = async () => {
    try {
      if (!inviteInput.trim() || !inviteType) return;

      if (inviteType === "teacher") {
        await addSubTeacherToClass(currentUserId, classId, inviteInput.trim());
        alert("Sub-teacher invited successfully.");
      } else {
        await addStudentToClass(currentUserId, classId, inviteInput.trim());
        alert("Student invited successfully.");
      }

      setInviteInput("");
      setInviteOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to invite. Please check the email or try again.");
    }
  };

  const openConfirmDialog = (
    title: string,
    description: string,
    onConfirm: () => void
  ) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setOnConfirmAction(() => onConfirm);
    setConfirmOpen(true);
  };

  const toggleStudentSelection = (id: string | number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudentIds(allSelected ? [] : students.map((s) => s.id));
  };

  const openInviteModal = (type: "teacher" | "student") => {
    setInviteType(type);
    setInviteOpen(true);
    setInviteInput("");
  };

  const getInitial = (name?: string) => name?.charAt(0).toUpperCase() ?? "?";

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      {[{ title: "Teachers", data: teachers, invite: "teacher" }].map(
        ({ title, data, invite }) => (
          <Box key={title} mb={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography level="h4" fontWeight={700} flex={1}>
                {title}
              </Typography>
              <IconButton
                variant="plain"
                size="sm"
                onClick={() => openInviteModal(invite as any)}
              >
                <PersonAdd />
              </IconButton>
            </Box>
            <Divider />
            <Stack spacing={2} mt={2}>
              {data.map((p) => (
                <Box
                  key={p.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={p.avatarUrl} alt={p.userName}>
                      {getInitial(p.userName)}
                    </Avatar>
                    <Typography>{p.userName ?? "Unknown"}</Typography>
                  </Stack>
                  <Dropdown>
                    <MenuButton
                      slots={{ root: IconButton }}
                      slotProps={{
                        root: { variant: "outlined", color: "neutral" },
                      }}
                    >
                      <MoreVert />
                    </MenuButton>
                    <Menu>
                      {p.role === "SubTeacher" && (
                        <>
                          <MenuItem
                            onClick={() =>
                              openConfirmDialog(
                                "Transfer Ownership",
                                `Are you sure you want to transfer ownership to ${p.userName}?`,
                                async () => {
                                  try {
                                    // Call the API to transfer ownership
                                    await transferClassOwnership(
                                      classId,
                                      currentUserId,
                                      p.userId
                                    );

                                    alert(
                                      `Ownership transferred to ${p.userName}`
                                    );

                                    setConfirmOpen(false);
                                  } catch (error: any) {
                                    showToast(
                                      "Failed to load classes.",
                                      "danger"
                                    );

                                    setConfirmOpen(false);
                                  }
                                }
                              )
                            }
                          >
                            Transfer Owner
                          </MenuItem>

                          <MenuItem
                            onClick={() =>
                              openConfirmDialog(
                                "Remove Sub-Teacher",
                                `Are you sure you want to remove ${p.userName} from the class?`,
                                async () => {
                                  try {
                                    // Call the API to transfer ownership
                                    await removeSubTeacherFromClass(
                                      classId,
                                      currentUserId
                                    );

                                    alert(`Leave Successfully.`);

                                    setConfirmOpen(false);
                                  } catch (error: any) {
                                    showToast(
                                      "Failed to load classes.",
                                      "danger"
                                    );

                                    setConfirmOpen(false);
                                  }
                                }
                              )
                            }
                          >
                            Remove
                          </MenuItem>
                        </>
                      )}
                      {p.role === "SubTeacher" && (
                        <MenuItem
                          onClick={() =>
                            openConfirmDialog(
                              "Leave Class",
                              "Are you sure you want to leave this class?",
                              async () => {
                                try {
                                  await removeSubTeacherFromClass(
                                    classId,
                                    currentUserId
                                  );

                                  alert(`Successfully removed ${p.userName}.`);

                                  setConfirmOpen(false);
                                } catch (error: any) {
                                  showToast(
                                    "Failed to load classes.",
                                    "danger"
                                  );

                                  setConfirmOpen(false);
                                }
                              }
                            )
                          }
                        >
                          Leave
                        </MenuItem>
                      )}
                    </Menu>
                  </Dropdown>
                </Box>
              ))}
            </Stack>
          </Box>
        )
      )}

      <Box mb={1} display="flex" alignItems="center">
        <Typography level="h4" fontWeight={700} flex={1}>
          Students
        </Typography>
        {students.length > 0 && (
          <Typography level="body-sm" mr={1}>
            {students.length} student{students.length > 1 ? "s" : ""}
          </Typography>
        )}
        <IconButton
          variant="plain"
          size="sm"
          onClick={() => openInviteModal("student")}
        >
          <PersonAdd />
        </IconButton>
      </Box>
      <Divider />

      {students.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <EmptyStudentsIllustration />
          <Typography color="neutral" mb={1}>
            Add students to this class
          </Typography>
          <Link
            component="button"
            onClick={() => openInviteModal("student")}
            startDecorator={<PersonAdd />}
            fontWeight={600}
          >
            Invite students
          </Link>
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Checkbox
              checked={allSelected}
              indeterminate={selectedStudentIds.length > 0 && !allSelected}
              onChange={handleSelectAll}
            />
            <Dropdown>
              <MenuButton
                disabled={selectedStudentIds.length === 0}
                endDecorator={<ArrowDropDown />}
                size="sm"
              >
                Actions
              </MenuButton>
              <Menu>
                <MenuItem>Remove</MenuItem>
                <MenuItem>Email</MenuItem>
              </Menu>
            </Dropdown>
            <Box flex={1} />
            <IconButton size="sm">
              <SortByAlpha />
            </IconButton>
            <IconButton size="sm">
              <MoreVert />
            </IconButton>
          </Box>
          <Stack spacing={2} mt={2}>
            {students.map((p) => (
              <Box
                key={p.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={1}
                borderRadius="md"
                sx={{
                  backgroundColor: "background.level0",
                  "&:hover": {
                    backgroundColor: "background.level1",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={p.avatarUrl} alt={p.userName}>
                    {getInitial(p.userName)}
                  </Avatar>
                  <Typography fontWeight={500}>
                    {p.userName ?? "Unknown"}
                  </Typography>
                </Stack>

                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{
                      root: { variant: "outlined", color: "neutral" },
                    }}
                  >
                    <MoreVert />
                  </MenuButton>
                  <Menu>
                    <MenuItem
                      onClick={() =>
                        openConfirmDialog(
                          "Remove Sub-Teacher",
                          `Are you sure you want to remove ${p.userName} from the class?`,
                          async () => {
                            try {
                              await removeStudentFromClass(
                                classId,
                                currentUserId
                              );

                              alert(`Successfully removed ${p.userName}.`);

                              setConfirmOpen(false);
                            } catch (error: any) {
                              showToast("Failed to load classes.", "danger");

                              setConfirmOpen(false);
                            }
                          }
                        )
                      }
                    >
                      Remove
                    </MenuItem>
                    <MenuItem>Email</MenuItem>
                  </Menu>
                </Dropdown>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" mb={2} fontWeight={700}>
            Invite {inviteType === "teacher" ? "Teachers" : "Students"}
          </Typography>
          <Input
            fullWidth
            placeholder="Enter name or email"
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography level="body-sm" color="neutral" mb={2}>
            {inviteType === "teacher"
              ? "Teachers can manage class content and assist in grading."
              : "Students can participate in class discussions and submit assignments."}
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={handleInvite}
              disabled={!inviteInput.trim()}
            >
              Invite
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={onConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
