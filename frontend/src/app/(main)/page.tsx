import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Summarizer from "@/components/Summarizer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, Briefcase, Megaphone, Brain, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image"; 

// --- SECTION COMPONENTS (Wrapped in Cards) ---

const HowItWorksSection = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <Card className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 text-white">
        <CardContent className="pt-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How to get started</h2>
          <p className="text-lg text-neutral-300 mb-12 max-w-2xl mx-auto">
            With Summary Hub&apos;s intuitive interface, getting started is easy. Enjoy time-saving summaries in just 3 easy steps!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

            <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl bg-neutral-800 border-neutral-700 text-white">
              <CardHeader className="pb-4">
                <div className="relative h-48 w-full rounded-md overflow-hidden border border-neutral-700 bg-neutral-700">
                   <Image
                     src="/1.png"
                     alt="Sign Up form example"
                     layout="fill"
                     objectFit="contain"
                     className="p-4"
                    />
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="text-4xl font-bold text-neutral-600">1</div>
                <div className="flex-1 border-t border-neutral-700"></div>
              </CardContent>
              <CardContent>
                <CardTitle className="text-2xl font-semibold text-white mb-2">Sign Up</CardTitle>
                <p className="text-neutral-300">
                  Sign up with your email in seconds – no complicated setup required.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/sign-up">
                  <span className="text-primary font-semibold flex items-center cursor-pointer group">
                    Let&apos;s Do This
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl bg-neutral-800 border-neutral-700 text-white">
              <CardHeader className="pb-4">
                <div className="relative h-48 w-full rounded-md overflow-hidden border border-neutral-700 bg-neutral-700">
                   <Image
                     src="/2.png"
                     alt="Summarizer tools interface"
                     layout="fill"
                     objectFit="contain"
                     className="p-4"
                    />
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="text-4xl font-bold text-neutral-600">2</div>
                <div className="flex-1 border-t border-neutral-700"></div>
              </CardContent>
              <CardContent>
                <CardTitle className="text-2xl font-semibold text-white mb-2">Choose Your Content</CardTitle>
                <p className="text-neutral-300">
                  Simply paste the content in the dashboard or upload your files.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/sign-up">
                  <span className="text-primary font-semibold flex items-center cursor-pointer group">
                    Let&apos;s Do This
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl bg-neutral-800 border-neutral-700 text-white">
              <CardHeader className="pb-4">
                <div className="relative h-48 w-full rounded-md overflow-hidden border border-neutral-700 bg-neutral-700">
                   <Image
                     src="/3.png"
                     alt="Instant summary example"
                     layout="fill"
                     objectFit="contain"
                     className="p-4"
                    />
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="text-4xl font-bold text-neutral-600">3</div>
                <div className="flex-1 border-t border-neutral-700"></div>
              </CardContent>
              <CardContent>
                <CardTitle className="text-2xl font-semibold text-white mb-2">Summarize</CardTitle>
                <p className="text-neutral-300">
                  Hit summarize, and start enjoying insights with other features.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/sign-up">
                  <span className="text-primary font-semibold flex items-center cursor-pointer group">
                    Let&apos;s Do This
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </CardFooter>
            </Card>

          </div>
        </CardContent>
      </Card>
    </div>
  </section>
);

const WhoBenefitsSection = () => (
   <section className="py-16 md:py-24">
     <div className="container mx-auto px-4">
       <Card className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 text-white">
         <CardContent className="pt-12 text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Can Benefit From an AI Text Summarizer?</h2>
           <p className="text-lg text-neutral-400 mb-12 max-w-2xl mx-auto">Anyone who needs to quickly grasp the essence of lengthy documents, articles, or reports.</p>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
             
             <Card className="bg-neutral-800 border-neutral-700 text-left flex flex-col h-full">
               <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-300 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-white text-lg">Students & Academics</CardTitle>
               </CardHeader>
               <CardContent className="flex-grow">
                 <p className="text-neutral-400 text-sm">Quickly summarize research papers, articles, and lecture notes to save time and enhance learning.</p>
               </CardContent>
             </Card>
             
             <Card className="bg-neutral-800 border-neutral-700 text-left flex flex-col h-full">
                <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-300 rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-white text-lg">Professionals</CardTitle>
               </CardHeader>
               <CardContent className="flex-grow">
                 <p className="text-neutral-400 text-sm">Extract actionable insights from lengthy reports, emails, and documents to stay productive.</p>
               </CardContent>
             </Card>
             
             <Card className="bg-neutral-800 border-neutral-700 text-left flex flex-col h-full">
                <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <div className="w-12 h-12 bg-green-500/20 text-green-300 rounded-lg flex items-center justify-center shrink-0">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-white text-lg">Content Marketers</CardTitle>
               </CardHeader>
               <CardContent className="flex-grow">
                 <p className="text-neutral-400 text-sm">Turn long-form text content into concise summaries for repurposing into blogs, scripts, or social media posts.</p>
               </CardContent>
             </Card>
             
             <Card className="bg-neutral-800 border-neutral-700 text-left flex flex-col h-full">
                <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <div className="w-12 h-12 bg-sky-500/20 text-sky-300 rounded-lg flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-white text-lg">Academic Research</CardTitle>
               </CardHeader>
               <CardContent className="flex-grow">
                 <p className="text-neutral-400 text-sm">Researchers often deal with vast amounts of journals. An AI summarizer can quickly extract key findings.</p>
               </CardContent>
             </Card>

           </div>
         </CardContent>
       </Card>
     </div>
   </section>
);

