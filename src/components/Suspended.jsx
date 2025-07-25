// components/Suspended.js
import React, { Suspense } from "react";

const defaultFallback = <div>Loading…</div>;

export default function Suspended({ children }) {
  return <Suspense fallback={defaultFallback}>{children}</Suspense>;
}
