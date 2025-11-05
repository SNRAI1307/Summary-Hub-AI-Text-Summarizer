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
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Summary Hub Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl font-bold text-white hidden sm:inline-block">
              Summary Hub
            </span>
          </Link>
        </div>

        
        <div className="hidden sm:flex items-center gap-4">
          <SignedIn>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </SignedIn>
        </div>

        
        <div className="flex items-center gap-4">
          <SignedOut>
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          
          <SignedIn>
            {/* Desktop User Info & Logout */}
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
            
            {/* Mobile Nav Links & Logout */}
            <div className="sm:hidden flex items-center gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button 
                variant="destructive" 
                size="icon"
                className="w-8 h-8"
                onClick={() => signOut({ redirectUrl: '/' })}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>

          </SignedIn>
        </div>
        
      </nav>
    </header>
  );
}