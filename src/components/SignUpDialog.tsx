import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "./auth/SignUpForm";
import { SignInForm } from "./auth/SignInForm";

interface Location {
  state: string;
  state_code: string;
  city: string;
}

export function SignUpDialog({ 
  children, 
  showSignIn = false 
}: { 
  children: React.ReactNode;
  showSignIn?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      console.log("SignUpDialog: Fetching locations");
      const { data, error } = await supabase
        .from('locations')
        .select('state, state_code, city')
        .order('state', { ascending: true });
      
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      console.log("SignUpDialog: Locations fetched successfully:", data?.length);
      setLocations(data || []);
    };

    fetchLocations();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <img 
              src="/lovable-uploads/d7ab0479-09b7-4d75-b570-53049aaf23d9.png" 
              alt="GuestVibes Logo" 
              className="h-24 mx-auto"
            />
          </DialogTitle>
        </DialogHeader>
        {showSignIn ? (
          <SignInForm onSuccess={() => setIsOpen(false)} />
        ) : (
          <SignUpForm locations={locations} onSuccess={() => setIsOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}