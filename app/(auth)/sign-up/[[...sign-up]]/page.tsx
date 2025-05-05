import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>
      
      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-float-delay" />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-md p-8 mx-4">
        {/* Logo */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
          <Image
            src="/logo.svg"
            alt="MedSupply Connect Logo"
            width={80}
            height={80}
            className="drop-shadow-xl"
          />
        </div>

        {/* Sign Up Form Container */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 p-6 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">أنشئ حساب جديد</h1>
            <p className="text-white/80">انضم إلينا اليوم واستمتع بخدماتنا المميزة</p>
          </div>

          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white text-2xl font-tajawal",
                headerSubtitle: "text-white/80 font-tajawal",
                formButtonPrimary: 
                  "bg-white text-indigo-600 hover:bg-opacity-90 transition-all duration-200 font-tajawal shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                formFieldInput: 
                  "bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 transition-all duration-200 font-tajawal",
                formFieldLabel: "text-white font-tajawal",
                footerActionLink: 
                  "text-white hover:text-white/80 transition-all duration-200 font-tajawal underline decoration-white/30 hover:decoration-white/60",
                dividerLine: "border-white/20",
                dividerText: "text-white/60 font-tajawal",
                socialButtonsBlockButton: 
                  "bg-white/20 hover:bg-white/30 transition-all duration-200 border-white/30",
                socialButtonsBlockButtonText: "text-white font-tajawal",
                formFieldWarningText: "text-yellow-300 font-tajawal",
                formFieldErrorText: "text-red-300 font-tajawal",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
