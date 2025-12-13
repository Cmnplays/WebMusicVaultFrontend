export type ConsoleSection = "upload" | "view" | "settings";

export interface SecretNavProps {
  section: ConsoleSection;
  setSection: (section: ConsoleSection) => void;
}
