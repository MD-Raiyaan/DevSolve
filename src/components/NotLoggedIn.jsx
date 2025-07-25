"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const NotLoggedInPrompt = ({ onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 h-screen z-50 bg-black/40 flex items-center justify-center px-4">
      <Card className="relative w-full max-w-md border border-border bg-background/60 backdrop-blur-md shadow-2xl">
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="text-center">
          <LockIcon className="mx-auto mb-2 h-10 w-10 text-primary" />
          <CardTitle className="text-2xl font-bold">Login Required</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            You need to be logged in to ask a question on Devsolve. Please log
            in or sign up to continue.
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Button onClick={() => router.push("/login")} variant="default">
              Login
            </Button>
            <Button onClick={() => router.push("/signup")} variant="outline">
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotLoggedInPrompt;
