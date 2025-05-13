import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";

export default function SignIn() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.body",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 340,
          mx: "auto",
          p: 4,
          borderRadius: "md",
          boxShadow: "lg",
          bgcolor: "background.surface",
        }}
      >
        <Typography level="h4" fontWeight="lg" textAlign="center" mb={2}>
          Sign In
        </Typography>
        <Typography level="body-sm" textAlign="center" mb={3} color="neutral">
          Welcome back! Please enter your details.
        </Typography>

        <form>
          <Input
            required
            name="email"
            type="email"
            placeholder="Email"
            sx={{ mb: 2 }}
            size="lg"
            variant="soft"
          />
          <Input
            required
            name="password"
            type="password"
            placeholder="Password"
            sx={{ mb: 2 }}
            size="lg"
            variant="soft"
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: "md",
              mb: 2,
              "&:hover": { bgcolor: "#222" },
            }}
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <Typography level="body-sm" textAlign="center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" underline="hover" sx={{ cursor: "pointer" }}>
            Sign Up
          </Link>
        </Typography>
      </Sheet>
    </Box>
  );
}
