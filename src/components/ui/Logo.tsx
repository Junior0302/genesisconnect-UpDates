import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`font-serif tracking-tight ${className}`}>
      G<span className="mx-0.5">·</span>C
    </span>
  );
}
