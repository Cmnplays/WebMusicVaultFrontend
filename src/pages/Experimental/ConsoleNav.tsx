import type { SecretNavProps, ConsoleSection } from "./consoleNav.types";

const tabs: { label: string; value: ConsoleSection }[] = [
  { label: "Upload", value: "upload" },
  { label: "View Entries", value: "view" },
  { label: "Settings", value: "settings" },
];

export default function ConsoleNav({ section, setSection }: SecretNavProps) {
  return (
    <div className="flex gap-4 text-sm mb-3 border-b border-slate-800 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setSection(tab.value)}
          className={`transition ${
            section === tab.value
              ? "text-purple-400 font-medium"
              : "text-slate-300 hover:text-purple-300"
          }`}
        >
          {tab.label}
        </button>
      ))}

      <button
        onClick={() => (window.location.href = "/")}
        className="ml-auto text-red-400 hover:text-red-300 transition"
      >
        Exit Console
      </button>
    </div>
  );
}
