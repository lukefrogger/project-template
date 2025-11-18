"use client";
import { Info, WarningCircle } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ReactElement, ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LoadingButton from "./loading-button";

export type MessageProps = {
  title?: string;
  description?: string;
  variant?: "destructive" | "default" | "success" | "warning" | "info";
  icon?: ReactElement | ReactNode;
  className?: string;
  children?: ReactNode;
};

export default function Message({ title, description, variant = "default", icon, className }: MessageProps) {
  return (
    <Alert variant={variant} className={className}>
      {variant === "default" && !icon && <Info />}
      {variant === "destructive" && !icon && <WarningCircle />}
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}
