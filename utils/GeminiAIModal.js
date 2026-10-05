"use server";
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Function to generate content using the simplified API
export const generateContent = async (inputText) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: inputText,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

// Function to generate content with streaming
export const generateContentStream = async (inputText) => {
  try {
    const response = await ai.models.generateContentStream({
      model: 'gemma-4-26b-a4b-it',
      contents: inputText,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    return fullResponse;
  } catch (error) {
    console.error("Error generating content with streaming:", error);
    throw error;
  }
};

// Removed Legacy chat session because use server requires only async functions
  
    
  
  