// utils/role.ts
export function isTeacherOrSubTeacher(role: string) {
  return role === "Teacher" || role === "SubTeacher" || role === "Student";
}
