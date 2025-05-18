import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardOverflow,
  Typography,
  AspectRatio,
  Avatar,
  Grid,
  IconButton,
  MenuItem,
  ListItemDecorator,
  MenuButton,
  Dropdown,
  useTheme,
  Box,
  Menu,
} from "@mui/joy";
import MoreVert from "@mui/icons-material/MoreVert";
import Edit from "@mui/icons-material/Edit";
import DeleteForever from "@mui/icons-material/DeleteForever";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import { generateColorScheme } from "../layout/generateColorSheme";
import { updateClass, deleteClass, unenrollFromClass } from "../../api/classes";
import { ClassResponseDto } from "../../types/index";
import EditClassModal from "./EditClassModal";
import Toast from "../common/Toast";
import ConfirmDialog from "../common/ConfirmDialog"; // Import ConfirmDialog
import { useAuth } from "../../contexts/AuthContext";

interface ClassCardProps {
  classes: ClassResponseDto[];
  setClasses: React.Dispatch<React.SetStateAction<ClassResponseDto[]>>;
}

const randomImages = [
  "https://gstatic.com/classroom/themes/img_reachout.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkuRwoZD7RVhvkEU6Kpizc339O5pVlsM5lNw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM74fAUXIPLtGzNCbNgLE-Ce9iBKvlvGa-ow&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94eF8n0RNHFzs2frZzUZDBSDZDBbX2I3bmQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOysRYoTP-M-o917gIkUqbiKCJibwLOfIng&s",
];

export default function ClassCard({ classes, setClasses }: ClassCardProps) {
  const theme = useTheme();
  const { user } = useAuth();

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassResponseDto | null>(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<"success" | "danger">("success");

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const showToast = (message: string, color: typeof toastColor = "success") => {
    setToastMessage(message);
    setToastColor(color);
    setToastOpen(true);
  };

  // Open edit modal
  const handleEditClick = (cls: ClassResponseDto) => {
    setEditClass(cls);
    setEditOpen(true);
  };

  // Update class handler
  const handleUpdate = async (updatedData: {
    name: string;
    section?: string;
    subject?: string;
    room?: string;
  }) => {
    if (!editClass) return;
    try {
      const updatedClass = await updateClass(editClass.id, updatedData);
      showToast("Class updated successfully.", "success");
      setEditOpen(false);
      setEditClass(null);
      setClasses((prev) =>
        prev.map((cls) => (cls.id === updatedClass.id ? updatedClass : cls))
      );
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to update class",
        "danger"
      );
    }
  };

  // Delete class handler (only teacher/owner)
  const handleDeleteClick = (cls: ClassResponseDto) => {
    setConfirmTitle("Delete Class");
    setConfirmDescription(
      `Are you sure you want to delete class "${cls.name}"? This action cannot be undone.`
    );
    setConfirmAction(() => async () => {
      try {
        await deleteClass(cls.id);
        showToast("Class deleted successfully.", "success");
        setClasses((prev) => prev.filter((c) => c.id !== cls.id));
      } catch (error: any) {
        showToast(
          error.response?.data?.message || "Failed to delete class",
          "danger"
        );
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  // Unenroll handler (only student)
  const handleUnenrollClick = (cls: ClassResponseDto) => {
    setConfirmTitle("Leave Class");
    setConfirmDescription(
      `Are you sure you want to leave class "${cls.name}"?`
    );
    setConfirmAction(() => async () => {
      try {
        if (user) {
          await unenrollFromClass(cls.id, Number(user.id));
          showToast("You have left the class.", "success");
          setClasses((prev) => prev.filter((c) => c.id !== cls.id));
        } else {
          showToast("User is not authenticated.", "danger");
        }
      } catch (error: any) {
        showToast(
          error.response?.data?.message || "Failed to leave class",
          "danger"
        );
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ flexGrow: 1 }}
      >
        {classes.map((cls, index) => {
          const { baseColor } = generateColorScheme(cls.name);
          const image = randomImages[index % randomImages.length];

          return (
            <Grid xs={12} sm={6} md={3} key={cls.id}>
              <Card
                variant="outlined"
                sx={{
                  width: "100%",
                  position: "relative",
                  boxShadow: theme.shadow.sm,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "box-shadow 0.3s ease",
                  "&:hover": { boxShadow: theme.shadow.md },
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  minHeight: 280,
                }}
              >
                {/* Menu Dropdown */}
                <Box
                  component="div"
                  sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown>
                    <MenuButton
                      slots={{ root: IconButton }}
                      slotProps={{
                        root: {
                          variant: "plain",
                          color: "neutral",
                          size: "sm",
                        },
                      }}
                      aria-label="Options"
                    >
                      <MoreVert />
                    </MenuButton>
                    <Menu placement="bottom-end" variant="outlined" size="sm">
                      {(cls.role === "Teacher" || cls.role === "Owner") && (
                        <>
                          <MenuItem onClick={() => handleEditClick(cls)}>
                            <ListItemDecorator>
                              <Edit />
                            </ListItemDecorator>
                            Edit
                          </MenuItem>
                          <MenuItem
                            variant="soft"
                            onClick={() => handleDeleteClick(cls)}
                          >
                            <ListItemDecorator>
                              <DeleteForever />
                            </ListItemDecorator>
                            Delete
                          </MenuItem>
                        </>
                      )}

                      {cls.role === "Student" && (
                        <MenuItem
                          variant="soft"
                          onClick={() => handleUnenrollClick(cls)}
                        >
                          <ListItemDecorator>
                            <ExitToAppIcon />
                          </ListItemDecorator>
                          Leave Class
                        </MenuItem>
                      )}
                    </Menu>
                  </Dropdown>
                </Box>

                {/* Link wraps image and content */}
                <Link
                  to={`/classes/${cls.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardOverflow>
                    <AspectRatio
                      ratio="16/9"
                      sx={{ borderRadius: "12px 12px 0 0" }}
                    >
                      <img
                        src={image}
                        alt={cls.name}
                        loading="lazy"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          filter:
                            theme.palette.mode === "dark"
                              ? "brightness(0.85)"
                              : "none",
                          transition: "filter 0.3s ease",
                        }}
                      />
                    </AspectRatio>

                    <Avatar
                      alt={cls.name}
                      sx={{
                        "--Avatar-size": "56px",
                        position: "absolute",
                        bottom: "-28px",
                        right: 16,
                        border: `3px solid ${theme.vars.palette.background.body}`,
                        boxShadow: theme.shadow.md,
                        bgcolor: baseColor,
                        color: theme.vars.palette.background.body,
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        userSelect: "none",
                      }}
                    >
                      {cls.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </CardOverflow>

                  <CardContent sx={{ pt: 4, pb: 2, flexGrow: 1 }}>
                    <Typography
                      level="title-lg"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {cls.name}
                    </Typography>
                    {/* <Typography
                      level="body-md"
                      sx={{ color: "text.secondary" }}
                    >
                      {cls.subject}
                    </Typography> */}
                    {/* <Typography
                      level="body-md"
                      sx={{ color: "text.tertiary", mt: 0.5 }}
                    >
                      Room: {cls.room}
                    </Typography> */}
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {editClass && (
        <EditClassModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onUpdate={handleUpdate}
          initialData={{
            name: editClass.name,
            section: editClass.section,
            subject: editClass.subject,
            room: editClass.room,
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />

      <Toast
        open={toastOpen}
        message={toastMessage}
        color={toastColor}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
