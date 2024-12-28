import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignUpDialogProps {
  children: React.ReactNode;
}

export const SignUpDialog = ({ children }: SignUpDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>
            Join thousands of hosts who are already earning more through local partnerships.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-center text-muted-foreground">
            Please connect to Supabase to enable authentication.
          </p>
          <Button className="w-full" disabled>
            Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};