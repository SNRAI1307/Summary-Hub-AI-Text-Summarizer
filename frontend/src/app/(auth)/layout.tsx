import React from 'react';
import "../globals.css";

// This layout is nested inside the root layout.
// It should only contain the children.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}