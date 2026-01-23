import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type BookingDialogProps = {
  trigger: ReactNode;
};

export const BookingDialog = ({ trigger }: BookingDialogProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHighlightingClose, setIsHighlightingClose] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isModalOpen) {
      setHasInteracted(false);
      setIsHighlightingClose(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleBlur = () => {
      if (document.activeElement && document.activeElement.tagName === "IFRAME") {
        setHasInteracted(true);
      }
    };

    const handleMessage = (e: MessageEvent) => {
      let dataString = "";
      try {
        dataString = typeof e.data === "string" ? e.data : JSON.stringify(e.data);
      } catch (err) {
        return;
      }

      if (dataString && dataString.includes("date_and_time_selected")) {
        setHasInteracted(true);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("message", handleMessage);
    };
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-3xl w-[95vw] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background [&>button:last-child]:hidden"
        onPointerDownOutside={(e) => {
          if (hasInteracted) {
            e.preventDefault();
            setIsHighlightingClose(true);
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
                isHighlightingClose &&
                  "opacity-100 bg-destructive text-destructive-foreground ring-4 ring-destructive scale-150 shadow-xl z-50",
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
  );
};
