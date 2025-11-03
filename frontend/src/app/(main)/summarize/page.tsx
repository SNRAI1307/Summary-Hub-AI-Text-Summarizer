'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Copy, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { useToast } from "@/hooks/use-toast"; 

// --- FIX: REMOVED pdfjs-dist IMPORTS FROM THE TOP ---
// We will import them dynamically inside the functions

const countWords = (text: string) => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

// 3. Summary Display Component (for bullet points)
const SummaryDisplay = ({ text, format }: { text: string, format: string }) => {
  if (format === 'Bullet Points' && /^\s*[\*\-•]/.test(text)) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return (
      <ul className="list-disc list-inside space-y-2 text-sm text-neutral-800">
        {lines.map((line, index) => (
          <li key={index} className="pl-2">
            {line.replace(/^\s*[\*\-•]\s*/, '')}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-sm whitespace-pre-wrap text-neutral-800">{text}</p>;
};

export default function SummarizePage() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState(''); // This will now show the *last* summary
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [summaryFormat, setSummaryFormat] = useState('Paragraph');
  const [summaryLength, setSummaryLength] = useState([50]);
  const [inputWordCount, setInputWordCount] = useState(0);
  const [outputWordCount, setOutputWordCount] = useState(0);
  
  const { getToken } = useAuth();
  const { toast } = useToast(); 

  // --- FIX: DYNAMICALLY import and set the worker ---
  useEffect(() => {
    // This dynamically imports the 'pdfjs-dist' library
    import('pdfjs-dist').then(pdfjs => {
      // And *then* sets the worker source
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;
    });
  }, []);
  // ----------------------------------------------------

  useEffect(() => {
    setInputWordCount(countWords(inputText));
  }, [inputText]);

  useEffect(() => {
    setOutputWordCount(countWords(summary));
  }, [summary]);

  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    const reader = new FileReader();

    reader.onabort = () => {
      setError('File reading was aborted.');
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('File reading failed.');
      setIsUploading(false);
    };

    if (file.type === "text/plain") {
      reader.onload = () => {
        const text = reader.result as string;
        setInputText(text);
        setIsUploading(false);
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      reader.onload = async () => {
        try {
          // --- FIX: DYNAMICALLY import getDocument ---
          const { getDocument } = await import('pdfjs-dist');
          
          const arrayBuffer = reader.result as ArrayBuffer;
          const pdf = await getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            fullText += textContent.items.map((item) => {
                if ('str' in item) {
                  return item.str;
                }
                return '';
              }).join(' ') + '\n';
          }
          setInputText(fullText);
          setIsUploading(false);
        } catch (pdfError) {
          console.error("PDF Parsing Error:", pdfError);
          setError("Failed to read PDF file.");
          setIsUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Unsupported file type. Please upload a .txt or .pdf file.");
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isLoading || isUploading,
  });

  const getSliderLabel = (value: number) => {
    if (value < 34) return 'Short';
    if (value < 67) return 'Medium';
    return 'Long';
  };

  // --- 5. UPDATED handleSummarize function ---
  const handleSummarize = async () => {
    setIsLoading(true);
    setError('');
    // We don't clear the summary, so the user can see the last one while a new one is processing
    // setSummary(''); 
    setCopied(false);

    if (!inputText.trim()) {
      setError('Please enter text to summarize.');
      setIsLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) { throw new Error("Authentication token not available."); }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) { throw new Error("API URL not configured."); }

      const lengthLabel = getSliderLabel(summaryLength[0]);

      const response = await fetch(`${apiUrl}/summaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          textToSummarize: inputText,
          // Subject is auto-generated on the backend
          format: summaryFormat,
          length: lengthLabel
        }),
      });

      const data = await response.json();

      // --- Handle the 202 Accepted response ---
      if (response.status === 202) {
        toast({
          title: "✅ Summary Queued!",
          description: "Your summary is being generated and will appear in your History page shortly.",
        });
        setInputText(''); // Clear the input text
        setSummary(''); // Clear the last summary
      } else if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      } else {
        // This is a fallback if the backend *doesn't* use BullMQ
        // and returns a 200/201 with the summary directly
        if (data.summaryText) {
          setSummary(data.summaryText);
        } else {
          console.log("Unexpected response:", data);
        }
      }
      // ----------------------------------------

    } catch (err: unknown) {
      console.error("Summarization failed:", err);
      let errorMessage = 'Failed to generate summary. Please try again.';
      if (err instanceof Error) { errorMessage = err.message; }
      setError(errorMessage);
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setError('Failed to copy summary.');
      });
  };

  return (
    // This wrapper is for your light-theme summarizer component
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-primary font-semibold">AI Summarizing Tool:</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Free Text Summary Generator</h1>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
          Simplify your content writing with our AI summarizer. Transform your sentences, paragraphs, and articles into digestible copy and summarize any text in one click.
        </p>
      </div>

      <Card className="shadow-2xl text-neutral-900">
        <CardContent className="p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <Tabs defaultValue="Paragraph" className="w-full sm:w-auto" onValueChange={setSummaryFormat}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="Paragraph">Paragraph</TabsTrigger>
                <TabsTrigger value="Bullet Points">Bullet Points</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-full sm:max-w-xs">
              <div className="flex justify-between text-sm font-medium text-neutral-600 px-1 mb-2">
                <span className={summaryLength[0] < 34 ? 'text-primary font-semibold' : ''}>Short</span>
                <span className={summaryLength[0] >= 34 && summaryLength[0] < 67 ? 'text-primary font-semibold' : ''}>Medium</span>
                <span className={summaryLength[0] >= 67 ? 'text-primary font-semibold' : ''}>Long</span>
              </div>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                onValueChange={setSummaryLength}
                disabled={isLoading || isUploading}
                className="[&>[data-slot=track]]:bg-neutral-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label htmlFor="input-text" className="text-sm font-semibold text-neutral-700">Your text (no character limit)</label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Begin typing or paste text here..."
                className="w-full h-72 text-base resize-none"
                disabled={isLoading || isUploading}
              />
              <span className="text-sm text-neutral-500">{inputWordCount} words</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-neutral-700">Summary</label>
                {summary && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary"
                    onClick={handleCopy}
                  >
                    <Copy className="mr-1.5 h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
              <Card className="h-72 border-dashed relative">
                <CardContent className="p-4 h-full overflow-y-auto">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  {!isLoading && !error && !summary && (
                    <p className="text-neutral-500 text-center pt-24">
                      Your summary will appear here.
                    </p>
                  )}
                  {summary && (
                    <SummaryDisplay text={summary} format={summaryFormat} />
                  )}
                </CardContent>
              </Card>
              <span className="text-sm text-neutral-500">{outputWordCount} words</span>
            </div>
          </div>

          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors
              ${isDragActive ? 'bg-primary/10 border-primary' : 'bg-neutral-50'}
              ${(isLoading || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
                <p className="font-semibold text-neutral-600">Reading file...</p>
              </>
            ) : isDragActive ? (
              <p className="font-semibold text-primary">Drop the file here ...</p>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                <p className="font-semibold text-neutral-600">
                  Drag & drop a file here, or click to select
                </p>
                <p className="text-sm text-neutral-500">.txt or .pdf files only</p>
              </>
            )}
          </div>

          <Button
            size="lg"
            className="w-full text-lg font-semibold bg-green-500 hover:bg-green-600"
            onClick={handleSummarize}
            disabled={isLoading || isUploading || !inputText.trim()}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Summarize
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}