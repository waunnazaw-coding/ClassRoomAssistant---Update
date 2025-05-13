// utils/colorUtils.ts
export const generateColorScheme = (name: string = "") => {
  if (!name) {
    // Default hue for empty names
    return {
      baseColor: "hsl(0, 0%, 80%)",
      lightBg: "hsl(0, 0%, 97%)",
      hueValue: 0,
    };
  }
  const nameHash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = nameHash % 360;

  return {
    baseColor: `hsl(${hue}, 70%, 50%)`,
    lightBg: `hsl(${hue}, 80%, 95%)`,
    hueValue: hue,
  };
};
