import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail } from "lucide-react";

export const ContactDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("ContactDialog: Starting message submission");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          message,
          userId: session.user.id,
        }
      });

      if (error) {
        console.error("ContactDialog: Function invocation error:", error);
        throw error;
      }

      console.log("ContactDialog: Message sent successfully");
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!",
      });
      setIsOpen(false);
      setMessage("");
    } catch (error: any) {
      console.error("ContactDialog: Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-48 py-6 mx-auto flex items-center gap-2 mt-8 bg-[#FFD166] hover:bg-[#FFD166]/90 text-black border-[#FFD166]"
        >
          <Mail className="h-5 w-5" />
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-[#FFD166]/10">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Contact GuestVibes Support
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Textarea
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px] bg-white/50 border-[#FFD166]/50 focus-visible:ring-[#FFD166]"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            className="w-full bg-[#FFD166] text-black hover:bg-[#FFD166]/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};