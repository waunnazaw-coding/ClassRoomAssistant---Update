// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/joy";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateClassModal from "../components/class/CreateClassModal";
import JoinClassModal from "../components/class/JoinClassModal";
import ClassCard from "../components/class/ClassCard";
import Toast from "../components/common/Toast"; // Import Toast
import { useAuth } from "../contexts/AuthContext";
import { createClass, enrollInClass, getClassesByUserId } from "../api/classes";
import { ClassResponseDto, ClassRequestDto } from "../types/index";

export default function Home() {
  const [openJoin, setOpenJoin] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const { user } = useAuth();

  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch classes on mount and user change, filtering out deleted classes
  useEffect(() => {
    if (!user) {
      setClasses([]);
      return;
    }

    setLoading(true);
    getClassesByUserId(user.id)
      .then((data) => {
        const activeClasses = data.filter((cls) => !cls.isDeleted);
        setClasses(activeClasses);
      })
      .catch((err) => {
        console.error("Failed to fetch classes:", err);
        showToast("Failed to load classes.", "danger");
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Handle joining a class, refresh and filter classes after join
  const handleJoinClass = async (classCode: string) => {
    if (!user) {
      showToast("Please login to join a class.", "warning");
      return;
    }

    try {
      const res = await enrollInClass(classCode, user.id);

      showToast(
        res.message || `Successfully joined class with code: ${classCode}`,
        "success"
      );

      const updatedClasses = await getClassesByUserId(user.id);
      setClasses(updatedClasses.filter((cls) => !cls.isDeleted));

      setOpenJoin(false);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to join class",
        "danger"
      );
    }
  };

  // Handle creating a class, add new class to state if not deleted
  const handleCreateClass = async (
    classDetails: Omit<ClassRequestDto, "userId">
  ) => {
    if (!user) {
      showToast("Please login to create a class.", "warning");
      return;
    }

    try {
      const newClass = await createClass({ ...classDetails, userId: user.id });

      if (!newClass.isDeleted) {
        setClasses((prev) => [...prev, newClass]);
      }

      showToast(`Class created: ${newClass.name}`, "success");
      setOpenCreate(false);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to create class",
        "danger"
      );
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={1.5} alignItems="center">
        <Grid
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 1.5,
          }}
        >
          <Typography level="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Classes
          </Typography>

          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{
                root: {
                  variant: "outlined",
                  color: "neutral",
                  sx: { borderRadius: "sm", ml: 1 },
                },
              }}
              aria-label="Add class options"
            >
              <AddCircleIcon
                sx={{ fontSize: "1.5rem", color: "primary.500" }}
              />
            </MenuButton>
            <Menu placement="bottom-end">
              <MenuItem onClick={() => setOpenJoin(true)}>Join Class</MenuItem>
              <MenuItem onClick={() => setOpenCreate(true)}>
                Create Class
              </MenuItem>
            </Menu>
          </Dropdown>
        </Grid>

        <Grid xs={12}>
          {loading ? (
            <Typography textAlign="center" mt={4}>
              Loading classes...
            </Typography>
          ) : classes.length === 0 ? (
            <Typography textAlign="center" mt={4}>
              No classes found. Join or create a class to get started.
            </Typography>
          ) : (
            <ClassCard classes={classes} setClasses={setClasses} />
          )}
        </Grid>
      </Grid>

      <JoinClassModal
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        onJoin={handleJoinClass}
      />

      <CreateClassModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreateClass}
      />

      <Toast
        open={toastOpen}
        message={toastMessage}
        color={toastColor}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  );
}
