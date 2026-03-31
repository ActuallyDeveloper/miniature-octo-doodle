"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1621] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#2b5278] rounded-full flex items-center justify-center">
            <MessageSquare size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#f5f5f5]">Exotic</h1>
          <p className="text-[#6c7883] mt-2">Sign in to continue messaging</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#17212b] rounded-xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6c7883]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="text-[#2b5278] hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>

          <div className="mt-4 p-3 bg-[#232e3c] rounded-lg">
            <p className="text-xs text-[#6c7883] mb-1">Demo accounts:</p>
            <p className="text-xs text-[#aaaaaa]">john@exotic.com / password123</p>
            <p className="text-xs text-[#aaaaaa]">jane@exotic.com / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
