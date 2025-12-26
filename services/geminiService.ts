
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const identifyRecyclable = async (base64Image: string): Promise<GeminiResponse> => {
  const model = 'gemini-3-flash-preview';
  
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
          text: "Identify this object for recycling. Determine its name, category (PLASTIC, GLASS, METAL, PAPER, ELECTRONICS, or UNKNOWN), confidence score (0-1), and estimated token/coin value (1-50) based on size and material. Also provide a recyclability score (0-100). Respond strictly in JSON format."
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

  return JSON.parse(response.text);
};
