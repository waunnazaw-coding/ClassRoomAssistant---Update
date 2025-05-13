import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import { IconButton, Menu, MenuItem, Grid } from "@mui/joy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Toast from "../common/Toast";
import ConfirmDialog from "../common/ConfirmDialog";
import { ClassResponseDto, restoreClass, deleteClass } from "../../api/classes";

interface ArchivedClassCardProps {
  archivedClasses: ClassResponseDto[];
  onRemoveClass: (id: number) => void;
  imageUrl?: string; // optional default image URL
}

export default function ArchivedClassCard({
  archivedClasses,
  onRemoveClass,
  imageUrl,
}: ArchivedClassCardProps) {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedClassId, setSelectedClassId] = React.useState<number | null>(
    null
  );

  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [toastColor, setToastColor] = React.useState<"success" | "danger">(
    "success"
  );

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmTitle, setConfirmTitle] = React.useState("");
  const [confirmDescription, setConfirmDescription] = React.useState("");
  const [confirmAction, setConfirmAction] = React.useState<() => void>(
    () => {}
  );

  const showToast = (message: string, color: typeof toastColor = "success") => {
    setToastMessage(message);
    setToastColor(color);
    setToastOpen(true);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    classId: number
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedClassId(classId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedClassId(null);
  };

  const handleCopy = () => {
    const cls = archivedClasses.find((c) => c.id === selectedClassId);
    if (!cls) return;
    navigator.clipboard.writeText(cls.name).then(() => {
      showToast(`Copied "${cls.name}"`);
    });
    handleMenuClose();
  };

  const openConfirmDialog = (
    title: string,
    description: string,
    action: () => void
  ) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setConfirmOpen(true);
    handleMenuClose();
  };

  const handleRestore = () => {
    const cls = archivedClasses.find((c) => c.id === selectedClassId);
    if (!cls) return;

    openConfirmDialog(
      "Restore Class",
      `Are you sure you want to restore "${cls.name}"?`,
      async () => {
        try {
          await restoreClass(cls.id); // calls POST /classes/{id}/restore
          showToast(`Restored "${cls.name}"`);
          onRemoveClass(cls.id);
        } catch (error) {
          showToast(`Failed to restore "${cls.name}"`, "danger");
        } finally {
          setConfirmOpen(false);
        }
      }
    );
  };

  const handleDelete = () => {
    const cls = archivedClasses.find((c) => c.id === selectedClassId);
    if (!cls) return;

    openConfirmDialog(
      "Delete Class",
      `Are you sure you want to delete "${cls.name}"? This action cannot be undone.`,
      async () => {
        try {
          await deleteClass(cls.id); // calls DELETE /classes/{id}
          showToast(`Deleted "${cls.name}"`);
          onRemoveClass(cls.id);
        } catch (error) {
          showToast(`Failed to delete "${cls.name}"`, "danger");
        } finally {
          setConfirmOpen(false);
        }
      }
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        {archivedClasses.map((cls) => (
          <Grid key={cls.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              color="primary"
              size="sm"
              variant="outlined"
              sx={{ width: "100%", position: "relative" }}
            >
              <CardOverflow>
                <AspectRatio ratio={2}>
                  <img
                    src={
                      imageUrl ||
                      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
                    }
                    loading="lazy"
                    alt={cls.name}
                  />
                </AspectRatio>
                <IconButton
                  aria-label="class menu"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  sx={{ position: "absolute", top: 14, right: 14 }}
                  onClick={(e) => handleMenuOpen(e, cls.id)}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  open={menuAnchor !== null && selectedClassId === cls.id}
                  anchorEl={menuAnchor}
                  onClose={handleMenuClose}
                  placement="bottom-end"
                >
                  <MenuItem onClick={handleCopy}>Copy</MenuItem>
                  <MenuItem onClick={handleRestore}>Restore</MenuItem>
                  <MenuItem onClick={handleDelete} color="danger">
                    Delete
                  </MenuItem>
                </Menu>
              </CardOverflow>
              <CardContent>
                <Typography level="title-md" mb={0.5}>
                  {cls.name}
                </Typography>
                <Typography level="body-sm">See your assignments</Typography>
              </CardContent>
              <CardOverflow
                variant="soft"
                sx={{ bgcolor: "background.level1" }}
              >
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  {/* Optional extra info */}
                </CardContent>
              </CardOverflow>
            </Card>
          </Grid>
        ))}
      </Grid>

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
