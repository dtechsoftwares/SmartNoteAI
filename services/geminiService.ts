import { GoogleGenAI, Type } from "@google/genai";
import { Note, QuizQuestion, TocItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Model configuration for high intelligence tasks
const SMART_MODEL = 'gemini-2.5-flash';

export const generateTableOfContents = async (notes: Note[]): Promise<TocItem[]> => {
  if (!notes.length) return [];

  // Prepare context for the AI
  const notesContext = notes.map(n => `ID: ${n.id}\nTitle: ${n.title}\nContent: ${n.content.substring(0, 500)}...`).join('\n\n---\n\n');

  const prompt = `
    Analyze the following notes and organize them into a logical Table of Contents (ToC).
    Group related notes into Topics.
    Return the result as a JSON array where each item represents a Topic.
    
    Notes Data:
    ${notesContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING, description: "The name of the topic or category" },
              description: { type: Type.STRING, description: "A brief description of what this section covers" },
              noteIds: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "The exact IDs of the notes that fall under this topic"
              }
            },
            required: ["topic", "description", "noteIds"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as TocItem[];
    }
    return [];
  } catch (error) {
    console.error("Error generating ToC:", error);
    throw error;
  }
};

export const generateQuizFromNotes = async (notes: Note[]): Promise<QuizQuestion[]> => {
  if (!notes.length) return [];

  const notesContext = notes.map(n => `${n.title}: ${n.content}`).join('\n\n');

  const prompt = `
    Create a challenging multiple-choice quiz based on the content of these notes.
    Generate 5 questions.
    Ensure the questions test understanding of the core concepts found in the text.
    
    Content:
    ${notesContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 4 possible answers"
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "The index (0-3) of the correct option" 
              },
              explanation: { type: Type.STRING, description: "Brief explanation why the answer is correct" }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating Quiz:", error);
    throw error;
  }
};

export const autoTitleNote = async (content: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: SMART_MODEL,
            contents: `Generate a short, concise, and descriptive title (max 6 words) for this note content. Do not use quotes. Content: ${content.substring(0, 1000)}`,
        });
        return response.text?.trim() || "Untitled Note";
    } catch (e) {
        return "New Note";
    }
}
