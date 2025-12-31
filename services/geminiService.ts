
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

export const identifyRecyclable = async (base64Image: string): Promise<GeminiResponse> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API Key is missing. Please set the API_KEY environment variable in your Vercel settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
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
            text: "Analyze this image for recycling. Identify the item name, its material category (PLASTIC, GLASS, METAL, PAPER, ELECTRONICS, or UNKNOWN), a confidence score (0-1), a recyclability score (0-100), and an estimated token value (1-50). Return ONLY JSON."
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
      throw new Error("The AI was unable to identify anything in this image. Try getting closer or improving the light.");
    }

    const parsed = JSON.parse(text);
    
    // Fallback for very low confidence
    if (parsed.confidence < 0.1) {
       throw new Error("The image is too blurry or dark for the AI to be certain. Please try again with better lighting.");
    }

    return parsed;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("403")) {
      throw new Error("The API Key provided is invalid or has expired.");
    }
    
    if (error.message?.includes("429")) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }

    throw new Error(error.message || "The AI encountered an error while processing the image.");
  }
};
