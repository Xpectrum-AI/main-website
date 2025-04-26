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
  link?: string;
};

interface AttachedFile {
  file: File;
  id: string;
  upload_file_id?: string;
  url?: string;
}

// Define props interface with domain types
interface ChatComponentProps {
  assistantName?: string;
  domain: keyof typeof API_KEYS | keyof typeof DOMAIN_CONFIG;
}

// Use environment variables
const API_KEYS = {
  HRMS: "app-7cE1DmqobC2aVLBVQz1DAbaM",
  Insurance: "app-MU2OyM1rgRrnRebt2BPBpK5r",
  Hospitality: "app-vGvMMAK3o0rxeAHOWaj96RCG"
};

// Domain-specific configuration
const DOMAIN_CONFIG = {
  HRMS: {
    welcomeMessage: "Welcome to the HR Management System! How can I assist you with HR matters today?",
    placeholderText: "Ask about leave balance, policies, payroll..."
  },
  Insurance: {
    welcomeMessage: "Welcome to Insurance Management! I can help you with policies, claims, and coverage inquiries.",
    placeholderText: "Ask about policies, claims, coverage..."
  },
  Hospitality: {
    welcomeMessage: "Welcome to Hospitality Services! How can I assist you with your hospitality needs today?",
    placeholderText: "Ask about bookings, amenities, services..."
  }
};

const BASE_URL = "https://api.next-agi.com/v1";

// Function to get API key based on domain
const getApiKey = (domain: keyof typeof API_KEYS = 'HRMS') => {
  return API_KEYS[domain];
};

// Get domain config based on domain name
const getDomainConfig = (domain: keyof typeof DOMAIN_CONFIG = 'HRMS') => {
  return DOMAIN_CONFIG[domain];
};

