
import { GoogleGenAI, Type } from "@google/genai";
import { Note, QuizQuestion, TocItem, RewriteMode, SummaryType, Task, MindMapNode, Flashcard } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Model configuration
const SMART_MODEL = 'gemini-2.5-flash';

export const generateTableOfContents = async (notes: Note[]): Promise<TocItem[]> => {
  if (!notes.length) return [];

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
              topic: { type: Type.STRING },
              description: { type: Type.STRING },
              noteIds: { type: Type.ARRAY, items: { type: Type.STRING } }
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
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
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

export const generateFlashcards = async (content: string): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: `Create 5 study flashcards from this content. Front is the concept/question, Back is the definition/answer. Return JSON. Content: ${content.substring(0, 5000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING }
            },
            required: ["front", "back"]
          }
        }
      }
    });
    
    if (response.text) {
      const raw = JSON.parse(response.text);
      return raw.map((c: any) => ({ ...c, id: crypto.randomUUID(), mastered: false }));
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const generateMindMap = async (content: string): Promise<MindMapNode | null> => {
    try {
        const response = await ai.models.generateContent({
            model: SMART_MODEL,
            contents: `Create a hierarchical mind map structure from this text. The root node should be the main topic. Return JSON. Content: ${content.substring(0, 5000)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        children: { 
                            type: Type.ARRAY, 
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    label: { type: Type.STRING },
                                    children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, label: {type: Type.STRING} } }}
                                },
                                required: ["id", "label"]
                            } 
                        }
                    },
                    required: ["id", "label", "children"]
                }
            }
        });
        if (response.text) return JSON.parse(response.text);
        return null;
    } catch (e) {
        return null;
    }
};

export const translateText = async (content: string, language: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: SMART_MODEL,
            contents: `Translate the following text into ${language}. Maintain formatting and tone. Text: ${content}`
        });
        return response.text || content;
    } catch (e) {
        return content;
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
};

export const generateInsight = async (notes: Note[]): Promise<string> => {
  if (notes.length === 0) return "Start taking notes to get AI insights!";
  
  const subset = notes.slice(0, 5).map(n => n.content.substring(0, 200)).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: `Based on these user notes fragments, generate a single, short, motivating insight or a connection between ideas. Max 1 sentence. Notes: ${subset}`,
    });
    return response.text?.trim() || "Keep writing to unlock your creativity.";
  } catch (e) {
    return "Your ideas are coming together.";
  }
};

export const autoFormatNote = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: `Format the following text using clean Markdown. Use headers, bullets, and bold text. Fix grammar. Content: ${content}`,
    });
    return response.text || content;
  } catch (e) {
    return content;
  }
};

export const processMultimodal = async (
  type: 'audio' | 'image' | 'pdf' | 'drawing',
  base64Data: string,
  mimeType: string
): Promise<string> => {
  try {
    let prompt = "";
    if (type === 'audio') prompt = "Transcribe this audio. Identify speakers. Provide a summary and action items. Markdown format.";
    else if (type === 'image') prompt = "Extract text (OCR) and summarize the image content. Markdown format.";
    else if (type === 'drawing') prompt = "Analyze this handwriting/diagram. Convert text to digital text and describe diagrams. Markdown format.";
    else if (type === 'pdf') prompt = "Analyze document. 1. Summary 2. Key Points 3. Study Guide. Markdown format.";

    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return `Error processing ${type}.`;
  }
};

// --- NEW AI FEATURES ---

export const chatWithNotes = async (query: string, notes: Note[]): Promise<string> => {
  try {
    const context = notes.map(n => `[${n.title}]: ${n.content}`).join('\n\n');
    const prompt = `
      You are an intelligent assistant for the user's personal notes.
      Answer the user's question based ONLY on the provided note context. 
      If the answer is not in the notes, use your general knowledge but mention that it's not in the notes.
      
      User Notes Context:
      ${context.substring(0, 20000)} 
      
      User Question: ${query}
    `;

    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: prompt,
    });
    return response.text || "I couldn't generate a response.";
  } catch (e) {
    return "AI Service is temporarily unavailable.";
  }
};

export const smartSummarize = async (content: string, type: SummaryType): Promise<string> => {
  let prompt = "";
  switch (type) {
    case SummaryType.ONE_SENTENCE: prompt = "Summarize this text in exactly one compelling sentence."; break;
    case SummaryType.SHORT: prompt = "Provide a short, concise summary of this text."; break;
    case SummaryType.DETAILED: prompt = "Provide a detailed summary of this text, capturing all nuances."; break;
    case SummaryType.ACTION_POINTS: prompt = "Extract a bulleted list of actionable points, tasks, and key takeaways."; break;
  }

  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: `${prompt}\n\nText:\n${content}`,
    });
    return response.text || content;
  } catch (e) {
    return "Summary failed.";
  }
};

export const smartRewrite = async (content: string, mode: RewriteMode): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: `Rewrite the following text to be ${mode}. Keep the original meaning but change the tone and style.\n\nText:\n${content}`,
    });
    return response.text || content;
  } catch (e) {
    return content;
  }
};

export const extractTasksFromNote = async (content: string): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: `
        Extract all tasks, to-dos, and action items from this text.
        If a deadline or date is mentioned, try to convert it to a timestamp (milliseconds).
        Assign priority (high, medium, low) based on urgency.
        Return a JSON array.
        
        Text: ${content}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING, description: "The task description" },
              dueDate: { type: Type.NUMBER, description: "Timestamp in ms, or null if not found" },
              priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
            },
            required: ["content"]
          }
        }
      }
    });
    
    if (response.text) {
      const rawTasks = JSON.parse(response.text);
      return rawTasks.map((t: any) => ({
        id: crypto.randomUUID(),
        content: t.content,
        dueDate: t.dueDate,
        priority: t.priority || 'medium',
        isCompleted: false
      }));
    }
    return [];
  } catch (e) {
    console.error("Task extraction failed", e);
    return [];
  }
};

export const autoTagNote = async (content: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: `Generate 3-5 relevant, single-word tags for this content. Return JSON string array. Content: ${content.substring(0, 500)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    if (response.text) {
        return JSON.parse(response.text);
    }
    return [];
  } catch (e) {
    return [];
  }
};
