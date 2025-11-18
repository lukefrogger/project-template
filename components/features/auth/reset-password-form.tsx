"use client";
import { useAppForm } from "@/hooks/use-form";
import { useState } from "react";
import { z } from "zod";
import Message from "../../message";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sendPasswordReset } from "@/services/firebase/auth";

const resetPasswordFormSchema = z.object({
  email: z.string().email(),
});

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: resetPasswordFormSchema,
    },

    onSubmit: async ({ value }) => {
      setError(null);
      setSuccess(false);

      const result = await sendPasswordReset(value.email);
      if (result) {
        const message =
          result === "user-not-found"
            ? "No account found with this email address."
            : result === "invalid-email"
              ? "Please enter a valid email address."
              : "An error occurred. Please try again later.";
        setError(message);
      } else {
        setSuccess(true);
      }
    },
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField
        name="email"
        children={(field) => (
          <field.EmailInput label="Email Address" htmlFor={field.name} placeholder="Email Address" required />
        )}
      />

      <div className="flex flex-col gap-4">
        {error && <Message variant="destructive" description={error} />}
        {success && <Message variant="success" description="A reset password link has been sent to your email." />}
        <div className="flex flex gap-4 justify-between">
          <Button variant="outline" asChild tabIndex={-1}>
            <Link href="/login">Back to Log In</Link>
          </Button>
          <form.AppForm>
            <form.SubmitButton label="Send Reset Link" />
          </form.AppForm>
        </div>
      </div>
    </form>
  );
}
