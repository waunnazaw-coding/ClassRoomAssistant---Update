import React, { useState } from "react";
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
import AssignmentList from "./AssignmentList";
import MaterialList from "./MaterialList";
import TopicCreateForm from "./TopicCreateForm";
import Toast from "../common/Toast"; // Import Toast here

interface ClassWordProps {
  role: "Teacher" | "SubTeacher" | "Student";
  userId: number;
}

export default function ClassWord({ role, userId }: ClassWordProps) {
  const [layout, setLayout] = React.useState<
    ModalDialogProps["layout"] | undefined
  >(undefined);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [formType, setFormType] = useState<
    "assignment" | "material" | "topic" | null
  >(null);

  // Toast state lifted here
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const canCreate = role === "Teacher" || role === "SubTeacher";

  const handleOpenCreate = (type: "assignment" | "material" | "topic") => {
    setFormType(type);
    setOpenCreateModal(true);
  };

  const handleCloseCreate = () => {
    setOpenCreateModal(false);
    setFormType(null);
  };

  // Handle topic created event here and show toast
  const handleTopicCreated = (topic: any) => {
    console.log("New topic created:", topic);
    setToastMessage("Topic created successfully!");
    setToastOpen(true);
    // You can also refresh topic list or do other updates here
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
            <MenuItem
              onClick={() => {
                handleOpenCreate("assignment");
                setLayout("fullscreen");
              }}
            >
              Assignment
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleOpenCreate("material");
                setLayout("fullscreen");
              }}
            >
              Material
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleOpenCreate("topic");
                setLayout(undefined);
              }}
            >
              Topic
            </MenuItem>
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
            {formType === "assignment" && <AssignmentCreateForm classId={6} />}
            {formType === "material" && <MaterialCreateForm />}
            {formType === "topic" && (
              <TopicCreateForm
                userId={userId}
                onCreated={handleTopicCreated}
                onClose={handleCloseCreate}
              />
            )}
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* Show lists for all roles */}
      <AssignmentList />
      <MaterialList />

      {/* Toast rendered here */}
      <Toast
        open={toastOpen}
        message={toastMessage}
        color="success"
        onClose={() => setToastOpen(false)}
        autoHideDuration={3000}
      />
    </Box>
  );
}
