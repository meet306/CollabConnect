import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';

export default function RoomSelection() {
  const navigate = useNavigate();
  const { username, setRoomId } = useRoom();
  const [inputRoomId, setInputRoomId] = useState('');

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (inputRoomId.trim()) {
      setRoomId(inputRoomId);
      navigate(`/room/${inputRoomId}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    setRoomId(newRoomId);
    navigate(`/room/${newRoomId}`);
  };

  if (!username) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Join or Create Room</h1>
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter Room ID"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Join Room
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleCreateRoom}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}