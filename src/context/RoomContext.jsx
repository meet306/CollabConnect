import { createContext, useContext, useState } from 'react';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <RoomContext.Provider
      value={{
        roomId,
        setRoomId,
        username,
        setUsername,
        isMuted,
        setIsMuted,
        isVideoOff,
        setIsVideoOff,
        messages,
        addMessage,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}