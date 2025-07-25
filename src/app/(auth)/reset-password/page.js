// app/reset-password/page.js
"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { account } from "@/models/client/config";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Suspended from "@/components/Suspended";

function ResetPasswordComponent() {
  const params = useSearchParams();
  const router = useRouter();

  const userId = params.get("userId");
  const secret = params.get("secret");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await account.updateRecovery(userId, secret, password, confirm);
      toast.success("Password updated! You can now login.");
      router.push("/login");
    } catch (err) {
      toast.error("Password reset failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-black border border-border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <Input
          type="password"
          placeholder="New password"
          className="mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm password"
          className="mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button
          onClick={handleReset}
          disabled={loading || !password || !confirm}
          className="w-full"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspended fallback={<div className="text-center mt-10">Loading...</div>}>
      <ResetPasswordComponent />
    </Suspended>
  );
}