const FeaturesSection = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <Card className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 text-white">
        <CardContent className="pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold mb-2 block">Features</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Summarize Any Text Instantly With High Accuracy</h2>
              <p className="text-lg text-neutral-300 mb-6">Upload your own text files or provide text to get instant insights with high accuracy. Whether for research, exam prep, or just daily reading, our tool can handle it all.</p>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Save Time</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Boost Productivity</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Get Key Insights Fast</li>
              </ul>
            </div>
            <div className="rounded-lg shadow-lg overflow-hidden border border-neutral-700">
               <Image
                 src="/feature.png"
                 alt="AI Summarizer in use in a library"
                 width={720}
                 height={560}
                 className="w-full h-auto object-cover"
               />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
);

const FaqSection = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 max-w-3xl">
      <Card className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 text-white">
        <CardContent className="pt-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">FAQs About AI Text Summarizer</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-neutral-700">
              <AccordionTrigger className="text-white hover:no-underline">Is there an AI that summarizes text?</AccordionTrigger>
              <AccordionContent className="text-neutral-300">
                Yes! Summary Hub uses advanced AI models to read, understand, and condense text into short, coherent summaries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-neutral-700">
              <AccordionTrigger className="text-white hover:no-underline">What is the best AI text summarizer free?</AccordionTrigger>
              <AccordionContent className="text-neutral-300">
                Summary Hub offers a generous free tier that allows you to summarize text to get started right away, with advanced features available for professional users.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-neutral-700">
              <AccordionTrigger className="text-white hover:no-underline">Can I copy or download the AI text summaries?</AccordionTrigger>
              <AccordionContent className="text-neutral-300">
                Yes! Our summarizer tool provides a &quot;Copy&quot; button for all summaries. Logged-in users can also see their summary history in their dashboard.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  </section>
);

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  return (
    <div>
      {/* FIX 1: Grid changed to lg:grid-cols-2 for 50/50 split
        FIX 2: Padding changed to pt-24 pb-16
      */}
      <section className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-16 px-4">
        
        {/* FIX 3: Text column is now lg:col-span-1 */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left lg:col-span-1">
          {/* FIX 4: H1 text is split with a span */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 leading-tight">
            AI Text Summarizer
            <span className="block">You Can Rely On</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-xl">
            Simplify your content consumption with fast, accurate summaries of any text material. Save time effortlessly.
          </p>
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg py-6 px-8 bg-brand-cta-green text-gray-900 font-bold hover:bg-brand-cta-green-dark">
                Get Started
              </Button>
            </Link>
            
          </SignedOut>
          <SignedIn>
              <Button size="lg" className="text-lg py-6 px-8 bg-brand-cta-green text-gray-900 font-bold hover:bg-brand-cta-green-dark" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
          </SignedIn>
        </div>

        {/* FIX 5: Image column is now lg:col-span-1 */}
        <div className="w-full lg:col-span-1 flex justify-center lg:justify-end">
          {/* FIX 6: Image is framed and set to object-cover for a taller look */}
          <div className="w-full max-w-xl rounded-lg overflow-hidden border border-neutral-700 shadow-xl aspect-[4/3]">
            <Image
              src="/hero-img N.png"
              alt="AI Summarizer Interface"
              width={720}
              height={540} // 4:3 aspect ratio
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FIX 7: Removed negative margin, added padding-top
      */}
      <section id="summarizer" className="container mx-auto px-4 py-16 md:py-24">
         <Summarizer />
      </section>

      {/* --- Other sections remain wrapped --- */}
      <FeaturesSection />
      
      <SignedOut>
        <HowItWorksSection />
      </SignedOut>
      
      <WhoBenefitsSection />
      <FaqSection />
    </div>
  );
}