import React, { useState, useEffect } from "react";
import { Button, Box, Alert, Textarea } from "@mui/joy";
import { createTopic } from "../../api/topic";
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

  useEffect(() => {
    if (!error) return;
    const handler = setTimeout(() => setError(null), 500);
    return () => clearTimeout(handler);
  }, [title, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Topic title cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newTopic: TopicDto = await createTopic({
        title: trimmedTitle,
        userId,
      });
      onCreated?.(newTopic);
      setTitle("");
      onClose?.();
    } catch (err: unknown) {
      let message = "Failed to create topic. Please try again.";

      if (err && typeof err === "object") {
        if (
          "response" in err &&
          err.response &&
          typeof err.response === "object"
        ) {
          // @ts-ignore
          if (err.response.data?.message) {
            // @ts-ignore
            message = err.response.data.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      noValidate
      aria-live="polite"
    >
      <Textarea
        placeholder="Enter topic title"
        minRows={2}
        required
        disabled={loading}
        autoFocus
        value={title}
        onChange={onChangeTitle}
        sx={{
          "&::before": { display: "none" },
          "&:focus-within": {
            outline: "2px solid var(--Textarea-focusedHighlight)",
            outlineOffset: "2px",
          },
        }}
        aria-label="Topic title"
        aria-invalid={!!error}
        aria-describedby={error ? "topic-title-error" : undefined}
      />

      {error && (
        <Alert
          color="danger"
          id="topic-title-error"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading || !title.trim()}
        aria-disabled={loading || !title.trim()}
        aria-busy={loading}
      >
        {loading ? "Creating..." : "Create Topic"}
      </Button>
    </Box>
  );
};

export default TopicCreateForm;
