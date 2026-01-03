
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

export const identifyRecyclable = async (base64Image: string): Promise<GeminiResponse> => {
  // Use Vite's import.meta.env to access VITE_GEMINI_API_KEY
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "REPLACE_ME" || apiKey.trim() === "") {
    console.error("CRITICAL: VITE_GEMINI_API_KEY is missing or not set in .env.local");
    throw new Error("API configuration missing. Ensure .env.local contains VITE_GEMINI_API_KEY with your Gemini API key.");
  }

  // Robust check for missing or placeholder keys often found in local environments
  if (!apiKey || apiKey === "undefined" || apiKey === "your_api_key_here" || apiKey === "REPLACE_ME" || apiKey.trim() === "") {
    console.error("CRITICAL: Gemini API key is missing. Checked VITE_GEMINI_API_KEY, GEMINI_API_KEY, and API_KEY.");
    throw new Error("API configuration missing. If running locally, ensure your .env file is loaded and contains VITE_GEMINI_API_KEY. If on Vercel, check your Environment Variables dashboard.");
  }

  // Create a new instance for every call to ensure we use the freshest environment state
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  try {
    const result = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Evaluate this image for a smart recycling vending machine. Identify the object, its material category (PLASTIC, GLASS, METAL, PAPER, ELECTRONICS, or UNKNOWN), and calculate a reward value (1-50 coins). Return only valid JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            estimatedValue: { type: Type.INTEGER },
            recyclabilityScore: { type: Type.INTEGER }
          },
          required: ["itemName", "category", "confidence", "estimatedValue", "recyclabilityScore"]
        }
      }
    });

    const text = result.text;
    if (!text) {
      throw new Error("The AI returned a blank response. Try a different angle.");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Detailed Gemini API Error:", error);
    
    // Catch-all for API Key issues returned from Google's servers
    if (error.message?.toLowerCase().includes("api key") || error.status === "INVALID_ARGUMENT") {
      throw new Error("The API key is either invalid or was not transmitted correctly. Please check your project settings.");
    }

    throw new Error(error.message || "The AI system is currently unavailable.");
  }
};
