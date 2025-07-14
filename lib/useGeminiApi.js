import { useState, useCallback } from 'react';
import { Alert } from 'react-native'; 


const useGeminiApi = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const generateContent = useCallback(async (prompt, chatHistory = []) => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }

    setLoading(true);
    setResponse(null); 
    setError(null);

    try {
      const currentChatHistory = [...chatHistory, { role: 'user', parts: [{ text: prompt }] }];

      const payload = {
        contents: currentChatHistory,
      };

      const apiKey = 'AIzaSyCE-b8i85hZ-ZPUaS0ZR3hFIzDFHIrDvgg';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await apiResponse.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setResponse(text);
      } else {
        console.error('Unexpected API response structure:', result);
        setError('Failed to get a valid response from AI. Please try again.');
      }
    } catch (err) {
      console.error('Error calling Gemini API:', err);
      setError(`An error occurred: ${err.message || 'Please check your network connection.'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return { response, loading, error, generateContent };
};

export default useGeminiApi;
