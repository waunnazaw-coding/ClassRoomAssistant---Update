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
import { useAuth } from "../../contexts/AuthContext"; // import your context hook

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormInputs = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth(); // use login from context

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  useEffect(() => {
    setServerError("");
  }, [watch()]);

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    setServerError("");
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
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
          Sign In
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mb={3}
        >
          Welcome back! Please enter your details.
        </Typography>

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
          autoComplete="current-password"
          aria-invalid={!!errors.password}
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
          {isSubmitting ? "Signing In..." : "Sign In"}
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

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Link
            component={RouterLink}
            to="/signup"
            underline="hover"
            sx={{ cursor: "pointer" }}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
