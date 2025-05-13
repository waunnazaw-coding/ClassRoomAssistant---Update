import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { Link as RouterLink, useMatches } from "react-router-dom";
import Breadcrumbs from "@mui/joy/Breadcrumbs";

function CustomBreadcrumbs() {
  const matches = useMatches();

  const buildPath = (index: number) => {
    return matches
      .slice(1, index + 1)
      .map((match) => {
        let path = match.pathname ?? "";
        Object.entries(match.params).forEach(([key, value]) => {
          path = path.replace(`:${key}`, value ?? "");
        });
        return path;
      })
      .filter(Boolean)
      .join("/");
  };

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: "center" }}
      ></Stack>
      <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          sx={{
            "--Breadcrumbs-gap": "0.5rem",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            mb: 2,
            px: 1,
          }}
          aria-label="breadcrumb"
        >
          {/* Always show Home as first breadcrumb */}
          <RouterLink
            to="/"
            style={{
              textDecoration: "none",
              color: "#1976d2",
              whiteSpace: "nowrap",
              fontWeight: 600,
            }}
          >
            Home
          </RouterLink>

          {matches.slice(1).map((match, index) => {
            const routePath = match.pathname ?? "";
            const label =
              routePath === ""
                ? "Home"
                : routePath.startsWith(":")
                ? // Use param value as label if route is dynamic
                  Object.values(match.params)[0] ?? "Detail"
                : // Capitalize first letter for static routes
                  routePath.charAt(0).toUpperCase() + routePath.slice(1);

            const isLast = index === matches.length - 2; // because we sliced from 1

            if (isLast) {
              // Last breadcrumb is plain text
              return (
                <Typography
                  key={match.id ?? index}
                  color="primary"
                  fontWeight={600}
                  noWrap
                  aria-current="page"
                >
                  {label}
                </Typography>
              );
            } else {
              // Intermediate breadcrumb is a link
              const to = `/${buildPath(index + 1)}`;

              return (
                <RouterLink
                  key={match.id ?? index}
                  to={to}
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </RouterLink>
              );
            }
          })}
        </Breadcrumbs>
      </Stack>
    </Stack>
  );
}

export default CustomBreadcrumbs;
