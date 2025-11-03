'use client'; 

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth, useUser } from '@clerk/nextjs';
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  FileText, 
  History, 
  Info, 
  ListTodo, 
  PlusSquare, 
  Zap,
  Percent,
  Loader2,
  AlertCircle,
  LinkIcon,
  CalendarDays
} from "lucide-react";

interface Summary {
  id: number;
  content: string;
  subject: string;
  createdAt: string;
  article: {
    id: number;
    url: string;
  };
}

export default function DashboardPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error("API URL not configured");

        const response = await fetch(`${apiUrl}/summaries`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch summaries: ${response.statusText}`);
        }

        const data: Summary[] = await response.json();
        setSummaries(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, [getToken]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const recentSummaries = summaries.slice(0, 3);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* 1. Gradient Hero Section (from Image 1) */}
      <section className="bg-gradient-to-r from-primary to-blue-500 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.firstName || 'User'}!
        </h1>
        <p className="text-lg text-blue-100 mb-6">
          Transform your lengthy texts into concise, meaningful summaries with AI.
        </p>
        <Button asChild className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow">
          <Link href="/summarize">
            Create New Summary <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </section>

      {/* 2. Recent Summaries Section (from Image 2, but with list from Image 1) */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Recent Summaries</h2>
          <Button variant="link" asChild className="text-primary-light hover:text-white">
            <Link href="/history">View All</Link>
          </Button>
        </div>

        {/* Dark Card (matches Image 2 background) */}
        <Card className="bg-neutral-800 border-neutral-700 text-white shadow-xl">
          <CardContent className="p-6 min-h-[350px] flex flex-col items-center justify-center">
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-lg">Loading summaries...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center text-red-500 text-center">
                <AlertCircle className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Failed to load summaries</h3>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Empty State (matches Image 2) */}
            {!isLoading && !error && summaries.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-neutral-400">
                <Image
                  src="/3.png" 
                  alt="No summaries"
                  width={150}
                  height={150}
                  className="mb-6 opacity-80"
                />
                <h3 className="text-2xl font-semibold mb-2 text-white">No summaries yet</h3>
                <p className="text-lg text-neutral-500 mb-6 max-w-sm">
                  Create your first summary to get started. Transform articles into concise insights.
                </p>
                <Button asChild size="lg">
                  <Link href="/#summarizer">
                    <PlusSquare className="w-5 h-5 mr-2" /> Create Summary
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Summaries List (matches Image 1) */}
            {!isLoading && !error && summaries.length > 0 && (
              <div className="w-full">
                <Accordion type="single" collapsible className="w-full">
                  {recentSummaries.map((summary) => (
                    <AccordionItem value={`item-${summary.id}`} key={summary.id} className="bg-neutral-900 border-neutral-700 rounded-lg mb-3">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline text-white">
                        <div className="flex justify-between items-center w-full">
                          <div className="text-left">
                            <p className="text-lg font-medium text-primary-light">
                              {summary.subject}
                            </p>
                            <span className="text-xs text-muted-foreground flex items-center mt-1">
                              <CalendarDays className="w-3 h-3 mr-1.5" />
                              {formatDate(summary.createdAt)}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pt-0 pb-6">
                        <p className="text-base text-neutral-300 whitespace-pre-wrap">
                          {summary.content}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}