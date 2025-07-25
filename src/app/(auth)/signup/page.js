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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";
import { LoaderOne } from "@/components/ui/loader";
import toast from "react-hot-toast";

function Signup() {
  const { login, createAccount } = useAuthStore();
  const [isloading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const isError = () => {
    return error.length > 0;
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
      <div className="w-full mb-4 text-red-600 p-0  text-sm mt-1 animate-in fade-in slide-in-from-top-1">
        {message}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");



    if (!email || !password || !firstname || !lastname) {
      setError(() => "Please fill out all fields");
      return;
    }

    setLoading(() => true);
    setError(() => "");

    const Signupresponse = await createAccount(
      `${firstname} ${lastname}`,
      email,
      password
    );

    if (Signupresponse?.error) {
      setError(() => Signupresponse.error.toString());
    } else {
      const Loginresponse = await login(email, password);

      if (Loginresponse?.error) {
        setError(() => Loginresponse.error.toString());
      }
    }

    setLoading(() => false);
  };
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
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} method="POST">
              {isError() && <ErrorMessage message={error} />}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstname"
                    placeholder="First Name"
                    name="firstname"
                    type="text"
                  />

                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastname"
                    placeholder="Last Name"
                    name="lastname"
                    type="text"
                  />

                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" name="password" />
                </div>
              </div>
              <div className="pt-4 ">
                <Button type="submit" className="w-full cursor-pointer">
                  Sign Up
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                toast.error("🚫 Google signup is disabled for demo purposes.")
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

export default Signup;
