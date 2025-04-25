import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import ReactMarkdown from 'react-markdown';
import { HelpCircle, BarChart2, Paperclip, Link as LinkIcon, Image as ImageIcon, X, RefreshCw, Loader, MessageSquare } from 'lucide-react';

type MessageType = {
  type: "user" | "bot" | "error";
  content: string;
  image?: {
    url: string;
    caption?: string;
  };
};

interface AttachedFile {
  file: File;
  id: string;
}

// Define props interface
interface ChatComponentProps {
  assistantName?: string; // Make it optional with a default
}

// API Configuration
const API_BASE_URL = "https://api.next-agi.com/v1"; 

const apiKeys = {
  HRMS: 'app-cEBy9PIjQ7AqhnuJiDDUOzZA',
  Hospitality: 'app-vGvMMAK3o0rxeAHOWaj96RCG',
  default: 'app-ruGmYX438Wm4TJR03TueyGmx' // Fallback/Insurance key
};

// Helper function to get the correct API key
const getApiKey = (assistantName: string): string => {
  if (assistantName.includes('HRMS')) {
    return apiKeys.HRMS;
  }
  if (assistantName.includes('Hospitality')) {
    return apiKeys.Hospitality;
  }
  // Add more checks here for other assistant names if needed
  return apiKeys.default; 
};

