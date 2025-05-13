import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getClassesByUserId,
  createClass,
  enrollInClass,
  updateClass,
  ClassRequestDto,
  ClassUpdateRequestDto,
  ClassResponseDto,
} from "../api/classes";
import { useAuth } from "./AuthContext";

interface ClassContextType {
  classes: ClassResponseDto[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  addClass: (data: ClassRequestDto) => Promise<void>;
  joinClass: (classCode: string) => Promise<void>;
  editClass: (id: number, data: ClassUpdateRequestDto) => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    if (!user) {
      setClasses([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getClassesByUserId(user.id);
      setClasses(data);
    } catch (err: any) {
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const addClass = async (data: ClassRequestDto) => {
    if (!user) throw new Error("User not logged in");
    const newClass = await createClass(data);
    setClasses((prev) => [...prev, newClass]);
  };

  const joinClass = async (classCode: string) => {
    if (!user) throw new Error("User not logged in");
    await enrollInClass(classCode, user.id);
    await fetchClasses(); // refresh list after join
  };

  const editClass = async (id: number, data: ClassUpdateRequestDto) => {
    const updated = await updateClass(id, data);
    setClasses((prev) => prev.map((cls) => (cls.id === id ? updated : cls)));
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  return (
    <ClassContext.Provider
      value={{
        classes,
        loading,
        error,
        fetchClasses,
        addClass,
        joinClass,
        editClass,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export function useClasses() {
  const context = useContext(ClassContext);
  if (!context) throw new Error("useClasses must be used within ClassProvider");
  return context;
}
