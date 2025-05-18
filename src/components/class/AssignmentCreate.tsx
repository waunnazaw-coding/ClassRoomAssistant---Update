import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Input,
  Textarea,
  Button,
  Select,
  Option,
  Chip,
  Checkbox,
  Sheet,
  FormControl,
  FormLabel,
  Divider,
} from "@mui/joy";
import YouTubeIcon from "@mui/icons-material/YouTube";
import UploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createAssignment } from "../../api/assignment";
import { getAllTopics } from "../../api/topic";
import type { TopicDto, AttachmentDto } from "../../types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  instructions: z.string().optional(),
  points: z.number().min(0, "Min 0").max(100, "Max 100"),
  dueDate: z.string().optional(),
  topicId: z.string().optional(),
  createNewTopic: z.boolean(),
  newTopicTitle: z.string().optional(),
  studentIds: z.array(z.number()).optional(),
  youTubeUrl: z.string().url("Invalid URL").optional(),
  linkUrl: z.string().url("Invalid URL").optional(),
});

type FormValues = z.infer<typeof schema>;

interface AssignmentCreateFormProps {
  classId: number;
  userId: number;
  onCreated?: () => void;
  onError?: (msg: string) => void;
}

export default function AssignmentCreateForm({
  classId,
  userId,
  onCreated,
  onError,
}: AssignmentCreateFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      instructions: "",
      points: 100,
      dueDate: "",
      topicId: "",
      createNewTopic: false,
      newTopicTitle: "",
      studentIds: [],
      youTubeUrl: "",
      linkUrl: "",
    },
  });

  const createNewTopic = watch("createNewTopic");
  const [topics, setTopics] = useState<TopicDto[]>([]);
  const [attachments, setAttachments] = useState<AttachmentDto[]>([]);

  useEffect(() => {
    if (!userId) return;
    getAllTopics(userId)
      .then((data) => setTopics(data))
      .catch((err) => onError?.(err?.response?.data?.message ?? err.message));
  }, [userId, onError]);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachments((prev) => [
        ...prev,
        { fileType: "Upload", fileName: file.name },
      ]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const { youTubeUrl, linkUrl, ...rest } = data;

    const attachmentList: AttachmentDto[] = [...attachments];
    if (youTubeUrl)
      attachmentList.push({ fileType: "YouTube", fileUrl: youTubeUrl });
    if (linkUrl) attachmentList.push({ fileType: "Link", fileUrl: linkUrl });

    const payload = {
      classId,
      createNewTopic: data.createNewTopic,
      newTopicTitle: data.createNewTopic ? data.newTopicTitle || null : null,
      selectedTopicId: !data.createNewTopic
        ? data.topicId
          ? Number(data.topicId)
          : null
        : null,
      assignmentTitle: data.title,
      instructions: data.instructions || null,
      points: data.points,
      dueDate: data.dueDate || null,
      allowLateSubmission: false,
      studentIds: data.studentIds?.length ? data.studentIds : null,
      attachments: attachmentList,
      createdByUserId: userId,
    };

    try {
      await createAssignment(payload);
      onCreated?.();
    } catch (err: any) {
      onError?.(err?.response?.data?.message ?? err.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Sheet
        variant="outlined"
        sx={{ p: 3, borderRadius: "md", maxWidth: 700, mx: "auto" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography level="h4">Create Assignment</Typography>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Title"
                  error={!!errors.title}
                  required
                />
              )}
            />
            {errors.title && (
              <Typography level="body-xs" color="danger">
                {errors.title.message}
              </Typography>
            )}

            <Controller
              name="instructions"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  minRows={3}
                  placeholder="Instructions (optional)"
                />
              )}
            />

            <Controller
              name="points"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Points"
                  error={!!errors.points}
                  slotProps={{ input: { min: 0, max: 100 } }}
                />
              )}
            />
            {errors.points && (
              <Typography level="body-xs" color="danger">
                {errors.points.message}
              </Typography>
            )}

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  placeholder="Due Date"
                  slotProps={{
                    input: {
                      min: new Date().toISOString().split("T")[0],
                    },
                  }}
                />
              )}
            />

            <FormControl>
              <FormLabel>New Topic</FormLabel>
              <Controller
                name="createNewTopic"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="Create new topic"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </FormControl>

            {createNewTopic ? (
              <Controller
                name="newTopicTitle"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="New Topic Title" />
                )}
              />
            ) : (
              <Controller
                name="topicId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value ?? ""}
                    onChange={(_, val) => field.onChange(val)}
                    placeholder="Select Topic"
                  >
                    <Option value="">No topic</Option>
                    {topics.map((t) => (
                      <Option key={t.id} value={t.id.toString()}>
                        {t.title}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            )}

            <Divider />

            <Typography level="body-sm">Attachments</Typography>

            <Controller
              name="youTubeUrl"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="YouTube URL"
                  startDecorator={<YouTubeIcon />}
                  error={!!errors.youTubeUrl}
                />
              )}
            />
            {errors.youTubeUrl && (
              <Typography level="body-xs" color="danger">
                {errors.youTubeUrl.message}
              </Typography>
            )}

            <Controller
              name="linkUrl"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="External Link"
                  startDecorator={<LinkIcon />}
                  error={!!errors.linkUrl}
                />
              )}
            />
            {errors.linkUrl && (
              <Typography level="body-xs" color="danger">
                {errors.linkUrl.message}
              </Typography>
            )}

            <Stack direction="row" spacing={2}>
              <label htmlFor="upload-file">
                <input
                  id="upload-file"
                  type="file"
                  hidden
                  onChange={handleUploadFile}
                />
                <Button component="span" startDecorator={<UploadIcon />}>
                  Upload File
                </Button>
              </label>
            </Stack>

            {attachments.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {attachments.map((a, i) => (
                  <Chip key={i} variant="outlined">
                    {a.fileType || a.fileUrl || a.fileType}
                  </Chip>
                ))}
              </Stack>
            )}

            <Button type="submit" sx={{ mt: 2 }}>
              Create Assignment
            </Button>
          </Stack>
        </form>
      </Sheet>
    </Box>
  );
}
