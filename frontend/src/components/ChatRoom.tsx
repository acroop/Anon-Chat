import { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  LogOut,
  Send,
  Paperclip,
  X,
  File,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socket";

interface Message {
  id: string;
  content: string;
  sender: string;
  isOwn: boolean;
  timestamp: number;
  file?: {
    name: string;
    type: string;
    data: string;
  };
}

interface ChatRoomProps {
  roomId: string;
  onLeave: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ChatRoom({ roomId, onLeave }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- SOCKET LISTENERS ---------------- */
  useEffect(() => {
    if (!socket.connected) return;

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: msg.text,
          sender: msg.sender,
          isOwn: msg.sender === socket.id,
          timestamp: msg.time,
        },
      ]);
    });

    socket.on("receive_file", (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "",
          sender: payload.sender,
          isOwn: payload.sender === socket.id,
          timestamp: Date.now(),
          file: {
            name: payload.name,
            type: payload.type,
            data: payload.data,
          },
        },
      ]);
    });

    socket.on("room_closed", () => {
      alert("Room closed by owner");
      onLeave();
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_file");
      socket.off("room_closed");
    };
  }, [roomId, onLeave]);

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SEND ---------------- */
  const handleSend = () => {
    if (!inputValue.trim() && !selectedFile) return;

    // TEXT MESSAGE
    if (inputValue.trim()) {
      socket.emit("send_message", {
        roomId,
        message: {
          sender: socket.id,
          text: inputValue,
          time: Date.now(),
        },
      });
    }

    // FILE MESSAGE (UNIVERSAL)
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("File must be under 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("send_file", {
          roomId,
          file: {
            sender: socket.id,
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            data: reader.result, // base64
          },
        });
      };
      reader.readAsDataURL(selectedFile);
    }

    setInputValue("");
    setSelectedFile(null);
  };

  /* ---------------- FILE SELECT ---------------- */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File must be under 5MB");
      return;
    }

    setSelectedFile(file);
  };

  /* ---------------- UI HELPERS ---------------- */
  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderFile = (file: Message["file"]) => {
    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={file.data}
          alt={file.name}
          className="max-w-full rounded-lg max-h-60"
        />
      );
    }

    return (
      <a
        href={file.data}
        download={file.name}
        className="flex items-center gap-2 underline"
      >
        <File className="w-4 h-4" />
        {file.name}
      </a>
    );
  };

  /* ---------------- UI ---------------- */
  return (
     <div className="flex h-screen bg-background overflow-hidden">
    {/* LEFT AD */}
    <div className="hidden lg:flex w-40 xl:w-52 shrink-0 items-center justify-center bg-muted/20 border-r border-border">
      <div className="h-[600px] w-full flex items-center justify-center border border-dashed border-border/50 rounded-lg m-2">
        <span className="opacity-50 text-xs">Left Ad</span>
      </div>
    </div>

    {/* MAIN CHAT AREA */}
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-card border-b">
        <button
          onClick={handleCopyRoomId}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted"
        >
          <span className="font-mono">{roomId}</span>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>

        <Button variant="ghost" onClick={onLeave}>
          <LogOut className="w-4 h-4 mr-2" /> Leave
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] ${
                m.isOwn ? "bg-accent text-white" : "bg-muted"
              }`}
            >
              {renderFile(m.file)}
              {m.content && <p>{m.content}</p>}
              <div className="text-xs opacity-60 mt-1">
                {formatTime(m.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File preview */}
      {selectedFile && (
        <div className="p-2 bg-muted flex justify-between">
          <span className="truncate">{selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-card border-t flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />

        <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
          <Paperclip />
        </Button>

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button onClick={handleSend}>
          <Send />
        </Button>
      </div>

      {/* BOTTOM AD (STICKY) */}
      <div className="sticky bottom-0 w-full bg-muted/30 border-t border-border px-4 py-2">
        <div className="max-w-4xl mx-auto h-[90px] flex items-center justify-center border border-dashed border-border/50 rounded-lg">
          <span className="opacity-50 text-xs">Bottom Ad</span>
        </div>
      </div>
    </div>

    {/* RIGHT AD */}
    <div className="hidden lg:flex w-40 xl:w-52 shrink-0 items-center justify-center bg-muted/20 border-l border-border">
      <div className="h-[600px] w-full flex items-center justify-center border border-dashed border-border/50 rounded-lg m-2">
        <span className="opacity-50 text-xs">Right Ad</span>
      </div>
    </div>
  </div>
  );
}