// Speech recognition setup
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const ChatComponent: React.FC<ChatComponentProps> = ({ assistantName = "Xpectrum Assistant" }) => {
  const [query, setQuery] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: "bot",
      content: `Welcome to ${assistantName}! How can I help you today?`
    }
  ]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "45px"; 
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [query]);

  // Auto-open chat on mount
  useEffect(() => {
    setIsOpen(true);
  }, []); // Empty dependency array means this runs only once on mount

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Modify the useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const chatButton = document.querySelector('.chat-button');
      
      // Don't close if clicking the chat button
      if (chatButton?.contains(target)) {
        return;
      }

      // Close if clicking outside and chat is open
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(target)) {
        setIsOpen(false);
      }
      
      // Close attachment options if clicking outside
      if (showAttachmentOptions && !target.closest('.attachment-area') && !target.closest('.link-input-container')) {
        setShowAttachmentOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showAttachmentOptions]);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessages(prev => [...prev, { 
          type: "error", 
          content: "File is too large. Maximum size is 10MB." 
        }]);
        return;
      }
      
      setAttachedFiles(prev => [...prev, { file, id: Math.random().toString(36).substr(2, 9) }]);
      setShowAttachmentOptions(false);
      console.log("File attached:", file.name);
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Trigger file input click
  const handleAttachMediaClick = () => {
    fileInputRef.current?.click();
  };

  // Handle link submission
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkValue.trim()) {
      // Add link to query
      setQuery(prev => prev + (prev ? " " : "") + linkValue);
      
      // Close link input and reset value
      setShowLinkInput(false);
      setLinkValue("");
      setShowAttachmentOptions(false);
    }
  };

  // Handle clicking outside link input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (showLinkInput && linkInputRef.current && !linkInputRef.current.contains(target) && 
          !target.closest('.link-input-container')) {
        setShowLinkInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLinkInput]);

  // Focus link input when it appears
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  // Initialize speech recognition
  useEffect(() => {
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(prev => prev + transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch (error) {
        console.error("Error initializing speech recognition:", error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const sendMessage = async () => {
    if ((!query.trim() && attachedFiles.length === 0) || isLoading) return;

    setSearchQuery(query || "Analyzing attachments...");

    let filePayload = [];

    if (attachedFiles.length > 0) {
      try {
        setIsUploading(true);
        
        // Process all files
        for (const { file } of attachedFiles) {
          const fileData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = () => {
              try {
                const base64Content = reader.result.toString().split(',')[1];
                resolve({
                  name: file.name,
                  content: base64Content,
                  type: file.type
                });
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = (error) => reject(error);
            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(progress);
              }
            };
            
            reader.readAsDataURL(file);
          });

          filePayload.push(fileData);
        }

        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (error) {
        console.error("File attachment error:", error);
        setMessages(prev => [...prev, { type: "error", content: "Failed to attach files. Please try again." }]);
        setAttachedFiles([]);
        setIsUploading(false);
        setUploadProgress(0);
        setIsLoading(false);
        return;
      }
    }

    // Structure the payload
    const payload = {
      inputs: {},
      query: query,
      response_mode: "streaming",
      conversation_id: conversationId,
      user: "abc-123",
      files: filePayload
    };

    console.log("Sending payload:", JSON.stringify(payload));

    setIsLoading(true);
    
    // Add user message with file info
    let userMessageContent = query;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(f => f.file.name).join(", ");
      userMessageContent += `\n[Attached: ${fileNames}]`;
    }
    setMessages(prev => [...prev, { type: "user", content: userMessageContent }]);
    setQuery("");
    setAttachedFiles([]);

    try {
      setTimeout(() => {
        setSearchQuery(null);
        setIsGenerating(true);
      }, 1000);

      const apiKey = getApiKey(assistantName); // Get the correct API key

      const response = await fetch(`${API_BASE_URL}/chat-messages`, { // Use the constant base URL
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`, // Use the dynamically selected API key
          "Content-Type": "application/json",
          Accept: "text/event-stream"
        },
        body: JSON.stringify(payload),
        duplex: "half"
      } as RequestInit);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // Add empty bot message to start
      let botMessageIndex = -1;
      setMessages((prev) => {
        botMessageIndex = prev.length;
        return [...prev, { type: "bot", content: "" }];
      });

      if (reader) {
        setIsGenerating(false); // Hide generating indicator when we start receiving content
        let fullAnswer = "";
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          text.split("\n").forEach((line) => {
            if (line.startsWith("data: ")) {
              try {
                const eventData = JSON.parse(line.slice(6));
                if (eventData.conversation_id) {
                  setConversationId(eventData.conversation_id);
                }
                if (eventData.answer) {
                  fullAnswer += eventData.answer;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    if (botMessageIndex >= 0 && botMessageIndex < newMessages.length) {
                      newMessages[botMessageIndex] = { 
                        type: "bot", 
                        content: fullAnswer 
                      };
                    }
                    return newMessages;
                  });
                }
              } catch (error) {
                console.error("Error parsing SSE event:", error);
              }
            }
          });
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { type: "error", content: error.message || "Failed to connect to the chat service." }
      ]);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setSearchQuery(null);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match this with animation duration
  };

  const handleReset = () => {
    // Reset messages to initial state
    setMessages([
      {
        type: "bot" as const,
        content: `Welcome to ${assistantName}! How can I help you today?`
      }
    ]);
    // Clear the input field
    setQuery("");
    // Reset conversation ID
    setConversationId("");
    // Close the dropdown
    setShowAttachmentOptions(false);
    // Reset status indicators
    setSearchQuery(null);
    setIsGenerating(false);
  };

  // Handle textarea key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid newline
      if (!isLoading && (query.trim() || attachedFiles.length > 0)) {
        sendMessage();
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
      {/* Chat Button - Updated icon and visibility */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        className={`bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full p-4 sm:p-5 transition-all duration-300 flex items-center justify-center chat-button shadow-xl z-[100] fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 relative border-2 border-white/50 animate-pulse-subtle ${isLoading ? 'glowing-blob' : ''} ${isOpen ? 'opacity-50 hover:opacity-100' : ''}`}
        style={{ animationDuration: '3s' }}
      >
        <img
          src="/xpectrumLogo.png"
          alt="Xpectrum Logo"
          className="h-7 w-7 sm:h-8 sm:w-8"
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`absolute bottom-32 right-0 rounded-3xl 
            w-[90vw] max-w-[500px] sm:w-[400px] md:w-[450px] lg:w-[500px]
            h-[65vh] max-h-[600px] sm:h-[500px] md:h-[550px] lg:h-[600px]
            flex flex-col overflow-hidden shadow-xl
            ${isClosing 
              ? 'animate-bubbleClose' 
              : 'animate-bubbleOpen'
            }`}
          style={{
            animation: isClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out',
            background: "#E5DEFF"
          }}
        >
          {/* Header - updated styling */}
          <div className="p-4 rounded-t-3xl flex justify-between items-center bg-white border-b border-gray-200">
            {/* Left side with logo, name, and blob */}
            <div className="flex items-center">
              <img src="/xpectrumLogo.png" alt="Xpectrum Logo" className="h-6 mr-2" />
              <span className="font-semibold text-gray-800 mr-2">{assistantName}</span>
              <span className={`siri-blob ${isLoading ? 'is-loading' : ''}`}></span>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center space-x-1">
              <button className="text-gray-500 hover:text-xpectrum-purple p-1 rounded-full" title="Analytics">
                <BarChart2 size={18} />
              </button>
              <button className="text-gray-500 hover:text-xpectrum-purple p-1 rounded-full" title="Help">
                <HelpCircle size={18} />
              </button>
              <button onClick={handleReset} className="text-gray-500 hover:text-xpectrum-purple p-1 rounded-full" title="Reset Chat">
                <RefreshCw size={18} />
              </button>
              <button onClick={handleClose} className="text-gray-500 hover:text-xpectrum-purple p-1 rounded-full" title="Close Chat">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[85%] sm:max-w-[80%] text-left">
                  <div 
                    className={`inline-block px-4 py-3 rounded-3xl shadow-sm ${
                      msg.type === "user"
                        ? "bg-xpectrum-purple text-white"
                        : msg.type === "bot"
                        ? "bg-white"
                        : "bg-red-100 text-red-800"
                    } text-base`}
                  >
                    {msg.type === "bot" ? (
                      <div className="markdown-body">
                        <ReactMarkdown components={{
                          p: ({node, ...props}) => <p {...props} />,
                          strong: ({node, ...props}) => <strong {...props} />,
                          em: ({node, ...props}) => <em {...props} />,
                        }}>
                          {msg.content || ''}
                        </ReactMarkdown>
                        
                        {/* Image with Explore button if available */}
                        {msg.image && (
                          <div className="mt-3 relative overflow-hidden rounded-lg">
                            <img 
                              src={msg.image.url} 
                              alt={msg.image.caption || "Response image"} 
                              className="w-full h-auto object-cover rounded-lg"
                            />
                            <button className="absolute top-2 right-2 bg-white bg-opacity-70 text-gray-800 px-3 py-1 text-xs rounded-full flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Explore
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{msg.content || ''}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator / Loading Animation - Condition changed to isGenerating */}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="inline-flex items-center px-4 py-3 rounded-3xl bg-white shadow-sm space-x-2">
                  {/* Gradient Text */}
                  <span className="loading-text-gradient text-sm">Generating response</span>
                  {/* Glowing Dots */}
                  <div className="glowing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-3xl relative">
            {/* Link Input Modal */}
            {showLinkInput && (
              <div className="absolute bottom-[calc(100%+0.5rem)] left-0 right-0 bg-white rounded-md p-3 z-20 shadow-lg border border-gray-200 link-input-container mx-2">
                <form onSubmit={handleLinkSubmit} className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Enter URL</label>
                    <button 
                      type="button"
                      onClick={() => setShowLinkInput(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    ref={linkInputRef}
                    type="url"
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xpectrum-purple focus:border-transparent"
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="bg-xpectrum-purple text-white px-4 py-1 rounded-md text-sm hover:bg-xpectrum-darkpurple transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {/* Attached Files Display */}
            {(attachedFiles.length > 0 || isUploading) && (
              <div className="flex flex-wrap gap-2 mb-2 px-2">
                {attachedFiles.map(({ file, id }) => (
                  <div key={id} className="text-xs flex items-center gap-1 bg-xpectrum-lightpurple/30 rounded-lg py-1.5 px-2">
                    {file.type.startsWith('image/') ? (
                      <div className="flex items-center min-w-0">
                        <div className="w-5 h-5 mr-1.5 rounded overflow-hidden border border-gray-300 flex-shrink-0">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-gray-700 truncate max-w-[120px]">{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center min-w-0">
                        <Paperclip size={12} className="text-xpectrum-purple flex-shrink-0 mr-1.5" />
                        <span className="text-gray-700 truncate max-w-[120px]">{file.name}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => removeFile(id)} 
                      className="text-gray-500 hover:text-red-500 ml-1 flex-shrink-0 p-0.5 rounded-full hover:bg-gray-100"
                      title="Remove attachment"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {/* Upload progress */}
                {isUploading && (
                  <div className="text-xs flex items-center gap-2 bg-xpectrum-lightpurple/30 rounded-lg py-1.5 px-2">
                    <Loader size={12} className="text-xpectrum-purple animate-spin flex-shrink-0" />
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                      <div 
                        className="bg-xpectrum-purple h-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                    <span className="text-gray-700 min-w-[30px] flex-shrink-0">{uploadProgress}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Input Container */}
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 relative">
              {/* Attachment button */}
              <div className="relative attachment-area flex-shrink-0">
                <button
                  onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                  className={`p-2 rounded-full ${
                    isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-xpectrum-purple hover:bg-xpectrum-lightpurple'
                  } transition-colors mr-1`}
                  title="Attach File"
                  disabled={isLoading}
                >
                  <Paperclip size={20} />
                </button>
                {showAttachmentOptions && (
                  <div className="absolute bottom-full left-0 mb-2 w-36 bg-white rounded-md py-1 z-10 shadow-lg border border-gray-200">
                    <button
                      onClick={() => {
                        setShowLinkInput(true);
                        setShowAttachmentOptions(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2 text-sm"
                    >
                      <LinkIcon size={16} />
                      Attach Link
                    </button>
                    <button
                      onClick={handleAttachMediaClick}
                      className="block w-full text-left px-3 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2 text-sm"
                    >
                      <ImageIcon size={16} />
                      Attach Media
                    </button>
                  </div>
                )}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2.5 min-h-[45px] max-h-[120px] focus:outline-none resize-none bg-transparent border-none text-sm"
                placeholder="Type a message..."
                disabled={isLoading}
                rows={1}
              />

              {/* Voice input and send buttons */}
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2 rounded-full transition-colors mr-1 ${
                    isListening ? 'text-xpectrum-purple bg-xpectrum-lightpurple' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={isListening ? "Stop Listening" : "Start Listening"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={isLoading || (!query.trim() && attachedFiles.length === 0)}
                  className={`p-2 rounded-full transition-colors ${
                    (!query.trim() && attachedFiles.length === 0) || isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-xpectrum-purple hover:bg-xpectrum-lightpurple'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for animations and styling */}
      <style>{`
        .markdown-body p {
          margin-bottom: 0.5rem;
        }
        .markdown-body p:last-child {
          margin-bottom: 0;
        }

        /* Siri Blob Style */
        .siri-blob {
          display: inline-block;
          width: 14px; /* Increased size */
          height: 14px; /* Increased size */
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #D946EF, #0EA5E9, #8B5CF6); /* Added purple at the end for smoother loop */
          background-size: 300% 300%; /* Larger size for animation */
          animation: blob-gradient-flow 4s ease-in-out infinite; /* Added animation */
        }
        
        @keyframes blob-gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Add glow effect when loading */
        .siri-blob.is-loading {
          animation: blob-gradient-flow 4s ease-in-out infinite, blob-glow 2s ease-in-out infinite alternate; /* Combine animations */
        }

        @keyframes blob-glow {
          from {
             box-shadow: 0 0 3px 1px rgba(229, 222, 255, 0.7), 0 0 5px 2px rgba(139, 92, 246, 0.5); /* Subtle glow */
          }
          to {
             box-shadow: 0 0 6px 3px rgba(229, 222, 255, 1), 0 0 10px 5px rgba(139, 92, 246, 0.7); /* More intense glow */
          }
        }

        /* Glowing Dots Loading Indicator */
        .glowing-dots {
          display: flex;
          gap: 4px;
        }
        .glowing-dots .dot {
          width: 8px;
          height: 8px;
          background-color: #8B5CF6; /* xpectrum-purple */
          border-radius: 50%;
          animation: glow-dot-animation 1.4s infinite ease-in-out both;
        }
        .glowing-dots .dot:nth-child(1) { animation-delay: -0.32s; }
        .glowing-dots .dot:nth-child(2) { animation-delay: -0.16s; }
        .glowing-dots .dot:nth-child(3) { animation-delay: 0s; }

        @keyframes glow-dot-animation {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5;
            box-shadow: 0 0 3px #8B5CF6;
          } 
          40% { 
            transform: scale(1.0); 
            opacity: 1;
            box-shadow: 0 0 8px 2px #8B5CF6;
          } 
        }

        /* Gradient Text */
        .loading-text-gradient {
          font-weight: 500; /* Medium weight */
          background: linear-gradient(90deg, #8B5CF6, #D946EF, #0EA5E9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          /* Add a subtle animation for the gradient */
          animation: gradient-flow 3s ease-in-out infinite;
          background-size: 200% 100%; /* Make background wider for flow effect */
        }

        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Glowing Blob Animation (for chat button) */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 8px 3px #E5DEFF, 0 0 15px 6px #8B5CF6;
            opacity: 0.8;
          }
          50% {
            box-shadow: 0 0 20px 10px #E5DEFF, 0 0 35px 18px #8B5CF6;
            opacity: 1;
          }
        }
        .glowing-blob::before {
          content: '';
          position: absolute;
          top: -5px; left: -5px; right: -5px; bottom: -5px; /* Slightly larger than button */
          border-radius: 50%;
          animation: glow 2.5s ease-in-out infinite;
          z-index: -1; /* Behind the button content */
          pointer-events: none; /* Allow clicking the button */
        }

        /* File upload animation */
        @keyframes uploadPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .upload-pulse {
          animation: uploadPulse 1.5s ease-in-out infinite;
        }

        /* Subtle Pulse for Button */
        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
          }
        }
        .animate-pulse-subtle {
          animation-name: pulse-subtle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;