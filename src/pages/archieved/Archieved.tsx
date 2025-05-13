import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import ArchivedClassCard from "../../components/class/ArchivedClassCard";
import { useAuth } from "../../contexts/AuthContext";
import { getClassesByUserId, ClassResponseDto } from "../../api/classes";

export default function Archived() {
  const { user } = useAuth();
  const [archivedClasses, setArchivedClasses] = useState<ClassResponseDto[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setArchivedClasses([]);
      return;
    }

    setLoading(true);
    getClassesByUserId(user.id)
      .then((data) => {
        const archived = data.filter((cls) => cls.isDeleted);
        setArchivedClasses(archived);
      })
      .catch((error) => {
        console.error("Failed to fetch archived classes:", error);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <Box sx={{ width: "100%", px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
      <Typography level="h4" component="h1" sx={{ fontWeight: 600, mb: 2 }}>
        Archived Classes
      </Typography>

      {loading ? (
        <Typography textAlign="center" mt={4}>
          Loading archived classes...
        </Typography>
      ) : archivedClasses.length === 0 ? (
        <Typography textAlign="center" mt={4}>
          No archived classes found.
        </Typography>
      ) : (
        <ArchivedClassCard
          archivedClasses={archivedClasses}
          onRemoveClass={(id) =>
            setArchivedClasses((prev) => prev.filter((cls) => cls.id !== id))
          }
        />
      )}
    </Box>
  );
}
