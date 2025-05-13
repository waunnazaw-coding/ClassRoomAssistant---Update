import { createBrowserRouter } from "react-router-dom";
import RootLayoutPage from "../pages/RootLayout";
import HomePage from "../pages/Home";
import ErrorPage from "../pages/Error";
import CalendarPage from "../pages/calendar/Calendar";
import ToDoPage from "../pages/todo/ToDo";
import ArchievedPage from "../pages/archieved/Archieved";
import ClassRootLayout from "../pages/classes/ClassRootLayout";
import ClassPage from "../pages/classes/Class";
import ReviewPage from "../pages/classes/Review";
import ClassDetailPage from "../pages/classes/ClassDetail";
import NotificationPage from "../pages/notification/Notification";
import AssignmentDetail from "../pages/classes/Assignment";
import LoginPage from "../pages/auth/SignIn";
import SignUpPage from "../pages/auth/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "classes",
        element: <ClassRootLayout />,
        children: [
          {
            index: true,
            element: <ClassPage />,
          },
          {
            path: ":classId",
            element: <ClassDetailPage />,
            children: [
              {
                path: "assignment/:assignmentId",
                element: <AssignmentDetail />,
              },
              {
                path: "material/:materialId",
                element: <AssignmentDetail />,
              },
            ],
          },
        ],
      },
      {
        path: "todo",
        element: <ToDoPage />,
      },
      {
        path: "review",
        element: <ReviewPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "notification",
        element: <NotificationPage />,
      },
      {
        path: "archived",
        element: <ArchievedPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  },
]);
export default router;
