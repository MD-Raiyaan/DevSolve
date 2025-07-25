"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { account } from "@/models/client/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setVerified } = useAuthStore();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setStatus("error");
      setMessage("Missing verification parameters in URL.");
      return;
    }

    account
      .updateVerification(userId, secret)
      .then(() => {
        setVerified();
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setMessage("Verification failed. Link may be invalid or expired.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-xl border bg-background/80 backdrop-blur-md">
        <CardHeader className="text-center">
          {status === "loading" && (
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          )}
          {status === "success" && (
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="mx-auto h-10 w-10 text-red-500" />
          )}
          <CardTitle className="text-xl font-semibold mt-2">
            {status === "loading" && "Verifying..."}
            {status === "success" && "Email Verified 🎉"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4 pb-6">
          <p className="text-sm text-muted-foreground">{message}</p>

          {status === "success" && (
            <Button asChild className="w-full sm:w-auto">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}

          {status === "error" && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">Go Back Home</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyPage;