// Get domain-specific assistant name
const getAssistantName = (domain: keyof typeof DOMAIN_CONFIG) => {
  switch(domain) {
    case 'Insurance':
      return 'Insurance Assistant';
    case 'Hospitality':
      return 'Hospitality Assistant';
    case 'HRMS':
      return 'HR Assistant';
    default:
      return 'Xpectrum Assistant';
  }
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

const ChatComponent: React.FC<ChatComponentProps> = ({ 
  domain,
  assistantName = getAssistantName(domain as keyof typeof DOMAIN_CONFIG)
}) => {
  // Get domain config right away
  const domainConfig = getDomainConfig(domain as keyof typeof DOMAIN_CONFIG);
  
  const [query, setQuery] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: "bot",
      content: domainConfig.welcomeMessage
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

  // Auto-scroll to bottom when messages change or when generating
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]); // Add isGenerating to dependencies

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
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      // Check file size (max 5MB - adjust if needed)
      if (file.size > 5 * 1024 * 1024) {
        console.log("File size validation failed:", file.size, "bytes");
        setMessages(prev => [...prev, { 
          type: "error", 
          content: "File is too large. Maximum size is 5MB." 
        }]);
        return;
      }

      // Check file type - only allow images
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.log("File type validation failed:", file.type);
        setMessages(prev => [...prev, { 
          type: "error", 
          content: "Invalid file type. Please upload only JPG, PNG, GIF, or WebP images." 
        }]);
        return;
      }

      try {
        console.log("Starting file upload process...");
        
        // Create FormData with the exact field name used in the curl command
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user', 'abc-123');
        
        // Log the FormData contents
        console.log("FormData contents:");
        for (const pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        console.log("Sending request to:", `${BASE_URL}/files/upload`);
        console.log("Using API key:", getApiKey(domain));
        
        const response = await fetch(`${BASE_URL}/files/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getApiKey(domain)}`
          },
          body: formData
        });

        console.log("Upload response status:", response.status);
        console.log("Upload response headers:", Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Upload error details:", errorText);
          console.error("Full error response:", response);
          throw new Error(`Upload failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("File upload successful! Response data:", data);
        
        // Add file to attached files with the response data
        const fileId = data.file_id || data.id;
        console.log("Using file ID:", fileId);
        
        setAttachedFiles(prev => [...prev, { 
          file, 
          id: fileId || Math.random().toString(36).substr(2, 9),
          upload_file_id: fileId // Store the upload_file_id for chat message
        }]);
        
        console.log("File successfully attached to the chat");
        setShowAttachmentOptions(false);
      } catch (error: any) {
        console.error("File upload error:", error);
        setMessages(prev => [...prev, { 
          type: "error", 
          content: `Failed to upload file: ${error.message}` 
        }]);
      }
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Trigger file input click
  const handleAttachMediaClick = () => {
    fileInputRef.current?.click();
  };

  // Function to check if a URL actually returns an image
  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Update isValidImageUrl to be async and include actual image verification
  const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
      // Check for base64 image
      if (url.startsWith('data:image/')) {
        const validBase64Formats = [
          'data:image/jpeg;base64,',
          'data:image/jpg;base64,',
          'data:image/png;base64,',
          'data:image/gif;base64,',
          'data:image/webp;base64,'
        ];
        return validBase64Formats.some(format => url.startsWith(format));
      }

      const parsedUrl = new URL(url);
      
      // Basic URL validation
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
      }

      // Try to actually load the image
      const isValidImage = await checkImageExists(url);
      if (isValidImage) {
        return true;
      }

      // Rest of the existing validation...
      const path = parsedUrl.pathname.toLowerCase();
      
      // Check common image extensions
      const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
      const hasValidExtension = validExtensions.some(ext => path.endsWith(ext));
      
      // Check for common image hosting patterns
      const imageHostingPatterns = [
        /\.(cloudinary\.com)/,
        /(images|img|photos)\./,
        /(imgur\.com)/,
        /(\.?unsplash\.com)/,
        /(\.?pexels\.com)/,
        /\.(googleusercontent\.com.*=w)/,
        /(\.?giphy\.com)/,
        /(\.?flickr\.com)/,
        /(\.?photobucket\.com)/,
        /\.(amazonaws\.com)/,
        /\.(digitaloceanspaces\.com)/,
        /(\.?imgix\.net)/,
        /(\.?staticflickr\.com)/,
        /\.(blob\.core\.windows\.net)/,
        /\.(storage\.googleapis\.com)/
      ];
      
      const isImageHosting = imageHostingPatterns.some(pattern => pattern.test(url.toLowerCase()));
      
      // Check for image-specific query parameters
      const imageQueryParams = ['format=jpg', 'format=png', 'format=jpeg', 'format=webp', 'format=gif'];
      const hasImageQueryParam = imageQueryParams.some(param => 
        parsedUrl.search.toLowerCase().includes(param)
      );
      
      return hasValidExtension || isImageHosting || hasImageQueryParam;
      
    } catch (error) {
      console.error('Error validating image URL:', error);
      return false;
    }
  };

  // Update handleLinkSubmit to handle async validation
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (linkValue.trim()) {
      setIsLoading(true);
      try {
        const isValid = await isValidImageUrl(linkValue);
        if (!isValid) {
          setMessages(prev => [...prev, { 
            type: "error", 
            content: "Invalid image URL. Please provide either a valid image URL (PNG, JPG, JPEG, WEBP, GIF) or a base64 encoded image." 
          }]);
          setShowLinkInput(false);
          setLinkValue("");
          setShowAttachmentOptions(false);
          return;
        }

        // Add link as attachment
        setAttachedFiles(prev => [...prev, { 
          id: Math.random().toString(36).substr(2, 9),
          url: linkValue,
          file: new File([], '') // Minimal file object required by interface
        }]);
        
        // Close link input and reset value
        setShowLinkInput(false);
        setLinkValue("");
        setShowAttachmentOptions(false);
      } catch (error) {
        console.error('Error validating image URL:', error);
        setMessages(prev => [...prev, { 
          type: "error", 
          content: "Error validating image URL. Please try again." 
        }]);
      } finally {
        setIsLoading(false);
      }
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

  const sendMessage = async (forcedQuery?: string) => {
    const messageText = forcedQuery || query;
    if ((!messageText.trim() && attachedFiles.length === 0) || isLoading) return;

    setSearchQuery(messageText || "Analyzing attachments...");
    setIsGenerating(true);

    // Structure the payload for the chat API
    const payload = {
      inputs: {},
      query: messageText,
      response_mode: "streaming",
      conversation_id: conversationId,
      user: "abc-123",
      files: attachedFiles.map(file => {
        if (file.url) {
          return {
            type: "image",
            transfer_method: "remote_url",
            url: file.url
          };
        } else {
          return {
            type: "image",
            transfer_method: "local_file",
            upload_file_id: file.upload_file_id
          };
        }
      })
    };

    console.log("Sending chat API request with payload:", JSON.stringify(payload, null, 2));

    setIsLoading(true);
    
    // Add user message without the attachment text
    setMessages(prev => [...prev, { 
      type: "user", 
      content: messageText,
      image: attachedFiles.length > 0 && !attachedFiles[0].url ? {
        url: URL.createObjectURL(attachedFiles[0].file),
        caption: attachedFiles[0].file.name
      } : undefined,
      link: attachedFiles.length > 0 && attachedFiles[0].url ? attachedFiles[0].url : undefined
    }]);
    setQuery("");
    setAttachedFiles([]);

    try {
      setTimeout(() => {
        setSearchQuery(null);
      }, 1000);

      const response = await fetch(`${BASE_URL}/chat-messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getApiKey(domain as keyof typeof API_KEYS)}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream"
        },
        body: JSON.stringify(payload),
        duplex: "half"
      } as RequestInit);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat API error details:", errorText);
        console.error("Full error response:", response);
        
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Parsed error JSON:", errorJson);
        } catch (e) {
          console.error("Error text is not valid JSON");
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // Add empty bot message to start
      let botMessageIndex = -1;
      setMessages((prev) => {
        botMessageIndex = prev.length;
        return [...prev, { type: "bot", content: "" }];
      });
      setIsGenerating(false); // Turn off the loading indicator once we start receiving the stream

      if (reader) {
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
    setMessages([
      {
        type: "bot" as const,
        content: domainConfig.welcomeMessage
      }
    ]);
    setQuery("");
    setConversationId("");
    setShowAttachmentOptions(false);
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

  // Get domain-specific color theme
  const getDomainColorTheme = () => {
    switch(domain) {
      case 'Insurance':
        return {
          primary: 'from-blue-600 to-blue-500',
          secondary: 'bg-blue-50',
          accent: 'text-blue-600',
          hover: 'hover:bg-blue-100',
          button: 'bg-blue-600 hover:bg-blue-700',
          messageUser: 'bg-blue-600 text-white',
          messageBot: 'bg-white',
          light: 'bg-blue-50/30'
        };
      case 'Hospitality':
        return {
          primary: 'from-amber-600 to-amber-500',
          secondary: 'bg-amber-50',
          accent: 'text-amber-600',
          hover: 'hover:bg-amber-100',
          button: 'bg-amber-600 hover:bg-amber-700',
          messageUser: 'bg-amber-600 text-white',
          messageBot: 'bg-white',
          light: 'bg-amber-50/30'
        };
      case 'HRMS':
      default:
        return {
          primary: 'from-purple-600 to-pink-500',
          secondary: 'bg-purple-50',
          accent: 'text-xpectrum-purple',
          hover: 'hover:bg-xpectrum-lightpurple',
          button: 'bg-xpectrum-purple hover:bg-xpectrum-darkpurple',
          messageUser: 'bg-xpectrum-purple text-white',
          messageBot: 'bg-white',
          light: 'bg-xpectrum-lightpurple/30'
        };
    }
  };

  const theme = getDomainColorTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
      {/* Chat Button - Updated with domain-specific colors */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        className={`bg-gradient-to-br ${theme.primary} text-white rounded-full p-4 sm:p-5 transition-all duration-300 flex items-center justify-center chat-button shadow-xl z-[100] fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 relative border-2 border-white/50 animate-pulse-subtle ${isLoading ? 'glowing-blob' : ''} ${isOpen ? 'opacity-50 hover:opacity-100' : ''}`}
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
          {/* Header */}
          <div className="p-4 rounded-t-3xl flex justify-between items-center bg-white border-b border-gray-200">
            <div className="flex items-center">
              <img src="/xpectrumLogo.png" alt="Xpectrum Logo" className="h-6 mr-2" />
              <span className="font-semibold text-gray-800 mr-2">{getAssistantName(domain as keyof typeof DOMAIN_CONFIG)}</span>
              <span className={`siri-blob ${isLoading ? 'is-loading' : ''}`}></span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className={`text-gray-500 ${theme.hover} p-1 rounded-full`} title="Analytics">
                <BarChart2 size={18} />
              </button>
              <button className={`text-gray-500 ${theme.hover} p-1 rounded-full`} title="Help">
                <HelpCircle size={18} />
              </button>
              <button onClick={handleReset} className={`text-gray-500 ${theme.hover} p-1 rounded-full`} title="Reset Chat">
                <RefreshCw size={18} />
              </button>
              <button onClick={handleClose} className={`text-gray-500 ${theme.hover} p-1 rounded-full`} title="Close Chat">
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
                        ? theme.messageUser
                        : msg.type === "bot"
                        ? theme.messageBot
                        : "bg-red-100 text-red-800"
                    } text-base`}
                  >
                    {msg.type === "bot" ? (
                      <div className="markdown-body">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                        {msg.image && (
                          <div className="mt-2">
                            <img 
                              src={msg.image.url} 
                              alt={msg.image.caption || 'Attached image'} 
                              className="max-w-full h-auto rounded-lg"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isGenerating && messages.length > 0 && messages[messages.length - 1].type !== "bot" && (
              <div className="flex justify-start">
                <div className="inline-flex items-center px-4 py-3 rounded-3xl bg-white shadow-sm space-x-2">
                  <span className="loading-text-gradient text-sm">Generating response</span>
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
                      className={`${theme.button} text-white px-4 py-1 rounded-md text-sm transition-colors`}
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
              accept="image/jpeg,image/png,image/gif,image/webp"
            />

            {/* Attached Files Display */}
            {(attachedFiles.length > 0 || isUploading) && (
              <div className="flex flex-wrap gap-2 mb-2 px-2">
                {attachedFiles.map(({ file, id, url }) => (
                  <div key={id} className={`text-xs flex items-center gap-1 ${theme.light} rounded-lg py-1.5 px-2`}>
                    {url ? (
                      // Link preview
                      <div className="flex items-center min-w-0">
                        <LinkIcon className={`h-4 w-4 ${theme.accent} flex-shrink-0 mr-1.5`} />
                        <span className="text-gray-700 truncate max-w-[120px]">{new URL(url).hostname}</span>
                      </div>
                    ) : (
                      // File preview
                      <div className="flex items-center min-w-0">
                        <div className="w-8 h-8 rounded overflow-hidden mr-2 flex-shrink-0">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
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
                  <div className={`text-xs flex items-center gap-2 ${theme.light} rounded-lg py-1.5 px-2`}>
                    <Loader size={12} className={`${theme.accent} animate-spin flex-shrink-0`} />
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                      <div 
                        className={`${theme.button} h-full transition-all duration-300 ease-out`}
                        style={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                    <span className="text-gray-700 min-w-[30px] flex-shrink-0">{uploadProgress}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Input Container */}
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
              {/* Attachment button */}
              <div className="relative attachment-area flex-shrink-0">
                <button
                  onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                  className={`p-2 rounded-full transition-colors mr-1 ${
                    isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : `${theme.accent} ${theme.hover}`
                  }`}
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

              {/* Textarea and loading dots */}
              <div className="flex-1 flex items-center">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3 py-2.5 min-h-[45px] max-h-[120px] focus:outline-none resize-none bg-transparent border-none text-sm"
                  placeholder={domainConfig.placeholderText}
                  disabled={isLoading}
                  rows={1}
                />
                {isGenerating && (
                  <div className="flex space-x-1 mr-2">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
              </div>

              {/* Voice input and send button */}
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2 rounded-full transition-colors mr-1 ${
                    isListening ? `${theme.accent} ${theme.secondary}` : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={isListening ? "Stop Listening" : "Start Listening"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                </button>

                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || (!query.trim() && attachedFiles.length === 0)}
                  className={`p-2 rounded-full transition-colors ${
                    (!query.trim() && attachedFiles.length === 0) || isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : theme.accent
                  }`}
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Add CSS for typing dots animation */}
          <style>{`
            .typing-dots {
              display: inline-flex;
              align-items: center;
              height: 20px;
              margin-left: 4px;
            }
            
            .typing-dots span {
              width: 4px;
              height: 4px;
              margin: 0 1px;
              background-color: currentColor;
              border-radius: 50%;
              display: inline-block;
              opacity: 0.4;
            }
            
            .typing-dots span:nth-child(1) {
              animation: dotFade 1s infinite 0.1s;
            }
            
            .typing-dots span:nth-child(2) {
              animation: dotFade 1s infinite 0.2s;
            }
            
            .typing-dots span:nth-child(3) {
              animation: dotFade 1s infinite 0.3s;
            }
            
            @keyframes dotFade {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
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
          `}</style>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;