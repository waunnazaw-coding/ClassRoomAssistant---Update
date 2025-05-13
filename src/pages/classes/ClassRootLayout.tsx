import Box from "@mui/joy/Box";
import { Outlet } from "react-router-dom";

function ClassRootLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}

export default ClassRootLayout;
