"use client";

import { useEffect } from "react";
import { GlobalStoreProps, useGlobalStore } from "@/stores/global-store";

export function GlobalStoreInitializer({ contact }: { contact: GlobalStoreProps | null }) {
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);

  useEffect(() => {
    if (contact) {
      setUserInfo(contact);
    }
  }, [contact, setUserInfo]);

  return null;
}
