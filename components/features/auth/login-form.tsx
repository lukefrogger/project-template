"use client";
import { useAppForm } from "@/hooks/use-form";
import { signInWithUsernameAndPassword } from "@/services/firebase/auth";
import { useState } from "react";
import { z } from "zod";
import Message from "@/components/message";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginFormSchema,
    },

    onSubmit: async ({ value }) => {
      // First validate the login by checking if contact exists
      try {
        const validationResult = await api.auth.validateLogin(value.email);

        if (
          validationResult.message === "NO_ACCOUNT_FOUND" ||
          validationResult.message === "NO_MEMBER_PORTAL_ACCOUNT"
        ) {
          setError("Not a valid login attempt. Please sign-up for an AMGA Membership.");
          return;
        } else if (validationResult.message === "MIGRATION_ACCOUNT_FOUND") {
          router.push(`/account-verification?email=${value.email.toLowerCase().trim()}`);
          return;
        }
      } catch (validationError) {
        console.error("Login validation error:", validationError);
        setError("Unable to validate your account. Please try again.");
        return;
      }

      // If validation passes, proceed with Firebase authentication
      const error = await signInWithUsernameAndPassword(value.email, value.password);
      if (error) {
        const message =
          error === "invalid-credential"
            ? "Invalid email or password."
            : "An unknown error occurred and you cannot login at this time.";
        setError(message);
      } else {
        router.replace("/dashboard");
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
      <div className="flex flex-col gap-1">
        <form.AppField
          name="password"
          children={(field) => (
            <field.PasswordInput label="Password" htmlFor={field.name} placeholder="Password" required />
          )}
        />
        <div className="flex justify-end">
          <Link href="/reset-password" className="underline text-base text-primary-600">
            Forgot Password
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {error && <Message variant="destructive" description={error} />}
        <form.AppForm>
          <form.SubmitButton label="Log In" />
        </form.AppForm>
      </div>
    </form>
  );
}
