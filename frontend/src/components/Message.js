import React from 'react';
import DietFilter from './DietFilter';
import RecipeGrid from './RecipeGrid';
import RecipeDetailsView from './RecipeDetailsView';
import './Message.css';

const Message = ({ message, onDietSelect, onRecipeSelect, onNewSearch }) => {
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'diet-filter':
        return (
          <DietFilter onDietSelect={onDietSelect} />
        );
      
      case 'recipes':
        return (
          <RecipeGrid 
            recipes={message.data} 
            onRecipeSelect={onRecipeSelect}
            onNewSearch={onNewSearch}
          />
        );
      
      case 'recipe-details':
        return (
          <RecipeDetailsView 
            recipe={message.data}
            onNewSearch={onNewSearch}
          />
        );
      
      case 'image':
        return (
          <div className="message-image">
            <img 
              src={URL.createObjectURL(message.data)} 
              alt="Uploaded food" 
              style={{ maxWidth: '200px', borderRadius: '12px' }}
            />
          </div>
        );
      
      default:
        return (
          <div className="message-text">
            {message.text.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < message.text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`message ${message.type}`}>
      <div className="message-bubble">
        {renderMessageContent()}
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message; 