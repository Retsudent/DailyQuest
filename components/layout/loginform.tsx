"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Field } from "@/components/ui/field";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form
      onSubmit={handleLogin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Email */}
      <Field>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>

      {/* Password */}
      <Field>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <div className="flex items-center mb-1">
          <a
            href="#"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>

      {/* ERROR */}
      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}

      {/* LOGIN BUTTON */}
      <Button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <div className="flex-1 h-px bg-gray-200" />
        <span>Or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* GitHub Login */}
      {/* GITHUB */}
      <Button
        variant="secondary"
        type="button"
        onClick={() => signIn("github")}
        className="flex items-center justify-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Login with GitHub
      </Button>

      {/* GOOGLE */}
      <Button
        variant="secondary"
        type="button"
        onClick={() => signIn("google")}
        className="flex items-center justify-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
        >
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17.9 3.7 15.2 2.5 12 2.5 6.9 2.5 2.5 6.9 2.5 12S6.9 21.5 12 21.5c6.2 0 10.3-4.3 10.3-10.4 0-.7-.1-1.2-.2-1.7H12z"
          />
        </svg>
        Login with Google
      </Button>

      {/* APPLE */}
      <Button
        variant="secondary"
        type="button"
        onClick={() => signIn("apple")}
        className="flex items-center justify-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16.365 1.43c0 1.14-.45 2.24-1.19 3.06-.78.87-2.07 1.54-3.13 1.46-.12-1.12.47-2.28 1.21-3.03.78-.82 2.17-1.45 3.11-1.49zM20.56 17.06c-.57 1.31-.84 1.89-1.58 3.03-1.03 1.58-2.48 3.55-4.27 3.57-1.6.02-2.02-1.05-4.19-1.04-2.17.01-2.64 1.06-4.24 1.03-1.79-.02-3.16-1.84-4.19-3.42-2.88-4.42-3.18-9.62-1.41-12.35C2.5 6.9 4.18 5.8 6.02 5.77c1.73-.03 3.36 1.17 4.25 1.17.89 0 2.83-1.44 4.77-1.23.81.03 3.1.33 4.57 2.48-3.91 2.14-3.27 7.66.95 8.87z"/>
        </svg>
        Login with Apple
      </Button>

      {/* Footer */}
      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/register" className="underline underline-offset-4">
          Sign up
        </a>
      </p>
    </form>
  );
}