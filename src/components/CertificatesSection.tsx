import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, Award } from "lucide-react";
import cert1 from "../assets/cert-1.png"
import cert2 from "../assets/cert-2.png"

// TODO: Replace placeholder certificates with real data (title, provider, links, etc.)
const certificates = [
  {
  id: "cert-1",
  title: "AI Automation with n8n",
  provider: "Technical Virtual Assistants PH",
  issuedDate: "November 25, 2025",
  credentialId: "6925d01b949b7b84ee439a7f",
  categories: ["Automation", "Artificial intelligence", "No-Code & Low-Code"],
  skills: [
    "AI agents vs AI workflows",
    "Setting up and configuring an n8n server",
    "Designing workflows and working with nodes and data",
    "Using popular triggers and actions in n8n",
    "Filtering, branching, looping, and merging data",
    "Connecting to APIs and AI agents from n8n"
  ],
  imageUrl: cert1,
  externalUrl: "https://my-certificates.com/certificates/6925d01b949b7b84ee439a7f"
},
{
  id: "cert-2",
  title: "AI Automation with Zapier",
  provider: "Technical Virtual Assistants PH",
  issuedDate: "November 26, 2025",
  credentialId: "69260ec0949b7b84ee43a835",
  categories: ["Automation", "No-Code & Low-Code", "Artificial Intelligence"],
  skills: [
    "Using the Zapier interface for building automations",
    "Working with Zapier triggers",
    "Transforming data with Formatter by Zapier",
    "Delaying workflows with Delay by Zapier",
    "Filtering workflows with Filter by Zapier",
    "Routing logic with Paths by Zapier",
    "Building modular automations with Sub-Zaps",
    "Creating looping logic in Zapier",
    "Connecting services via Webhooks by Zapier",
    "Using AI by Zapier inside automations"
  ],
  imageUrl: cert2, // update to whatever import name you use, e.g. `import cert2 from "@/assets/cert-2.png"`
  externalUrl: "https://my-certificates.com/certificates/69260ec0949b7b84ee43a835"
}

];

const filterCategories = [
  "All",
  "Automation",
  "Artificial intelligence",
  "No-Code & Low-Code"
];

export const CertificatesSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);

  const filteredCertificates = selectedFilter === "All"
    ? certificates
    : certificates.filter(cert => cert.categories.includes(selectedFilter));

  const handleCardClick = (cert: typeof certificates[0]) => {
    setSelectedCertificate(cert);
  };

  const handleKeyDown = (e: React.KeyboardEvent, cert: typeof certificates[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(cert);
    }
  };

  return (
    <section id="certificates" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            My Certificates
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Proof of continuous learning in automation, AI, and digital tools.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedFilter === category ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedFilter === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setSelectedFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

       {/* Certificate Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredCertificates.length > 0 ? (
    filteredCertificates.map((cert) => (
      <Card
  key={cert.id}
  className="group flex h-full flex-col cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
  onClick={() => handleCardClick(cert)}
  onKeyDown={(e) => handleKeyDown(e, cert)}
  tabIndex={0}
  role="button"
  aria-label={`View certificate: ${cert.title}`}
>
  <CardHeader className="space-y-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Award className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
          {cert.title}
        </h3>
      </div>
    </div>
  </CardHeader>

  {/* flex-1 makes this block take remaining height so Footer aligns */}
  <CardContent className="space-y-3 flex-1">
    <div className="space-y-1 text-sm">
      <p className="text-muted-foreground">
        <span className="font-medium">Platform:</span>{" "}
        {cert.provider && cert.provider.trim()
          ? cert.provider
          : "Not specified"}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium">Issued:</span>{" "}
        {cert.issuedDate && cert.issuedDate.trim()
          ? cert.issuedDate
          : "Not specified"}
      </p>
      <p className="text-muted-foreground text-xs truncate">
        <span className="font-medium">ID:</span>{" "}
        {cert.credentialId && cert.credentialId.trim()
          ? cert.credentialId
          : "Not specified"}
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      {cert.categories.map((category) => (
        <Badge key={category} variant="secondary" className="text-xs">
          {category}
        </Badge>
      ))}
    </div>
  </CardContent>

  <CardFooter className="mt-auto">
    <Button
      variant="outline"
      size="sm"
      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        handleCardClick(cert);
      }}
    >
      View Credential
    </Button>
  </CardFooter>
</Card>

    ))
  ) : (
    // 🔸 "Coming Soon" placeholders when there are no certificates
    [...Array(3)].map((_, index) => (
      <Card
        key={`cert-placeholder-${index}`}
        className="flex flex-col items-center justify-center text-center border-dashed border-muted-foreground/30 bg-muted/5 py-10"
      >
        <CardHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Coming Soon</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-xs">
            New certificates and credentials will be added here as I complete
            more trainings and specializations.
          </p>
        </CardContent>
      </Card>
    ))
  )}
</div>

      </div>

      {/* Certificate Details Modal */}
      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCertificate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2 text-primary">
  {selectedCertificate.title}
</DialogTitle>

                <DialogDescription className="space-y-2 text-base">
                  <p>
                    <span className="font-medium text-foreground">Platform:</span>{" "}
                    {selectedCertificate.provider}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Issued:</span>{" "}
                    {selectedCertificate.issuedDate}
                  </p>
                  {selectedCertificate.credentialId && (
                    <p className="text-sm">
                      <span className="font-medium text-foreground">Credential ID:</span>{" "}
                      {selectedCertificate.credentialId}
                    </p>
                  )}
                </DialogDescription>
              </DialogHeader>

              {/* TODO: Add certificate image or PDF thumbnail here */}
              <div className="my-6">
  {selectedCertificate.imageUrl ? (
    <img
      src={selectedCertificate.imageUrl}
      alt={selectedCertificate.title}
      className="w-full h-auto rounded-lg border border-border object-contain"
    />
  ) : (
    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
      <div className="text-center text-muted-foreground">
        <Award className="w-16 h-16 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Certificate Preview</p>
        <p className="text-xs mt-1">No image available for this certificate.</p>
      </div>
    </div>
  )}
</div>


              {/* Skills Covered */}
              {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Skills Covered</h4>
                  <ul className="space-y-2">
                    {selectedCertificate.skills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Categories */}
              <div className="flex flex-wrap gap-2 pt-4">
                {selectedCertificate.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCertificate(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedCertificate.externalUrl && (
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => window.open(selectedCertificate.externalUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Credential Link
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};