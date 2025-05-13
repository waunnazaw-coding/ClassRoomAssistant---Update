import React from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Divider from "@mui/joy/Divider";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import DriveFolderUploadOutlined from "@mui/icons-material/DriveFolderUploadOutlined";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import AttachFileOutlined from "@mui/icons-material/AttachFileOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import SlideshowOutlined from "@mui/icons-material/SlideshowOutlined";
import TableChartOutlined from "@mui/icons-material/TableChartOutlined";
import BrushOutlined from "@mui/icons-material/BrushOutlined";
import { useState } from "react";

export default function AssignmentDetail() {
  const { classId: _, assignmentId: __ } = useParams();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Example data (replace with your fetched data)
  const assignment = {
    title: "161a. Upgrade routes file for react-router v7 Data Model",
    author: "Codecafe Lab",
    date: "Apr 15",
    points: 100,
    description:
      "Upgrade your routes file to use react-router v7's new Data Model. Make sure to refactor your code and test all navigation.",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        mt: 4,
        px: { xs: 1, md: 4 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* Left: Assignment details */}
      <Box sx={{ flex: 2, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              bgcolor: "#1976d2",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <AssignmentOutlined sx={{ color: "#fff", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography level="h3" fontWeight={700}>
              {assignment.title}
            </Typography>
            <Typography level="body-sm" color="neutral" sx={{ mt: 0.5 }}>
              {assignment.author} • {assignment.date}
            </Typography>
          </Box>
        </Box>
        <Typography level="body-md" fontWeight={600} sx={{ mb: 1 }}>
          {assignment.points} points
        </Typography>
        <Typography level="body-md" sx={{ mb: 3 }}>
          {assignment.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography level="body-md" fontWeight={600} sx={{ mb: 1 }}>
          Class comments
        </Typography>
        <Button
          variant="plain"
          color="primary"
          sx={{ px: 0, minWidth: 0, fontWeight: 600 }}
        >
          Add a class comment
        </Button>
      </Box>

      {/* Right: Your work */}
      <Box sx={{ flex: 1, minWidth: 280 }}>
        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: "lg",
            boxShadow: "md",
            minWidth: 280,
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography level="body-lg" fontWeight={700}>
              Your work
            </Typography>
            <Typography level="body-xs" color="success" fontWeight={600}>
              Assigned
            </Typography>
          </Box>
          <Button
            variant="soft"
            color="primary"
            fullWidth
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "md",
              textTransform: "none",
              justifyContent: "flex-start",
              px: 2,
            }}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            startDecorator={<Box sx={{ fontSize: 20, mr: 1 }}>+</Box>}
          >
            Add or create
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            sx={{ minWidth: 250, p: 1 }}
            placement="bottom-start"
          >
            <MenuItem>
              <DriveFolderUploadOutlined sx={{ mr: 1 }} /> Google Drive
            </MenuItem>
            <MenuItem>
              <LinkOutlined sx={{ mr: 1 }} /> Link
            </MenuItem>
            <MenuItem>
              <AttachFileOutlined sx={{ mr: 1 }} /> File
            </MenuItem>
            <Divider />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ pl: 2, pt: 1, pb: 0.5 }}
            >
              Create new
            </Typography>
            <MenuItem>
              <DescriptionOutlined sx={{ color: "#4285F4", mr: 1 }} /> Docs
            </MenuItem>
            <MenuItem>
              <SlideshowOutlined sx={{ color: "#FBC02D", mr: 1 }} /> Slides
            </MenuItem>
            <MenuItem>
              <TableChartOutlined sx={{ color: "#34A853", mr: 1 }} /> Sheets
            </MenuItem>
            <MenuItem>
              <BrushOutlined sx={{ color: "#EA4335", mr: 1 }} /> Drawings
            </MenuItem>
          </Menu>
        </Card>
      </Box>
    </Box>
  );
}
