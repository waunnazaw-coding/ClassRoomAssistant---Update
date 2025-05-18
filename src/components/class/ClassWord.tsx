import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Modal from "@mui/joy/Modal";
import ModalDialog, { ModalDialogProps } from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import AssignmentCreateForm from "./AssignmentCreate";
import MaterialCreateForm from "./MaterialCreate";
import TopicCreateForm from "./TopicCreateForm";
import AssignmentList from "./AssignmentList";
import MaterialList from "./MaterialList";
import Toast from "../common/Toast";
import { getClassParticipants } from "../../api/classes";
import { UserDto } from "../../types/index";

interface ClassWordProps {
  role: "Teacher" | "SubTeacher" | "Student";
  userId: number;
  classId: number; // Pass classId for assignment creation
}

export default function ClassWord({ role, userId, classId }: ClassWordProps) {
  const [layout, setLayout] = React.useState<
    ModalDialogProps["layout"] | undefined
  >(undefined);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [formType, setFormType] = useState<
    "assignment" | "material" | "topic" | null
  >(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
   const [students, setStudents] = useState<UserDto[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [toastColor, setToastColor] = useState<"success" | "danger">("success");

  const canCreate = role === "Teacher" || role === "SubTeacher";


  //  useEffect(() => {
  //     if (!classId) return;
  
  //     setLoadingStudents(true);
  //     getClassParticipants(classId)
  //       .then((participants) => {
  //         const studentsOnly = participants.filter(
  //           (p) => p.role?.toLowerCase() === "student"
  //         );
  //         setStudents(studentsOnly);
  //       })
  //       .catch((err) => {
  //         onerror?.(err?.response?.data?.message ?? err.message);
  //       })
  //       .finally(() => setLoadingStudents(false));
  //   }, [classId, onerror]);

  const handleOpenCreate = (type: "assignment" | "material" | "topic") => {
    setFormType(type);
    setOpenCreateModal(true);

    // Use fullscreen layout for assignment/material, default for topic
    if (type === "assignment" || type === "material") {
      setLayout("fullscreen");
    } else {
      setLayout(undefined);
    }
  };

  const handleCloseCreate = () => {
    setOpenCreateModal(false);
    setFormType(null);
  };

  // Generic success handler for all create forms
  const handleCreated = (message: string) => {
    setToastMessage(message);
    setToastColor("success");
    setToastOpen(true);
    handleCloseCreate();
  };

  // Generic error handler for all create forms
  const handleError = (message: string) => {
    setToastMessage(message);
    setToastColor("danger");
    setToastOpen(true);
  };

  return (
    <Box>
      {canCreate && (
        <Dropdown>
          <MenuButton
            variant="outlined"
            sx={{ mb: 2 }}
            aria-label="Create classwork"
          >
            Create
          </MenuButton>
          <Menu>
            <MenuItem onClick={() => handleOpenCreate("assignment")}>
              Assignment
            </MenuItem>
            <MenuItem onClick={() => handleOpenCreate("material")}>
              Material
            </MenuItem>
            <MenuItem onClick={() => handleOpenCreate("topic")}>Topic</MenuItem>
          </Menu>
        </Dropdown>
      )}

      <Modal open={openCreateModal} onClose={handleCloseCreate}>
        <ModalDialog layout={layout}>
          <ModalClose />
          <DialogTitle>
            {formType === "assignment"
              ? "Create Assignment"
              : formType === "material"
              ? "Create Material"
              : formType === "topic"
              ? "Create Topic"
              : ""}
          </DialogTitle>
          <DialogContent>
            {formType === "assignment" && (
              <AssignmentCreateForm
                classId={classId}
                userId={userId}
                
                onCreated={() =>
                  handleCreated("Assignment created successfully!")
                }
                onError={handleError}
              />
            )}
            {formType === "material" && (
              <MaterialCreateForm
              // onCreated={() => handleCreated("Material created successfully!")}
              // onError={handleError}
              // onClose={handleCloseCreate}
              />
            )}
            {formType === "topic" && (
              <TopicCreateForm
                userId={userId}
                onCreated={() => handleCreated("Topic created successfully!")}
                // onError={handleError}
                onClose={handleCloseCreate}
              />
            )}
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* Show lists for all roles */}
      <AssignmentList />
      <MaterialList />

      {/* Toast notification */}
      <Toast
        open={toastOpen}
        message={toastMessage}
        color={toastColor}
        onClose={() => setToastOpen(false)}
        autoHideDuration={3000}
      />
    </Box>
  );
}
