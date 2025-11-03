'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Sparkles, UploadCloud } from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

// This is the light-themed static UI for the landing page
const StaticSummarizerUI = () => (
  <div className="relative cursor-pointer group">
    <div 
      className="absolute inset-0 z-10 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" 
      aria-hidden="true" 
    >
       <p className="text-white text-2xl font-semibold drop-shadow-md">Click to Get Started!</p>
    </div>
    {/* Light theme card styles */}
    <Card className="w-full max-w-4xl mx-auto shadow-2xl text-neutral-900">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <Tabs defaultValue="Paragraph" className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="Paragraph">Paragraph</TabsTrigger>
              <TabsTrigger value="Bullet Points">Bullet Points</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="w-full sm:max-w-xs">
            <div className="flex justify-between text-sm font-medium text-neutral-600 px-1 mb-2">
              <span className="text-neutral-600">Short</span>
              <span className="text-primary font-semibold">Medium</span>
              <span className="text-neutral-600">Long</span>
            </div>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              disabled
              className="[&>[data-slot=track]]:bg-neutral-200"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label htmlFor="input-static" className="text-sm font-semibold text-neutral-700">Your text (no character limit)</label>
            <Textarea
              id="input-static"
              placeholder="Begin typing or paste text here..."
              className="w-full h-72 text-base resize-none"
              disabled
              readOnly
            />
            <span className="text-sm text-neutral-500">0 words</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Summary</label>
            <Card className="h-72 border-dashed relative">
              <CardContent className="p-4 h-full overflow-y-auto">
                <p className="text-neutral-500 text-center pt-24">
                  Your summary will appear here.
                </p>
              </CardContent>
            </Card>
            <span className="text-sm text-neutral-500">0 words</span>
          </div>
        </div>
        <div 
          className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer bg-neutral-50"
        >
          <UploadCloud className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
          <p className="font-semibold text-neutral-600">
            Drag & drop a file here, or click to select
          </p>
          <p className="text-sm text-neutral-500">.txt or .pdf files only</p>
        </div>
        <Button
          size="lg"
          className="w-full text-lg font-semibold bg-green-500 hover:bg-green-600"
          disabled
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Summarize
        </Button>

      </CardContent>
    </Card>
  </div>
);

export default function Summarizer() {
  return (
    <>
      <SignedOut>
        <SignUpButton mode="modal">
          <div>
            <StaticSummarizerUI />
          </div>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Link href="/summarize">
          <StaticSummarizerUI />
        </Link>
      </SignedIn>
    </>
  );
}