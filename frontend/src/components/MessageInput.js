import React, { useState, useRef } from 'react';
import './MessageInput.css';

const MessageInput = ({ onImageUpload, onTextSubmit, disabled, placeholder }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !disabled) {
      onTextSubmit(inputText.trim());
      setInputText('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
    e.target.value = '';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <button 
          type="button"
          className="image-upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Upload image"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="text-input"
        />
        
        <button 
          type="submit" 
          className="send-button"
          disabled={disabled || !inputText.trim()}
        >
          ↗️
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 