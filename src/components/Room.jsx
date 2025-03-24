import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useRoom } from '../context/RoomContext';
import AIChat from './AIChat';
import CodeEditor from './CodeEditor';

export default function Room() {
  const navigate = useNavigate();
  const { username, roomId } = useRoom();
  const containerRef = useRef(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [error, setError] = useState(null);
  const zegoRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    let mounted = true;

    const init = async () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        setError('Maximum reconnection attempts reached. Please refresh the page.');
        return;
      }

      try {
        if (zegoRef.current) {
          try {
            await zegoRef.current.destroy();
          } catch (err) {
            console.error('Error destroying previous instance:', err);
          }
        }

        const appID = 638559391;
        const serverSecret = '7f276ab94662b500eeaac00f7c24a4ef';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId || 'default-room',
          Date.now().toString(),
          username
        );

        zegoRef.current = ZegoUIKitPrebuilt.create(kitToken);
        
        if (containerRef.current && mounted) {
          await zegoRef.current.joinRoom({
            container: containerRef.current,
            sharedLinks: [{
              name: 'Copy Link',
              url: window.location.href,
            }],
            scenario: {
              mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            turnOnMicrophoneWhenJoining: true,
            turnOnCameraWhenJoining: true,
            showMyCameraToggleButton: true,
            showMyMicrophoneToggleButton: true,
            showAudioVideoSettingsButton: true,
            onJoinRoom: () => {
              if (mounted) {
                setError(null);
                setReconnectAttempts(0);
              }
            },
            onLeaveRoom: () => {
              if (mounted && reconnectAttempts < maxReconnectAttempts) {
                setError('Connection lost. Reconnecting...');
                setReconnectAttempts(prev => prev + 1);
                reconnectTimeoutRef.current = setTimeout(init, 2000);
              }
            },
            onError: (err) => {
              if (mounted && reconnectAttempts < maxReconnectAttempts) {
                console.error('Zego error:', err);
                setError('Connection error. Reconnecting...');
                setReconnectAttempts(prev => prev + 1);
                reconnectTimeoutRef.current = setTimeout(init, 2000);
              }
            }
          });
        }
      } catch (err) {
        if (mounted && reconnectAttempts < maxReconnectAttempts) {
          console.error('Room initialization error:', err);
          setError('Failed to join room. Retrying...');
          setReconnectAttempts(prev => prev + 1);
          reconnectTimeoutRef.current = setTimeout(init, 2000);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (zegoRef.current) {
        try {
          zegoRef.current.destroy();
        } catch (err) {
          console.error('Error destroying Zego instance:', err);
        }
      }
    };
  }, [username, roomId, navigate, reconnectAttempts, maxReconnectAttempts]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          {error && (
            <div className="absolute top-0 left-0 right-0 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 z-50">
              {error}
              {reconnectAttempts >= maxReconnectAttempts && (
                <button
                  onClick={() => window.location.reload()}
                  className="ml-4 underline hover:text-yellow-800"
                >
                  Refresh Page
                </button>
              )}
            </div>
          )}
          <div className={`grid grid-cols-1 ${showAIChat || showCodeEditor ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-4`}>
            <div className={showAIChat || showCodeEditor ? 'lg:col-span-2' : 'lg:col-span-1'}>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div ref={containerRef} className="w-full h-[600px]" />
              </div>
            </div>
            {showAIChat && (
              <div className="lg:col-span-1 h-[600px]">
                <AIChat />
              </div>
            )}
            {showCodeEditor && (
              <div className="lg:col-span-1 h-[600px]">
                <CodeEditor />
              </div>
            )}
          </div>
          <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
            <button
              onClick={() => {
                setShowCodeEditor(!showCodeEditor);
                if (showAIChat) setShowAIChat(false);
              }}
              className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 z-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setShowAIChat(!showAIChat);
                if (showCodeEditor) setShowCodeEditor(false);
              }}
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}