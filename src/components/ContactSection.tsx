import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const ContactSection = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHighlightingClose, setIsHighlightingClose] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isModalOpen) {
      setHasInteracted(false);
      setIsHighlightingClose(false);
    }
  }, [isModalOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Track interactions
  useEffect(() => {
    if (!isModalOpen) return;

    // 1. Track clicks inside iframe via window blur
    const handleBlur = () => {
      // If focus moves to the iframe, user clicked inside it
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        setHasInteracted(true);
      }
    };

    // 2. Track Calendly messages (extra safety)
    const handleMessage = (e: MessageEvent) => {
      let dataString = "";
      try {
        dataString = typeof e.data === 'string' ? e.data : JSON.stringify(e.data);
      } catch (err) {
        // Ignore parsing errors for non-serializable messages
      }

      if (dataString && dataString.includes('date_and_time_selected')) {
        setHasInteracted(true);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('message', handleMessage);
    };
  }, [isModalOpen]);
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-6 mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Let's Talk About Your Automation
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to save time and streamline your workflows? Book a call to discuss how automation can transform your business operations.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-xl p-8 sm:p-12 space-y-8 animate-scale-in">
          {/* Calendar Booking */}
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Schedule Your Consultation</h3>
              <p className="text-muted-foreground">
                Pick a time that works for you, and we'll discuss your automation needs.
              </p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a 30-Minute Call
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-3xl w-[95vw] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background [&>button:last-child]:hidden"
                onPointerDownOutside={(e) => {
                  if (hasInteracted) {
                    e.preventDefault();
                    setIsHighlightingClose(true);
                    // Clear any existing timeout
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => setIsHighlightingClose(false), 800);
                  }
                }}
              >
                <DialogHeader className="p-4 bg-muted/20 border-b shrink-0 flex flex-row items-center justify-between">
                  <DialogTitle>Schedule a Call</DialogTitle>
                  <DialogClose asChild>
                    <button
                      className={cn(
                        "rounded-sm opacity-70 ring-offset-background transition-all duration-300 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        isHighlightingClose && "opacity-100 bg-destructive text-destructive-foreground ring-4 ring-destructive scale-150 shadow-xl z-50",
                        !isHighlightingClose && "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close</span>
                    </button>
                  </DialogClose>
                </DialogHeader>
                <div className="flex-1 w-full h-full relative">
                  <iframe
                    src="https://calendly.com/ljdstechva/30min"
                    className="w-full h-full absolute inset-0 border-0"
                    title="Schedule a Call"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email Contact */}
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold">Prefer Email?</h4>
            <a
              href="mailto:ljdstechva@gmail.com"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors group"
            >
              <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-medium">ljdstechva@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Based in the Philippines • Serving clients worldwide
        </p>
      </div>
    </section>
  );
};