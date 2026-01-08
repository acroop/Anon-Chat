

export const rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createRoom(ownerSocketId) {
  const roomId = generateRoomCode();

  rooms[roomId] = {
    owner: ownerSocketId,
    users: new Set([ownerSocketId]),
    messages: [],
    files: []
  };

  return roomId;
}

export function joinRoom(roomId, socketId) {
  if (!rooms[roomId]) return false;
  rooms[roomId].users.add(socketId);
  return true;
}

export function removeUser(socketId) {
  for (const roomId in rooms) {
    const room = rooms[roomId];

    if (room.users.has(socketId)) {
      room.users.delete(socketId);

      
      if (room.owner === socketId) {
        delete rooms[roomId];
        return { roomId, destroyed: true };
      }

      return { roomId, destroyed: false };
    }
  }
  return null;
}
