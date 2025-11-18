import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";

export const ContactSection = () => {
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

            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group"
              onClick={() => window.open("https://calendly.com/ljdstechva/30min", "_blank")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book a 30-Minute Call
            </Button>
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