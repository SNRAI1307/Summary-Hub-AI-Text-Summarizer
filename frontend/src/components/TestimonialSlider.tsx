'use client';

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

// Testimonial data
const testimonials = [
  {
    quote: "The process of summarization is pretty fast, and the output content is really a time saver. The founder is also keen to listen to feedback and reply in detail. Besides, the limit is generous. I believe that Summary Hub will be our powerful assistant.",
    author: "Moses Chan",
    source: "facebook"
  },
  {
    quote: "Summary Hub sounds excellent, especially for its audio playback summary and the instant notifications for favorite channels. The summarization process is super-fast, and the voice is all right.",
    author: "HM Shuja",
    source: "facebook"
  },
  {
    quote: "This kind of tool is very handy now that we are facing info overloading more and more in our day-to-day lives.",
    author: "Erantsoa Ratsimbazafy",
    source: "facebook"
  },
  {
    quote: "Interesting, I got some time to play with Summary  Hub and the results were amazing. First, I tried the English videos and then tried videos in other languages. Surprisingly, it worked well in both English and other languages. The audio voice is also good. Continue pushing the boundaries of innovation! I'm really impressed with the work as well.",
    author: "Mohan Niroula",
    source: "facebook"
  },
  {
    quote: "OMG! My jaws just dropped, no exaggerations! I just tried it on one of my YouTube videos. The signup for the free account was a breeze. The app is super slick and clean. Very clean and nicely formatted Summary section on the right of the web app.",
    author: "Anil Agrawal",
    source: "facebook"
  },
  {
    quote: "This is an awesome concept. I hate hour-long podcasts which are 80% fluff. Give me the key ideas and actionable insights!",
    author: "Grant Millar",
    source: "facebook"
  },
  {
    quote: "Great product that summarizes long YouTube videos into short videos.",
    author: "Antony Stocks",
    source: "facebook"
  }
];

export function TestimonialSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="bg-transparent border-0 shadow-none text-white">
                  <CardContent className="flex flex-col justify-center p-6 space-y-6 min-h-[300px]">
                    
                    {/* --- MODIFIED THIS LINE --- */}
                    <blockquote className="text-lg font-medium italic leading-relaxed">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
                        {testimonial.author.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{testimonial.author}</p>
                        <p className="text-sm text-neutral-400">{testimonial.source}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="flex justify-center space-x-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              current === index + 1 ? 'bg-white w-4' : 'bg-neutral-600 hover:bg-neutral-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}