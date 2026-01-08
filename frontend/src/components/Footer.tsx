import { Shield, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        {/* Privacy Notice */}
        <div className="flex items-center justify-center gap-2 mb-8 p-4 rounded-xl bg-muted/50 max-w-xl mx-auto">
          <Shield className="w-5 h-5 text-accent shrink-0" />
          <p className="text-sm text-muted-foreground text-center">
            Chats are temporary. No messages are stored. Your privacy is our priority.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">AnonChat</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AnonChat
          </p>
        </div>
      </div>
    </footer>
  );
}
