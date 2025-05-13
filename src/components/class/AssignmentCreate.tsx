import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Input,
  Textarea,
  Stack,
  Typography,
  Select,
  Option,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { CreateAssignmentRequestDto } from "../../types/index";
import { createAssignment } from "../../api/assignment";

const assignmentSchema = z.object({
  classId: z.number().min(1),
  topicId: z.union([z.string().min(1), z.literal("")]).optional(),
  title: z.string().min(1, "Title is required"),
  instructions: z.string().optional(),
  points: z.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface Props {
  classId: number;
}

export default function AssignmentCreate({ classId }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      classId,
      topicId: "",
      title: "",
      instructions: "",
      points: 100,
      dueDate: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: AssignmentFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const dto: CreateAssignmentRequestDto = {
      classId: data.classId,
      topicId: data.topicId === "" ? null : Number(data.topicId),
      title: data.title,
      instructions: data.instructions || null,
      points: data.points ?? null,
      dueDate: data.dueDate || null,
    };

    try {
      await createAssignment(classId, dto);
      setSuccess("Assignment created successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Assignment Title"
              error={!!errors.title}
            />
          )}
        />
        {errors.title && (
          <Typography color="danger">{errors.title.message}</Typography>
        )}

        <Controller
          name="instructions"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Instructions (optional)" />
          )}
        />

        <Controller
          name="points"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Points">
              {[100, 50, 20, 10, 0].map((p) => (
                <Option key={p} value={p}>
                  {p}
                </Option>
              ))}
            </Select>
          )}
        />

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <Input {...field} type="date" placeholder="Due Date (optional)" />
          )}
        />

        <Controller
          name="topicId"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Topic">
              <Option value="">No topic</Option>
              <Option value="1">Topic 1</Option>
              {/* Add more topics dynamically as needed */}
            </Select>
          )}
        />

        {error && <Typography color="danger">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Assignment"}
        </Button>
      </Stack>
    </Box>
  );
}
