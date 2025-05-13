import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Stream from "../../components/class/Stream";
import { useParams } from "react-router-dom";
import ClassWord from "../../components/class/ClassWord";
import People from "../../components/class/People";
import { useAuth } from "../../contexts/AuthContext";
import { getClassById, getClassParticipants } from "../../api/classes";
import Toast from "../../components/common/Toast";

export default function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();

  // All hooks declared at the top
  const [classDetail, setClassDetail] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(participants);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<React.ReactNode>("");
  const [toastColor, setToastColor] = useState<
    "success" | "danger" | "warning" | "neutral"
  >("success");

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent | null,
    newValue: string | number | null
  ) => {
    if (typeof newValue === "number") {
      setActiveTab(newValue);
    }
  };

  useEffect(() => {
    if (!classId || !user) return;

    let isMounted = true;
    const classIdNum = Number(classId);

    const fetchClassData = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const classData = await getClassById(classIdNum);
        if (isMounted) setClassDetail(classData);

        const participantsData = await getClassParticipants(classIdNum);
        if (isMounted) setParticipants(participantsData);
      } catch (e) {
        if (isMounted) {
          setError("Failed to load class data.");
          setToastMessage("Failed to load class data.");
          setToastColor("danger");
          setToastOpen(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchClassData();

    return () => {
      isMounted = false;
    };
  }, [classId, user]);

  const classParticipant = participants.find((cp) => cp.userId === user?.id);

  const isTeacher = classParticipant?.role === "Teacher";
  const isSubTeacher = classParticipant?.role === "SubTeacher";

  const tabList =
    isTeacher || isSubTeacher
      ? ["Stream", "Classwork", "People", "Grades"]
      : ["Stream", "Classwork", "People"];

  useEffect(() => {
    if (!loading && !error && !classParticipant) {
      setToastMessage("You are not enrolled in this class.");
      setToastColor("warning");
      setToastOpen(true);
    }
  }, [loading, error, classParticipant]);

  if (loading) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }} level="body-lg">
        Loading class data...
      </Typography>
    );
  }

  if (error) {
    return (
      <>
        <Typography
          sx={{ mt: 4, textAlign: "center" }}
          level="body-lg"
          color="danger"
        >
          {error}
        </Typography>
        <Toast
          open={toastOpen}
          message={toastMessage}
          color={toastColor}
          onClose={() => setToastOpen(false)}
        />
      </>
    );
  }

  if (!classDetail) {
    return (
      <>
        <Typography sx={{ mt: 4, textAlign: "center" }} level="body-lg">
          Class not found.
        </Typography>
        <Toast
          open={toastOpen}
          message="Class not found."
          color="warning"
          onClose={() => setToastOpen(false)}
        />
      </>
    );
  }

  if (!classParticipant) {
    return (
      <>
        <Typography sx={{ mt: 4, textAlign: "center" }} level="body-lg">
          You are not enrolled in this class.
        </Typography>
        <Toast
          open={toastOpen}
          message={toastMessage}
          color={toastColor}
          onClose={() => setToastOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: 2, sm: 3, md: 4 },
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          bgcolor: "background.body",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <TabList
              tabFlex={0}
              sx={{
                position: "fixed",
                top: 0,
                zIndex: 1000,
                pt: 10,
                backgroundColor: "background.surface",
                borderBottom: "2px solid",
                borderColor: "notched",
                boxShadow: "sm",
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                width: "100%",
                overflowX: "auto",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                scrollbarWidth: "none",
              }}
            >
              {tabList.map((tabName, index) => (
                <Tab
                  key={index}
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tabName}
                </Tab>
              ))}
            </TabList>

            <TabPanel value={0} sx={{ p: 0 }}>
              <Box sx={{ mt: 6 }}>
                <Stream
                  classDetail={classDetail}
                  onCustomize={() => alert("Customize clicked!")}
                  isAuthorized={isTeacher || isSubTeacher}
                />
              </Box>
            </TabPanel>

            <TabPanel value={1} sx={{ p: 3 }}>
              <ClassWord role={classParticipant.role} />
            </TabPanel>

            <TabPanel value={2} sx={{ p: 3 }}>
              <People participants={participants} />
            </TabPanel>

            {(isTeacher || isSubTeacher) && (
              <TabPanel value={3} sx={{ p: 3 }}>
                <Typography
                  level="h4"
                  sx={{
                    fontWeight: 700,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Grades
                </Typography>
                {/* <Grade classId={classId!} /> */}
              </TabPanel>
            )}
          </Tabs>
        </Box>
      </Box>

      <Toast
        open={toastOpen}
        message={toastMessage}
        color={toastColor}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
