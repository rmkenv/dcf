import { GoogleGenAI, Type } from "@google/genai";
import { PermitData } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Guidelines: Always use the named parameter and process.env.API_KEY directly
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzePermitText(text: string): Promise<PermitData | null> {
    if (!process.env.API_KEY) return null;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract structured permit data for an emergency generator from this text: "${text}"`,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isEmergencyGenerator: { type: Type.BOOLEAN },
              id: { type: Type.STRING },
              facility: { type: Type.STRING },
              location: { type: Type.STRING },
              size: { type: Type.STRING },
              fuel: { type: Type.STRING },
              issueDate: { type: Type.STRING },
              agency: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["isEmergencyGenerator", "id", "facility"]
          }
        }
      });

      const result = JSON.parse(response.text);
      return result as PermitData;
    } catch (error) {
      console.error("Gemini Extraction Error:", error);
      return null;
    }
  }

  async searchLivePermits(states: string[], dateRange: string): Promise<PermitData[]> {
    if (!process.env.API_KEY) return [];

    try {
      const stateList = states.length === 50 ? "all 50 US states" : states.join(", ");
      // Using Flash for speed and setting thinkingBudget to 0 for low latency
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `List 5 real emergency generator permits issued in ${stateList} during ${dateRange}. Format as a JSON array.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                facility: { type: Type.STRING },
                location: { type: Type.STRING },
                size: { type: Type.STRING },
                fuel: { type: Type.STRING },
                issueDate: { type: Type.STRING },
                agency: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["id", "facility", "issueDate"]
            }
          }
        }
      });

      const text = response.text.trim();
      const jsonMatch = text.match(/\[.*\]/s);
      let data: PermitData[] = [];
      
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]) as PermitData[];
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks && groundingChunks.length > 0 && data.length > 0) {
        data = data.map((item, index) => {
          const chunk = groundingChunks[index % groundingChunks.length];
          if (chunk?.web?.uri) {
            return { ...item, sourceUrl: chunk.web.uri };
          }
          return item;
        });
      }

      return data;
    } catch (error) {
      console.error("Live Search Error:", error);
      return [];
    }
  }
}
