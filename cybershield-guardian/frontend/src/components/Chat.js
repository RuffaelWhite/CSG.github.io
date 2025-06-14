import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === '') return;
    socket.emit('sendMessage', { senderId: userId, message: input });
    setInput('');
  };

  return (
    <div className="chat-container border rounded p-4 flex flex-col h-96">
      <div className="messages flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`message mb-2 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-blue-200 rounded px-3 py-1">{msg.message}</span>
            <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area flex">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
