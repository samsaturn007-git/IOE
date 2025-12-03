import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VoiceAssistant.css';
import config from '../config';

const VoiceAssistant = ({ musicPlayerRef }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [micPermission, setMicPermission] = useState('checking');

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef(null);
  const isActiveRef = useRef(false);
  const fullTranscriptRef = useRef('');
  const questionStartTimeRef = useRef(null);
  const isRecognitionRunningRef = useRef(false);

  // Keep isActiveRef in sync with isActive state
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      // Cancel any ongoing speech first
      if (synthRef.current) {
        synthRef.current.cancel();
      }

      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.95; // Slightly slower to reduce stuttering
        utterance.pitch = 1.05;
        utterance.volume = 1.0;

        // Get voices - ensure they're loaded
        let voices = synthRef.current.getVoices();
        
        // If no voices yet, wait for them to load
        if (voices.length === 0) {
          synthRef.current.onvoiceschanged = () => {
            voices = synthRef.current.getVoices();
            selectVoiceAndSpeak(voices, utterance, resolve);
          };
        } else {
          selectVoiceAndSpeak(voices, utterance, resolve);
        }
      }, 100);
    });
  }, []);

  const selectVoiceAndSpeak = useCallback((voices, utterance, resolve) => {
    // Priority order: Premium voices first
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en-US') && voice.name.includes('Samantha')
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && voice.name.includes('Ava')
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && (voice.name.includes('Google US English') || voice.name.includes('Google')) && voice.name.includes('Female')
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && voice.name.includes('Premium') && !voice.name.includes('Male')
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && voice.name.includes('Enhanced') && !voice.name.includes('Male')
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && 
      (voice.name.includes('Victoria') || voice.name.includes('Allison') || voice.name.includes('Susan'))
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && !voice.name.includes('Male') && voice.localService === false
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && !voice.name.includes('Male')
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log('Using voice:', femaleVoice.name);
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      resolve();
    };

    // Resume if paused (helps with some browsers)
    if (synthRef.current.paused) {
      synthRef.current.resume();
    }

    if (synthRef.current) {
      synthRef.current.speak(utterance);
    }
  }, []);

  const handleQuestion = useCallback(async (question) => {
    console.log('Processing question:', question);
    setIsProcessing(true);
    setIsListening(false);
    setResponse('');
    setError('');

    try {
      // Check for music control commands first
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('play music') || 
          lowerQuestion.includes('play my music') || 
          lowerQuestion.includes('start music') ||
          lowerQuestion.includes('play the music') ||
          lowerQuestion.includes('music library')) {
        
        if (musicPlayerRef?.current) {
          const success = await musicPlayerRef.current.play();
          const responseText = success 
            ? 'Playing your music now' 
            : 'Sorry, there are no music files available. Please add music to your library.';
          setResponse(responseText);
          await speak(responseText);
          
          setTimeout(() => {
            console.log('Resetting assistant');
            isActiveRef.current = false;
            fullTranscriptRef.current = '';
            setIsActive(false);
            setTranscript('');
            setResponse('');
            setIsProcessing(false);

            if (recognitionRef.current && !isRecognitionRunningRef.current) {
              try {
                recognitionRef.current.start();
                console.log('Recognition restarted after response');
              } catch (err) {
                console.log('Recognition restart error:', err);
              }
            }
          }, 2000);
          return;
        }
      }

      if (lowerQuestion.includes('pause music') || 
          lowerQuestion.includes('stop music') ||
          lowerQuestion.includes('pause the music')) {
        
        if (musicPlayerRef?.current) {
          musicPlayerRef.current.pause();
          const responseText = 'Music paused';
          setResponse(responseText);
          await speak(responseText);
          
          setTimeout(() => {
            console.log('Resetting assistant');
            isActiveRef.current = false;
            fullTranscriptRef.current = '';
            setIsActive(false);
            setTranscript('');
            setResponse('');
            setIsProcessing(false);

            if (recognitionRef.current && !isRecognitionRunningRef.current) {
              try {
                recognitionRef.current.start();
                console.log('Recognition restarted after response');
              } catch (err) {
                console.log('Recognition restart error:', err);
              }
            }
          }, 2000);
          return;
        }
      }

      if (lowerQuestion.includes('next song') || 
          lowerQuestion.includes('next track') ||
          lowerQuestion.includes('skip')) {
        
        if (musicPlayerRef?.current) {
          musicPlayerRef.current.next();
          const responseText = 'Playing next track';
          setResponse(responseText);
          await speak(responseText);
          
          setTimeout(() => {
            console.log('Resetting assistant');
            isActiveRef.current = false;
            fullTranscriptRef.current = '';
            setIsActive(false);
            setTranscript('');
            setResponse('');
            setIsProcessing(false);

            if (recognitionRef.current && !isRecognitionRunningRef.current) {
              try {
                recognitionRef.current.start();
                console.log('Recognition restarted after response');
              } catch (err) {
                console.log('Recognition restart error:', err);
              }
            }
          }, 2000);
          return;
        }
      }

      if (lowerQuestion.includes('previous song') || 
          lowerQuestion.includes('previous track') ||
          lowerQuestion.includes('go back')) {
        
        if (musicPlayerRef?.current) {
          musicPlayerRef.current.previous();
          const responseText = 'Playing previous track';
          setResponse(responseText);
          await speak(responseText);
          
          setTimeout(() => {
            console.log('Resetting assistant');
            isActiveRef.current = false;
            fullTranscriptRef.current = '';
            setIsActive(false);
            setTranscript('');
            setResponse('');
            setIsProcessing(false);

            if (recognitionRef.current && !isRecognitionRunningRef.current) {
              try {
                recognitionRef.current.start();
                console.log('Recognition restarted after response');
              } catch (err) {
                console.log('Recognition restart error:', err);
              }
            }
          }, 2000);
          return;
        }
      }

      const apiKey = config.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key not configured');
      }

      console.log('Sending to Gemini API...');
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Get current date and time
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      const requestBody = {
        contents: [{
          parts: [{
            text: `You are a helpful voice assistant. Today's date is ${dateStr} and the current time is ${timeStr}. Give concise, natural spoken responses in 2-3 sentences maximum. Question: ${question}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);

        let errorMessage = 'Failed to get response from Gemini API';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorMessage;
        } catch (e) {
          // Use default error message
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Gemini response:', JSON.stringify(data, null, 2));

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        console.error('No response text in data:', data);
        throw new Error('No response generated from AI');
      }

      console.log('Speaking response:', aiResponse);
      setResponse(aiResponse);
      await speak(aiResponse);

      // Reset after speaking
      setTimeout(() => {
        console.log('Resetting assistant');
        isActiveRef.current = false;
        fullTranscriptRef.current = '';
        setIsActive(false);
        setTranscript('');
        setResponse('');
        setIsProcessing(false);

        // Restart recognition
        if (recognitionRef.current && !isRecognitionRunningRef.current) {
          try {
            recognitionRef.current.start();
            console.log('Recognition restarted after response');
          } catch (err) {
            console.log('Recognition restart error:', err);
          }
        }
      }, 2000);

    } catch (err) {
      console.error('Error processing question:', err);
      console.error('Error stack:', err.stack);

      let errorMsg = 'Sorry, I encountered an error processing your request.';

      if (err.message.includes('API key')) {
        errorMsg = 'Gemini API key is not configured properly.';
      } else if (err.message.includes('API_KEY_INVALID')) {
        errorMsg = 'The Gemini API key is invalid. Please check your configuration.';
      } else if (err.message.includes('quota')) {
        errorMsg = 'API quota exceeded. Please try again later.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMsg = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMsg = `Error: ${err.message}`;
      }

      setError(errorMsg);
      await speak(errorMsg);

      setTimeout(() => {
        isActiveRef.current = false;
        fullTranscriptRef.current = '';
        setIsActive(false);
        setTranscript('');
        setError('');
        setIsProcessing(false);

        // Restart recognition
        if (recognitionRef.current && !isRecognitionRunningRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.log('Recognition restart error:', err);
          }
        }
      }, 3000);
    }
  }, [speak]);

  const handleManualActivation = useCallback(() => {
    if (!isActiveRef.current) {
      console.log('Manual activation triggered');
      isActiveRef.current = true;
      fullTranscriptRef.current = '';
      questionStartTimeRef.current = Date.now();
      setIsActive(true);
      setIsListening(true);
      setTranscript('');
      speak('Yes, I\'m listening');

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(() => {
        console.log('Listening timeout - deactivating');
        isActiveRef.current = false;
        fullTranscriptRef.current = '';
        setIsActive(false);
        setIsListening(false);
        setTranscript('');
      }, 20000);
    }
  }, [speak]);

  // Request microphone permission on mount
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop immediately after getting permission
        setMicPermission('granted');
        console.log('Microphone permission granted');
      } catch (err) {
        console.error('Microphone permission denied:', err);
        setMicPermission('denied');
        setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
      }
    };

    requestMicPermission();
  }, []);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (micPermission !== 'granted') {
      console.log('Waiting for microphone permission...');
      return;
    }

    console.log('Initializing speech recognition...');

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started - say "hey" to activate');
      isRecognitionRunningRef.current = true;
    };

    recognition.onresult = (event) => {
      // Build full transcript from all results
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }
      fullTranscript = fullTranscript.toLowerCase().trim();

      const current = event.resultIndex;
      const currentTranscript = event.results[current][0].transcript.toLowerCase().trim();
      const isFinal = event.results[current].isFinal;

      console.log('Current:', currentTranscript, 'isFinal:', isFinal, 'isActive:', isActiveRef.current);
      console.log('Full transcript so far:', fullTranscript);

      // Wake word detection - check for "hey" (both interim and final results)
      if (!isActiveRef.current && fullTranscript.includes('hey')) {
        console.log('Wake word detected! Activating...');
        isActiveRef.current = true;
        fullTranscriptRef.current = '';
        questionStartTimeRef.current = Date.now();
        setIsActive(true);
        setIsListening(true);
        setTranscript('');
        speak('Yes, I\'m listening');

        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Set timeout for listening window (20 seconds for better UX)
        silenceTimerRef.current = setTimeout(() => {
          console.log('Listening timeout - deactivating');
          isActiveRef.current = false;
          fullTranscriptRef.current = '';
          setIsActive(false);
          setIsListening(false);
          setTranscript('');
        }, 20000);
        return;
      }

      // If active, accumulate the question
      if (isActiveRef.current) {
        // Only consider speech after activation
        const timeSinceActivation = Date.now() - questionStartTimeRef.current;

        // Ignore speech in the first 2 seconds (to skip "Yes I'm listening" and wake word echo)
        if (timeSinceActivation < 2000) {
          console.log('Ignoring speech during assistant response');
          return;
        }

        // Remove "hey" from the beginning if it's still there
        let cleanTranscript = fullTranscript.replace(/^hey\s*/i, '').trim();

        // Update the accumulated transcript
        fullTranscriptRef.current = cleanTranscript;

        // Show interim results
        if (!isFinal && cleanTranscript.length > 0) {
          setTranscript(cleanTranscript + '...');
          console.log('Interim transcript:', cleanTranscript);
        }

        // Process when we get final results and have meaningful input
        if (isFinal && cleanTranscript.length > 3) {
          console.log('Final question detected:', cleanTranscript);
          setTranscript(cleanTranscript);

          // Clear silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Stop recognition temporarily while processing
          if (recognitionRef.current && isRecognitionRunningRef.current) {
            try {
              recognitionRef.current.stop();
              isRecognitionRunningRef.current = false;
            } catch (err) {
              console.log('Error stopping recognition:', err);
            }
          }

          // Process the question
          setTimeout(() => {
            handleQuestion(cleanTranscript);
          }, 500);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please enable microphone permissions.');
      }
    };

    recognition.onend = () => {
      console.log('Recognition ended. isProcessing:', isProcessing);
      isRecognitionRunningRef.current = false;
      // Automatically restart if not processing
      if (!isProcessing) {
        setTimeout(() => {
          if (recognitionRef.current && !isRecognitionRunningRef.current) {
            try {
              recognitionRef.current.start();
              console.log('Recognition restarted');
            } catch (err) {
              console.log('Error restarting recognition:', err);
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    // Start recognition
    try {
      recognition.start();
      isRecognitionRunningRef.current = true;
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }

    // Cleanup
    const synth = synthRef.current;
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        isRecognitionRunningRef.current = false;
        recognitionRef.current.stop();
      }
      if (synth) {
        synth.cancel();
      }
    };
  }, [isActive, isProcessing, micPermission, handleQuestion, speak]);

  // Helper to determine orb state class
  const getOrbClass = () => {
    if (isSpeaking) return 'speaking';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  return (
    <div className={`voice-assistant ${isActive ? 'active' : ''}`}>
      <div className="voice-assistant-container">

        {/* Text Container (Above Orb) */}
        <div className="text-container">
          {/* User Transcript */}
          <div className={`fade-text user-transcript ${transcript ? 'visible' : ''}`}>
            {transcript}
          </div>

          {/* AI Response */}
          <div className={`fade-text ai-response ${response ? 'visible' : ''}`}>
            {response}
          </div>

          {/* Error Message */}
          <div className={`fade-text error-message ${error ? 'visible' : ''}`} style={{ background: 'rgba(220, 38, 38, 0.8)' }}>
            {error}
          </div>
        </div>

        {/* Siri-like Orb */}
        <div
          className={`siri-orb ${getOrbClass()}`}
          onClick={handleManualActivation}
          title={isActive ? "Listening..." : "Click to activate"}
        />

      </div>
    </div>
  );
};

export default VoiceAssistant;
