import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import Tooltip from "@mui/joy/Tooltip";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenuItemClick = (action: string) => {
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "account":
        navigate("/account");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 64,
        bgcolor: "background.surface",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        borderBottom: "1px solid",
        zIndex: 1200,
      }}
    >
      <IconButton
        variant="plain"
        color="neutral"
        sx={{ display: { xs: "inline-flex", md: "none" } }}
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </IconButton>

      <Typography level="h4" fontWeight="lg" sx={{ ml: { xs: 1, md: 0 } }}>
        ClassRoom Assistant
      </Typography>

      {!user ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              color: "#000",
              borderColor: "#000",
              "&:hover": {
                borderColor: "#000",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Sign In
          </Button>
          <Button
            variant="solid"
            onClick={() => navigate("/signup")}
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#222",
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      ) : (
        <Dropdown>
          <Tooltip title="Account settings" placement="bottom">
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: "outlined", color: "neutral" } }}
              aria-label="Account settings"
              id="account-menu-button"
              aria-haspopup="true"
              aria-controls="account-menu"
            >
              {user.avatar ? (
                <Avatar src={user.avatar} size="sm" />
              ) : (
                <Avatar size="sm">W</Avatar>
              )}
            </MenuButton>
          </Tooltip>

          <Menu
            id="account-menu"
            aria-labelledby="account-menu-button"
            placement="bottom-end"
          >
            <MenuItem onClick={() => handleMenuItemClick("profile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("account")}>
              My account
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("logout")}>
              Logout
            </MenuItem>
          </Menu>
        </Dropdown>
      )}
    </Box>
  );
}
