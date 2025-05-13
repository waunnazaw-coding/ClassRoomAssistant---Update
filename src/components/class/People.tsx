import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Checkbox from "@mui/joy/Checkbox";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import MoreVert from "@mui/icons-material/MoreVert";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import SortByAlpha from "@mui/icons-material/SortByAlpha";

// Illustration for empty students
const EmptyStudentsIllustration = () => (
  <Box sx={{ textAlign: "center", mb: 2 }}>
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
  id: string | number;
  userId: string;
  userName?: string;
  role: string;
  avatarUrl?: string;
}

interface PeopleProps {
  participants: Participant[];
}

export default function People({ participants }: PeopleProps) {
  // Modal state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"teacher" | "student" | null>(
    null
  );
  const [inviteInput, setInviteInput] = useState("");

  // Student selection state for actions
  const [selectedStudentIds, setSelectedStudentIds] = useState<
    (string | number)[]
  >([]);

  const teachers = participants.filter((p) => p.role === "Teacher");
  const students = participants.filter((p) => p.role === "Student");

  const getInitial = (name?: string) =>
    name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";

  // Handlers
  const handleInviteClick = (type: "teacher" | "student") => {
    setInviteType(type);
    setInviteOpen(true);
    setInviteInput("");
  };

  const handleInvite = () => {
    // TODO: Implement invite logic (API call)
    setInviteOpen(false);
    setInviteInput("");
  };

  const handleCancelInvite = () => {
    setInviteOpen(false);
    setInviteInput("");
  };

  const handleStudentCheckbox = (id: string | number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const allStudentsSelected =
    students.length > 0 && selectedStudentIds.length === students.length;

  const handleSelectAllStudents = () => {
    if (allStudentsSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  // UI
  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      {/* Teachers Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography level="h4" fontWeight={700} sx={{ flex: 1 }}>
          Teachers
        </Typography>
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ ml: 1 }}
          aria-label="Add teacher"
          onClick={() => handleInviteClick("teacher")}
        >
          <PersonAdd />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        {teachers.map((t) => (
          <Stack key={t.id} direction="row" alignItems="center" spacing={1}>
            <Avatar
              src={t.avatarUrl}
              alt={t.userName}
              sx={{ width: 40, height: 40 }}
            >
              {getInitial(t.userName)}
            </Avatar>
            <Typography level="body-lg" fontWeight={500}>
              {t.userName ?? "Unknown"}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Students Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography level="h4" fontWeight={700} sx={{ flex: 1 }}>
          Students
        </Typography>
        {students.length > 0 && (
          <Typography level="body-md" color="neutral" sx={{ mr: 1 }}>
            {students.length} student{students.length > 1 ? "s" : ""}
          </Typography>
        )}
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ ml: 1 }}
          aria-label="Invite students"
          onClick={() => handleInviteClick("student")}
        >
          <PersonAdd />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Student List or Empty State */}
      {students.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <EmptyStudentsIllustration />
          <Typography level="body-md" color="neutral" sx={{ mb: 1 }}>
            Add students to this class
          </Typography>
          <Link
            component="button"
            color="primary"
            startDecorator={<PersonAdd />}
            onClick={() => handleInviteClick("student")}
            sx={{ fontWeight: 600, fontSize: "1rem" }}
          >
            Invite students
          </Link>
        </Box>
      ) : (
        <Box>
          {/* Actions Row */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Checkbox
              checked={allStudentsSelected}
              indeterminate={
                selectedStudentIds.length > 0 && !allStudentsSelected
              }
              onChange={handleSelectAllStudents}
              sx={{ mr: 1 }}
              aria-label="Select all students"
            />
            <Dropdown>
              <MenuButton
                disabled={selectedStudentIds.length === 0}
                endDecorator={<ArrowDropDown />}
                size="sm"
                sx={{ mr: 2, minWidth: 100 }}
              >
                Actions
              </MenuButton>
              <Menu>
                <MenuItem disabled>Remove</MenuItem>
                <MenuItem disabled>Email</MenuItem>
              </Menu>
            </Dropdown>
            <Box sx={{ flex: 1 }} />
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              aria-label="Sort students"
            >
              <SortByAlpha />
            </IconButton>
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              aria-label="More options"
            >
              <MoreVert />
            </IconButton>
          </Box>
          {/* Student List */}
          <Stack spacing={2} mt={2}>
            {students.map((s) => (
              <Stack key={s.id} direction="row" alignItems="center" spacing={1}>
                <Checkbox
                  checked={selectedStudentIds.includes(s.id)}
                  onChange={() => handleStudentCheckbox(s.id)}
                  sx={{ mr: 1 }}
                  aria-label={`Select ${s.userName ?? "student"}`}
                />
                <Avatar
                  src={s.avatarUrl}
                  alt={s.userName}
                  sx={{ width: 40, height: 40 }}
                >
                  {getInitial(s.userName)}
                </Avatar>
                <Typography level="body-lg" fontWeight={500}>
                  {s.userName ?? "Unknown"}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      {/* Invite Modal */}
      <Modal open={inviteOpen} onClose={handleCancelInvite}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" fontWeight={700} mb={2}>
            {inviteType === "teacher"
              ? "Invite teachers"
              : inviteType === "student"
              ? "Invite students"
              : ""}
          </Typography>
          <Input
            fullWidth
            placeholder="Type a name or email"
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography level="body-sm" color="neutral" sx={{ mb: 2 }}>
            {inviteType === "teacher"
              ? "Teachers you add can do everything you can, except delete the class."
              : inviteType === "student"
              ? "Students you add will be able to join and participate in this class."
              : ""}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleCancelInvite}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={handleInvite}
              disabled={inviteInput.trim() === ""}
            >
              Invite
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
