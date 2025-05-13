import {
  Box,
  Card,
  Input,
  Textarea,
  Typography,
  Stack,
  IconButton,
  Button,
  Select,
  Option,
  Sheet,
  FormControl,
  FormLabel,
  Divider,
} from "@mui/joy";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog, { ModalDialogProps } from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import React from "react";

// Zod schema
const assignmentSchema = z.object({
  classId: z.number().min(1, "ClassId is required"),
  topicId: z.union([z.string().min(1), z.literal("")]).optional(),
  title: z.string().min(1, "Title is required"),
  instructions: z.string().optional(),
  points: z.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export default function AssignmentCreate() {
  const [layout, setLayout] = React.useState<
    ModalDialogProps["layout"] | undefined
  >(undefined);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      classId: 1,
      topicId: "",
      title: "",
      instructions: "",
      points: 100,
      dueDate: "",
    },
  });

  const onSubmit = (data: AssignmentFormValues) => {
    const dto = {
      ...data,
      topicId: data.topicId === "" ? null : parseInt("1"),
      dueDate: data.dueDate || null,
    };
    console.log("Submitting:", dto);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#f8f9fa",
          py: 3,
          px: { xs: 2, sm: 4, md: 8 },
          minHeight: "100vh",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography level="h4">Assignment</Typography>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            sx={{ fontWeight: 600, px: 4, py: 1.5, fontSize: 16 }}
            size="lg"
          >
            Assign
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 1.5,
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {/* Title Field */}
            <Card
              variant="outlined"
              sx={{
                flex: 1,
                borderRadius: 2,
                p: 1.5,
                bgcolor: "#fff",
                minHeight: 320,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                boxShadow: "sm",
              }}
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    error={!!errors.title}
                    placeholder="Assignment title"
                    variant="soft"
                    sx={{
                      height: 48,
                      px: 1,
                      borderBottom: "2px solid",
                      borderColor: "neutral.outlinedBorder",
                      borderRadius: 0,
                      "&:hover": {
                        borderColor: "neutral.outlinedHoverBorder",
                      },
                      "&::before": {
                        border: "1px solid var(--Input-focusedHighlight)",
                        transform: "scaleX(0)",
                        left: 0,
                        right: 0,
                        bottom: "-2px",
                        top: "unset",
                        transition:
                          "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
                        borderRadius: 0,
                      },
                      "&:focus-within::before": {
                        transform: "scaleX(1)",
                      },
                    }}
                  />
                )}
              />
              {errors.title && (
                <Typography color="danger" level="body-sm" sx={{ mt: -1 }}>
                  {errors.title.message}
                </Typography>
              )}

              {/* Instructions */}
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    minRows={3}
                    placeholder="Add instructions... (optional)"
                    variant="soft"
                    sx={{
                      px: 1,
                      borderBottom: "2px solid",
                      borderColor: "neutral.outlinedBorder",
                      height: 140,
                      borderRadius: 0,
                      "&:hover": {
                        borderColor: "neutral.outlinedHoverBorder",
                      },
                      "&::before": {
                        border: "1px solid var(--Textarea-focusedHighlight)",
                        transform: "scaleX(0)",
                        left: 0,
                        right: 0,
                        bottom: "-2px",
                        top: "unset",
                        transition:
                          "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
                        borderRadius: 0,
                      },
                      "&:focus-within::before": {
                        transform: "scaleX(1)",
                      },
                    }}
                  />
                )}
              />
            </Card>

            <Card
              sx={{
                mt: 4,
                borderRadius: 2,
                p: 2,
                bgcolor: "#fff",
                boxShadow: "xl",
              }}
            >
              <Typography level="body-md" sx={{ mt: 0.5 }}>
                Attach
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                // justifyContent="center"
                // alignItems="center"
                sx={{ pl: 0.5, mt: 1 }}
              >
                <IconButton
                  variant="solid"
                  color="neutral"
                  size="lg"
                  onClick={() => setLayout("center")}
                >
                  <YouTubeIcon fontSize="large" />
                </IconButton>
                <IconButton variant="solid" color="neutral" size="lg">
                  <CloudUploadIcon fontSize="large" />
                </IconButton>
                <IconButton
                  variant="solid"
                  color="neutral"
                  size="lg"
                  onClick={() => setLayout("center")}
                >
                  <LinkIcon fontSize="large" />
                </IconButton>
              </Stack>
            </Card>
          </Box>

          <Modal open={!!layout} onClose={() => setLayout(undefined)}>
            <ModalDialog layout={layout}>
              <ModalClose />
              <DialogTitle>Modal Dialog</DialogTitle>
              <DialogContent>
                <div>
                  This is a <code>{layout}</code> modal dialog. Press{" "}
                  <code>esc</code> to close it.
                </div>
              </DialogContent>
            </ModalDialog>
          </Modal>
          {/* Sidebar */}
          <Sheet
            variant="outlined"
            sx={{
              width: { xs: "100%", md: 300 },
              minHeight: 420,
              bgcolor: "#fff",
              borderRadius: 3,
              p: 3,
              boxShadow: "md",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <FormControl size="lg">
              <FormLabel>For</FormLabel>
              <Input value="Backend wanna" disabled />
            </FormControl>

            <FormControl size="lg">
              <FormLabel>Assign to</FormLabel>
              <Button
                startDecorator={<PeopleAltOutlinedIcon />}
                variant="plain"
                sx={{ justifyContent: "flex-start", color: "#1967d2" }}
              >
                All students
              </Button>
            </FormControl>

            <FormControl size="lg">
              <FormLabel>Points</FormLabel>
              <Controller
                name="points"
                control={control}
                render={({ field }) => (
                  <Select
                    size="lg"
                    value={field.value}
                    onChange={(_, val) => field.onChange(val)}
                  >
                    {[100, 50, 20, 10, 0].map((p) => (
                      <Option key={p} value={p}>
                        {p}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl size="lg">
              <FormLabel>Due</FormLabel>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Select
                    size="lg"
                    value={field.value}
                    onChange={(_, val) => field.onChange(val)}
                    placeholder="No due date"
                  >
                    <Option value="">No due date</Option>
                    <Option value={new Date().toISOString()}>Today</Option>
                  </Select>
                )}
              />
            </FormControl>

            <FormControl size="lg">
              <FormLabel>Topic</FormLabel>
              <Controller
                name="topicId"
                control={control}
                render={({ field }) => (
                  <Select
                    size="lg"
                    value={field.value}
                    onChange={(_, val) => field.onChange(val)}
                    placeholder="No topic"
                  >
                    <Option value="">No topic</Option>
                    <Option value="1">Create T</Option>
                  </Select>
                )}
              />
            </FormControl>
          </Sheet>
        </Stack>
      </Box>
    </form>
  );
}
