// ChatBot.jsx - Floating chat bot assistant for finance questions
// Sends user queries to backend and displays responses in a chat UI

import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaArrowRight, FaTimesCircle } from 'react-icons/fa';
import './ChatBot.css';
import axios from '../utils/axios';

const ChatBot = ({ summary }) => {
  // State for chat open/close, messages, input, and loading
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me anything about your finances.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const inputRef = useRef();

  // Show welcome message when component mounts (on every login)
  useEffect(() => {
    console.log('ChatBot component mounted - showing welcome message');
    setShowWelcome(true);
    
    // Set a timer to auto-hide the welcome message after 10 seconds
    const timer = setTimeout(() => {
      console.log('Auto-hiding welcome message after timeout');
      setShowWelcome(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Debug log when showWelcome changes
  useEffect(() => {
    console.log('showWelcome state changed to:', showWelcome);
  }, [showWelcome]);

  // Handle sending a message to the backend
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      // Send user query and summary to Node backend API
      const res = await axios.post('/chat', {
        query: input,
        summary,
      });
      setMessages(msgs => [...msgs, { from: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Sorry, I could not get a response.' }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Welcome message for first-time users */}
      {showWelcome && !open && (
        <div className="chatbot-welcome">
          <div className="chatbot-welcome-content">
            <span>Need help? Try our AI assistant! </span>
            <button 
              className="chatbot-welcome-button" 
              onClick={() => setOpen(true)}
            >
              Chat Now <FaArrowRight style={{ marginLeft: '5px' }} />
            </button>
            <button 
              className="chatbot-welcome-close"
              onClick={() => setShowWelcome(false)}
              aria-label="Close welcome message"
            >
              <FaTimesCircle />
            </button>
          </div>
        </div>
      )}
      
      {/* Floating action button to open/close chat */}
      <button 
        className="chatbot-fab" 
        onClick={() => {
          setOpen(o => !o);
          setShowWelcome(false);
        }} 
        aria-label="Open chat"
      >
        {open ? <FaTimes size={22} /> : <FaComments size={28} />}
      </button>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">Money Map Assistant</div>
          {/* Chat messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg-${msg.from}`}>{msg.text}</div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg-bot" style={{opacity:0.7}}>
                <span className="chatbot-typing">Thinking...</span>
              </div>
            )}
            <div ref={inputRef} />
          </div>
          {/* Input form for user message */}
          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
