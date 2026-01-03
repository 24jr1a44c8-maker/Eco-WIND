
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

export const identifyRecyclable = async (base64Image: string): Promise<GeminiResponse> => {
  // Accessing the key strictly as per requirements
  const apiKey = process.env.API_KEY;
  
  // Robust check for missing or 'mocked' keys often found in local environments
  if (!apiKey || apiKey === "undefined" || apiKey === "your_api_key_here" || apiKey.trim() === "") {
    console.error("CRITICAL: API_KEY is missing from the environment (process.env.API_KEY).");
    throw new Error("API configuration missing. If running locally, ensure your .env file is loaded. If on Vercel, check your Environment Variables dashboard.");
  }

  // Always initialize a new instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this image for a smart recycling vending machine. Identify the item, its material category (PLASTIC, GLASS, METAL, PAPER, ELECTRONICS, or UNKNOWN), and a recycling reward value between 1-50 coins. Return strictly JSON."
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

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response. Try again with a clearer image.");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Request Failed:", error);
    
    // Check for common API key errors
    if (error.message?.includes("API key not found") || error.status === "INVALID_ARGUMENT") {
      throw new Error("Authentication failed: The provided API Key is invalid or not found.");
    }
    
    throw new Error(error.message || "An unexpected error occurred during AI analysis.");
  }
};
