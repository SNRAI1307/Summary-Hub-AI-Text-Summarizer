'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, Trash2 } from 'lucide-react';

interface Article {
  id: number;
  url: string;
}

interface Summary {
  id: number;
  content: string;
  subject: string;
  createdAt: string;
  article: Article;
}

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState<'all' | 'selected' | null>(null);

  const { getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summaries`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch summaries');
        
        const data: Summary[] = await response.json();
        setSummaries(data);
      } catch (error) {
        console.error(error);
        setSummaries([]);
        toast({
          title: 'Error',
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummaries();
  }, [getToken, toast]);

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedIds(summaries.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const isAllSelected = summaries.length > 0 && selectedIds.length === summaries.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < summaries.length;

  const handleDeleteSelected = async () => {
    setIsDeleting('selected');
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summaries`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete summaries.');
      }

      setSummaries((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      toast({ title: "Success", description: `Deleted ${selectedIds.length} summary(ies).` });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting('all');
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summaries/all`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete all summaries.');
      }

      setSummaries([]);
      setSelectedIds([]);
      toast({ title: "Success", description: "All summaries deleted." });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index} className="block mb-2">
        {line}
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          {/* --- MODIFIED SECTION --- */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <CardTitle className="text-3xl font-bold">Summary History</CardTitle>
            
            {/* --- FIX: Added flex-wrap and justify-end --- */}
            {summaries.length > 0 && (
              <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end">
                
                {/* Delete Selected Button & Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="secondary"
                      disabled={selectedIds.length === 0 || !!isDeleting}
                      className="w-full sm:w-32" // Full width on mobile
                    >
                      {isDeleting === 'selected' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete ({selectedIds.length})
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the
                        {selectedIds.length > 1 ? ` ${selectedIds.length} selected summaries` : ' selected summary'}.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteSelected}
                        className={buttonVariants({ variant: "destructive" })}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Delete All Button & Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive w-full sm:w-32" // Full width on mobile
                      disabled={!!isDeleting}
                    >
                      {isDeleting === 'all' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete All"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete ALL {summaries.length} of your summaries. 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAll}
                        className={buttonVariants({ variant: "destructive" })}
                      >
                        Yes, delete all
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            )}
          </div>
          {/* --- END OF MODIFIED SECTION --- */}

          {summaries.length > 0 && (
            <div 
              className="flex items-center space-x-2 p-4 border-b border-white/20 hover:bg-white/5 transition-colors rounded-t-lg"
            >
              <Checkbox
                id="select-all"
                checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                onCheckedChange={(checked) => handleSelectAll(checked)}
                aria-label="Select all summaries"
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select All ({selectedIds.length} / {summaries.length})
              </label>
            </div>
          )}

        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && summaries.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              {summaries.map((summary) => (
                <AccordionItem 
                  key={summary.id} 
                  value={`item-${summary.id}`} 
                  className="border-white/20"
                >
                  <div 
                    className="flex items-center w-full group hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <div className="pl-4 py-4">
                      <Checkbox
                        id={`select-${summary.id}`}
                        checked={selectedIds.includes(summary.id)}
                        onCheckedChange={() => handleSelect(summary.id)}
                        aria-label={`Select summary: ${summary.subject}`}
                      />
                    </div>
                    
                    <AccordionTrigger className="flex-1 py-4 text-white hover:no-underline pl-3">
                      <div className="flex-1 text-left">
                        <p className={`text-lg font-semibold group-hover:text-primary transition-colors ${selectedIds.includes(summary.id) ? 'text-primary' : ''}`}>
                          {summary.subject}
                        </p>
                        <p className="text-sm text-neutral-400 flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(summary.createdAt)}
                        </p>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <div className="prose prose-invert max-w-none text-neutral-300 pl-11 pr-4">
                      {formatContent(summary.content)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {!isLoading && summaries.length === 0 && (
            <div className="text-center py-20 text-neutral-400">
              <p className="text-lg">No summaries found.</p>
              <p>Go to the &quot;Summarize&quot; page to create your first one.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}