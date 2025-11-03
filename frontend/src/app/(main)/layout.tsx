import Link from "next/link";
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Image from "next/image";
import { FooterContactForm } from "@/components/FooterContactForm";
import { Linkedin, Mail } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // FIX: Changed gradient to solid dark purple background
    <div className="bg-brand-dark-purple text-neutral-200 min-h-screen flex flex-col relative"> 
      <div 
        className="absolute inset-0 z-0 opacity-5" 
        style={{
          backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />
      
      <MainHeader />
      
      <main className="p-0 flex-grow z-10 relative">
        {children}
      </main>

      <footer className="bg-black/30 text-neutral-400 p-8 md:p-12 mt-auto z-10 relative border-t border-white/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Summary Hub Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-xl font-bold text-white">
                Summary Hub
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-xs">
              Transform lengthy text into concise, meaningful summaries using advanced AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="mailto:contact@summaryhub.com" className="text-neutral-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <SignedIn>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-sm hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/summarize" className="text-sm hover:text-white transition-colors">Summarize Text</Link></li>
                <li><Link href="/history" className="text-sm hover:text-white transition-colors">History</Link></li>
              </ul>
            </SignedIn>
            <SignedOut>
              <p className="text-sm text-neutral-500">
                <Link href="/sign-in" className="text-primary hover:underline">Log in</Link> to see your personal links.
              </p>
            </SignedOut>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Me</h3>
            <FooterContactForm />
          </div>

        </div>
      </footer>
      <Toaster />
    </div>
  );
}