import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "./auth/AuthForm";
import { SignUpForm } from "./auth/SignUpForm";

interface SignUpDialogProps {
  children: React.ReactNode;
  mode?: 'signin' | 'signup';
}

export function SignUpDialog({ children, mode = 'signup' }: SignUpDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === 'signin' ? (
          <div className="bg-[#177E89] text-white hover:bg-[#177E89]/90 px-6 shadow-lg cursor-pointer rounded-md h-10 flex items-center">
            Sign In
          </div>
        ) : (
          <div className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 px-6 shadow-lg cursor-pointer rounded-md h-10 flex items-center">
            {children}
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-4xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
              HostVibes
            </span>
          </DialogTitle>
        </DialogHeader>
        {mode === 'signin' ? (
          <AuthForm mode="signin" onSuccess={() => setIsOpen(false)} />
        ) : (
          <SignUpForm onSuccess={() => setIsOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}