import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    fontSize: 16, // Base font size
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
        body1: {
          fontSize: "1rem",
        },
        body2: {
          fontSize: "0.875rem",
        },
        subtitle1: {
          fontSize: "1.125rem",
        },
        h6: {
          fontSize: "1.25rem",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

export default theme;
