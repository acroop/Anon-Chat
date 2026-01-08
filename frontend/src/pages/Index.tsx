import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RoomModal } from "@/components/RoomModal";
import { ChatRoom } from "@/components/ChatRoom";
import { Footer } from "@/components/Footer";

type AppState = "home" | "chat";
type ModalMode = "create" | "join" | null;

const Index = () => {
  const [appState, setAppState] = useState<AppState>("home");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const handleCreateRoom = () => setModalMode("create");
  const handleJoinRoom = () => setModalMode("join");
  const handleCloseModal = () => setModalMode(null);

  const handleEnterRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setModalMode(null);
    setAppState("chat");
  };

  const handleLeaveRoom = () => {
    setCurrentRoomId(null);
    setAppState("home");
  };

  if (appState === "chat" && currentRoomId) {
    return <ChatRoom roomId={currentRoomId} onLeave={handleLeaveRoom} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      <Footer />

      {/* Room Modal */}
      {modalMode && (
        <RoomModal
          mode={modalMode}
          isOpen={!!modalMode}
          onClose={handleCloseModal}
          onSubmit={handleEnterRoom}
        />
      )}
    </div>
  );
};

export default Index;
