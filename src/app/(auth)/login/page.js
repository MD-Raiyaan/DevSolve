"use client";
import { useAuthStore } from "@/store/auth";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoaderOne } from "@/components/ui/loader";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";
import Link from "next/link";
import toast from "react-hot-toast";

function Login() {
  const { login } = useAuthStore();
  const [isloading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");



  const handleSubmit = async (e) => {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");


    if (!email || !password) {
      setError(() => "Please fill out all fields");
      return;
    }

    setLoading(() => true);
    setError(() => "");

    const response = await login(email, password);


    if (response?.success==false) {
      setError(() => response.error.toString());
    }

    setLoading(() => false);
  };

  const isError=()=>{
      return (error.length>0);
  }

  return (
    <div className="w-full max-w-xl px-4">
      {isloading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LoaderOne />
        </div>
      )}

      <Card className="w-full max-w-md sm:max-w-lg p-0 shadow-md border border-border">
        <MagicCard>
          <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
            <CardTitle>login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} method="POST">
              {isError() && <ErrorMessage message={error} />}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" name="password" />
                  <div className="text-sm text-right mt-1">
                    <Link href={"/forgot-password"}>Forgot password</Link>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full cursor-pointer">
                  Sign In
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() =>
                toast.error("🚫 Google login is disabled for demo purposes.")
              }
            >
              Continue with Google
            </Button>
          </CardFooter>
        </MagicCard>
      </Card>
    </div>
  );
}

export default Login;
