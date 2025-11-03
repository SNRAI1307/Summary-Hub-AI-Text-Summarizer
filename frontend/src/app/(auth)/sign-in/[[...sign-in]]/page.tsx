import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TestimonialSlider } from "../../../../components/TestimonialSlider";

export default function SignInPage() {
  return (
    // This min-h-screen fills the viewport
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Col 1 (Black BG) */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-black">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
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

      {/* Col 2 (Dark Blue BG) */}
      <div className="hidden md:flex flex-col items-center justify-center bg-neutral-900 p-12 text-white">
        <TestimonialSlider />
      </div>

    </div>
  );
}