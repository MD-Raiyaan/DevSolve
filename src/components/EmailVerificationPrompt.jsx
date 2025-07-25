"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { account } from "@/models/client/config";
import { useAuthStore } from "@/store/auth"; // adjust path
import { env } from "@/env";
import toast from "react-hot-toast";

const EmailVerificationPrompt = ({ onClose }) => {
  const [status, setStatus] = useState("idle"); 

  const handleResend = async () => {
    try {
      setStatus("loading");
      await verifyUser();
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  const verifyUser=async()=>{
  
      const promise = account.createVerification(`${env.domain}/verify`);
  
       
       promise.then(function (response) {
          toast.success("Verification email sent! Please check your inbox.");
          setStatus("success");
        })
        .catch(function (error) {
          console.log("verifyError ",error);
          toast.error("Failed to send verification email. Please try again.");
        });
       
    }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <Card className="relative w-full max-w-md border border-border bg-background/90 shadow-2xl">
        {/* ❌ Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto mb-2 h-10 w-10 text-yellow-500" />
          <CardTitle className="text-2xl font-bold">
            Email Not Verified
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center px-6 pb-6">
          <p className="text-sm text-muted-foreground">
            You need to verify your email address to continue using all features
            of Devsolve. Please check your inbox and click the verification
            link.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center text-green-600 gap-2 text-sm font-medium">
              <CheckCircle className="h-5 w-5" />
              Verification email sent!
            </div>
          ) : (
            <Button
              className="w-full sm:w-auto"
              disabled={status === "loading"}
              onClick={handleResend}
            >
              {status === "loading"
                ? "Sending..."
                : "Resend Verification Email"}
            </Button>
          )}

          {status === "error" && (
            <p className="text-red-500 text-sm mt-2">
              Something went wrong. Please try again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPrompt;
