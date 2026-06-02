"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import Input from "@/components/ui/input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    // 🔥 basic validation
    if (password !== confirmPassword) {
      setError("Password does not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>

        {/* HEADER */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* NAME */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        {/* EMAIL */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FieldDescription>
            We&apos;ll use this to contact you.
          </FieldDescription>
        </Field>

        {/* PASSWORD */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        {/* CONFIRM PASSWORD */}
        <Field>
          <FieldLabel htmlFor="confirm-password">
            Confirm Password
          </FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FieldDescription>
            Please confirm your password.
          </FieldDescription>
        </Field>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {/* SUBMIT */}
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        {/* DIVIDER */}
        <FieldSeparator>Or continue with</FieldSeparator>

        {/* LOGIN LINK */}
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Login
            </a>
          </FieldDescription>
        </Field>

      </FieldGroup>
    </form>
  );
}