"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", displayName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
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
          <h1 className="text-3xl font-bold text-[#f5f5f5]">Join Exotic</h1>
          <p className="text-[#6c7883] mt-2">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#17212b] rounded-xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="johndoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              icon={<User size={18} />}
              required
            />
            <Input
              label="Display Name"
              type="text"
              placeholder="John Doe"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              icon={<User size={18} />}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<Mail size={18} />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              icon={<Lock size={18} />}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6c7883]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="text-[#2b5278] hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
