import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabaseService } from '../services/supabase';
import { ChatMessage } from '../types';
import { MessageCircle, Send, Loader2, AlertCircle, X, RefreshCw, Paperclip, Smile, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  memberName: string;
  memberId: string;
  onClose: () => void;
  onStatusChange: (status: 'active' | 'busy') => void;
}

const CACHE_KEY = (memberId: string) => `chat_${memberId}`;
const MESSAGES_PER_PAGE = 20;

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  memberName,
  memberId,
  onClose,
  onStatusChange
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const errorToastRef = useRef<string | null>(null);

  const showError = useCallback((message: string) => {
    if (errorToastRef.current !== message) {
      errorToastRef.current = message;
      toast.error(message);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, [memberId]);

  const loadChatHistory = async (page: number = 1) => {
    if (!memberId) return;
    
    setIsLoadingHistory(true);
    try {
      // Try to load from cache first
      const cachedMessages = localStorage.getItem(CACHE_KEY(memberId));
      if (cachedMessages && page === 1) {
        const parsedMessages = JSON.parse(cachedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          created_at: new Date(msg.created_at)
        })));
      }

      // Then fetch from Supabase
      const history = await supabaseService.getChatMessages(memberId, page, MESSAGES_PER_PAGE);
      
      if (page === 1) {
        setMessages(history);
        localStorage.setItem(CACHE_KEY(memberId), JSON.stringify(history));
      } else {
        setMessages(prev => [...history, ...prev]);
      }

      setHasMoreMessages(history.length === MESSAGES_PER_PAGE);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      showError('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      await loadChatHistory(currentPage + 1);
      // Scroll to the position where new messages were added
      setTimeout(scrollToTop, 100);
    } catch (error) {
      console.error('Failed to load more messages:', error);
      showError('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(), // Temporary ID for local state
      team_member_id: memberId,
      sender: 'user',
      content: inputMessage.trim(),
      type: 'human',
      timestamp: new Date(),
      created_at: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsGeneratingResponse(true);

    try {
      // Generate AI response using the secure Edge Function
      const aiContent = await supabaseService.generateAIResponse(inputMessage.trim());

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(), // Temporary ID for local state
        team_member_id: memberId,
        sender: 'ai',
        content: aiContent,
        type: 'ai',
        timestamp: new Date(),
        created_at: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update cache
      const updatedMessages = [...messages, newMessage, aiMessage];
      localStorage.setItem(CACHE_KEY(memberId), JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(), // Temporary ID for local state
        team_member_id: memberId,
        sender: 'ai',
        content: 'I apologize, but I encountered an error while processing your message. Please try again.',
        type: 'ai',
        timestamp: new Date(),
        created_at: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleClose = async () => {
    try {
      // Save all messages to Supabase when closing
      const messagesToSave = messages.map(({ id, ...rest }) => rest);
      await supabaseService.saveChatMessages(messagesToSave);
      
      // Clear cache
      localStorage.removeItem(CACHE_KEY(memberId));
      
      onClose();
    } catch (error) {
      console.error('Failed to save messages:', error);
      showError('Failed to save messages');
      // Still close the chat even if saving fails
      onClose();
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!memberId) return;

    if (!subscriptionRef.current) {
      subscriptionRef.current = supabaseService.subscribeToChatMessages(
        memberId,
        (message: ChatMessage) => {
          setMessages(prev => [...prev, message]);
        }
      );
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [memberId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleRetry = async () => {
    setIsLoadingHistory(true);
    try {
      const fetchedMessages = await supabaseService.getChatMessages(memberId);
      setMessages(fetchedMessages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      showError(errorMessage);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (errorToastRef.current) {
    return (
      <div className="fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-xl p-4 text-red-500 animate-fade-in">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{errorToastRef.current}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-xl flex flex-col h-[600px] z-50 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{memberName}</h2>
            <p className="text-xs text-blue-100">Online</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-blue-600 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <MessageCircle className="h-12 w-12 text-gray-400" />
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          <>
            {hasMoreMessages && (
              <div className="flex justify-center">
                <button
                  onClick={loadMoreMessages}
                  disabled={isLoadingMore}
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">Load older messages</span>
                </button>
              </div>
            )}
            <div ref={messagesStartRef} />
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content.replace(/\*\*/g, '')}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isGeneratingResponse && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white rounded-2xl p-3 shadow-sm rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              rows={1}
            />
            <button className="absolute right-2 bottom-2 p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors">
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;