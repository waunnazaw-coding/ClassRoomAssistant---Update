import * as React from "react";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Divider from "@mui/joy/Divider";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

import { User } from "../../types/type"; // Your User type
import { users } from "../../data/data"; // Your users data

interface UserProfileBoxProps {
  currentUserId: string;
}

export default function UserProfileBox({ currentUserId }: UserProfileBoxProps) {
  const [userData, setUserData] = React.useState<User | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Find user from users data by currentUserId
  const user = users.find((u) => u.id === currentUserId);

  React.useEffect(() => {
    // Initialize userData if user exists
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    if (user) {
      setUserData(user);
      handleMenuClose();
    }
  };

  const handleLogout = () => {
    setUserData(null);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: "md",
        bgcolor: "background.surface",
        boxShadow: "sm",
        transition: "all 0.2s ease",
        position: "relative",
        zIndex: 1200,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "0.875rem",
        "&:hover": {
          bgcolor: "background.hover",
          boxShadow: "md",
        },
      }}
    >
      {userData ? (
        <>
          <Avatar
            size="md"
            alt={userData.name}
            sx={{
              border: "2px solid",
              borderColor: "primary.300",
              fontWeight: 700,
              fontSize: 16,
              textTransform: "uppercase",
            }}
          >
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
            <Typography
              level="title-sm"
              fontWeight="md"
              noWrap
              sx={{ color: "text.primary" }}
            >
              {userData.name}
            </Typography>
            <Typography
              level="body-xs"
              sx={{ color: "text.secondary" }}
              noWrap
            >
              {userData.email}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography
          level="body-sm"
          sx={{ flex: 1, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}
        >
          Guest
        </Typography>
      )}

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        placement="bottom-end"
        sx={{ minWidth: 160 }}
      >
        {userData ? (
          <>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                // Navigate to account page if needed
              }}
              sx={{ gap: 1 }}
            >
              <AccountCircleRoundedIcon fontSize="small" />
              My Account
            </MenuItem>
            <Divider />
            <MenuItem
              color="danger"
              onClick={handleLogout}
              sx={{ gap: 1 }}
            >
              <LogoutRoundedIcon fontSize="small" />
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={handleLogin}
            sx={{ gap: 1 }}
          >
            <LoginRoundedIcon fontSize="small" />
            Login
          </MenuItem>
        )}
      </Menu>

      <MenuButton
        component={IconButton}
        variant="soft"
        color="primary"
        size="sm"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
        onClick={handleMenuOpen}
        sx={{ ml: 1 }}
      >
        <ArrowDropDownIcon />
      </MenuButton>
    </Box>
  );
}
