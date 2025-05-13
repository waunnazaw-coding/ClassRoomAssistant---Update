import React, { useState } from "react";
import { Button, TextField, Box, Alert } from "@mui/joy";
import { createTopic } from "../../api/topic"; // Adjust the import path as needed
import type { TopicDto } from "../../types/index";

interface TopicCreateFormProps {
  userId: number;
  onCreated?: (topic: TopicDto) => void;
  onClose?: () => void;
}

const TopicCreateForm: React.FC<TopicCreateFormProps> = ({
  userId,
  onCreated,
  onClose,
}) => {
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Assuming `createTopic` returns a TopicDto
      const newTopic: TopicDto = await createTopic({ title, userId });
      onCreated?.(newTopic);
      setTitle(""); // Clear the form
      onClose?.();  // Close the form if needed
    } catch (err) {
      // Improved error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create topic");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Topic Title"
        variant="outlined"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        required
        disabled={loading}
        autoFocus
      />
      {error && <Alert color="danger">{error}</Alert>}
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Topic"}
      </Button>
    </Box>
  );
};

export default TopicCreateForm;
