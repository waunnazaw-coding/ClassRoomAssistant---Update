import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../contexts/AuthContext"; // Adjust import path

// Zod validation schema
const signUpSchema = z
  .object({
    name: z.string().min(2, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// TypeScript type inferred from schema
type SignUpFormInputs = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [serverError, setServerError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  // Clear server error on any input change
  useEffect(() => {
    setServerError("");
  }, [watch()]);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setServerError("");
    setSuccess(false);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccess(true);
      reset();

      // Optional: Auto-login after successful registration
      await login({ email: data.email, password: data.password });

      // Redirect to home or dashboard
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      setServerError(message);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 340,
          maxWidth: "90vw",
          p: 4,
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-describedby="server-error"
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

        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          required
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
          aria-invalid={!!errors.email}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          sx={{ mt: 2 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!isValid || isSubmitting}
          sx={{
            bgcolor: "#000",
            color: "#fff",
            fontWeight: 600,
            mt: 3,
            "&:hover": { bgcolor: "#222" },
          }}
          size="large"
          aria-busy={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>

        {serverError && (
          <Typography
            color="error"
            mb={1}
            align="center"
            id="server-error"
            role="alert"
            sx={{ mt: 2 }}
          >
            {serverError}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" mb={1} align="center" sx={{ mt: 2 }}>
            Registration successful!
          </Typography>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ cursor: "pointer" }}
          >
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
