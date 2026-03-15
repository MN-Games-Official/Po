"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { apiClient } from "@/lib/api-client";

export function VerifyEmailForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState(
    "Use the verification link sent to your inbox to activate this operator account.",
  );

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      return;
    }

    setStatus("loading");
    apiClient<{ message: string }>(`/api/auth/verify-email?token=${token}`)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Verification failed.");
      });
  }, [params]);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader
        title="Email verification"
        subtitle="Polaris Pilot only grants access to verified operators."
      />
      {status === "success" ? (
        <Alert title="Email verified" tone="success">
          {message}
        </Alert>
      ) : status === "error" ? (
        <Alert title="Verification failed" tone="danger">
          {message}
        </Alert>
      ) : (
        <Alert title="Waiting for token" tone="info">
          {status === "loading" ? "Verifying your email now..." : message}
        </Alert>
      )}
      <Button className="mt-6 w-full" href="/login">
        Continue to sign in
      </Button>
    </Card>
  );
}
