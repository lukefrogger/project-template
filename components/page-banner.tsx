"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SealWarning } from "@phosphor-icons/react";
import { useGlobalStore } from "@/stores/global-store";

export type BannerType_T = "info" | "success" | "error" | "warning" | "neutral";

export type BannerIcon_T = "calendar" | "user" | "warning" | "instructor" | "currency" | "hand";

const semantic = {
  info: {
    bgColor: "bg-primary-50",
    iconColor: "text-primary-700",
  },
  success: {
    bgColor: "bg-success-50",
    iconColor: "text-success-600",
  },
  error: {
    bgColor: "bg-error-50",
    iconColor: "text-error-600",
  },
  warning: {
    bgColor: "bg-caution-50",
    iconColor: "text-caution-700",
  },
  neutral: {
    bgColor: "bg-neutral-50",
    iconColor: "text-neutral-600",
  },
};

const iconVariants = {
  warning: <SealWarning size={40} weight="light" />,
};

const bannerVariants = {
  preConfigMessage: {
    style: semantic.error,
    icon: iconVariants.warning,
    title: "Pre-configuration message",
    description: "This is a pre-configuration message.",
    actionLabel: "Action",
    actionHref: "/",
  },
};

export const usePageBanner = () => {
  const { userInfo } = useGlobalStore();
  // const searchParams = useSearchParams();

  if (userInfo) {
    return bannerVariants.preConfigMessage;
  }

  return null;
};

export function PageBanner() {
  const banner = usePageBanner();

  if (!banner) {
    return null;
  }

  return (
    <div
      className={`${banner.style.bgColor} flex flex-col items-start md:flex-row px-6 py-3 gap-4 mb-4 md:items-center justify-between border-b border-neutral-100`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <span className={banner.style.iconColor}>{banner.icon}</span>
        <div>
          <h3 className="font-semibold text-gray-800 leading-5">{banner.title}</h3>
          <p className="text-gray-800">{banner.description}</p>
        </div>
      </div>

      {banner.actionLabel && banner.actionHref && (
        <Button asChild variant="outline" className="whitespace-nowrap">
          <Link href={banner.actionHref}>{banner.actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
