import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppProvider, Authentication, type Session } from "@toolpad/core/AppProvider";
import { Account } from "@toolpad/core/Account";
import Login from "./SignIn"; // Import the Login component
import useAuth from "@/hook/useAuth";

export default function AccountDemoSignedIn() {
  const { user, login, signup, logout } = useAuth();
  const navigate = useNavigate(); // hook for navigation

  const authentication: Authentication = React.useMemo(() => {
    return {
      isAuthenticated: !!user,
      user: user ?? undefined,
      signIn: () => {
        console.log("Trigger login modal or redirect to /login");
        navigate("/login");
      },
      signOut: () => {
        logout();
        navigate("/");
      },
      signUp: () => {
        console.log("Trigger signup modal or redirect to /signup");
        navigate("/signup");
      },
    };
  }, [user, logout, signup, navigate]);

  const session: Session = React.useMemo(() => {
    return {
      user: user ? {
        //id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      } : undefined,
    };
  }, [user]);

  return (
    <AppProvider authentication={authentication} session={session}>
      <Account />
    </AppProvider>
  );

}