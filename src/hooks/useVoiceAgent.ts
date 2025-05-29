import { useState, useRef, useEffect, useCallback } from "react";
import useVAD from "./useVAD";
import apiService from '../lib/api';

interface Message {
  role: 'user' | 'agent';
  text: string;
}

interface ConversationSummary {
  timestamp: string;
  duration: number;
  messageCount: number;
  topics: string[];
}

interface UseVoiceAgentOptions {
  onAgentStart?: () => void;
  onAgentEnd?: () => void;
  onError?: (msg: string) => void;
  onMessageAdded?: (message: Message) => void;
  onPhaseChange?: (phase: string) => void;
}

export default function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
  const [isActive, setIsActive] = useState(false);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [phase, setPhase] = useState<'idle' | 'greeting' | 'agent_speaking' | 'user_speaking' | 'agent_processing' | 'error'>('idle');
  type Phase = typeof phase;
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [interruptionAttempted, setInterruptionAttempted] = useState(false);
  const [conversationSummary, setConversationSummary] = useState<ConversationSummary | null>(null);
  const [vadEnabled, setVadEnabled] = useState(false);
  const [userTurnActive, setUserTurnActive] = useState(false);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const decodedQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const isGreeting = useRef(false);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const vadActiveRef = useRef(false);
  const vadPauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStoppedRef = useRef(false);
  const startTime = useRef<number | null>(null);
  
  // Add refs to track current streaming message
  const currentStreamingMessageRef = useRef<string>("");
  const isStreamingRef = useRef(false);
  const currentMessageIdRef = useRef<string>("");
  
  const silenceTimeoutMs = 2000;
  const isCallActive = phase !== "idle" && phase !== "error";

  // Check microphone permission on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setMicPermission("granted"))
      .catch(() => setMicPermission("denied"));
  }, []);

  // Notify about phase changes
  useEffect(() => {
    console.log("[Phase Change] New phase:", phase, {
      isActive,
      userTurnActive,
      vadEnabled,
      isRecording,
      vadActive: vadActiveRef.current,
      recordingStopped: recordingStoppedRef.current
    });
    options.onPhaseChange?.(phase);
  }, [phase, options, isActive, userTurnActive, vadEnabled, isRecording]);

  function stopAgentPlayback() {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    decodedQueueRef.current = [];
    isPlayingRef.current = false;
  }

  async function enqueueDecodedChunk(buffer: AudioBuffer) {
    console.log('Enqueueing decoded chunk, duration:', buffer.duration);
    decodedQueueRef.current.push(buffer);
    if (!isPlayingRef.current) {
      playNextDecodedChunk();
    }
  }

  function playNextDecodedChunk() {
    console.log('Playing next chunk, queue length:', decodedQueueRef.current.length);
    if (decodedQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      isPlayingRef.current = true;
      const decodedBuffer = decodedQueueRef.current.shift();
      if (!decodedBuffer) return;
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        playNextDecodedChunk();
      };
      
      source.start();
      console.log("Started playing audio chunk, duration:", decodedBuffer.duration);
    } catch (err) {
      console.error("Error playing decoded chunk:", err);
      setTimeout(() => playNextDecodedChunk(), 100);
    }
  }

  const handleEnd = useCallback(() => {
    console.log("[handleEnd] Starting cleanup process");
    
    if (messages.length > 0 && startTime.current) {
      const summary: ConversationSummary = {
        timestamp: new Date().toISOString(),
        duration: Math.round((Date.now() - startTime.current) / 1000),
        messageCount: messages.length,
        topics: extractTopics(messages)
      };
      setConversationSummary(summary);
    }

    // Clear all timeouts
    if (vadPauseTimeoutRef.current) {
      clearTimeout(vadPauseTimeoutRef.current);
      vadPauseTimeoutRef.current = null;
    }

    // Reset streaming refs
    currentStreamingMessageRef.current = "";
    isStreamingRef.current = false;
    currentMessageIdRef.current = "";

    // Reset all refs
    vadActiveRef.current = false;
    recordingStoppedRef.current = false;
    isGreeting.current = false;
    startTime.current = null;

    // Stop recording if active
    if ((window as any).stopRecording) {
      (window as any).stopRecording();
      delete (window as any).stopRecording;
    }
    
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach(track => track.stop());
      recordingStreamRef.current = null;
    }

    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    // Stop audio playback
    stopAgentPlayback();

    // Close WebSocket
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        try {
          console.log("Sending cleanup message to backend before closing WebSocket");
          wsRef.current.send(JSON.stringify({ type: "cleanup" }));
        } catch (err) {
          console.error("Error sending cleanup message:", err);
        }
        setTimeout(() => {
          if (wsRef.current) {
            console.log("Closing WebSocket after cleanup");
            wsRef.current.close();
            wsRef.current = null;
          }
        }, 200);
      } else {
        console.log("WebSocket not open, closing immediately. State:", wsRef.current.readyState);
        wsRef.current.close();
        wsRef.current = null;
      }
    }

    // Reset all state
    setPhase("idle");
    setIsActive(false);
    setMessages([]);
    setErrorMsg("");
    setIsRecording(false);
    setUserTurnActive(false);
    setVadEnabled(false);
    setConnectionStatus("disconnected");

    console.log("[handleEnd] Cleanup completed");
    options.onAgentEnd?.();
  }, [messages, options]);

  const connectWebSocket = useCallback(async () => {
    // Close any existing WebSocket connection first
    if (wsRef.current) {
      console.log("[connectWebSocket] Closing existing WebSocket connection");
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      console.log("[connectWebSocket] Creating new WebSocket connection");
      const wsUrl = apiService.getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      setConnectionStatus("connecting");
      
      ws.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setConnectionStatus('connected');
        ws.send(JSON.stringify({
          type: 'start',
          service: 'HRMS_API_KEY',
          message: 'Hi, this is your agent. How can I help you today?'
        }));
      };

      ws.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          const ab = await event.data.arrayBuffer();
          console.log(`[WebSocket] Received audio chunk of size: ${ab.byteLength}`);
          
          try {
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            
            audioContextRef.current.decodeAudioData(
              ab,
              (decodedBuffer) => {
                console.log("Decoded WAV audio chunk successfully, duration:", decodedBuffer.duration);
                enqueueDecodedChunk(decodedBuffer);
              },
              (error) => {
                console.error("Failed to decode WAV audio chunk!", error);
                const arr = new Uint8Array(ab);
                console.error("First 16 bytes of buffer:", arr.slice(0, 16));
              }
            );
          } catch (err) {
            console.error("Error processing audio chunk:", err);
          }
        } else {
          try {
            const data = JSON.parse(event.data);
            console.log(`[WebSocket] Received message:`, data);
            
            let newMessage: Message | null = null;
            
            if (data.type === "greeting") {
              newMessage = { role: "agent", text: data.text };
              setMessages((msgs) => [...msgs, newMessage!]);
              options.onMessageAdded?.(newMessage);
              setPhase("greeting");
              isGreeting.current = true;
            } else if (data.type === "greeting_end") {
              console.log("[WebSocket] Greeting ended, transitioning to agent_speaking");
              isGreeting.current = false;
              setPhase("agent_speaking");
            } else if (data.type === "transcript") {
              newMessage = { role: "user", text: data.text };
              setMessages((msgs) => [...msgs, newMessage!]);
              options.onMessageAdded?.(newMessage);
              setPhase("agent_processing");
            } else if (data.event === "agent_message" && data.answer !== undefined) {
              // Handle streaming agent message chunks
              const messageId = data.message_id || data.id;
              
              if (!isStreamingRef.current || currentMessageIdRef.current !== messageId) {
                // Start of new streaming message
                console.log("[WebSocket] Starting new streaming message:", messageId);
                currentStreamingMessageRef.current = "";
                isStreamingRef.current = true;
                currentMessageIdRef.current = messageId;
                setPhase("agent_speaking");
              }
              
              // Accumulate the streaming text
              if (data.answer) {
                currentStreamingMessageRef.current += data.answer;
                console.log("[WebSocket] Accumulated text:", currentStreamingMessageRef.current);
                
                // Update the last message in real-time or add new message
                setMessages((msgs) => {
                  const lastMsg = msgs[msgs.length - 1];
                  if (lastMsg && lastMsg.role === "agent" && isStreamingRef.current && 
                      msgs.length > 0 && lastMsg.text === currentStreamingMessageRef.current.slice(0, lastMsg.text.length)) {
                    // Update existing streaming message
                    return [
                      ...msgs.slice(0, -1),
                      { ...lastMsg, text: currentStreamingMessageRef.current }
                    ];
                  } else if (!lastMsg || lastMsg.role !== "agent" || !isStreamingRef.current) {
                    // Add new message (first chunk of streaming)
                    const newMsg = { role: "agent" as const, text: currentStreamingMessageRef.current };
                    options.onMessageAdded?.(newMsg);
                    return [...msgs, newMsg];
                  } else {
                    // Update existing message
                    return [
                      ...msgs.slice(0, -1),
                      { ...lastMsg, text: currentStreamingMessageRef.current }
                    ];
                  }
                });
              }
            } else if (data.event === "message_end") {
              // End of streaming message
              console.log("[WebSocket] Streaming message ended");
              if (isStreamingRef.current && currentStreamingMessageRef.current) {
                // Finalize the message
                const finalMessage = { role: "agent" as const, text: currentStreamingMessageRef.current };
                setMessages((msgs) => {
                  const lastMsg = msgs[msgs.length - 1];
                  if (lastMsg && lastMsg.role === "agent") {
                    return [
                      ...msgs.slice(0, -1),
                      finalMessage
                    ];
                  }
                  return [...msgs, finalMessage];
                });
              }
              
              // Reset streaming state
              isStreamingRef.current = false;
              currentStreamingMessageRef.current = "";
              currentMessageIdRef.current = "";
            } else if (data.type === "response") {
              // Legacy response handling - ONLY use if not streaming and not already handled
              if (!isStreamingRef.current) {
                console.log("[WebSocket] Handling legacy response (non-streaming)");
                newMessage = { role: "agent", text: data.text };
                setMessages((msgs) => {
                  // Check if this message already exists to prevent duplicates
                  const lastMsg = msgs[msgs.length - 1];
                  if (lastMsg && lastMsg.role === "agent" && lastMsg.text === data.text) {
                    console.log("[WebSocket] Duplicate message detected, skipping");
                    return msgs; // Don't add duplicate
                  }
                  options.onMessageAdded?.(newMessage!);
                  return [...msgs, newMessage!];
                });
                setPhase("agent_speaking");
              } else {
                console.log("[WebSocket] Skipping legacy response - streaming in progress");
              }
            } else if (data.type === "agent_speaking") {
              console.log("[WebSocket] Agent is speaking");
              setPhase("agent_speaking");
              setVadEnabled(false);
              setUserTurnActive(false);
            } else if (data.type === "agent_idle") {
              console.log("[WebSocket] Agent is idle, enabling user turn");
              setUserTurnActive(true);
              setVadEnabled(true);
            } else if (data.type === "user_speaking") {
              console.log("[WebSocket] User speaking detected");
              setUserTurnActive(true);
              setVadEnabled(true);
            } else if (data.type === "interrupted") {
              console.log("Agent interrupted by user.");
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        }
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] Connection error", error);
        setConnectionStatus("disconnected");
        setErrorMsg("Connection error. Attempting to reconnect...");
        setPhase("error");
        options.onError?.("Connection error. Attempting to reconnect...");
      };

      ws.onclose = (event) => {
        console.log(`[WebSocket] Connection closed, code: ${event.code}, reason: ${event.reason}`);
        setConnectionStatus("disconnected");
        
        // Reset streaming state on close
        isStreamingRef.current = false;
        currentStreamingMessageRef.current = "";
        currentMessageIdRef.current = "";
        
        // Only attempt reconnection if we're still in an active call and not in error state
        if (phase !== "error" && phase !== "idle" && isCallActive) {
          console.log("[WebSocket] Attempting to reconnect...");
          setTimeout(() => {
            if ((phase as Phase) !== 'idle' && wsRef.current === ws) {
              connectWebSocket();
            }
          }, 1000);
        }
        
        if (event.code === 1006) {
          console.log("WebSocket closed due to a connection error. Cleaning up session.");
          handleEnd();
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('disconnected');
      setPhase('error');
      setErrorMsg('Failed to connect to voice agent');
      options.onError?.('Failed to connect to voice agent');
    }
  }, [options, handleEnd]);

  async function startRecording() {
    console.log("[Recording] Starting recording");
    setPhase("user_speaking");
    setIsRecording(true);
    recordingStoppedRef.current = false;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (e) => {
        if (recordingStoppedRef.current) return;
        if (e.data.size > 0 && wsRef.current?.readyState === 1) {
          console.log(`[Recording] Sending audio chunk of size: ${e.data.size}`);
          try {
            wsRef.current.send(e.data);
            console.log("Sent audio chunk to backend");
          } catch (error) {
            console.error("Error sending audio chunk:", error);
          }
        } else {
          console.log("WebSocket not open, skipping audio chunk send.");
        }
      };

      mediaRecorder.onstop = () => {
        console.log("[Recording] MediaRecorder stopped, sending done");
        if (wsRef.current?.readyState === 1) {
          try {
            wsRef.current.send(JSON.stringify({ type: "done" }));
            console.log("Sent done message to backend");
          } catch (error) {
            console.error("Error sending done message:", error);
          }
        } else {
          console.log("WebSocket not open, skipping done send.");
        }
        if (recordingStreamRef.current) {
          recordingStreamRef.current.getTracks().forEach(track => track.stop());
          recordingStreamRef.current = null;
        }
        setIsRecording(false);
      };

      mediaRecorder.start(200);
      (window as any).stopRecording = () => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      };
    } catch (err) {
      setErrorMsg("Microphone access denied or unavailable.");
      setPhase("error");
      setIsRecording(false);
      options.onError?.("Microphone access denied or unavailable.");
    }
  }

  const extractTopics = (msgs: Message[]) => {
    const topics = new Set<string>();
    msgs.forEach(msg => {
      if (msg.role === "user") {
        const words = msg.text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 4 && !["what", "when", "where", "which", "about"].includes(word)) {
            topics.add(word);
          }
        });
      }
    });
    return Array.from(topics).slice(0, 5);
  };

  // Initialize call logic
  const initializeCall = useCallback(() => {
    console.log("[initializeCall] Starting fresh call initialization");
    
    // Ensure we start from a clean state
    setMessages([]);
    setErrorMsg("");
    setIsActive(true);
    setIsRecording(false);
    setUserTurnActive(false); // Start as false, will be set by WebSocket messages
    setVadEnabled(false); // Start as false, will be enabled when needed
    setInterruptionAttempted(false);
    setConnectionStatus("disconnected");
    
    // Reset streaming refs
    currentStreamingMessageRef.current = "";
    isStreamingRef.current = false;
    currentMessageIdRef.current = "";
    
    // Reset all refs
    vadActiveRef.current = false;
    recordingStoppedRef.current = false;
    isGreeting.current = true;
    startTime.current = Date.now();
    
    // Clear any existing timeouts
    if (vadPauseTimeoutRef.current) {
      clearTimeout(vadPauseTimeoutRef.current);
      vadPauseTimeoutRef.current = null;
    }
    
    // Stop any existing audio
    stopAgentPlayback();
    
    setPhase("greeting");
    
    // Small delay to ensure state is set before connecting
    setTimeout(() => {
      connectWebSocket();
    }, 100);
  }, [connectWebSocket]);

  useVAD({
    isActive: vadEnabled && userTurnActive && isCallActive && phase !== "greeting",
    onSpeechStart: () => {
      if (!userTurnActive || !isCallActive || phase === "greeting") return;
      console.log("[VAD] User started speaking (hook)", {
        userTurnActive,
        isCallActive,
        currentPhase: phase,
        vadActive: vadActiveRef.current,
        recordingStopped: recordingStoppedRef.current,
        isRecording
      });
      
      if (vadPauseTimeoutRef.current) {
        clearTimeout(vadPauseTimeoutRef.current);
        vadPauseTimeoutRef.current = null;
      }
      
      if (!vadActiveRef.current) {
        vadActiveRef.current = true;
        recordingStoppedRef.current = false;
        
        if (phase === "agent_speaking") {
          console.log("[VAD] Interrupting agent");
          stopAgentPlayback();
          setPhase("user_speaking");
          setInterruptionAttempted(true);
          setVadEnabled(false);
          setTimeout(() => {
            setVadEnabled(true);
            setInterruptionAttempted(false);
          }, 100);
          if (!isRecording) startRecording();
        } else if (!isRecording) {
          startRecording();
        }
      }
    },
    onSpeechEnd: () => {
      if (!userTurnActive || !isCallActive || phase === "greeting") return;
      console.log("[VAD] User stopped speaking (hook)", {
        userTurnActive,
        isCallActive,
        currentPhase: phase,
        vadActive: vadActiveRef.current,
        vadPauseTimeout: vadPauseTimeoutRef.current,
        recordingStopped: recordingStoppedRef.current,
        isRecording
      });
      
      if (vadActiveRef.current && !vadPauseTimeoutRef.current) {
        vadPauseTimeoutRef.current = setTimeout(() => {
          vadActiveRef.current = false;
          vadPauseTimeoutRef.current = null;
          if (!recordingStoppedRef.current && isRecording) {
            recordingStoppedRef.current = true;
            console.log("[VAD] Stopping recording after silence");
            setPhase("agent_processing");
            setIsRecording(false);
            if ((window as any).stopRecording) (window as any).stopRecording();
            setUserTurnActive(false);
            setVadEnabled(false);
          }
        }, silenceTimeoutMs);
      }
    },
    onSensitivity: () => {}, // No-op for now
  });

  // Start the voice agent
  const startAgent = useCallback(() => {
    if (micPermission !== "granted") {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setMicPermission("granted");
          initializeCall();
          options.onAgentStart?.();
        })
        .catch(() => {
          setMicPermission("denied");
          setErrorMsg("Please allow microphone access to start the conversation.");
          setPhase("error");
          options.onError?.("Please allow microphone access to start the conversation.");
        });
    } else {
      initializeCall();
      options.onAgentStart?.();
    }
  }, [micPermission, initializeCall, options]);

  // Stop the voice agent
  const stopAgent = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  return {
    // State
    isActive,
    connectionStatus,
    phase,
    micPermission,
    isRecording,
    messages,
    errorMsg,
    interruptionAttempted,
    conversationSummary,
    userTurnActive,
    vadEnabled,
    
    // Actions
    startAgent,
    stopAgent,
  };
}