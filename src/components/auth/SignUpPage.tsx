import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

export default function SignUp() {
  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 340,
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} align="center" mb={2}>
          Sign Up
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mb={3}
        >
          Create your account to get started.
        </Typography>

        <Box
          component="form"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField label="Full Name" variant="outlined" fullWidth required />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: 600,
              mt: 1,
              "&:hover": { bgcolor: "#222" },
            }}
            size="large"
          >
            Sign Up
          </Button>
        </Box>

        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link href="/login" underline="hover" sx={{ cursor: "pointer" }}>
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
