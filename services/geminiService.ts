
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generatePlaylistFromPrompt = async (prompt: string, songs: Song[]): Promise<string[]> => {
    if (!API_KEY) {
        throw new Error("API key is not configured for Gemini service.");
    }

    const songListForPrompt = songs.map(s => `id: ${s.id}, title: ${s.title}, artist: ${s.artist}`).join('\n');
    
    const fullPrompt = `
        You are a music expert and playlist curator.
        Based on the user's request: "${prompt}", create a playlist of 5 to 8 songs from the following list.
        Only use songs from the provided list.
        Respond with ONLY a JSON array of the song IDs.
        
        Available Songs:
        ${songListForPrompt}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: "The ID of a song from the provided list.",
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const songIds = JSON.parse(jsonText);

        if (Array.isArray(songIds) && songIds.every(id => typeof id === 'string')) {
            return songIds;
        } else {
            throw new Error("Invalid format received from Gemini API.");
        }

    } catch (error) {
        console.error("Error generating playlist with Gemini:", error);
        throw new Error("Failed to create AI playlist. Please try again.");
    }
};
