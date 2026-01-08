import { Shield, Clock, Paperclip, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const features = [
  { icon: Shield, label: "Anonymous", description: "No login required" },
  { icon: Clock, label: "Temporary", description: "Messages disappear" },
  { icon: Paperclip, label: "File Sharing", description: "Share securely" },
];

export function Hero({ onCreateRoom, onJoinRoom }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
            <MessageCircle className="w-8 h-8 text-accent" />
          </div>
          <span className="text-2xl font-bold text-foreground">AnonChat</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
          Private Chat with Anyone
          <span className="block text-accent mt-2">Using a Unique ID</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          No login. No database. Messages disappear when you leave.
          <br className="hidden sm:block" />
          Start a private conversation in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button variant="hero" size="xl" onClick={onCreateRoom}>
            Create New Chat ID
          </Button>
          <Button variant="hero-outline" size="xl" onClick={onJoinRoom}>
            Join Existing Chat
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:bg-card/80 hover:border-accent/30 hover:shadow-lg"
            >
              <div className="p-3 rounded-lg bg-accent/10 mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Placeholder - Non-intrusive banner */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="bg-muted/30 backdrop-blur-sm rounded-lg border border-border/30 p-3 text-center text-xs text-muted-foreground">
          {/* Monetag Ad Placeholder - Insert ad script here */}
          <span className="opacity-50">Advertisement</span>
        </div>
      </div>
    </section>
  );
}
