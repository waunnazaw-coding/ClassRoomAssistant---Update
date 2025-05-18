import * as React from "react";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import { useAuth } from "../../contexts/AuthContext";
import { fetchTodoTasks, Task } from "../../api/todo";

const ToDo: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        const data = await fetchTodoTasks(user.id);
        setTasks(data);
      } catch {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  return (
    <Tabs aria-label="To-Do Tabs" defaultValue={0}>
      <TabList>
        <Tab>Assigned</Tab>
        <Tab>Missed</Tab>
        <Tab>Done</Tab>
      </TabList>

      <TabPanel value={0}>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <CircularProgress size="sm" />
          ) : tasks.filter((t) => t.status === "Assigned").length === 0 ? (
            <Typography level="body-sm">No assigned tasks.</Typography>
          ) : (
            <Stack spacing={2}>
              {tasks
                .filter((t) => t.status === "Assigned")
                .map((task) => (
                  <Sheet
                    key={task.assignmentId}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, maxWidth: 600, width: "100%" }}
                  >
                    <Typography level="h4" fontWeight="md">
                      {task.title}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Class: {task.className}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </Typography>
                    <Typography level="body-sm" color="primary">
                      Status: {task.status ?? "Unknown"}
                    </Typography>
                  </Sheet>
                ))}
            </Stack>
          )}
        </Box>
      </TabPanel>

      <TabPanel value={1}>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <CircularProgress size="sm" />
          ) : tasks.filter((t) => t.status === "Missed").length === 0 ? (
            <Typography level="body-sm">No missed tasks.</Typography>
          ) : (
            <Stack spacing={2}>
              {tasks
                .filter((t) => t.status === "Missed")
                .map((task) => (
                  <Sheet
                    key={task.assignmentId}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, maxWidth: 600, width: "100%" }}
                  >
                    <Typography level="h4" fontWeight="md">
                      {task.title}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Class: {task.className}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </Typography>
                    <Typography level="body-sm" color="primary">
                      Status: {task.status ?? "Unknown"}
                    </Typography>
                  </Sheet>
                ))}
            </Stack>
          )}
        </Box>
      </TabPanel>

      <TabPanel value={2}>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <CircularProgress size="sm" />
          ) : tasks.filter((t) => t.status === "Done").length === 0 ? (
            <Typography level="body-sm">No completed tasks yet.</Typography>
          ) : (
            <Stack spacing={2}>
              {tasks
                .filter((t) => t.status === "Done")
                .map((task) => (
                  <Sheet
                    key={task.assignmentId}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, maxWidth: 600, width: "100%" }}
                  >
                    <Typography level="h4" fontWeight="md">
                      {task.title}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Class: {task.className}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </Typography>
                    <Typography level="body-sm" color="primary">
                      Status: {task.status ?? "Unknown"}
                    </Typography>
                  </Sheet>
                ))}
            </Stack>
          )}
        </Box>
      </TabPanel>
    </Tabs>
  );
};

export default ToDo;
