"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; 
import { Menu, Router } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/auth";
import { account } from "@/models/client/config";
import toast from "react-hot-toast";
import { env } from "@/env";
import { useRouter } from "next/navigation";

export default function Navbar({ className }) {

  const { session, logout} = useAuthStore();
  const verified = useAuthStore((state) => state.verified);
  const router=useRouter();

  const handleLogout=()=>{
      logout();
      router.push("/login");
  }

  const verifyUser=async()=>{
    console.log(`${env.domain}/verify`);
    const promise= account.createVerification(`${env.domain}/verify`);

     promise.then(function (response) {
        toast.success("Verification email sent! Please check your inbox.");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Failed to send verification email. Please try again.");
      });
     
  }
 

  const LoginSignupEle = (
    <>
      <Button size={"sm"}>
        <Link href={"/login"}>Login</Link>
      </Button>
      <Button size={"sm"}>
        <Link href={"/signup"}>Signup</Link>
      </Button>
    </>
  );
  const verifyEle = (
    <>
      <Button size={"sm"} onClick={verifyUser}>
         Verify
      </Button>
    </>
  );


  const LogoutEle = (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90  p-[4px] font-medium rounded-md">
         Logout
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will log you out of your account. You will need to sign
            in again to access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <nav
      className={cn(
        "bg-white shadow-md fixed top-0 left-0 right-0 z-50",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Brand */}
          <div className="text-xl font-bold text-gray-800">DevSolve</div>

          <div className="hidden md:flex flex-1 space-x-8 ml-10 dark:text-black">
            <Link
              href="/"
              className="hover:text-blue-600 hover:scale-110 font-medium"
            >
              Home
            </Link>
            <Link
              href="/profile"
              className="hover:text-blue-600 hover:scale-110 font-medium"
            >
              Profile
            </Link>
            <Link
              href="/questions"
              className="hover:text-blue-600 hover:scale-110 font-medium"
            >
              Questions
            </Link>
          </div>

          <div className="hidden md:flex ml-auto space-x-2">
            <ThemeToggle
              className={"shadow dark:bg-black dark:hover:bg-black"}
            />
            {!verified  && verifyEle}
            {session ? LogoutEle : LoginSignupEle}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="md:hidden">
                <Menu size={24} className="dark:text-black" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/" className="hover:text-blue-600 font-medium">
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/profile"
                  className="hover:text-blue-600 font-medium"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/questions"
                  className="hover:text-blue-600 font-medium"
                >
                  Questions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                 {!verified  && verifyEle}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {session ? LogoutEle : LoginSignupEle}
              </DropdownMenuItem>

              <DropdownMenuItem>
                <ThemeToggle
                  className={"shadow dark:bg-black dark:hover:bg-black"}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
