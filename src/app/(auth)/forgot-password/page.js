"use client";

import React, { useState } from "react";
import { account } from "@/models/client/config";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await account.createRecovery(
        email,
        `${env.domain}/reset-password`
      );
      toast.success("Recovery email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send recovery email.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-black border border-border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your email to receive a password reset link.
        </p>
        <Input
          type="email"
          placeholder="Enter your email"
          className="mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          onClick={handleReset}
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
