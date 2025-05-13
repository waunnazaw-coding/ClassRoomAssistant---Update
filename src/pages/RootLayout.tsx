import * as React from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { AuthProvider } from "../contexts/AuthContext"; // <-- import your AuthProvider
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const customTheme = extendTheme({
    fontFamily: {
      body: "Roboto, sans-serif",
      display: "Roboto, sans-serif",
      code: "Roboto, monospace",
    },
  });

  return (
    <AuthProvider>
      <CssVarsProvider defaultMode="light" theme={customTheme}>
        <CssBaseline />
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            bgcolor: "background.body",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {/* Sidebar - Responsive */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: { lg: 280 },
              flexShrink: 0,
              borderRight: "1px solid",
              borderColor: "divider",
            }}
          >
            <Sidebar />
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: 10, // header height + spacing
              // px: { xs: 1, sm: 1 },
              minHeight: "100vh",
              boxSizing: "border-box",
              overflowX: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 1200,
                mx: "auto",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </CssVarsProvider>
    </AuthProvider>
  );
}
