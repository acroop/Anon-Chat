import { useState, useEffect } from "react";
import { Copy, Check, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socket";

interface RoomModalProps {
  mode: "create" | "join";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomId: string, isOwner: boolean) => void;
}

export function RoomModal({
  mode,
  isOpen,
  onClose,
  onSubmit,
}: RoomModalProps) {
  const [roomId, setRoomId] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRoomId("");
    setError("");
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!roomId) return;
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    setError("");

    if (mode === "create") {
      socket.emit("create_room");

      socket.once("room_created", ({ roomId }) => {
        setRoomId(roomId);
        onSubmit(roomId, true); // owner = true
        onClose();
      });

      return;
    }

  
    if (!roomId.trim()) {
      setError("Please enter a Chat ID");
      return;
    }

    socket.emit("join_room", { roomId: roomId.toUpperCase() });

    socket.once("error", (msg: string) => {
      setError(msg);
    });

    onSubmit(roomId.toUpperCase(), false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 p-6 bg-card rounded-2xl border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {mode === "create" ? "Create New Chat" : "Join a Chat"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "A secure chat room will be created for you"
              : "Enter the Chat ID shared with you"}
          </p>
        </div>

        {/* Room ID Input */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="Enter Chat ID"
              disabled={mode === "create"}
              className="h-14 text-center text-xl font-mono tracking-wider pr-12 uppercase"
              maxLength={12}
            />

            {roomId && (
              <button
                onClick={handleCopy}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-accent" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Info */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              {mode === "create" ? (
                <>
                  <span className="text-accent font-medium">🔐 Private:</span>{" "}
                  Only people with this Chat ID can join.
                </>
              ) : (
                <>
                  <span className="text-accent font-medium">💬 Join:</span>{" "}
                  You’ll join everyone in this room.
                </>
              )}
            </p>
          </div>

          {/* Submit */}
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
          >
            {mode === "create" ? "Create Chat" : "Join Chat"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
