import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Avatar from "@mui/joy/Avatar";
import ReviewsIcon from "@mui/icons-material/Reviews";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useAuth } from "../../contexts/AuthContext";
import { getClassesByUserId, ClassResponseDto } from "../../api/classes";
import { generateColorScheme } from "./generateColorSheme";

function Toggler({
  defaultOpen = false,
  renderToggle,
  children,
}: {
  defaultOpen?: boolean;
  renderToggle: (props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <>
      {renderToggle({ open, setOpen })}
      <div
        style={{
          maxHeight: open ? "1000px" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {open && children}
      </div>
    </>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);

  useEffect(() => {
    if (!user) {
      setClasses([]);
      return;
    }

    getClassesByUserId(user.id)
      .then((data) => {
        setClasses(data.filter((cls) => !cls.isDeleted));
      })
      .catch((err) => console.error("Failed to fetch classes:", err));
  }, [user]);

  const teachingClasses = classes.filter(
    (cls) => cls.role === "Teacher" || cls.role === "SubTeacher"
  );
  const enrolledClasses = classes.filter((cls) => cls.role === "Student");

  return (
    <Sheet
      sx={{
        position: "fixed",
        top: 44,
        left: 0,
        width: { md: 240, lg: 280 },
        height: "calc(100vh - 64px)",
        bgcolor: "background.surface",
        borderRight: "1px solid",
        borderColor: "divider",
        boxShadow: "sm",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        zIndex: 1000,
        px: 2,
        py: 3,
      }}
    >
      <List>
        {/* Home */}
        <ListItem sx={{ my: 1.5 }}>
          <ListItemButton
            component={Link}
            to="/"
            selected={location.pathname === "/"}
          >
            <HomeRoundedIcon />
            <Typography level="title-md" sx={{ ml: 1 }}>
              Home
            </Typography>
          </ListItemButton>
        </ListItem>

        {/* Calendar */}
        <ListItem sx={{ my: 1.5 }}>
          <ListItemButton
            component={Link}
            to="/calendar"
            selected={location.pathname === "/calendar"}
          >
            <EventNoteRoundedIcon />
            <Typography level="title-md" sx={{ ml: 1 }}>
              Calendar
            </Typography>
          </ListItemButton>
        </ListItem>

        {/* Notifications */}
        <ListItem sx={{ my: 1.5 }}>
          <ListItemButton
            component={Link}
            to="/notification"
            selected={location.pathname === "/notification"}
          >
            <NotificationsRoundedIcon />
            <Typography level="title-md" sx={{ ml: 1 }}>
              Notification
            </Typography>
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 2 }} />

        {/* Teaching Classes */}
        <ListItem nested>
          <Toggler
            renderToggle={({ open, setOpen }) => (
              <ListItemButton onClick={() => setOpen(!open)}>
                <SchoolRoundedIcon />
                <ListItemContent>
                  <Typography level="title-md" sx={{ ml: 1 }}>
                    Teaching
                  </Typography>
                </ListItemContent>
                <KeyboardArrowDownIcon
                  sx={{
                    transition: "transform 0.3s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </ListItemButton>
            )}
          >
            <List size="sm" sx={{ pl: 4 }}>
              {teachingClasses.length === 0 ? (
                <ListItem>
                  <Typography level="body-sm" color="neutral">
                    None
                  </Typography>
                </ListItem>
              ) : (
                teachingClasses.map((cls) => (
                  <ListItem
                    key={cls.id}
                    sx={{ flexDirection: "column", alignItems: "start" }}
                  >
                    <ListItemButton
                      component={Link}
                      to={`/review`}
                      selected={location.pathname === `/review/${cls.id}`}
                    >
                      <ReviewsIcon />
                      <Typography level="title-md" sx={{ ml: 1 }}>
                        To review
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      component={Link}
                      to={`/classes/${cls.id}`}
                      selected={location.pathname === `/classes/${cls.id}`}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 14,
                          bgcolor: generateColorScheme(cls.name).baseColor,
                          color: "common.white",
                          mr: 1,
                        }}
                      >
                        {cls.name.charAt(0)}
                      </Avatar>
                      <Typography
                        level="body-md"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 120,
                        }}
                      >
                        {cls.name}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </Toggler>
        </ListItem>

        <Divider sx={{ my: 2 }} />

        {/* Enrolled Classes */}
        <ListItem nested>
          <Toggler
            renderToggle={({ open, setOpen }) => (
              <ListItemButton onClick={() => setOpen(!open)}>
                <ClassRoundedIcon />
                <ListItemContent>
                  <Typography level="title-md" sx={{ ml: 1 }}>
                    Enrolled
                  </Typography>
                </ListItemContent>
                <KeyboardArrowDownIcon
                  sx={{
                    transition: "transform 0.3s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </ListItemButton>
            )}
          >
            <List size="sm" sx={{ pl: 4 }}>
              {enrolledClasses.length === 0 ? (
                <ListItem>
                  <Typography level="body-sm" color="neutral">
                    None
                  </Typography>
                </ListItem>
              ) : (
                enrolledClasses.map((cls) => (
                  <ListItem
                    key={cls.id}
                    sx={{ flexDirection: "column", alignItems: "start" }}
                  >
                    <ListItemButton
                      component={Link}
                      to={`/todo`}
                      selected={location.pathname === `/todo/${cls.id}`}
                    >
                      <PlaylistAddCheckIcon />
                      <Typography level="title-md" sx={{ ml: 1 }}>
                        To do
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      component={Link}
                      to={`/classes/${cls.id}`}
                      selected={location.pathname === `/classes/${cls.id}`}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 14,
                          bgcolor: generateColorScheme(cls.name).baseColor,
                          color: "common.white",
                          mr: 1,
                        }}
                      >
                        {cls.name.charAt(0)}
                      </Avatar>
                      <Typography
                        level="body-md"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 120,
                        }}
                      >
                        {cls.name}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </Toggler>
        </ListItem>

        <Divider sx={{ my: 3 }} />

        {/* Archived */}
        <ListItem>
          <ListItemButton
            component={Link}
            to="/archived"
            selected={location.pathname === "/archived"}
          >
            <ArchiveRoundedIcon />
            <Typography level="title-md" sx={{ ml: 1 }}>
              Archived Classes
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Sheet>
  );
}
