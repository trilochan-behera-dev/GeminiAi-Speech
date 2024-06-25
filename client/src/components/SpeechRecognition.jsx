// components/SpeechRecognition.js
import React, { useState, useEffect } from 'react';

const SpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isJarvisActive, setIsJarvisActive] = useState(false);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const recognizeSpeech = async (transcript) => {
    setIsApiCallInProgress(true);
    try {
      const apiUrl = `${process.env.API_URL}/api/recognize`; // Replace with your server URL
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error('Failed to send transcript');
      }

      const data = await response.json();
      setApiResponse(data.message);
      speakText(data.message); // Speak the API response
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      console.log('Speech synthesis finished');
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };
    window.speechSynthesis.speak(utterance);
  };


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Received transcript:', transcript);

      if (transcript.includes('hey jarvis')) {
        setIsJarvisActive(true);
        setLastCommand('');
        console.log('Jarvis activated');
      } else if (isJarvisActive) {
        if (transcript.includes('bye jarvis')) {
          setApiResponse("Thank you boss. i am signing out.");
        setLastCommand('');

          setIsJarvisActive(false);
          setIsListening(false);
          recognition.stop();
          console.log('Jarvis deactivated');
        } else if (!isApiCallInProgress) {
          setLastCommand(transcript);
          recognizeSpeech(transcript);
        } else {
          setLastCommand('Please wait for the current response.');
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition:', event.error);
    };

    recognition.start(); // Start recognition when the component mounts

    return () => {
      recognition.stop(); // Stop recognition when the component unmounts
    };
  }, [isJarvisActive, isListening, isApiCallInProgress]);

  return (
    <div className="px-8 lg:flex gap-4 bg-black min-h-screen w-full">
      <div className="flex justify-center items-center">
        <img src="./jarvis.gif" alt="Jarvis" className="h-1/2 w-full" />
      </div>
      <div className="max-w-4xl w-[75%] break-words py-20">
        <p className="text-yellow-300 text-md">
          {isListening && !isJarvisActive
            ? "Say 'Hey Jarvis' to start"
            : isJarvisActive
            ? "Jarvis is listening..."
            : lastCommand}
        </p>
       { lastCommand && <p className='text-yellow-400 text-lg pr-2'>You : <span className='text-white text-md'>  {lastCommand} </span></p>}
  
        <pre className="text-white">
          {isApiCallInProgress
            ? "Processing your request..."
            : apiResponse && <div className='flex gap-2'>
              <p className='text-yellow-400 text-lg'>Jarvis:</p>
              <textarea value={apiResponse} id="" cols="100" rows="30" className='bg-black border-none outline-none text-md'/>
            </div>
              }
        </pre>
      </div>
    </div>
  );
};

export default SpeechRecognition;
