import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { analyzeImage, findRecipes, getRecipeDetailsWithMissing } from '../services/api';
import './ChatContainer.css';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIngredients, setCurrentIngredients] = useState('');
  const [chatStep, setChatStep] = useState('welcome'); // welcome, ingredients, diet, recipes, details
  const isInitialized = useRef(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Welcome message only once
    if (!isInitialized.current) {
      isInitialized.current = true;
      addBotMessage(
        "Hi! 👋 I'll help you find recipes based on your available ingredients.\n\nYou can:\n• Upload a photo of your ingredients 📷\n• Write a list of ingredients 📝\n\nWhat would you like to choose?"
      );
    }
  }, []);

  const addBotMessage = (text, type = 'text', data = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        messageType: type,
        text,
        data,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text, type = 'text', data = null) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      messageType: type,
      text,
      data,
      timestamp: new Date()
    }]);
  };

  const handleImageUpload = async (file) => {
    addUserMessage('Uploaded ingredient photo', 'image', file);
    
    try {
      setIsTyping(true);
      const ingredients = await analyzeImage(file);
      setCurrentIngredients(ingredients);
      setChatStep('diet');
      
      addBotMessage(
        `Great! I found these ingredients: ${ingredients}\n\nWould you like to apply a diet filter?`
      );
      
      setTimeout(() => {
        addBotMessage('', 'diet-filter');
      }, 1500);
      
    } catch (error) {
      addBotMessage('Sorry, I couldn\'t analyze the image. Try again or enter ingredients as text.');
    }
  };

  const handleTextInput = (text) => {
    addUserMessage(text);
    setCurrentIngredients(text);
    setChatStep('diet');
    
    addBotMessage(
      `Got it! Ingredients: ${text}\n\nWould you like to apply a diet filter?`
    );
    
    setTimeout(() => {
      addBotMessage('', 'diet-filter');
    }, 1500);
  };

  const handleDietSelect = async (diet) => {
    const dietText = diet ? `Selected diet: ${diet}` : 'No dietary restrictions';
    addUserMessage(dietText);
    
    try {
      setIsTyping(true);
      const recipes = await findRecipes(currentIngredients, diet);
      setChatStep('recipes');
      
      if (recipes.length > 0) {
        addBotMessage(
          `Found ${recipes.length} recipes! Here's what you can cook:`
        );
        
        setTimeout(() => {
          addBotMessage('', 'recipes', recipes);
        }, 1000);
      } else {
        addBotMessage('Unfortunately, I couldn\'t find suitable recipes. Try changing ingredients or removing dietary restrictions.');
        setChatStep('welcome');
      }
    } catch (error) {
      addBotMessage('An error occurred while searching for recipes. Please try again.');
      setChatStep('welcome');
    }
  };

  const handleRecipeSelect = async (recipe) => {
    addUserMessage(`Selected recipe: ${recipe.title}`);
    
    try {
      setIsTyping(true);
      const details = await getRecipeDetailsWithMissing(recipe.id, currentIngredients);
      
      addBotMessage('', 'recipe-details', details);
      
      setTimeout(() => {
        addBotMessage(
          'Want to find more recipes? Just write new ingredients or upload another photo!'
        );
        setChatStep('welcome');
      }, 2000);
      
    } catch (error) {
      addBotMessage('Couldn\'t load recipe details. Please try again.');
    }
  };

  const handleNewSearch = () => {
    addUserMessage('Start new search');
    setCurrentIngredients('');
    setChatStep('welcome');
    addBotMessage('Great! Upload a new photo or write ingredients.');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🍳 Recipe Bot</h1>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <Message 
            key={message.id} 
            message={message}
            onDietSelect={handleDietSelect}
            onRecipeSelect={handleRecipeSelect}
            onNewSearch={handleNewSearch}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput 
        onImageUpload={handleImageUpload}
        onTextSubmit={handleTextInput}
        disabled={isTyping || (chatStep !== 'welcome' && chatStep !== 'ingredients')}
        placeholder={
          chatStep === 'welcome' ? 
          'Write ingredients or upload a photo...' : 
          'Choose an option above...'
        }
      />
    </div>
  );
};

export default ChatContainer; 