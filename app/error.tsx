"use client";

import { useEffect, useState } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  const [errorCode, setErrorCode] = useState(500);

  useEffect(() => {
    console.error(error);
    if (error && "statusCode" in error) {
      setErrorCode(error.statusCode || 500);
    }
  }, [error]);

  return (
    <div className="flex-1 flex flex-col m-0 md:m-6 border-0 md:border-1 border-neutral-200 rounded-lg min-w-0">
      <main className="flex-1 flex flex-col">
        <div className={`flex-1 mb-4 w-full max-w-4xl mx-auto`}>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-xl font-medium text-neutral-700 mb-2 mt-12">
              {errorCode} {errorCode === 500 ? "Internal Server Error" : "Error"}
            </h2>
            <p className="text-gray-500 mb-6">
              {error?.message ||
                "Oops! We couldn't find what you were looking for. It might have been moved or deleted."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
