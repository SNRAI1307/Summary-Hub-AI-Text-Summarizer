import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TestimonialSlider } from "@/components/TestimonialSlider";

export default function SignUpPage() {
  return (
    // Use min-h-screen to fill the entire viewport
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Column 1: Clerk Sign Up Component (Black BG) */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-black">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            baseTheme: dark,
            elements: {
              card: "bg-black shadow-none border-0",
              socialButtonsBlockButton: "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white",
              footer: "hidden"
            }
          }}
        />
      </div>

      {/* Column 2: Testimonial Slider (Dark Blue/Neutral BG) */}
      <div className="hidden md:flex flex-col items-center justify-center bg-neutral-900 p-12 text-white">
        <TestimonialSlider />
      </div>

    </div>
  );
}