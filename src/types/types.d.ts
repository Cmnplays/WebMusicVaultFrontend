import React from "react";

declare global {
  type AudioRef = React.RefObject<HTMLAudioElement | null>;
  type PanelRef = React.RefObject<HTMLDivElement | null>;
  type InputRef = React.RefObject<HTMLInputElement | null>;
}
