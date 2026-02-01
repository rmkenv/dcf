
import { GoogleGenAI, Type } from "@google/genai";
import * as fs from 'fs';

async function runMonthlySync() {
  // Check for API key presence
  if (!process.env.API_KEY) {
    console.error("Missing API_KEY environment variable");
    // Use type assertion to resolve TypeScript 'exit' property error
    (process as any).exit(1);
  }

  // Always use the named parameter and process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  console.log("Starting Automated Monthly Sync...");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Search for all official emergency generator air quality and construction permits issued in the United States in the last 30 days. Provide a comprehensive list of at least 20 real records from various states. Focus on high-capacity installations.",
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            syncTimestamp: { type: Type.STRING },
            permits: {
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
                  description: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING }
                },
                required: ["id", "facility", "issueDate"]
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    data.syncTimestamp = new Date().toISOString();

    // Extract grounding URLs and assign to permits if not already present
    // Mandatory requirement: When using Google Search grounding, URLs must be extracted from groundingChunks.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0 && data.permits && data.permits.length > 0) {
      data.permits = data.permits.map((permit: any, index: number) => {
        // If the model didn't provide a sourceUrl in the JSON, we fill it from the grounding chunks
        if (!permit.sourceUrl) {
          const chunk = groundingChunks[index % groundingChunks.length];
          if (chunk?.web?.uri) {
            return { ...permit, sourceUrl: chunk.web.uri };
          }
        }
        return permit;
      });
    }

    fs.writeFileSync('latest_permits.json', JSON.stringify(data, null, 2));
    console.log(`Successfully synced ${data.permits?.length || 0} permits.`);
  } catch (error) {
    console.error("Sync Failed:", error);
    // Use type assertion to resolve TypeScript 'exit' property error
    (process as any).exit(1);
  }
}

runMonthlySync();
