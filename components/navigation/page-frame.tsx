"use client";

import React, { useEffect, useState } from "react";
import { CaretDown, UserCircle, IdentificationCard, SignOut, List, ArrowLeft } from "@phosphor-icons/react";
import { MemberAvatar } from "../member-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useGlobalStore } from "@/stores/global-store";
import { PageBanner } from "../page-banner";

export type PageFrameProps_T = {
  children: React.ReactNode;
  title: string;
  useContainer?: boolean;
  breadcrumb?: {
    label: string;
    href: string;
  };
};

export function PageFrame({ children, title, useContainer, breadcrumb }: PageFrameProps_T) {
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);

  useEffect(() => {
    if (breadcrumb && breadcrumb.href) {
      setShowBreadcrumb(true);
    }
  }, [breadcrumb]);

  return (
    <div className="flex-1 flex flex-col m-0 md:m-6 border-0 md:border-1 border-neutral-200 rounded-lg min-w-0">
      <header className="border-b border-neutral-200 flex items-center justify-between pl-4">
        <div className="flex items-center">
          <div className="text-lg sm:text-2xl font-semibold text-neutral-600 py-3">{title}</div>
        </div>
        <div className="flex items-center gap-0 h-full">
          <ProfileDropdown />
        </div>
      </header>
      {showBreadcrumb && <Breadcrumb crumb={breadcrumb} />}
      <main className="flex-1 flex flex-col">
        <PageBanner />
        <div className={`flex-1 mb-4${useContainer ? " w-full max-w-4xl mx-auto" : ""}`}>{children}</div>
      </main>
    </div>
  );
}

export function Breadcrumb({ crumb }: { crumb?: { label: string; href: string } }) {
  if (!crumb) {
    crumb = { label: "Back to Program Search", href: "/program-search" };
  }

  return (
    <div className="flex bg-neutral-100 w-full">
      <Link href={crumb.href} className="pl-4 py-1 flex items-center gap-1 text-sm text-primitive-medium">
        <ArrowLeft size={16} weight="bold" />
        <span>{crumb.label}</span>
      </Link>
    </div>
  );
}

function ProfileDropdown() {
  const { userInfo } = useGlobalStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <HeaderButton className="pl-4 rounded-tr-lg">
          <MemberAvatar name={"Name"} size="sm" imageUrl={"https://via.placeholder.com/150"} />
          <div className="ml-1 mr-3">
            <CaretDown size={16} />
          </div>
        </HeaderButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-0 shadow-lg border-neutral-100"
        align="end"
        avoidCollisions={true}
        alignOffset={0}
        sideOffset={1}
      >
        <div className="p-4 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={""} alt={"name"} />
            <AvatarFallback>{"LF"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <p className="font-medium">{"Name"}</p>
            <p className="text-sm text-primitive-light font-base">{"Email"}</p>
          </div>
        </div>
        <div className="px-4">
          <Separator />
        </div>

        <div className="p-2">
          <DropdownMenuItem asChild className="flex items-center gap-2 py-2">
            <Link href="/profile">
              <UserCircle size={20} className="text-gray-600" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="flex items-center gap-2 py-2">
            <Link href="/membership">
              <IdentificationCard size={20} className="text-gray-600" />
              <span>Membership</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <div className="px-4">
          <Separator />
        </div>

        <div className="p-2">
          <DropdownMenuItem asChild className="flex items-center gap-2 py-2 font-semibold cursor-pointer">
            <button onClick={logOut} className="w-full">
              <SignOut className="text-primitive-dark" size={20} />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeaderButton({
  children,
  className,
  showIndicator = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  showIndicator?: boolean;
}) {
  return (
    <button
      className={`relative h-[56px] min-w-[56px] text-neutral-500 flex items-center justify-center hover:bg-neutral-100 cursor-pointer ${className || ""}`}
      {...props}
    >
      {children}
      {showIndicator && <span className="absolute top-[16px] right-[19px] w-2 h-2 bg-destructive rounded-full"></span>}
    </button>
  );
}
