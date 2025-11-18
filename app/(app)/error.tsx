"use client";

import { useEffect, useState } from "react";
import { PageFrame } from "@/components/navigation/page-frame";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  const [errorCode, setErrorCode] = useState(500);
  console.log("error", error);

  useEffect(() => {
    console.error(error);
    if (error && "statusCode" in error) {
      setErrorCode(error.statusCode || 500);
    }
  }, [error]);

  return (
    <PageFrame title="Error" useContainer>
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-medium text-neutral-700 mb-2 mt-12">
          {errorCode} {errorCode === 500 ? "Internal Server Error" : "Error"}
        </h2>
        <p className="text-gray-600 mb-6">
          {error?.message || "Oops! We couldn't find what you were looking for. It might have been moved or deleted."}
        </p>
        <Button asChild variant="outline" className="border-neutral-300 text-neutral-600">
          <Link href="/dashboard">Back to My Dashboard</Link>
        </Button>
      </div>
    </PageFrame>
  );
}
