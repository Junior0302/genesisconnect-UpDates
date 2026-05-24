"use client";

import { Link } from "@/i18n/routing";
import { LinkProps } from "next/link";
import { ReactNode } from "react";
import { useTransition } from "@/context/TransitionContext";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function TransitionLink({ 
  children, 
  href, 
  className, 
  onClick,
  ...props 
}: TransitionLinkProps) {
  const { navigate } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default next/link behavior
    e.preventDefault();
    
    // Call any optional onClick handler passed as prop
    if (onClick) onClick(e);

    // Trigger our custom transition navigation
    navigate(href.toString());
  };

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
