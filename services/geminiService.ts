
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

export const fetchEnergySavingTip = async (): Promise<string> => {
  if (!API_KEY) {
    console.warn("API_KEY for Gemini is not set. Returning default tip.");
    return "Consider unplugging electronics when not in use to save energy. (API Key not configured)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: "Provide a short, practical energy-saving tip related to home appliances, suitable for a general audience. Keep it under 150 characters.",
    });
    
    const tip = response.text;
    if (tip) {
      return tip.trim();
    }
    return "Could not retrieve a tip at this moment. Try adjusting your appliance usage based on current energy demand.";
  } catch (error) {
    console.error("Error fetching energy saving tip from Gemini:", error);
    // It's possible error is not an Error instance, so check before accessing message
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Failed to fetch tip: ${errorMessage}. Try using appliances during off-peak hours.`;
  }
};
    