'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainHeader() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/summarize", label: "Summarize" },
    { href: "/history", label: "History" },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4 h-16">
        
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition duration-200">
          <Image
            src="/logo.png"
            alt="Summary Hub Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-2xl font-bold text-white">
            Summary Hub
          </span>
        </Link>

        {/* Middle: Nav Links (Only for logged-in users) */}
        <SignedIn>
          <div className="hidden md:flex items-center gap-2 bg-neutral-800/50 p-1 rounded-lg border border-neutral-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <span className={`
                    px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'}
                  `}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </SignedIn>

        {/* Right: Auth Controls */}
        <div className="flex items-center space-x-3">
          <SignedOut>
            <Link href="/sign-in">
              <button className="px-4 py-2 text-sm font-medium text-white border border-white/50 rounded-md hover:bg-white/10 transition duration-200">
                Log In
              </button>
            </Link>
            <Link href="/sign-up">
               <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-200 transition duration-200">
                Get Started
              </button>
            </Link>
          </SignedOut>
          
          <SignedIn>
            {/* Custom User Info Display */}
            <div className="hidden sm:flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="bg-primary/20 text-primary-light font-semibold">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white truncate">
                  {user?.fullName}
                </span>
                <span className="text-xs text-neutral-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => signOut({ redirectUrl: '/' })}
              >
                Logout
              </Button>
            </div>
            
            {/* Fallback for very small screens (mobile) */}
            <div className="sm:hidden">
              <Link href="/dashboard" className="text-gray-200 hover:text-white transition duration-200 font-medium text-sm">
                Dashboard
              </Link>
            </div>

          </SignedIn>
        </div>
      </nav>
    </header>
  );
}