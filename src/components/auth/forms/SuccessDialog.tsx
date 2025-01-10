import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { PartyPopper } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SuccessDialogProps {
  showSuccess: boolean;
  onClose: () => void;
}

export function SuccessDialog({ showSuccess, onClose }: SuccessDialogProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccess) {
      console.log("SuccessDialog: Showing success toast");
      toast({
        title: "Welcome to GuestVibes! 🎉",
        description: "Your account has been created successfully.",
        duration: 5000,
      });
    }
  }, [showSuccess]);

  const handleContinue = () => {
    console.log("SuccessDialog: Navigating to dashboard");
    onClose();
    navigate('/dashboard');
  };

  return (
    <AlertDialog open={showSuccess} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex flex-col items-center gap-4">
            <PartyPopper className="h-12 w-12 text-[#FFD166] animate-bounce" />
            <span className="text-2xl">Welcome to GuestVibes!</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-2">
            <p>Your account has been created successfully! 🎉</p>
            <p>Click below to access your Host Dashboard and start exploring GuestVibes.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction 
            className="bg-[#177E89] hover:bg-[#177E89]/90 px-8"
            onClick={handleContinue}
          >
            Go to Dashboard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}