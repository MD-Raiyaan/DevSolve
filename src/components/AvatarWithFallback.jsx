"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const AvatarWithFallback = ({ src, name }) => {
  const initials = name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return src ? (
    <img
      src={src}
      alt="Avatar"
      className="w-24 h-24 rounded-full object-cover border shadow"
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 text-white font-bold text-xl flex items-center justify-center shadow-inner">
      {initials}
    </div>
  );
};
