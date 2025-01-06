import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { PartyPopper } from "lucide-react";

interface SuccessDialogProps {
  showSuccess: boolean;
  onClose: () => void;
}

export function SuccessDialog({ showSuccess, onClose }: SuccessDialogProps) {
  return (
    <AlertDialog open={showSuccess} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex flex-col items-center gap-4">
            <PartyPopper className="h-12 w-12 text-[#FFD166] animate-bounce" />
            <span className="text-2xl">Welcome to GuestVibes!</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your account has been created successfully. Please sign in to access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction 
            className="bg-[#177E89] hover:bg-[#177E89]/90"
            onClick={onClose}
          >
            Continue to Sign In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}