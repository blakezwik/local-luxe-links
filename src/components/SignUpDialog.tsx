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
      const { data, error } = await supabase
        .from('locations')
        .select('state, state_code, city');
      
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
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
            <span className="text-4xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
              HostVibes
            </span>
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