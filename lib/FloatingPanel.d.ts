import React from "react";
import { SwipeablePanelProps } from "./Panel";
export default function FloatingPanel({ children, panelContent, statusBarStyle, ...panelProps }: {
    children: React.ReactNode;
    panelContent: () => JSX.Element;
    statusBarStyle: "dark-content" | "light-content";
    isActive: boolean;
} & Omit<SwipeablePanelProps, "pan">): JSX.Element;
