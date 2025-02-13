import { Routes, Route } from 'react-router-dom';
import { RoomProvider } from './context/RoomContext';
import Login from './components/Login';
import RoomSelection from './components/RoomSelection';
import Room from './components/Room';

function App() {
  return (
    <RoomProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/room" element={<RoomSelection />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </RoomProvider>
  );
}

export default App;